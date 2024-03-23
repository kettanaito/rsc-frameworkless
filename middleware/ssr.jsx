import fs from 'node:fs'
import { renderToString } from 'react-dom/server'

export function ssrMiddleware(vite) {
  return async (req, res, next) => {
    // Transform the index.html with Vite
    // so it adds its HMR and other goods.
    const template = await vite.transformIndexHtml(
      req.url,
      fs.readFileSync('./public/index.html', 'utf8'),
    )

    // Import the React component we wish to render.
    const Component = await vite
      .ssrLoadModule('./src/main.jsx')
      .then((mod) => mod.default)

    const componentHtml = renderToString(<Component />)
    const html = template.replace(`<!-- component -->`, componentHtml)

    res.set('content-type', 'text/html').send(html)

    return next()
  }
}
