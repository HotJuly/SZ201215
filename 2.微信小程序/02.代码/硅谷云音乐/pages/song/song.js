// pages/song/song.js
import req from '../../utils/req.js';
import PubSub from 'pubsub-js';
console.log('PubSub', PubSub)

let appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songObj:{},
    musicUrl:"",
    isPlay:false,
    songId:null
  },

  // 用于请求歌曲url
  async getMusicUrl(){
    //请求当前歌曲音频资料
    let urlData = await req("/song/url", { id: this.data.songId });
    // console.log('urlData', urlData);
    this.setData({
      musicUrl: urlData.data[0].url
    })
  },

  // 用于请求歌曲详细信息
  async getMusicDetail(){
    let songData = await req('/song/detail', {
      ids: this.data.songId
    });
    this.setData({
      songObj: songData.songs[0]
    })

    // 通过jsAPI动态修改当前页面标题
    wx.setNavigationBarTitle({
      title: this.data.songObj.name
    })
  },

  // 用于监视用户点击上一首/下一首按钮的操作
  switchType(event){
    // console.log('switchType')
    PubSub.publish('switchType',event.currentTarget.id);
  },

  // 用于处理用户点击播放按钮操作
  handlePlay(){
      /* 
        判断当前歌曲播放状态
          如果正在播放,就暂停音频播放
          如果当前没有播放,就开始播放音频
      */

    // 1.获取到全局唯一的背景音频管理器
    let backgroundAudioManager = wx.getBackgroundAudioManager();

    if(this.data.isPlay){
      //暂停音频播放
      backgroundAudioManager.pause();

      // 记录当前歌曲的播放状态
      appInstance.globalData.playState = false;

    } else {
      // 2.使用背景音频管理器播放歌曲
      // 注意:只添加src不够,title也是必填属性,不添加不能播放音乐
      backgroundAudioManager.src = this.data.musicUrl;
      backgroundAudioManager.title = this.data.songObj.name;

      // 记录当前播放的歌曲id,用于后续再次进入页面判断播放状态使用
      appInstance.globalData.audioId = this.data.songId;
      // 记录当前歌曲的播放状态
      appInstance.globalData.playState = true;
    }

    this.setData({
      isPlay:!this.data.isPlay
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    // console.log('options',options)
    let {songId} = options;
    // console.log(songId)
    this.setData({
      songId
    })

    //请求当前歌曲详细信息(但是没有url链接)
    // let songData = await req('/song/detail',{
    //   ids:songId
    // });
    // // console.log('songData',songData)
    // this.setData({
    //   songObj:songData.songs[0],
    //   songId
    // })

    // // 通过jsAPI动态修改当前页面标题
    // wx.setNavigationBarTitle({
    //   title:this.data.songObj.name
    // })
    this.getMusicDetail();


    //请求当前歌曲音频资料
    // let urlData = await req("/song/url", { id: songId});
    // // console.log('urlData', urlData);
    // this.setData({
    //   musicUrl:urlData.data[0].url
    // })
    this.getMusicUrl();

    // console.log('appInstance', appInstance)
    // console.log('appInstance1', appInstance.globalData.msg)
    // appInstance.globalData.msg = "我是修改之后的数据";
    // console.log('appInstance2', appInstance.globalData.msg)

    /*
      下面代码是进行BUG1修复:C3效果和播放状态不统一
     */
    let { audioId , playState } = appInstance.globalData;
    if (playState && audioId === songId) { 
      this.setData({
        isPlay:true
      })
    }

    PubSub.subscribe('sendId', async (msg,songId)=>{
      // console.log('sendId',data)
      this.setData({
        songId
      })

      this.getMusicDetail();
      await this.getMusicUrl();

      let backgroundAudioManager= wx.getBackgroundAudioManager();

      backgroundAudioManager.src = this.data.musicUrl;
      backgroundAudioManager.title = this.data.songObj.name;

      appInstance.globalData.audioId = this.data.songId;
      appInstance.globalData.playState = true;
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