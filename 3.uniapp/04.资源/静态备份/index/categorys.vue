<template>
	<view class="categorysContainer">
		<image class="titleImg" src="../../static/images/index/1.webp" mode=""></image>
		<scroll-view class="categoryScroll" scroll-x="true" >
			<view class="categoryItem" >
				<image class="itemImg" src="../../static/images/dazuo.jpeg" mode=""></image>
				<view class="itemText">
					大佐天下第一大佐天下第一大佐天下第一大佐天下第一大佐天下第一
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default{
		data(){
			return {};
		},
		created(){
		},
		methods:{}
	}
</script>

<style lang="stylus">
	.categorysContainer
			padding 40upx 0
			.titleImg
				width 100%
				height 370upx
			.categoryScroll
				white-space nowrap
				.categoryItem
					display inline-block
					width 200upx
					margin 0 20upx
					.itemImg
						width 200upx
						height  200upx
						background #eee
					.itemText
						height 60upx
						font-size 24upx
						overflow hidden
						display -webkit-box
						-webkit-line-clamp 2
						-webkit-box-orient vertical
						white-space pre-wrap
</style>
