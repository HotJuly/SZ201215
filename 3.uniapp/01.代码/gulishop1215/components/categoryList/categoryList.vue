<template>
	<view class="categoryListContainer">
		<image class="titleImg" :src="categoryList.titlePicUrl" mode=""></image>
		<scroll-view class="categoryScroll" scroll-x="true" >
			<view class="categoryItem" v-for="(item,index) in categoryList.itemList" :key="index">
				<image class="itemImg" :src="item.listPicUrl" mode=""></image>
				<view class="itemText">
					{{item.name}}
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
		props:["categoryList"],
		created(){
		},
		methods:{}
	}
</script>

<style lang="stylus">
	.categoryListContainer
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
