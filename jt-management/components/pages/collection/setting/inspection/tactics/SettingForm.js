import {Button, Form, Checkbox, InputNumber, Input} from 'antd'
import React, {useEffect} from 'react'

export default function (props) {
  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields()
    if (props.data) {
      console.log(props.data)
      const {productReview} = props.data
      let prams = {
        ...props.data,
        productReviewSwitch: props.data.productReviewSwitch == 1,
        productReviewData: productReview ? productReview.split('/') : [],
        productUnsetReviewSwitch: props.data.productUnsetReviewSwitch == 1,
      }
      form.setFieldsValue(prams)
    }
  }, [props.productId, props.data])

  const saveSetting = () => {
    form
      .validateFields()
      .then((values) => {
        let {
          productReviewSwitch,
          productReviewData,
          productUnsetReviewSwitch,
          ...params
        } = values
        params.productReviewSwitch = productReviewSwitch ? 1 : 0
        params.productUnsetReviewSwitch = productUnsetReviewSwitch ? 1 : 0
        params.productReview = productReviewData.join('/')
        props.saveSetting(params)
      })
      .catch((errorInfo) => {
        console.error(errorInfo)
      })
  }

  const style = {
    display: 'inline-block',
    marginBottom: 0,
    verticalAlign: 'initial',
  }

  return (
    <Form form={form}>
      <Form.Item name="productReviewSwitch" valuePropName="checked">
        <Checkbox>
          <Form.Item noStyle>
            <span style={{fontWeight: 'bold', marginRight: 15}}>周期检查:</span>
            <span>放款后第&emsp;</span>

            <Form.Item
              style={style}
              rules={[
                ({getFieldValue}) => ({
                  validator(rule, value) {
                    const isChecked = getFieldValue('productReviewSwitch')
                    if (isChecked && !value) {
                      return Promise.reject('请输入')
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
              name={['productReviewData', 0]}
            >
              <InputNumber min={0} precision={0} />
            </Form.Item>

            <span>&emsp;天开始,&emsp;</span>

            <Form.Item
              style={style}
              rules={[
                ({getFieldValue}) => ({
                  validator(rule, value) {
                    const isChecked = getFieldValue('productReviewSwitch')
                    if (isChecked && !value) {
                      return Promise.reject('请输入')
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
              name={['productReviewData', 1]}
            >
              <InputNumber min={0} precision={0} />
            </Form.Item>

            <span>&emsp;天一次，共&emsp;</span>

            <Form.Item
              rules={[
                ({getFieldValue}) => ({
                  validator(rule, value) {
                    const isChecked = getFieldValue('productReviewSwitch')
                    if (isChecked && !value) {
                      return Promise.reject('请输入')
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
              style={style}
              name={['productReviewData', 2]}
            >
              <InputNumber min={0} precision={0} />
            </Form.Item>

            <span>&emsp;次。</span>
          </Form.Item>
        </Checkbox>
      </Form.Item>

      <Form.Item name="productUnsetReviewSwitch" valuePropName="checked">
        <Checkbox>
          <Form.Item noStyle>
            <span style={{fontWeight: 'bold', marginRight: 15}}>
              非固定检查:
            </span>
            <span>放款后第&emsp;</span>
            <Form.Item
              style={style}
              rules={[
                // {required: true, message: '请输入贷款期限'},
                ({getFieldValue}) => ({
                  validator(rule, value) {
                    const isChecked = getFieldValue('productUnsetReviewSwitch')
                    if (isChecked && !value) {
                      return Promise.reject('请输入')
                    }
                    if (!value) {
                      return Promise.resolve()
                    }
                    const arr = value.split('/').filter((v) => !!v)
                    const reg = /(^[1-9]\d*$)/
                    const isTrue = arr.every((v) => reg.test(v))
                    if (!isTrue) {
                      return Promise.reject('请输入正确的天数，必须是正整数')
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
              name="productUnsetReview"
            >
              <Input
                style={{width: 280}}
                placeholder="多个值用“/” 隔开，如“15/30/60”"
              />
            </Form.Item>
            <span>&emsp;天。&emsp;</span>
          </Form.Item>
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={saveSetting}>
          保存
        </Button>
      </Form.Item>
    </Form>
  )
}
