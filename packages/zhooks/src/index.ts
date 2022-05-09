import { useCallback, useEffect, useRef } from "react"

export const useBeforeFirstMount = (handler: () => void) => {
    const hasMount = useRef(false)
    if(!hasMount.current) {
        handler()
    }
    useEffect(() => {
        hasMount.current = true
    }, [])
}

export const useAfterFirstMount = (handler: () => void) => {
    const hasMount = useRef(false)
    useEffect(() => {
        if(!hasMount.current) handler()
        hasMount.current = true
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