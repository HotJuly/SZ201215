# 5. Vue面试题

## 1. Vue中更新是异步还是同步的,为什么?

> 数据是同步更新，视图是异步更新，因为如果视图更新是同步的，那会导致多次渲染浪费不必要的性能，没必要，内部做了去重(重新更新的值)和防抖(只更新最后一次)

## 2. Vue中nextTick的原理是什么?

> 因为更新是异步的，有时候外界可能会在更新数据之后想拿到最新的dom元素进行操作，Vue为了让用户达到统一的效果，内部使用了nextTick，也要让用户使用nextTick， vue2中nextTick做了兼容，如果Promise支持，就用Promise.resolve().then()来处理，如果不支持，就用mutationObserve来处理，如果还不支持，就用setimmediate来处理，最后还不支持，就用setTimeout,vue3中nextTick放弃兼容，直接使用Promise.resolve().then(),nextTick内部也是做了防抖功能的,防止用户多次调用nextTick

## 3. Vue中extend的原理是什么?

> 传入一个对象，可以返回一个类，类名叫VueComponent，这个类继承自Vue，可以拥有Vue原型上所有的方法,传入的配置项会和Vue.options进行合并,子组件的注册使用Vue.component(),其实内部也是调用了extend将组件配置对象转换成一个继承Vue的类

## 4. Vue中生命周期的原理是什么?

> 用了策略模式，将所有的钩子函数以字符串的方式放入一个数组中，然后合并的时候会将外部存在的钩子重写成函数,
> 采用先进先出的方式来进行管理钩子函数，当外部调用钩子的时候，会触发callHooks函数，内部会按顺序依次调用,
> 并且将钩子函数内部的this修改为Vue的实例,生命周期中的钩子在不同时机触发即可

## 5. Vue中watch的原理是什么?

> 其实就是一个用户Watcher，当key值发生变化的时候，会调用key对应的handler函数
> 其实在watch对象中书写和手动调用vm.$watch其实原理都是一样，watch对象中的handler函数
> 都会被转换成vm.$watch,watch中的key(表达式)其实最后会在vm中取值，然后当key值发生变化，会通知watcher去更新，等更新完毕，调用用户的handler回调，传入新值和老值

## 6. Vue中computed的原理是什么?

> 本质其实也是一个Watcher,但是具有缓存功能，默认是不触发的，当在页面上进行取值的时候会触发，computed中的每一个key都是被定义在vm上的
> 对应的value其实就是Object.defineProperty中的get或者get/set,当依赖的值发生变化的时候，会重新执行
> 如果依赖的值没有发生变化，不会重新执行，会返回上一次的值(缓存)
>
> 计算属性中的key是没有收集渲染Watcher的，只有计算Watcher,计算属性中所依赖的值都有一个Dep，我们应该让这些Dep去收集渲染Watcher
> 这样的话，当依赖的值发生了变化，会通知渲染Watcher去更新
>
> 内部缓存是通过一个`dirty`变量作为开关来进行控制

## 7. Vue中mixin的原理是什么?

> Vue源码中在Vue上增加了一个静态属性options,默认为一个空对象,当我们去调用mixin函数进行混合的时候
> 内部会进行合并，不同的属性会应用不同的合并策略，内部使用了策略模式(设计模式)来解决if/else过多的问题
>
> 优点:
> 	可以混入一些代码来达到代码复用的功能,vuex/vuerouter源码中就使用了mixin来混入beforeCreated钩子，让所有组件都有$store、$router/$route属性
> 缺点:
> 	可能会滥用mixin，导致数据来源不清晰

## 8. Vue中Diff算法有什么用?能不能具体说一下?

> diff算法采用分层求异的方式，来控制粒度的最小变化，目的就是尽可能复用老的节点,只对比同层级节点，不会跨层级比较，vue2源码内部会采用双指针的方式来进行对比
> 注意:
> 初始化挂载不会进行diff算法比较，因为diff算法依赖的是新旧的虚拟dom，第一次挂载只会生成一次虚拟dom
> 在更新时会生成新的虚拟dom,这时候新旧虚拟dom会进行比较，差别化更新
>
> 比较策略:
>
> 1. 如果新旧节点不一样，会直接创建一个新标签替换老标签
>
>   2. 如果标签一样，文本不一样，会用新的文本替换老的文本
>
>   3. 如果标签一样，比较属性，设置属性和样式
>
>   4. 新旧节点对比子节点策略:
> 	  4-1. 如果老节点有孩子，新节点没孩子，直接清空老节点孩子
>
>     4-2. 如果新节点有孩子，老节点没孩子，直接循环遍历新节点依次添加
>     4-3. 如果都有孩子，内部会采用双指针的方式进行比较,先对比头，头如果不一样，会进行尾尾比较，如果尾不一样，会进行老头和新尾比较，如果 还不一样，会进行老尾和新头比较，注意:这些比较的时候会先判断标签是否一样，在判断key是否一样，判断key的好处在于尽最大可能复用老节点，key对比index的好处是:key不会发生变化，而index可能会发生变化，导致判断失误没有复用老节点，如果最后这些比较都不一样，会进行乱序比较
>
>   5. 乱序比较:
>
>   老节点: A => B => C => D 
>
>   新节点: B => D => A => C => E
>
>   做一个映射表
>
>   const obj = {A:0,B:1,C:2,D:3}
>
>   看新节点是否存在于映射表中,如果存在就复用，不存在就新增,比较过程如下:
>
>   1. 第一次:
>
>      老节点: A => B => C => D
>
>      新节点: B => D => A => C => E
>
>      比较B: 发现存在,结果如下
>
>      B => A => null => C => D
>
>   2. 第二次:
>
>      老节点: B => A => null => C => D
>
>      新节点: B => D => A => C => E
>
>      比较D，发现存在，结果如下
>
>      B => D => A => null => C => null
>
>   3. 第三次
>
>      老节点: B => D => A => null => C => null
>
>      新节点: B => D => A => C => E
>
>      比较A,发现存在，结果如下
>
>      B => D => A => null => null => C => null
>
>   4. 第四次
>
>      老节点: B => D => A => null => null => C => null 
>
>      新节点: B => D => A => C => E
>
>      比较C,发现存在，结果如下
>
>      B => D => A => C => null => null => null => null
>
>   5. 第五次
>
>      老节点: B => D => A => C => null => null => null => null
>
>      新节点: B => D => A => C => E
>
>      比较E,发现不存在，就创建E元素，结果如下
>
>       B => D => A => C => E => null => null => null => null
>
>      ，注意: 以上的null只是体现在映射表obj中做占位使用

## 9. Vue中数组的响应式是如何处理的?

