<template>
	<view class="bargain on">
		<!-- 在header上加 on 为请求支援 -->
		<!-- 当前登录的用户和url上携带的用户id不一致视为被邀请砍价 -->
		<view class="wrapper bargain-box on user" v-if="bargainUserInfo && bargainUid != userInfo.uid">
			<!-- <view class="people">
        {{ bargainShare.lookCount }}人查看 丨 {{ bargainShare.shareCount }}人分享 丨 {{ bargainShare.userCount }}人参与
      </view> -->
			<!-- 帮助砍价、帮砍成功：-->
			<view class="pictxt acea-row row-center-wrapper ">
				<div class="bargain-header">
					<view class="pictrue"><image :src="bargainUserInfo.avatar" /></view>
					<view class="text">
						{{ bargainUserInfo.nickname }}
						<text>邀请您帮忙砍价</text>
					</view>
				</div>
			</view>
		</view>
		<view class="wrapper bargain-box time on">
			<div class="pictxt ">
				<count-down
					:isDay="true"
					:tipText="'倒计时 '"
					:dayText="' 天 '"
					:hourText="' 时 '"
					:minuteText="' 分 '"
					:secondText="' 秒'"
					:datatime="goodsDetail.stopTime"
				></count-down>
			</div>
		</view>
		<view class="wrapper bargain-box bargain-product">
			<view class="pictxt acea-row row-between-wrapper" @click="openAlone">
				<view class="pictrue">
					<image :src="goodsDetail.image" />
					<view class="bargain_view">
						查看商品
						<view class="iconfont icon-jiantou iconfonts"></view>
					</view>
				</view>
				<view class="text acea-row row-column-around">
					<view class="line2" v-text="goodsDetail.title"></view>
					<view class="money font-color-red">
						已砍至: ￥
						<text class="num" v-text="bargainHelpCount.remainingPrice"></text>
					</view>
					<view class="acea-row row-middle">
						<view class="successNum" v-text="'原价' + goodsDetail.price"></view>
						<view class="successNum" v-text="'已有' + bargainSumCount + '人砍价成功'"></view>
					</view>
				</view>
			</view>

			<!-- 砍价进度条 -->
			<view class="cu-progress acea-row row-middle round margin-top">
				<view class="acea-row row-middle bg-red" :style="{ width: bargainHelpCount.pricePercent + '%' }"></view>
			</view>

			<!-- 砍价进度条下的金额 -->
			<view class="balance acea-row row-between-wrapper">
				<view v-text="'已砍' + bargainHelpCount.alreadyPrice + '元'"></view>
				<view v-if="bargainHelpCount.price === 0">砍价成功</view>
				<view v-else v-text="'还剩' + bargainHelpCount.price + '元'"></view>
			</view>

			<!-- 砍价成功：-->
			<!-- 
        surplusPrice  砍价剩余金额为0
        bargainUid  砍价人为发起砍价用户
        userBargainStatus  砍价状态为
       -->
			<view class="bargainSuccess" v-if="pay">
				<span class="iconfont icon-xiaolian"></span>
				恭喜您砍价成功，快去支付吧~
			</view>

			<!-- 参与砍价按钮 同一人-->
			<view v-if="participate" class="bargainBnt" @click="goParticipate">立即发起砍价</view>

			<!-- 邀请好友按钮 -->
			<view v-if="inviteFriends" class="bargainBnt" @click="goPoster">邀请好友帮砍价</view>

			<!-- 帮砍好友砍按钮 -->
			<view v-if="helpFriendsBargain" class="bargainBnt" @click="getBargainHelp">帮好友砍一刀</view>

			<!-- 发起砍价按钮 非同一人-->
			<view v-if="bargain" class="bargainBnt" @click="getBargainStart">我也要砍价</view>

			<!-- 支付按钮 -->
			<view class="bargainBnt" @click="goPay" v-if="pay">立即支付</view>

			<view class="bargainBnt on" @click="goList">抢更多商品</view>
			<view class="tip">
				已有
				<span class="font-color-red" v-text="bargainHelpCount.count"></span>
				位好友成功帮您砍价
			</view>
			<view class="lock"></view>
		</view>
		<view class="bargainGang bargain-box">
			<view class="title font-color-red acea-row row-center-wrapper">
				<view class="pictrue"><image src="@/static/images/left.png" /></view>
				<view class="titleCon">砍价帮</view>
				<view class="pictrue on"><image src="@/static/images/left.png" /></view>
			</view>
			<view class="list">
				<view class="item acea-row row-between-wrapper" v-for="(item, bargainHelpListIndex) in bargainHelpList" :key="bargainHelpListIndex">
					<view class="pictxt acea-row row-between-wrapper">
						<view class="pictrue"><image :src="item.avatar" /></view>
						<view class="text">
							<view class="name line1" v-text="item.nickname"></view>
							<view class="line1" v-text="item.add_time"></view>
						</view>
					</view>
					<view class="money font-color-red">
						<text class="iconfont icon-kanjia"></text>
						砍掉{{ item.price }}元
					</view>
				</view>
			</view>
			<view class="load font-color-red" v-if="!helpListStatus" @click="getBargainHelpList">点击加载更多</view>
			<view class="lock"></view>
		</view>
		<view class="goodsDetails bargain-box">
			<view class="title font-color-red acea-row row-center-wrapper">
				<view class="pictrue"><image src="@/static/images/left.png" /></view>
				<view class="titleCon">商品详情</view>
				<view class="pictrue on"><image src="@/static/images/left.png" /></view>
			</view>
			<view class="conter" v-html="goodsDetail.description"></view>
			<view class="lock"></view>
		</view>
		<view class="goodsDetails bargain-box">
			<view class="title font-color-red acea-row row-center-wrapper">
				<view class="pictrue"><image src="@/static/images/left.png" /></view>
				<view class="titleCon">活动规则</view>
				<view class="pictrue on"><image src="@/static/images/left.png" /></view>
			</view>
			<view class="conter" v-html="goodsDetail.rule"></view>
		</view>
		<view class="bargainTip" :class="active === true ? 'on' : ''">
			<view class="cutOff" v-if="bargainUid === userInfo.uid">
				您已砍掉
				<text class="font-color-red" v-text="bargainHelpPrice"></text>
				元，听说分享次数越多砍价成功的机会越大哦！
			</view>
			<view class="cutOff on" v-else>
				<view class="help font-color-red" v-text="'成功帮砍' + bargainHelpPrice + '元'"></view>
				，您也可以砍价低价拿哦，快去挑选心仪的商品吧~
			</view>
			<view class="tipBnt" @click="goPoster" v-if="bargainUid === userInfo.uid">邀请好友帮砍价</view>
			<view class="tipBnt" @click="getBargainStart" v-else>我也要参与</view>
		</view>
		<view class="mask" @touchmove.prevent :hidden="active === false" @click="close"></view>
	</view>
