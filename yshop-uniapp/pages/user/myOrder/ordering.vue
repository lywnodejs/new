<template>
	<view class="ordering">
		<view class="ordering-header ordering-list" @click="toOrder">
			<text class="ordering-list-title">我的客户订单</text>
			<view class="ordering-header_right">
				进行中{{going}}/已完成{{completed}}
				<text class="ordering-header_right-icon iconfont">&#xe608;</text>
			</view>
		</view>
		<view class="ordering-list">
			<view class="ordering-list-title">我的赚钱项目</view>
			<view class="flexBetween ordering-list-item" v-for="(item,index) in underingList" :key="index">
				<view class="ordering-list-item_left">
					<image src="../../../static/icon/logo-gray.png" mode="widthFix"></image>
				</view>
				<view class="ordering-list-item_right">
					<view class="ordering-list-item_right-tit">
						<text class="ordering-list-item_right-tit-type">{{item.type}}</text>
						<text class="ordering-list-item_right-tit-name">{{item.name}}</text>
					</view>
					<view class="flexBetween ordering-list-item_right-status">
						<view class="ordering-list-item_right-status-text">
							服务开启中
						</view>
						<view class="ordering-list-item_right-status-btn">
							<text>关闭服务</text>
							<image src="../../../static/icon/logo-gray.png" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="ordering-more">
			+申请更多小区
		</view>
		<view class="ordering-list">
			<view class="ordering-list-title">历史记录</view>
			<view class="flexBetween ordering-list-item" v-for="(item,index) in underingList" :key="index">
				<view class="ordering-list-item_left">
					<image src="../../../static/icon/logo-gray.png" mode="widthFix"></image>
				</view>
				<view class="ordering-list-item_right">
					<view class="ordering-list-item_right-tit">
						<text class="ordering-list-item_right-tit-type">{{item.type}}</text>
						<text class="ordering-list-item_right-tit-name">{{item.name}}</text>
					</view>
					<view class="flexBetween ordering-list-item_right-status">
						<view class="ordering-list-item_right-status-text">
							服务开启中
						</view>
						<view class="ordering-list-item_right-status-btn">
							<text>关闭服务</text>
							<image src="../../../static/icon/logo-gray.png" mode="widthFix"></image>
						</view>
					</view>
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
				underingList: [{
					type: '水路改',
					name: '金牛管业，专业水路改造金牛管业，专业水路改造金牛管业，专业水路改造',
				},
				{
					type: '水路改',
					name: '金牛管业，专业水路改造金牛管业，专业水路改造金牛管业，专业水路改造',
				}]
			};
		},
		methods: {
			toOrder() {
				this.$yrouter.push({
					path: '/pages/user/myOrder/index',
				})
			},
		}
	}
</script>

<style lang="scss">
	.ordering {
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

				&_left {
					width: 30%;

					image {
						width: 100%;
					}
				}

				&_right {
					width: 68%;
					margin-left: 2%;

					&-tit {
						&-type {
							background: $user-theme_color;
							border-radius: 30rpx;
							padding: 0 10rpx;
							color: #fff;
							margin-right: 10rpx;
						}
					}

					&-status {
						&-text {
							color: $user-theme_color;
						}

						&-btn {
							text {
								border-radius: 6rpx;
								background: #e1e1e1;
								padding: 0 25rpx;
							}

							image {
								margin-left: 10rpx;
								width: 30rpx;
							}
						}
					}
				}
			}

		}
	}
</style>
