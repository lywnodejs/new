Component({
	properties: {
		list: {
			// [{title: 'demo'}]
			type: Array,
			value: []
		},
		selectedIndex: {
			type: Number,
			value: -1
		}
	},
	lifetimes: {
		attached: function() {
			// 在组件实例进入页面节点树时执行
			let type = Object.prototype.toString.call(this.data.list);
			if (type !== '[object Array]') {
				this.setData({list: []})
			} else {
				let list = this.data.list.map(item => {
					if (typeof item === 'string') {
						return {title: item}
					}
					return item
				});
				this.setData({list})
			}
		},
		detached: function() {
			// 在组件实例被从页面节点树移除时执行
		},
	},
	data: {},
	methods: {
		_selectItem: function (e) {
			let index = e.currentTarget.dataset.index;
			this.triggerEvent('click', index)
		}
	}
});
