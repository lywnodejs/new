import {Layout} from '~/components/Layout'
import React, {useEffect, useState, useRef} from 'react'
import {
  Space,
  message,
  Form,
  Select,
  Input,
  Button,
  Radio,
  Steps,
  Card,
  Empty,
} from 'antd'
import apiProduct from '~/api/product'
import apiReview from '~/api/review'
import {useCookies} from 'react-cookie'
const {Step} = Steps

const breadcrumbs = [
  {text: '信审管理'},
  {text: '信审设置'},
  {text: '信审策略设置'},
]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}
function body({router}) {
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [form] = Form.useForm()
  const [activityCurrent, setActivityCurrent] = useState([])
  const editorElem = useRef(null)
  const [wEdit, setWEdit] = useState([])
  const [display, setDisplay] = useState('none')

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await apiProduct.get_products({tenantId: cookies.tenantId})
        if (code == 0) {
          setProductList(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])
  useEffect(() => {
    const E = require('wangeditor')
    const editor = new E(editorElem.current)
    setWEdit(editor)
    editor.config.pasteFilterStyle = false
    editor.config.zIndex = 500
    editor.config.onchange = (html) => {
      console.log(html)
      form.setFieldsValue({strategy: html})
    }

    editor.config.menus = [
      'head',
      'bold',
      'fontSize',
      'fontName',
      'italic',
      'underline',
      'strikeThrough',
      'indent',
      'lineHeight',
      'foreColor',
      'backColor',
      'link',
      'list',
      'todo',
      'justify',
      'quote',
      'emoticon',
      'table',
      'code',
      'splitLine',
      'undo',
      'redo',
    ]
    editor.create()
    // editor.txt.html(doc)

    editor.$textContainerElem.css('height', '600px !important')
    editor.config.pasteIgnoreImg = true

    return () => {
      // 组件销毁时销毁编辑器  注：class写法需要在componentWillUnmount中调用
      editor.destroy()
    }
  }, [])

  const handleClick = async (e) => {
    const value = e.target.value
    setActivityCurrent(value != null ? 1 : 0)
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_strategyList({productId: value})
      if (code == 0) {
        if (data != null) {
          wEdit.txt.html(data.strategy)
          setActivityCurrent(2)
        } else if (data == null) {
          wEdit.txt.html('')
        }
      }
    } catch (err) {
      console.log(err)
    }
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_switchList({productId: value})
      if (code == 0) {
        if (data == null) {
          setDisplay('block')
        } else {
          setDisplay('none')
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    if (values.productId == null) {
      message.error('请填写完所有内容')
    }
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_updateStrategy(values)
      if (code == 0) {
        message.success('保存成功')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const configure = () => {
    location.href = `/credit/review/switch`
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space
        direction="vertical"
        size="large"
        style={{width: '100%', position: 'relative'}}
      >
        <Card>
          <Form
            form={form}
            name="form"
            initialValues={{
              productId: null,
              strategy: null,
            }}
          >
            <Steps direction="vertical" current={activityCurrent}>
              <Step
                title="选择贷款产品"
                description={
                  <div style={{height: 100}}>
                    <div style={{marginTop: 50}}>
                      <Form.Item label="信贷产品" name="productId">
                        <Radio.Group>
                          {productList.map((v, i) => (
                            <Radio.Button
                              key={v.id}
                              value={v.id}
                              onClick={handleClick}
                            >
                              {v.name}
                            </Radio.Button>
                          ))}
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  </div>
                }
              />
              <Step
                title="设置信审策略"
                description={
                  <div style={{marginTop: 20}}>
                    <Form.Item
                      label=""
                      name="strategy"
                      rules={[{required: true, message: '请填写信审策略'}]}
                    >
                      <div ref={editorElem} style={{background: '#fff'}}></div>
                    </Form.Item>
                    <Button
                      type="primary"
                      style={{marginTop: 10, marginLeft: 44}}
                      onClick={handleSave}
                    >
                      保存
                    </Button>
                  </div>
                }
              />
            </Steps>

            <div
              style={{
                display: `${display}`,
                position: 'absolute',
                width: '95%',
                height: 750,
                left: 63,
                top: 250,
                zIndex: 999,
                backgroundColor: '#fff',
              }}
            >
              <Empty
                style={{
                  marginTop: 100,
                }}
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{
                  height: 60,
                }}
                description={'当前产品未开启信审开关，请前去设置'}
              >
                <Button type="primary" onClick={configure}>
                  前去配置
                </Button>
              </Empty>
            </div>
          </Form>
        </Card>
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
