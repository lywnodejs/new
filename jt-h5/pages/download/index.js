import { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import { Toast, Modal, Button, WhiteSpace, } from 'antd-mobile'
import style from './style.less'
import { fetch } from '~/utils/fetch'
import Head from 'next/head'
import { browser } from '~/utils'

function body(props) {
  console.log('app下载页地址:', props)
  const [visible, setVisible] = useState(false)
  const {
    androidDownloadUrl,
    iosDownloadUrl,
    managerAndroidDownloadUrl,
    managerIosDownloadUrl,
  } = props

  const onSubmit = (url,type) => {
    
    if(type == 'android' && browser().isWeixin){
      setVisible(true)
    } else {
      location.href = url
    }
    
  }

  return (
    <div className={style.rootDiv}>
      <Head>
        <title>下载APP</title>
        <script
          type="text/javascript"
          src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"
        ></script>
      </Head>

      <div className={style.contentDiv}>
        <div className={style.logoDiv}>
          <img src={require('~/assets/image/download/keyinbao.png')} />
        </div>
        <div className={style.nameDiv}>
          客银宝
        </div>

      </div>
      <div className={style.downDiv}>

        <Button className={style.downBtn} onClick={() => onSubmit(androidDownloadUrl,'android')}>客户端安卓版下载</Button>
        <WhiteSpace />
        {/* <Button className={style.downBtn} onClick={() => onSubmit(iosDownloadUrl,'ios')}>客户端IOS版下载</Button>
        <WhiteSpace size='xl' /> */}
        {/* <WhiteSpace size='xl' /> */}
        <WhiteSpace size='xl' />
        <Button className={style.ghostDownBtn} onClick={() => onSubmit(managerAndroidDownloadUrl,'android')}>营销端安卓版下载</Button>
        <WhiteSpace />
        {/* <Button className={style.ghostDownBtn} onClick={() => onSubmit(managerIosDownloadUrl,'ios')}>营销端IOS版下载</Button>
        <WhiteSpace /> */}
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



body.getInitialProps = async () => {
  const defaultData = {
    androidDownloadUrl: 'https://jdq-01.oss-cn-hangzhou.aliyuncs.com/mzcj/mzcjczyh.apk',
    iosDownloadUrl: '',
    managerAndroidDownloadUrl: 'https://jdq-01.oss-cn-hangzhou.aliyuncs.com/mzcj/kejia-yewujingli-release.apk',
    managerIosDownloadUrl: '',
  }
  return defaultData
}

export default body