> 数组的处理和对象的处理是不一样的，对象会进行遍历，将里面每一个值定义成响应式，而数组是通过重写数组的7个方法来进行处理的，7个方法分别是
> 1. push
> 2. pop
> 3. unshift
> 4. shift
> 5. reverse
> 6. sort
> 7. splice
> 如果调用了这7个方法，会通知watcher去更新，如果调用了其中新增的方法，会拿到新增的值，看这个新增的值是否为引用类型，如果为引用类型，会重新定义成响应式，所以一般不建议数组结构层次嵌套太深，或者使用大数组冻结来做性能优化，数组中如果嵌套的是引用类型的话，也会被定义成响应式

## 10. Vue中data为什么必须是一个函数？

> 因为JavaScript的特性所导致，在组件中，data必须以函数的形式存在，不可以是对象。
> 组件中的data写成一个函数，数据以函数返回值的形式定义，这样每次复用组件的时候，都会返回一份新的data，相当于每个组件实例都有自己私有的数据空间，它们只负责各自维护的数据，不会造成混乱。而单纯的写成对象形式，就是所有的组件实例共用了一个data，这样改一个全都改了。new Vue的时候data可以写成对象，因为产生的是一份实例，多次new Vue实例上的数据不会被共享

## 11. Vue中name属性的好处是什么?

> 主要是让组件自己记录自己
> 优点:
>
> 	1. 便于开发工具调试，如: vue-devtools
> 	2. 便于在开发工具中快速的找到当前组件
> 	3. 可以被当成递归组件来使用

## 12. 发送请求一般在哪个生命周期?

> 一般我个人喜欢在mounted中发送请求
> 优点:
>
> 1. 不会阻塞页面的渲染速度
>
>   2. 可以在mounted中拿到一些dom元素
> 	缺点:
> 	可能会导致数据更新慢一点点，模板中如果a.b.c的时候可能会报错，因为是先渲染的模板，数据这时候还没有请求回来，可以在计算属性中把数据映射出来，比如: return state.a.b.c || []
>
> 一般可能有的人喜欢在created中发送请求，可能考虑的是服务端渲染吧或者减少页面的loading加载时间，服务端渲染没有mounted这个钩子函数

## 13. Vue的生命周期介绍一下,并介绍可以在每个生命周期中干什么?

> Vue生命周期总共有12个,分别是
> 1. beforeCreate
>
> 2. created
>
> 3. beforeMount
>
> 4. mounted
>
> 5. beforeUpdate
>
> 6. updated
>
> 7. beforeDestroy
>
> 8. destroyed
>
> 9. activated
>
> 10. deactivated
>
> 11. errorCaptured
>
>    其中前面8个是我们主要用的，activated和deactivated这二个钩子是keep-alive组件的，errorCaptured是捕获一个来自子孙组件的错误时被调用

> beforeCreate:
>
>  	1. 父子关系确认($parent/$children已经有了)
>  	2. 根元素确认($root)
>  	3. 初始化自定义事件,如:$on/$emit/$once/$off
>  	4. 初始化插槽($slots),初始化\_c函数/$createElement函数(这两个函数内部都是调用createElement函数来创建虚拟节点)
>  	5. 将$attrs/$listeners定义成响应式的属性
>  	6. 在实例上初始化一些变量,如：_isMounted,_isDestroyed,_watcher...等
>  	7. 此时数据还没有被代理，还不是响应式的
>  	8. 调用beforeCreate钩子函数

> created:
>
> 1. 初始化inject，inject用来注入数据，源码内部就是一个while循环，从组件自身向父级查找，一直找到父级组件中有provide属性的，一般写业务代码不推荐用，因为数据来源不清晰，自己封装组件的时候可能会用，可以实现爷/孙通讯，此时数据还不是响应式的
> 2. 初始化props、初始化methods、初始化data、初始化computed、初始化watch，是有先后顺序的
> 3. 在初始化data的时候会进行数据劫持，此时数据分为2种，一种是对象，一种是数组，内部会循环对象,将对象中的每个属性都调用defineReactive函数定义成响应式,defineReactive函数内部是用Object.defineProperty来定义的，如果对象中的值还是对象的话，会递归定义成响应式，如果是数组的话，会劫持数组的7个方法，分别是'push', 'pop','shift','unshift','splice', 'sort', 'reverse',因为他们都会影响原数组，内部会将这7个方法进行重写，用户调用这7个方法时，实际上还是调用数组本身的方法，只不过内部会去通知watcher更新，而且如果用户是用push、unshift、splice这3个方法给数组增加数据时，内部会拿到增加的数据，判断这个数据是不是对象，如果是对象，会再次定义成响应式，被劫持过的属性都有一个\_\_ob\_\_属性
> 4. 初始化provide,如果provide的值为一个函数时，会调用这个函数，并且将内部的this指向当前组件实例
> 5. 调用created钩子函数

> beforeMount:
>
> 1. 看实例中是否提供了render函数，如果没有提供，会调用compileToFunction编译成函数,compileToFunction中主要做了3件事
>    1. 将模板编译成ast语法树(ast用是来描述语法层面的信息，比如标签是什么，属性是什么等等)，内部会用正则不停的去匹配标签中的内容，匹配一点就删一点，最后匹配结束，模板也被删完了，返回这个ast树
>    2. 将ast语法树编译成字符串的代码,例如:<div id='#app'>1</div>会先转成{tag:'div',attrs:[{id:'app'}],1},然后编译成字符串代码，如: \_c('div',{id:"app"},\_v(1)) ,这个代码是字符串的
>    3. 通过new Function + with语法将字符串代码编译成函数，以上代码变成
>       ƒ anonymous(){with(this){return \_c('div',{id:"app"},\_v(1)) }}
> 2. 以上编译出来的函数就是render函数
> 3. 调用beforeMount钩子函数

> mounted:
>
> 1. 创建一个渲染Watcher
> 2. 在Watcher中做了已下三件事:
>    1. 调用pushTarget函数将当前watcher存起来
>    2. 调用render函数
>    3. 调用popTarget函数将当前watcher删掉
> 3. 在调用render函数的时候，会在当前组件实例上取值，取值就会触发Object.defineProperty中的get,内部会收集依赖，进行dep/watcher的双向关联,然后返回真实的值，接着内部会先创建虚拟节点，然后更新页面
> 4. 调用mounted钩子函数

> beforeUpdate/updated:
>
> 1. 当外界更新data中的数据时，会触发set，因为之前渲染的时候收集了依赖，所以我们会通知watcher去更新，然后再次创建虚拟节点，这一次创建的虚拟节点会和之前创建的虚拟节点进行diff对比，然后局部更新页面
> 2. 在局部更新页面之前调用beforeUpdate钩子函数
> 3. 在局部更新页面之后调用updated钩子函数

