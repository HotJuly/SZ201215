<template>
	<view class="indexContainer">
		<!-- 头部区域 -->
		<view class="header">
			<!-- <img src="/static/images/logo.png"/> -->
			<!-- <i>我是i标签</i>123 -->
			<image class="logo" src="../../static/images/logo.png" mode=""></image>
			<view class="search">
				<view class="iconfont icon-sousuo"></view>
				<input class="searchInput" type="text" value="" placeholder-class="placeholder" placeholder="搜索内容"/>
			</view>
			<button class="username">
				七月
			</button>
		</view>
		
		<!-- 导航滑动区域 -->
		<scroll-view scroll-x  class="navScroll" v-if="indexData.kingKongModule">
			<view class="navItem active">推荐</view>
			<view class="navItem" 
				v-for="item in indexData.kingKongModule.kingKongList"
				:key="item.L1Id"
			>{{item.text}}</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
					indexData:{}
			}
		},
		// onLoad() {
		// 	/*
		// 		1.在哪发
		// 			Vue ->	mounted或者created
		// 			小程序	->	onLoad
		// 		2.怎么发
		// 			uni.request(OBJECT)
		// 		3.往哪发
		// 	*/
		// 	console.log('onLoad')
		// },
		// created() {
		// 	/*
		// 		1.在哪发
		// 			Vue ->	mounted或者created
		// 			小程序	->	onLoad
		// 		2.怎么发
		// 			uni.request(OBJECT)
		// 		3.往哪发
		// 	*/
		// 	console.log('created')
		// },
		mounted(){
			// console.log('mounted')
			wx.request({
				url:"/api/getIndexData",
				success:(res)=>{
					// console.log(res)
					this.indexData = res.data;
				}
			})
		},
		methods:{

		}
	}
</script>

<style lang="stylus">
	.indexContainer
		.header
			display flex
			align-items  center
			padding-top 20upx
			.logo
				width 118upx
				height 40upx
				margin 0 20upx
				flex-shrink  0
			
			.search
				position relative
				background  pink
				height 60upx
				border-radius  15upx
				flex-grow 1
				padding-left 60upx
				.iconfont
					position absolute
					top 50%
					left 20upx
					transform translateY(-50%)
				.placeholder
					text-align center
					font-size 24upx
					text-indent -60upx
			
			.username
				height: 60rpx;
				width: 128rpx;
				font-size: 24rpx;
				margin: 0 20rpx;
				color: #f00;
				text-align  center
				line-height 60upx
				border-radius  15upx
				flex-shrink  0
		.navScroll
			// display flex
			white-space nowrap
			.navItem
				position relative
				display inline-block
				width 140upx
				height 80upx
				font-size 28upx
				text-align center
				line-height 80upx
				&.active::after
					content ""
					height 4upx
					width 100%
					position absolute
					bottom 4upx
					left 0
					background red
			
		
	
</style>
