import {Button, Form, Radio} from 'antd'
import React, {useEffect} from 'react'

export default function (props) {
  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields()
    if (props.data) {
      form.setFieldsValue(props.data)
    }
  }, [props.data])

  const saveSetting = () => {
    form
      .validateFields()
      .then((values) => {
        props.saveSetting(values)
      })
      .catch((errorInfo) => {
        console.error(errorInfo)
      })
  }
  const radioStyle = {
    display: 'block',
    height: '60px',
    lineHeight: '60px',
  }

  return (
    <Form form={form} initialValues={{productSwitch: 0}}>
      <Form.Item name="productSwitch">
        <Radio.Group>
          <Radio style={radioStyle} value={1}>
            开启
          </Radio>
          <Radio style={radioStyle} value={0}>
            关闭
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={saveSetting}>
          保存
        </Button>
      </Form.Item>
    </Form>
  )
}