> beforeDestroy/destroyed:
>
> 1. 当组件被卸载时，会清空组件中绑定的事件，会在当前父组件中的$children中移除自己，会在当前组件中移除$parent,清空watcher等等...
> 2. 当组件被卸载前调用beforeDestroy钩子函数
> 3. 当组件被卸载后调用destroyed钩子函数

## 14. 父子组件的生命周期执行流程是什么?

> 初始化挂载时:
>
> 1. 调用父组件的beforeCreate函数
>
> 2. 调用父组件的created函数
>
> 3. 调用父组件的beforeMount函数
>
> 4. 调用子组件的beforeCreate函数
>
> 5. 调用子组件的created函数
>
> 6. 调用子组件的beforeMount函数
>
> 7. 调用子组件的mounted函数
>
> 8. 调用父组件的mounted函数
>
> 更新时:
>
> 1. 看更新的数据是在子组件还是父组件，如果是在父组件中，那么只调用父组件的beforeUpdate和updated函数,如果是在子组件中，那么只调用子组件的beforeUpdate和updated函数，这样的结果是因为被diff算法优化了
>
> 2. 如果更新的数据时在父组件，并且这个数据传递给了子组件，那么更新的流程是这样的
>
>    1. 触发父组件的beforeUpdate函数
>    2. 触发子组件的beforeUpdate函数
>    3. 触发子组件的updated函数
>    4. 触发父组件的updated函数
>
> 3. 卸载时:
>
>    如果卸载的是父组件,那么执行的流程是这样的
>
>    1. 触发父组件的beforeDestroy函数
>    2. 触发子组件的beforeDestroy函数
>    3. 触发子组件的destroyed函数
>    4. 触发父组件的destroyed函数

## 15. Computed和Watch的区别

> **computed：** 是计算属性，依赖其它属性值，并且 computed 的值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed 的值
>
> **watch：** 更多的是观察的作用，类似于某些数据的监听回调 ，每当监听的数据变化时都会执行回调进行后续操作；
>
> **场景**
>
> - 当我们需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时，都要重新计算；
> - 当我们需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用 watch 选项允许我们执行异步操作 ( 访问一个 API )，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的

## 16. 给对象新增一个属性/给数组下标/给数组length进行赋值页面会更新么

>因为Object.defineProperty的限制,Vue 不能检测到以上的变化，解决方案如下:
>
>1. Vue.set
>2. vm.$set
>3. 如果是数组，可以用数组被改写的7个方法
>4. 可以重新对整体进行赋值

## 17. v-model的原理

> v-model的作用是用来进行双向数据绑定
>
> 原理: 在模板编译的时候会被编译成以下
>
> 1. 如果在text 和 textarea 元素上使用v-model，那么v-model就是value 属性和 input 事件的语法糖(更简单)
> 2. 如果在checkbox 和 radio元素上使用v-model,那么v-model就是checked 属性和 change 事件的语法糖
> 3. 如果在select元素上使用v-model,那么v-model就是value属性和change 事件的语法糖
> 4. 如果是在组件上使用v-model,那么v-model就是value 属性和 input 事件的语法糖

## 18. v-if和v-show的区别

> 区别:
>
> 1. v-if是条件渲染,根据条件的不同来决定dom是否被渲染
> 2. v-show是控制css属性的display属性来控制显示/隐藏
>
> 场景:
>
> v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景；v-show 则适用于需要非常频繁切换条件的场景。

## 19. v-if和v-for的优先级,怎么使用最好

> v-for的优先级更高,会先循环完所有数据，等循环完了再通过v-if进行判断，影响性能
>
> 解决方案:
>
> 1. 通过计算属性来对数据进行处理，处理完之后在返回数据用于渲染
> 2. 可以在外层包一个template标签，然后在template标签上写v-if

## 20. vue组件通信有哪些方式

> 1. props实现父子互相通信
>
>    1. 父传子: 直接在子组件上绑定动态数据，子组件通过props属性来接收并约束类型
>    2. 子传父 : 在子组件上绑定一个方法，子组件通过调用这个方法传入相应的数据来达到子向父通信
>
> 2. $on/$emit实现父子通信
>
>    在子组件上使用@xxx=‘fn’来绑定事件,子组件中通过$emit来触发fn
>
>    原理: 内部自己实现了一套自定义事件(发布订阅模式)
>
> 3. $parent/$children实现父子通信,也可以实现爷孙通信
>
>    1. $parent可以获取父组件的实例
>    2. $children可以获取当前组件的所有子组件实例
>
> 4. ref实现父子通信
>
>    1. 在普通元素上使用ref是获取dom元素
>    2. 在组件上使用ref是获取组件实例,element-ui中的form组件进行表单校验时就是通过ref来获取form组件中的validate方法来进行验证的
>
> 5. EventBus
>
>    使用$on/$emit来实现所有组件通信，原理是通过公共的Vue来实现，一般不会这种方式来进行业务逻辑数据的传递，可以在Vue原型上挂载一些公共函数，如:loading,message函数等..
>
> 6. $attrs/$listeners适用于爷孙/父子/隔代通信
>
>    1. $attrs中包含了所有父作用域中所有未进行prop生命的属性，class 和 style 除外
>    2. $listeners中包含了父作用域中不含 .native 修饰器的所有v-on事件
>
> 7. provide/inject适用于爷孙/父子/隔代通信
>
>    1. 在祖先组件中通过provide来提供数据，在子组件中通过inject来注入数据
>    2. 一般业务数据不推荐使用，数据来源不清晰
>    3. 适用于自己封装组件，因为可以明确的知道数据来源
>
> 8. vuex使用任意组件通信(详情看30)
>
> 9. .... 等等

## 21. 虚拟dom的优点

> 1. 无需手动操作 DOM
> 2. 利用diff算法进行优化，局部更新
> 3. 跨平台，因为虚拟dom本质就是一个js对象，所以在能运行js代码的环境中都可以使用，例如:服务端渲染

## 22. Vue中响应式数据的原理

> Vue 中主要通过以下 4 个步骤来实现响应式数据的
>
> 1. 实现一个监听器(Observer)，对数据对象进行遍历，包括子属性对象的属性，利用 Object.defineProperty() 对属性都加上 setter 和 getter。这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化
> 2. 实现一个解析器(Compile),解析 Vue 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新
> 3. 实现一个订阅者(Watcher)：Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁 ，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。
> 4. 实现一个订阅器(Dep)：订阅器采用 发布-订阅 设计模式，用来收集订阅者 Watcher，对监听器 Observer 和 订阅者 Watcher 进行统一管理

