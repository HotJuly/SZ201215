const {resolve} = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

/*
    代码分割:code split
    问题:
        如果多个文件共同依赖于一个文件,该文件内容会被两个文件同时打包,导致相同的一段代码存在于多份
            最终,导致项目js文件体积过大,影响到首次渲染速度
    实现:
        多入口配置
            在webpack.config.js中,配置optimization.splitChunks.chunks="all"
            出现问题:文件体积如果太小,小于他的默认的minSize=30000,也不会被切割
                解决方法:optimization.splitChunks.minSize=1

        单入口配置
            在webpack中,使用import函数引入的文件,会被单独切割成为一个js文件,等浏览器执行到import函数的时候,
                才会发送请求获取当前js文件
            使用场景:组件懒加载
            懒加载的好处:可以减小index.js的文件大小,提高首屏渲染速度
            懒加载的缺点:相对于没有使用懒加载之前,懒加载之后,后续页面的渲染速度会变慢
 */

module.exports={
    entry:{
        main:'./src/main.js',
        // home:'./src/home.js'
    },//入口文件地址
    output:{
        filename:"[name].js",//编译之后文件名称
        path:resolve(__dirname,"build")//编译之后文件保存地址
    },
    module:{
        rules:[
            
        ]
    },
    plugins:[
        new HTMLWebpackPlugin({
            template:"./public/index.html"
        })
    ],
    mode:"development",//开发环境development,生产环境production,
    resolve:{
        alias:{
            "@":resolve(__dirname,"./src")//配置路径别名,别名叫做@,路径需要resolve拼接
        },
        extensions:[".vue",".jsx",".js",".json"]//配置文件扩展名,如果引入文件时候没有写具体扩展名,他会尝试该数组所有的扩展名
    },
    optimization:{
        splitChunks:{
            chunks:"all",
            minSize:1
        }
    }
}