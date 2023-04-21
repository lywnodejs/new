

Component({
	properties: {
		title: {
			type: String,
			value: '个人信息'
		},
		platform: {
			type: String,
			value: 'ios'
		},
	},

	lifetimes: {
		attached() {
			const res = wx.getSystemInfoSync();
			// console.log(res, '++++++++++++++')
			this.setData({platform: res.platform})
		}
	},

	methods: {
		onClickLeft: function () {
			this.triggerEvent('navLeftClick')
		}
	}
});
