export default [{
  path: "/edu/xueke",
  name: "edu-xueke",
  component: () => import("./Xueke.vue")
},
{
  path: "/edu/class",
  name: "edu-class",
  component: () => import("./Banji.vue")
},
{
  path: "/edu/xm",
  name: "edu-xm",
  component: () => import("./xm.vue")
},
{
  path: "/edu/fenban",
  name: "edu-fenban",
  component: () => import("./FenBan.vue")
}
]