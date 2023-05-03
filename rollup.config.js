import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
// import babel from 'rollup-plugin-babel'
import json from '@rollup/plugin-json';

import typescript from '@rollup/plugin-typescript'

export default [
  {
    input: 'packages/koa-compose/src/index.ts',
    output: [
      {
        format: 'es',
        file: 'packages/koa-compose/dist/koa-compose.js',
      }
    ]
  },
  {
    input: 'src/application.ts',
    output: [
      {
        file: 'dist/bundle.cjs.js',
        format: 'cjs'
      },
      {
        format: 'es',
        file: 'dist/bundle.es.js'
      }
    ],
    watch: {
      clearScreen: false,
      exclude: "node_modules/**",
      include: "src/**",
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      json(),
      commonjs(),
      // babel({
      //   babelrc: false,
      //   presets: [['@babel/preset-env', { modules: false }]]
      // }),
      typescript()
    ]
  }
]
