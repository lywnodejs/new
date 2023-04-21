import {useRouter} from 'next/router'
import {Layout} from '~/components/Layout'
import {useEffect, useState} from 'react'
import {
  Form,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  Select,
  Modal,
  message,
} from 'antd'
import styles from './style.less'
import {LockOutlined, PhoneOutlined, MailOutlined} from '@ant-design/icons'
import {post, postForm} from '~/utils/fetch'
import {useCookies} from 'react-cookie'
import _ from 'lodash'

const tailLayout = {
  wrapperCol: {span: 24},
}

const LoginForm = () => {
  const [form] = Form.useForm()
  const [cookies, setCookie, removeCookie] = useCookies(['sessionId'])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [smsText, setSmsText] = useState('获取验证码')
  let [time, setTime] = useState(60)
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    // console.log(cookies)
    Object.keys(cookies).forEach((name) => removeCookie(name))
  }, [])

  const onFinish = async (params) => {
    setLoading(true)

    const {
      data: {code, data, desc},
    } = await postForm('userManage/userLogin', params).catch(() => {
      setLoading(false)
    })

    setLoading(false)

    if (code !== 0) {
      return
    }

    if (_.isObject(data) && _.isObject(data.authAccount)) {
      if (data.authAccount.authToken) {
        setCookie('sessionId', data.authAccount.authToken, {path: '/'})
      }
      setCookie('dataScope', data.authAccount.dataScope, {path: '/'})

      if (data.authAccount.accountName) {
        setCookie('name', data.authAccount.accountName, {path: '/'})
      }

      if (data.authAccount.roleId) {
        setCookie('roleId', data.authAccount.roleId, {path: '/'})
      }

      if (data.authAccount.trueName) {
        setCookie('trueName', data.authAccount.trueName, {path: '/'})
      }
    }

    if (_.isObject(data) && _.isObject(data.tenant)) {
      if (data.tenant.id) {
        setCookie('tenantId', data.tenant.id, {path: '/'})
      }
    }

    // location.href = '/'
    router.push('/')
  }

  const getSmsCode = async () => {
    let mobile = form.getFieldValue('mobile')
    if (timer || !mobile) {
      return
    }
    console.log('getSmsCode')
    countDown()
    const {
      data: {code, data, desc},
    } = await postForm('userManage/sendVerifyCode', {mobile})

    if (code == 0) {
      message.success('短信发送成功')
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
      initialValues={
        {
          // mobile: '13800001234',
          // verifyCode: '123456',
        }
      }
      onFinish={onFinish}
    >
      <Form.Item
        name="mobile"
        rules={[
          {
            required: true,
            message: '请输入手机号',
          },
        ]}
      >
        <Input
          placeholder={'请输入手机号'}
          size="large"
          style={{width: '100%'}}
          prefix={<PhoneOutlined />}
        />
      </Form.Item>

      <Form.Item
        name="verifyCode"
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
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  )
}

function body() {
  return (
    <div className={styles.wrapper}>
      <Row justify="space-around" align="middle" className={styles.row}>
        <Col span={2} />
        <Col>
          <h1 className={styles.h1}>九商金融业务后台管理系统</h1>
          <p className={styles.p}></p>
          <LoginForm />
        </Col>
        <Col span={2}></Col>
      </Row>
    </div>
  )
}

body.getInitialProps = () => ({
  login: true,
})

export default body
