import { useCallback, useEffect, useRef } from "react"

export const useBeforeFirstMount = (handler: () => void) => {
    const hasExcute = useRef(false)
    if(!hasExcute.current) {
        hasExcute.current = true
        handler()
    }
}

export const useAfterFirstMount = (handler: () => void | (() => void)) => {
    const hasMount = useRef(false)
    const destroyHandler = useRef<void | (() => void)>()
    useEffect(() => {
        if(!hasMount.current) destroyHandler.current = handler()
        hasMount.current = true
        return destroyHandler.current
    }, [])
}

export const useEvent = <T extends Function>(handler: T) => {
    if(typeof handler !== 'function') throw new Error('paramter must be a function')
    const fn = useRef(handler)
    fn.current = handler
    return (useCallback((...args: any[]) => {
        return fn.current(...args)
    }, []) as any) as T
}