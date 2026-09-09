const fs = require('fs');
const path = require('path');
const fastGlob = require('fast-glob');
const { rimrafSync } = require('rimraf');

const root = path.resolve(process.argv[2] || process.cwd());
const libCss = path.join(root, 'lib-css');

async function buildCss() {
  const [
    { TransformCacheCollection, disposeEvalBroker, transform },
    { asyncResolveFallback },
  ] = await Promise.all([
    import('@wyw-in-js/transform'),
    import('@wyw-in-js/shared'),
  ]);
  const cache = new TransformCacheCollection();
  const files = fastGlob.sync('src/**/*.{ts,tsx}', {
    absolute: true,
    cwd: root,
  });
  let content = '';

  try {
    for (const filename of files) {
      const { cssText } = await transform(
        {
          options: {
            filename,
            outputFilename: path.join(
              libCss,
              path.basename(filename, path.extname(filename)) + '.css'
            ),
            root,
          },
          cache,
        },
        fs.readFileSync(filename, 'utf-8'),
        asyncResolveFallback
      );
      content += cssText || '';
    }
  } finally {
    disposeEvalBroker(cache);
    cache.clear('all');
  }

  fs.writeFileSync(path.join(root, 'lib', 'plugin.css'), content);
  rimrafSync(libCss);
}

buildCss().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
