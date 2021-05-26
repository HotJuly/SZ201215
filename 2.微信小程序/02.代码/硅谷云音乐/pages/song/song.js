// pages/song/song.js
import req from '../../utils/req.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songObj:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    // console.log('options',options)
    let {songId} = options;
    // console.log(songId)
    let songData = await req('/song/detail',{
      ids:songId
    });
    // console.log('songData',songData)
    this.setData({
      songObj:songData.songs[0]
    })

    // 通过jsAPI动态修改当前页面标题
    wx.setNavigationBarTitle({
      title:this.data.songObj.name
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