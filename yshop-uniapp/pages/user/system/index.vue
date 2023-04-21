<template>
	<view class="systemOut">
		<view class="systemOut_outImg">
			<image src="../../../static/icon/logo-blue.png" mode="widthFix"></image>
		</view>
		<text>狗窝装修</text>
		<button type="default" class="systemOut_but" @click="outLogin">退出登录</button>
	</view>
</template>

<script>
import { mapActions,mapMutations } from "vuex";
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			...mapMutations(['logout']),
			outLogin(){
				this.logout();
				wx.switchTab({url:'/pages/user/User/index'})
			}
		}
	}
</script>

<style lang="scss">
.systemOut{
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding-top: 100rpx;
	text{
		width: 100%;
		display: block;
		text-align: center;
		font-size: 40rpx;
		color: $user-theme_color;
	}
	.systemOut_outImg{
		width: 200rpx;
		height: 200rpx;
		background: #e8e8e8;
		border-radius: 50%;
		margin: 0 auto 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		image{
			width:70%;
		}
	}
	.systemOut_but{
		margin: 600rpx auto 0;
		width: 600rpx;
		height: 90rpx;
		font-size: 35rpx;
		color: #ffffff;
		background: $user-theme_color;
	}
}
</style>
