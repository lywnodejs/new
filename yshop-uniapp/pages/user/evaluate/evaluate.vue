<template>
	<view class="evaluate">
		<view class="evaluate_item">
			<view class="left">
				<image src="../../../static/icon/service.png" mode="widthFix"></image>
				<view>
					<text>李健</text>
					<text class="info">这是项目名称</text>
				</view>
			</view>
			<view class="right">
				<u-rate
				class="u-rate"
				  :count="5"
				  v-model="test"
				  inactive-color="#cccccc"
				  active-color="#f8d94e"
				></u-rate>
				<text class="time">2021年3月1日 22:30:21</text>
			</view>
		</view>
		<view class="evaluate_item">
			<view class="left">
				<image src="../../../static/icon/service.png" mode="widthFix"></image>
				<view>
					<text>李健</text>
					<text class="info">这是项目名称</text>
				</view>
			</view>
			<view class="right">
				<u-rate
				class="u-rate"
				  :count="5"
				  v-model="test"
				  inactive-color="#cccccc"
				  active-color="#f8d94e"
				></u-rate>
				<text class="time">2021年3月1日 22:30:21</text>
			</view>
			<view class="main_content">
				<text>师傅认真负责，很专业，从开始施工到现在，中间沟通过几次基本上都满足了要求~</text>
				<view class="imgs">
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
				</view>
				<view class="zuiJiaPingJia">
					90天后追评
				</view>
				<text>入住后发现有一些问题，联系师傅很快解决了，赞~👍</text>
			</view>
		</view>
		
		<view class="evaluate_item">
			<view class="left">
				<image src="../../../static/icon/service.png" mode="widthFix"></image>
				<view>
					<text>李健</text>
					<text class="info">这是项目名称</text>
				</view>
			</view>
			<view class="right">
				<u-rate
				class="u-rate"
				  :count="5"
				  v-model="test"
				  inactive-color="#cccccc"
				  active-color="#f8d94e"
				></u-rate>
				<text class="time">2021年3月1日 22:30:21</text>
			</view>
			<view class="main_content">
				<text>师傅认真负责，很专业，从开始施工到现在，中间沟通过几次基本上都满足了要求~</text>
				<view class="imgs">
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
				</view>
				<view class="zuiJiaPingJia">
					90天后追评
					<u-rate
					class="u-rate"
					  :count="5"
					  v-model="test"
					  inactive-color="#cccccc"
					  active-color="#f8d94e"
					></u-rate>
				</view>
				<text>入住后发现有一些问题，联系师傅很快解决了，赞~👍</text>
				
				<view class="zuiJiaPingJia">
					190天后追评
					<u-rate
					class="u-rate"
					  :count="5"
					  v-model="test"
					  inactive-color="#cccccc"
					  active-color="#f8d94e"
					></u-rate>
				</view>
				<text>很好，一直没出过问题</text>
				<view class="imgs">
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
					<image src="../../../static/logo.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				test:4
			};
		}
	}
</script>

<style lang="scss">
.evaluate{
	width: 100%;
	height: 100%;
	&_item{
		width: 100%;
		box-sizing: border-box;
		padding:0 20rpx;
		margin-bottom: 20rpx;
		height: auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.left{
			display: flex;
			flex-wrap: wrap;
			image{
				width:120rpx;
				border-radius: 4rpx;
				overflow: hidden;
			}
			view{
				margin-left: 20rpx;
				margin-top: 10rpx;
				line-height: 56rpx;
				color: #333333;
				font-size: 36rpx;
			}
			text{
				width: 100%;
				display: block;
			}
			.info{
				color: $user-theme_font_color_info;
				font-size: 28rpx;
			}
		}
		.right{
			// width: 220rpx;
			display: flex;
			flex-wrap: wrap;
			position: relative;
			padding-top: 10rpx;
			&>text{
				position: absolute;
				bottom: 10rpx;
				right: 0;
				text-align: right;
				width: 320rpx;
				font-size: 28rpx;
				color: #333333;
				display: block;
			}
			.u-rate{
				height: 40rpx;
				overflow: hidden;
			}
		}
		.main_content{
			width: 100%;
			margin-top: 10rpx;
			&>text{
				font-size: 30rpx;
				color:$user-theme_font_color_info;
				line-height: 45rpx;
			}
			.imgs{
				width: 100%;
				margin-top: 10rpx;
				height: auto;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				image{
					width: 32%;
					border-radius: 4rpx;
					margin-bottom: 10rpx;
					overflow:hidden;
				}
			}
			.zuiJiaPingJia{
				width: 100%;
				font-size: 30rpx;
				color: $user-theme_color;
				margin: 20rpx 0 10rpx;
				.u-rate{
					float: right;
				}
			}
		}
	}
}
</style>