## 23. Vue中模板编译的原理

> 1. 将模板编译成ast语法树(ast用是来描述语法层面的信息，比如标签是什么，属性是什么等等)，内部会用正则不停的去匹配标签中的内容，匹配一点就删一点，最后匹配结束，模板也被删完了，返回这个ast树
> 2. 将ast语法树编译成字符串的代码(codegen),例如:<div id='#app'>1</div>会先转成{tag:'div',attrs:[{id:'app'}],1},然后编译成字符串代码，如: \_c('div',{id:"app"},\_v(1)) ,这个代码是字符串的
> 3. 通过new Function + with语法将字符串代码编译成函数，以上代码变成
>    ƒ anonymous(){with(this){return \_c('div',{id:"app"},\_v(1)) }}
> 4. 当然在编译的时候也会处理一些指令/事件等

## 24. Vue中使用了哪些设计模式

> 1. 发布订阅模式($on/$emit)
> 2. 单例模式(整个程序只有一个Vue)
> 3. 策略模式(生命周期就是用了策略模式，根据不同的名字调用不同的回调，来解决if/else过多的问题)
> 4. 观察者模式(dep/watcher)
> 5. 代理模式:给某一个对象提供一个代理对象，并由代理对象来控制对原对象的引用，如：\_data,Object.defineproperty
> 6. 中介者模式:通过提供一个统一的接口让不同部分组件进行通信,如：vuex
> 7. ...等等

## 25. Vue.use的原理

> Vue.use可以用来注册一个插件，并且给插件提供一个Vue作为参数，供插件者使用
>
> 原理:
>
> ​	可以传入一个函数或者对象,会将传入的参数进行截取，然后给参数中往前面追加(unshift)了一个属性Vue,然后判断这个插件为函数还是对象，如果是对象，那么会调用对象提供的install方法，并且把参数传入，如果是函数，会调用这个函数然后把参数传入，use函数的返回值在不被修改this的情况下指向Vue

## 26. Vue.set的原理

> Vue.set/vm.$set可以设置响应式数据，语法 Vue.set(target,key,value)
>
> 原理:
>
> 1.  如果设置的目标(target)是一个数组并且你传的key是一个索引的话，内部做了已下事情
>    1. 修正数组的length,因为数组的长度可能会发生变化
>    2. 调用数组的splice方法进行更新，因为splice已经被重写了
>    3. 返回value
> 2. 如果设置的目标是一个对象，并且这个key值是存在的，不是新增的，内部做了已下事情
>    1. 直接修改value值(target[key] = value)，因为如果是已经存在的，肯定已经是响应式的了
>    2. 返回value
> 3. 如果设置的目标是一个对象，并且这个key不在对象本身上,内部做了已下事情
>    1. 调用defineReactive函数，内部用Object.defineProperty将数据定义成响应式
>    2. 通知watcher更新页面
>    3. 返回value

## 27. keep-alive的作用及原理

> kepp-alive组件用来做缓存的,保证组件不会被销毁，它是一个抽象组件(自身不会渲染一个DOM元素，也不会出现在父组件链中)
>
> 可以在这个组件上定义3个属性，分别是
>
> 1. include ==> 缓存白名单,标识哪些组件可以缓存
> 2. exclude ==> 缓存黑名单,标识哪些组件不可以被缓存
> 3. max ==> 定义可以缓存组件的最大数量，当超出时，会把第一个被缓存的组件干掉，把当前缓存的组件放入，内部采用LRU算法
>
> 原理:
>
> 1. 获取keep-alive包裹着的第一个子组件对象及其组件名
>
>  	2. 根据设定的黑白名单（如果有）进行条件匹配，决定是否缓存。不匹配，直接返回组件实例
>  	3. 根据组件ID和tag生成缓存Key，并在缓存对象中查找是否已缓存过该组件实例。如果存在，直接取出缓存值并更新该key在this.keys中的位置
>  	4. 在自身中定义的cache对象中存储该组件实例并保存key值，之后检查缓存的实例数量是否超过max设置值
>  	5. 将该组件实例的keepAlive属性值设置为true，这一步是为了渲染和执行被包裹组件的钩子函数
>
> 钩子函数调用时机:
>
> 1. activated : keep-alive组件激活时使用,根据组件实例的keepAlive属性值来判断的
> 2. deactivated : keep-alive组件停用时调用

## 28. vue中修饰符的原理

> 如.stop/.prevent/.lazy/.enter等，这些vue内部帮我们处理好了，让我们只关心业务层面的逻辑
>
> 原理:
>
> 1. 将这些修饰符转换成函数，这些函数一旦执行，就调用不同的函数来达到目的
> 2. 如.stop,实际上会调用$event.stopPropagation()函数，.prevent实际上会调用$event.preventDefault()函数
> 3. 将以上的函数($event.stopPropagation()/$event.preventDefault())都包装一个函数,返回这个函数
> 4. 在生成真实dom的时候会给dom绑定事件并且添加函数

## 29. v-if和v-for的原理

> v-for原理: 
>
> 1. 在编译阶段会被处理成字符串代码，如: \_l('arr',function(){return \_c('div')})
> 2. 在调用render函数时，会创建代码块,执行renderlist函数，然后执行for循环
> 3. 如果要循环的是对象并且这个对象有iterator接口的话，内部会用while循环来迭代这个对象
>
> v-if原理:
>
> 1. 在编译阶段会被处理成三元表达式的字符串代码, 如: flag ? xx : xxx
> 2. 在调用render函数时，会创建代码块，执行函数，然后执行js代码

## 30. 插槽的实现原理

> 插槽分为普通插槽、具名插槽、作用域插槽
>
> 作用: 用插槽作为占位符，可以根据条件来渲染对应的标签结构，并且可以实现父子通信
>
> 原理:
>
> 1. 普通插槽和具名插槽
>
>    是先渲染父组件，渲染完了之后，替换子组件中的内容
>
>    在模板编译的时候，编译成对应的字符串代码，然后找到插槽的对应关系，进行替换
>
> 2. 作用域插槽
>
>    

## 31. 函数式组件的优势

> 1. 无状态，没有data
> 2. 无生命周期
> 3. 无this
> 4. 性能高

## 32. forceUpdate的原理

> 强制更新，刷新视图
>
> 原理:手动让watcher执行

## 33. vuex刷新数据丢失怎么解决

> 一般解决方案无非3种:
>
> 1. vuex中的store接受plugins选项，可以在里面用一些插件，如持久化状态的插件**vuex-persistedstate**
> 2. 利用本地存储,如: localStorage/sessionStorage等，在状态中每次都从localStorage中读取就行了
> 3. 每次刷新都发一个请求，请求返回数据

