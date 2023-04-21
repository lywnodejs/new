import {Layout} from '~/components/Layout'
import fetch from '~/utils/fetch'
import {
  Form,
  Input,
  Button,
  Select,
  Radio,
  Checkbox,
  message,
  Space,
  Card,
  Upload,
  Image,
} from 'antd'
import Router from 'next/router'
import {useEffect, useState} from 'react'
import {PlusOutlined, MinusOutlined} from '@ant-design/icons'
import api from '~/utils/api'

const getData = async (id) => {
  let {
    data: {code, data},
  } = await api.getProductData(id)
  if (code == 0) {
    return data
  }
  return {}
}

const breadcrumbs = [{text: '运营配置'}, {text: '产品管理'}, {text: '新增产品'}]

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 16},
}
const tailLayout = {
  wrapperCol: {offset: 4, span: 16},
}

function body(props) {
  const [form] = Form.useForm()
  const [icon, setIcon] = useState('')

  useEffect(() => {
    form.resetFields()
    if (props.id) {
      breadcrumbs[2].text = '编辑产品'
      let {platform, productType, ...data} = props.data
      data.productType = productType + ''
      data.platform = (platform && platform.split(',')) || ''
      setIcon(props.data.icon)
      form.setFieldsValue(data)
    }
  }, [props])

  const uploadIcon = async (options) => {
    let base64 = await api.getBase64offile(options.file)
    api.uploadImg(base64).then(({data: {code, data}}) => {
      if (code == 0) {
        form.setFieldsValue({icon: data})
        setIcon(data)
      }
    })
  }

  const getlabelsCount = () => {
    const labels = form.getFieldValue('labels')
    const count = labels.reduce((num, label) => {
      return label ? num + label.length : num
    }, 0)
    return count < 17
  }

  const onFinish = async ({platform, ...values}) => {
    if (!getlabelsCount()) return
    values.platform = platform.join(',')
    const item = props.SELECT_PRO.find((v) => values.ydqProductId == v.id)
    values.name = (item && item.name) || ''

    values.id = props.id || null
    api.changeProduct(values).then(({data: {code}}) => {
      if (code == 0) {
        message.success(`${values.id ? '修改' : '添加'}成功`)
        Router.back()
      }
    })
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card bodyStyle={{padding: 0}}>
        <Form
          form={form}
          {...layout}
          name="basic"
          initialValues={{
            features: [{title: '', text: ''}],
            labels: [null],
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Card
            title="基本信息"
            style={{
              borderBottom: 'none',
              paddingBottom: 50,
            }}
          >
            <Form.Item
              label="产品类型"
              rules={[{required: true, message: '请选择产品类型'}]}
              name="productType"
            >
              <Select style={{width: 250}} placeholder="请选择">
                {props.PRODUCT_TYPE.map((v, i) => {
                  return (
                    <Select.Option value={v.value} key={i}>
                      {v.valueName}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>

            <Form.Item
              label="产品名称"
              rules={[{required: true, message: '请选择产品名称'}]}
              name="ydqProductId"
            >
              <Select style={{width: 250}} placeholder="请选择">
                {props.SELECT_PRO.map((v, i) => {
                  return (
                    <Select.Option value={v.id} key={i}>
                      {v.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>

            <Form.Item
              label="产品Icon"
              style={{marginBottom: 15}}
              rules={[{required: true, message: '请上传产品Icon'}]}
              name="icon"
            >
              <Upload
                name="file"
                accept="image/*"
                customRequest={uploadIcon}
                showUploadList={false}
              >
                <Button type="primary">点击上传</Button>
              </Upload>
            </Form.Item>

            {icon && (
              <Form.Item {...tailLayout}>
                <img src={icon} style={{width: 150}} />
              </Form.Item>
            )}

            <Form.Item
              label="发布平台"
              rules={[{required: true, message: '请选择发布平台'}]}
              name="platform"
            >
              <Checkbox.Group>
                <Space direction="vertical">
                  {props.PLATFORM_TYPE.map((v, i) => {
                    return (
                      <Checkbox value={v.value} key={i}>
                        {v.valueName}
                      </Checkbox>
                    )
                  })}
                </Space>
              </Checkbox.Group>
            </Form.Item>
          </Card>

          <Card title="运营信息">
            <Form.Item
              label="产品介绍"
              rules={[{required: true, message: '请输入产品介绍'}, {max: 200}]}
              name="introduce"
            >
              <Input.TextArea
                style={{width: 400}}
                palaceholder="不超过200字"
                rows={4}
              />
            </Form.Item>

            <Form.Item label="产品特点" style={{marginBottom: 0}} required>
              <Form.List name="features">
                {(fields, {add, remove}, {errors}) =>
                  fields.map((field, index) => {
                    return (
                      <div key={field.key}>
                        <Space size={10}>
                          <Form.Item
                            {...field}
                            rules={[{required: true, message: '请输入标题'}]}
                            name={[field.name, 'title']}
                            fieldKey={[field.fieldKey, 'title']}
                          >
                            <Input placeholder="请输入标题" />
                          </Form.Item>

                          <span
                            style={{
                              display: 'block',
                              marginBottom: 24,
                            }}
                          >
                            -
                          </span>

                          <Form.Item
                            {...field}
                            rules={[{required: true, message: '请输入标题'}]}
                            name={[field.name, 'text']}
                            fieldKey={[field.fieldKey, 'text']}
                          >
                            <Input placeholder="请输入文案" />
                          </Form.Item>
                          {index == 0 ? (
                            <Button
                              style={{marginBottom: 24}}
                              onClick={() => add()}
                              type="primary"
                              icon={<PlusOutlined />}
                            />
                          ) : (
                            <Button
                              style={{marginBottom: 24}}
                              onClick={() => remove(field.name)}
                              type="primary"
                              danger
                              icon={<MinusOutlined />}
                            />
                          )}
                        </Space>
                      </div>
                    )
                  })
                }
              </Form.List>
            </Form.Item>

            <Form.Item
              label="申请条件"
              rules={[{required: true, message: '请输入申请条件'}, {max: 200}]}
              name="applyCondition"
            >
              <Input.TextArea
                style={{width: 400}}
                palaceholder="不超过200字"
                rows={4}
              />
            </Form.Item>

            <Form.Item label="产品标签" required>
              <Form.List name="labels">
                {(fields, {add, remove}, {errors}) =>
                  fields.map((field, index) => {
                    return (
                      <div key={field.key}>
                        <Space size={10}>
                          <Form.Item
                            {...field}
                            rules={[
                              {
                                required: true,
                                message: '请输入标题',
                              },
                            ]}
                            // name={[field.name, 'name']}
                            // fieldKey={[field.fieldKey, 'name']}>
                            fieldKey={field.fieldKey}
                          >
                            <Input placeholder="请输入标题" />
                          </Form.Item>
                          {index == 0 ? (
                            <Button
                              style={{marginBottom: 24}}
                              onClick={() => add()}
                              type="primary"
                              icon={<PlusOutlined />}
                            />
                          ) : (
                            <Button
                              style={{marginBottom: 24}}
                              onClick={() => remove(field.fieldKey)}
                              danger
                              type="primary"
                              icon={<MinusOutlined />}
                            />
                          )}
                        </Space>
                      </div>
                    )
                  })
                }
              </Form.List>

              <Form.Item shouldUpdate>
                {() => {
                  const color = !getlabelsCount() ? 'red' : '#333'
                  return <span style={{color}}>标签字数一共不超过16个字</span>
                }}
              </Form.Item>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" style={{width: 200}}>
                提交
              </Button>
            </Form.Item>
          </Card>
        </Form>
      </Card>
    </Layout>
  )
}

body.getInitialProps = async (params) => {
  const id = params.ctx.query.id
  let data = null
  if (id) {
    data = await getData(id)
  }
  const initData = {
    data,
    id,
    PRODUCT_TYPE: [],
    PLATFORM_TYPE: [],
    SELECT_PRO: [],
  }
  try {
    const [
      {
        data: {code, data: PRODUCT_TYPE},
      },
      {
        data: {code: code1, data: PLATFORM_TYPE},
      },
      {
        data: {code: code2, data: SELECT_PRO},
      },
    ] = await Promise.all([
      api.getDictMap('PRODUCT_TYPE'),
      api.getDictMap('PLATFORM_TYPE'),
      api.getSelectProductList(),
    ])
    initData.PRODUCT_TYPE = code == 0 ? PRODUCT_TYPE : []
    initData.PLATFORM_TYPE = code1 == 0 ? PLATFORM_TYPE : []
    initData.SELECT_PRO = code2 == 0 ? SELECT_PRO : []
    return initData
  } catch (error) {
    return initData
  }
}

export default body
