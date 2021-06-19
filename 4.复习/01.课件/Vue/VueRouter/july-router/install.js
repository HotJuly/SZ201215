import RouterView from './components/view'
import RouterLink from './components/link'

//用于辨别当前内容是否为空,不为空返回true
function isDep(v){
    return v!==undefined;
}

/*
    想要使用Vue.use()语法声明使用当前插件,需要提供一个install方法
    例如:Vue.use(VueRouter)
*/
function install(Vue){
    
    /*
        注册全局组件router-link和router-view
            router-link:默认生成a标签,实现声明式导航
            router-view:用于显示对应层级的路由组件
    */
    Vue.component("RouterView",RouterView);
    Vue.component("RouterLink",RouterLink);

    /*
        Vue.mixin()用来向所有的Vue组件注入生命周期钩子函数
        下面的代码是可以让所有组件在beforeCreate阶段都执行内部的代码
    */
    Vue.mixin({
        beforeCreate(){
            if(isDep(this.$options.router)){
                /*
                    如果能进入该判断,说明当前对象的$options对象中具有router属性
                    例如:new Vue({
                        router
                    })

                    给当前的Vue组件添加一个_routerRoot属性,并指向自己
                    作用:声明当前实例对象是路由的根组件
                    注意:整个Vue项目中,只有main.js中new Vue()得到的实例对象,有资格拥有_routerRoot属性
                */
                this._routerRoot=this;
            }
        }
    })
}

export default install