## 34. vuex原理及详解

> 介绍: Vuex可以集中式存储管理应用的所有组件的状态，可以进行任意组件的通信，内部实现基于Vue的响应式系统
>
> 核心概念:
>
> 1. state模块: 驱动视图应用的数据源，都是响应式数据
>
>  	2. actions模块: Action 提交的是 mutation，而不是直接变更状态,可以包含任意异步操作,如: 发送请求
>  	3. mutations模块: 同步更新状态，只能在mutation中更改状态，不可以在别的地方改，如果改了，vuex和devtools是监视不到的，危险操作,一般我们可以在store中开启strict来让 Vuex store 进入严格模式，这样的话任何 mutation 处理函数以外修改 Vuex state 都会抛出错误
>  	4. getters模块: 计算属性
>  	5. modules模块: 可以将store分割成多个模块，每个模块中有自己的state、mutation、action、getter、甚至是嵌套子模块
>
> 流程说明:
>
> 1. 在页面中我们可以通过辅助函数(mapActions)/$dispatch来触发actions模块的流程，在这里我们可以发送请求
> 2. 在actions模块中我们可以通过commit来触发mutations模块的流程，可以传入一些数据给mutation
> 3. mutations中的模块可以拿到这些数据，然后修改状态
> 4. 状态一旦改变，会更新对应组件的视图
>
> 重要Api介绍:
>
> 1. 辅助函数
>
>    1. mapState，可以在组件computed中通过...mapState(['xxx'])来映射数据
>    2. mapActions，可以在组件methods中通过...mapActions(['xxx'])来映射action函数
>    3. mapMutations,可以在组件methods中通过...mapMutations(['xxx'])来映射mutation函数
>    4. mapGetters，可以在组件computed中通过...mapGetters([xxx])来映射计算属性函数
>
> 2. replaceState
>
>    作用: 替换 store 的根状态
>
> 3. registerModule
>    作用: 可以动态注册一个模块
>
> 4. createNamespacedHelpers
>
>    作用: 可以基于命名空间来返回对应的辅助函数（很常用)
>
> Vuex中的插件:
>
> Vuex的store接受plugins选项，选项是一个数组，接受一个函数作为数组中的参数，可以监听 mutation（用于外部地数据持久化、记录或调试）或者提交 mutation
>
> 原理:
>
> 插件内部暴露了一个install方法和Store类及辅助函数
>
> 1. install方法
>
>    通过Vue.mixin混入了beforeCreate钩子，在内部给每个组件都提供了一个$store选项，值为Store实例
>
> 2. Store类
>
>    1. 递归循环格式化模块，主要是为了记录父子关系和注册模块
>    2. 递归循环安装模块，主要是为了讲子模块的状态安装到对应的父级模块中，同时也要处理namespace的路径拼接
>    3. 将getters模块中的key通过Object.defineProperty定义到一个容器中
>    4. new Vue将模块的state和getters分别定义到data对象的$$state和computed中
>    5. Vue中，如果对象的属性名以$或者\_开头，不会被代理到vm上，只会做第一层代理，被代理到\_data上
>    6. 当我们获取状态时，会触发属性访问符，内部返回this._vm._data.$$state
>
> 3. 辅助函数
>
>    1. 循环状态数据，将结构定义成obj[name] = fn的格式，fn函数内部返回store中的状态，语法:this.$store.state[stateName],将这种格式都放入到对象中，返回这个对象，外部通过...展开这个对象

## 35. Vue-router原理及详解

