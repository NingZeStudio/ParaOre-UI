const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isDev = process.argv.includes('--dev');

// Copy images and fonts to dist directory
function copyAssets() {
  const projectRoot = path.resolve(__dirname);
  
  // Copy images
  const imagesSrc = path.join(projectRoot, 'images');
  const imagesDest = path.join(projectRoot, 'dist', 'images');
  
  if (fs.existsSync(imagesSrc)) {
    if (!fs.existsSync(imagesDest)) {
      fs.mkdirSync(imagesDest, { recursive: true });
    }
    const images = fs.readdirSync(imagesSrc);
    images.forEach(file => {
      const srcFile = path.join(imagesSrc, file);
      const destFile = path.join(imagesDest, file);
      fs.copyFileSync(srcFile, destFile);
    });
    console.log(`Copied ${images.length} images to dist/images/`);
  }
  
  // Copy fonts
  const fontsSrc = path.join(projectRoot, 'fonts');
  const fontsDest = path.join(projectRoot, 'dist', 'fonts');
  
  if (fs.existsSync(fontsSrc)) {
    if (!fs.existsSync(fontsDest)) {
      fs.mkdirSync(fontsDest, { recursive: true });
    }
    const fonts = fs.readdirSync(fontsSrc);
    fonts.forEach(file => {
      const srcFile = path.join(fontsSrc, file);
      const destFile = path.join(fontsDest, file);
      fs.copyFileSync(srcFile, destFile);
    });
    console.log(`Copied ${fonts.length} fonts to dist/fonts/`);
  }
}

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
  copyAssets();
}).catch(() => process.exit(1));
