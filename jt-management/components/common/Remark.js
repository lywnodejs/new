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
        props.getRemark(values.remark, successFunc, failFunc)
      })
      .catch((errorInfo) => {
        console.error(errorInfo)
      })
  }
  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
  }
  return (
    <React.Fragment>
      <div onClick={() => setVisible(true)}>
        {props.target ? props.target : <Button type="link">备注</Button>}
      </div>

      <Modal
        title="备注"
        visible={visible}
        confirmLoading={loading}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form {...layout} form={form} name="basic">
          <Form.Item
            label="备注"
            name="remark"
            rules={[
              {required: true, message: '请输入备注!'},
              {whitespace: true},
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  )
}