> 介绍: Vue Router是一个路由管理器，可以让我们构建单页面应用变得很轻松,内部实现基于Vue的响应式系统
>
> 模式: 
>
> 1. hash模式 --> 使用 URL hash 值来作路由,兼容性好，但是不美观，服务端也获取不到hash值，不会造成刷新404问题
> 2. history模式 --> URL 就像正常的 url,好看，刷新会有404问题，开发环境中没有404问题，因为vue-router已经帮我们做好了
> 3. abstract模式 --> 支持所有 JavaScript 运行环境,如果发现hash、history浏览器不支持，路由会自动强制进入这个模式
>
> 属性:
>
> 1. $route ==> 当前激活的路由信息对象，包含路由的path、params、query、matched、name...等属性
> 2. $router ==> 路由实例，包含路由的push/replace/go...等方法
>
> 生命周期钩子(导航守卫):
>
> 1. 全局前置守卫(router.beforeEach),项目中用的最多
>
>    有三个参数，分别是
>
>    1. to --> 即将要进入的路由对象
>    2. from --> 当前要离开的路由对象
>    3. next --> 是否要跳转要指定路径或者下一个路由对象，一定要被调用
>
> 2. 全局解析守卫(router.beforeResolve)
>
>    和全局前置守卫类似，区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用
>
> 3. 全局后置钩子(router.afterEach)
>
>    路由跳转之后触发的钩子，接受2个参数
>
>    1. to --> 即将要进入的路由对象
>    2. from --> 当前要离开的路由对象
>
> 4. 路由独享守卫(在路由配置选项中提供beforeEnter)
>
>    有to，from，next参数
>
> 5. 组件内的守卫(在组件中定义beforeRouteEnter/beforeRouteUpdate/beforeRouteLeave)
>
>    1. beforeRouteEnter --> 在渲染该组件的对应路由被确认前调用，不能获取组件实例 this，因为组件实例还没被创建
>    2. beforeRouteUpdate -->  在当前路由改变，但是该组件被复用时调用,可以访问组件实例 this
>    3. beforeRouteLeave --> 离开该组件的对应路由时调用,可以访问组件实例 this
>
> 重要Api:
>
> 1. router-link : 跳转路由，属性如下:
>
>    1. to : 要跳转的路由地址,默认使用push方法跳转
>    2. tag : router-link默认会渲染成带有正确链接的a标签，可以通过tag属性生成别的标签
>    3. replace : 会调用replace方法进行跳转
>    4. exact : 开启严格模式，默认是模糊匹配
>    5. ...等等
>
> 2. router-view : 渲染路径匹配到的视图组件，属性如下
>
>    name --> 命名视图,可以同时 (同级) 展示多个视图，而不是嵌套展示，默认为default,可以在路由配置选项中提供components选项来做区分
>
> 3. router.addRoutes(被废弃了)
>
> 4. router.addRoute : 动态添加路由,参数如下:
>
>    1. parentName : 可选参数，父路由的名字,添加一条新的路由规则记录作为现有路由的子路由
>    2. route : 路由对象，如果于已有路由名字重名，会覆盖
>
> 5. router.push/router.replace/router.go/router.back/router.forward
>
>    动态的导航到一个新 URL
>
> 动态路由:
>
> 1. 场景 : 有一个 `User` 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染
> 2. 语法 : { path: '/user/:id', component: User }
> 3. 解释 : 冒号作为占位符，当匹配到一个路由时，参数值会被映射到 this.$route.params，params属性上有一个id属性，值就是匹配到的内容,如: /user/1,那id值就为1
>
> 匹配任意路由/匹配指定开头的路由:
>
> 1. 场景 : 用户在地址栏上随便输入一个路由，我们应该返回一个404组件
> 2. 语法 : {path:'*',component: 404Component} / {path:'/user-\*',component: 404Component}
> 3. 解释 : 第一个，可以匹配任意路由，一般我们都是放在路由配置的最下面，第二个,可以匹配以/user-开头的任意路由
> 4. 原理 : 内部使用了path-to-regexp作为路径匹配引擎，就是将我们的path配置转换成对应的正则去匹配路径
>
> 导航:
>
> 1. 声明式导航 : <router-link>
>
> 2. 编程式导航 : router.push/replace等
>
> 3. 编程式导航/声明式导航可以写成以下格式:
>
>    1. 字符串 : router.push('home')
>
>    2. 对象 : router.push({ path: 'home' })
>
>    3. 命令的路由(路由配置选项中提供了name属性) : router.push({ name: 'user', params: { userId: '123' }}),携带了params参数,地址栏上 /user/123
>
>    4. query参数 : router.push({ path: 'register', query: { plan: 'private' }}),携带了query参数，地址栏上 /register?plan=private
>
>    5. 注意 : 如果提供了path，params会被忽略，query正常
>
>       解决 : 提供路由的name或手写完整的带有参数的 path,如 : router.push({ name: 'user', params: { userId },query:{ plan: 'private'}})或者router.push({ path: `/user/${userId}?`plan=private })
>
> 路由组件传参:
>
> 使用 `props` 将组件和路由解耦,props可以写成三种模式
>
> 1. 布尔模式
>
>    在单个路由选项配置中 : 如 { path: '/user/:id', component: User, props: true }
>
>    对应的User组件中 : 写 props: ['id']，id的值根据用户传递的params参数来决定
>
> 2. 对象模式(静态路由传参有用)
>
>    在单个路由选项配置中 : 如 { path: '/user', component: User, props: {id:12345}}
>
>    对应的User组件中 : 写 props: ['id'] , id的值为12345
>
> 3. 函数模式
>
>    在单个路由选项配置中 : 如 { path: '/user/:id', component: User, props: route => ({ params: route.params.id ,query:route.query.xxx})}
>
>    对应的User组件中 : 写 props:['params','params']即可
>
> 原理:
>
> 同Vuex一样，内部暴露了VueRouter类和一个install的静态方法
>
> 1. install方法
>    1. 利用了Vue.mixin混入了一个beforeCreate钩子,给所有组件都提供了**\_routerRoot**属性,值为Vue实例,使用**Vue.util.defineReactive**方法将\_route属性定义成了响应式属性,值为current(路由信息对象)
>    2. 使用Object.defineProperty方法在Vue的原型上添加了$router和$route属性，$router返回了路由实例,$route返回了current属性
>    3. 使用**Vue.component**定义了2个全局组件 ，分别为**router-link**、**router-view**，这两个组件都是函数式组件
> 2. VueRouter类
>    1. 初始化默认的路由模式为**hash**模式
>    2. 创建了一个匹配器，主要是为了递归扁平化路由数据、拼接路径、确认父子关系、初始化一些参数和添加**match**及**addRoute**方法，addRoutes的原理就是重新在创建一次匹配器，将之前老的路由数据作为初始值在进行扁平化
>    3. 采用了策略模式，根据模式的不同去生成不同的类，如hash模式调用HashHistory，history模式调用HTML5History，他们上面有一些公共的方法，比如push/replace都抽离到他们的父类BaseHistory类中
>    4. 内部处理路径跳转的核心方法 : transtionTo
>    5. history模式中监听hashchange事件，当路径发生变化后，会触发事件，然后重新执行transtionTo
>    6. hash模式中先判断浏览器是否兼容hashchange事件，如果不支持就监听popstate事件
>    7. transtionTo方法中会先进行路径匹配，找到所有的匹配项，然后根据router-view来进行渲染，router-view的原理是通过给标签上($vnode获取组件标签)增加了一个routerView属性来确认当前要渲染的组件，内部维护了一个depth变量，防止渲染死循环
>    8. 跳转的实现是通过浏览器history的API来实现的，如: **pushstate、replacestate**
>    9. 路由滚动是通过window.scrollTo来实现的

## 36. v-lazyload的原理

> 提供install方法，在方法内部找到滚动的父级元素，然后绑定事件，判断当前是否需要显示，如果在可视区域范围内，就默认显示，其他的先不加载，等滑动到指定位置在进行加载，如果已经被懒加载过的不需要重复加载，内部通过一个loaded变量来进行控制

## 37. MVVM的理解?和MVC的区别

> 首先先来说下m，v，vm
>
> ​		m: model（本地数据和数据库中的数据）
>
> ​		v: view（用户看到的视图）
>
> ​		vm: ViewModel（Vue的实例对象，将视图中的状态和用户的行为分离出一个抽象， 只关心数据和业务的处理，不关心 View 如何处理数据）
>
> ​		**mvc**：
>
> ​		c: controller（控制器）
>
> ​		传统的 MVC 架构通常是使用控制器更新模型，视图从模型中获取数据去渲染。当用户有输入时，会通过控制器去更新模型，并且通知视图进行更新。但是 MVC 有一个巨大的缺陷就是控制器承担的责任太大了，随着项目愈加复杂，控制器中的代码会越来越臃肿，导致出现不利于维护的情况

## 38. Vue和React的区别

> 共同点:
>
> 1. 使用 Virtual DOM
> 2. 提供了响应式 和组件化的视图组件
> 3. 将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库
>
> 不同点:
>
> 1. React学习成本更高，需要知道 JSX 和 ES6，因为许多示例用的是这些语法，而Vue只需用很短的时间阅读指南就可以建立简单的应用程序
> 2. 优化方面，React为了避免不必要的子组件的重渲染，需要在所有可能的地方使用 `PureComponent`，或是手动实现 `shouldComponentUpdate` 方法，而Vue是在渲染过程中自动追踪的，所以系统能精确知晓哪个组件确实需要被重渲染
> 3. 组件卸载不同，Vue中组件卸载干掉的是组件实例, 页面还存在，React中卸载的是整个页面
> 4. diff算法不一样，Vue采用双指针进行对比，而React采用根据不同的策略去对比

## 39. Vue中的性能优化

