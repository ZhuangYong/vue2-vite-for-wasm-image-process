export default [
    {
        path:"/grade/set",
        name:"grade-set",
        component:()=>import("./Set.vue")
    },
    {
        path:"/grade/list",
        name:"grade-list",
        component:()=>import("./List.vue")
    }
]