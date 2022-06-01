## Usage

### install

```
yarn add @ronin-react/react-keep-alive
```

### import component

```tsx
import {useState} from 'react'
import {KeepScope, KeepAlive} from '@ronin-react/react-keep-alive'

const ids = [Math.random().toString(36).slice(2), Math.random().toString(36).slice(2)]

const MyComponent = () => {
	const [num, setNum] = useState(0)
	return <>
		<button onClick={() => setNum(num === 0 ? 1 : 0)}>
		 click to varify
		</button>
		{num === 0 && <KeepAlive id={ids[0]}>
		  <div>{Math.random()}</div>
		 </KeepAlive>}
		 {num === 1 && <KeepAlive id={ids[1]}>
		  <div>{Math.random()}</div>
		 </KeepAlive>}
		</>
}

const App = () => {
	retutn <KeepScope><MyComponent /></KeepScope>	
}
```

### hook
#### useRefreshModule: (modulename: string) => () => void

```tsx
import {useRefreshModule} from '@ronin-react/react-keep-alive'

const MyComponent = () => {
	const fresh = useRefreshModule('otherModule')
	return <div onClick={fresh}></div>
}
```