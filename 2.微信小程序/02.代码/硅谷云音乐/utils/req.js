/*
  封装代码的核心思想
    1.保留公共部分(重复出现的部分)
    2.提取每次都不一样的数据(将不同的内容动态传入)

    封装函数
      1.保留重复出现的js代码
      2.提取不同的数据,通过形参动态传入
      3.谁调用谁传入

    封装组件
      1.保留重复出现的html,css以及部分js
      2.提取不同的数据,通过标签属性动态传入
      3.谁使用谁传入

 */


export default function(url, data={},method="GET"){
  return new Promise((resolve,reject) => {
    wx.request({
      url: url,
      data,
      method,
      success: (res) => {
        console.log('res', res)
        resolve(res);
        // const banners = res.data.banners;
        // this.setData({
        //   banners
        // })
      }
    });
  })
}