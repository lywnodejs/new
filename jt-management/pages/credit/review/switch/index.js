import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {
  Space,
  message,
  Form,
  Select,
  Input,
  Button,
  Radio,
  Steps,
  Card,
} from 'antd'
import apiProduct from '~/api/product'
import {useCookies} from 'react-cookie'
import apiReview from '~/api/review'
import Router, {withRouter} from 'next/router'

const {Step} = Steps
const breadcrumbs = [
  {text: '信审管理'},
  {text: '信审设置'},
  {text: '信审开关设置'},
]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}
function body({router}) {
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [form] = Form.useForm()
  const [activityCurrent, setActivityCurrent] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await apiProduct.get_products({tenantId: cookies.tenantId})
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
    setActivityCurrent(value != null ? 2 : 0)
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_switchList({productId: value})
      if (code == 0) {
        if (data != null) {
          form.setFieldsValue(data)
          setActivityCurrent(3)
        } else if (data == null) {
          form.resetFields(['creditFlow'])
          form.setFieldsValue(['creditSwitch'] == 0)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onChange = (e) => {
    const values = form.getFieldValue('productId')
    if (values == null) {
      return message.error('请先选择产品')
    } else {
      setActivityCurrent(e.target.value != null ? 2 : 1)
    }
  }
  const handleChange = (e) => {
    const values = form.getFieldValue('productId')
    const valueService = form.getFieldValue('creditSwitch')
    if (values == null) {
      return message.error('请先选择产品')
    } else if (valueService == null) {
      return message.error('请选择信审开关')
    } else {
      setActivityCurrent(e.target.value != null ? 3 : 2)
    }
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    if (values.productId == null || values.creditSwitch == null) {
      return message.error('请填写完所有内容')
    }
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_updateSwitch(values)
      if (code == 0) {
        message.success('保存成功')
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Card>
          <Form
            form={form}
            name="form"
            initialValues={{
              productId: null,
              creditSwitch: 0,
              creditFlow: null,
            }}
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
                title="设置信审开关"
                description={
                  <div style={{height: 100}}>
                    <div style={{marginTop: 50}}>
                      <Form.Item name="creditSwitch" label="业务配置">
                        <Radio.Group onChange={onChange}>
                          <Radio value={0}>无</Radio>
                          <Radio value={1}>授信</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  </div>
                }
              />
              <Step
                title="设置信审流程"
                description={
                  <div style={{height: 100}}>
                    <div style={{marginTop: 50}}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                          prevValues.creditSwitch !== currentValues.creditSwitch
                        }
                      >
                        {({getFieldValue}) => {
                          return getFieldValue('creditSwitch') == 1 ? (
                            <Form.Item name="creditFlow" label="流程配置">
                              <Radio.Group
                                onChange={handleChange}
                                style={{
                                  width: 40,
                                }}
                              >
                                <Radio value={1}>初审-&gt;复核-&gt;终审</Radio>
                                <Radio value={2}>初审-&gt;终审</Radio>
                                <Radio value={3}>终审</Radio>
                              </Radio.Group>
                            </Form.Item>
                          ) : null
                        }}
                      </Form.Item>
                    </div>
                  </div>
                }
              />
            </Steps>

            <Button type="primary" style={{marginTop: 40}} onClick={handleSave}>
              保存
            </Button>
          </Form>
        </Card>
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
