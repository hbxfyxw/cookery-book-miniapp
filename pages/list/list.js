// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ctgId:null,//类别id
    menuName:null,//用户输入的检索关键词
    titleName:null,//标题名称，用于显示在列表顶部
    resData:null,   //列表接口的返回结果
    resDataArr:[],
    searchPageIndex:1, // 搜索结果的当前页 默认是第一页
    searchLoading:false,   //查询的时候底部的loading条
    searchLoadingComplete:false, //查询的时候已经加载完了
    havedataset:true, //有查询结果
    nodataset:false    //无查询结果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading();
    console.log("传递过来的ctgId-->"+options.ctgId),
    console.log("传递过来的menuName-->" + options.menuName),
    console.log("传递过来的titleName-->" + options.titleName),
    this.setData({
      ctgId: options.ctgId,
      menuName: options.menuName,
    }),

      //动态修改页面标题
    wx.setNavigationBarTitle({
      // title: '菜谱列表（' + options.titleName + '）',
      title: typeof (options.titleName) == "undefined" ?'菜谱列表':'菜谱列表（' + options.titleName + '）'
    })
      
    console.log("this.data.searchPageIndex-->" + this.data.searchPageIndex);
      //请求查询菜谱列表
    this.searchMenu(options.ctgId, options.menuName, this.data.searchPageIndex)
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
    /*wx.showModal({
      title: '到底啦',
      content: '到底啦',
    })*/
    // wx.showNavigationBarLoading();
    var that = this;
    that.setData({
      searchPageIndex: that.data.searchPageIndex+1,
      searchLoading : true //提示用户可以加载更多
    })
    console.log("that.data.ctgId-->" + that.data.ctgId);
    console.log("that.data.menuName-->" + that.data.menuName);
    console.log("this.data.searchPageIndex-->" + this.data.searchPageIndex);

    //开始执行查询下一页数据
    that.searchMenu(that.data.ctgId, that.data.menuName, this.data.searchPageIndex)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  // 查询菜谱(借助从上一界面)
  searchMenu: function (cid, menuName, searchPageIndex){
    var that = this;
    console.log("cid-->" + cid);
    console.log("menuName-->"+menuName);
    console.log("searchPageIndex-->"+searchPageIndex);
    if (cid != null && typeof (cid) !="undefined"){
      wx.request({
        url: 'https://apicloud.mob.com/v1/cook/menu/search?key=15ebf415f39a5&cid=' + cid + '&page=' + searchPageIndex +'&size=20',
        method: 'GET',
        success: function (res) {
          wx.hideNavigationBarLoading();
          console.log("res.data-->"+res.data.toString());
          console.log("cid不为空：res.data.result.list.length-->" + res.data.result.list.length);
          console.log("cid不为空：res.data.result.total-->" + res.data.result.total);
          console.log("that.data.resDataArr.length-->" + that.data.resDataArr.length);//0
          // console.log("that.data.resDataArr-->" + that.data.resDataArr);//空
          if (that.data.resDataArr.length == 0){
            //如果之前的结果为空，说明是第一次查询
            console.log("之前结果为空，这是第一次查询");
            that.setData({
              resData: res.data,
              resDataArr: res.data.result.list
            })
            console.log(that.data.resDataArr.length);
          }else{
            //如果之前的结果不为空，说明不是第一次查询，
            //要判断本次的查询结果是否为空，不为空表名有数据要追加上去；为空则表示数据已经全部展示完了，已经拉到最后一页了
            console.log("之前结果不为空，这不是第一次查询");
            if (res.data.result.list.length!=0){
              // 本次有刷新出来的数据
              console.log("本次刷新出来了新的数据，追加到原有列表的最后");
              var tempResDataArr = that.data.resDataArr.concat(res.data.result.list);
              that.setData({
                resData: res.data,
                resDataArr: tempResDataArr
              })
              console.log(that.data.resDataArr.length);
            }else{
              //本次没有刷新出来的数据，表明已经触底了
              console.log("本次没有刷新出来新的数据，列表已经触底了");
              that.setData({
                searchLoading:false,
                searchLoadingComplete:true
              })
            }
          }
        
        }
      })
    }
    if (menuName != null && typeof (menuName) != "undefined"){
      wx.request({
        url: 'https://apicloud.mob.com/v1/cook/menu/search?key=15ebf415f39a5&name=' + menuName + '&page=' + searchPageIndex +'&size=20',
        method: 'GET',
        success: function (res) {
          wx.hideNavigationBarLoading();
          console.log(res.data)
          // console.log("cname不为空：res.data.result.list.length-->" + res.data.result.list.length);
          // console.log("that.data.resDataArr.length-->" + that.data.resDataArr.length);//0
          console.log("res.data.retCode-->" + res.data.retCode);
          if (res.data.retCode == '200'){
            console.log("有查询结果200");
            that.setData({
              havedataset: true, 
              nodataset: false   
            })

            if (that.data.resDataArr.length == 0) {
              //之前的结果为空，说明是第一次查询
              console.log("之前的结果为空，这是第一次查询");
              that.setData({
                resData: res.data,
                resDataArr: res.data.result.list
              })
              console.log(that.data.resDataArr.length);
            } else {
              //之前的结果不为空，说明不是第一次查询
              //要判断本次的查询结果是否为空，不为空表名有数据要追加上去；为空则表示数据已经全部展示完了，已经拉到最后一页了
              console.log("之前的结果不为空，这不是第一次查询");
              if (res.data.result.list.length != 0) {
                var tempResDataArr = that.data.resDataArr.concat(res.data.result.list);
                that.setData({
                  resData: res.data,
                  resDataArr: tempResDataArr
                })
                console.log(that.data.resDataArr.length);
              } else {
                //本次没有刷新出来的数据，表明已经触底了
                console.log("本次没有刷新出来新的数据，列表已经触底了");
                that.setData({
                  searchLoading: false,
                  searchLoadingComplete: true
                })
              }
            }
          }else{
            console.log("返回码不为200，查询不到相关数据");
            that.setData({
              havedataset: false,
              nodataset: true
            })
          }
        },
        fail:function(){
          console.log("cname查询失败。。。");
        }
      })
    }
  },

  //进入详情页
  itemClick:function(event){
    console.log(event);
    var mid = event.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?mid='+mid,
    })
  },

  //列表触底事件
  /*searchScrollLower:function(){
    console.log("列表触底事件被触发了searchScrollLower");
    wx.showModal({
      title: '触底啦',
      content: '触底啦',
    })
  }*/
})