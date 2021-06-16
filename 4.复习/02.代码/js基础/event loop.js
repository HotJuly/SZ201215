// const fs  = require('fs');

// setTimeout(()=>{
//     console.log('setTimeout1')
// },1)

// setImmediate(()=>{
//     console.log('setImmediate1')
// })

// fs.readFile('./01.原型.html',()=>{

//     console.log('readFile')

//     setTimeout(()=>{
//         console.log('setTimeout2')
//     },1)
    
//     setImmediate(()=>{
//         console.log('setImmediate2')
//     })
// })


// for(var i=0;i<100000;i++){

// }

//Node中,process.nextTick优先级最高
//Node中,nextTick和.then是两个微任务队列,nextTick的微任务队列优先于.then的微任务队列
//必须先清空当前微任务队列,才会执行下一个微任务队列

Promise.resolve().then(()=>{
    console.log('then1')

    process.nextTick(()=>{
        console.log('nextTick1')
    })

    Promise.resolve().then(()=>{
        console.log('then2')
    })
})


// Promise.resolve().then(()=>{
//     console.log('then2')
// })

// process.nextTick(()=>{
//     console.log('nextTick1')
// })
