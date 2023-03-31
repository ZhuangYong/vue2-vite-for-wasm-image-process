export default [
  {
    path: '/404',
    name: '404',
    component: () => import('./404.vue')
  },
  {
    path: '/503',
    name: '503',
    component: () => import('./503.vue')
  },
]