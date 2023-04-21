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
    <Form form={form}>
      <Form.Item name="productDistribute">
        <Radio.Group>
          <Radio style={radioStyle} value={0}>
            无自动分案
          </Radio>
          <Radio style={radioStyle} value={1}>
            系统自动分派给最近关联的客户经理
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item style={{color: 'red'}}>
        注：无关联客户经理的系统不做分案，需要人工手动分案。
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={saveSetting}>
          保存
        </Button>
      </Form.Item>
    </Form>
  )
}
