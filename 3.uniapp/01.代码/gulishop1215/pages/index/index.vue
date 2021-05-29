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
			<view class="navItem" 
			:class="navIndex===-1?'active':''"
			@click="changIndex(-1)"
			>推荐</view>
			<view class="navItem" 
				:class="navIndex===index?'active':''"
				@click="changIndex(index)"
				v-for="(item,index) in indexData.kingKongModule.kingKongList"
				:key="item.L1Id"
			>{{item.text}}</view>
		</scroll-view>
		
		<!-- 内容区域 -->
		<scroll-view class="contentScroll" scroll-y>
			<Recommend v-if="navIndex===-1"/>
			<Categorys v-else/>
		</scroll-view>
	</view>
</template>

<script>
	import Recommend from '../../components/recommend/recommend.vue';
	import Categorys from '../../components/categorys/categorys.vue';
	import req from '../../utils/req.js';
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
					// indexData:{},
					navIndex:-1
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
		async mounted(){
			// console.log('mounted')
			// uni.request({
			// 	url:"/api/getIndexData",
			// 	success:(res)=>{
			// 		// console.log(res)
			// 		this.indexData = res.data;
			// 	}
			// })
			// h5专用请求地址,因为经过了proxy
			// let res = await req("/api/getIndexData");
			// let res = await req("/getIndexData");
			// // console.log('res',res)
			// this.indexData = res;
			this.$store.dispatch('getIndexData');
			// console.log('msg',this.$store.state.home.msg)
		},
		methods:{
			changIndex(index){
				this.navIndex=index;
			}
		},
		components:{
			Recommend:Recommend,
			Categorys:Categorys
		},
		computed:{
			// indexData(){
			// 	return this.$store.state.home.indexData
			// },
			...mapState({
				indexData:(state)=>state.home.indexData
			})
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
		.contentScroll
			// 小程序高度计算 height = 100vh - header高度 - nav高度
			// h5高度计算 height = 100vh - header高度 - nav高度 -导航栏高度 - tabBar高度
			height calc( 100vh - 80upx - 80upx - var(--window-top) - var(--window-bottom))
			
		
	
</style>
