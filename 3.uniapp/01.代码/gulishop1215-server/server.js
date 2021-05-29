/*
	1.引入依赖
	2.创建服务器实例对象
	3.将服务器实例运行在电脑上的某个端口
	4.注册路由
		1)创建router实例
		2)使用中间件
	 	3)注册路由
		路由函数中接受参数:
			1.express
				1)request	->	请求报文对象
				2)response	->	响应报文对象	response.send(数据)
				3)next	->	执行下一个中间件
			2.koa
				1)ctx	->	request+response
				2)next	->	执行下一个中间件
				返回数据的语法:ctx.body="想要返回的数据"
	
*/
const Koa = require('koa');
const KoaRouter = require('koa-router');

// const app = express();
	// 2.创建服务器实例对象
const app = new Koa();

	// 4.注册路由
	// 	1)创建router实例
	// 	2)使用中间件
	// 	3)注册路由
const router = new KoaRouter()
app.use(router.routes());

// 用于测试服务器是否正常
router.get('/test',function(ctx,next){
	console.log('/test get success')
	ctx.body="/test get success";
})

const indexData = require('./datas/index.json');
router.get('/getIndexData',function(ctx,next){
	// console.log('/test get success')
	ctx.body=indexData;
})

const categoryDatas = require('./datas/categoryDatas.json');
router.get('/getCategoryDatas',function(ctx,next){
	// console.log('/test get success')
	ctx.body=categoryDatas;
})

	// 3.将服务器实例运行在电脑上的某个端口
app.listen('3000',function(error){
	if(error){
		console.log('error',error)
	}else{
		console.log('服务器成功启动于http://localhost:3000')
	}
})