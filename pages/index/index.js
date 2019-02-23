//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    resData:null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.showNavigationBarLoading();
    //查询分类
    this.queryCategory();
    /*
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
   */
  },

  onShareAppMessage:function(){

  },

  //获取用户信息
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //去到welcome界面
  gotowelcome:function(){
    wx.navigateTo({
      url: '../welcome/welcome',
    })
  },

  gotoDetail:function(){
    wx.navigateTo({
      url: '../detail/detail?name=yuxinwei&sex=1',
    })
  },

  //查询分类
  queryCategory:function(){
    var that = this;
    wx.request({
      url: "https://apicloud.mob.com/v1/cook/category/query?key=15ebf415f39a5",
      method: "GET",
      success: function(res){
        wx.hideNavigationBarLoading();
        console.log(res.data)
        that.setData({
          resData:res.data
        })
      },
      fail:function(){
        wx.hideNavigationBarLoading();
      }
    })
  },
  
  //进入到分类列表
  gotoList:function(event){
    console.log("event-->"+event);
    console.log("event.currentTarget.id-->"+event.currentTarget.id);
    console.log("event.currentTarget.dataset.titlename-->"+event.currentTarget.dataset.titlename);
    wx.navigateTo({
      url: '../list/list?ctgId=' + event.currentTarget.id + "&titleName=" + event.currentTarget.dataset.titlename,
    })
  }
})
