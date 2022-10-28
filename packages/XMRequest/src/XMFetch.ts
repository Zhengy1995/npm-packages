import Times from './Times'
import XMRequestPromise from './XMRequestPromise'
import XMRequestPluginSets from './plugin'

interface ICustomizePromise<P> {
  new (...args: ConstructorParameters<PromiseConstructor>): P
}

const customizeFlatPromise = <T, P extends Promise<T>>(C: ICustomizePromise<P>) => {
  const temp: [P, (value: T | PromiseLike<T>) => void, (reason?: any) => void] = [] as any
  const promise = new C((resolve, reject) => {
    temp[1] = resolve
    temp[2] = reject
  })
  temp[0] = promise
  return temp
}

export type requestType = 'GET' | 'POST' | 'HEAD' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

const throwReqOrResError = (url: string, type: requestType, reason: any, request = true) => {
  console.error(`${type} ${request ? 'request' : 'response'} fail, url: ${url}, reason: ${reason}`)
}

class XMFetch<T> {
  public url: string
  public param?: RequestInit
  private timeout: number
  private reconnectTimes: number
  private times = new Times()
  private promise!: XMRequestPromise<T>
  private resolve!: (value: T | PromiseLike<T>) => void
  private reject!: (reason?: any) => void

  static beforeRequest = (url: string, param?: RequestInit) => Promise.resolve(true)
  static onInterceptor = (url: string, param?: RequestInit) => {}
  static onError = (res: any, response: void | Response, c: XMFetch<any>) => {}
  static unifiedRequestInit = (url: string) => ({} as RequestInit)
  static afterRequest = (res: void | Response, c: XMFetch<any>) => Promise.resolve(res)

  private reconnect() {
    this.promise.controller.abort()
    this.times.times < this.reconnectTimes
      ? this.fetch()
      : console.error(`The request ${this.url} reconnect times more than ${this.reconnectTimes} times`)
  }

  private reset() {
    this.times = new Times()
  }

  constructor(url: string, param?: RequestInit, timeout = 5000, reconnectTimes = 5) {
    this.url = url
    this.param = param
    this.timeout = timeout
    this.reconnectTimes = reconnectTimes
    this.reconnect = this.reconnect.bind(this)
    this.fetch()
  }

  private async fetch() {
    if (!this.promise) {
      const [promise, resolve, reject] = customizeFlatPromise<T, XMRequestPromise<T>>(XMRequestPromise as any)
      this.promise = promise
      this.resolve = resolve
      this.reject = reject
    }
    if (this.times.times === 1 && !(await XMFetch.beforeRequest(this.url, this.param))) {
      this.reject('This request is intercepted before request')
      this.promise.emitInterceptor()
      XMFetch.onInterceptor(this.url, this.param)
    } else {
      // 设置重连
      const timeId = setTimeout(this.reconnect, this.timeout)
      this.promise.resetController()
      // 发起请求
      fetch(
        this.url,
        Object.assign<RequestInit, RequestInit | undefined, RequestInit>(
          XMFetch.unifiedRequestInit(this.url),
          this.param,
          {
            signal: this.promise.controller.signal,
          },
        ),
      ) // 异常捕获处理
        .catch(e => {
          if (e.name === 'AbortError') {
            this.times.addTimes()
            console.warn(`request timeout, url: ${this.url}, try to reconnect ${this.times.times} times`)
          } else {
            console.warn('fetch error', e)

            clearTimeout(timeId)
            this.reset()
            throwReqOrResError(this.url, (this.param?.method as requestType) ?? 'GET', e)
            this.reject(`${e}`)
          }
        }) // 接收返回值并处理
        .then(async res => {
          clearTimeout(timeId)
          if (res && (res.status < 200 || res.status >= 400)) {
            const result = await res.json()
            throwReqOrResError(this.url, (this.param?.method as requestType) ?? 'GET', result, false)
            XMFetch.onError(result, res, this)
            this.reject(result)
            throw new Error(JSON.stringify(result))
          }
          res = (await XMFetch.afterRequest(res, this)) ?? res

          const headers = this.param?.headers
          const isBlob = headers && 'Accept' in headers && headers['Accept'] === 'application/octet-stream'
          const promise = isBlob ? res?.blob() : res?.json()
          promise!
            .then(res => {
              this.reset()
              this.resolve(XMRequestPluginSets.emitResultHandler(res))
            })
            .catch(e => {
              this.reset()
              throwReqOrResError(this.url, (this.param?.method as requestType) ?? 'GET', e, false)
              XMFetch.onError(e, res, this)
              this.reject(res)
            })
        })
    }
  }

  public get result() {
    return this.promise
  }

  public set result(p) {
    throw new Error('fetch result cannot be set by hand')
  }

  public reFetch() {
    return new XMFetch<T>(this.url, this.param, this.timeout, this.reconnectTimes).result
  }
}

export default XMFetch
