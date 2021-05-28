<template>
	<view class="indexContainer">
		<view class="header">
			<!-- <img src="/static/images/logo.png"/> -->
			<!-- <i>我是i标签</i>123 -->
			<image class="logo" src="../../static/images/logo.png" mode=""></image>
			<view class="search">
				<input class="searchInput" type="text" value="" placeholder="搜索内容"/>
			</view>
			<view class="username">
				七月
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {

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
				background  pink
				height 60upx
				border-radius  15upx
				flex-grow 1
			
			.username
				width 126upx
				height 60upx
				font-size 28upx
				background pink
				border 1upx solid
				text-align  center
				line-height 60upx
				border-radius  15upx
				margin 0 20upx
				flex-shrink  0
			
		
	
</style>
