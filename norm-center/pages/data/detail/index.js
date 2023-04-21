import React, {useEffect, useState} from 'react'
import dynamic from 'next/dynamic'
import {LockOutlined} from '@ant-design/icons'
import {
  Row,
  Col,
  Button,
  Form,
  Select,
  Input,
  Card,
  Tabs,
  message,
  Badge,
  Modal,
} from 'antd'
import Router, {withRouter} from 'next/router'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import copy from 'copy-to-clipboard'
import {Layout} from '~/components/Layout'
import AddDictTableList from './AddDictTableList'
import SucessModal from './SucessModal'
import api from '~/api/data'
import {checkUrl} from '~/utils'
import {cancelRequest} from '~/utils/fetch'
import styles from './index.less'
const ReactJson = dynamic(() => import('react-json-view'), {ssr: false})
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {ssr: false})

const {TabPane} = Tabs
const {TextArea} = Input

function body({router}) {
  const [activeKey, setActiveKey] = useState('1')
  const [activeRightKey, setActiveRightKey] = useState('1')
  const [paramsAccountDict, setParamsAccountDict] = useState([])
  const [paramsClientDict, setParamsClientDict] = useState([])
  const [headersDictList, setHeadersDictList] = useState([])
  const [systemDictList, setSystemDictList] = useState([])
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [keywordForm] = Form.useForm()
  const [sqlForm] = Form.useForm()
  // TODO json输入框的form数据
  const [jsonForm] = Form.useForm()
  const [codeMirror, setCodeMirror] = useState(null)
  const [breadcrumbs, setBreadcrumbs] = useState([
    {text: '数据源管理'},
    {text: router.query.tab == '1' ? '接口' : '数据库'},
    {text: router.query.id == 'new' ? '新增' : '详情'},
  ])
  const [rawData, setRawData] = useState(false)
  const [resData, setResData] = useState({})
  const [resStatus, setResStatus] = useState({
    httpCode: '',
    length: '',
    time: '',
  })
  const [loading, setLoading] = useState(false)
  const [testLink, setTestLink] = useState('测试连接')
  const [allDefaultParams, setAllDefaultParams] = useState([])
  const [canSqlTest, setCanSqlTest] = useState(false)
  // TODO json模态框state
  const [isjsonModel, setJsonModel] = useState(false)
  const [textAreaValue, setTextAreaValue] = useState('')

  useEffect(() => {
    function fetchData() {
      setBreadcrumbs([...breadcrumbs])
      if (router.query.id != 'new') {
        if (router.query.tab == '1') {
          fetchDetail()
        } else {
          fetchDetailDetail()
        }
      }
      getAllDefaultParams()
    }
    fetchData()
  }, [])
  useEffect(() => {
    import('codemirror/keymap/sublime')
    import('codemirror/mode/sql/sql')
  }, [])

  const getAllDefaultParams = async () => {
    try {
      let {
        data: {code, data},
      } = await api.getAllDefaultParams()
      if (code == 0) {
        setAllDefaultParams(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const fetchDetail = async () => {
    try {
      const {
        data: {data, code},
      } = await api.getDataSourceById(router.query.id)
      if (code == 0) {
        form.setFieldsValue({
          name: data.name,
          requestType: data.requestType,
          requestUrl: data.requestUrl,
        })
        // setRawData(JSON.parse(data.body))
        let jsonData = JSON.stringify(JSON.parse(data.body), null, '\t')
        console.log(jsonData)
        setRawData(jsonData)
        setParamsAccountDict(data.params)
        setHeadersDictList(data.headers)
        setSystemDictList(data.dynamicVarMap)
        setResData(JSON.parse(data.result))
        if (data.requestType == 'GET') {
          setActiveKey('2')
        } else {
          setActiveKey('1')
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  const fetchDetailDetail = async () => {
    try {
      const {
        data: {data, code},
      } = await api.getDataSqlById(router.query.id)
      if (code == 0) {
        sqlForm.setFieldsValue(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const changeMethod = (val) => {
    form.setFieldsValue('requestType', val)
    if (val == 'GET') {
      setActiveKey('2')
    } else {
      setActiveKey('1')
    }
  }
  const changeTab = async (key) => {
    setActiveKey(key)
  }
  const changeTabRight = async (key) => {
    setActiveRightKey(key)
  }
  const handleDict = (list, setList) => () => {
    list.push({key: '', value: ''})
    setList([...list])
  }
  const onAdd = (type) => {
    const dict = [
      {type: 1, action: handleDict(paramsAccountDict, setParamsAccountDict)},
      {type: 2, action: handleDict(paramsClientDict, setParamsClientDict)},
      {type: 3, action: handleDict(headersDictList, setHeadersDictList)},
      {type: 4, action: handleDict(systemDictList, setSystemDictList)},
    ]
    let findItem = dict.find((item) => item.type == type)
    findItem && findItem.action()
  }
  const getReactElementList = () => {
    var arrReactDivValueList = document.querySelectorAll(
      '.rightReactJson .variable-value div',
    )
    var arrReactSpanValueList = document.querySelectorAll(
      '.rightReactJson .variable-value div span',
    )
    return [...arrReactDivValueList, ...arrReactSpanValueList]
  }
  const removeAllStyle = () => {
    var arrReactList = document.querySelectorAll('.rightReactJson .object-key')
    var newList = [...arrReactList, ...getReactElementList()]
    newList.forEach((v, i) => {
      v.style.background = 'none'
    })
  }
  const onSearchKeyword = (values) => {
    const {keyword} = values
    removeAllStyle()
    if (!keyword) {
      return
    }
    var arrReactList = document.querySelectorAll('.rightReactJson .object-key')

    changeBackground(arrReactList, keyword)
    changeValueBackground(getReactElementList(), keyword)
  }
  const changeBackground = (list, keyword) => {
    list.forEach((v, i) => {
      if (v.children[1].innerText == keyword) {
        v.style.background = '#1f8ffb'
      }
    })
  }
  const changeValueBackground = (list, keyword) => {
    list.forEach((v, i) => {
      if (v.innerText[0] == '"') {
        if (v.innerText == `"${keyword}"`) {
          v.style.background = '#1f8ffb'
        }
      } else {
        if (v.innerText == keyword) {
          v.style.background = '#1f8ffb'
        }
      }
    })
  }
  const onCopy = () => {
    message.success('已复制至剪切板')
  }
  const operations = (
    <>
      <Row>
        <Col style={{marginRight: '6px'}}>
          状态：<span style={{color: '#1890ff'}}>{resStatus.httpCode}</span>
        </Col>
        <Col style={{marginRight: '6px'}}>
          时间：<span style={{color: '#1890ff'}}>{resStatus.time}</span>
        </Col>
        <Col style={{marginRight: '6px'}}>
          大小：<span style={{color: '#1890ff'}}>{resStatus.length} B</span>
        </Col>
      </Row>
    </>
  )
  const changeDataType = (val) => {
    sqlForm.setFieldsValue('databaseType', val)
  }
  const onSave = async () => {
    try {
      const values = await form.validateFields()
      let paramsAccountDictFilterNull = paramsAccountDict.filter(
        (v) => v.key !== '' && v.value !== '',
      )
      let headersDictListFilterNull = headersDictList.filter(
        (v) => v.key !== '' && v.value !== '',
      )
      let systemDictListFilterNull = systemDictList.filter(
        (v) => v.key !== '' && v.value !== '',
      )
      let postApi =
        router.query.id == 'new'
          ? api.addDataSourceByHttp
          : api.updateDataSourceByHttp
      const {
        data: {data, code},
      } = await postApi({
        ...values,
        body: JSON.stringify(JSON.parse(codeMirror.getValue())),
        params: paramsAccountDictFilterNull,
        headers: headersDictListFilterNull,
        dynamicVarMap: systemDictListFilterNull,
        result: JSON.stringify(resData),
        id: router.query.id == 'new' ? null : router.query.id,
      })
      if (code == 0) {
        setVisible(true)
      }
    } catch (err) {
      console.log(err)
    }
  }
  // TODO 测试连接方法
  const onTest = async () => {
    try {
      const values = await form.validateFields()
      let paramsAccountDictFilterNull = paramsAccountDict.filter(
        (v) => v.key !== '' && v.value !== '',
      )
      let headersDictListFilterNull = headersDictList.filter(
        (v) => v.key !== '' && v.value !== '',
      )
      let systemDictListFilterNull = systemDictList.filter(
        (v) => v.key !== '' && v.value !== '',
      )
      if (!checkUrl(values.requestUrl)) {
        return message.error('请输入正确的URL')
      }
      setLoading(true)
      setTestLink('连接中')
      const {
        data: {
          data: {data, httpCode, length, time},
          code,
        },
      } = await api.testDataSourceByHttp({
        ...values,
        body: JSON.stringify(JSON.parse(codeMirror.getValue())),
        params: paramsAccountDictFilterNull,
        headers: headersDictListFilterNull,
        dynamicVarMap: systemDictListFilterNull,
        result: JSON.stringify(resData),
        id: router.query.id == 'new' ? null : router.query.id,
      })
      if (code == 0) {
        setResStatus({
          httpCode,
          length,
          time,
        })
        try {
          let newData = JSON.parse(data)
          setResData(newData)
        } catch (e) {
          setResData(data)
        }
        setLoading(false)
        setTestLink('测试连接')
      }
    } catch (err) {
      setLoading(false)
      setTestLink('测试连接')
      console.log(err)
    }
  }
  const onSaveSql = async () => {
    try {
      const values = await sqlForm.validateFields()
      let postApi =
        router.query.id == 'new'
          ? api.addDataSourceBySql
          : api.updateDataSqlByHttp
      const {
        data: {data, code},
      } = await postApi({
        ...values,
        id: router.query.id == 'new' ? null : router.query.id,
      })
      if (code == 0) {
        setVisible(true)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const onTestSql = async () => {
    try {
      const values = await sqlForm.validateFields()
      setLoading(true)
      setTestLink('连接中')
      const {
        data: {data, code},
      } = await api.testDataSqlByHttp({
        ...values,
        id: router.query.id == 'new' ? null : router.query.id,
      })
      if (code == 0) {
        message.success('连接成功')
        setLoading(false)
        setTestLink('测试连接')
        setCanSqlTest(true)
      } else {
        setLoading(false)
        setTestLink('测试连接')
        setCanSqlTest(false)
      }
    } catch (err) {
      setLoading(false)
      setTestLink('测试连接')
      setCanSqlTest(false)
      console.log(err)
    }
  }
  const changeRawData = (instance) => {
    if (!codeMirror) {
      setCodeMirror(instance)
    }
  }

  // TODO 若干方法
  const onEditJSON = (e) => {
    setRawData({...e.updated_src})
  }
  const onAddJSON = (e) => {
    setRawData({...e.updated_src})
  }
  const onDeleteJSON = (e) => {
    setRawData({...e.updated_src})
  }
  const onEditResJSON = (e) => {
    setResData({...e.updated_src})
  }
  const onAddResJSON = (e) => {
    setResData({...e.updated_src})
  }
  const onDeleteResJSON = (e) => {
    setResData({...e.updated_src})
  }
  const onCancel = () => {
    cancelRequest()
  }
  const onDelete = (record) => {}

  const onCopyFun = () => {
    if (codeMirror.getValue()) {
      copy(codeMirror.getValue())
      message.success('Json已复制成功')
    }
  }

  // TODO 设置对话框页眉
  const calmelCaseTitle = () => {
    return (
      <div className="jsonP" style={{fontWeight: 'bold'}}>
        JSON
        <span
          className="jsonA"
          style={{
            fontSize: '10px',
            marginLeft: '10px',
            color: 'grey',
            fontWeight: 'normal',
          }}
        >
          请输入标准JSON结构
        </span>
      </div>
    )
  }

  // TODOjson复制模态框方法
  const pasFunc = () => {
    setJsonModel(true)
  }

  const handleJsonOk = () => {
    setJsonModel(false)
  }

  const handleJsonCancel = () => {
    jsonForm.resetFields()
    setJsonModel(false)
  }

  const textAreaValueChange = ({target: {value}}) => {
    setTextAreaValue(value)
  }

  const isJsonFun = (value) => {
    message.success('粘贴成功')
    jsonForm.validateFields()
    jsonForm.resetFields()
  }

  const isJsons = (e) => ({
    validator(_, value) {
      // console.log(JSON.parse(value))
      // console.log(getFieldValue)
      // console.log(isJSON(value))
      setJsonModel(true)
      if (isJSON(value)) {
        setJsonModel(false)
        setRawData(value)
        return Promise.resolve()
      }
      return Promise.reject(new Error('请检查当前输入内容'))
    },
    validateTrigger: 'onClick',
  })
  // {"a":123}

  function isJSON(str) {
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str)
        if (typeof obj == 'object' && obj) {
          return true
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    }
    return false
  }

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      extra={<Button onClick={() => Router.back()}>返回上一页</Button>}
    >
      {router.query.tab == '1' && (
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Card style={{height: '100%'}}>
              <Form
                form={form}
                layout="inline"
                className="searchForm"
                initialValues={{
                  name: '',
                  requestType: 'POST',
                }}
              >
                <Row style={{width: '100%'}}>
                  <Form.Item
                    label="名称"
                    name="name"
                    rules={[{required: true, message: '请输入请求名称'}]}
                    style={{width: '100%'}}
                  >
                    <Input placeholder="请输入请求名称" />
                  </Form.Item>
                </Row>
                <Form.Item
                  label={
                    <>
                      <span style={{color: 'red'}}>*</span>
                      请求方式
                    </>
                  }
                  rules={[{required: true}]}
                  style={{width: '100%'}}
                >
                  <Form.Item
                    name="requestType"
                    rules={[{required: true, message: '请选择请求方式'}]}
                    style={{
                      width: '20%',
                      display: 'inline-block',
                      marginRight: 0,
                    }}
                  >
                    <Select
                      style={{width: '100%'}}
                      onChange={(val) => changeMethod(val)}
                    >
                      <Select.Option value="POST">POST</Select.Option>
                      <Select.Option value="GET">GET</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="requestUrl"
                    rules={[
                      {required: true, message: '输入请求接口URL'},
                      ({getFieldValue}) => ({
                        validator(rule, value) {
                          if (value && !checkUrl(value)) {
                            return Promise.reject('请输入正确的URL')
                          }
                          return Promise.resolve()
                        },
                      }),
                    ]}
                    style={{
                      width: '79%',
                      display: 'inline-block',
                      marginRight: 0,
                      marginLeft: '1%',
                    }}
                  >
                    <Input placeholder="输入请求接口URL" />
                  </Form.Item>
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.requestType !== currentValues.requestType
                  }
                >
                  {({getFieldValue}) => {
                    return (
                      <Tabs
                        style={{width: '100%'}}
                        activeKey={activeKey}
                        onTabClick={(key) => changeTab(key, false)}
                      >
                        {getFieldValue('requestType') == 'POST' ? (
                          <TabPane
                            tab={
                              <span>
                                {rawData ? (
                                  Object.keys(JSON.parse(rawData)).length ? (
                                    <Badge status="success" />
                                  ) : null
                                ) : null}
                                Body
                              </span>
                            }
                            key="1"
                            forceRender={true}
                          >
                            <div className={styles.dataDetail}>
                              <CodeMirror
                                value={rawData || ' '}
                                height={514}
                                options={{
                                  theme: 'monokai',
                                  keyMap: 'sublime',
                                  json: true,
                                  mode: 'javascript',
                                }}
                                onChange={(v) => changeRawData(v)}
                              />
                            </div>
                          </TabPane>
                        ) : null}

                        {getFieldValue('requestType') == 'GET' ? (
                          <TabPane
                            tab={
                              <span>
                                {paramsAccountDict.length ? (
                                  <Badge status="success" />
                                ) : null}
                                Params
                              </span>
                            }
                            key="2"
                            forceRender={true}
                          >
                            <AddDictTableList
                              {...{
                                list: paramsAccountDict,
                                setList: setParamsAccountDict,
                                type: 1,
                                onAdd,
                              }}
                            />
                          </TabPane>
                        ) : null}

                        <TabPane
                          tab={
                            <span>
                              {headersDictList.length ? (
                                <Badge status="success" />
                              ) : null}
                              Headers
                            </span>
                          }
                          key="3"
                          forceRender={true}
                        >
                          <AddDictTableList
                            {...{
                              list: headersDictList,
                              setList: setHeadersDictList,
                              type: 3,
                              onAdd,
                            }}
                          />
                        </TabPane>
                        <TabPane
                          tab={
                            <span>
                              {systemDictList.length ? (
                                <Badge status="success" />
                              ) : null}
                              参数映射
                            </span>
                          }
                          key="4"
                          forceRender={true}
                        >
                          <AddDictTableList
                            {...{
                              list: systemDictList,
                              setList: setSystemDictList,
                              type: 4,
                              onAdd,
                              allDefaultParams,
                            }}
                          />
                        </TabPane>
                      </Tabs>
                    )
                  }}
                </Form.Item>
              </Form>

              <footer
                style={{
                  textAlign: 'right',
                  borderTop: '1px solid #f0f0f0',
                  marginTop: 15,
                  paddingTop: 10,
                }}
              >
                <Button
                  loading={loading}
                  onClick={onCopyFun}
                  style={{marginRight: 15, height: '100%'}}
                >
                  复制
                </Button>
                {/* TODO 粘贴按钮 */}
                {/* <Button
                  loading={loading}
                  onClick={pasFunc}
                  style={{marginRight: 15, height: '100%'}}
                >
                  粘贴
                </Button> */}
                {/* TODO测试连接按钮 */}
                <Button
                  type="primary"
                  loading={loading}
                  onClick={onTest}
                  style={{marginRight: 15, height: '100%'}}
                >
                  {testLink}
                </Button>
              </footer>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              {loading ? (
                <div
                  style={{
                    height: '459px',
                    background: '#ccc',
                    textAlign: 'center',
                  }}
                >
                  <p style={{paddingTop: '160px'}}>请等待...</p>
                  <Button onClick={onCancel}>取消本次请求</Button>
                </div>
              ) : (
                <Tabs
                  activeKey={activeRightKey}
                  onTabClick={(key) => changeTabRight(key, false)}
                  tabBarExtraContent={operations}
                >
                  <TabPane tab="Body" key="1" forceRender={true}>
                    {resStatus.httpCode != '' && resStatus.httpCode != 200 ? (
                      <div>{resData}</div>
                    ) : (
                      <>
                        <Form
                          form={keywordForm}
                          onFinish={onSearchKeyword}
                          layout="inline"
                          initialValues={{
                            keyword: '',
                          }}
                        >
                          <Form.Item label="关键字" name="keyword">
                            <Input placeholder="请输入" />
                          </Form.Item>
                          <Button
                            type="primary"
                            style={{marginRight: 15}}
                            htmlType="submit"
                          >
                            查询
                          </Button>
                          <CopyToClipboard
                            text={JSON.stringify(resData)}
                            onCopy={onCopy}
                            style={{marginRight: 15}}
                          >
                            <Button type="primary">复制</Button>
                          </CopyToClipboard>
                        </Form>
                        <div className="rightReactJson">
                          <ReactJson
                            src={resData}
                            onEdit={onEditResJSON}
                            onAdd={onAddResJSON}
                            onDelete={onDeleteResJSON}
                            displayDataTypes={false}
                            displayObjectSize={false}
                            enableClipboard={false}
                            theme="rjv-default"
                            style={{minHeight: '562px'}}
                          />
                        </div>
                      </>
                    )}
                  </TabPane>
                </Tabs>
              )}

              <footer
                style={{
                  textAlign: 'right',
                  borderTop: '1px solid #f0f0f0',
                  marginTop: 15,
                  paddingTop: 10,
                }}
              >
                <Button
                  type="primary"
                  onClick={onSave}
                  style={{marginRight: 15}}
                  disabled={resStatus.httpCode != '200'}
                >
                  保存
                </Button>
              </footer>
            </Card>
          </Col>
        </Row>
      )}
      {router.query.tab == '2' && (
        <Card>
          <Form
            form={sqlForm}
            onFinish={onTestSql}
            initialValues={{
              databaseType: '',
            }}
          >
            <Form.Item
              label="名称"
              name="name"
              rules={[{required: true, message: '请输入名称'}]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="数据库类型"
              name="databaseType"
              rules={[{required: true, message: '请选择数据库类型'}]}
            >
              <Select
                style={{width: '160px'}}
                onChange={(val) => changeDataType(val)}
              >
                <Select.Option value="MySQL">MySQL</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="主机"
              name="hostname"
              rules={[{required: true, message: '请输入主机'}]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="端口"
              name="port"
              rules={[{required: true, message: '请输入端口'}]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="数据库名"
              name="databaseName"
              rules={[{required: true, message: '请输入数据库名'}]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="用户名"
              name="userName"
              rules={[{required: true, message: '请输入用户名'}]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{required: true, message: '请输入密码'}]}
            >
              <Input.Password
                placeholder={'请输入密码'}
                size="large"
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <Button
              type="primary"
              style={{marginRight: 15}}
              htmlType="submit"
              loading={loading}
            >
              {testLink}
            </Button>
            <Button
              style={{marginRight: 15}}
              onClick={onSaveSql}
              disabled={!canSqlTest}
            >
              保存
            </Button>
          </Form>
        </Card>
      )}
      <SucessModal
        {...{
          visible,
          onHide: () => {
            location.href = `/data`
          },
        }}
      />
      {/* TODOjson模态框页面代码 */}
      <Modal
        title={calmelCaseTitle()}
        visible={isjsonModel}
        onOk={() => {
          jsonForm.submit()
        }}
        onCancel={handleJsonCancel}
        centered={true}
      >
        <Form form={jsonForm} onFinish={isJsonFun}>
          <Form.Item name="json" rules={[(e) => isJsons(e)]}>
            <TextArea
              value={textAreaValue}
              onChange={textAreaValueChange}
              autoSize={{minRows: 10, maxRows: 20}}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
