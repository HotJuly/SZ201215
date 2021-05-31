import Vue from 'vue';
import req from '../../utils/req.js';
import {ADDSHOPITEM,CHANGESHOPITEMCOUNT,CHANGESHOPITEMSELECT,CHANGEALLSELECTED} from '../mutation-types.js';
const state = {
	cartList:[
		{
			"selected":true,
			"count":3,
		    "promId": 0,
		    "showPoints": false,
		    "itemTagList": [
		        {
		            "itemId": 1535004,
		            "tagId": 128111157,
		            "freshmanExclusive": false,
		            "name": "暖冬特惠",
		            "subType": 204,
		            "forbidJump": false,
		            "type": 2
		        }
		    ],
		    "rank": 1,
		    "id": 1535004,
		    "sellVolume": 4001,
		    "primaryPicUrl": "https://yanxuan-item.nosdn.127.net/f79906f1b1fe86420ea40473de66ec0e.png",
		    "soldOut": false,
		    "sortFlag": 0,
		    "commentCount": 0,
		    "onSaleTime": 1538101761748,
		    "picMode": 1,
		    "commentWithPicCount": 0,
		    "underShelf": false,
		    "status": 2,
		    "couponConflict": true,
		    "forbiddenBuy": false,
		    "promotionDesc": "暖冬特惠",
		    "limitedFlag": 204,
		    "pieceNum": 0,
		    "itemSizeTableDetailFlag": false,
		    "forbidExclusiveCal": false,
		    "rewardShareFlag": false,
		    "updateTime": 1575893634989,
		    "showCommentEntrance": true,
		    "pieceUnitDesc": "件",
		    "specialPromTag": "",
		    "counterPrice": 299,
		    "categoryL2Id": 0,
		    "retailPrice": 209,
		    "primarySkuPreSellPrice": 0,
		    "preLimitFlag": 0,
		    "itemPromValid": true,
		    "promTag": "暖冬特惠",
		    "source": 0,
		    "points": 0,
		    "primarySkuPreSellStatus": 0,
		    "extraServiceFlag": 0,
		    "flashPageLink": "",
		    "autoOnsaleTimeLeft": 0,
		    "innerData": {},
		    "saleCenterSkuId": 0,
		    "pointsStatus": 0,
		    "extraPrice": "",
		    "colorNum": 0,
		    "showTime": 0,
		    "autoOnsaleTime": 0,
		    "preemptionStatus": 1,
		    "isPreemption": 0,
		    "zcSearchFlag": false,
		    "name": "男式色拉姆内衣套装2.0",
		    "appExclusiveFlag": false,
		    "itemType": 1,
		    "listPicUrl": "https://yanxuan-item.nosdn.127.net/c2eeb1b872af1b8efc179a7515aacdaa.png",
		    "pointsPrice": 0,
		    "simpleDesc": "色拉姆发热面料，加厚升级",
		    "seoTitle": "",
		    "newItemFlag": false,
		    "buttonType": 0,
		    "primarySkuId": 1636062,
		    "displaySkuId": 1636056,
		    "productPlace": "",
		    "itemSizeTableFlag": false
		},
		{
			"selected":false,
			"count":5,
		    "promId": 0,
		    "showPoints": false,
		    "itemTagList": [
		        {
		            "itemId": 1536001,
		            "tagId": 128111157,
		            "freshmanExclusive": false,
		            "name": "暖冬特惠",
		            "subType": 204,
		            "forbidJump": false,
		            "type": 2
		        }
		    ],
		    "rank": 1,
		    "id": 1536001,
		    "sellVolume": 3634,
		    "primaryPicUrl": "https://yanxuan-item.nosdn.127.net/32b8b2d07b1c4327593a4a70993eeac2.png",
		    "soldOut": false,
		    "sortFlag": 0,
		    "commentCount": 0,
		    "onSaleTime": 1538101896296,
		    "picMode": 1,
		    "commentWithPicCount": 0,
		    "underShelf": false,
		    "status": 2,
		    "couponConflict": true,
		    "forbiddenBuy": false,
		    "promotionDesc": "暖冬特惠",
		    "limitedFlag": 204,
		    "pieceNum": 0,
		    "itemSizeTableDetailFlag": false,
		    "forbidExclusiveCal": false,
		    "rewardShareFlag": false,
		    "updateTime": 1575894115275,
		    "showCommentEntrance": true,
		    "pieceUnitDesc": "件",
		    "specialPromTag": "",
		    "counterPrice": 299,
		    "categoryL2Id": 0,
		    "retailPrice": 209,
		    "primarySkuPreSellPrice": 0,
		    "preLimitFlag": 0,
		    "itemPromValid": true,
		    "promTag": "暖冬特惠",
		    "source": 0,
		    "points": 0,
		    "primarySkuPreSellStatus": 0,
		    "extraServiceFlag": 0,
		    "flashPageLink": "",
		    "autoOnsaleTimeLeft": 0,
		    "innerData": {},
		    "saleCenterSkuId": 0,
		    "pointsStatus": 0,
		    "extraPrice": "",
		    "colorNum": 0,
		    "showTime": 0,
		    "autoOnsaleTime": 0,
		    "preemptionStatus": 1,
		    "isPreemption": 0,
		    "zcSearchFlag": false,
		    "name": "女式色拉姆内衣套装2.0",
		    "appExclusiveFlag": false,
		    "itemType": 1,
		    "listPicUrl": "https://yanxuan-item.nosdn.127.net/02b61fb5700aed6761b7524d98ed0837.png",
		    "pointsPrice": 0,
		    "simpleDesc": "色拉姆发热面料，加厚升级",
		    "seoTitle": "",
		    "newItemFlag": false,
		    "buttonType": 0,
		    "primarySkuId": 1634105,
		    "displaySkuId": 1634104,
		    "productPlace": "",
		    "itemSizeTableFlag": false
		}
		
	]
}

