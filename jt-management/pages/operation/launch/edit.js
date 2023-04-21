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
  DatePicker,
  Checkbox,
  Space,
  message,
  Card,
} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import moment from 'moment'
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

const breadcrumbs = [{text: '运营配置'}, {text: '开屏配置'}, {text: '新增'}]

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
}
const tailLayout = {
  wrapperCol: {offset: 8, span: 16},
}

function body(props) {
  const files =
    props.type == 'edit'
      ? {
          url: props.data.imageUrl,
        }
      : null
  const iphoneXFiles =
    props.type == 'edit'
      ? {
          url: props.data.iphonexImageUrl,
        }
      : null

  const [form] = Form.useForm()
  const [imageType, setImageType] = useState(null)
  const [iphonexImageType, setIphonexImageType] = useState(null)
  const [data] = useState(props.data)
  const [file, setFile] = useState(files)
  const [iphoneXFile, setIphoneXFile] = useState(iphoneXFiles)
  useEffect(() => {
    if (props.id) {
      breadcrumbs[2].text = '编辑'
      let values = {...data}
      values.actTime = []
      if (data.startTime && data.endTime) {
        values.actTime[0] = moment(data.startTime)
        values.actTime[1] = moment(data.endTime)
      }
      values.enableAndroid = data.enableAndroid == 1
      values.enableMiniApp = data.enableMiniApp == 1
      values.enableIos = data.enableIos == 1
      values.androidStartVersion =
        data.androidStartVersion == -1 ? '' : data.androidStartVersion
      values.androidEndVersion =
        data.androidEndVersion == -1 ? '' : data.androidEndVersion
      values.iosStartVersion =
        data.iosStartVersion == -1 ? '' : data.iosStartVersion
      values.iosEndVersion = data.iosEndVersion == -1 ? '' : data.iosEndVersion
      values.androidSelectType =
        typeof data.androidSelectType == 'undefined'
          ? undefined
          : data.androidSelectType + ''
      values.iosSelectType =
        typeof data.iosSelectType == 'undefined'
          ? undefined
          : data.iosSelectType + ''
      form.setFieldsValue(values)
    } else {
      form.setFieldsValue({
        enableAndroid: true,
        enableIos: true,
      })
    }
  }, [props])

  const onFinish = async (values) => {
    let {actTime, enableAndroid, enableMiniApp, enableIos, ...params} = values
    params.startTime = moment(actTime[0]).format('YYYY-MM-DD HH:mm:ss')
    params.endTime = moment(actTime[1]).format('YYYY-MM-DD HH:mm:ss')
    params.enableAndroid = !enableAndroid ? '0' : '1'
    params.enableMiniApp = !enableMiniApp ? '0' : '1'
    params.enableIos = !enableIos ? '0' : '1'
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

    params.location = 'openApp'
    params.imageType = imageType
    params.iphonexImageType = iphonexImageType

    let url = 'bank.api.appcellconfigservice.addappcell'

    if (props.type == 'edit') {
      url = 'bank.api.appcellconfigservice.updateappcell'
      params.id = props.data.id
    }
    let {
      data: {code, data},
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
    if (key == 'imageUrl') {
      setFile({url: base64String})
    } else {
      setIphoneXFile({url: base64String})
    }
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
            isLogin: '0',
            status: 'online',
            targetType: 'html',
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

          <Form.Item label="图片上传" required>
            <Space>
              <div>
                {!!file && (
                  <div>
                    <img
                      src={file.url}
                      style={{width: 300, marginBottom: 15}}
                    />
                  </div>
                )}
                <Form.Item
                  name="imageUrl"
                  rules={[{required: true, message: '请上传图片'}]}
                  style={{marginBottom: 0}}
                  // noStyle
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
                </Form.Item>
              </div>

              <div>
                {!!iphoneXFile && (
                  <div>
                    <img
                      src={iphoneXFile.url}
                      style={{width: 300, marginBottom: 15}}
                    />
                  </div>
                )}
                <Form.Item
                  name="iphonexImageUrl"
                  rules={[{required: true, message: '请上传图片'}]}
                  style={{marginBottom: 0}}
                  // noStyle
                >
                  <Upload
                    beforeUpload={(file) => upload(file, 'iphonexImageUrl')}
                    showUploadList={false}
                    accept="image/*"
                  >
                    <Button>
                      <UploadOutlined /> 选择文件
                    </Button>
                  </Upload>
                </Form.Item>
              </div>
            </Space>
          </Form.Item>

          <Form.Item label="页面跳转" name="targetType">
            <Select disabled>
              <Select.Option value="html">html</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="链接地址"
            name="targetUrl"
            rules={[{required: true, message: '请输入链接地址'}]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="活动时间"
            name="actTime"
            rules={[{required: true, message: '请选择时间'}]}
          >
            <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm" />
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

            {/* <Form.Item name="enableMiniApp" valuePropName="checked">
              <Checkbox style={{lineHeight: '32px'}}>小程序</Checkbox>
            </Form.Item> */}
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
