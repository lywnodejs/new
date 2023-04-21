import {useState, useEffect} from 'react'
import Router, {useRouter} from 'next/router'
import {useCookies} from 'react-cookie'
import {Toast, Modal} from 'antd-mobile'
import style from './style.less'
import {fetch} from '~/utils/fetch'
import Head from 'next/head'
import {browser} from '~/utils'

function body(props) {
  const [cookies, setCookie] = useCookies(['sessionId'])
  const router = useRouter()

  useEffect(() => {
    const sessionId = router.query.sessionId
    if (sessionId == undefined) {
      Toast.info('请先登录')
      return
    }
  })

  useEffect(() => {
    setCookie('sessionId', router.query.sessionId)
  }, [cookies])

  let rule = ''
  if (
    props != null &&
    props.configs != undefined &&
    props.configs.rule != undefined
  ) {
    rule = props.configs.rule
  }

  return (
    <div className={style.rootDiv}>
      <Head>
        <title>邀请有礼</title>
        <script
          type="text/javascript"
          src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"
        ></script>
      </Head>
      <RedPacket {...props} />
      <MyReward {...props} />
      <Reward {...props} />
      <RuleDesc rule={rule} />
    </div>
  )
}

function RedPacket(props) {
  const [visible, setVisible] = useState(false)
  const onSubmit = () => {
    if (browser().isWeixin) {
      setVisible(true)
      window.wx.miniProgram.getEnv((res) => {
        if (res.miniprogram) {
          //数据就是专门给小程序分享的  小程序上的用户都是普通用户 所以inviteFromType就写死了1
          const share = {
            msgType: 'webshare',
            title: props.configs.miniappShareTitle,
            imageUrl: props.configs.miniappShareImage,
            path: `/pages/index/index?inviteFromId=${props.inviteFromId}&inviteFromType=1`,
            query: {
              inviteFromId: props.inviteFromId,
              inviteFromType: 1, //邀请人类型0//客户经理1//普通用户
            },
          }
          wx.miniProgram.postMessage({data: share})
        }
      })
    } else {
      location.href = `rcblend://saveImage?imgUrl=${props.inviteImageUrl}`
      if (browser().android) {
        Toast.info('二维码图片已保存至本地相册，快去分享吧~')
      }
    }
  }

  let rewardTypeDesc = '现金'
  switch (props.configs?.rewardType) {
    case 1:
      rewardTypeDesc = '现金'
      break
    case 2:
      rewardTypeDesc = '电话卡'
      break
    case 3:
      rewardTypeDesc = '购物卡'
      break
    default:
      rewardTypeDesc = '现金'
  }

  const start = new Date(
    props.configs?.startTime.replace(new RegExp('-', 'g'), '/'),
  )
  const end = new Date(
    props.configs?.endTime.replace(new RegExp('-', 'g'), '/'),
  )
  const startTime = `${start.getFullYear()}年${
    start.getMonth() + 1
  }月${start.getDate()}日`

  const endTime = `${
    start.getFullYear() == end.getFullYear() ? '' : end.getFullYear() + '年'
  }${end.getMonth() + 1}月${end.getDate()}日`

  return (
    <div className={style.redPacketDiv}>
      <div className={style.amountDiv}>
        <h1>多邀多得，最高可得</h1>
        <span>{props.configs?.maxRewardAmount}</span>
        <h2>{rewardTypeDesc}</h2>
      </div>

      <div className={style.stepDiv}>
        <img
          src={require('~/assets/image/invite/share.png')}
          className={style.stepIcon}
        />
        <img
          src={require('~/assets/image/invite/dot_arrow.png')}
          className={style.stepArrow}
        />
        <img
          src={require('~/assets/image/invite/complete.png')}
          className={style.stepIcon}
        />
        <img
          src={require('~/assets/image/invite/dot_arrow.png')}
          className={style.stepArrow}
        />
        <img
          src={require('~/assets/image/invite/money.png')}
          className={style.stepIcon}
        />
      </div>
      <div className={style.stepDesDiv}>
        <div>
          <h2>邀请好友</h2>
          <h3>{browser().isWeixin ? '分享至好友' : '分享二维码'}</h3>
        </div>
        <div>
          <h2>好友完成</h2>
          <h3>注册/获得额度/借款</h3>
        </div>
        <div>
          <h2>坐等领奖</h2>
          <h3>发放奖励</h3>
        </div>
      </div>

      <div className={style.btnDiv}>
        <a onClick={onSubmit}>
          <img src={require('~/assets/image/invite/invite_btn.png')} />
        </a>
      </div>

      <div className={style.validDiv}>
        <span>
          活动时间：
          {startTime}-{endTime}
        </span>
      </div>
      <Modal
        wrapClassName="invite-share"
        visible={visible}
        transparent
        maskClosable={true}
        onClose={() => {
          setVisible(false)
        }}
      >
        <p>
          点击右上角按钮
          <br />
          然后分享给微信好友
        </p>
      </Modal>
    </div>
  )
}

