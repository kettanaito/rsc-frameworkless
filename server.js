import express from 'express'
import { createServer as createViteServer } from 'vite'

async function startServer() {
  const app = express()

  // Use Vite in a middleware mode.
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  })
  app.use(vite.middlewares)
  app.use(express.static('./public'))

  app.listen(5173, () => {
    console.log('http://localhost:5173')
  })
}

startServer()
