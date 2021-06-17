
const callbacks = []
let pending = false
let timerFunc;

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

if (typeof Promise !== 'undefined') {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
  }
}


export function nextTick (cb, vm) {
  callbacks.push(() => {
    if (cb) {
        cb.call(vm)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
}


/*
nextTick源码重点:
  1.所有的nextTick共用一个.then微任务
  2.当数据更新的时候,会执行update方法,用于更新视图(页面)
    1.期间会触发nextTick,会将更新视图的函数传递给nextTick(更新视图的具体时间是在微任务队列中)
  3.由于更新数据,回调函数数组中第一项就是更新DOM,所以Vue保证nextTick的回调一定获取到最新的DOM
*/