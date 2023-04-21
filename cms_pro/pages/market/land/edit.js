import {Layout} from '~/components/Layout'
import {useEffect, useState} from 'react'
import fetch from '~/utils/fetch'
import {uploadImg, file2base64} from '~/utils'
import dynamic from 'next/dynamic'
import css from './edit.less'

import Head from 'next/head'
import {
  Form,
  Input,
  Button,
  Upload,
  Radio,
  Space,
  Tag,
  message,
  Spin,
  Card,
} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import Router from 'next/router'
// import ColorPicker from 'braft-extensions/dist/color-picker'
// let BraftEditor = null
// if (typeof window !== 'undefined' && !!window) {
//   BraftEditor = require('braft-editor').default
// }

// const BraftEditor = dynamic(() => import('braft-editor'), { ssr: false })
// const ColorPicker = dynamic(
//   () => import('braft-extensions/dist/color-picker').then((mod) => mod.default),
//   { ssr: false },
// )
// console.log(BraftEditor())
// BraftEditor.use(
//   ColorPicker({
//     includeEditors: ['editor-with-color-picker'],
//     theme: 'light', // 支持dark和light两种主题，默认为dark
//   }),
// )
const getData = async (id) => {
  let {
    data: {code, data},
  } = await fetch('bank.api.launchservice.getlaunchbyid', [{id}])
  if (code == 0) {
    return data
  }
  return {}
}

const breadcrumbs = [{text: '运营管理'}, {text: '投放页管理'}, {text: '添加'}]

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
}
const tailLayout = {
  wrapperCol: {offset: 8, span: 16},
}

const colorArr = [
  'pageTone',
  'inputTone',
  'inputTipsTone',
  'inputFontColor',
  'validateButtonFillTone',
  'validateButtonBorderTone',
  'validateButtonTipsTone',
  'footTipsTone',
]
const imgArr = [
  'headImg',
  'bgImg',
  'buttonImg',
  'publicityImg',
  'footButtonImg',
  'footBanner',
]

