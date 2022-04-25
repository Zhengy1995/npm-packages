# XMRequest APIs

## XMRequestPromise

```typescript
abstract class XMRequestPromise<T> extends Promise<T> {
  public abstract cancel(): XMRequestPromise<T>;
  public abstract interceptor(hanlder: () => void): XMRequestPromise<T>;
}
```

## get&lt;T&gt;(url: string): XMRequestPromise&lt;T&gt;

exmaple

```typescript
// index.ts
import {get}, XMRequest from '@ronin-public/request'

get<string>('/name?id=123456').then(res => console.log(res))

// or
XMRequest.get<string>('/name?id=123456').then(res => console.log(res))
```

## post&lt;T, P = Record&lt;string, any&gt;&gt;(url: string, data: P): XMRequestPromise&lt;T&gt;

example

```typescript
// index.ts
import {post}, XMRequest from '@ronin-public/request'

type userT = {
    id: number
}

// default
post<string>('/name', {id: 123456}).then(res => console.log(res))


// or you can customize defaine parameter's type
post<string, userT>('/name', {id: 123456}).then(res => console.log(res))

// or you also can use like that
XMRequest.post<string>('/name', {id: 123456}).then(res => console.log(res))

```

## request&lt;T&gt;(url: string, data?: RequestInit): XMRequestPromise&lt;T&gt;

example

```typescript
// index.ts
import {request}, XMRequest from '@ronin-public/request'

request<string>('/name', {
	method: 'POST',
	body: JSON.stringify({id: 123456})
	headers: {
		'Content-Type': 'application/text'
	}
}).then(res => console.log(res))

// or
XMRequest.request<string>('/name', {
	method: 'POST',
	body: JSON.stringify({id: 123456})
	headers: {
		'Content-Type': 'application/text'
	}
}).then(res => console.log(res))
```

View [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch) to learn how to set `data`

## Cancel request

### request().cancel()

example

```typescript
import { get } from "XMRequest";

const promise = get("/abc");
promise.then((res) => console.log(res));
setTimeout(() => {
  promise.cancel();
}, 2000);
```

## Interceptor before request

### beforeRequest(handler: (url: string, param?: RequestInit) => boolean)

example

```typescript
// index.ts
import {beforeRequest}, XMRequest from '@ronin-public/request'
beforeRequest(url => url.endsWith('/user'))

// or
XMRequest.beforeRequest(url => url.endsWith('/user'))

// test
XMrequest.get('/abc')
.interceptor(() => {
	console.log('request /abc has been intercepted') // output: request /abc has been intercepted
})
.catch(e => {
	console.error(e) // output: This request is intercepted before request
})
```

## Interceptor callback

### Global interceptor

#### onInterceptor(handler: (url: string, param?: RequestInit) => void)

example

```typescript
// index.ts
import {onInterceptor}, XMRequest from '@ronin-public/request'

onInterceptor(url => {
	console.error(`request ${url} has been intercepted`)
})

// or
XMRequest.onInterceptor(url => {
	console.error(`request ${url} has been intercepted`)
})
```

### Single interceptor

#### request().interceptor(handler: () => void)

If you want to fire the interceptor handler, you need to use `beforeRequest` first.

example

```typescript
// intercept.ts
XMRequest.beforeRequest((url) => url.endsWith("/user"));

// index.ts
import XMRequest from "XMRequest";

// catch
// it also can be catched
XMRequest.get("/abc").catch((e) => {
  console.error(e); // output: This request is intercepted before request
});

// get interceptor
XMRequest.get("/abc").interceptor(() => {
  console.log("request has been intercepted"); // output: request has been intercepted
});

// post interceptor
XMRequest.post("/abc").interceptor(() => {
  console.log("request has been intercepted"); // output: request has been intercepted
});

// request interceptor

XMRequest.request("/abc").interceptor(() => {
  console.log("request has been intercepted"); // output: request has been intercepted
});
```

## Unified error handler: onError(handler: (url: string) => void)

The handler have only one, pre one will be covered by next one.
example

```typesceipt
import {onError}, XMRequest from '@ronin-public/request'
onError(url => {
	console.error(`An error occurred  when request {url}`)
})

// or
XMRequest.onError(url => {
	console.error(`An error occurred  when request {url}`)
})
```

## setUnifiedRequestInit(handler: (url: string) => RequestInit)

The handler will be called before a request, you can customize the unified params according to the url, if you set the same field when a request called, the unified config will be covered.
example

```typescript
import {setUnifiedRequestInit}, XMRequest from '@ronin-public/request'

setUnifiedRequestInit(() => {
	return {
		headers: {
			'Content-Type': 'application/text'
		}
	}
})

// the value of headers's 'Content-Type' is 'application/text'
XMRequest.get('/abc')

// the 'Content-Type' will be used 'application/json' as its value
XMRequest.request('/abc', { headers: { 'Content-Type': 'application/json' } })
```
