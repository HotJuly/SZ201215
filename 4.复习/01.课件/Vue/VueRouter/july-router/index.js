import Vue from 'vue';

import install from './install';


function deepMapRoute(routes){
    routes.forEach((item)=>{
        this[item.path]=item.component;

        //此处检查当前路由下,是否还有子路由children,如果有就递归遍历子路由
        if(item.children instanceof Array&&item.children.length){
            deepMapRoute.call(this,item.children);
        }
    })
}

class MyRouter{

    constructor(options){
        //当new MyRouter创建实例对象时,会调用该函数
        //获取配置对象中的routes数组
        this.routes = options.routes;

        //创建mapRoute对象,用于存储路径与组件之间的映射关系(方便后续查找)
        this.mapRoute = {};

        /*
            此处仅实现mode:history模式,并未实现hashHistory模式
            history模式的实现原理是通过H5新增的API--window.history实现对浏览器历史记录栈的操作
        */
        this.history = window.history;

        /*
            通过递归对用户传入的routes所有路由进行结构转换
            用户传入:
                    routes:[
                            {
                                path:"/home",
                                component:Home,
                                children:[
                                    {
                                        path:"/home/xixi",
                                        component:Xixi
                                    }
                                ]
                            },
                            {
                                path:"/about",
                                component:About
                            }
                        ]
                    
                    转换之后的mapRoutes:
                        {
                            "/home":{
                                component:Home,
                                children:{
                                    "/home/xixi":{
                                        component:Xixi
                                    }
                                }
                            },
                            "/about":{
                                component:About
                            }
                        }
        */
        deepMapRoute.call(this.mapRoute,this.routes);

        /*
            将当前的路由器实例对象,放到Vue原型对象上,所有的Vue组件都能看得到
            例如:Vue组件内部使用this.$router
        */
        Vue.prototype.router = this;
        
        /*
            Vue.observable()可以将某个普通对象,变成响应式对象,响应式对象的属性值发生修改,Vue视图会重新渲染
            将当前的响应式对象,放到Vue原型对象上,所有的Vue组件都能看得到(可以理解为所有组件共享的data)

            new URL(window.location)可以得到URL对象,从pathname属性中,可以获得当前的路由地址
            此处是为了辨别用户一上来的路由路径是什么,例如:http://localhost:8080/about  --->  得到的结果就是/about
            
            例如:Vue组件内部使用this.$route
        */
        Vue.prototype.route = Vue.observable({
            path:new URL(window.location).pathname
        })
    }

    /*
        该方法用于向浏览器历史记录栈中推送记录,控制URL地址变化,并控制Vue组件重新渲染
    */
    push(path){

        //控制URL地址变化
        this.history.pushState({},"",path);

        /*
            修改Vue原型对象内的route属性的path值的变化
            在constructor,我们生成了一个响应式对象route,内部的path属性发生变化,会导致Vue组件重新渲染
        */
        Vue.prototype.route.path=path;
    }
}

//想使用Vue.use(MyRouter)语法,必须提供install方法
MyRouter.install=install

export default MyRouter