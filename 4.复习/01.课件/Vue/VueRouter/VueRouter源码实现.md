# VueRouter源码实现

1. VueRouter提供的内容
   1. 组件
      1. router-link	实现声明式跳转
      2. router-view   显示对应的路由组件
   2. 对象
      1. $router	路由器实例,用于提供操作路由历史栈的方法
         1. push方法	控制路由的切换
      2. $route      路由实例,用于提供跟当前路由相关的数据
         1. path  当前的路由地址
   3. 构造函数
      1. new VueRouter(配置对象)	用于生成路由器实例
2. 我们需要交给VueRouter的内容
   1. 配置对象
      1. mode
         1. hash		hash模式
            1. 底层原理:使用window.location.hash操作历史记录栈
            2. 优点:兼容性较好
            3. 缺点:
               1. 路径太丑了
               2. 会影响锚点功能
         2. histroy    history模式
            1. 底层原理:使用window.histroy操作历史记录栈
            2. 优点:路径好看
            3. 缺点:兼容性较差,histroy是H5新增特性
      2. routes
         1. 数据类型:routeObj[]
         2. 内部存放路由对象
            1. path	路由路径
            2. component    路由组件
3. VueRouter介绍
   1. 实现SPA应用(单页面应用,浏览器刷新按钮不会发生变化)
   2. 它是Vue的插件库(Vue.use(),必须提供install方法)