let BraftEditor = () => <Spin />
const excludeControls = ['bold', 'italic', 'underline']
function body(props) {
  let colorObj = {}
  let imgObj = {}
  if (props.id) {
    colorArr.forEach((key) => {
      colorObj[key] = props.data[key]
    })
    imgArr.forEach((key) => {
      imgObj[key] = props.data[key]
    })
  }
  const [form] = Form.useForm()
  const [colors, setColors] = useState(colorObj)
  const [imgs, setImgs] = useState(imgObj)

  useEffect(() => {
    if (props.id) {
      breadcrumbs[2].text = '编辑'
      let values = {...props.data}
      let agreement = (values.agreement && JSON.parse(values.agreement)) || []
      values.agreement = Array.isArray(agreement) ? agreement : []
      form.setFieldsValue(values)
    }
  }, [props])

  useEffect(() => {
    const initBraft = async () => {
      BraftEditor = (await import('braft-editor')).default
      const ColorPicker = (await import('braft-extensions/dist/color-picker'))
        .default
      BraftEditor.use(
        ColorPicker({
          theme: 'light', // 支持dark和light两种主题，默认为dark
        }),
      )
      if (props.data && props.data.footDescribe) {
        form.setFieldsValue({
          footDescribe: BraftEditor.createEditorState(props.data.footDescribe),
        })
      }
      setColors({...colors})
    }
    initBraft()
  }, [props.data.footDescribe])

  const onFinish = async (values) => {
    let params = {...values}
    params.footDescribe =
      (values.footDescribe && values.footDescribe.toHTML()) || ''
    if (
      (params.agreement.length == 1 &&
        !params.agreement[0].name &&
        !params.agreement[0].url) ||
      params.agreement.length == 0
    ) {
      params.agreement = ''
    } else {
      params.agreement = JSON.stringify(params.agreement)
    }
    let url = 'bank.api.launchservice.insertlaunch'

    if (props.id) {
      url = 'bank.api.launchservice.updatelaunch'
      params.id = props.data.id
    }
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
    // console.log(errorInfo.values.footDescribe.toHTML())
  }

  const upload = async (file, key) => {
    let {base64String} = await file2base64(file)
    form.setFieldsValue({
      [key]: base64String,
    })
    setImgs({...imgs, [key]: base64String})
    return Promise.reject()
  }

  const removeImg = (key, e) => {
    e.stopPropagation()
    e.preventDefault()
    form.setFieldsValue({
      [key]: '',
    })
    setImgs({...imgs, [key]: null})
  }

  const CheckIsColor = (bgVal) => {
    var type = '^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$'
    var re = new RegExp(type)
    if (bgVal.match(re) == null) {
      type =
        '^[rR][gG][Bb][]([s]∗(2[0−4][0−9]|25[0−5]|[01]?[0−9][0−9]?)[s]∗,)2[s]∗(2[0−4]d|25[0−5]|[01]?dd?)[s]∗[]{1}$'
      re = new RegExp(type)
      if (bgVal.match(re) == null) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  const changeColor = (key, value) => {
    if (value) {
      value = (CheckIsColor(value) && value) || 'error'
    }

    setColors({
      ...colors,
      [key]: value,
    })
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head>
        <link rel="stylesheet" type="text/css" href="/css/index.css" />
        <link rel="stylesheet" type="text/css" href="/css/color-picker.css" />
      </Head>
      <Card>
        <Form
          form={form}
          style={{width: 750}}
          {...layout}
          name="basic"
          initialValues={{
            status: 1,
            agreement: [{name: '', url: ''}],
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="页面名称"
            name="name"
            rules={[{required: true, message: '请输入页面名称'}]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="页面标题"
            name="title"
            rules={[{required: true, message: '请输入页面名称'}]}
          >
            <Input />
          </Form.Item>

          {/*required*/}
          <Form.Item label="页面色值">
            <Space>
              <Form.Item
                name="pageTone"
                noStyle
                // rules={[{required: true, message: '请输入页面颜色'}]}
              >
                <Input
                  onChange={(e) => changeColor('pageTone', e.target.value)}
                />
              </Form.Item>
              {colors.pageTone && (
                <Tag
                  color={colors.pageTone == 'error' ? 'red' : colors.pageTone}
                >
                  {colors.pageTone == 'error' ? '颜色错误' : colors.pageTone}
                </Tag>
              )}
            </Space>
          </Form.Item>

          <Form.Item label="头图上传" required>
            {!!imgs.headImg && (
              <div>
                <img
                  src={imgs.headImg}
                  style={{width: 300, marginBottom: 15}}
                />
              </div>
            )}
            <Form.Item
              name="headImg"
              rules={[{required: true, message: '请输入图片链接'}]}
              noStyle
            >
              <Upload
                beforeUpload={(file) => upload(file, 'headImg')}
                showUploadList={false}
                accept="image/*"
              >
                <Button>
                  <UploadOutlined /> 选择文件
                </Button>
              </Upload>
            </Form.Item>
          </Form.Item>

          <Form.Item label="注册背景图上传" required>
            {!!imgs.bgImg && (
              <div>
                <img src={imgs.bgImg} style={{width: 300, marginBottom: 15}} />
              </div>
            )}
            <Form.Item
              name="bgImg"
              rules={[{required: true, message: '请输入图片链接'}]}
              noStyle
            >
              <Upload
                beforeUpload={(file) => upload(file, 'bgImg')}
                showUploadList={false}
                accept="image/*"
              >
                <Button>
                  <UploadOutlined /> 选择文件
                </Button>
              </Upload>
            </Form.Item>
          </Form.Item>

          <Form.Item label="输入框色值" required>
            <Space>
              <Form.Item
                name="inputTone"
                noStyle
                rules={[{required: true, message: '请输入输入框色值'}]}
              >
                <Input
                  onChange={(e) => changeColor('inputTone', e.target.value)}
                />
              </Form.Item>
              {colors.inputTone && (
                <Tag
                  color={colors.inputTone == 'error' ? 'red' : colors.inputTone}
                >
                  {colors.color1 == 'inputTone' ? '颜色错误' : colors.inputTone}
                </Tag>
              )}
            </Space>
          </Form.Item>

          <Form.Item label="输入框提示文案色值" required>
            <Space>
              <Form.Item
                name="inputTipsTone"
                noStyle
                rules={[{required: true, message: '请输入输入框色值'}]}
              >
                <Input
                  onChange={(e) => changeColor('inputTipsTone', e.target.value)}
                />
              </Form.Item>
              {colors.inputTipsTone && (
                <Tag
                  color={
                    colors.inputTipsTone == 'error'
                      ? 'red'
                      : colors.inputTipsTone
                  }
                >
                  {colors.inputTipsTone == 'error'
                    ? '颜色错误'
                    : colors.inputTipsTone}
                </Tag>
              )}
            </Space>
          </Form.Item>

          <Form.Item label="输入框输入文案色值" required>
            <Space>
              <Form.Item
                name="inputFontColor"
                noStyle
                rules={[{required: true, message: '请输入输入框色值'}]}
              >
                <Input
                  onChange={(e) =>
                    changeColor('inputFontColor', e.target.value)
                  }
                />
              </Form.Item>
              {colors.inputFontColor && (
                <Tag
                  color={
                    colors.inputFontColor == 'error'
                      ? 'red'
                      : colors.inputFontColor
                  }
                >
                  {colors.inputFontColor == 'error'
                    ? '颜色错误'
                    : colors.inputFontColor}
                </Tag>
              )}
            </Space>
          </Form.Item>

          <Form.Item label="获取验证码按钮填充颜色色值" required>
            <Space>
              <Form.Item
                name="validateButtonFillTone"
                noStyle
                rules={[{required: true, message: '请输入色值'}]}
              >
                <Input
                  onChange={(e) =>
                    changeColor('validateButtonFillTone', e.target.value)
                  }
                />
              </Form.Item>
              {colors.validateButtonFillTone && (
                <Tag
                  color={
                    colors.validateButtonFillTone == 'error'
                      ? 'red'
                      : colors.validateButtonFillTone
                  }
                >
                  {colors.validateButtonFillTone == 'error'
                    ? '颜色错误'
                    : colors.validateButtonFillTone}
                </Tag>
              )}
            </Space>
          </Form.Item>

          <Form.Item label="获取验证码按钮边框颜色色值" required>
            <Space>
              <Form.Item
                name="validateButtonBorderTone"
                noStyle
                rules={[{required: true, message: '请输入色值'}]}
              >
                <Input
                  onChange={(e) =>
                    changeColor('validateButtonBorderTone', e.target.value)
                  }
                />
              </Form.Item>
              {colors.validateButtonBorderTone && (
                <Tag
                  color={
                    colors.validateButtonBorderTone == 'error'
                      ? 'red'
                      : colors.validateButtonBorderTone
                  }
                >
                  {colors.validateButtonBorderTone == 'error'
                    ? '颜色错误'
                    : colors.validateButtonBorderTone}
                </Tag>
              )}
            </Space>
          </Form.Item>

          <Form.Item label="获取验证码按钮文字色值" required>
            <Space>
              <Form.Item
                name="validateButtonTipsTone"
                noStyle
                rules={[{required: true, message: '请输入色值'}]}
              >
                <Input
                  onChange={(e) =>
                    changeColor('validateButtonTipsTone', e.target.value)
                  }
                />
              </Form.Item>
              {colors.validateButtonTipsTone && (
                <Tag
                  color={
                    colors.validateButtonTipsTone == 'error'
                      ? 'red'
                      : colors.validateButtonTipsTone
                  }
                >
                  {colors.validateButtonTipsTone == 'error'
                    ? '颜色错误'
                    : colors.validateButtonTipsTone}
                </Tag>
              )}
            </Space>
          </Form.Item>

          <Form.Item label="按钮设置" required>
            {!!imgs.buttonImg && (
              <div>
                <img
                  src={imgs.buttonImg}
                  style={{width: 300, marginBottom: 15}}
                />
              </div>
            )}
            <Form.Item
              name="buttonImg"
              rules={[{required: true, message: '请输入图片链接'}]}
              noStyle
            >
              <Upload
                beforeUpload={(file) => upload(file, 'buttonImg')}
                showUploadList={false}
                accept="image/*"
              >
                <Button>
                  <UploadOutlined /> 选择文件
                </Button>
              </Upload>
            </Form.Item>
          </Form.Item>

          <Form.Item label="按钮动作">
            <div>注册下载</div>
          </Form.Item>

          <Form.Item label="添加协议">
            <Button type="link" danger style={{marginBottom: 20}}>
              提示：请添加协议名称和URL，不加书名号！在按钮下方将显示：同意并阅读《XX》、《XX》
            </Button>

            <Form.List name="agreement">
              {(fields, {add, remove}) => {
                return (
                  <div>
                    {fields.map((field) => (
                      <Space
                        key={field.key}
                        style={{display: 'flex', marginBottom: 8}}
                        align="start"
                      >
                        <Form.Item
                          {...field}
                          label="协议名称"
                          name={[field.name, 'name']}
                          fieldKey={[field.fieldKey, 'name']}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label="协议URL"
                          name={[field.name, 'url']}
                          fieldKey={[field.fieldKey, 'url']}
                        >
                          <Input />
                        </Form.Item>

                        <Button danger onClick={() => remove(field.name)}>
                          删除
                        </Button>
                      </Space>
                    ))}

                    <Form.Item>
                      <Button type="primary" onClick={() => add()}>
                        添加
                      </Button>
                    </Form.Item>
                  </div>
                )
              }}
            </Form.List>
          </Form.Item>
          {/*required*/}
          <Form.Item label="宣传图片上传">
            {!!imgs.publicityImg && (
              <div>
                <img
                  src={imgs.publicityImg}
                  style={{width: 300, marginBottom: 15}}
                />
              </div>
            )}
            <Form.Item
              name="publicityImg"
              // rules={[{required: true, message: '请输入图片链接'}]}
              noStyle
            >
              <Upload
                beforeUpload={(file) => upload(file, 'publicityImg')}
                showUploadList={false}
                accept="image/*"
              >
                <Button style={{marginRight: 20}}>
                  <UploadOutlined /> 选择文件
                </Button>
                {!!imgs.publicityImg && (
                  <Button
                    type="primary"
                    danger
                    onClick={(e) => removeImg('publicityImg', e)}
                  >
                    删除
                  </Button>
                )}
              </Upload>
            </Form.Item>
          </Form.Item>

          {/*required*/}
          <Form.Item label="底部按钮">
            {!!imgs.footButtonImg && (
              <div>
                <img
                  src={imgs.footButtonImg}
                  style={{width: 300, marginBottom: 15}}
                />
              </div>
            )}

            <Form.Item
              name="footButtonImg"
              // rules={[{required: true, message: '请输入图片链接'}]}
              noStyle
            >
              <Upload
                beforeUpload={(file) => upload(file, 'footButtonImg')}
                showUploadList={false}
                accept="image/*"
              >
                <Button style={{marginRight: 20}}>
                  <UploadOutlined /> 选择文件
                </Button>
                {!!imgs.footButtonImg && (
                  <Button
                    type="primary"
                    danger
                    onClick={(e) => removeImg('footButtonImg', e)}
                  >
                    删除
                  </Button>
                )}
              </Upload>
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="底部文案"
            name="footDescribe"
            style={{color: '#333'}}
          >
            <BraftEditor
              className={css.edit}
              excludeControls={excludeControls}
            />
          </Form.Item>

          {/*required*/}
          <Form.Item label="底部文案颜色色值">
            <Space>
              <Form.Item
                name="footTipsTone"
                noStyle
                // rules={[{required: true, message: '请输入色值'}]}
              >
                <Input
                  onChange={(e) => changeColor('footTipsTone', e.target.value)}
                />
              </Form.Item>
              {colors.footTipsTone && (
                <Tag
                  color={
                    colors.footTipsTone == 'error' ? 'red' : colors.footTipsTone
                  }
                >
                  {colors.footTipsTone == 'error'
                    ? '颜色错误'
                    : colors.footTipsTone}
                </Tag>
              )}
            </Space>
          </Form.Item>

          {/*required*/}
          <Form.Item label="底部banner">
            {!!imgs.footBanner && (
              <div>
                <img
                  src={imgs.footBanner}
                  style={{width: 300, marginBottom: 15}}
                />
              </div>
            )}
            <Form.Item
              name="footBanner"
              // rules={[{required: true, message: '请输入图片链接'}]}
              noStyle
            >
              <Upload
                beforeUpload={(file) => upload(file, 'footBanner')}
                showUploadList={false}
                accept="image/*"
              >
                <Button style={{marginRight: 20}}>
                  <UploadOutlined /> 选择文件
                </Button>
                {!!imgs.footBanner && (
                  <Button
                    type="primary"
                    danger
                    onClick={(e) => removeImg('footBanner', e)}
                  >
                    删除
                  </Button>
                )}
              </Upload>
            </Form.Item>
          </Form.Item>

          <Form.Item label="在线状态" name="status">
            <Radio.Group>
              <Radio value={1}>在线</Radio>
              <Radio value={0}>下线</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input />
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
  // console.log(params.ctx)
  const id = params.ctx.query.id
  let data = ''
  if (id) {
    data = await getData(id)
  }
  return {data, id}
}

export default body
