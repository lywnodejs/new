import {Layout} from '~/components/Layout'
import {useEffect, useState} from 'react'
import fetch from '~/utils/fetch'
import {Form, Input, Button, Upload, Radio, DatePicker, message} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import Router from 'next/router'
import moment from 'moment'

const getData = async (id) => {
  let {
    data: {code, data},
  } = await fetch(
    'fin.customer.center.facade.api.accountservice.getaccountlist',
    [{id}],
  )
  if (code == 0) {
    return {id}
  }
  return {}
}

const breadcrumbs = [
  {text: '用户运营'},
  {text: '手动短信任务管理'},
  {text: '添加'},
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
  const [fileList, setFileList] = useState([])

  const onFinish = async (values) => {
    let params = {...values}
    let url = 'bank.api.smscrowdservice.exportpeople'
    params.sendTime = moment(params.sendTime).format('YYYY-MM-DD HH:mm:ss')
    // params.smsSign = ''
    let {
      data: {code, data},
    } = await fetch(url, [params])
    if (code == 0) {
      message.success('编辑成功')
      Router.back()
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
    console.log(errorInfo.values.bottomText.toHTML())
  }

  const upload = (file) => {
    const fileReader = new FileReader()
    fileReader.onloadend = (e) => {
      file.url = e.target.result
      form.setFieldsValue({excelData: e.target.result.split('base64,')[1]})
    }
    fileReader.readAsDataURL(file)
    setFileList([file])
    return false
  }

  const downLoad = async () => {
    let postData = {
      moudleType: 3,
      productId: '222',
    }
    let {
      data: {code, data},
    } = await fetch('bank.api.userfeedbackservice.downloadmoudle', [postData])
    if (code == 0) {
      message.success('模板下载成功')
      window.open(data)
    }
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Form
        form={form}
        style={{width: 600, position: 'relative'}}
        {...layout}
        name="basic"
        initialValues={{
          sendModel: 0,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="任务名称"
          name="taskName"
          rules={[{required: true, message: '请输入任务名称'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="人群名称"
          name="crowdName"
          rules={[{required: true, message: '请输入人群名称'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="导入名单"
          name="excelData"
          rules={[{required: true, message: '请选择需要导入的名单'}]}
        >
          <Upload
            // accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            accept=".xls,.xlsx"
            showUploadList={{showRemoveIcon: false}}
            beforeUpload={upload}
            fileList={fileList}
          >
            <Button>
              <UploadOutlined /> 点击上传
            </Button>
          </Upload>
        </Form.Item>
        <Button
          type="primary"
          style={{position: 'absolute', left: 350, top: 112}}
          onClick={downLoad}
        >
          模板下载
        </Button>
        <Form.Item label="发送模式" required>
          <Form.Item noStyle name="sendModel">
            <Radio.Group>
              <Radio value={0}>立即发送</Radio>
              <Radio value={1}>定时发送</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            dependencies={['sendModel']}
            shouldUpdate={(prevValues, curValues) => {
              return prevValues.sendModel !== curValues.sendModel
            }}
          >
            {({getFieldValue}) => {
              const dis = getFieldValue('sendModel') == 0
              return (
                <Form.Item
                  name="sendTime"
                  rules={[{required: !dis, message: '请选择时间'}]}
                  noStyle
                >
                  <DatePicker
                    disabled={dis}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </Form.Item>
              )
            }}
          </Form.Item>
        </Form.Item>

        <Form.Item
          label="短信签名"
          rules={[{required: true, message: '请输入短信签名'}]}
          name="smsSign"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="短信文案"
          rules={[{required: true, message: '请输入短信文案'}]}
          name="smsContent"
        >
          <Input.TextArea autoSize={{minRows: 4}} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  )
}

body.getInitialProps = async (params) => {
  // console.log(params.ctx)
  const id = params.ctx.query.id
  let data = {}
  if (id) {
    data = await getData(id)
  }
  return {data, id}
}

export default body
