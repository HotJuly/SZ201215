// pages/index/index.js
// 引入js文件不能使用绝对路径
import req from '../../utils/req.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],
    recommendList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    // console.log('window', window)
    // console.log('wx', wx)
    /*
      发送请求三要素
      1.在哪发
        onLoad
      2.怎么发
        wx.request(),该API可以发送请求
      3.往哪发
        去接口文档查看接口
     */
    // console.log(1)

    //用于请求轮播图数据
    // wx.request({
    //   url:"http://localhost:3000/banner",
    //   data:{
    //     type:2
    //   },
    //   success:(res)=>{
    //     // console.log('res', res)
    //     const banners = res.data.banners;
    //     this.setData({
    //       banners
    //     })
    //   }
    // })

    let result = req('http://localhost:3000/banner',{type:2});
    result.then((res) => {
      // console.log('result', res);
      const banners = res.data.banners;
      this.setData({
        banners
      })
    })
    // console.log(2)

    //用于请求推荐歌曲区域数据
    // wx.request({
    //   url: "http://localhost:3000/personalized",
    //   success: (res) => {
    //     // console.log('res', res)
    //     const recommendList = res.data.result;
    //     this.setData({
    //       recommendList
    //     })
    //   }
    // })

    let result1 = req('http://localhost:3000/personalized');
    result1.then((res) => {
      const recommendList = res.data.result;
      this.setData({
        recommendList
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})