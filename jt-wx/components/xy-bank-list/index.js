Component({
	properties: {
		list: {
			// [{bankName: 'demo', logo: 'url', isDisabled: boolean, desc: string}]
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
		},
		detached: function() {
			// 在组件实例被从页面节点树移除时执行
		},
	},
	data: {},
	methods: {
		_selectItem: function (e) {
			let index = e.currentTarget.dataset.index;
			let item = this.data.list[index];
			if (item.isDisabled) {
				return
			}
			if(index == this.data.selectedIndex) {
				this.triggerEvent('clickSelected', index)
				return
			}
			this.triggerEvent('click', index)
		}
	}
});
