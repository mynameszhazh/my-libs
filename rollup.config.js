import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
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
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      presets: [['@babel/preset-env', { modules: false }]]
    }),
    typescript()
  ]
}
