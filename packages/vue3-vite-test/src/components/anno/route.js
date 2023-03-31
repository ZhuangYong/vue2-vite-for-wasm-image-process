
export default [
    {
        path:"/anno/list",
        name:"annolist",
        component:()=>import("./AnnoList.vue")
    },
    {
        path:"/anno/add",
        name:"annoadd",
        component:()=>import("./AnnoAdd.vue")
    }
]