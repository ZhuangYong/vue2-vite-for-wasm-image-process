import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: { name: 'mine' }
  },
  {
    path: "/mine",
    name: "mine",
    component: () => import('@/views/imageMaker/index.vue'),
  },
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
