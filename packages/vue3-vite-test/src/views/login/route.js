export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('./Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('./Register.vue')
  },
  {
    path: '/findpass',
    name: 'findpass',
    component: () => import('./FindPass.vue')
  },
]