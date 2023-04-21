import axios from 'axios'
import style from './style.less'
import {Button, Modal, InputItem, TextareaItem, Toast} from 'antd-mobile'
import {useState, useEffect, useRef} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import {browser} from '~/utils'

const useBodyWidth = () => {
  const [width, setWidth] = useState(375)
  useEffect(() => {
    setWidth(document.body.offsetWidth)
  }, [])

  return [width, setWidth]
}

const Winning = ({visible, setVisible, prize, prizes, styles, user}) => {
  const router = useRouter()
  let name = user.receiveUserName
  let phone = user.receiveMobilePhone
  let address = ''
  const onSubmit = async () => {
    if (!name) {
      return Toast.info('请输入姓名')
    }

    if (!phone) {
      return Toast.info('请输入手机号')
    }

    if (!address) {
      return Toast.info('请输入地址')
    }

    const {id, sessionId} = router.query
    const {
      data: {code, msg},
    } = await axios.post(
      `/a-api/activity/prize-physical-form.do?sessionId=${sessionId}`,
      {
        name,
        phone: phone.replace(/\s/g, ''),
        address,
        id,
        recordId: prize.recordId,
      },
    )
    if (code === 0) {
      Toast.info('恭喜，信息提交成功')
      return setVisible(false)
    }
    Toast.info(msg)
  }

  return (
    <Modal
      className={style.popup}
      visible={visible}
      transparent
      maskClosable={false}
    >
      <img className="icon-top" src="/image/popup-top.png" />
      <img className="icon-bottom" src="/image/popup-bottom.png" />
      <img className="prize" src={visible ? prizes[prize.index].logo : ''} />
      <div className="content" style={styles.dialogBgColor}>
        <InputItem
          onChange={(value) => (name = value)}
          value={user.receiveUserName}
          placeholder="请填写姓名"
        />
        <InputItem
          onChange={(value) => (phone = value)}
          value={user.receiveMobilePhone}
          type="phone"
          placeholder="请填写手机号"
        />
        <TextareaItem
          rows={2}
          onChange={(value) => (address = value)}
          placeholder="请填写地址"
        />
        <a
          style={styles.dialogButtonStyle}
          className="submit"
          onClick={onSubmit}
        >
          提交
        </a>
        <p>信息提交后不可更改，请注意核查！</p>
      </div>
    </Modal>
  )
}

const Wheel = ({styles, prizes, prizeCount, priview, user}) => {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [prize, setPirze] = useState({})
  const [bout, setBout] = useState(prizeCount > 0 ? prizeCount : 0)
  const [deg, setDeg] = useState(0)
  const [size] = useBodyWidth()

  const onWheel = async () => {
    if (Wheel.isLocked || priview) {
      return
    }

    Wheel.isLocked = true

    const {id, sessionId} = router.query
    const {
      data: {code, data, msg},
    } = await axios.post(
      `/a-api/activity/prize-get.do?sessionId=${sessionId}`,
      {
        id,
      },
    )

    //-101 活动尚未开始 -102活动结束 -108登录失效
    if (code !== 0) {
      Wheel.isLocked = false
      return Toast.info(msg || '登录失效')
    }
    const {count, index, type, recordId} = data
    setPirze({index, type, recordId})
    setBout(count)

    let d = index * (360 / prizes.length)
    setDeg(d + 3600 * (Wheel.count = (Wheel.count || 0) + 1))

    setTimeout(() => {
      Wheel.isLocked = false

      //5没有中奖
      if (type === 5) {
        Toast.info('差一点就抽中啦，再来一次吧')
      } else {
        setVisible(true)
      }
    }, 6000)
  }

  return (
    <>
      <div className={style.wheel}>
        <ul
          style={{
            backgroundImage: `url(${styles.wheelBgImage.backgroundImage})`,
            height: size * 0.9,
            width: size * 0.9,
            transform: `rotate(${deg}deg)`,
          }}
        >
          {prizes.map((v, i) => (
            <li
              key={i}
              style={{transform: `rotate(${-i * (1 / prizes.length)}turn)`}}
            >
              <img src={v.logo} />
            </li>
          ))}
        </ul>
        <a onClick={onWheel}>
          <img src={styles.wheelButton} />
        </a>
        <Winning {...{visible, setVisible, prize, prizes, styles, user}} />
      </div>
      <div className={style.draws}>
        抽奖次数：<span>{bout}</span> 次
      </div>
      <p style={styles.wheelCountIntroColor}>
        【每申请1款产品】可增加1次抽奖机会
      </p>
    </>
  )
}

