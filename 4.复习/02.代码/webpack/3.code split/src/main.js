// import {add} from './lodash.js';
import jquery from 'jquery'

console.log('main',jquery)

document.body.onclick=function(){
    import(/* webpackChunkName:"lodash123"*/'./lodash.js').then((modules)=>{
        console.log('modules',modules)
        // add()
    })
}