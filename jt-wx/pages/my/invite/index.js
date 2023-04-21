// pages/my/invite/index.js
const app = getApp();
const fetch = app.require("utils/fetch");
Page({

  /**
   * Page initial data
   */
  data: {
    invite: {},
    rules: [{
        title: '邀请规则',
        content: '活动期间，在活动页面点击邀请按钮，直接分享给好友，好友在活动页面注册成功即视为成功建立邀请关系。',
      },
      {
        title: '邀请人任务和奖励',
        content: '当月邀请好友完成注册且获得额度、借款成功任务，邀请人将获得对应奖励。若当月邀请的好友只完成注册且获得额度，未借款成功（即放款成功），则邀请人仅可获得额度奖励；若当月邀请的好友均完成注册、获得额度、借款成功，则邀请人可获得借款奖励。',
      },
      {
        title: '奖励发放',
        content: '每月底将统计本月获得额度和借款成功的好友人数，并于下月初线下发放奖励。',
      },
    ],
    htmlSnip: `
    <div class="htmlSnipDiv">
    <h3 class="htmlSniph3">
    （1）<span class="htmlSnipDivh3span">被邀请好友限制：</span>
    被邀请好友必须是从未注册过自由贷的新用户，老用户邀请后将不予统计奖励。
  </h3>
  <h3 class="htmlSniph3">
    （2）<span class="htmlSnipDivh3span">时间限制：</span>
    被邀请好友必须在注册当月完成额度申请或借款，否则邀请人无法获得奖励。
  </h3>
  <h3 class="htmlSniph3">
    （3）<span class="htmlSnipDivh3span">渠道限制：</span>
    好友必须通过邀请人分享的二维码完成注册，通过其他渠道注册自由贷，则无法与邀请人建立邀请关系。
  </h3>
  <h3 class="htmlSniph3">
    （4）<span class="htmlSnipDivh3span">领取限制：</span>
    奖励仅限活动参与者本人领取，不得转赠。
  </h3>
  </div>
`
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.fetch()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {
    return {
      title: '自由贷，灵活借还，利率优惠！',
      path: `/pages/index/index?inviteFromId=${this.data.invite.inviteFromId}`,
      imageUrl: '/image/share.png'
    };
  },

  async fetch() {
    try {
      const {
        code,
        data,
      } = await fetch("bank.api.read.portalreadservice.userinvitation", {
        isLoading: true,
      });
      if (code === 0) {
        console.log(data)
        this.setData({
          invite: data
        })
      }
    } catch (error) {
      console.log(error);
    }
  },
})