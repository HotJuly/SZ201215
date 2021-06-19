const {resolve} = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

/*
    离线缓存:PWA
        目的:当用户无法连接网络时候,可以看到网页的部分内容,一般使用于移动端页面
        实现:
            - 下载workbox-webpack-plugin并引入
            - 到plugins内部配置插件
                new WorkboxPlugin.GenerateSW({
                    // 这些选项帮助快速启用 ServiceWorkers
                    // 不允许遗留任何“旧的” ServiceWorkers
                    clientsClaim: true,
                    skipWaiting: true,
                })
            -   去入口文件添加js代码,用于注册Service Workers
                if ('serviceWorker' in navigator) {
                    window.addEventListener('load', () => {
                    navigator.serviceWorker.register('./service-worker.js').then(registration => {
                        console.log('SW registered: ', registration);
                    }).catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
                    });
                }
                注意:需要将register('./service-worker.js')路径需要写相对路径,公司开发,写绝对路径即可
*/

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
        }),
        new WorkboxPlugin.GenerateSW({
            // 这些选项帮助快速启用 ServiceWorkers
            // 不允许遗留任何“旧的” ServiceWorkers
            clientsClaim: true,
            skipWaiting: true,
          }),
    ],
    mode:"production",//开发环境development,生产环境production,
    resolve:{
        alias:{
            "@":resolve(__dirname,"./src")//配置路径别名,别名叫做@,路径需要resolve拼接
        },
        extensions:[".vue",".jsx",".js",".json"]//配置文件扩展名,如果引入文件时候没有写具体扩展名,他会尝试该数组所有的扩展名
    }
}