import { createRouter, createWebHistory } from 'vue-router'
import ErrorRoute from '@/views/errors/route'
import Login from '@/views/login/route'
import Mains from '@/views/mains/router.js'

const routes = [
  {
    path: '/',
    redirect: { name: 'login' }
  },
  ...Login,
  ...ErrorRoute,
  ...Mains,
  {
    path: "/:pathMathch(.*)",
    redirect: { name: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router