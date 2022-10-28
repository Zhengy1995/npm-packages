import xmPluginSets, {XMRequestPluginT} from './plugin'
import XMFetch from './XMFetch'

export interface IRequestPlugin {
  apply(sets: XMRequestPluginT): void
}

export const onInterceptor = (handler: typeof XMFetch.onInterceptor) => {
  XMFetch.onInterceptor = handler
}

export const onError = (handler: typeof XMFetch.onError) => {
  XMFetch.onError = handler
}

export const setUnifiedRequestInit = (handler: typeof XMFetch.unifiedRequestInit) => {
  XMFetch.unifiedRequestInit = handler
}

export const beforeRequest = (handler: typeof XMFetch.beforeRequest) => {
  XMFetch.beforeRequest = handler
}

export const afterRequest = (handler: typeof XMFetch.afterRequest) => {
  XMFetch.afterRequest = handler
}

export const put = <T, P = any>(url: string, param?: P) => {
  return new XMFetch<T>(url, {
    method: 'PUT',
    body: JSON.stringify(param),
    headers: {
      'Content-Type': 'application/json',
    },
  }).result
}

export const _delete = <T>(url: string) => {
  return new XMFetch<T>(url, {
    method: 'DELETE',
  }).result
}

export const get = <T>(url: string, param?: Record<string, any>) => {
  if (param) {
    url += '?'
    Object.keys(param).forEach((k, i) => {
      url += `${i !== 0 ? '&' : ''}${k}=${param[k]}`
    })
  }
  return new XMFetch<T>(url).result
}

export const post = <T, P = Record<string, any>>(
  url: string,
  param?: P,
  contentType?: 'application/json' | 'text/plain' | 'multipart/form-data' | 'application/x-www-form-urlencoded',
) => {
  return new XMFetch<T>(url, {
    method: 'POST',
    body: JSON.stringify(param),
    headers: {
      'Content-Type': contentType ?? 'application/json',
    },
  }).result
}

export const request = <T>(url: string, param?: RequestInit) => {
  return new XMFetch<T>(url, param).result
}

export const use = (plugin: IRequestPlugin) => {
  plugin.apply(xmPluginSets)
}

class XMRequest {
  static get = get
  static post = post
  static put = put
  static delete = _delete
  static request = request
  static beforeRequest = beforeRequest
  static afterRequest = afterRequest
  static onInterceptor = onInterceptor
  static onError = onError
  static setUnifiedRequestInit = setUnifiedRequestInit
  static use = use
}

export default XMRequest
