import Vue from 'vue'
import App from './App.vue'

import router from '../router'


const store = {
  permission:["edit","add"]
}
Vue.directive("permission",{
  inserted: function (el,binding) {
    // console.log('inserted',Vue.prototype.$user)
    // console.log(el,binding,vnode)
    if(!store.permission.includes(binding.value)){
      el.parentNode.removeChild(el);
    }
  }
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
