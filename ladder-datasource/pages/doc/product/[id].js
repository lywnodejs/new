import {Form, Input, Button, Tabs, Tag, Space, Row, Col} from 'antd'
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons'
import dynamic from 'next/dynamic'
const ReactJson = dynamic(() => import('react-json-view'), {ssr: false})
import {useEffect, useState} from 'react'
import {Layout} from '~/components/Layout'
import style from './style.less'
import fetch from '~/utils/fetch'
import {useRouter} from 'next/router'

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 8},
}
const tailLayout = {
  wrapperCol: {offset: 4, span: 8},
}

const {TabPane} = Tabs
const {CheckableTag} = Tag
const tagsData = ['接口文档', '接口调试']

const APIForm = ({data: {paramNames, debugGwCode, buildInParam}, tab}) => {
  const [form] = Form.useForm()

  const onReset = () => {
    const fields = paramNames.map((v) => {
      return {fieldName: v}
    })
    form.setFieldsValue({fields})
    setResult({请求参数: {}, 返回结果: {}})
  }

  useEffect(() => {
    onReset()
  }, [tab])

  const [result, setResult] = useState({})

  const onFinish = async ({fields}) => {
    let params = {...buildInParam}
    let extParamMap = {}
    fields.forEach((v) => {
      if (~paramNames.indexOf(v.fieldName)) {
        params[v.fieldName] = v.fieldValue
      } else {
        extParamMap[v.fieldName] = v.fieldValue
      }
    })

    try {
      const {data, headers} = await fetch(debugGwCode, [
        {...params, extParamMap},
      ])
      setResult({请求参数: {...params, extParamMap}, 返回结果: data})
      // console.log(data)
    } catch (e) {}
  }

  return (
    <>
      <h3 className={style.h3}>请求参数：</h3>
      <Form form={form} name="basic" onFinish={onFinish}>
        <Form.List name="fields">
          {(fields, {add, remove}) => {
            return (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{display: 'flex', marginBottom: 8}}
                    align="start"
                  >
                    <span style={{color: 'red'}}>*</span>
                    <Form.Item
                      {...field}
                      name={[field.name, 'fieldName']}
                      fieldKey={[field.fieldKey, 'fieldName']}
                      rules={[{required: true, message: '请输入参数名'}]}
                    >
                      <Input disabled={field.key < 3} placeholder="参数名" />
                    </Form.Item>
                    =
                    <Form.Item
                      {...field}
                      name={[field.name, 'fieldValue']}
                      fieldKey={[field.fieldKey, 'fieldValue']}
                      rules={[{required: true, message: '请输入参数值'}]}
                      style={{width: 600}}
                    >
                      <Input placeholder="参数值" />
                    </Form.Item>
                    {field.key > 2 && (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        style={{margin: '0 8px'}}
                        onClick={() => {
                          remove(field.name)
                        }}
                      />
                    )}
                  </Space>
                ))}

                <Form.Item style={{textAlign: 'right', maxWidth: 810}}>
                  <Space size={48}>
                    <Button
                      type="primary"
                      onClick={() => {
                        add()
                      }}
                    >
                      添加参数
                    </Button>
                    <Button onClick={onReset}>清空</Button>
                    <Button htmlType="submit">调试</Button>
                  </Space>
                </Form.Item>
              </>
            )
          }}
        </Form.List>
      </Form>
      <h3 className={style.h3}>调试信息：</h3>
      <ReactJson
        style={{maxWidth: 810, wordBreak: 'break-all'}}
        theme={'solarized'}
        name={false}
        src={result}
      />
    </>
  )
}

const Html = ({tab, data: {id: bizId} = {}}) => {
  const [html, setHtml] = useState('')

  const fetchData = async () => {
    try {
      const {
        data: {code, data: {content}} = {code: -1, data: {}},
      } = await fetch(
        'fincloud.admin.center.facade.api.devdocservice.getdsmdocbybizid',
        [{bizId}],
      )
      if (code === 0) {
        setHtml(content)
      }
    } catch (e) {}
  }

  useEffect(() => {
    fetchData()
  }, [tab])

  return <div className={style.rich} dangerouslySetInnerHTML={{__html: html}} />
}

function body({list, breadcrumbs}) {
  const router = useRouter()
  const [type, setType] = useState(0)
  const [tab, setTab] = useState(() => {
    const {pId} = router.query
    if (pId === undefined) {
      return 0
    }

    const index = list.findIndex((v) => {
      return v.id == pId
    })
    // console.log('----------', index)
    return index || 0
  })

  const onChange = (key) => {
    setTab(key)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className={style.top}>
        <div>
          <Tabs activeKey={`${tab}`} onChange={onChange}>
            {list.map((v, i) => (
              <TabPane tab={v.name} key={i}></TabPane>
            ))}
          </Tabs>
        </div>
        <div>
          {tagsData.map((tag, index) => (
            <CheckableTag
              key={tag}
              checked={type === index}
              onChange={(checked) => {
                setType(index)
              }}
            >
              {tag}
            </CheckableTag>
          ))}
        </div>
      </div>
      <div className={style.content}>
        {type === 0 ? (
          <Html data={list[tab]} tab={tab} />
        ) : (
          <APIForm data={list[tab]} tab={tab} />
        )}
      </div>
    </Layout>
  )
}

body.getInitialProps = async ({
  ctx: {
    query: {id},
  },
}) => {
  let breadcrumbs = [{text: '开发文档'}, {text: '接入数据产品'}]
  try {
    const {
      data: {code, data: list} = {data: [], code: -1},
      data,
    } = await fetch(
      'fincloud.ds.management.facade.api.dsprdocservice.docdsprdoctablistbycoid',
      [{id}],
    )

    if (list.length > 0) {
      breadcrumbs.push({text: list[0].companyName})
    }

    if (code === 0) {
      return {list, breadcrumbs}
    }

    return {list: [], breadcrumbs}
  } catch (e) {
    return {list: [], breadcrumbs}
  }
}

export default body
