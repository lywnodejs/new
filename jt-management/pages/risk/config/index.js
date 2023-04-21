import {
  Space,
  message,
  Form,
  Select,
  Input,
  Button,
  Row,
  Steps,
  Card,
  Radio,
  Empty,
} from 'antd'
import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import apiRisk from '~/api/riskWarning'
import {PlusOutlined, MinusOutlined} from '@ant-design/icons'

const {Step} = Steps

const breadcrumbs = [{text: '风险预警管理'}, {text: '预警策略配置'}]
function body() {
  const [productList, setProductList] = useState([])
  const [form] = Form.useForm()
  const [activityCurrent, setActivityCurrent] = useState([])
  const [productId, setProductId] = useState([])
  const [policyList, setPolicyList] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await apiRisk.fetch_product_list()
        if (code == 0) {
          setProductList(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const handleClick = async (e) => {
    const value = e.target.value
    setProductId(e.target.value)
    setActivityCurrent(value != null ? 1 : 0)
    try {
      const {
        data: {data, code},
      } = await apiRisk.fetch_decisionList_list({
        productId: value,
      })
      if (code == 0) {
        setPolicyList(data)
      }
    } catch (error) {
      console.log(error)
    }
    try {
      const {
        data: {data, code},
      } = await apiRisk.fetch_get_riskList({
        productId: value,
      })
      if (code == 0 && Array.isArray(data) && data.length > 0) {
        setActivityCurrent(2)
        form.setFieldsValue({
          congigDtoList: data,
        })
      } else if (Array.isArray(data) && data.length === 0) {
        setActivityCurrent(2)
        form.resetFields(['congigDtoList'])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (values.congigDtoList.some((val) => val.id === undefined)) {
      values.congigDtoList.forEach((v, i) => {
        v['id'] = null
      })
    }
    console.log(values)
    try {
      const {
        data: {data, code},
      } = await apiRisk.fetch_decisionList_update({
        ...values,
        productId: productId,
      })
      if (code == 0) {
        message.success('新增成功')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space
        direction="vertical"
        size="large"
        style={{width: '100%', position: 'relative'}}
      >
        <Card>
          <Form
            form={form}
            name="basic"
            initialValues={{
              congigDtoList: [{decisionId: ' ', loanDays: ' ', id: null}],
            }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
          >
            <Steps direction="vertical" current={activityCurrent}>
              <Step
                title="选择贷款产品"
                description={
                  <div style={{height: 100}}>
                    <div style={{marginTop: 50}}>
                      <Form.Item label="信贷产品" name="productId">
                        <Radio.Group>
                          {productList.map((v, i) => (
                            <Radio.Button
                              key={v.id}
                              value={v.id}
                              onClick={handleClick}
                            >
                              {v.name}
                            </Radio.Button>
                          ))}
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  </div>
                }
              />
              <Step
                title="配置风控检查策略"
                description={
                  <Form.List name="congigDtoList">
                    {(fields, {add, remove}) =>
                      fields.map((field, index) => {
                        return (
                          <div key={field.key}>
                            <Space size={13}>
                              <span>放款后第</span>
                              <Form.Item
                                {...field}
                                rules={[
                                  {required: true, message: '请输入'},
                                  ({getFieldValue}) => ({
                                    validator(rule, value) {
                                      var reg = /^[\d/]+$/
                                      if (value && !reg.test(value)) {
                                        return Promise.reject('只能输入数字')
                                      } else {
                                        return Promise.resolve()
                                      }
                                    },
                                  }),
                                ]}
                                name={[field.name, 'loanDays']}
                                fieldKey={[field.fieldKey, 'loanDays']}
                                style={{marginTop: 15}}
                              >
                                <Input placeholder="请输入" />
                              </Form.Item>
                              天。调用决策流：
                              <Form.Item
                                {...field}
                                rules={[
                                  {required: true, message: '请选择决策流'},
                                ]}
                                name={[field.name, 'decisionId']}
                                fieldKey={[field.fieldKey, 'decisionId']}
                                style={{marginTop: 15}}
                              >
                                <Select
                                  style={{width: 300}}
                                  onChange={(value, option) => {
                                    const newName = option.children
                                    const newData = [
                                      ...form.getFieldValue('congigDtoList'),
                                    ].filter((v) => !!v)
                                    newData[index] = {
                                      ...newData[index],
                                      decisionName: newName,
                                    }
                                    form.setFieldsValue({
                                      congigDtoList: newData,
                                    })
                                  }}
                                >
                                  {policyList &&
                                    policyList.length > 0 &&
                                    policyList.map((v, i) => {
                                      return (
                                        <Select.Option key={i} value={v.id}>
                                          {v.flowName}
                                        </Select.Option>
                                      )
                                    })}
                                </Select>
                              </Form.Item>
                              <Form.Item
                                {...field}
                                name={[field.name, 'id']}
                                fieldKey={[field.fieldKey, 'id']}
                              >
                                <Input type="hidden" />
                              </Form.Item>
                              <Form.Item
                                {...field}
                                name={[field.name, 'decisionName']}
                                fieldKey={[field.fieldKey, 'decisionName']}
                                style={{display: 'none'}}
                              >
                                <Select type="hidden">
                                  <Select.Option></Select.Option>
                                </Select>
                              </Form.Item>
                              {index == 0 ? (
                                <Button
                                  style={{marginBottom: 12}}
                                  onClick={() => add({})}
                                >
                                  <span style={{textAlign: 'center'}}>
                                    <PlusOutlined /> 添加条件
                                  </span>
                                </Button>
                              ) : (
                                <Button
                                  style={{marginBottom: 12}}
                                  onClick={() => remove(field.fieldKey)}
                                  type="primary"
                                >
                                  删除
                                </Button>
                              )}
                            </Space>
                          </div>
                        )
                      })
                    }
                  </Form.List>
                }
              />
            </Steps>
          </Form>

          <Button
            type="primary"
            style={{marginLeft: 120, marginTop: 50}}
            onClick={handleSubmit}
          >
            保存
          </Button>
        </Card>
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
