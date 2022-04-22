import {
  createContext,
  PropsWithChildren,
  ReactNode,
  RefObject,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import style from './index.module.less'

type KeepAlivePropsT = {
  id: string
}

const Context = createContext<{
  render: (id: string, node: ReactNode) => boolean
  onRender: (handler: (domRef: RefObject<HTMLDivElement>) => void) => void
} | null>(null)

export const KeepScope = ({children}: PropsWithChildren<unknown>) => {
  const [allChildren, setAllChildren] = useState<Record<string, ReactNode>>({})
  const renderHandlers = useRef<Set<(domRef: RefObject<HTMLDivElement>) => void>>(new Set())
  const divRef = useRef<HTMLDivElement>(null)
  const contextValue = useMemo(
    () => ({
      render: (id: string, node: ReactNode) => {
        const flag = !!allChildren[id]
        if (!allChildren[id]) {
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

export const KeepAlive = ({children, id}: PropsWithChildren<KeepAlivePropsT>) => {
  const {render, onRender} = useContext(Context)!
  const div = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!render(id, children)) {
      onRender(r => {
        div.current?.append(...Array.from(r.current?.querySelector(`#cache_${id}`)?.childNodes ?? []))
      })
    } else {
      div.current?.append(...Array.from(document.querySelector(`#cache_${id}`)?.childNodes ?? []))
    }
    return () => {
      document.getElementById(`cache_${id}`)?.append(...Array.from(div.current?.childNodes ?? []))
    }
  })
  return <div ref={div}></div>
}