function MyReward(props) {
  if (props.lastMonthRewardAmount > 0) {
    return <AllMonthReward {...props} />
  } else {
    return <CurMonthReward {...props} />
  }
}

function CurMonthReward(props) {
  return (
    <div className={style.curMonthRewardDiv}>
      <h3>本月奖励</h3>
      <Amount amount={props.currentRewardAmount} />
      <span>当月获得的奖励，将于次月发放</span>
    </div>
  )
}

function AllMonthReward(props) {
  return (
    <div className={style.allMonthRewardDiv}>
      <div>
        <div>
          <h3>本月奖励</h3>
          <Amount amount={props.currentRewardAmount ?? '0'} />
        </div>
        <div>
          <h3>
            上月奖励({props.lastMonthRewardStatus == 0 ? '发放中' : '已发放'})
          </h3>
          <Amount amount={props.lastMonthRewardAmount ?? '0'} />
        </div>
      </div>
      <span>当月获得的奖励，将于次月发放</span>
    </div>
  )
}

function Amount({amount}) {
  return (
    <div className={style.amountDiv}>
      <span>{amount}</span>
    </div>
  )
}

function Reward(props) {
  const strategies = props.configs?.strategies
  const hasLevelTwo = !strategies?.every((item) => item.levelTwo == '/')
  const header = (hasLevelTwo) => {
    if (hasLevelTwo) {
      return (
        <tr>
          <td>
            <span>活动任务</span>
          </td>
          <td>
            <span>一级奖励</span>
          </td>
          <td>
            <span>二级奖励</span>
          </td>
        </tr>
      )
    } else {
      return (
        <tr>
          <td>
            <span>活动任务</span>
          </td>
          <td className={style.increaceWidth}>
            <span className={style.levelReward}>奖励</span>
          </td>
        </tr>
      )
    }
  }
  return (
    <div className={style.rewardDiv}>
      <div className={style.titleDiv}>
        <img src={require('~/assets/image/invite/dots.png')} />
        <span>邀请奖励</span>
        <img
          className={style.rightImg}
          src={require('~/assets/image/invite/dots.png')}
        />
      </div>
      <div className={style.rewareDesDiv}>
        <table>
          <tbody>
            {header(hasLevelTwo)}
            {strategies?.map((item, index) => {
              if (hasLevelTwo) {
                return (
                  <tr key={index}>
                    <td>
                      <span>{item.taskName}</span>
                    </td>
                    <td>
                      <span className={style.levelReward}>{item.levelOne}</span>
                    </td>
                    <td>
                      <span className={style.levelReward}>{item.levelTwo}</span>
                    </td>
                  </tr>
                )
              } else {
                return (
                  <tr key={index}>
                    <td>
                      <span>{item.taskName}</span>
                    </td>
                    <td className={style.increaceWidth}>
                      <span className={style.levelReward}>{item.levelOne}</span>
                    </td>
                  </tr>
                )
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RuleDesc({rule}) {
  return (
    <div className={style.ruleDiv}>
      <div className={style.ruleTitleDiv}>
        <img src={require('~/assets/image/invite/line_arrow.png')} />
        <span>规则说明</span>
        <img
          className={style.rightImg}
          src={require('~/assets/image/invite/line_arrow.png')}
        />
      </div>
      <RuleItem rule={rule} />
    </div>
  )
}

function RuleItem({rule}) {
  return (
    <div className={style.ruleItemDiv}>
      <h3>{rule}</h3>
    </div>
  )
}

body.getInitialProps = async ({
  ctx: {
    query: {sessionId, platform},
  },
}) => {
  try {
    let serviceUserType = 1 //0:客户经理  1:普通用户
    if (
      platform != null &&
      platform != undefined &&
      (platform == 'iosManager' || platform == 'androidManager')
    ) {
      serviceUserType = 0
    }
    const {
      data: {code, data, desc} = {code: -1, data: {}},
    } = await fetch('bank.api.read.portalreadservice.userinvitationpage', [
      {sessionId, serviceUserType},
    ])

    if (code === 0) {
      return data
    }
    return {}
  } catch (err) {
    console.log(err)
    return {}
  }
}

export default body
