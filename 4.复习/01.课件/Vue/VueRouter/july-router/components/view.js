import Vue from 'vue';

/*
    该文件是router-view的源码实现
    router-view是函数组件
    实现原理:
        1.声明当前组件是router-view组件
        2.通过depth变量,记录当前是几级路由
            (通过while循环,从当前组件往上找,看遇到了几个rouiter-view,直至找到路由根组件为止)
        3.通过router上的mapRoutes对象,配合当前的路由地址,搜索出所有路径相似的路由,获取到对应的组件
        4.将对应的组件通过createElement方法,生成虚拟DOM
*/
export default {
    name:"RouterView",
    functional:true,
    render:(_,{parent,props,data,children})=>{

        // 声明当前组件是router-view组件
        data.routerView = true;

        // 通过depth变量,记录当前是几级路由
        let depth=0;

        // 获取父组件创建虚拟DOM的方法
        let createElement = parent.$createElement;


        while(parent&&parent._routerRoot!=false){
            let vnodeData = parent.$vnode?parent.$vnode.data:{};
            if(vnodeData.routerView){
                // 在向上找的过程中,遇到一个router-view组件,就将depth+1,用来记录当前的router-view用来显示第几级路由
                depth++;
            }
            parent=parent.$parent;
        }

        //获取当前的路由地址
        let path = Vue.prototype.route.path;

        /*
            1.先提取出当前的路由注册表对象所有的key(也就是所有注册的路径),得到有路由路径组成的数组
            2.再从数组中过滤出,与当前路由地址相关的路径组成的数组
            (例如当前路由地址:/home/haha => 得到的数组["/home","/home/haha"])
        */
        let pathMap = Object.keys(Vue.prototype.router.mapRoute).filter((item)=>{
            return path.includes(item);
        });
    

        let currentPath = pathMap[depth];

        if(!currentPath)return;

        let component = Vue.prototype.router.mapRoute[currentPath];

        return createElement(component,data)
    }
}