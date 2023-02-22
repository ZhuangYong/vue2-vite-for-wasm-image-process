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
