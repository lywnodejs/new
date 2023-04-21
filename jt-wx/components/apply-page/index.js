Component({
	properties: {
		img: {
			type: String,
			value: '/image/wait.png'
		},
		title: {
			type: String,
			value: ''
		},
		desc: {
			type: String,
			value: ''
		},
		qrCode: {
			type: String,
			// value: 'https://tse4-mm.cn.bing.net/th/id/OIP.TwdA5X1c0ShqBqcGudgjTwHaHa?w=203&h=202&c=7&o=5&pid=1.7'
			value: '/image/qrcode_for_gh.jpg'
		}
	},
	data: {},
	methods: {
		saveImg: function() {
			let _ = this;
			wx.getSetting({
				success(res) {
					if (!res.authSetting['scope.writePhotosAlbum']) {
						wx.authorize({
							scope:'scope.writePhotosAlbum',
							success() {
								console.log('授权成功')
							},
							fail(fail) {
								console.log(fail)
								wx.showModal({
									title: '保存权限授权',
									content: '请允许保存到相册，否则将无法正常使用保存二维码',
									confirmText: "去设置",
									success: async (res) => {
										wx.openSetting({
											success (res) {
												// console.log('res.authSetting', res.authSetting)
											}
										})
									}
								})
							}
						})
					} else {
						
						wx.saveImageToPhotosAlbum({
							filePath: _.data.qrCode,
							success: res => {
								wx.showToast({
									title: '保存成功',
									icon: 'none'
								})
							},
							fail: res => {
								console.log('fail')
								wx.showToast({
									title: '保存失败',
									icon: 'none'
								})
							}
						})
					}
				}
			})
			
		},
		toOrder: function () {
			wx.redirectTo({
				url: '/pages/order/index/index',
			})
		}
	}
});