> 1. 数据层次不要太深，合理设置响应式数据(因为内部会递归)
> 2. 使用数据时缓存值的结果，不要频繁取值(因为会走get，执行一些代码)
> 3. 合理设置key属性，如果只是用来渲染，可以用index，如果涉及到新增/添加等，要用唯一的标识来作为key，是因为内部diff算法的时候进行对比优化
> 4. v-show和v-if的选择
> 5. 控制组件粒度，因为vue是采用组件级更新的，一个组件就有一个渲染watcher
> 6. 采用函数式组件，减少编译层的处理，开销低
> 7. 采用异步(懒加载)组件,借助webpack的分包能力，语法: () => import('xxx')
> 8. 合理使用keep-alive组件，防止组件多次销毁/创建
> 9. 可以用虚拟滚动等策略
> 10. 打包优化，主要是用webpack
> 11. 对于一些只是展示的数据，可以使用Object.frezz来进行冻结，一旦被冻结，是不可被修改的

#  6. React面试题(待更新,以下是2年前总结的,作者正在深入学习中...)

## 1. 跟我说说你对react中事件机制的理解

> React中的事件其实并没有绑定在对应的真实dom上，而是通过事件代理的方式，将所有的事件都统一绑定在了document上。这样的方式不仅减少了内存消耗，还能在组件挂载销毁的时候统一订阅和移除事件。另外冒泡到document上的事件也不是原生浏览器事件，而是react自己实现的合成事件。所以我们如果不想要事件冒泡的话，使用event.stoppropagation是无效的，而是应该调用event.preventDefault

## 2. React中通信方式

> 首先通信方式分为这么几种
>
> 1. 父子通信
>
>    通过props传递数据给子组件，或者子组件通过调用父组件传过来的函数传递数据给父组件，这两种方式是最常用的父子通信实现方案
>
> 2. 兄弟组件通信
>
>    可以通过公共的父组件来管理状态和事件函数
>
> 3. 跨多层次组件通信
>
>    Context，可以通过React.createContext来创建实例对象，这个实例对象包含2个组件，Provider和Consumer,Provider包裹需要数据的一方，通过value属性来指定需要传入的数据，Consumer组件可通过2种方式来读取状态数据，1.可以通过static contextTypes来声明需要使用的数据，2.可以通过函数的方式来接收数据，2种方式区别就是，static只能对应一种数据状态，而函数可以对应多种，因为static相当于是赋值操作，在定义的话会覆盖之前的，其实react-redux内部也是通过Context来实现的。
>
> 4. 任意组件通信
>
>    Redux或者Pubsub来实现一个任意组件通信的效果
>
>    首先redux它是一种集中式管理状态数据的方案，它分为3大模块，分别是store模块，actions模块，reducers模块，store模块主要是用来集中式管理状态数据的，actions模块主要是用来创建action对象的工厂函数模块，一般分为同步action/异步action，reducers模块主要是用来根据之前的状态数据和type类型来生成最新的状态数据自动交给store对象，store一旦接收到最新的状态，会立即触发store中的subscribe方法，subscribe方法中有个listener回调函数，这个回调函数是只要更新的状态数据，就会自动触发，从而重新渲染组件，页面中就能显示最新的状态页面，其实这种流程离不开单向数据流原则，redux的三大原则分为3个，1.单向数据流，2.state是只读的，3.使用纯函数来对state进行修改，所谓的单向数据流无非就是用户操作视图层进行交互效果，会触发action调用，action一旦调用，会间接修改状态数据state，state一旦被修改，就会重新渲染组件，从而用户可以看到最新的状态页面，其次state是只读的：唯一改变state的方法就是触发action，这样确保了视图和网络请求都不能直接修改state，相反它们只能表达想要修改的意图，最后纯函数的意思就是不要有不确定的某种因素，比如：随机数、日期等
>
>    PubSub也是一种组件间可以进行任意组件通信的方式，它是一个公共的库，本身并不是react中的一种方法，它分为发布方和订阅方，发布方可以传入相应的消息名字和消息内容，订阅方也传入相应的消息名和回调函数，一旦消息内容发生改变，会触发回调函数，回调函数的参数中可以拿到最新的消息内容从而达到组件间通信的效果

## 3. React中性能优化方式

> 1. shouldComponentUpdate
>
>    可以通过返回一个布尔值来决定组件是否需要进行更新，这层代码逻辑可以说是简单的浅比较state，一般来说不推荐完整的对比state，因为组件更新触发可能会比较频繁，这样完整对比性能开销会比较大，可能会造成得不偿失的情况
>
> 2. PureComponent
>
>    如果只是简单的浅比较，可以使用PureComponent，它内部也是实现了浅比较state,简单点来说可以把PureComponent看成shouldComponentUpdate的简化版	
>
> 3. Lazy + Suspense进行代码拆分和懒加载
>
> 4.  使用production版本的react.js
>
> 5. 使用key来帮助React识别列表中所有子组件的最小变化

## 4. React中setState是同步还是异步

> 可能是同步，也可能是异步。只在React合成事件和钩子函数中是异步的，在原生DOM和定时器中都是同步的

## 5. React中生命周期？

> 它是分为旧版和新版2种生命周期的，无论是哪一种，都要经过三大阶段，初始化阶段、更新阶段、卸载阶段
>
> **旧版生命周期**
>
> **1. 在初始化阶段中，执行顺序：**
>
> 1. constructor
>
>    过去的时候，可以初始化state、绑定函数this、初始化ref
>
> 2. componentWillMount（新版被废弃）
>
> 3. render
>
>    返回要渲染的虚拟dom对象
>
> 4. componentDidMount
>
>    发送请求、开启定时器、绑定事件等等
>
> ​	 **更新阶段分为3种更新，执行顺序：**
>
> **2. 父组件更新导致子组件更新（走的是完整的）**
>
> 1. componentWillReceiveProps（新版被废弃）
>
>    如果子组件的state状态是由父组件传递的props来决定的，那么就用这个钩子函数
>
> 2. shouldComponentUpdate
>
>    用来做性能优化，因为它可以决定我这个组件是否需要进行更新，返回布尔值即可。
>
> 3. componentWillUpdate（新版被废弃）
>
> 4. render
>
> 5. 返回要渲染的虚拟dom对象
>
> 6. componentDidUpdate
>
>    每次更新的时候可以做的一些事情
>
> setState更新（少componentWillReceiveProps）
>
> forceUpdate更新（少componentWillReceiveProps,shouldComponentUpdate）
>
> **3. 卸载阶段，执行顺序：**
>
> 1. componentWillUnmount
>
>    可以解绑事件、清除定时器、取消未发送成功的ajax请求等等，解绑事件也是解绑的原生dom事件、合成事件不需要解绑，卸载的方法可以使用ReactDOM.unmountComponentAtNode（）
>
> **新版生命周期**
>
> 1. **在初始化阶段中，执行顺序:**
>
>    1. constructor
>
>    2. getDerivedStateFromProps
>
>       在渲染之前可以更新state，同时也取代了旧版生命周期中被废弃的三个钩子函数
>
>    3. render
>
>    4. componentDidMount
>
> 2. **更新阶段分为3种更新，跟旧版一样**
>
>    在render之后componentDidUpdate之前新增的钩子：
>
>    getSnapshotBeforeUpdate
>
>    可以提前操作dom，操作完后在更新（实际用的很少）
>
> 3. **卸载阶段，跟旧版一样**

