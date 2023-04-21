import {Modal, Form, Input, Button, Space, InputNumber, Select} from 'antd'
import {useEffect, useState} from 'react'
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons'
import {TIME_TYPE, QUOTA_TYPE, CONDITION_TYPE} from '~/utils/const'
import api from '~/utils/api'

const getData = async (pId) => {
  let {
    data: {code, data},
  } = await api.getPWaringConfig(pId)
  if (code == 0) {
    return data
  }
  return null
}

const layout = {
  labelCol: {span: 3},
  wrapperCol: {span: 21},
}
const EmailReg = /^\w+((\.\w+){0,3})@\w+(\.\w{2,3}){1,3}$/
const PhoneReg = /^1[0-9]{10}$/
const EditModal = (props) => {
  const [show, setShow] = useState(props.show)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    setShow(props.show)
    if (!props.show) {
      // form.setFieldsValue({strategyList: initStrategy()})
      form.resetFields()
      setConfirmLoading(false)
    } else {
      async function fetchData() {
        const config = await getData(props.data.id)

        let newConfig = {...config}
        newConfig.emailList = Array.isArray(newConfig.emailList)
          ? newConfig.emailList.join('\r\n')
          : newConfig.emailList
        newConfig.mobileList = Array.isArray(newConfig.mobileList)
          ? newConfig.mobileList.join('\r\n')
          : newConfig.mobileList
        if (!Array.isArray(newConfig.strategyList)) {
          newConfig.strategyList = [initStrategy()]
        }

        form.setFieldsValue(newConfig)
      }
      fetchData()
    }
  }, [props])

  const initStrategy = () => {
    return {
      durationUnit: props.enums.durationUnitEnums[0].code,
      operator: props.enums.operatorEnums[0].code,
      metricType: props.enums.metricTypeEnums[0].code,
    }
  }

  const handleCancel = () => {
    props.close('waring')
  }

  const handleOk = () => {
    setConfirmLoading(true)
    form
      .validateFields()
      .then(async (values) => {
        const params = {
          dataProductId: props.data.id,
          ...values,
        }
        params.emailList = params.emailList.split(/[(\r\n)\r\n]+/)
        params.mobileList =
          (params.mobileList && params.mobileList.split(/[(\r\n)\r\n]+/)) ||
          null

        let {
          data: {code},
        } = await api.updatePWaringConfig(params)
        if (code == 0) {
          props.close('waring', true)
        }
        setConfirmLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setConfirmLoading(false)
      })
  }

  const checkReg = (value, reg, errMsg) => {
    let arr = value.split(/[(\r\n)\r\n]+/)
    let res = arr.every((v) => {
      return !v || reg.test(v)
    })
    if (res) {
      return Promise.resolve()
    } else {
      return Promise.reject(errMsg)
    }
  }

  return (
    <Modal
      width={800}
      title="报警策略配置"
      visible={show}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form {...layout} form={form} name="basic">
        <Form.Item label="规则配置" required>
          <Form.List name="strategyList">
            {(fields, {add, remove}) => {
              return (
                <div>
                  {fields.map((field) => {
                    return (
                      <Space
                        key={field.key}
                        align="baseline"
                        style={{marginBottom: 10}}
                      >
                        <span>过去</span>
                        <Form.Item
                          style={{marginBottom: 0}}
                          {...field}
                          name={[field.name, 'metricDuration']}
                          fieldKey={[field.fieldKey, 'metricDuration']}
                          rules={[{required: true, message: '请输入时间'}]}
                        >
                          <InputNumber min={1} precision={0} />
                        </Form.Item>

                        <Form.Item
                          style={{marginBottom: 0}}
                          {...field}
                          name={[field.name, 'durationUnit']}
                          fieldKey={[field.fieldKey, 'durationUnit']}
                        >
                          <Select style={{width: 80}}>
                            {props.enums.durationUnitEnums.map((v, i) => {
                              return (
                                <Select.Option value={v.code} key={i}>
                                  {v.name}
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </Form.Item>

                        <span>内，</span>

                        <Form.Item
                          style={{marginBottom: 0}}
                          {...field}
                          name={[field.name, 'metricType']}
                          fieldKey={[field.fieldKey, 'metricType']}
                        >
                          <Select style={{width: 120}}>
                            {props.enums.metricTypeEnums.map((v, i) => {
                              return (
                                <Select.Option value={v.code} key={i}>
                                  {v.name}
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          style={{marginBottom: 0}}
                          {...field}
                          name={[field.name, 'operator']}
                          fieldKey={[field.fieldKey, 'operator']}
                        >
                          <Select style={{width: 100}}>
                            {props.enums.operatorEnums.map((v, i) => {
                              return (
                                <Select.Option value={v.code} key={i}>
                                  {v.name}
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, curValues) => {
                            try {
                              const curVal = curValues.rules[field.fieldKey]
                              const prevVal = prevValues.rules[field.fieldKey]
                              if (!curVal || !prevVal) {
                                return true
                              }
                              return (
                                prevValues.rules[field.fieldKey].quotaType !==
                                curValues.rules[field.fieldKey].quotaType
                              )
                            } catch (e) {
                              return true
                            }
                          }}
                        >
                          {({getFieldValue}) => {
                            const item = getFieldValue('strategyList')[
                              field.fieldKey
                            ]
                            const quotaType = (item && item.metricType) || ''

                            return quotaType == 2 ? (
                              <Form.Item
                                {...field}
                                name={[field.name, 'threshold']}
                                fieldKey={[field.fieldKey, 'threshold']}
                                style={{marginBottom: 0}}
                                rules={[
                                  {required: true, message: '请输入正整数'},
                                ]}
                              >
                                <InputNumber min={1} precision={0} />
                              </Form.Item>
                            ) : (
                              <Space>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'threshold']}
                                  fieldKey={[field.fieldKey, 'threshold']}
                                  style={{marginBottom: 0, display: 'inline'}}
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        '百分比数值范围为0-100，最多保留两位小数',
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    min={0}
                                    max={100}
                                    precision={2}
                                  />
                                </Form.Item>
                                <span>%</span>
                              </Space>
                            )
                          }}
                        </Form.Item>

                        {field.name > 0 && (
                          <MinusCircleOutlined
                            onClick={() => {
                              remove(field.name)
                            }}
                          />
                        )}
                      </Space>
                    )
                  })}

                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        add(initStrategy())
                      }}
                    >
                      <PlusOutlined />
                    </Button>
                  </Form.Item>
                </div>
              )
            }}
          </Form.List>
        </Form.Item>

        <Form.Item
          label="电子邮箱"
          name="emailList"
          required
          rules={[
            () => ({
              validator(rule, value) {
                if (!value || !value.trim()) {
                  return Promise.reject('电子邮箱不可为空')
                }
                return checkReg(value, EmailReg, '电子邮箱格式有误，请重新输入')
              },
            }),
          ]}
        >
          <Input.TextArea
            autoSize={{minRows: 3}}
            placeholder="多个邮箱请换行，例:&#10;123@qq.com&#10;456@qq.com"
          />
        </Form.Item>

        <Form.Item
          label="手机号"
          name="mobileList"
          rules={[
            () => ({
              validator(rule, value) {
                if (!value) {
                  return Promise.resolve()
                }
                return checkReg(value, PhoneReg, '手机号格式有误，请重新输入')
              },
            }),
          ]}
        >
          <Input.TextArea
            autoSize={{minRows: 3}}
            placeholder="11位手机号，多个号码请换行，例:&#10;13300000001&#10;13300000002"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default EditModal
