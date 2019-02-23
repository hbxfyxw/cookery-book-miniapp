
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid:null,
    ingredientsJson:null,
    methodJson: null,
    ctgIdsJson:null,
    ctgTitlesJson:null,
    ctgIds:null,
    ctgTitles:null,
    resData:null  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading();
    this.setData({
      mid:options.mid
    })
    //一进来就执行查询详情
    this.getDetailInfo(options.mid);
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
    var mid = this.data.mid;
    console.log(this.data.mid),
    console.log(this.data.resData.result.recipe.title),
    console.log(this.data.resData.result.name)
    return {
      title: this.data.resData.result.recipe.title,
      desc:'',
      path: '/pages/detail/detail?mid=' +mid
    }
  },

  getDetailInfo: function(mid){
    var that = this;
    wx.request({
      url: "https://apicloud.mob.com/v1/cook/menu/query?key=15ebf415f39a5&id="+mid,
      method: "GET",//wx.request默认就是GET 所以也可以不写
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data)
        var ingredientsJson = that.stringToJson(res.data.result.recipe.ingredients)
        console.log("ingredientsJson-->"+ingredientsJson)
        var methodJson = that.stringToJson(res.data.result.recipe.method)
        console.log("methodJson-->"+methodJson)
        console.log("ctgIds-->"+res.data.result.ctgIds);
        console.log("ctgTitles-->" +res.data.result.ctgTitles)
        
        var tempCtgIds = res.data.result.ctgIds.toString();
        var ctgIds = new Array();
        ctgIds = tempCtgIds.split(",");
        console.log("ctgIds.length-->" + ctgIds.length);
        
        var tempCtgTitles = res.data.result.ctgTitles.toString();
        var ctgTitles = new Array();
        ctgTitles = tempCtgTitles.split(",");
        console.log("ctgTitles.length-->" + ctgTitles.length);

        that.setData({
           resData:res.data,
           ingredientsJson: ingredientsJson,
           methodJson: methodJson,
           ctgIds : ctgIds,
           ctgTitles: ctgTitles
        })
        //动态修改页面标题
        wx.setNavigationBarTitle({
          title: res.data.result.name,
        })
      },
      fail:function(){
        wx.hideNavigationBarLoading();
      }
    })
  },

  stringToJson:function(data){  
    if (typeof (data) !="undefined"){
      return JSON.parse(data);  
    }
  },

  itemClick:function(e){
    // console.log('id-->' + e.currentTarget.id);
    // console.log('itemClick data.ctgid-->' + e.currentTarget.data.ctgid);
    console.log('itemClick ctgId-->'+ e.currentTarget.dataset.ctgid);
    console.log('itemClick ctgName-->' + e.currentTarget.dataset.ctgname);
    wx.navigateTo({
      url: '../list/list?ctgId=' + e.currentTarget.dataset.ctgid + '&titleName=' + e.currentTarget.dataset.ctgname,
    })
  }
})
