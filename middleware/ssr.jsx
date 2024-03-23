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
 * @return {import('express').RequestHandler}
 */
export function ssrMiddleware(vite) {
  return async (req, res, next) => {
    res.set('content-type', 'text/html')

    const viteScriptsHtml = await vite.transformIndexHtml(req.url, ``)

    // Import the React component we wish to render.
    const Component = await vite
      .ssrLoadModule('./src/main.jsx')
      .then((mod) => mod.default)

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
          res.status(500).send(error.message)
        },
      },
    )

    return next()
  }
}
