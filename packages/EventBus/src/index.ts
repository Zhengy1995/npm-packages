type handlerT = (...args: any[]) => any

class EventBus {

    private eventHandlers = new Map<string, Set<handlerT>>()
    private onceHandlers = new Map<string, Set<handlerT>>()

    public on(evt: string, handler: handlerT) {
        this.eventHandlers.has(evt) ? this.eventHandlers.get(evt)!.add(handler) : this.eventHandlers.set(evt, new Set([handler]))
    }

    public off(evt: string, handler?: handlerT) {
        !handler ? this.eventHandlers.delete(evt) : this.eventHandlers.get(evt)?.delete(handler)
        !handler ? this.onceHandlers.delete(evt) : this.onceHandlers.get(evt)?.delete(handler)
    }

    public once(evt: string, handler: handlerT) {
        this.onceHandlers.has(evt) ? this.onceHandlers.get(evt)!.add(handler) : this.onceHandlers.set(evt, new Set([handler]))
    }

    public emit(evt: string, ...args: any[]) {
        this.eventHandlers.get(evt)?.forEach(handler => handler(...args))
        this.onceHandlers.get(evt)?.forEach(handler => handler(...args))
        this.onceHandlers.delete(evt)
    }
}

export default EventBus
