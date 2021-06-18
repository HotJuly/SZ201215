function Observer(data) {
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
    },
    convert: function(key, val) {
        this.defineReactive(this.data, key, val);
    },

    defineReactive: function(data, key, val) {
        //data中每有一个属性,就会生成一个dep对象
        var dep = new Dep();
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
            // newVal=>hello mvvm~~~~
            // val=>hello mvvm
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