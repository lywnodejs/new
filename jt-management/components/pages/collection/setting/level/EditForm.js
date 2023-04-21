import {Button, InputNumber, Modal, Form, Select} from 'antd'
import React, {useEffect, useState} from 'react'

export default function (props) {
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  useEffect(() => {
    if (props.visible) {
      setLoading(false)
      form.resetFields()
      if (props.data) {
        form.setFieldsValue(props.data)
      }
    }
  }, [props.visible])

  useEffect(() => {
    if (!props.loading) {
      setLoading(props.loading)
    }
  }, [props.loading])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true)
        props.getFormData(values)
      })
      .catch((errorInfo) => {
        console.error(errorInfo)
      })
  }
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  }
  return (
    <Modal
      title="逾期级别设置"
      visible={props.visible}
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={() => props.setVisible(false)}
    >
      <Form {...layout} form={form} name="basic">
        <Form.Item
          label="产品名称"
          name="productId"
          rules={[{required: true, message: '请选择产品名称'}]}
        >
          <Select style={{width: '200px'}}>
            {props.collectionProducts.map((v) => {
              return (
                <Select.Option value={+v.code} key={v.code}>
                  {v.description}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="逾期级别"
          name="collectionLevel"
          rules={[{required: true, message: '请选择逾期级别'}]}
        >
          <Select style={{width: '200px'}}>
            {props.levelData.map((v) => {
              return (
                <Select.Option
                  value={v.code}
                  key={v.code}
                  disabled={v.isDisabled}
                >
                  {v.description}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="最小逾期天数"
          name="minOverdueDays"
          rules={[{required: true, message: '请输入最小逾期天数'}]}
        >
          <InputNumber
            placeholder="请输入整数，最大可输入10000"
            min={0}
            max={10000}
            precision={0}
            style={{width: '100%'}}
          />
        </Form.Item>

        <Form.Item
          label="最大逾期天数"
          name="maxOverdueDays"
          rules={[{required: true, message: '请输入最大逾期天数'}]}
        >
          <InputNumber
            placeholder="请输入整数，最大可输入10000"
            min={0}
            max={10000}
            precision={0}
            style={{width: '100%'}}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
