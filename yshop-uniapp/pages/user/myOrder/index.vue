<template>
	<view class="order">
		<!-- 进行中 -->
		<view class="order-list">
			<view class="order-list-title">进行中</view>
			<view v-for="(item,index) in underwayList" :key="index" class="order-list-item">
				<view class="flexBetween order-list-item-box">
					<view class="order-list-item-box_left">
						<image src="../../../static/icon/logo-gray.png" mode="widthFix"></image>
					</view>
					<view class="order-list-item-box_right">
						<view class="order-list-item-box_right-tit">
							<text class="order-list-item-box_right-tit-type">{{item.type}}</text>
							<text class="order-list-item-box_right-tit-name">{{item.name}}</text>
						</view>
						<view class="order-list-item-box_right-state" v-for="(goodsitem,goodsindex) in item.goodsList" :key="goodsindex">
							<view class="order-list-item-box_right-state-info">
								{{goodsitem.name}}
							</view>
							<view class="order-list-item-box_right-state-count">
								<text style="color: #fa3534">￥{{goodsitem.price}}</text>
								<text>/{{goodsitem.unit}}</text>
								<text>X{{goodsitem.count}}</text>
							</view>
						</view>
						<view class="order-list-item-box_right-tel">
							<image src="../../../static/icon/logo-gray.png" mode="widthFix"></image>
							{{item.userName}}{{item.userTel}}
						</view>
					</view>
				</view>
				<view class="flexBetween order-list-item-order">
					订单号：{{item.order}}   总价￥{{item.price}}   未支付
				</view>
				<view class="flexBetween order-list-item_footer">
					<view class="order-list-item_footer-info">
						<view>待服务方确认订单</view>
						<view>剩余10天24小时44分22秒</view>
					</view>
					<view class="order-list-item_footer-btn">
						<u-button size="mini" shape="circle">装修诉求</u-button>
						<u-button size="mini" shape="circle" plain type="error">付款</u-button>
					</view>
				</view>
			</view>
		</view>
		<!-- 已完成 -->
		<view class="order-list">
			<view class="order-list-title">已完成</view>
			<view v-for="(item,index) in underwayList" :key="index" class="order-list-item">
				<view class="flexBetween order-list-item-box">
					<view class="order-list-item-box_left">
						<image src="../../../static/icon/logo-gray.png" mode="widthFix"></image>
					</view>
					<view class="order-list-item-box_right">
						<view class="order-list-item-box_right-tit">
							<text class="order-list-item-box_right-tit-type">{{item.type}}</text>
							<text class="order-list-item-box_right-tit-name">{{item.name}}</text>
						</view>
						<view class="order-list-item-box_right-state" v-for="(goodsitem,goodsindex) in item.goodsList" :key="goodsindex">
							<view class="order-list-item-box_right-state-info">
								{{goodsitem.name}}
							</view>
							<view class="order-list-item-box_right-state-count">
								<text style="color: #fa3534">￥{{goodsitem.price}}</text>
								<text>/{{goodsitem.unit}}</text>
								<text>X{{goodsitem.count}}</text>
							</view>
						</view>
						<view class="order-list-item-box_right-tel">
							<image src="../../../static/icon/logo-gray.png" mode="widthFix"></image>
							{{item.userName}}{{item.userTel}}
						</view>
					</view>
				</view>
				<view class="flexBetween order-list-item-order">
					订单号：{{item.order}}   总价￥{{item.price}}   未支付
				</view>
				<view class="flexBetween order-list-item_footer">
					<view class="order-list-item_footer-info">
						<view>待服务方确认订单</view>
						<view>剩余10天24小时44分22秒</view>
					</view>
					<view class="order-list-item_footer-btn">
						<u-button size="mini" shape="circle">装修诉求</u-button>
						<u-button size="mini" shape="circle" plain type="error">付款</u-button>
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
				underwayList: [{
					type: '水路改',
					name: '金牛管业，专业水路改造金牛管业，专业水路改造金牛管业，专业水路改造',
					userName: '张三',
					userTel: '123456789',
					order: 154365260544169,
					price: '3550.00',
					goodsList: [{
						name: '金牛管20PP-R（包工包料，总长不超过',
						price: '35',
						unit: '平方建筑面积',
						count: 10
					},
					{
						name: '金牛管20PP-R（包工包料，总长不超过',
						price: '35',
						unit: '平方建筑面积',
						count: 10
					}]
				},
				{
					type: '水路改',
					name: '金牛管业，专业水路改造金牛管业，专业水路改造金牛管业，专业水路改造',
					userName: '张三',
					userTel: '123456789',
					order: 154365260544169,
					price: '3550.00',
					goodsList: [{
						name: '金牛管20PP-R（包工包料，总长不超过',
						price: '35',
						unit: '组',
						count: 10
					},
					{
						name: '金牛管20PP-R（包工包料，总长不超过',
						price: '35',
						unit: '平方建筑面积',
						count: 10
					}]
				}]
			}
		},
		methods: {

		}
	}
</script>

<style scoped lang="scss">
	.order {
		width: 100%;
		height: 100%;
		background-color: #f2f2f2;

		&-list {
			background-color: #fff;
			border-radius: 6rpx;
			margin: 0 10rpx 20rpx 10rpx;
			padding: 10rpx;
			&-title {
				font-weight: bold;
				padding-left: 10rpx;
			}

			&-item {
				border-bottom: 1px solid $user-border-bottom-color;
				width: 98%;
				margin: 10rpx auto;
				padding: 10rpx 0;
				&-box{
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
						&-state {
							&-info {
								color: $user-theme_font_color_info;
							}
							&-count {
								text:nth-last-child(1) {
									color: $user-theme_font_color_info;
									float: right;
								}
							}
						}
						&-tel {
							image {
								width: 30rpx;
								margin-right: 6rpx;
							}
						}
					}
				}
				&-order {
					color: $user-theme_font_color_info;
				}
				&_footer {
					&-info {
						color: $user-theme_color;
					}
					&-btn {
						u-button {
							margin-right: 10rpx;
						}
						u-button:nth-last-child(1){
							margin-right: 0;
						}
					}
				}
			}
			&-item:nth-last-child(1) {
				border-bottom: none
			}
		}
	}
</style>
