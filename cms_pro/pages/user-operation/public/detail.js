import {Layout} from '~/components/Layout'
import {useEffect, useState, useRef} from 'react'
import fetch from '~/utils/fetch'
import api from '~/utils/api'
import {
  Space,
  message,
  DatePicker,
  Form,
  Select,
  Input,
  Button,
  Row,
  Col,
  Card,
  InputNumber,
} from 'antd'
import Router, {withRouter} from 'next/router'
import {PlusOutlined, MinusOutlined} from '@ant-design/icons'

const breadcrumbs = [{text: '用户运营'}, {text: '活动管理'}, {text: '活动配置'}]

const getData = async (id) => {
  let {
    data: {code, data},
  } = await fetch('bank.api.standard.webchattemplateservice.detail', [{id}])
  if (code == 0) {
    return data
  }
}

function body(props) {
  const [form] = Form.useForm()
  const [productData, setProductData] = useState([])
  useEffect(() => {
    if (props.id) {
      let values = {...props.data}
      form.setFieldsValue({
        ...values,
        ids: changeArr(values.productIds.split(',')),
      })
    }
  }, [props])
  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await api.getProductList()
        if (code == 0) {
          setProductData(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async () => {
    const values = await form.validateFields()
    let productIds = []
    values.ids.forEach((v) => {
      productIds.push(v.id)
    })

    let postData = {
      productIds: productIds.toString(),
      id: props.id,
      firstContent: values.firstContent,
      remarkContent: values.remarkContent,
      url: values.url,
      status: values.status,
    }
    let {
      data: {code, data},
    } = await fetch('bank.api.standard.webchattemplateservice.update', [
      postData,
    ])
    if (code == 0) {
      message.success('编辑成功')
      Router.back()
    }
  }

  const changeArr = (arr) => {
    return arr.map((item) => {
      return {id: item}
    })
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Card>
          <Form
            form={form}
            name="basic"
            initialValues={{
              ids: [{id: null}],
            }}
          >
            <Form.Item label="模板标题">
              <span className="ant-form-text">
                {props.data ? props.data.title : null}
              </span>
            </Form.Item>
            <Form.Item label="触发条件">
              <span className="ant-form-text">
                {props.data ? props.data.typeName : null}
              </span>
            </Form.Item>
            <Form.Item label="First文案" name="firstContent">
              <Input.TextArea
                autoSize={{minRows: 2, maxRows: 6}}
                style={{width: 400}}
              />
            </Form.Item>
            <Form.Item label="Remark文案" name="remarkContent">
              <Input.TextArea
                autoSize={{minRows: 2, maxRows: 6}}
                style={{width: 400}}
              />
            </Form.Item>
            <Form.Item label="跳转链接" name="url">
              <Input style={{width: 400}} />
            </Form.Item>

            <Form.Item label="产品名称" required>
              <Form.List name="ids">
                {(fields, {add, remove}) =>
                  fields.map((field, index) => {
                    return (
                      <div key={field.key}>
                        <Space size={10}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'id']}
                            fieldKey={[field.fieldKey, 'id']}
                            rules={[
                              {
                                required: true,
                                message: '请选择产品',
                              },
                            ]}
                          >
                            <Select style={{width: 400}}>
                              {productData &&
                                productData.length > 0 &&
                                productData.map((v, i) => {
                                  return (
                                    <Select.Option key={i} value={String(v.id)}>
                                      {v.name}
                                    </Select.Option>
                                  )
                                })}
                            </Select>
                          </Form.Item>
                        </Space>
                        {index == 0 ? (
                          <Button
                            style={{
                              marginBottom: 24,
                              marginLeft: 10,
                              width: 60,
                            }}
                            onClick={() => add()}
                            type="primary"
                            icon={<PlusOutlined />}
                          />
                        ) : (
                          <Button
                            style={{
                              marginBottom: 24,
                              marginLeft: 10,
                              width: 60,
                            }}
                            onClick={() => remove(field.name)}
                            danger
                            type="primary"
                            icon={<MinusOutlined />}
                          />
                        )}
                      </div>
                    )
                  })
                }
              </Form.List>
            </Form.Item>

            <Form.Item label="启用状态" name="status">
              <Select style={{width: 400}}>
                <Select.Option value={1}>启用</Select.Option>
                <Select.Option value={0}>停用</Select.Option>
              </Select>
            </Form.Item>
          </Form>
          <Button
            type="primary"
            style={{marginLeft: 200, marginTop: 30, width: 200}}
            onClick={handleSubmit}
          >
            提交
          </Button>
        </Card>
      </Space>
    </Layout>
  )
}

body.getInitialProps = async (params) => {
  const id = params.ctx.query.id
  let data = {}
  if (id) {
    data = await getData(id)
  }
  return {data, id}
}

export default body