</template>
<script>
import CountDown from '@/components/CountDown';
import {
	getBargainDetail,
	getBargainShare,
	getBargainStart,
	getBargainHelp,
	getBargainHelpPrice,
	getBargainHelpList,
	getBargainHelpCount,
	getBargainStartUser
} from '@/api/activity';
import { postCartAdd } from '@/api/store';
import { mapGetters } from 'vuex';
import {} from '@/libs/wechat';
import { isWeixin, parseQuery, handleQrCode } from '@/utils/index';

const NAME = 'DargainDetails';

export default {
	name: 'DargainDetails',
	components: {
		CountDown
	},
	props: {},
	data: function() {
		return {
			bargainId: 0, //砍价编号
			bargainSumCount: 0, //砍价成功人数
			activeMsg: '',
			active: false,
			bargainHelpPrice: 0, //砍掉金额
			bargainHelpList: [],
			helpListStatus: false, //砍价列表是否获取完成 false 未完成 true 完成
			page: 1, //页码
			limit: 2, //数量
			pricePercent: 0, //砍价进度条
			bargainShare: {}, // 砍价分享的消息
			bargainHelpCount: {}, // 砍价的信息数据
			goodsDetail: {}, // 商品的详情
			bargainUserInfo: [], // 开启砍价用户信息
			bargainUid: 0, // 参与砍价的用户
			pay: false, // 支付
			bargain: false, // 发起砍价
			participate: false, // 参与砍价
			inviteFriends: false, // 邀请好友
			helpFriendsBargain: false, // 帮好友砍
			bargainSuccess: false, // 帮好友砍价成功
			mainBargainSuccess: false // 砍价成功
		};
	},
	computed: mapGetters(['userInfo', 'isLogin']),
	mounted: function() {
		this.mountedStart();
	},
	methods: {
		// 开始处理砍价逻辑
		mountedStart: function() {
			var that = this;
			let url = handleQrCode();
			// bargainId 砍价商品id
			// bargainUid 发起砍价人
			if (url) {
				// 通过二维码进来
				that.bargainId = url.bargainId;
				that.bargainUid = url.partake;
			} else {
				// 正常途径进来
				that.bargainId = that.$yroute.query.id;
				that.bargainUid = that.$yroute.query.partake;
			}
			if (this.bargainUid == 0 || !this.bargainUid) {
				// url未携带用户uid，填上登录用户uid，跳转
				that.bargainUid = that.userInfo.uid;
			}
			console.log(this);

			// 获取商品详情
			that.getBargainDetail();
			// 砍价数据统计
			that.getBargainShare(0);
			if (that.bargainUid !== that.userInfo.uid) {
				that.getBargainStartUser();
			}
		},
		// 发起砍价
		goParticipate() {
			//发起人和当前用户为同一人
			if (this.bargainUid === this.userInfo.uid) {
				// 变更为当前用户砍价页面
				this.getBargainStart();
			} else {
				// 发起人与当前用户非同一人，变更为发起人的砍价页面
				this.getBargainStartUser();
			}
			this.getBargainHelpCount();
		},
		// 查看商品
		openAlone: function() {
			this.$yrouter.push({
				path: '/pages/shop/GoodsCon/index',
				query: {
					id: this.goodsDetail.productId
				}
			});
		},
		// 砍价完成，去支付
		goPay: function() {
			var data = {};
			var that = this;
			data.productId = that.goodsDetail.productId;
			data.cartNum = that.goodsDetail.num;
			data.uniqueId = '';
			data.bargainId = that.bargainId;
			data.new = 1;
			postCartAdd(data)
				.then(res => {
					that.$yrouter.push({
						path: '/pages/order/OrderSubmission/index',
						query: {
							id: res.data.cartId
						}
					});
				})
				.catch(err => {
					uni.showToast({
						title: err.msg || err.response.data.msg || err.response.data.message,
						icon: 'none',
						duration: 2000
					});
				});
		},
		// 生成海报
		goPoster: function() {
			var that = this;
			that.getBargainShare(that.bargainId);
			this.$yrouter.push({
				path: '/pages/activity/Poster/index',
				query: {
					id: that.bargainId,
					type: 2
				}
			});
		},
		// 跳转砍价商品列表
		goList: function() {
			this.$yrouter.push({
				path: '/pages/activity/GoodsBargain/index'
			});
		},
		//砍价分享
		//bargainId 0  获取 查看人数 分享人数 参与人数
		//bargainId 砍价产品编号 添加分享次数  获取 查看人数 分享人数 参与人数
		getBargainShare: function(bargainId) {
			var that = this;
			getBargainShare({
				bargainId: bargainId
			}).then(res => {
				that.bargainShare = res.data;
			});
		},
		// 获取产品详情
		getBargainDetail: function() {
			var that = this;
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			getBargainDetail(that.bargainId)
				.then(res => {
					uni.hideLoading();
					that.goodsDetail = res.data.bargain;
					that.goodsDetail.description = that.goodsDetail.description.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"');
					that.goodsDetail.rule = that.goodsDetail.rule.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"');
					that.goodsDetail.stopTime = that.goodsDetail.stopTime / 1000;
					that.getBargainHelpCount();
				})
				.catch(res => {
					uni.hideLoading();
					uni.showToast({
						title: res.msg,
						icon: 'none',
						duration: 2000
					});
				});
		},
		// 开启砍价-发起人与当前用户非同一人
		getBargainStart: function() {
			var that = this;
			getBargainStart({
				bargainId: that.bargainId
			})
				.then(() => {
					that.bargainUid = that.userInfo.uid;
					that.getBargainHelp();
					that.getBargainHelpCount();
				})
				.catch(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						duration: 2000
					});
				});
		},
		// 参与砍价
		getBargainHelp: function() {
			var that = this;
			if (this.bargainHelpCount.price === 0 && that.bargainUid !== that.userInfo.uid) {
				return uni.showToast({
					title: '好友已经砍价成功',
					icon: 'success',
					duration: 2000
				});
			}
			var data = {
				bargainId: that.bargainId,
				bargainUserUid: that.bargainUid
			};
			getBargainHelp(data)
				.then(res => {
					that.activeMsg = res.data.status;
					if (res.data.status === 'SUCCESSFUL' && that.bargainUid !== that.userInfo.uid) {
						uni.showToast({
							title: '您已经砍过了',
							icon: 'none',
							duration: 2000
						});
						return;
					}
					that.helpListStatus = false;
					that.page = 1;
					that.bargainHelpList = [];
					that.getBargainHelpPrice();
				})
				.catch(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						duration: 2000
					});
				});
		},
		//获取砍掉的金额
		getBargainHelpPrice: function() {
			var that = this;
			getBargainHelpPrice({
				bargainId: that.bargainId,
				bargainUserUid: that.bargainUid
			})
				.then(res => {
					that.bargainHelpPrice = res.data.price;
					that.getBargainHelpCount();
					that.getBargainHelpList();
					switch (that.activeMsg) {
						case 'SUCCESSFUL':
							break;
						case 'SUCCESS':
							that.active = true;
							break;
					}
				})
				.catch(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						duration: 2000
					});
				});
		},
		// 砍价帮助列表
		getBargainHelpList: function() {
			var that = this;
			if (that.helpListStatus === true) return;
			getBargainHelpList({
				bargainId: that.bargainId,
				bargainUserUid: that.bargainUid,
				page: that.page,
				limit: that.limit
			})
				.then(res => {
					that.helpListStatus = res.data.length < that.limit;
					that.page++;
					if (res.data) {
						that.bargainHelpList.push.apply(that.bargainHelpList, res.data);
					}
				})
				.catch(err => {
					if (!err.msg) {
						return;
					}
					uni.showToast({
						title: err.msg || err.response.data.msg || err.response.data.message,
						icon: 'none',
						duration: 2000
					});
				});
		},
		// 砍价 砍价帮总人数、剩余金额、进度条、已经砍掉的价格
		getBargainHelpCount: function() {
			getBargainHelpCount({
				bargainId: this.bargainId,
				bargainUserUid: this.bargainUid
			})
				.then(res => {
					// 剩余砍价金额，显示已砍至￥** 使用 = 商品价格 - 已经砍掉的金额
					let remainingPrice = (this.goodsDetail.price - res.data.alreadyPrice).toFixed(2);
					this.bargainHelpCount = {
						...res.data,
						remainingPrice
					};
					this.handleButtonStatus();
				})
				.catch(err => {
					if (!err.msg) {
						return;
					}
					uni.showToast({
						title: err.msg || err.response.data.msg || err.response.data.message,
						icon: 'none',
						duration: 2000
					});
				});
		},
		// 判断是否可以支付
		handleButtonStatus() {
			// 砍价按钮分为
			// 1.参与砍价 ==> 发起人与当前用户为同一人 && 未参与
			if (this.bargainUid === this.userInfo.uid && this.bargainHelpCount.status == 0) {
				this.participate = true;
			} else {
				this.participate = false;
			}

			// 2.邀请好友 ==> 发起人与当前用户同一人 && 已参与未过期 && 剩余金额>0
			if (this.bargainUid === this.userInfo.uid && this.bargainHelpCount.status == 1 && this.bargainHelpCount.price > 0) {
				this.inviteFriends = true;
			} else {
				this.inviteFriends = false;
			}

			// 3.帮好友砍价 ==> 发起人与当前用户非一人 && 未参与未过期 && 剩余金额>0  && 为砍价
			if (
				this.bargainUid != this.userInfo.uid &&
				this.bargainHelpCount.status == 1 &&
				// this.bargainHelpCount.userBargainStatus &&
				this.bargainHelpCount.price > 0
			) {
				this.helpFriendsBargain = true;
			} else {
				this.helpFriendsBargain = false;
			}

			// 4.支付 ==> 发起人与当前用户同一人 && 已参与未过期 && 剩余金额<=0
			if (this.bargainUid === this.userInfo.uid && this.bargainHelpCount.status == 1 && this.bargainHelpCount.price <= 0) {
				this.pay = true;
			} else {
				this.pay = false;
			}

			// 5.砍价人发起新的砍价 ==> 发起人与当前用户非一人 && 未参与
			if (this.bargainUid != this.userInfo.uid) {
				this.bargain = true;
			} else {
				this.bargain = false;
			}

			// 砍价弹窗
			// 1.发起人砍价成功 ==> 发起人与当前用户同一人 && 已参与未过期
			// 2.砍价人砍价成功 ==> 发起人与当前用户非一人 && 已参与未过期
			// 3.已砍价 ==> 已参与 && 砍价状态为 true
		},
		// 获取开启砍价用户信息
		// 参与砍价，为同一人发起砍价后
		getBargainStartUser: function() {
			var that = this;
			getBargainStartUser({
				bargainId: that.bargainId,
				bargainUserUid: that.bargainUid
			})
				.then(res => {
					that.bargainUserInfo = res.data;
					that.getBargainHelpList();
				})
				.catch(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						duration: 2000
					});
				});
		},
		// 关闭弹窗
		close: function() {
			this.active = false;
		},
		// 设置微信分享
		onShareAppMessage: function() {
			return {
				title: this.storeInfo.title,
				imageUrl: this.storeInfo.image,
				path: 'pages/activity/DargainDetails/index?id=' + this.storeInfo.id + '&spread=' + uni.getStorageSync('uid'),
				success(res) {
					uni.showToast({
						title: '分享成功'
					});
				},
				fail(res) {
					uni.showToast({
						title: '分享失败',
						icon: 'none'
					});
				}
			};
		}
	},
	onShareAppMessage() {
		return {
			path: `/pages/activity/DargainDetails/index/?id=${this.$yroute.query.id}&partake=${this.userInfo.uid}`
		};
	}
};
</script>

