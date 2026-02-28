const esbuild = require('esbuild');

const isDev = process.argv.includes('--dev');

esbuild.build({
  entryPoints: ['typescript/index.ts'],
  bundle: true,
  outfile: 'dist/js/paraore-ui.js',
  format: 'esm',
  target: ['es2020'],
  platform: 'browser',
  sourcemap: isDev,
  minify: !isDev,
  keepNames: true,
  banner: {
    js: '// ParaOre-UI Bundle'
  },
}).then(() => {
  console.log('Build complete: dist/js/paraore-ui.js');
}).catch(() => process.exit(1));
