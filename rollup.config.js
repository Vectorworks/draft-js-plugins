import path from 'path';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { existsSync, writeFileSync } from 'fs';
import wyw from '@wyw-in-js/rollup';
import css from 'rollup-plugin-css-only';

const input = existsSync('./src/index.ts')
  ? './src/index.ts'
  : './src/index.tsx';
const external = (id) => !id.startsWith('.') && !path.isAbsolute(id);
const extensions = ['.ts', '.js', '.tsx', '.jsx'];
const babelOptions = {
  rootMode: 'upward',
  extensions,
  babelHelpers: 'bundled',
};
const cssOptions = {
  output: (styles) => writeFileSync('./lib/plugin.css', styles),
};
const wywOptions = { sourceMap: false };

export default [
  {
    input,
    output: {
      format: 'cjs',
      file: './lib/index.cjs.js',
      exports: 'named',
    },
    external,
    plugins: [
      wyw(wywOptions),
      nodeResolve({ extensions }),
      babel(babelOptions),
      css(cssOptions),
    ],
  },
  {
    input,
    output: {
      format: 'esm',
      file: './lib/index.esm.js',
    },
    external,
    plugins: [
      wyw(wywOptions),
      nodeResolve({ extensions }),
      babel({
        ...babelOptions,
        plugins: [
          [
            'babel-plugin-transform-rename-import',
            {
              replacements: [
                {
                  original: 'lodash',
                  replacement: 'lodash-es',
                },
              ],
            },
          ],
        ],
      }),
      css(cssOptions),
    ],
  },
];
