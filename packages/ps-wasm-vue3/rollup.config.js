import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import vue from 'rollup-plugin-vue'
import image from "./rollup-plugin-image"
import scss from 'rollup-plugin-scss'
import commonjs from "rollup-plugin-commonjs"
import resolve from 'rollup-plugin-node-resolve'
import wasm from './rollup-plugin-wasm'
// import wasmImport from 'rollup-wasm-pack-import'
// import jsx from 'rollup-plugin-jsx'
import alias from '@rollup/plugin-alias';
import requireContext from 'rollup-plugin-require-context'
// import postCss from "rollup-plugin-postcss"
const path = require('path')

export default {
  external: ['vue', 'lodash'],
  input: 'src/index.js',
  // sourceMap: true,
  output: {
    file: 'dist/main.js',
    format: 'esm',
    name: 'bundle-name',
    globals: {vue: 'Vue'}
  },
  plugins: [
    json(),
    // jsx({factory: 'Vue.prototype.$createElement'}),
    resolve(),
    requireContext(),
    vue({
      preprocessStyles: true
    }),
    scss({insert: true}),
    commonjs(),
    babel({
      presets: [
        ['@babel/preset-env', {
          modules: false,
          spec: true,
          loose: true,
          targets: '> 0.25%, not dead',
          forceAllTransforms: true
        }],
        '@vue/babel-preset-jsx'
      ],
      exclude: ['node_modules/**', 'src/lib/**'],
      include: ['src/**'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-for-of',
        '@babel/plugin-transform-block-scoping',
        '@babel/plugin-transform-parameters',
        '@babel/plugin-transform-function-name',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-transform-member-expression-literals',
        '@babel/plugin-transform-block-scoped-functions',
        '@babel/plugin-transform-arrow-functions'
      ]
    }),
    alias({
      entries: {
        '@': path.join(__dirname, '.', 'src')
      }
    }),
    image(),
    // svg({ vueComponent: true }),
    wasm(),
    // postCss()

  ]
}
