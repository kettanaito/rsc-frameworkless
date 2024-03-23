const __esbuild__module_map__ = new Map()

/**
 * A bunch of hacks to make the "react-server-dom-webpack" work with Vite.
 */
globalThis.__webpack_chunk_load__ = async function (moduleId) {
  const mod = await import(
    moduleId.replace('./src', '//' + window.location.host)
  )
  __esbuild__module_map__.set(moduleId, mod)
  return mod
}

globalThis.__webpack_require__ = function (moduleId) {
  return __esbuild__module_map__.get(moduleId)
}
