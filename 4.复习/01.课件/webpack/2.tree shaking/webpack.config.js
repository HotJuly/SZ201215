const {resolve} = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

/*
    树摇:tree shaking
    问题:明明没有使用上的代码,依旧会被打包到main.js中
        1)编译时间更久
        2)编译之后的js文件体积过大->用户请求时间延长,降低首屏渲染速度
    实现:
        开启TerserPlugin插件
        -   将mode设置为production
        -   模块化引入必须要用ES6 Module
 */

module.exports={
    entry:"./src/main.js",//入口文件地址
    output:{
        filename:"[name].js",//编译之后文件名称
        path:resolve(__dirname,"build")//编译之后文件保存地址
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    "style-loader",
                    "css-loader"
                ]
                //一般用于配置多个loader
                // loader:""  一般用于配置一个loader
            },
            {
                test:/\.less$/,
                use:[
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
                //一般用于配置多个loader
                // loader:""  一般用于配置一个loader
            }
        ]
    },
    plugins:[
        new HTMLWebpackPlugin({
            template:"./public/index.html"
        })
    ],
    mode:"production",//开发环境development,生产环境production,
    resolve:{
        alias:{
            "@":resolve(__dirname,"./src")//配置路径别名,别名叫做@,路径需要resolve拼接
        },
        extensions:[".vue",".jsx",".js",".json"]//配置文件扩展名,如果引入文件时候没有写具体扩展名,他会尝试该数组所有的扩展名
    }
}