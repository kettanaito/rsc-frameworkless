import express from 'express'
import { createServer as createViteServer } from 'vite'
import * as ReactServerDOMWebpack from 'react-server-dom-webpack/server'

console.log({ ReactServerDOMWebpack })

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

  async function renderApp(response, returnValue, formState) {
    response.set('content-type', 'text/html')

    const root = <p>hello world</p>
    const payload = { root, returnValue, formState }
    const stream = ReactServerDOMWebpack.renderToPipeableStream(payload, {
      onShellReady() {
        stream.pipe(response)
      },
      onError(error) {
        console.error(error)
      },
    })
  }

  app.get('/', async (request, response) => {
    await renderApp(response)
  })
}

startServer()
