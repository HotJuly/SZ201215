import Vue from 'vue';

export default{
    name:"RouterView",
    functional:true,
    render:(_,{parent,data})=>{
        var createElement = parent.$createElement;

        // 获取当前路由地址
        var path = Vue.prototype.$route.path;

        // 通过路由地址,找到需要渲染的路由组件
        var component = Vue.prototype.$router.mapRoutes[path];

        // 将路由组件渲染
        return createElement(component,data);
    }
}