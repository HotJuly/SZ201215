import "@/index.less";
import "@/index.css";

import $ from 'jquery'

// import {add,reduce,mulitp} from '@/lodash.js';


console.log('hello webpack')
console.log($)

document.querySelector('#btn').onclick=function(){
    import(/* webpackChunkName:"lodash" */'./lodash.js').then(function({add}){
        console.log("arguments",arguments)
        console.log(add(1,2));
    })
}