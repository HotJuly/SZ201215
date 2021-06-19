const {resolve} = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/*
    cache:缓存
        强缓存->cache-control:maxAge=36000
            如果第二次请求资源,如果距离第一次请求资源没有超过maxAge,就会使用之前请求的文件

        协商缓存->e-tag和lastmodified
            如果第二次请求资源,文件hash值以及最后修改时间都与上次请求相同,就会使用之前请求的文件

        问题:由于当前编译文件内容发生变化,但是名称不变,导致用户无法使用最新的资源,看不到最新的效果
            方案1:使用hash值(hash值是每次项目构建时候生成的唯一值)
                问题:所有文件都共享当前项目构建时候的hash值

            方案2:使用chunkhash值(chunkhash值是每个入口文件以及后续依赖构建时候生成的唯一值)
                问题:同一个入口文件内的所有文件都共享当前入口文件构建时候的chunkhash值

            方案3:使用contenthash值(contenthash值是每个文件构建时候生成的唯一值)(比较完美的解决方法)
                问题:如果引入其他文件,引入的文件内容发生变化,那么引入文件的名称也会发生变化,导致入口文件名称也发生变化
                解决:
                    - 配置optimization
                        会将所有的引入值保存在runtime文件内部,保证没有修改的文件不会因为依赖文件变化而变化
                        optimization:{
                            runtimeChunk:{
                                name:entrypoint=>`runtime~${entrypoint.name}`
                            }
                        }

 */

module.exports={
    entry:"./src/main.js",//入口文件地址
    output:{
        filename:"[name].[contenthash:8].js",//编译之后文件名称
        path:resolve(__dirname,"./server/build")//编译之后文件保存地址
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
                    MiniCssExtractPlugin.loader,
                    // "style-loader",
                    "css-loader"
                ]
                //一般用于配置多个loader
                // loader:""  一般用于配置一个loader
            },
            {
                test:/\.less$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    // "style-loader",
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
        }),
        new MiniCssExtractPlugin({
            filename:"[name].[contenthash:8].css"
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
        runtimeChunk:{
            name:entrypoint=>`runtime~${entrypoint.name}`
        }
    }
}