const Rule = ({rule}) => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Button onClick={() => setVisible(true)} className={style.ruleBtn}>
        活动规则
      </Button>
      <Modal
        className={style.rule}
        visible={visible}
        transparent
        maskClosable={false}
        title="活动规则"
        footer={[
          {
            text: '我知道了',
            onPress: () => {
              setVisible(false)
            },
          },
        ]}
      >
        <div dangerouslySetInnerHTML={{__html: rule}}></div>
      </Modal>
    </>
  )
}

const useWelter = () => {
  const router = useRouter()
  const [data, setData] = useState([])

  const fetch = async (params) => {
    const {
      data: {code, data},
    } = await axios.post('/a-api/activity/prize-list.do', params)
    if (code === 0) {
      // console.log(data)
      setData(data.items)
    } else {
      setData([])
    }
  }

  useEffect(() => {
    fetch(router.query)

    setInterval(() => {
      fetch(router.query)
    }, 3000)
  }, [])

  return data
}

const Welter = () => {
  const router = useRouter()
  const items = useWelter()
  const ulRef = useRef(null)

  const roll = () => {
    var i = 0
    var interval = null
    if (!ulRef.current || items.length === 0) {
      return
    }

    !!Welter.interval && clearInterval(Welter.interval)
    Welter.interval = setInterval(() => {
      if (!ulRef.current) {
        clearInterval(Welter.interval)
        return
      }

      i += 1
      if (i >= ulRef.current.offsetHeight / 2) {
        i = 0
      }
      ulRef.current.style.marginTop = `-${i}px`
    }, 1000 / 25)
  }

  useEffect(() => {
    roll()
  }, [items])

  return (
    <div className={style.welter}>
      <div>
        <ul ref={ulRef}>
          {[...items, ...items].map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      </div>
      <a
        onClick={() => {
          router.push(
            `/activity/prize/${router.query.id}?sessionId=${router.query.sessionId}`,
          )
        }}
      >
        我的奖品
      </a>
    </div>
  )
}

function body({
  title,
  priview,
  prizeCount,
  prizes: {items},
  styles,
  rule,
  share,
  user = {},
}) {
  console.log(styles, user)
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const onShare = () => {
    axios.post(`/a-api/activity/click.do?sessionId=${router.query.sessionId}`, {
      id: router.query.id,
      button: 'button_share',
    })
    if (browser().isWeixin) {
      setVisible(true)
      window.wx.miniProgram.getEnv((res) => {
        if (res.miniprogram) {
          const shareInfo = {
            msgType: 'webshare',
            title: share.title,
            imageUrl: share.shareIcon,
            path: '/pages/index/index',
          }
          wx.miniProgram.postMessage({data: shareInfo})
        }
      })
    } else {
      location.href = `rcblend://saveImage?imgUrl=${share.shareImageUrl}`
      if (browser().android) {
        Toast.info('二维码图片已保存至本地相册，快去分享吧~')
      }
    }
  }
  const onLoan = () => {
    if (browser().isWeixin) {
      window.wx.miniProgram.getEnv((res) => {
        if (res.miniprogram) {
          wx.miniProgram.switchTab({
            url: `/pages/index/index`,
          })
        }
      })
    } else {
      location.href = 'rcblend://home'
    }
  }

  return (
    <div
      className={style.warp}
      style={{backgroundImage: `url(${styles.bgImage.backgroundImage})`}}
    >
      <Head>
        <title>{title}</title>
        <script
          type="text/javascript"
          src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"
        ></script>
      </Head>
      <Rule {...{rule}} />
      <div className={style.title}>
        <img width="100%" src={styles.headImage} />
      </div>
      <Wheel {...{prizes: items, styles, prizeCount, priview, user}} />

      <div className={style.buttons}>
        {styles.shareButton && (
          <a onClick={onShare}>
            <img src={styles.shareButton} />
          </a>
        )}
        {styles.loanButton && (
          <a onClick={onLoan}>
            <img src={styles.loanButton} />
          </a>
        )}
      </div>
      <Welter />
      <Modal
        wrapClassName={style.share}
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

body.getInitialProps = async ({
  ctx: {
    query: {id, sessionId},
  },
}) => {
  try {
    const {data: {code, data} = {code: -1, data: {}}} = await axios.get(
      `/a-api/activity/config.do?id=${id}&sessionId=${sessionId}`,
    )
    if (code === 0) {
      return data
    }
    return {prizes: {items: []}, styles: {}}
  } catch (err) {
    console.log(err)
    return {prizes: {items: []}, styles: {}}
  }
}

export default body
