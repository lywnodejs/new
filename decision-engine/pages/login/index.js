import {Layout} from '~/components/Layout'
import {useEffect, useState} from 'react'
import {Form, Input, Button, message, Row, Col, Select, Modal} from 'antd'
import styles from './style.less'
import {
  LockOutlined,
  SafetyOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import fetch from '~/utils/fetch'
import {useCookies} from 'react-cookie'
import {useRouter} from 'next/router'

// abandoned？
const tailLayout = {
  wrapperCol: {span: 24},
}

const LoginForm = () => {
  const [form] = Form.useForm()
  const [cookies, setCookie] = useCookies(['sessionId'])
  const [loading, setLoading] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)

  const router = useRouter()

  const [smsText, setSmsText] = useState('获取验证码')
  let [time, setTime] = useState(60)
  const [timer, setTimer] = useState(null)

  const initialValues =
    process.env.NODE_ENV === 'production'
      ? {}
      : {
          account: '18600000001',
          code: '111111',
        }

  const onFinish = async (params) => {
    setLoading(true)

    const {
      data: {code, data},
    } = await fetch('fincloud.admin.center.facade.api.authservice.dologinsms', [
      params,
    ]).catch(() => {
      setLoading(false)
    })

    setLoading(false)

    if (code !== 0) {
      return
    }

    const {account = '', sessionId = ''} = data || {}

    if (sessionId) {
      setCookie('sessionId', sessionId, {path: '/'})
    }

    if (account) {
      setCookie('name', account, {path: '/'})
    }

    // location.href = '/'
    router.push('/')
  }

  const getSmsCode = async () => {
    let account = form.getFieldValue('account')
    if (timer || !account) {
      return
    }
    // console.log('getSmsCode')
    const {
      data: {code, data, desc},
    } = await fetch(
      'fincloud.admin.center.facade.api.authservice.sendloginsms',
      [{account}],
    )

    if (code == 0) {
      message.success('验证码已发送')
      countDown()
      setOpenLogin(true)
    }
  }

  const countDown = () => {
    setSmsText(`${time}s后重新获取`)
    const c_timer = setInterval(() => {
      time--
      if (time === 0) {
        clearInterval(c_timer)
        setTimer(null)
        setTime(60)
        setSmsText('获取验证码')
      } else {
        setSmsText(`${time}s后重新获取`)
      }
    }, 1000)
    setTimer(c_timer)
  }

  return (
    <Form
      form={form}
      style={{width: '400px'}}
      name="basic"
      initialValues={initialValues}
      onFinish={onFinish}
      className={styles.form}
    >
      <Form.Item
        name="account"
        rules={[
          {
            required: true,
            message: '请输入手机号',
          },
          {message: '手机号不正确', pattern: /^1[3-9]\d{9}$/},
        ]}
      >
        <Input
          placeholder={'请输入手机号'}
          size="large"
          maxLength={11}
          style={{width: '100%'}}
          prefix={<PhoneOutlined />}
        />
      </Form.Item>

      <Form.Item
        name="code"
        rules={[{required: true, message: '请输入验证码'}]}
      >
        <Input.Search
          size="large"
          prefix={<MailOutlined />}
          placeholder="请输入验证码"
          enterButton={smsText}
          onSearch={getSmsCode}
        />
      </Form.Item>

      <Form.Item>
        <Button
          loading={loading}
          size="large"
          type="primary"
          htmlType="submit"
          block
          disabled={!openLogin}
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  )
}

function body(props) {
  const [cookies, setCookie, removeCookie] = useCookies(['sessionId'])

  return (
    <div className={styles.wrapper}>
      <Row justify="space-around" align="middle" className={styles.row}>
        <Col span={2}></Col>
        <Col>
          <h1 className={styles.h1}>决策引擎管理平台</h1>
          <p className={styles.p}></p>
          <LoginForm />
        </Col>
        <Col span={2}></Col>
      </Row>
    </div>
  )
}

// init
body.getInitialProps = () => ({
  login: true,
})

export default body
