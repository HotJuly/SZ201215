const {resolve} = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports={
    entry:"./src/main.js",//入口文件地址
    output:{
        filename:"[name].js",//编译之后文件名称
        path:resolve(__dirname,"build")//编译之后文件保存地址
    },
    /*loader与plugin的区别
        webpack自身只认识js文件,有许多其他类型的文件或代码,他无法编译
        loader:可以帮助webpack编译他所不认识的文件或代码
        plugin:扩展功能块
    */
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
    mode:"development",//开发环境development,生产环境production,
    devServer:{
        port:8089,
        proxy:{
            "/v2/api":{
                target:"http://atguigu.com",
                changeOrigin:true,
                pathRewrite:{
                    "^/v2/api":""
                }
            }
        },
        compress:true,   //开启gzip,
        hot:true
        // hotOnly:true 开启热模替换HMR hot会刷新当前页面 hotOnly不会刷新
    },
    resolve:{
        alias:{
            "@":resolve(__dirname,"./src")//配置路径别名,别名叫做@,路径需要resolve拼接
        },
        extensions:[".vue",".jsx",".js",".json"]//配置文件扩展名,如果引入文件时候没有写具体扩展名,他会尝试该数组所有的扩展名
    }
}