## 6. React中diff算法

> 1. tree diff,把树形结构按照层级分解，只比较同级元素，也就是所谓的分层求异
>
> 2. component diff,如果是同一类型的组件，就按照tree diff进行对比，如果不是同一类型的组件，就会把原来的组件标记为dirty component（脏组件），从而替换整个组件下的所有子节点，也可以通过shouldComponentUpdate来决定组件是否需要更新，这都是一种优化手段
>
> 3. element diif，添加唯一 key 进行区分，使用key来帮助React识别列表中所有子组件的最小变化 

## 7. React中发送请求在哪里发？为什么?

> **发送请求一般都是在componentDidMount中发送，原因有三条:**
>
> 1. 在render之前发送请求的话可能会调用多次，没必要这么做。
>
> 2. 发送请求完可能会操作dom，而在render之前可能会拿不到dom
>
> 3. 渲染速度更快一点，因为它是在页面渲染完毕之后才执行的

## 8. 跟我说说HOC

> hoc也就是我们常说的、常用的高阶组件，高阶组件的定义我个人认为：本质就是一个函数，可以接受一个组件作为参数，返回值是一个新组件，新组件中包裹着旧组件，作用的话就是用来复用代码和逻辑。

## 9. 说说你用react有什么坑点

> 1. JSX做表达式判断时候，需要强转为boolean类型
>
> 2. 尽量不要在 componentWillReviceProps 里使用 setState，如果一定要使用，那么需要判断结束条件，不然会出现无限重渲染，导致页面崩溃
>
> 3. 给组件添加ref时候，尽量不要使用匿名函数，因为当组件更新的时候，匿名函数会被当做新的属性处理,所以可能用匿名函数做ref的时候，有的时候去ref赋值后的属性会取到null
>
> 4. 遍历子节点的时候，不要用 index 作为组件的 key 进行传入，可以使用唯一标识id来作为key

## 10. redux有什么缺点

> 当一个组件相关数据更新时，即使父组件不需要用到这个组件，父组件还是会重新渲染，可能会有效率影响，或者需要写shouldComponentUpdate进行判断

## 11. 虚拟dom的理解？为什么虚拟dom会提高性能

> 虚拟dom相当于在js和真实dom中间加了一个缓存，利用dom diff算法避免了没有必要的dom操作，从而提高性能，具体实现思路：使用js中对象结构来生成dom结构树，然后在更新时在生成一个dom结构树，新旧dom结构树进行差异对比，最后差异部分进行替换，应用到dom上

## 12. react组件的划分业务组件技术组件

> 根据组件的职责通常把组件分为UI组件和容器组件
>
> 1. UI 组件负责 UI 的呈现
> 2. 容器组件负责管理数据和逻辑
>
> 两者通过React-Redux 提供的connect高阶组件联系起来

## 13. createElement与cloneElement的区别？

> createElement 函数是 JSX 编译之后使用的创建 React Element 的函数，而 cloneElement 则是用于复制某个元素并传入新的 Props

## 14. 传入 setState 函数的第二个参数的作用是什么？

> 该函数会在setState函数调用完成并且组件开始重渲染的时候被调用，我们可以用该函数来监听渲染是否完成，类似于vue中的$nextTick

## 15. renderProps和高阶组件的区别？

> renderProps是指在React组件之间使用一个值为函数的props共享代码的简单	技术,hoc本质上是一个函数，接受一个组件作为参数，返回一个新组件，新组件	内部套着旧组件，实现代码和逻辑的复用，我个人觉得renderProps对于只读的	操作非常适用,而高阶组件更倾向于更复杂的一些操作

## 16. 介绍一下hook?

> Hook是React16.8推出的一门技术，hook本质就是让我们使用无状态函数组件	的情况下可以使用state以及其他react的特性，常见的hook有useState、	useEffect、自定义hook，useState是用来定义状态的，它提供一个状态和更新	状态的数据方法，状态的初始值就是useState传的参数，useEffect是用来模拟	类组件中的生命周期的。如果不传递第二个参数，相当于componentDidMount	和componentDidUpdate，如果第二个参数传递的是一个空数组，相当于	componentDidMount，如果传递的是一个指定的状态值，那么就是在这个状态值	发生改变的时候才会执行函数，如果内部在return一个函数，那在这个return函	数内部就相当于componentDidUnmount

## 17. React中有哪些构建组件方法?

> React中分为函数组件和类组件，函数组件其实是借用无状态组件的思想，也就是	无法使用state和生命周期钩子，也不存在this的问题，优点在于函数组件更容易	理解，不会执行一些与UI无关的逻辑处理，类组件中的this，可以通过constructor	中使用bind改变this指向，也可以使用箭头函数的方式解决this的问题，箭头函	数解决this问题是官方推出的实验性语法

## 18. 为什么列表渲染的key最好不要用index?（参考diff算法）

## 19. 什么是受控组件和非受控组件?

> 受控组件是通过state+onChange事件来收集数据的，相当于手动去实现vue中的	v-model，非受控组件是通过ref技术来获取dom，操作原生的api获取数据，收集	表单数据时一般都推荐使用受控组件的方式

## 20. React中的Portal是什么？

> Portal是一门让子节点渲染到父节点以外的dom节点的技术。antd中的modal组件	就借用portal技术来实现，好处在于父组件进行更新的时候不会重新的去创建modal对应的dom节点

## 21. 错误边界（Error boundaries）

> 错误边界是一个React组件，可以捕获并打印发生在其子组件树任意位置的	javascript错误，会渲染出备用的UI，而不是渲染哪些崩溃了的子组件树，不过，错误边界捕获不了事件处理、异步代码、服务端渲染以及它自身抛出的错误，错误边界内部是通过两个钩子函数（getDerivedStateFromError和componentDidCatch）来判断是否有错误以及上传错误日志的

# 7. Webpack面试题(作者正在更新中...)

# 8. Vue3面试题(作者正在更新中...)

# 9. Typescript面试题(作者正在更新中...)