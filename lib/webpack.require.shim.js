const __esbuild__module_map__ = new Map()

const ROOT = 'http://localhost:3000/'
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
