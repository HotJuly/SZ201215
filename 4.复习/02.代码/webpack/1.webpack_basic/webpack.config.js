const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports={
    entry:"./src/main.js",
    output:{
        filename:"[name].js",
        path:resolve(__dirname,'./build')
    },
    /*
        loader和plugin的区别
            webpack只认识js
            例如:less文件,webpack就不认识,所以需要将其他类型文件都编译成js代码
            less-loader只是帮助webpack的一个桥梁,他并不具备解析文件的能力,他只是帮助webpack调用less
            plugin主要是为项目实现某些特定功能
    */
    module:{
        rules:[
            {
                test:/\.less$/,
                use:[
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:"./public/index.html"
        })
    ],
    mode:"development",
    devServer:{
        proxy:{
            "/api":{
                target:"www.baidu.com",
                pathRewrite:{
                    '^/api':''
                }
            }
        },
        // hot:true,
        // hotOnly:true
    },
    resolve:{
        alias:{
            '@':resolve(__dirname,'./src')
        },
        extensions:['.js','.jsx','.vue','.less']
    }
}