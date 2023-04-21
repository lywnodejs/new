import {Layout} from '~/components/Layout'
import {useEffect, useState} from 'react'
import fetch from '~/utils/fetch'
import {Form, Input, Button, Upload, message, Card, Select} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import Router from 'next/router'
import api from '~/utils/api'

const breadcrumbs = [
  {text: '用户运营'},
  {text: '白名单列表'},
  {text: '名单导入'},
]

const getProList = async () => {
  let {
    data: {code, data},
  } = await api.getPro4userList()
  if (code == 0) {
    return data
  }
  return []
}

const getDetail = async (id) => {
  let {
    data: {code, data},
  } = await api.getWhiteBlackData(id)
  if (code == 0) {
    return data
  }
  return {}
}

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

  useEffect(() => {
    form.setFieldsValue({
      productId: props.proList[0].id,
      crowdType: 2,
    })
    if (props.data) {
      form.setFieldsValue({
        ...props.data,
        excelBase64: props.data.downloadUrl,
        name: props.data.crowdName,
      })
      setFileList([
        {
          name: props.data.crowdName,
          url: props.data.downloadUrl,
        },
      ])
    }
  }, [props])

  const onFinish = async ({excelBase64, ...values}) => {
    if (props.id) {
      values.id = props.id

      if (excelBase64 != props.data.downloadUrl) {
        values.excelBase64 = excelBase64
      }
    } else {
      values.excelBase64 = excelBase64
    }
    let {
      data: {code},
    } = await api.uploadWhiteBlackData(values)
    if (code == 0) {
      message.success('导入成功')
      Router.back()
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const upload = (file) => {
    if (isMac()) {
      const fileType = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
      if (!fileType) {
        message.warning('只能上传excel文件！请重新选择')
        return false
      }
    }

    const fileReader = new FileReader()
    fileReader.onloadend = (e) => {
      file.url = e.target.result
      form.setFieldsValue({excelBase64: e.target.result.split('base64,')[1]})
    }
    fileReader.readAsDataURL(file)
    setFileList([file])
    return false
  }

  const isMac = () => {
    if (typeof navigator !== 'undefined') {
      return /macintosh|mac os x/i.test(navigator.userAgent)
    }
    return false
  }

  const downLoadExcel = async () => {
    const values = await form.getFieldsValue()
    let postData = {
      moudleType: 1,
      productId: String(values.productId),
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
      <Card>
        <Form
          form={form}
          style={{width: 600, position: 'relative'}}
          {...layout}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="人群名称"
            name="name"
            rules={[{required: true, message: '请输入人群名称'}]}
          >
            <Input maxLength={50} disabled={!!props.id} />
          </Form.Item>

          <Form.Item required label="产品名称" name="productId">
            <Select style={{width: 120}}>
              {props.proList.map((v, i) => {
                return (
                  <Select.Option value={v.id} key={i}>
                    {v.name}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>

          <Form.Item label="白名单类型" name="crowdType" required>
            <Select style={{width: 120}}>
              <Select.Option value={1}>风控白名单</Select.Option>
              <Select.Option value={2}>机审白名单</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="导入名单"
            name="excelBase64"
            rules={[{required: true, message: '请选择需要导入的名单'}]}
          >
            <Upload
              // accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              accept={
                isMac()
                  ? ''
                  : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
              }
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
            onClick={downLoadExcel}
          >
            模板下载
          </Button>
          <Form.Item {...tailLayout}>
            <p>导入格式说明</p>
            <p>
              1、仅支持导入excel格式文件，表格中第一列为：手机号，第2行开始录入数据
            </p>
            <p>2、不可有空单元格，重复导入数据将覆盖</p>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              上传
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  )
}

body.getInitialProps = async (params) => {
  let proList = await getProList()
  const id = params.ctx.query.id
  let data = null
  if (id) {
    data = await getDetail(id)
  }
  return {proList, data, id}
}

export default body
