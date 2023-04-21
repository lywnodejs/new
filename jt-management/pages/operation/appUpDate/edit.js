import {Layout} from '~/components/Layout'
import {useEffect, useState} from 'react'
import fetch from '~/utils/fetch'
import {CHANNEL_TYPE} from '~/utils/const'
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Radio,
  DatePicker,
  Modal,
  message,
  Card,
} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import moment from 'moment'
import Router from 'next/router'
import {file2base64} from '~/utils'

const getData = async (appId) => {
  let {
    data: {code, data},
  } = await fetch('bank.api.appupgradeservice.getupgradedata', [{appId}])
  if (code == 0) {
    return data
  }
  return {}
}

const breadcrumbs = [
  {text: '运营管理'},
  {text: 'APP更新管理'},
  {text: '添加渠道'},
]

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
}
const tailLayout = {
  wrapperCol: {offset: 8, span: 16},
}

function body(props) {
  const [form] = Form.useForm()
  const [data] = useState(props.data)
  const [fileList, setFileList] = useState(null)

  useEffect(() => {
    if (props.type == 'edit') {
      breadcrumbs[2].text = '更新'
      let values = {...data}
      values.startTime = data.startTime ? moment(data.startTime) : null
      values.upStatus = !data.startTime ? '1' : '2'
      values.forceUpdate = data.forceUpdate + ''
      form.setFieldsValue(values)

      if (data.channelName !== 'appstore') {
        setFileList([
          {
            uid: '-1',
            name: props.data.fileName,
            url: props.data.downloadUrl,
          },
        ])
      }
    } else {
      form.setFieldsValue({forceUpdate: '0'})
    }
  }, [props])

  const onFinish = async (values) => {
    let {upStatus, startTime, ...params} = values

    params.startTime = !startTime
      ? null
      : moment(startTime).format('YYYY-MM-DD HH:mm:ss')
    let url = 'bank.api.appupgradeservice.addupgradedata'

    if (props.type == 'edit') {
      url = 'bank.api.appupgradeservice.updateupgradedata'
      params.id = props.data.id
    }

    if (params.downloadUrl.indexOf('base64,') > -1) {
      params.apkDateBase64 = params.downloadUrl.split('base64,')[1]
      params.downloadUrl = ''
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

  const changeUpStatus = (e) => {
    form.setFieldsValue({startTime: null})
  }

  const changeChannel = (e) => {
    if (e == 'appstore') {
      setFileList([])
      form.setFieldsValue({downloadUrl: undefined})
    }
  }

  const upload = async (file, fileList) => {
    if (file.type !== 'application/vnd.android.package-archive') {
      return Modal.error({
        content: '请选择.apk文件',
      })
    }
    let {base64String} = await file2base64(file)
    form.setFieldsValue({
      downloadUrl: base64String,
    })
    file.url = ''
    setFileList([file])
    return Promise.reject()
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card>
        <Form
          form={form}
          style={{width: 650}}
          {...layout}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="渠道名"
            name="channelName"
            rules={[{required: true, message: '请选择渠道名'}]}
          >
            <Select onChange={changeChannel} disabled={props.type == 'edit'}>
              {CHANNEL_TYPE.map((v, i) => {
                return (
                  <Select.Option value={v.value} key={i}>
                    {v.name}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="APP版本号"
            name="mainVersion"
            rules={[{required: true, message: '请输入APP版本号'}]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) => {
              return prevValues.channelName !== curValues.channelName
            }}
          >
            {({getFieldValue}) => {
              const channelName = getFieldValue('channelName')
              // return (
              //   <Form.Item
              //     label={channelName === 'appstore' ? '跳转地址' : '下载地址'}
              //     name="downloadUrl"
              //     rules={[{required: true, message: '请输入跳转地址'}]}
              //   >
              //     <Input />
              //   </Form.Item>
              // )
              return channelName == 'appstore' ? (
                <Form.Item
                  label="跳转地址"
                  name="downloadUrl"
                  rules={[{required: true, message: '请输入跳转地址'}]}
                >
                  <Input />
                </Form.Item>
              ) : (
                <Form.Item
                  name="downloadUrl"
                  label="上传包"
                  rules={[{required: true, message: '请上传apk'}]}
                >
                  <Upload
                    beforeUpload={upload}
                    fileList={fileList}
                    showUploadList={{
                      showRemoveIcon: false,
                      showPreviewIcon: false,
                    }}
                    accept="application/vnd.android.package-archive"
                  >
                    <Button>
                      <UploadOutlined /> 选择文件
                    </Button>
                  </Upload>
                </Form.Item>
              )
            }}
          </Form.Item>

          <Form.Item
            label="升级文案"
            name="updateDesc"
            rules={[{required: true, message: '请输入升级文案'}]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>

          <Form.Item label="是否强更" name="forceUpdate">
            <Radio.Group>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="更新时间" required>
            <Form.Item noStyle name="upStatus">
              <Radio.Group onChange={changeUpStatus}>
                <Radio value="1">立即更新</Radio>
                <Radio value="2">定时更新</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, curValues) => {
                return prevValues.upStatus !== curValues.upStatus
              }}
            >
              {({getFieldValue, setFieldsValue}) => {
                const dis = getFieldValue('upStatus') == 1
                return (
                  <Form.Item
                    name="startTime"
                    rules={[{required: !dis, message: '请选择时间'}]}
                    noStyle
                  >
                    <DatePicker
                      disabled={dis}
                      showTime
                      format="YYYY-MM-DD HH:mm"
                    />
                  </Form.Item>
                )
              }}
            </Form.Item>
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
