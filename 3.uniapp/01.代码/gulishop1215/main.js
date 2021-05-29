import Vue from 'vue'
import App from './App'
import store from './store/index.js'

Vue.config.productionTip = false

// mp->mini program type->类型	
// 声明当前APP组件代表整个小程序
App.mpType = 'app'

const app =new Vue({
	store,
    ...App
		// onLaunch: function() {
		// 	console.log('App Launch2')
		// },
		// onShow: function() {
		// 	console.log('App Show')
		// },
		// onHide: function() {
		// 	console.log('App Hide')
		// },
		
})
app.$mount()
