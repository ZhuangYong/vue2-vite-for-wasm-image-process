export default [
    {
        path:"/project/create",
        name:"project-create",
        component:()=>import("./Create.vue")
    },
    {
        path:"/project/my",
        name:"project-my",
        component:()=>import("./My.vue")
    }
]