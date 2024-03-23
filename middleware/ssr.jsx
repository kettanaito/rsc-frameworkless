import * as React from 'react'
import { renderToPipeableStream } from 'react-dom/server'

function Html({ children, scripts }) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {scripts}
        <title>RSC</title>
      </head>
      <body>{children}</body>
    </html>
  )
}

/**
 * @param {import('vite').ViteDevServer} vite
 * @param {import('react').ReactNode} Component
 * @return {import('express').RequestHandler}
 */
export function ssrMiddleware(vite, Component) {
  return async (request, response, next) => {
    response.set('content-type', 'text/html')

    const viteScriptsHtml = await vite.transformIndexHtml(request.url, ``)

    const { pipe } = renderToPipeableStream(
      <Html
        scripts={
          <aside dangerouslySetInnerHTML={{ __html: viteScriptsHtml }} />
        }
      >
        <Component />
      </Html>,
      {
        bootstrapModules: ['/bootstrap.js'],
        onShellReady() {
          pipe(res)
        },
        onShellError(error) {
          console.log(error)
          response.status(500).send('<h1>Failed to render</h1>')
        },
        onError(error) {
          console.error(error)
        },
      },
    )

    return next()
  }
}
