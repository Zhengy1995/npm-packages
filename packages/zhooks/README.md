### List

## useBeforeFirstMount

useage

```tsx
import {useBeforeFirstMount} from '@ronin-react/zhooks'

const MyComponent = () => {
    useBeforeFirstMount(() = > {
        // do what u want to do
    })

    return <></>
}
```

## useAfterFirstMount

useage

```tsx
import {useAfterFirstMount} from '@ronin-react/zhooks'

const MyComponent = () => {
    useAfterFirstMount(() = > {
        // do what u want to do
    })

    return <></>
}
```

## useEvent

useage

```tsx
import {useState} from 'react'
import {useEvent} from '@ronin-react/zhooks'

const MyComponent = () => {
    const [count, setCount] = useState(0)
    const onClick = useEvent(() => {
        setCount(count + 1)
    })

    return <span onClick={onClick}>{count}</span>
}
```