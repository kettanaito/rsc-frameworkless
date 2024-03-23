import * as React from 'react'
import express from 'express'
import { renderToReadableStream } from 'react-server-dom-webpack/server'

console.log({ renderToReadableStream })

function Html({ children }) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>RSC</title>
      </head>
      <body>{children}</body>
    </html>
  )
}

/**
 * @param {import('express').Express} app
 * @param {import('react').ReactNode} Component
 * @return {import('express').RequestHandler}
 */
export function rscMiddleware(app, Component) {
  app.use(
    '/node_modules/react-server-dom-webpack/client',
    express.static(
      'node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js',
    ),
  )

  app.get('/', async (request, response) => {
    if (request.accepts('text/html')) {
      response.set('content-type', 'text/html')
      const stream = renderToPipeableStream(
        <Html>
          <Component />
        </Html>,
        {
          importMap: {
            imports: {
              react: 'https://esm.sh/react@experimental?pin=v124&dev',
              'react-dom': 'https://esm.sh/react-dom@experimental?pin=v124&dev',
              'react-dom/':
                'https://esm.sh/react-dom@experimental&pin=v124&dev/',
              'react-server-dom-webpack/client':
                '/node_modules/react-server-dom-webpack/client',
            },
          },
          bootstrapModules: ['/hydrate.js'],
          onShellReady() {
            stream.pipe(response)
          },
          onError(error) {
            console.error(error)
          },
        },
      )
      return
    }
  })

  app.get('/bootstrap.js', (request, response) => {
    //
  })
}
