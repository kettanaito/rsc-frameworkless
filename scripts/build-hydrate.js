import { build } from 'esbuild'

build({
  entryPoints: ['./lib/hydrate.js'],
  outdir: './public',
  platform: 'browser',
  target: 'chrome180',
  format: 'esm',
  bundle: true,
  splitting: false,
  minify: true,
  define: {
    'process.env.NODE_ENV': `"development"`,
  },
  inject: ['./lib/webpack.require.shim.js'],
})
