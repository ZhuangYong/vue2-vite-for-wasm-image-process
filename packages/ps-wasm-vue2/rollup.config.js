import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import vue from 'rollup-plugin-vue'
import image from "rollup-plugin-image"
import scss from 'rollup-plugin-scss'
import commonjs from "rollup-plugin-commonjs"
import resolve from 'rollup-plugin-node-resolve'
import wasm from './rollup-plugin-wasm'

export default {
  external: ['vue', 'lodash'],
  input: 'src/index.js',
  sourceMap: true,
  output: {
    file: 'dist/main.js',
    format: 'esm',
    name: 'bundle-name',
    globals: {vue: 'Vue'}
  },
  plugins: [
    json(),
    resolve(),
    scss(),
    scss({insert: true}),
    vue({
      css: true,
      needMap: true,
      compileTemplate: true,
      normalizer: `~vue-runtime-helpers/dist/normalize-component.js`,
      styleInjector: `~vue-runtime-helpers/dist/inject-style/browser.js`
    }),
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
    image(),
    wasm()

  ]
}
