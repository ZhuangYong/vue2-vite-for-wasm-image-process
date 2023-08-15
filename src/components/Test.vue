<template>
  <div>
    <iframe :src="src" style="width: 1000px; height: 400px;" />
  </div>
</template>

<script>
import {WebContainer} from '@webcontainer/api';

export default {
  data() {
    return {
      src: '',
      webcontainerInstance: null
    }
  },
  async mounted() {
    await this.startDevServer()
  },
  methods: {
    async startDevServer() {
      const webcontainerInstance = await WebContainer.boot();
      this.webcontainerInstance = webcontainerInstance
      await this.load()

      // 执行 `npm run start` 启动Express服务器
      await webcontainerInstance.spawn('npm', ['run', 'dev']);
      // 等待 `server-ready` 事件
      webcontainerInstance.on('server-ready', (port, url) => {
        console.log('>>>>...', port, url)
        this.src = url;
      });
    },

    async load() {
      const {webcontainerInstance} = this
      console.log('>>>>>>', webcontainerInstance)
      const files = {
        'App.vue': {
          file: {
            contents: `
            <template>
              <div id="app">
                11111111
              </div>
            </template>

            <script setup>
            <\/script>

            <style>
            #app {
              font-family: Avenir, Helvetica, Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              text-align: center;
              color: #2c3e50;
              margin-top: 60px;
            }
            </style>
            `
          }

        },
        'main.js': {
          file: {
            contents: `
              import Vue from 'vue'
              import element from 'element-ui'
              import App from './App.vue'
              import 'element-ui/lib/theme-chalk/index.css'
              import VueCompositionAPI from '@vue/composition-api'

              Vue.use(VueCompositionAPI)

              Vue.use(element, {
                size: 'medium'
              })
              new Vue({
                el: '#app',
                render: h => h(App)
              }).$mount()
            `
          }
        },
        'package.json': {
          file: {
            contents: `
              {
                "name": "vue2-vite",
                "private": true,
                "version": "0.0.0",
                "scripts": {
                  "dev": "vite",
                  "build": "vite build",
                  "preview": "vite preview"
                },
                "workspaces": {
                  "packages": [
                    "packages/*"
                  ],
                  "nohoist": [
                    "**/vue"
                  ]
                },
                "devDependencies": {
                  "@nabla/vite-plugin-eslint": "^1.4.0",
                  "@vue/runtime-dom": "^3.2.33",
                  "eslint": "^8.14.0",
                  "eslint-config-prettier": "^8.5.0",
                  "eslint-plugin-prettier": "^4.0.0",
                  "eslint-plugin-vue": "^8.7.1",
                  "prettier": "^2.6.2",
                  "unplugin-vue2-script-setup": "^0.10.2",
                  "vite": "^2.9.5",
                  "vite-plugin-cross-origin-isolation": "^0.1.6",
                  "vite-plugin-vue2": "^2.0.0"
                },
                "dependencies": {
                  "@vue/composition-api": "^1.6.0",
                  "element-ui": "2.4.11",
                  "vue": "2.6.11",
                  "vue-template-compiler": "2.6.11"
                }
              }
            `
          }
        }
      }

      await webcontainerInstance.mount(files)
      const install = await webcontainerInstance.spawn('yarn', ['install']);
      await install.exit;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
