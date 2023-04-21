import {useState} from 'react'
import {useRouter} from 'next/router'
import ErrorPage from 'next/error'
import {fetch} from '~/utils/fetch'
import {Button, Toast} from 'antd-mobile'
import styles from './style.less'
import Uri from 'jsuri'

const Image = ({src}) => {
  return (
    <div
      style={{
        background: `url(${src}) no-repeat 0 0`,
        backgroundSize: '100% auto',
      }}
    >
      <img
        src={src}
        style={{width: '100%', visibility: 'hidden', display: 'block'}}
      />
    </div>
  )
}

const Captcha = ({phone, config}) => {
  let [img, setImg] = useState('')
  let [count, setCount] = useState(60)
  let [captcha, setCaptcha] = useState('')

  const countDown = () => {
    count--
    if (count < 1) {
      return setCount(60)
    }
    // console.log(count)
    setCount(count)
    setTimeout(countDown, 1000)
  }

  const onSend = async () => {
    if (count !== 60) return

    if (!phone) {
      return Toast.info('请输入手机号')
    }

    if (!/1[3-9]\d{9}/.test(phone)) {
      return Toast.info('请输入正确的手机号')
    }

    try {
      const {
        data: {code, data, desc},
      } = await fetch(
        'bank.api.write.standard.userpersonwriteservice.sendverifycode',
        [{mobilePhone: phone, captchaCode: captcha, bizType: 'login'}],
      )
      // 弹出图形验证码输入
      if (code === -10) {
        return setImg(data.captchaCode)
      }

      if (code === 0) {
        countDown()
        return setImg('')
      }

      return Toast.info(desc)
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <>
      <Button
        onClick={onSend}
        style={{
          backgroundColor: config.validateButtonFillTone,
          borderColor: config.validateButtonBorderTone,
          color: config.validateButtonTipsTone,
        }}
      >
        {count < 60 ? `${count}'秒后重发` : '获取验证码'}
      </Button>
      {img && (
        <div className={styles.popup}>
          <div className={styles.content}>
            <img onClick={() => setImg('')} src="/image/close.png" />
            <h1>请输入图中图形验证码</h1>
            <div>
              <input
                style={{width: '50%'}}
                placeholder="请输入图形验证码"
                value={captcha}
                onChange={({target: {value}}) => setCaptcha(value)}
              />
              <img
                width="40%"
                onClick={onSend}
                src={`data:image/jpg;base64,${img}`}
              />
            </div>
            <Button onClick={onSend}>确认</Button>
          </div>
        </div>
      )}
    </>
  )
}

const Form = ({config}) => {
  const placeholderStyle = `input::placeholder,input::-webkit-input-placeholder{color: ${config.inputTipsTone}}`
  const inputStyle = {
    color: config.inputFontColor || config.inputTipsTone,
    borderColor: config.inputTone,
  }

  let [phone, setPhone] = useState('')
  let [captcha, setCaptcha] = useState('')

  const router = useRouter()

  const onSubmit = async () => {
    if (!phone) {
      return Toast.info('请输入手机号')
    }

    if (!/1[3-9]\d{9}/.test(phone)) {
      return Toast.info('请输入正确的手机号')
    }

    if (!captcha) {
      return Toast.info('请输入验证码')
    }

    try {
      const {
        data: {code, desc, data},
      } = await fetch(
        'bank.api.write.standard.userpersonwriteservice.loginorregister',
        [
          {
            mobilePhone: phone,
            verifyCode: captcha,
            loginType: 'verify_code',
            ...router.query,
          },
        ],
      )

      if (code === 0) {
        if (config.buttonUrl) {
          location.href = config.buttonUrl
        } else {
          const url = new Uri('/land/result').addQueryParam(
            'userType',
            data.newUser ? 1 : 0,
          )
          location.href = url.toString()
        }
        return
      }
      return Toast.info(desc)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className={styles.form}>
      <style>{placeholderStyle}</style>
      <input
        style={inputStyle}
        maxLength="11"
        type="tel"
        placeholder="请输入您的手机号码"
        value={phone}
        onChange={({target: {value}}) => {
          setPhone(value)
        }}
      />
      <div>
        <input
          style={{...inputStyle, width: '45%'}}
          type="tel"
          placeholder="验证码"
          maxLength="6"
          value={captcha}
          onChange={({target: {value}}) => {
            setCaptcha(value)
          }}
        />
        <Captcha phone={phone} config={config} />
      </div>
      <span
        className={styles.background}
        style={{backgroundImage: `url(${config.buttonImg})`, display: 'block'}}
        onClick={onSubmit}
      >
        <img
          src={config.buttonImg}
          style={{width: '100%', visibility: 'hidden', display: 'block'}}
        />
      </span>
    </div>
  )
}

const Agreement = ({agreement, config}) => {
  try {
    if (!agreement) return <></>
    agreement = JSON.parse(agreement)
    if (Array.isArray(agreement) && agreement.length > 0) {
      return (
        <p style={{color: config.agreementColor}} className={styles.agreement}>
          阅读并同意
          {agreement.map((agr, i) => (
            <span key={i}>
              <a href={agr.url} style={{color: config.agreementColor}}>
                《{agr.name}》
              </a>
              {i !== agreement.length - 1 && '、'}
            </span>
          ))}
        </p>
      )
    }
  } catch (e) {
    return <></>
  }
}

function body({config, statusCode}) {
  console.log(config)
  if (statusCode !== 200) return <ErrorPage statusCode={statusCode} />
  return (
    <div
      className={`${styles.warp} ${styles.background}`}
      style={{
        background: `${config.pageTone} url(${config.bgImg}) no-repeat 0 0`,
        backgroundSize: '100%',
      }}
    >
      <Image src={config.headImg} />
      <Form config={config} />
      <Agreement agreement={config.agreement} config={config} />
      <div className={styles.footer}>
        {config.publicityImg && (
          <div
            style={{
              backgroundColor: config.pageTone,
              backgroundImage: 'url(${config.publicityImg})',
            }}
          >
            <Image src={config.publicityImg} />
          </div>
        )}
        {config.footDescribe && (
          <div
            className={styles.describe}
            style={{
              color: config.footTipsTone,
              backgroundColor: config.pageTone,
            }}
            dangerouslySetInnerHTML={{__html: config.footDescribe}}
          />
        )}
        {config.footBanner && <Image src={config.footBanner} />}
      </div>
    </div>
  )
}

body.getInitialProps = async ({
  ctx: {
    query: {id},
  },
}) => {
  id = parseInt(id)

  if (isNaN(id)) {
    return {statusCode: 404}
  }

  try {
    const {
      data: {code, data: config},
    } = await fetch('bank.api.read.launchreadservice.getlaunchservice', [{id}])

    if (code === 0) {
      console.log(config)
      return {statusCode: 200, config}
    }
    return {statusCode: 500}
  } catch (err) {
    console.log(err)
    return {statusCode: 500}
  }

  return {statusCode: 404}
}

export default body
