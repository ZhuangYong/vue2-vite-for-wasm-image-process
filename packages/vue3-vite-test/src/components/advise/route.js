export default [
    {
        path:"/advise/list",
        name:"advise-list",
        component:()=>import("./AdviseList.vue")
    },
    {
        path:"/advise/add",
        name:"advise-add",
        component:()=>import("./AdviseAdd.vue")
    },
    {
        path:"/advise/data",
        name:"advise-data",
        component:()=>import("./AdviseData.vue")
    }
]