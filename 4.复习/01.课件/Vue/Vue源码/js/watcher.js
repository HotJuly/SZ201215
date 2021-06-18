/**
 * 
 * @param {*} vm 组件实例对象
 * @param {*} expOrFn  用于解析的表达式或者函数
 * @param {*} cb 回调函数,如果执行该函数可以更新对应的节点
 */
function Watcher(vm, expOrFn, cb) {
  //this->watcher的实例对象
  this.cb = cb;
  this.vm = vm;
  this.expOrFn = expOrFn;
  this.depIds = {};

  if (typeof expOrFn === "function") {
    this.getter = expOrFn;
  } else {
    this.getter = this.parseGetter(expOrFn.trim());
    // this.getter=function getter(obj) {
    //   for (var i = 0, len = exps.length; i < len; i++) {
    //     if (!obj) return;
    //     obj = obj[exps[i]];
    //   }
    //   return obj;
    // };
  }

  this.value = this.get();
}

Watcher.prototype = {
  constructor: Watcher,
  update: function () {
    this.run();
  },
  run: function () {
    // var value = 'hello mvvm~~~~';
    var value = this.get();
    // var oldVal = 'hello mvvm';
    var oldVal = this.value;
    if (value !== oldVal) {
      //保留当前最新值,留作下次使用
      this.value = value;
      this.cb.call(this.vm, value, oldVal);
    }
  },
  addDep: function (dep) {
    // 1. 每次调用run()的时候会触发相应属性的getter
    // getter里面会触发dep.depend()，继而触发这里的addDep
    // 2. 假如相应属性的dep.id已经在当前watcher的depIds里，说明不是一个新的属性，仅仅是改变了其值而已
    // 则不需要将当前watcher添加到该属性的dep里
    // 3. 假如相应属性是新的属性，则将当前watcher添加到新属性的dep里
    // 如通过 vm.child = {name: 'a'} 改变了 child.name 的值，child.name 就是个新属性
    // 则需要将当前watcher(child.name)加入到新的 child.name 的dep里
    // 因为此时 child.name 是个新值，之前的 setter、dep 都已经失效，如果不把 watcher 加入到新的 child.name 的dep中
    // 通过 child.name = xxx 赋值的时候，对应的 watcher 就收不到通知，等于失效了
    // 4. 每个子属性的watcher在添加到子属性的dep的同时，也会添加到父属性的dep
    // 监听子属性的同时监听父属性的变更，这样，父属性改变时，子属性的watcher也能收到通知进行update
    // 这一步是在 this.get() --> this.getVMVal() 里面完成，forEach时会从父级开始取值，间接调用了它的getter
    // 触发了addDep(), 在整个forEach过程，当前wacher都会加入到每个父级过程属性的dep
    // 例如：当前watcher的是'child.child.name', 那么child, child.child, child.child.name这三个属性的dep都会加入当前watcher


    //判断当前watcher实例中depIds对象上有没有与dep的id相同的key
    if (!this.depIds.hasOwnProperty(dep.id)) {
      //没有相同的key,进入
      // dep.addSub(watcher);
      dep.addSub(this);

      //在depIds中添加dep对象,属性名是dep的id,属性值是dep对象
      this.depIds[dep.id] = dep;
    }
  },
  get: function () {
    //this->watcher的实例对象
    // Dep.target = watcher;
    Dep.target = this;
    // 返回当前最新值
    var value = this.getter.call(this.vm, this.vm);
    Dep.target = null;
    return value;
  },

  parseGetter: function (exp) {
    //exp=>msg  "+msg"
    // 目的:用于过滤特殊字符
    if (/[^\w.$]/.test(exp)) return;

    //exps=>['msg']
    var exps = exp.split(".");

    return function getter(obj) {
      for (var i = 0, len = exps.length; i < len; i++) {
        if (!obj) return;
        // obj = vm['msg'];
        obj = obj[exps[i]];
      }
      return obj;
    };
  },
};
