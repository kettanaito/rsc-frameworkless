import express from 'express'
import { createServer as createViteServer } from 'vite'

/**
 * @param {string} modulePath
 */
async function startServer(modulePath) {
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

  const Component = await vite
    // .ssrLoadModule('./src/main.jsx')
    .ssrLoadModule(modulePath)
    .then((mod) => mod.default)

  // Load the SSR middleware via Vite
  // because it contains JSX.
  const { ssrMiddleware } = await vite.ssrLoadModule('./middleware/ssr.jsx')

  app.get('/', ssrMiddleware(vite, Component))

  app.listen(5173, () => {
    console.log('http://localhost:5173')
  })
}

// Provide the path to the React component to render.
// Ideally, accept a ReactNode as well.
startServer('./src/main.jsx')
