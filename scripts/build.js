import esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['./lib/index.js'],
  conditions: ['react-server'],
  format: 'esm',
  outdir: './build',
  target: 'node20',
  platform: 'node',
  bundle: true,
  loader: {
    '.js': 'jsx',
  },
  define: {
    'process.env.NODE_ENV': '"development"',
    __webpack_require__: '{}',
  },
  external: ['vite', 'express'],
})
