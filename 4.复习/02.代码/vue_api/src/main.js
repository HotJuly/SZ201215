import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

//自定义合并策略,可以修改所有组件的配置
Vue.config.optionMergeStrategies.$num = function(a,b,c){
  // console.log('optionMergeStrategies',a,b,c)
  return b+1;
}

// 错误边界
Vue.config.errorHandler = function (err, vm, info) {
  console.log('errorHandler',err, vm, info)
  // 发送ajax请求,告知服务器
}

/* 需求:当项目上线之后,如何维护出现的bug
  1.捕获到用户使用过程中出现的bug
  2.将改bug发送到服务器端
  3.服务器端统一将收集到的错误交给前端人员
  4.前端人员根据收集的信息修改代码

  如果是原生项目出现报错,使用window.onerror=function(){}捕获错误
*/

Vue.mixin({
  created(){
    console.log(this.$options.$num);
  }
})

new Vue({
  // template:"<div>app</div>",
  // el:"#app",
  render: h => h(App),
  $num:6
}).$mount('#app')
