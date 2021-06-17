function Observer(data) {
    // 保存原data数据到this上
    //data=>vm._data
    //this=>observer实例对象
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    constructor: Observer,
    walk: function(data) {
        //this->observer实例对象
        //data->vm._data
        var me = this;
        // 遍历data数据
        Object.keys(data).forEach(function(key) {
            me.convert(key, data[key]);
        });
        // ["msg"].forEach(function(key) {
        //     observer.convert("msg"", "hello MVVM");
        // });
    },
    convert: function(key, val) {
        // "msg"", "hello MVVM"
        //this.defineReactive(this.data, "msg", "hello MVVM");
        //this.defineReactive(this.data, "person", {name: "jack"});
        this.defineReactive(this.data, key, val);
    },

    // 将属性定义成响应式数据的方法
    defineReactive: function(data, key, val) {
        // vm._data, "msg", "hello MVVM"
        // 每一个响应式属性（data中的数据）
        // 都通过闭包的方式保存了一个dep
        //每个属性对应一个dep实例对象
        var dep = new Dep();
        // 递归遍历
        // 如果当前val是一个对象数据，也要变成响应式
        // 先将里面属性变成响应式，在将外面属性变成响应式
        var childObj = observe(val);

        // 将data的数据重新定义，定义成响应式
        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get: function() {
                if (Dep.target) {
                    // 建立dep和watcher的关系
                    dep.depend();
                }
                return val;
            },
            set: function(newVal) {
                if (newVal === val) {
                    return;
                }
                // 更新data数据
                val = newVal;
                // 新的值是object的话，进行监听
                // 新的数据劫持
                childObj = observe(newVal);
                // 通知订阅者
                // 通知数据的dep对应所有的watcher，调用cb来更新用户界面
                dep.notify();
            }
        });
        // 数据代理->data所有的属性解构到vm身上
        // 数据劫持->将vm._data中所有的属性都重新定义,绑定get和set方法
        // Object.defineProperty(vm._data, "msg", {
        //     enumerable: true, // 可枚举
        //     configurable: false, // 不能再define
        //     get: function() {
        //         if (Dep.target) {
        //             // 建立dep和watcher的关系
        //             dep.depend();
        //         }
        //         return val;
        //     },
        //     set: function(newVal) {
            // 无论是vue1还是vue2,只要数据没发生变化,视图不会重新渲染
        //         if (newVal === val) {
        //             return;
        //         }
        //         // 更新data数据
        //         val = newVal;
        //         // 新的值是object的话，进行监听
        //         // 新的数据劫持
        //         childObj = observe(newVal);
        //         // 通知订阅者
        //         // 通知数据的dep对应所有的watcher，调用cb来更新用户界面
        //         dep.notify();
        //     }
        // });
    }
};

function observe(value, vm) {
    // value=>data vm=>vm
    // 逻辑与 逻辑或
    //a||b a&b  a&a()
    if (!value || typeof value !== 'object') {
        return;
    }

    return new Observer(value);
    // return new Observer(data);
};


var uid = 0;

function Dep() {
    // 唯一id
    this.id = uid++;
    // 保存watcher的容器
    this.subs = [];
}

Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },

    depend: function() {
        // Dep.target 是 watcher
        // watcher.addDep(dep)
        Dep.target.addDep(this);
    },

    removeSub: function(sub) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    },

    notify: function() {
        // 遍历watcher
        this.subs.forEach(function(sub) {
            // 调用watcher.update
            sub.update();
        });
    }
};

Dep.target = null;