import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/styles/index.scss'

import 'virtual:svg-icons-register'
import SvgIcon from "./components/SvgIcon.vue"

const app = createApp(App)
app.component('svg-icon', SvgIcon)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
