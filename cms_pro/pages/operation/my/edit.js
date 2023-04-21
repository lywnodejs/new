import {Layout} from '~/components/Layout'
import {useEffect, useState} from 'react'
import fetch from '~/utils/fetch'
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Radio,
  message,
  Checkbox,
  Space,
  Card,
} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import Router from 'next/router'
import {file2base64} from '~/utils'

const getData = async (id) => {
  let {
    data: {code, data},
  } = await fetch('bank.api.appcellconfigservice.getcellbyid', [{id}])
  if (code == 0) {
    return data
  }
  return {}
}

const breadcrumbs = [{text: '运营配置'}, {text: '我的页管理'}, {text: '新增'}]

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
}
const tailLayout = {
  wrapperCol: {offset: 4, span: 16},
}

function body(props) {
  const files =
    props.type == 'edit'
      ? {
          url: props.data.imageUrl,
        }
      : null

  const [form] = Form.useForm()
  const [imageType, setImageType] = useState(null)
  const [data] = useState(props.data)
  const [file, setFile] = useState(files)

  useEffect(() => {
    if (props.type == 'edit') {
      breadcrumbs[2].text = '编辑'
      let values = {...data}
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
  }, [props])

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

    params.location = 'myPage'
    params.imageType = imageType

    let url = 'bank.api.appcellconfigservice.addappcell'

    if (props.id) {
      url = 'bank.api.appcellconfigservice.updateappcell'
      params.id = props.data.id
    }

    let {
      data: {code},
    } = await fetch(url, [params])
    if (code == 0) {
      message.success(props.type == 'edit' ? '编辑成功' : '添加成功')
      Router.back()
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const upload = async (file, key) => {
    let {base64String} = await file2base64(file)
    form.setFieldsValue({
      [key]: base64String,
    })
    setFile({url: base64String})
    return Promise.reject()
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card>
        <Form
          form={form}
          style={{width: 750}}
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

          <Form.Item label="默认引导词" name="introducer">
            <Input maxLength={20} placeholder="最多20字符" />
          </Form.Item>

          <Form.Item label="图片上传" required>
            {!!file && (
              <div>
                <img src={file.url} style={{width: 80, marginBottom: 15}} />
              </div>
            )}
            <Form.Item
              name="imageUrl"
              rules={[{required: true, message: '请上传图片'}]}
              noStyle
            >
              <Upload
                beforeUpload={(file) => upload(file, 'imageUrl')}
                showUploadList={false}
                accept="image/*"
              >
                <Button>
                  <UploadOutlined /> 选择文件
                </Button>
              </Upload>
              {/* <Input onChange={onChange} /> */}
            </Form.Item>
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

              <Form.Item style={{display: 'inline-block'}}>
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

              <Form.Item style={{display: 'inline-block'}}>
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
  let type = 'add'
  let data = {}
  if (id) {
    data = await getData(id)
    type = 'edit'
  }
  return {data, id, type}
}

export default body
