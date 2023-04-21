import {Button, Input, Modal, Form} from 'antd'
import React, {useEffect, useState} from 'react'

export default function SendSms(props) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) {
      form.resetFields()
    }
  }, [visible])

  const successFunc = () => {
    setLoading(false)
    setVisible(false)
  }

  const failFunc = () => {
    setLoading(false)
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true)
        props.getContactInfo(values, successFunc, failFunc)
      })
      .catch((errorInfo) => {
        console.error(errorInfo)
      })
  }
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  }
  return (
    <React.Fragment>
      <Button type="primary" onClick={() => setVisible(true)}>
        新增联系人
      </Button>
      <Modal
        title="新增联系人"
        visible={visible}
        confirmLoading={loading}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form {...layout} form={form} name="basic">
          <Form.Item
            label="联系人姓名"
            name="username"
            rules={[
              {required: true, message: '请输入联系人姓名!'},
              {max: 20, message: '输入范围大于0小于20字符!'},
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="联系人电话"
            name="password"
            rules={[
              {required: true, message: '请输入联系人电话!'},
              {pattern: /^1[3456789]\d{9}$/, message: '请输入正确手机号格式!'},
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="联系人关系"
            name="gx"
            rules={[
              {required: true, message: '请输入联系人关系!'},
              {max: 100, message: '输入范围大于0小于100字符!'},
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  )
}
