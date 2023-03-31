
export default [
    {
        path:"/role/list",
        name:"rolelist",
        component:()=>import("./RoleList.vue")
    },
    {
        path:"/role/set",
        name:"roleset",
        component:()=>import("./RoleSet.vue")
    }
]