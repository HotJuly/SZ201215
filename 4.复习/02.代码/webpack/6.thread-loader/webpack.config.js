const {resolve} = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

/*
    多进程打包:thread-loader
    问题:由于工作中,实际项目体积可能较大,大部分都是js代码,而webpack默认使用单进程编译代码,导致速度较慢
    解决:
        一个进程不够,我们就开多个
        开启的进程数量,与自身电脑的CPU核数有关
        注意:
            开启额外的进程需要花费额外的开销
                -   开启进程需要600ms
                -   进程与进程之间通信也会花费时间
    实现:
        哪个rule需要帮助,就在他的loader数组最前面添加一个thread-loader
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
            },
            {
                test:/\.js$/,
                use:[
                    "thread-loader",
                    {
                        loader:"babel-loader",
                        options:{
                            presets:["@babel/preset-env"]
                        }
                    }
                ]
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