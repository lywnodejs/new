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
} from 'antd'
import Router from 'next/router'
import {useEffect} from 'react'

const getData = async (id) => {
  let {
    data: {code, data},
  } = await fetch('bank.api.appcellconfigservice.getcellbyid', [{id}])
  if (code == 0) {
    return data
  }
  return {}
}

const breadcrumbs = [{text: '运营配置'}, {text: '设置页管理'}, {text: '新增'}]

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
}
const tailLayout = {
  wrapperCol: {offset: 4, span: 16},
}

function body(props) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (props.id) {
      breadcrumbs[2].text = '编辑'
      let data = {...props.data}
      let values = data
      values.enableAndroid = data.enableAndroid == 1
      values.enableMiniApp = data.enableMiniApp == 1
      values.enableIos = data.enableIos == 1
      values.enableManagerAndroid = data.enableManagerAndroid == 1
      values.enableManagerIos = data.enableManagerIos == 1

      values.androidStartVersion =
        data.androidStartVersion == -1 ? '' : data.androidStartVersion
      values.androidEndVersion =
        data.androidEndVersion == -1 ? '' : data.androidEndVersion

      values.managerAndroidStartVersion =
        data.managerAndroidStartVersion == -1
          ? ''
          : data.managerAndroidStartVersion
      values.managerAndroidEndVersion =
        data.managerAndroidEndVersion == -1 ? '' : data.managerAndroidEndVersion

      values.managerIosStartVersion =
        data.managerIosStartVersion == -1 ? '' : data.managerIosStartVersion
      values.managerIosEndVersion =
        data.managerIosEndVersion == -1 ? '' : data.managerIosEndVersion

      values.androidSelectType =
        typeof data.androidSelectType == 'undefined'
          ? undefined
          : data.androidSelectType + ''
      values.iosSelectType =
        typeof data.iosSelectType == 'undefined'
          ? undefined
          : data.iosSelectType + ''
      values.managerAndroidSelectType =
        typeof data.managerAndroidSelectType == 'undefined'
          ? undefined
          : data.managerAndroidSelectType + ''
      values.managerIosSelectType =
        typeof data.managerIosSelectType == 'undefined'
          ? undefined
          : data.managerIosSelectType + ''

      form.setFieldsValue(values)
    } else {
      form.setFieldsValue({
        enableAndroid: true,
        enableIos: true,
        enableMiniApp: true,
      })
    }
  })

  const onFinish = async (values) => {
    let {
      enableAndroid,
      enableMiniApp,
      enableIos,
      enableManagerAndroid,
      enableManagerIos,
      ...params
    } = values
    params.enableAndroid = !enableAndroid ? '0' : '1'
    params.enableMiniApp = !enableMiniApp ? '0' : '1'
    params.enableIos = !enableIos ? '0' : '1'
    params.enableManagerAndroid = !enableManagerAndroid ? '0' : '1'
    params.enableManagerIos = !enableManagerIos ? '0' : '1'
    if (enableAndroid) {
      if (!params.androidSelectType) {
        return message.error('请补充安卓版本要求信息')
      }
      if (
        (params.androidSelectType == 2 && !params.androidEndVersion) ||
        !params.androidStartVersion
      ) {
        return message.error('请补充安卓版本要求信息')
      }
    }
    if (enableIos) {
      if (!params.iosSelectType) {
        return message.error('请补充ios版本要求信息')
      }
      if (
        (params.iosSelectType == 2 && !params.iosEndVersion) ||
        !params.iosStartVersion
      ) {
        return message.error('请补充ios版本要求信息')
      }
    }

    if (enableManagerAndroid) {
      if (!params.managerAndroidSelectType) {
        return message.error('请补充客户经理APP安卓版本要求信息')
      }
      if (
        (params.managerAndroidSelectType == 2 &&
          !params.managerAndroidEndVersion) ||
        !params.managerAndroidStartVersion
      ) {
        return message.error('请补充客户经理APP安卓版本要求信息')
      }
    }

    if (enableManagerIos) {
      if (!params.managerIosSelectType) {
        return message.error('请补充客户经理APP IOS版本要求信息')
      }
      if (
        (params.managerIosSelectType == 2 && !params.managerIosEndVersion) ||
        !params.managerIosStartVersion
      ) {
        return message.error('请补充客户经理APP IOS版本要求信息')
      }
    }

    params.location = 'setting'

    let url = 'bank.api.appcellconfigservice.addappcell'

    if (props.id) {
      url = 'bank.api.appcellconfigservice.updateappcell'
      params.id = props.data.id
    }

    let {
      data: {code},
    } = await fetch(url, [params])
    if (code == 0) {
      message.success('编辑成功')
      Router.back()
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card>
        <Form
          form={form}
          style={{width: 850}}
          {...layout}
          name="basic"
          initialValues={{
            needLogin: 0,
            online: 1,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{required: true, message: '请输入名称'}]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="链接"
            name="targetUrl"
            rules={[{required: true, message: '请输入链接'}]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="状态" name="online">
            <Select style={{width: 250}}>
              <Select.Option value={1}>online</Select.Option>
              <Select.Option value={0}>offline</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="平台">
            <Space>
              <Form.Item name="enableAndroid" valuePropName="checked">
                <Checkbox style={{lineHeight: '32px'}}>
                  <span>安卓</span>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <span style={{fontWeight: 'bold', margin: '0 8px'}}>
                  版本要求:
                </span>

                <Form.Item noStyle>
                  <Form.Item name="androidStartVersion" noStyle>
                    <Input style={{width: 55, marginRight: 5}} />
                  </Form.Item>

                  <Form.Item noStyle name="androidSelectType">
                    <Radio.Group>
                      <Radio value="0">及以上</Radio>
                      <Radio value="1">及以下</Radio>
                      <Radio value="2">至</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    noStyle
                    dependencies={['androidSelectType']}
                    shouldUpdate={(prevValues, curValues) => {
                      return prevValues.upStatus !== curValues.upStatus
                    }}
                  >
                    {({getFieldValue}) => {
                      console.log('rerender')
                      const dis = getFieldValue('androidSelectType') != 2
                      return (
                        <Form.Item
                          name="androidEndVersion"
                          rules={[{required: !dis, message: '请填写版本号'}]}
                          noStyle
                        >
                          <Input style={{width: 55}} disabled={dis} />
                        </Form.Item>
                      )
                    }}
                  </Form.Item>
                </Form.Item>
              </Form.Item>
            </Space>

            <Space>
              <Form.Item name="enableIos" valuePropName="checked">
                <Checkbox value="B" style={{lineHeight: '32px'}}>
                  <span>IOS</span>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <span style={{fontWeight: 'bold', margin: '0 8px'}}>
                  版本要求:
                </span>

                <Form.Item noStyle>
                  <Form.Item name="iosStartVersion" noStyle>
                    <Input style={{width: 55, marginRight: 5}} />
                  </Form.Item>

                  <Form.Item noStyle name="iosSelectType">
                    <Radio.Group>
                      <Radio value="0">及以上</Radio>
                      <Radio value="1">及以下</Radio>
                      <Radio value="2">至</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    noStyle
                    dependencies={['iosSelectType']}
                    shouldUpdate={(prevValues, curValues) => {
                      return (
                        prevValues.iosSelectType !== curValues.iosSelectType
                      )
                    }}
                  >
                    {({getFieldValue}) => {
                      const dis = getFieldValue('iosSelectType') != 2
                      return (
                        <Form.Item
                          name="iosEndVersion"
                          rules={[{required: !dis, message: '请填写版本号'}]}
                          noStyle
                        >
                          <Input style={{width: 55}} disabled={dis} />
                        </Form.Item>
                      )
                    }}
                  </Form.Item>
                </Form.Item>
              </Form.Item>
            </Space>

            <Form.Item name="enableMiniApp" valuePropName="checked">
              <Checkbox style={{lineHeight: '32px'}}>小程序</Checkbox>
            </Form.Item>

            <Space>
              <Form.Item name="enableManagerAndroid" valuePropName="checked">
                <Checkbox style={{lineHeight: '32px'}}>
                  <span>客户经理APP安卓端</span>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <span style={{fontWeight: 'bold', margin: '0 8px'}}>
                  版本要求:
                </span>

                <Form.Item noStyle>
                  <Form.Item name="managerAndroidStartVersion" noStyle>
                    <Input style={{width: 55, marginRight: 5}} />
                  </Form.Item>

                  <Form.Item noStyle name="managerAndroidSelectType">
                    <Radio.Group>
                      <Radio value="0">及以上</Radio>
                      <Radio value="1">及以下</Radio>
                      <Radio value="2">至</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    noStyle
                    // dependencies={['managerAndroidSelectType']}
                    shouldUpdate={(prevValues, curValues) => {
                      return (
                        prevValues.managerAndroidSelectType !==
                        curValues.managerAndroidSelectType
                      )
                    }}
                  >
                    {({getFieldValue}) => {
                      console.log('rerender')
                      const dis = getFieldValue('managerAndroidSelectType') != 2
                      return (
                        <Form.Item
                          name="managerAndroidEndVersion"
                          rules={[{required: !dis, message: '请填写版本号'}]}
                          noStyle
                        >
                          <Input style={{width: 55}} disabled={dis} />
                        </Form.Item>
                      )
                    }}
                  </Form.Item>
                </Form.Item>
              </Form.Item>
            </Space>

            <Space>
              <Form.Item name="enableManagerIos" valuePropName="checked">
                <Checkbox style={{lineHeight: '32px'}}>
                  <span>客户经理APPios端</span>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <span style={{fontWeight: 'bold', margin: '0 8px'}}>
                  版本要求:
                </span>

                <Form.Item noStyle>
                  <Form.Item name="managerIosStartVersion" noStyle>
                    <Input style={{width: 55, marginRight: 5}} />
                  </Form.Item>

                  <Form.Item noStyle name="managerIosSelectType">
                    <Radio.Group>
                      <Radio value="0">及以上</Radio>
                      <Radio value="1">及以下</Radio>
                      <Radio value="2">至</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    noStyle
                    // dependencies={['managerAndroidSelectType']}
                    shouldUpdate={(prevValues, curValues) => {
                      return (
                        prevValues.managerIosSelectType !==
                        curValues.managerIosSelectType
                      )
                    }}
                  >
                    {({getFieldValue}) => {
                      console.log('rerender')
                      const dis = getFieldValue('managerIosSelectType') != 2
                      return (
                        <Form.Item
                          name="managerIosEndVersion"
                          rules={[{required: !dis, message: '请填写版本号'}]}
                          noStyle
                        >
                          <Input style={{width: 55}} disabled={dis} />
                        </Form.Item>
                      )
                    }}
                  </Form.Item>
                </Form.Item>
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item label="是否需要登录" name="needLogin">
            <Select style={{width: 250}}>
              <Select.Option value={1}>需登录</Select.Option>
              <Select.Option value={0}>无需登录</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
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
