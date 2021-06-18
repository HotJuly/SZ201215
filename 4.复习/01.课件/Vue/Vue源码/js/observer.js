function Observer(data) {
    // data=>vm._data
    // this->observer实例对象->简称为ob对象
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    constructor: Observer,
    walk: function(data) {
        var me = this;
        Object.keys(data).forEach(function(key) {
            me.convert(key, data[key]);
        });
        
        // Object.keys(data).forEach(function(key) {
        //     ob.convert("msg", "hello MVVM");
        // });
    },
    convert: function(key, val) {
        this.defineReactive(this.data, key, val);
        // ob.defineReactive(vm._data, "msg","hello MVVM" );
    },

    defineReactive: function(data, key, val) {
        // vm._data, "msg","hello MVVM" 
        //初步理解:data中每有一个直系属性,就会生成一个dep对象
        // 最终理解:data中每有一个属性,就会生成一个dep对象
        var dep = new Dep();

        // 深度劫持,如果属性值是对象,会继续劫持他的所有属性
        var childObj = observe(val);

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: function() {
                if (Dep.target) {
                    dep.depend();
                }
                return val;
            },
            set: function(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                childObj = observe(newVal);
                dep.notify();
            }
        });

        // vm._data中本身就有msg属性,但是这里在重写该属性
        // 虽然所有的属性都被重写成访问描述符没有value值,但是Vue通过闭包将每个属性的value值保存下来了
        // Object.defineProperty(vm._data, "msg", {
        //     enumerable: true,
        //     configurable: false,
        //     get: function() {
        //         if (Dep.target) {
        //             dep.depend();
        //         }
        //         return val;
        //     },
        //     set: function(newVal) {
        //         if (newVal === val) {
        //             return;
        //         }
        //         val = newVal;
        //         childObj = observe(newVal);
        //         dep.notify();
        //     }
        // });
    }
};

function observe(value, vm) {
    // 判断当前的value是否是对象,如果不是对象直接返回,不进行数据劫持
    if (!value || typeof value !== 'object') {
        return;
    }

    return new Observer(value);
};


var uid = 0;

function Dep() {
    this.id = uid++;
    this.subs = [];
}

Dep.prototype = {
    addSub: function(sub) {
        // sub->watcher实例
        this.subs.push(sub);
    },

    depend: function() {
        // watcher.addDep(dep);
        Dep.target.addDep(this);
    },

    removeSub: function(sub) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    },

    notify: function() {
        this.subs.forEach(function(sub) {
            // sub=>watcher
            sub.update();
        });
    }
};

Dep.target = null;