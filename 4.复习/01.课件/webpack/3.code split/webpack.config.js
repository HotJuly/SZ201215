const {resolve} = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

/*
    代码分割:code split
    问题:多个入口文件中都使用到了一个相同的文件的代码,他会每个入口对应的输出文件都会拥有这段代码
        1)编译时间更久
        2)编译之后的js文件体积过大->明明是同一份代码,但是输出多次,浪费性能->用户请求时间延长,降低首屏渲染速度
    实现:
        - 配置多入口
        - 配置optimization.splitChunks.chunks="all"
            会提取多个文件重复使用的代码,默认的最小打包体积30000B,后期可以自己配置该属性minSize
        
        - 配置单入口
            配合import()实现代码分割,实现部分js代码懒加载
                注意:  
                        1)只要是使用import()引入的文件,他都会单独生成一个js文件
                        2)如果想要给这个文件取名,可以配置webpackChunkName="文件名"

        Vue路由组件懒加载
            const Foo = () => import('./components/foo.vue')
            routes:[
                {
                    path:'/foo',
                    component:Foo
                }
            ]

        React懒加载
            Suspense和lazy
            import {Suspense,lazy} from 'react'
            
            const Foo = lazy(() => import(''./components/foo.vue''))

            <Suspense fallback={<div>loading</div>}>
                <Route path="/foo" component={Foo}>
            </Suspense>
 */

module.exports={
    entry:{
        main:"./src/main.js",
        // home:"./src/home.js"
    },//入口文件地址
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
    },
    optimization:{
        splitChunks:{
            chunks:"all",
            minSize:1
        }
    }
}