# vue2+vite

如何使用 Vite 搭建的一个 Vue2 项目

## 搭建方法

以`Yarn`为例

### 1. 创建一个 vite 项目


先用Vite创建一个项目，详见[官方文档](https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project)
``` shell
$ yarn create vite
```
然后按提示操作！

注意：在进行到第二步时时，即`Select a framework:`，不要选择`vue`，因为这样会创建一个`vue3`的项目，选择为`vanilla`，即原生js, 然后通过插件和一些配置来改造成 vue2 项目。

### 2. 安装并配置依赖和插件

安装 vue2 （此处我安装的为2.6.14版本） 及相关依赖：
``` shell
$ yarn add vue@2.6.14 vue-template-compiler
```
让vite支持vue2，安装插件 `vite-plugin-vue2`：
``` shell
$ yarn add vite-plugin-vue2 -D
```

创建 `vite.config.js` 文件并引入插件：
```js
// vite.config.js
import { defineConfig } from 'vite'
import { createVuePlugin as Vue2 } from 'vite-plugin-vue2'

export default defineConfig({
  plugins: [Vue2()]
})
```

### 3. 修改目录和文件内容

在根目录下创建 `src` 文件夹，并在文件夹下创建 `App.vue`：
```html
<!-- App.vue -->
<template>
  <div id="app">
    Hello, Vue2 + Vite !
  </div>
</template>
```

修改 `main.js` 文件内容并将其移入 `src`：
```js
// main.js
import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
}).$mount()
```

关于 `index.html`，不需要创建`public`文件夹并将其移入（原因见：[vite官方文档](https://cn.vitejs.dev/guide/#index-html-and-project-root)），只需要修改 `main.js` 的路径即可：
```html
<!-- index.html -->

<script type="module" src="/main.js"></script>
<!-- 修改为 -->
<script type="module" src="/src/main.js"></script>
```

至此，vite 搭建的 vue2 项目就基本完成了。
运行项目：
```shell
$ yarn dev
```

```
vite v2.9.6 dev server running at:

> Local: http://localhost:3000/
> Network: use `--host` to expose

ready in 520ms.
```
你可能会注意到，`Network` 那行好像不太对劲，我的 IP 地址打开方式哪去了？
不要慌只需要去 `vite.config.js` 配置一下 `server.host` 就可以了。
```
server: {
  host: '0.0.0.0'
}
```

## 其他设置

### Composition-api 和 setup 语法糖

[unplugin-vue2-script-setup](https://github.com/antfu/unplugin-vue2-script-setup)

1. 安装：
```shell
$ yarn add @vue/composition-api
$ yarn add -D unplugin-vue2-script-setup
```
2. 在`main.js`中安装`@vue/composition-api`（它启用`setup()`钩子）：
```js
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)
```
3. 在`vite.config.js`中配置：
```js
// vite.config.js
import { defineConfig } from 'vite'
import { createVuePlugin as Vue2 } from 'vite-plugin-vue2'
import ScriptSetup from 'unplugin-vue2-script-setup/vite'

export default defineConfig({
  plugins: [
    Vue2(),
    ScriptSetup({ /* options */ })
  ]
})
```
4. 使用：
```html
<script setup>
  import { ref } from '@vue/composition-api'
  const msg = ref('I am using CompositionAPI and <script setup> in Vue2 !')
</script>
```