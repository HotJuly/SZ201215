// pages/song/song.js
import req from '../../utils/req.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songObj:{},
    musicUrl:"",
    isPlay:false
  },

  // 用于处理用户点击播放按钮操作
  handlePlay(){
    // 1.获取到全局唯一的背景音频管理器
    let backgroundAudioManager = wx.getBackgroundAudioManager()
    // 2.使用背景音频管理器播放歌曲
    // 注意:只添加src不够,title也是必填属性,不添加不能播放音乐
    backgroundAudioManager.src = this.data.musicUrl;
    backgroundAudioManager.title = this.data.songObj.name;
    
    this.setData({
      isPlay:true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    // console.log('options',options)
    let {songId} = options;
    // console.log(songId)


    //请求当前歌曲详细信息(但是没有url链接)
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


    //请求当前歌曲音频资料
    let urlData = await req("/song/url", { id: songId});
    // console.log('urlData', urlData);
    this.setData({
      musicUrl:urlData.data[0].url
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