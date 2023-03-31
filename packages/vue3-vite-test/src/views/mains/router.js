import roleRoute from '@/components/role/route.js'
import annoRoute from '@/components/anno/route.js'
import adviseRoute from '@/components/advise/route.js'
import eduRoute from '@/components/edu/route.js'
import projectRoute from '@/components/project/route.js'
import gradeRoute from '@/components/grade/route.js'

export default [
  {
    path: "/main",
    name: "main",
    component: () => import('./main.vue'),
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import('@/components/home/Home.vue'),
      },
      {
        path: "/mine",
        name: "mine",
        component: () => import('@/components/mine/Mine.vue'),
      },
      ...roleRoute,
      ...annoRoute,
      ...adviseRoute,
      ...eduRoute,
      ...projectRoute,
      ...gradeRoute
    ]
  }
]