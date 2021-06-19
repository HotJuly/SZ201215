import "@/index.less";
import "@/index.css";

//只有在入口文件,或者后续依赖中使用到的文件,才会被webpack一起打包
console.log('hello webpack')

import(/* webpackChunkName:"lodash" */ './lodash.js').then((module)=>{
    console.log(module.default)
})