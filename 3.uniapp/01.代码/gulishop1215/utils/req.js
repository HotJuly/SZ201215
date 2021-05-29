import config from './config.js';

/*
	uniapp请求的基础路径需要根据当前运行环境发生变化
	如何知道当前运行环境
		通过uni.getSystemInfoSync(),可以获取到当前手机状态
		从中的platform可以获取到当前项目运行环境
*/
// console.log('uni.getSystemInfoSync()',uni.getSystemInfoSync())
let baseUrl;
let type = uni.getSystemInfoSync().platform;
if(type==="devtools"){
	// 能进入这里,说明当前是小程序
	baseUrl = config.mpHost;
}else if(type === "ios"){
	// 能进入这里,说明当前是浏览器
	baseUrl = config.h5Host;
}


export default function(url,data={},method="GET"){
	return new Promise((resolve,reject)=>{
		uni.request({
			url:baseUrl + url,
			data,
			method,
			success(res) {
				// console.log(res)
				// 由于res是响应报文,其中一定有data(响应体),所以统一返回data
				resolve(res.data)
			},
			fail(error){
				reject(error)
			}
		})
	})
}