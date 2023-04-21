import {Layout} from '~/components/Layout'
import React, {useEffect, useRef, useState} from 'react'
import apiMarketing from '~/api/marketing'
import apiAgreement from '~/api/agreement'
import {
  Button,
  Card,
  Radio,
  Form,
  Input,
  TimePicker,
  message,
  Row,
  Col,
  Badge,
  Space,
} from 'antd'
import Router from 'next/router'
import {SearchOutlined} from '@ant-design/icons'
const {RangePicker} = TimePicker

const layout = {
  labelCol: {span: 3},
  wrapperCol: {span: 15},
}

const getData = async (id) => {
  try {
    let {
      data: {code, data},
    } = await apiAgreement.getTemplateDetail(id)
    if (code == 0) {
      return data
    }
    return {}
  } catch (e) {
    return {}
  }
}

const getLabelData = async (cb) => {
  try {
    let {
      data: {code, data},
    } = await apiAgreement.getTemplateLabel('TEMP_LABEL')
    if (code == 0) {
      cb(data)
    }
    return []
  } catch (e) {
    return []
  }
}

const breadcrumbs = [{text: '协议管理'}, {text: '协议模板'}, {text: '新增模板'}]

function body(props) {
  const [form] = Form.useForm()
  const editorElem = useRef(null)

  const [wEdit, setWEdit] = useState()
  const [labels, setLabels] = useState([])
  const [editorText, setEditorText] = useState(null)

  const editFunc = props.id
    ? apiAgreement.updateTemplate
    : apiAgreement.addTemplate

  if (props.id) {
    breadcrumbs[2].text = '编辑模板'
  }

  useEffect(() => {
    const E = require('wangeditor')
    const editor = new E(editorElem.current)
    setWEdit(editor)
    editor.config.pasteFilterStyle = false
    editor.config.zIndex = 500
    editor.config.onchange = (html) => {
      // console.log(html)
      form.setFieldsValue({content: html})
    }
    editor.create()
    // editor.txt.html(doc)

    editor.$textContainerElem.css('height', '600px !important')
    editor.config.pasteIgnoreImg = true
    editor.config.uploadImgMaxLength = 1
    editor.config.uploadImgShowBase64 = true
    editor.config.customUploadImg = function (resultFiles, insertImgFn) {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法

      readFile(resultFiles, (base64) => {
        apiAgreement
          .uploadData({imgData: base64})
          .then(({data: {code, data}}) => {
            console.log(code, data)
            if (code == 0) {
              insertImgFn(data)
            }
          })
      })
    }

    // console.log(props.data)
    if (props.data) {
      form.setFieldsValue(props.data)
      editor.txt.html(props.data.content)
    }

    getLabelData((labels) => {
      setLabels(labels)
    })
    return () => {
      // 组件销毁时销毁编辑器  注：class写法需要在componentWillUnmount中调用
      editor.destroy()
    }
  }, [])

  const readFile = (files, cb) => {
    var file = files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (e) {
      cb(reader.result)
    }
  }

  const clickItem = (v) => {
    let text = `${'${' + v.code + '}'}`
    wEdit.cmd.do('insertHTML', text)
  }

  const preview = () => {
    let {name, content} = form.getFieldsValue(['name', 'content'])
    if (!name || !content) {
      return message.error('请输入名称或内容')
    }

    let params = {
      templateName: name,
      content: content.replaceAll('<br>', '<br></br>'),
    }

    apiAgreement.previewTemplate(params).then((res) => {
      console.log(res)
      if (res.data.code == 0) {
        window.open(res.data.data)
      }
    })
  }

  const saveContent = () => {
    form.validateFields().then((val) => {
      let obj = {...val}
      if (props.id) {
        obj.id = props.id
      }
      let keys = []
      labels.forEach((item) => {
        let str = '${' + item.code + '}'
        if (obj.content.indexOf(str) > -1) {
          keys.push(item.code)
        }
      })

      obj.extraConfig = keys.join(',')

      editFunc(obj).then((res) => {
        if (res.data.code == 0) {
          message.success('提交成功')
          Router.back()
        }
      })
    })
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card title={null}>
        <Form {...layout} form={form} name="basic">
          <Form.Item
            label="模板名称"
            name="name"
            rules={[{required: true, message: '模板名称不可为空'}]}
          >
            <Input
              maxLength={30}
              placeholder="示例：《隐私协议》，最多30字符。"
            />
          </Form.Item>

          <Form.Item
            label="模板状态"
            name="status"
            rules={[{required: true, message: '请选择模板状态'}]}
          >
            <Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={0}>停用</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="模板内容"
            name="content"
            rules={[{required: true, message: '请填写模板内容'}]}
          >
            <Form.Item
              label="点击添加标签："
              style={{
                marginBottom: 0,
                border: '1px solid #c9d8db',
                borderBottom: 'none',
                padding: '15px 20px 0',
              }}
            >
              <Row gutter={20}>
                {labels.map((v, i) => {
                  return (
                    <Col
                      onClick={() => clickItem(v)}
                      key={i}
                      style={{
                        paddingBottom: 15,
                        cursor: 'pointer',
                      }}
                    >
                      {v.description}：${'{' + v.code + '}'}
                    </Col>
                  )
                })}
              </Row>
            </Form.Item>
            <div ref={editorElem} style={{background: '#fff'}}></div>
          </Form.Item>

          <Form.Item wrapperCol={{offset: 3}}>
            <Space style={{padding: '20px 0'}} size={80}>
              <Button style={{width: 100}} onClick={preview}>
                预览
              </Button>
              <Button style={{width: 100}} type="primary" onClick={saveContent}>
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  )
}

body.getInitialProps = async (ctx) => {
  let id = ctx.ctx.query.id

  let data = null
  if (id) {
    data = await getData(id)
  }

  return {data, id}
}

export default body
