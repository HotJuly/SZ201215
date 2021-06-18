function MVVM(options) {
  this.$options = options || {};
  var data = this._data = this.$options.data;
  var me = this;


  // 01.数据代理
  Object.keys(data).forEach(function (key) {
    me._proxyData(key);
  });

  this._initComputed();

  // 响应式的思路
  //1.如何监视数据变化
  // 2.如何更新对应视图

  //02.数据劫持
  // 1.监视数据的变化->通过重新定义data中所有的属性(通过访问描述符的set方法可以监视数据的变化)
  // 2.对data每个响应式属性都生成了对应的dep对象
  //    每个dep对象都有subs数组,内部存放与他相关的所有watcher
  // 3.当用户更新数据之后,通知watcher更新视图
  observe(data, this);

  //03.模版解析
  // 1.每个插值语法或者指令(每个DOM节点)都会生成对应的watcher对象
        // 每个watcher上都有depIds属性,会存放当前watcher用到的所有的dep(响应式属性)
  //  2.当dep触发notify方法的时候,可以更新每个watcher对应的节点(调用watcher身上的update方法)
  //通过dep和watcher之间的关系,可以精准的通知更新到每个相关节点
  this.$compile = new Compile(options.el || document.body, this);
}

MVVM.prototype = {
  constructor: MVVM,
  $watch: function (key, cb, options) {
    new Watcher(this, key, cb);
  },
  _proxyData: function (key, setter, getter) {
    var me = this;
    setter =
      setter ||
      Object.defineProperty(me, key, {
        configurable: false,
        enumerable: true,
        get: function proxyGetter() {
          return me._data[key];
        },
        set: function proxySetter(newVal) {
          // vm._data.msg = newVal;
          me._data[key] = newVal;
        },
      });
  },

  _initComputed: function () {
    var me = this;
    var computed = this.$options.computed;
    if (typeof computed === "object") {
      Object.keys(computed).forEach(function (key) {
        Object.defineProperty(me, key, {
          get:
            typeof computed[key] === "function"
              ? computed[key]
              : computed[key].get,
          set: function () {},
        });
      });
    }
  },
};
