const app = getApp();
const fetch = require("../../utils/fetch.js");
const renderImg = (data) => {
  const renderData = {
    width: '690rpx',
    height: '940rpx',
    background: '#ffffff',
    borderRadius: '10rpx',
    views: [ {
        type: 'image',
        url: '/image/dash_line.png',
        css: {
          width: '610rpx',
          height: '2rpx',
          position: 'absolute',
          top: '320rpx',
          left: '40rpx',
          right: '40rpx',
        }
      },
    ],
  }
  return renderData
}

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
		platform: "",
		num: [],
		status: '',
		writeData: [],
		buildImg:null,
		listAll:[]
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let height = app.globalData.statusBarHeight
		let platform = '';
		if (height > 20) {
			platform = 'ios'
		}
		this.setData({
			statusBarHeight: app.globalData.statusBarHeight,
			platform: platform,
		})
		this.fetch()
	},

	async fetch(){
		let {
			code,
			data
		  } = await fetch(
			"bank.api.write.standard.recogniseservice.signinit"
		  );
		  if(code == '0'){
			  let numlist = []
			  for(let i = 0;i<data.length;i++){
				numlist.push({id:'Num' + i})
			  }
			  this.setData({
				num:numlist
			  })
		  }
	},

	clearLine() {
		this.setData({
			status: 'clear',
			writeData:[]
		})
	},
	ok() {
		this.setData({
			status: 'img',
		})
	},
	getImageUrl(res) {
		let data = res.detail;
		if (data.lineList.length === 0) {
			wx.showToast({
				title: '请完成签名',
				icon: 'none',
				duration: 2000
			})
		} else {
			let writeData = this.data.writeData;
			writeData.push(data);
			this.setData({
				writeData
			})
			//测试
			// wx.saveImageToPhotosAlbum({
			// 	filePath: data.imgUrl,
			// 	success() {
			// 		wx.showToast({
			// 			title: '保存成功',
			// 		})
			// 	},
			// 	fail(err){
			// 		console.log(err);
			// 	}
			// })
			//end
			if (this.data.writeData.length === this.data.num.length) {
				this.canvasSetImg()
			}
		}
	},

	canvasSetImg() {
		let writeData = this.data.writeData;
		writeData.sort((a, b) => {
			return a.index - b.index
		})
		console.log(writeData,'???')
		//处理位置数据
		let list = writeData.map(item => {
			 item.lineList.push(-1)
			 item.lineList.push(-1)
			return item.lineList
		})
		// let listAll = []
		// listAll.push(list)
		// let listAll = [].concat.apply([], list)
		// listAll.push(-1)
		// listAll.push(-1)
		this.setData({
			listAll:list
		})
		//end

		//生成图片
		let {width,height} = writeData[0]
		const renderData = {
			width: width* writeData.length + 'rpx',
			height: height+'rpx',
			background: '',
			views: [],
		}
		let imgInfo = [];
		writeData.map((item,index)=>{
			imgInfo.push({
				type: 'image',
				url: item.imgUrl,
				css: {
					width: width + 'rpx',
					height: height+'rpx',
					position: 'absolute',
					top: '0px',
					left: item.width*index + 'rpx',
				}
			})
		})
		renderData.views = imgInfo;
		this.setData({
			buildImg:renderData
		})
	},
	async onImgOK(e){
		let params = {
			signatures:this.data.listAll,
			base64:wx.getFileSystemManager().readFileSync(e.detail.path, "base64")
		}
		let {code,data} = await fetch('bank.api.write.standard.recogniseservice.signsave',params)
		if(code == '0'){
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.emit('someSend', {data: '1'});
				wx.navigateBack({
					delta: 1,
				})
		}else {
			this.clearLine()
		}
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