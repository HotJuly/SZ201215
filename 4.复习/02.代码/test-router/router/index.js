import Vue from 'vue'
// import VueRouter from 'vue-router'
import MyRouter from '../my-router';


import Home from '../components/Home'
import About from '../components/About'

// Vue.use(VueRouter);
Vue.use(MyRouter);


export default new MyRouter({
    mode:"history",
    routes:[
        {
            path:"/home",
            component:Home,
            children:[
                {
                    path:"/home/a",
                    component:Home
                }
            ]
        },
        {
            path:"/about",
            component:About
        }
    ]
})