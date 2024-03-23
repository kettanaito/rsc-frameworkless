import express from 'express'
import { createServer as createViteServer } from 'vite'

async function startServer() {
  const app = express()

  // Use Vite in a middleware mode.
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
    },
    // Opt-out from Vite handling routing.
    appType: 'custom',
  })
  app.use(vite.middlewares)

  // Load the SSR middleware via Vite
  // because it contains JSX.
  const { ssrMiddleware } = await vite.ssrLoadModule('./middleware/ssr.jsx')

  app.use('*', ssrMiddleware(vite))

  app.listen(5173, () => {
    console.log('http://localhost:5173')
  })
}

startServer()
