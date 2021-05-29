import req from '../../utils/req.js';
import {SETINDEXDATA} from '../mutation-types.js';
const state = {
	indexData:{},
	msg:"我是初始化数据"
}

const mutations = {
	[SETINDEXDATA](state,indexData){
		state.indexData = indexData;
	}
}

const actions = {
	async getIndexData(context){
		let res = await req("/getIndexData");
		context.commit(SETINDEXDATA,res)
		// console.log(context.state.msg)
	}
}

const getters = {
	
}

export default{
	state,
	mutations,
	actions,
	getters
}