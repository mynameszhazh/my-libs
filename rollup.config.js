import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import { terser } from 'rollup-plugin-terser'
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
  watch: {
    clearScreen: false,
    exclude: "node_modules/**",
    include: "src/**",
  },
  plugins: [
    resolve(),
    commonjs(),
    vue({
      // 配置 Vue 单文件组件在打包过程中的行为
      css: false,
      compileTemplate: true,
    }),
    terser(),
    babel({
      babelrc: false,
      presets: [['@babel/preset-env', { modules: false }]]
    }),
    typescript()
  ]
}
