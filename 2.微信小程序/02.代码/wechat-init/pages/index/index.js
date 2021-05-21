// pages/index/index.js
const citySelector = requirePlugin('citySelector');
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
    msg:"女神",
    userInfo:{},
    city:"欢迎来到尚硅谷"
  },

  getUserProfile(){
    wx.getUserProfile({
      desc: "测试",
      success:(detail)=> {
        // console.log('success', res)
        this.setData({
          userInfo:detail.userInfo
        })
      },
      fail(){
        console.log('fail')
      }
    })
  },

  getUserInfo(res){
    // 接受数据的两个位置:1.参数 2.this
    console.log('getUserInfo', res)
    // 判断用户是否授权成功
    if (res.detail.rawData){
      const { userInfo } = res.detail;
      this.setData({
        userInfo
      })
    }
  },

  changeMsg(){
    this.setData({
      msg:"我是修改之后的数据"
    })
  },

  handleClick(){
    // console.log('handleClick')
    // wx.navigateTo({
    //   url: "/pages/log/log"
    // })

    // wx.redirectTo({
    //   url: "/pages/log/log"
    // })

    const key = 'BZ7BZ-QQWCU-DHWV2-BFJJG-B2JZF-KSBT3'; // 使用在腾讯位置服务申请的key
    const referer = '七月入栈'; // 调用插件的app的名称
    const hotCitys = '上海,北京,深圳,泉州'; // 用户自定义的的热门城市

    wx.navigateTo({
      url: `plugin://citySelector/index?key=${key}&referer=${referer}&hotCitys=${hotCitys}`,
    })
  },

  handleParent(){
    // console.log('handleParent')
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

    // 用户二次登录免授权功能
    // wx.getUserInfo({
    //   success:(detail)=>{
    //     // console.log(res)
    //     this.setData({
    //       userInfo:detail.userInfo
    //     })
    //   }
    // })

    console.log(wx.canIUse('getUserProfile'))
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
    const selectedCity = citySelector.getCity();
    if (selectedCity){
      this.setData({
        city: selectedCity.name
      })
    }
    console.log('selectedCity', selectedCity)
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