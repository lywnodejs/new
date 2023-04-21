Component({
	externalClasses: ['custom-class', 'scroll-class'],
	options: {
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},
	properties: {
		show: {
			type: Boolean,
			value: false
		},
		height: {
			type: String,
			value: '435px'
		},
		title: {
			type: String,
			value: '标题'
		},
		hasScroll: {
			type: Boolean,
			value: true
		},
		scrollHeight: {
			type: String,
			value: '360px'
		},
		closeIconPosition: {
			type: String,
			value: 'top-right',
		},
		isBack: {
			type: Boolean,
			value: false
		},
		overlay: {
			type: Boolean,
			value: true
		},
		position: {
			type: String,
			value: 'bottom'
		},
		hasCloseFun: {
			type: Boolean,
			value: false
		}
	},
	lifetimes: {
		attached: function() {
			// 在组件实例进入页面节点树时执行
			if (this.data.height !== '435px') {
				let height = parseInt(this.data.height);
				height = height < 66 ? 435 : height;
				let	scrollHeight = height - 66;
				this.setData({
					height: height + 'px',
					scrollHeight: scrollHeight + 'px'
				})
			}
			if (this.data.isBack) {
				this.setData({closeIconPosition: 'top-left'})
			}
		},
		detached: function() {
			// 在组件实例被从页面节点树移除时执行
		},
	},
	data: {},
	methods: {
		onClosePopup: function () {
			console.log(this.data.hasCloseFun)
			if(this.data.hasCloseFun) {
				this.triggerEvent('closeFun')
			} else {
				this.setData({show: false})
			}
		},
		catchMove: function () {
		
		}
	}
});
