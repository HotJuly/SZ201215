function Compile(el, vm) {
  // 在当前compile实例对象上缓存vm实例,方便后续使用
  this.$vm = vm;

  // 在当前compile实例对象上缓存模版DOM节点,如果传入的是DOM节点,直接使用,如果不是就查找
  this.$el = this.isElementNode(el) ? el : document.querySelector(el);

  //判断是否有找到模版节点
  if (this.$el) {
    // 将模版节点中所有的直系子节点移入到文档碎片中,方便后续频繁操作(性能优化)
    this.$fragment = this.node2Fragment(this.$el);

    //编译文档碎片中所有的节点内容
    //1.解析插值语法
    //2.解析事件指令
    //3.解析一般指令
    this.init();

    // 将模版解析结束的文档碎片,插入到页模版节点中
    this.$el.appendChild(this.$fragment);
  }
}

Compile.prototype = {
  constructor: Compile,
  node2Fragment: function (el) {
    var fragment = document.createDocumentFragment(),
      child;

    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }

    return fragment;
  },

  init: function () {
    this.compileElement(this.$fragment);
  },

  compileElement: function (el) {
    // 获取文档碎片中所有的子节点组成的伪数组
    // 顺便缓存compile实例对象在me变量中
    var childNodes = el.childNodes,
      me = this;

    //借调数组的slice方法,通过childNodes生成全新的数组(内部进行浅拷贝)
    //遍历当前所有的直系子节点
    [].slice.call(childNodes).forEach(function (node) {
      //获取当前节点的文本内容
      var text = node.textContent;
      //用于匹配插值语法
      var reg = /\{\{(.*)\}\}/;

      //检测当前节点是否是元素节点
      if (me.isElementNode(node)) {
        // 主要用于解析指令
        me.compile(node);

      } else if (me.isTextNode(node) && reg.test(text)) {
        //检测当前节点是否是文本节点,同时内部是否具有插值语法
        //传入两个参数,节点对象,插值语法表达式({{msg}} 获取结果 msg)
        me.compileText(node, RegExp.$1.trim());
      }

      if (node.childNodes && node.childNodes.length) {
        me.compileElement(node);
      }
    });
  },

  compile: function (node) {
    console.log('nodeAttrs',node.attributes)

    // 获取当前节点中所有的标签属性节点
    var nodeAttrs = node.attributes,
      me = this;

    //遍历当前标签属性节点
    [].slice.call(nodeAttrs).forEach(function (attr) {

      //获取标签属性节点的key值
      var attrName = attr.name;

      //判断当前标签属性节点是否是指令,例如class就不是,v-on:click就是
      if (me.isDirective(attrName)) {

        //获取当前标签属性节点的value值
        var exp = attr.value;

        //将指令前两位切除,就是v-去除
        var dir = attrName.substring(2);
        if (me.isEventDirective(dir)) {
          //调用事件指令的专属函数,并准备好所需参数
          // 事件绑定需要三要素:事件源(node),事件名(dir),事件回调(me.$vm + exp)
          compileUtil.eventHandler(node, me.$vm, exp, dir);
        } else {
          compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
        }

        //当指令被解析结束,就删除该指令的标签属性节点
        node.removeAttribute(attrName);
      }
    });
  },

  compileText: function (node, exp) {
    compileUtil.text(node, this.$vm, exp);
  },

  isDirective: function (attr) {
    return attr.indexOf("v-") == 0;
  },

  isEventDirective: function (dir) {
    return dir.indexOf("on") === 0;
  },

  isElementNode: function (node) {
    return node.nodeType == 1;
  },

  isTextNode: function (node) {
    return node.nodeType == 3;
  },
};

var compileUtil = {
  text: function (node, vm, exp) {
    // 传入四个参数
    /*
      node->文本节点对象
      vm  ->组件实例对象
      exp ->插值语法表达式
    */
    this.bind(node, vm, exp, "text");
  },
  html: function (node, vm, exp) {
    this.bind(node, vm, exp, "html");
  },
  model: function (node, vm, exp) {
    this.bind(node, vm, exp, "model");

    var me = this,
      val = this._getVMVal(vm, exp);
    node.addEventListener("input", function (e) {
      var newValue = e.target.value;
      if (val === newValue) {
        return;
      }

      me._setVMVal(vm, exp, newValue);
      val = newValue;
    });
  },
  class: function (node, vm, exp) {
    this.bind(node, vm, exp, "class");
  },

  bind: function (node, vm, exp, dir) {
    // 通过dir参数,找到对应的更新器函数
    //如果是插值语法,会找到textUpdater,专门用于更新文本节点
    var updaterFn = updater[dir + "Updater"];

    //如果具有对应的更新器,就调用这个更新器(传入两个参数,需要修改的节点对象,即将更新的文本内容(data中的数据))
    updaterFn && updaterFn(node, this._getVMVal(vm, exp));

    new Watcher(vm, exp, function (value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue);
    });
  },

  eventHandler: function (node, vm, exp, dir) {
    //将on:click以:进行切割,获取到真正的事件名click
    //通过vm实例对象,配合exp表达式,获取到事件回调函数
    var eventType = dir.split(":")[1],
      fn = vm.$options.methods && vm.$options.methods[exp];

    if (eventType && fn) {
      // 如果所有要素都具备,给当前节点绑定原生DOM事件
      // 注意:所有的事件回调中的this都被强制绑定为vm实例对象
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },

  _getVMVal: function (vm, exp) {
    var val = vm;
    // 将表达式通过.符号进行切割,生成key值组成的数组
    exp = exp.split(".");
    exp.forEach(function (k) {
      // exp->persona.name
      // val=vm.person
      //  val=val.name
      val = val[k];
    });
    return val;
  },

  _setVMVal: function (vm, exp, value) {
    var val = vm;
    exp = exp.split(".");
    exp.forEach(function (k, i) {
      if (i < exp.length - 1) {
        val = val[k];
      } else {
        val[k] = value;
      }
    });
  },
};

var updater = {
  textUpdater: function (node, value) {
    node.textContent = typeof value == "undefined" ? "" : value;
  },

  htmlUpdater: function (node, value) {
    node.innerHTML = typeof value == "undefined" ? "" : value;
  },

  classUpdater: function (node, value, oldValue) {
    var className = node.className;
    className = className.replace(oldValue, "").replace(/\s$/, "");

    var space = className && String(value) ? " " : "";

    node.className = className + space + value;
  },

  modelUpdater: function (node, value, oldValue) {
    node.value = typeof value == "undefined" ? "" : value;
  },
};
