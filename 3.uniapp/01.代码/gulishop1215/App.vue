<script>
	import req from './utils/req.js';
	export default {
		onLaunch: function() {
			// console.log('App Launch2')
			wx.login({
				success:async ({code})=>{
					// console.log(res)
					let openid = await req('/getOpenId',{code});
					uni.setStorageSync('token',openid);
				}
			})
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style lang="stylus">
	/*每个页面公共css */
	@import url('/static/iconfont/iconfont.styl');
	page
		height 100%
</style>
