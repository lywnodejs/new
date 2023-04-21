import {useEffect, useState} from 'react'
import Router, {useRouter} from 'next/router'
import {useCookies} from 'react-cookie'
import {Toast, Modal} from 'antd-mobile'
import style from './style.less'
import {fetch} from '~/utils/fetch'
import Head from 'next/head'
import {browser} from '~/utils'

function body(props) {
  const [visible, setVisible] = useState(false)
  const {androidDownloadUrl, iosDownloadUrl} = props
  const router = useRouter()

  const {
    query: {userType = 1},
  } = router

  const onSubmit = () => {
    if (browser().isWeixin) {
      setVisible(true)
    } else if (browser().android) {
      location.href = 'rcblend://com.quantum.mzhcb.user.lend'
      if (androidDownloadUrl != null && androidDownloadUrl != undefined) {
        setTimeout(() => {
          location.href = androidDownloadUrl
        }, 100)
      }
    } else if (browser().ios) {
      location.href = 'rcblend://zp.customer'
      if (iosDownloadUrl != null && iosDownloadUrl != undefined) {
        setTimeout(() => {
          location.href = iosDownloadUrl
        }, 100)
      }
    }
  }

  return (
    <div className={style.rootDiv}>
      <Head>
        <title>注册结果</title>
        <script
          type="text/javascript"
          src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"
        ></script>
      </Head>

      <div className={style.logoDiv}>
        <img src={require('~/assets/image/land/logo_land.png')} />
      </div>
      <div className={style.contentDiv}>
        <img
          className={style.logo}
          src={require('~/assets/image/land/check_right_green.png')}
        />
        <h2 className={style.result}>
          {userType == 1 ? '注册成功' : '您已注册过客银宝'}
        </h2>
        <span className={style.resultTip}>下载/打开APP查看您的借款额度</span>

        {props.products.map((item, index) => {
          return (
            <div key={index} style={{width: '100%'}}>
              <ProductItem {...item} />
            </div>
          )
        })}
      </div>
      <div className={style.downDiv}>
        <div className={style.downBtn} onClick={onSubmit}>
          <span className={style.downBtnText}>下载/打开客银宝APP</span>
        </div>
        <span>具体产品信息请在APP内查看</span>
      </div>
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
          然后用浏览器打开
        </p>
      </Modal>
    </div>
  )
}

function ProductItem(props) {
  const loanInfo = [
    {
      title: '借款额度',
      value: `¥${props.minCreditAmount}-${props.maxCreditAmount}`,
    },
    {
      title: '借款利率',
      value: `最低年利率${
        props.rateType == 2 ? props.yearInterestRate * 100 : props.minRate * 100
      }%`,
    },
    {
      title: '借款期限',
      value: `${
        props.termModel == 2
          ? `可选${props.allowTerms.replace(RegExp('/', 'gm'), '、')}`
          : `可选${props.minTerms}-${props.maxTerms}`
      }`,
    },
  ]
  return (
    <div className={style.productItemDiv}>
      <div>
        <img src={props.logo} />
        <h2>{props.name}</h2>
      </div>
      <div className={style.dashLine}></div>
      {loanInfo.map((item, index) => {
        return (
          <div key={index} style={{width: '100%'}}>
            <LoanInfoItem {...item} />
          </div>
        )
      })}
    </div>
  )
}

function LoanInfoItem(props) {
  return (
    <div className={style.loanInfoItemDiv}>
      <span className={style.itemTitle}>{props.title}</span>
      <span className={style.itemValue}>{props.value}</span>
    </div>
  )
}

body.getInitialProps = async () => {
  const defaultData = {
    androidDownloadUrl: '',
    iosDownloadUrl: '',
    products: [],
  }
  try {
    const {
      data: {code, data} = {code: -1, data: {}},
    } = await fetch('bank.api.read.basereadservice.landregisterresult', [{}])

    if (code === 0) {
      return data
    }
    return defaultData
  } catch (err) {
    console.log(err)
    return defaultData
  }
}

export default body
