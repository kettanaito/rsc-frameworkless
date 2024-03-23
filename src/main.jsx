import 'server-only'
import Button from './button.jsx'

async function getData() {
  return { name: 'John' }
}

export default async function Main() {
  const json = await getData()

  return (
    <div>
      <h1>{json.name}</h1>
      <p>This is a server component.</p>
      <Button />
    </div>
  )
}
