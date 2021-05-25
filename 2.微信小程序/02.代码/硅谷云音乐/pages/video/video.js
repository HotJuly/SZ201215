// pages/video/video.js
import req from '../../utils/req.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList:[],
    videoList:[],
    currentId:null
  },

  changeId(event){
    // console.log('changeId',event.currentTarget)
    let { id } = event.currentTarget.dataset;
    /*
      自定义属性:你给他什么,他就返回什么,数据类型不变
      标签属性:你给他什么,他会转为字符串返回
     */


    // let { id } = event.currentTarget;
    // console.log(id)
    this.setData({
      currentId:id
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow:async function () {
    //用于获取导航栏信息
    let navData = await req('/video/group/list');
    // console.log('navData',navData)
    this.setData({
      navList:navData.data.slice(0,14),
      currentId: navData.data[0].id
    })

    //用于获取视频列表信息
    let videoData = await req('/video/group',{id:58100});
    // console.log('videoData', videoData)
    let videoList = videoData.datas.map((item,index)=>{
      return item.data
    })
    // console.log(videoList)
    this.setData({
      videoList
    })
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