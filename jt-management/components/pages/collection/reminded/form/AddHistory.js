import {Button, Input, Modal, Form, Radio, DatePicker} from 'antd'
import React, {useEffect, useState} from 'react'
import moment from 'moment'

export default function SendSms(props) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) {
      form.resetFields()
      // console.log('add history:', props)
      if (props.phoneNo) {
        form.setFieldsValue({urgeMobilePhone: props.phoneNo})
      }
    }
  }, [visible])

  const onChangeIsConnect = (e) => {
    form.setFieldsValue({
      urgeResult: '',
      reasonType: '',
      repayDesire: '',
      promiseRepayTime: '',
      remark: '',
    })
  }
  const onChangeRepayDesire = (e) => {
    form.setFieldsValue({
      urgeResult: '',
    })
  }

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
      .then(({promiseRepayTime, ...values}) => {
        setLoading(true)
        values.promiseRepayTimeString = promiseRepayTime
          ? moment(promiseRepayTime).format('YYYY-MM-DD HH:mm:ss')
          : ''
        props.getHistoryData(values, successFunc, failFunc)
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
        {props.target ? (
          props.target
        ) : (
          <Button type={props.btnType || 'link'}>新增催记</Button>
        )}
      </div>

      <Modal
        width={750}
        title="新增催收记录"
        visible={visible}
        confirmLoading={loading}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form {...layout} form={form} name="basic">
          <Form.Item
            label="催收方式"
            name="collectionMethod"
            rules={[{required: true, message: '请选择催收方式!'}]}
          >
            <Radio.Group>
              {props.urgeMethods.map((one) => (
                <Radio
                  value={one.code}
                  key={one.code}
                  style={{marginBottom: 15}}
                >
                  {one.description}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="催收对象"
            name="collectionObject"
            rules={[{required: true, message: '请选择催收方式!'}]}
          >
            <Radio.Group>
              {props.urgeObjects.map((one) => (
                <Radio
                  value={one.code}
                  key={one.code}
                  style={{marginBottom: 15}}
                >
                  {one.description}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="联系号码"
            name="urgeMobilePhone"
            rules={[
              {required: true, message: '请输入联系号码!'},
              {pattern: /^1[3456789]\d{9}$/, message: '请输入正确手机号格式!'},
            ]}
          >
            <Input placeholder="请输入手机号码" />
          </Form.Item>

          <Form.Item
            label="是否接通"
            name="isConnect"
            rules={[{required: true, message: '请选择是否接通!'}]}
          >
            <Radio.Group onChange={onChangeIsConnect}>
              {props.urgeIsConnects.map((one) => (
                <Radio
                  value={one.code}
                  key={one.code}
                  style={{marginBottom: 15}}
                >
                  {one.description}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.isConnect !== currentValues.isConnect
            }
          >
            {({getFieldValue}) => {
              if (getFieldValue('isConnect') != '0') {
                return (
                  <Form.Item
                    label="逾期原因"
                    name="reasonType"
                    rules={[{required: true, message: '请选择逾期原因'}]}
                  >
                    <Radio.Group>
                      {props.urgeReasonTypes.map((one) => (
                        <Radio
                          value={one.code}
                          key={one.code}
                          style={{marginBottom: 15}}
                        >
                          {one.description}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                )
              }
            }}
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.isConnect !== currentValues.isConnect
            }
          >
            {({getFieldValue}) => {
              if (getFieldValue('isConnect') != '0') {
                return (
                  <Form.Item
                    label="还款意愿"
                    name="repayDesire"
                    rules={[{required: true, message: '请选择还款意愿'}]}
                  >
                    <Radio.Group onChange={onChangeRepayDesire}>
                      {props.urgeRepayDesires.map((one) => (
                        <Radio
                          value={one.code}
                          key={one.code}
                          style={{marginBottom: 15}}
                        >
                          {one.description}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                )
              }
            }}
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => {
              return (
                prevValues.repayDesire !== currentValues.repayDesire ||
                prevValues.isConnect !== currentValues.isConnect
              )
            }}
          >
            {({getFieldValue}) => {
              if (
                // getFieldValue('repayDesire') == '1' &&
                getFieldValue('isConnect') == '0'
              ) {
                return (
                  <Form.Item
                    label="联络结果"
                    name="collectionResult"
                    rules={[{required: true, message: '请选择联络结果'}]}
                  >
                    <Radio.Group>
                      {props.urgeResultUnknows.map((one) => {
                        return (
                          <Radio
                            value={one.code}
                            key={one.id}
                            style={{marginBottom: 15}}
                          >
                            {one.description}
                          </Radio>
                        )
                      })}
                    </Radio.Group>
                  </Form.Item>
                )
              }
              if (
                getFieldValue('repayDesire') == '2' &&
                getFieldValue('isConnect') != '0'
              ) {
                return (
                  <Form.Item
                    label="联络结果"
                    name="collectionResult"
                    rules={[{required: true, message: '请选择联络结果'}]}
                  >
                    <Radio.Group>
                      {props.urgeResultHighs.map((one) => {
                        return (
                          <Radio
                            value={one.code}
                            key={one.id}
                            style={{marginBottom: 15}}
                          >
                            {one.description}
                          </Radio>
                        )
                      })}
                    </Radio.Group>
                  </Form.Item>
                )
              }
              if (
                getFieldValue('repayDesire') == '3' &&
                getFieldValue('isConnect') != '0'
              ) {
                return (
                  <Form.Item
                    label="联络结果"
                    name="collectionResult"
                    rules={[{required: true, message: '请选择联络结果'}]}
                  >
                    <Radio.Group>
                      {props.urgeResultLows.map((one) => {
                        return (
                          <Radio
                            value={one.code}
                            key={one.id}
                            style={{marginBottom: 15}}
                          >
                            {one.description}
                          </Radio>
                        )
                      })}
                    </Radio.Group>
                  </Form.Item>
                )
              }
            }}
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.isConnect !== currentValues.isConnect
            }
          >
            {({getFieldValue}) => {
              if (getFieldValue('isConnect') != '0') {
                return (
                  <Form.Item name="promiseRepayTime" label="承若还款日期">
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="请选择日期"
                    />
                  </Form.Item>
                )
              }
            }}
          </Form.Item>

          <Form.Item
            label="备注"
            name="remark"
            rules={[
              {required: true, message: '请输入备注!'},
              {min: 6, message: '输入范围大于5字符!'},
              {max: 10, message: '输入范围小于等于10字符!'},
              {whitespace: true},
            ]}
          >
            <Input.TextArea rows={4} placeholder="请输入至少5个字符" />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  )
}
