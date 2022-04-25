class XMRequestPromise<T> extends Promise<T> {
  private interceptorHandler = () => {}
  private abortController = new AbortController()

  public get controller() {
    return this.abortController
  }

  public cancel() {
    this.controller.abort()
    return this
  }

  public resetController() {
    this.abortController = new AbortController()
  }

  public interceptor(hanlder: () => void) {
    this.interceptorHandler = hanlder
    return this
  }

  public emitInterceptor() {
    this.interceptorHandler()
    return this
  }
}

export default XMRequestPromise