const mutations = {
	[ADDSHOPITEM](state,good){
		/*
			添加至购物车功能
				如果cartList中已有该商品,将已有商品的count+1
				如果cartList中没有该商品,将当前商品推入到购物车中
		*/
	   // console.log('ADDSHOPITEM');
	   let shopItem = state.cartList.find((shopItem)=>{
		   return shopItem.id === good.id;
	   })
	   if(shopItem){
		   console.log('+1',shopItem)
		   shopItem.count += 1;
	   }else{
		   console.log('=1',good)
		   // good.count = 1;
		   Vue.set(good,'count',1);
		   Vue.set(good,'selected',true);
		   state.cartList.push(good);
	   }
	},
	[CHANGESHOPITEMCOUNT](state,{type,index}){
		/*
			根据用户的操作修改商品数量
				如果商品数量变为0,自动移除该商品
		*/
		// console.log('CHANGESHOPITEMCOUNT',type,index)
		let shopItem =state.cartList[index];
		if(type){
			shopItem.count+=1;
		}else{
			if(shopItem.count>1){
				shopItem.count-=1;
			}else{
				state.cartList.splice(index,1);
			}
		}
	},
	[CHANGESHOPITEMSELECT](state,{selected,index}){
		// console.log('changeShopItemSelect',selected,index);
		let shopItem =state.cartList[index];
		shopItem.selected = selected;
		
	},
	[CHANGEALLSELECTED](state,selected){
		// console.log('CHANGEALLSELECTED',selected);
		let result = state.cartList.forEach((shopItem)=>{
			shopItem.selected = selected
			// return 123;
		})
		// console.log('result',result)
	}
}

const actions = {
}

const getters = {
	isSelectedAll(state){
		/*
			1.如果当前购物车中所有商品都是选中状态,当前全选按钮应该是选中状态
			2.如果当前购物车中有一个或以上商品是未选中状态,当前全选按钮应该是未选中状态
			3.返回值类型:布尔值
		*/
	   let result = state.cartList.every((shopItem)=>{
		   return shopItem.selected
	   })
		return result
	}
}

export default{
	state,
	mutations,
	actions,
	getters
}