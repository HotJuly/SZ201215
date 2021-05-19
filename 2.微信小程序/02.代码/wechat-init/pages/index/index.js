// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  /*
    面试题:为什么Vue中data必须是一个函数
    data:function(){
      return {
        msg:123
      }
    }
    function Person(){
      return new Object()
    }
    Person()

    面试题:如何实现深拷贝
      乞丐版:JSON.parse(JSON.stringify(data))
   */
  data: {
    msg:"女神"
  },

  handleClick(){
    console.log('handleClick')
  },

  handleParent(){
    console.log('handleParent')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   msg:"华华"
    // })
    // console.log(this.data.msg)

    // this.setData({
    //   msg: "华华1"
    // })
    // console.log(this.data.msg)

    // this.setData({
    //   msg: "华华2"
    // })
    // console.log(this.data.msg)

    // this.setData({
    //   msg: "华华3"
    // })
    // console.log(this.data.msg)
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