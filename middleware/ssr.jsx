import { renderToPipeableStream } from 'react-dom/server'

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
 * @param {import('vite').ViteDevServer} vite
 * @return {import('express').RequestHandler}
 */
export function ssrMiddleware(vite) {
  return async (req, res, next) => {
    res.set('content-type', 'text/html')

    // Import the React component we wish to render.
    const Component = await vite
      .ssrLoadModule('./src/main.jsx')
      .then((mod) => mod.default)

    const { pipe } = renderToPipeableStream(
      <Html>
        <Component />
      </Html>,
      {
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
