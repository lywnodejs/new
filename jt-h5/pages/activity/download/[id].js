import axios from 'axios'
import style from '../style.less'
import {Button, Modal, InputItem, Toast} from 'antd-mobile'
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

const Wheel = ({styles, prizes}) => {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [deg, setDeg] = useState(0)
  const [size] = useBodyWidth()

  return (
    <>
      <div className={style.wheel}>
        <ul
          style={{
            ...styles.wheelBgImage,
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
        <a>
          <img src={styles.wheelButton} />
        </a>
      </div>
    </>
  )
}

function body({title, prizes: {items}, styles, rule, share}) {
  const [visible, setVisible] = useState(false)

  const onDownload = () => {
    const {androidDownloadUrl, iosDownLoadUrl} = share
    if (browser().android) {
      location.href = 'rcblend://com.quantum.mzhcb.user.lend'
      if (androidDownloadUrl != null && androidDownloadUrl != undefined) {
        setTimeout(() => {
          location.href = androidDownloadUrl
        }, 100)
      }
    } else if (browser().ios) {
      location.href = 'rcblend://zp.customer'
      if (iosDownLoadUrl != null && iosDownLoadUrl != undefined) {
        setTimeout(() => {
          location.href = iosDownLoadUrl
        }, 100)
      }
    }
  }

  return (
    <div className={style.warp} style={styles.bgImage}>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={style.title}>
        <img width="100%" src={styles.wheelTitle} />
      </div>
      <Wheel {...{prizes: items, styles}} />
      <img
        onClick={onDownload}
        className={style.download}
        src="/image/btn.png"
      />
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
          然后请在手机浏览器中打开
        </p>
      </Modal>
    </div>
  )
}

body.getInitialProps = async ({
  ctx: {
    query: {id},
  },
}) => {
  try {
    const {data: {code, data} = {code: -1, data: {}}} = await axios.get(
      `/a-api/activity/config.do?id=${id}`,
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
