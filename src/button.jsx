import { useState } from 'react'

export default function Button() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>Clicked: {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