<style lang="less">
.bargain {
	&.on {
		.bargain-box {
			background: #fff;
			width: auto;
			margin: 0 20rpx;
			border: 0;
		}

		.header {
			height: auto;
			text-align: left;

			.time {
				text-align: left;
				font-size: 24rpx;

				margin: 0;
				padding: 0;
				padding: 20rpx;
				width: auto;
				height: auto;
			}
		}
	}
}

page {
	background-color: #f5f5f5 !important;
}

.bargainBnt_hui {
	font-size: 0.3 * 100rpx;
	font-weight: bold;
	color: #fff;
	width: 6 * 100rpx;
	height: 0.8 * 100rpx;
	border-radius: 0.4 * 100rpx;
	background: #bbb;
	text-align: center;
	line-height: 0.8 * 100rpx;
	margin-top: 0.32 * 100rpx;
}

.bargain_view {
	left: 0;
	right: 0;
	height: 0.48 * 100rpx;
	background: rgba(0, 0, 0, 0.5);
	opacity: 1;
	border-radius: 0 0 0.06 * 100rpx 0.06 * 100rpx;
	position: absolute;
	bottom: 0;
	font-size: 0.22 * 100rpx;
	color: #fff;
	text-align: center;
	line-height: 0.48 * 100rpx;
}

.iconfonts {
	font-size: 0.22 * 100rpx;
}
</style>
