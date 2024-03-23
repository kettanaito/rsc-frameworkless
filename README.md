# RSC Frameworkless

## Getting started

```sh
npm install
npm start
```

## RSC

1. `lib/index.js` loads the given React component using `vite.ssrLoadModule()`. This evaluates the module server-side and returns the component. This uses the Vite config you have to stay consistent.
1. `lib/index.js` then has `GET /payload` endpoint responsible for generating the RSC Payload (`0:['$', 'div', null]`) from the component tree and sending it to the client during hydration.
1. The client (`lib/hydrate.js`) requests the RSC Payload (makes a `GET /payload` request) during hydration to render the component tree.

> This pipeline has no SSR so the initial HTML is empty, causing the hydration errors. Those have been disabled by not relying on `.hydrateRoot()` but instead using `.createRoot()`. It'd be great to introduce SSR as well and use `.hydrateRoot()` properly.
