import {useRouter} from 'next/router'
import {Layout} from '~/components/Layout'
import {useEffect, useState} from 'react'
import {Form, Input, Button, Checkbox, Row, Col, Select, Modal} from 'antd'
import styles from './style.less'
import {MobileOutlined, SafetyOutlined, LockOutlined} from '@ant-design/icons'
import fetch from '~/utils/fetch'
import {useCookies} from 'react-cookie'
import {isClient} from '~/utils/config'

const tailLayout = {
  wrapperCol: {span: 24},
}

const loginUrl = 'bank.api.accountservice.dologin'
const smsUrl = 'bank.api.accountservice.getsmsverifycode'

const Captcha = ({form}) => {
  let [count, setCount] = useState(60)
  const countDown = () => {
    count--
    if (count < 1) {
      return setCount(60)
    }
    // console.log(count)
    setCount(count)
    setTimeout(countDown, 1000)
  }
  const onClick = async () => {
    if (count !== 60) return

    const values = await form.validateFields(['mobile']).catch()

    if (values === undefined || !values.mobile) {
      return
    }

    const params = {mobile: values.mobile.trim()}
    const {
      data: {code},
    } = await fetch(smsUrl, [params])
    if (code === 0) {
      countDown()
    }
  }
  return (
    <div onClick={onClick} style={{color: '#1680F6', cursor: 'pointer'}}>
      {count < 60 ? `${count}'` : '获取验证码'}
    </div>
  )
}

const LoginForm = () => {
  const [form] = Form.useForm()
  const [cookies, setCookie, removeCookie] = useCookies(['sessionId', 'mobile'])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // console.log(cookies)
    Object.keys(cookies).forEach((name) => removeCookie(name))
  }, [])

  const onFinish = async ({mobile, passwd, verifyCode}) => {
    setLoading(true)

    const params = {
      mobile,
      passwd,
      verifyCode,
    }

    const {
      data: {code, data, desc},
    } = await fetch(loginUrl, [params]).catch(() => {
      setLoading(false)
    })

    setLoading(false)

    if (code !== 0) {
      return
    }

    setCookie('sessionId', data.sessionId, {path: '/'})
    setCookie('name', data.name, {path: '/'})

    // location.href = '/'
    router.push('/')
  }

  const checkNumber = (rule, value) => {
    if (value === '') {
      return Promise.reject('请输入手机号')
    }

    if (/^1[3-9]\d{9}$/.test(value)) {
      return Promise.resolve()
    }

    return Promise.reject('请输入正确手机号')
  }

  return (
    <Form form={form} style={{width: '400px'}} name="basic" onFinish={onFinish}>
      <Form.Item name="mobile" rules={[{validator: checkNumber}]}>
        <Input
          prefix={<MobileOutlined />}
          placeholder="请输入手机号"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="passwd"
        rules={[{required: true, message: '请输入密码'}]}
      >
        <Input.Password
          placeholder="请输入密码"
          size="large"
          prefix={<LockOutlined />}
        />
      </Form.Item>

      <Form.Item
        name="verifyCode"
        rules={[{required: true, message: '请输入验证码'}]}
      >
        <Input
          size="large"
          placeholder="请输入验证码"
          prefix={<SafetyOutlined />}
          suffix={<Captcha form={form} />}
        />
      </Form.Item>

      <Form.Item>
        <Button
          loading={loading}
          size="large"
          type="primary"
          htmlType="submit"
          block
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  )
}

function body(props) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.h1}>智能营销运营平台</h1>
      <LoginForm {...props} />
    </div>
  )
}

body.getInitialProps = () => ({
  login: true,
})

export default body
