import * as React from 'react'
import express from 'express'
import bodyParser from 'body-parser'
import { createServer } from 'vite'
import {
  renderToPipeableStream,
  decodeReply,
} from 'react-server-dom-webpack/server'

/**
 * @param {string} componentPath
 */
export async function render(componentPath) {
  // 2. Build the server that can handle the client.
  const app = express()

  const vite = await createServer({
    appType: 'custom',
    server: {
      middlewareMode: true,
    },
  })
  app.use(vite.middlewares)
  app.use(express.static('./public'))

  const Component = await vite
    .ssrLoadModule(componentPath)
    .then((m) => m.default)

  // Respond with the RSC payload for the rendering client.
  app.get('/payload', async (request, response) => {
    const stream = renderToPipeableStream(React.createElement(Component, {}))
    stream.pipe(response)
  })

  app.post('/', bodyParser.text(), async (request, response) => {
    console.log('POST /', req.get('rsc-action'))
  })

  app.listen(5173, () => {
    console.log('http://localhost:5173')
  })
}

render('./src/main.jsx')
