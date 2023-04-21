Component({
	externalClasses: ['custom-class'],
	properties: {
		activeIndex: {
			type: String,
			value: '-1'
		},
		activeColor: {
			type: String,
			value: '#FC8100'
		}
	},
	data: {},
	methods: {
		_getAllLi: function(){
			// 使用getRelationNodes可以获得nodes数组，包含所有已关联的custom-li，且是有序的
			var nodes = this.getRelationNodes('../xy-step-item/index')
			nodes.forEach((item,index) => {
				item.setData({
					active: this.data.activeIndex >= index,
					activeColor: this.data.activeColor
				})
			})
		}
	},
	relations: {
		'../xy-step-item/index': {
			type: 'child', // 关联的目标节点应为子节点
			linked: function(target) {
				// 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
				// console.log('[custom-ul] a child is linked: ', target)
			},
			linkChanged: function(target) {
				// 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
			},
			unlinked: function(target) {
				// 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
			}
		}
	},
	ready: function(){
		this._getAllLi()
	},
	lifetimes: {
		attached: function() {
			// 在组件实例进入页面节点树时执行
		},
		detached: function() {
			// 在组件实例被从页面节点树移除时执行
		},
	},
});
