import Vue from 'vue';
import install from './install';

function deepMapRoutes(routes){
    routes.forEach((route)=>{
        this[route.path] = route.component;

        if(route.children instanceof Array && route.children.length){
            deepMapRoutes.call(this,route.children)
        }
    })


}

class MyRouter{
    constructor(options){
        this.$options = options;
        this.routes = options.routes;
        this.mapRoutes = {};
        this.history = window.history;
        /*

        原数据:
            [
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
        转换:
            {
                "/home":Home,
                "/about":About,
                "/home/a":A
            }
        
        */
        deepMapRoutes.call(this.mapRoutes,this.routes);

        Vue.prototype.$router = this;

        Vue.prototype.$route = Vue.observable({
            path:window.location.pathname
        })
        // console.log(this.mapRoutes);
    }

    push(path){
        this.history.pushState({},'',path);
        Vue.prototype.$route.path = path;
    }
}

// new MyRouter({
//     mode:"history",
//     routes:[
//         {
//             path:"/home",
//             component:"Home",
//             children:[
//                 {
//                     path:"/home/a",
//                     component:"A"
//                 }
//             ]
//         },
//         {
//             path:"/about",
//             component:"About"
//         }
//     ]
// })
MyRouter.install = install;
export default MyRouter;