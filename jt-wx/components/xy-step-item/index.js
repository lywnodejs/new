Component({
	externalClasses: ['right-class', 'content-desc-class'],
	relations: {
		'../xy-steps/index': {
			type: 'parent', // 关联的目标节点应为父节点
			linked: function(target) {
				// 每次被插入到custom-ul时执行，target是custom-ul节点实例对象，触发在attached生命周期之后
			},
			linkChanged: function(target) {
				// 每次被移动后执行，target是custom-ul节点实例对象，触发在moved生命周期之后
			},
			unlinked: function(target) {
				// 每次被移除时执行，target是custom-ul节点实例对象，触发在detached生命周期之后
			}
		}
	},
	options: {
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},
	properties: {
		item: {
			type: Object,
			value: {}
		},
		rightText: {
			type: String,
			value: ''
		},
		contentDesc: {
			type: String,
			value: ''
		},
		border: {
			type: Boolean,
			value: true
		},
		active: {
			type: Boolean,
			value: true
		},
		activeColor: {
			type: String,
			value: '#FC8100'
		}
	},
	data: {},
	methods: {}
});
