import {
  Component,
  createContext,
  createRef,
  PropsWithChildren,
  ReactNode,
  RefObject,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import style from './index.module.less'

type KeepAlivePropsT = {
  id: string
  className?: string
}
type contextT = {
  render: (id: string, node: ReactNode) => boolean;
  onRender: (handler: (domRef: RefObject<HTMLDivElement>) => void) => void;
}

const Context = createContext<contextT | null>(null)

const needToRefreshModule = new Set<string>()

export const useRefreshModule = (moduleName: string) => {
  return useCallback(() => {
    needToRefreshModule.add(moduleName)
  }, [moduleName])
}

export const KeepScope = ({children}: PropsWithChildren<unknown>) => {
  const [allChildren, setAllChildren] = useState<Record<string, ReactNode>>({})
  const renderHandlers = useRef<Set<(domRef: RefObject<HTMLDivElement>) => void>>(new Set())
  const divRef = useRef<HTMLDivElement>(null)
  const contextValue = useMemo(
    () => ({
      render: (id: string, node: ReactNode) => {
        const flag =  !allChildren[id] || needToRefreshModule.has(id)
        if (flag) {
          setAllChildren({...allChildren, [id]: node})
        }
        return flag
      },
      onRender(handler: (domRef: RefObject<HTMLDivElement>) => void) {
        renderHandlers.current.add(handler)
      },
    }),
    [allChildren],
  )
  useEffect(() => {
    renderHandlers.current.forEach(h => {
      h(divRef)
      renderHandlers.current.delete(h)
    })
  })
  return (
    <Context.Provider value={contextValue}>
      {children}
      <Suspense fallback={<></>}>
        <div className={style.hide} ref={divRef}>
          {Object.keys(allChildren).map(id => (
            <div id={`cache_${id}`} key={id}>
              {allChildren[id]}
            </div>
          ))}
        </div>
      </Suspense>
    </Context.Provider>
  )
}

// export const KeepAlive = ({children, id, className}: PropsWithChildren<KeepAlivePropsT>) => {
//   const {render, onRender} = useContext(Context)!
//   const div = useRef<HTMLDivElement>(null)
//   useEffect(() => {
//     if (!render(id, children)) {
//       onRender(r => {
//         div.current?.append(...Array.from(r.current?.querySelector(`#cache_${id}`)?.childNodes ?? []))
//       })
//     } else {
//       div.current?.append(...Array.from(document.querySelector(`#cache_${id}`)?.childNodes ?? []))
//     }
//     return () => {
//       document.getElementById(`cache_${id}`)?.append(...Array.from(div.current?.childNodes ?? []))
//     }
//   })
//   return <div ref={div} className={className}></div>
// }

export class KeepAlive extends Component<PropsWithChildren<KeepAlivePropsT>> {
  private divRef = createRef<HTMLDivElement>()
  static contextType = Context

  componentDidMount() {
    const {render, onRender} = this.context as contextT
    if (render(this.props.id, this.props.children)) {
      onRender(r => {
        needToRefreshModule.delete(this.props.id)
        this.divRef.current?.append(...Array.from(r.current?.querySelector(`#cache_${this.props.id}`)?.childNodes ?? []))
      })
    } else {
      this.divRef.current?.append(...Array.from(document.querySelector(`#cache_${this.props.id}`)?.childNodes ?? []))
    }
  }

  componentWillUnmount() {
    document.getElementById(`cache_${this.props.id}`)?.append(...Array.from(this.divRef.current?.childNodes ?? []))
  }

  render() {
    return <div ref={this.divRef} className={this.props.className}></div>
  }
}
