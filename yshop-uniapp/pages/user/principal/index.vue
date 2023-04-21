<template>
	<view class="principal">
		<view class="principal-header principal-list" @click="toOrder">
			<text class="principal-list-title">全部订单</text>
			<view class="principal-header_right">
				进行中{{going}}/已完成{{completed}}
				<text class="principal-header_right-icon iconfont">&#xe608;</text>
			</view>
		</view>
		<view class="principal-list">
			<view class="principal-list-title">我的小区</view>
			<view class="principal-list-item" v-for="(item,index) in plotList" :key="index">
				<view class="principal-list-item-name">
					{{item.name}}
				</view>
				<view class="principal-list-item-info">
					<view>入驻服务项目：{{item.sumCount }}个</view>
					<view>成功交易：{{ item.succesCount }}笔</view>
				</view>
				<view class="principal-list-item-state">
					<text>{{item.state}}</text>
				</view>
			</view>
		</view>
		<view class="principal-more">
			+申请更多小区
		</view>
		<view class="principal-list">
			<view class="principal-list-title">历史记录</view>
			<view class="principal-list-item" v-for="(item,index) in plotList" :key="index">
				<view class="principal-list-item-name">
					{{item.name}}
				</view>
				<view class="principal-list-item-info">
					<view>入驻服务项目：{{item.sumCount }}个</view>
					<view>成功交易：{{ item.succesCount }}笔</view>
				</view>
				<view class="principal-list-item-state">
					<text>{{item.state}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				going: 87,
				completed: 100,
				plotList: [{
						name: '河南省郑州市正弘澜庭叙二期B区',
						sumCount: 213,
						succesCount: 79
					},
					{
						name: '河南省郑州市正弘澜庭叙A区',
						sumCount: 213,
						succesCount: 79,
						state: '已解约'
					}
				]
			};
		},
		
		methods: {
			toOrder(){
				this.$yrouter.push({
					path: '/pages/user/myOrder/index',
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.principal {
		width: 100%;
		height: 100%;
		background-color: #f2f2f2;

		&-header {
			padding: 16rpx;
			height: 100rpx;
			line-height: 80rpx;

			&_right {
				float: right;
				position: relative;
				padding-right: 70rpx;

				&-icon {
					position: absolute;
					right: 30rpx;
					top: 0;
					font-size: 40rpx;
					color: $user-theme_font_color_info;
				}
			}
		}

		&-more {
			color: $user-theme_color;
			padding-left: 10rpx;
			margin-bottom: 25rpx;
		}

		&-list {
			background-color: #fff;
			border-radius: 6rpx;
			margin: 0 10rpx 20rpx 10rpx;
			padding: 10rpx;

			&-title {
				font-weight: bold;
			}

			&-item {
				width: 98%;
				margin: 10rpx auto;
				padding: 10rpx 0;
				border-bottom: 1px solid $user-border-bottom-color;
				position: relative;

				&-name {
					line-height: 50rpx;
				}

				&-info {
					font-size: 24rpx;
					color: $user-theme_font_color_info;
				}

				&-state {
					position: absolute;
					top: 60rpx;
					right: 20rpx;
				}
			}

			&-item:nth-last-child(1) {
				border-bottom: none
			}
		}
	}
</style>
