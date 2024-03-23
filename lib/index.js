import * as React from 'react'
import express from 'express'
import bodyParser from 'body-parser'
import { createServer } from 'vite'
import { renderToPipeableStream } from 'react-server-dom-webpack/server'

/**
 * @param {string} componentPath
 */
export async function render(componentPath) {
  const app = express()
  const vite = await createServer({
    appType: 'custom',
    server: {
      middlewareMode: true,
    },
    ssr: {
      resolve: {
        externalConditions: ['react-server'],
      },
    },
  })
  app.use(vite.middlewares)
  app.use(express.static('./public'))

  const Component = await vite
    .ssrLoadModule(componentPath)
    .then((m) => m.default)

  /**
   * When hydrating, the client will request this endpoint
   * to return the RSC payload for the component tree.
   */
  app.get('/payload', async (request, response) => {
    // Component -> RSC payload.
    // E.g 0:['$', 'div', null]
    const stream = renderToPipeableStream({
      root: React.createElement(Component),
      returnValue: null,
      formState: null,
    })
    stream.pipe(response)
  })

  // This should handle Server Actions but we'll get to this.
  // app.post('/', bodyParser.text(), async (request, response) => {
  //   console.log('POST /', req.get('rsc-action'))
  // })

  app.listen(5173, () => {
    console.log('http://localhost:5173')
  })
}

render('./src/main.jsx')
