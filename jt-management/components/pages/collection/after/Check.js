import {Button, Input, Modal, Form} from 'antd'
import React, {useEffect, useState} from 'react'

export default function SendSms(props) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  useEffect(() => {
    if (props.show) {
      form.resetFields()
    }
    setVisible(props.show)
  }, [props.show])

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
        props.getContent(values.remark, successFunc, failFunc)
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
      <Modal
        title={
          <div>
            <span>人工检查&emsp;</span>
            <span
              style={{
                fontSize: 12,
                color: '#999',
              }}
            >
              检查内容将展示在业务人员终端
            </span>
          </div>
        }
        visible={visible}
        confirmLoading={loading}
        onOk={handleOk}
        onCancel={() => props.closeCheck()}
      >
        <Form {...layout} form={form} name="basic">
          <Form.Item
            label="检查内容"
            name="remark"
            rules={[
              {required: true, message: '请输入检查内容!'},
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
