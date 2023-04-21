import {
  Form,
  message,
  Modal,
  Row,
  Col,
  Tabs,
  Button,
  Tooltip,
  Tag,
  Input,
} from 'antd'
import {useEffect, useState, useRef} from 'react'
import {ExclamationCircleOutlined} from '@ant-design/icons'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import FilterFieldInAllTableList from './FilterFieldInAllTableList'
// import BasedVariableList from './BasedVariableList'
import DecoSearchToBaseVariableTableList from './DecoSearchToBaseVariableTableList'
import {VARIABLETABS} from '~/utils/const'
import api from '~/api/risk'

const {TabPane} = Tabs
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

const basePage = {
  pageNo: 1,
  pageSize: 10,
}

const outPage = {
  pageNo: 1,
  pageSize: 10,
}

const matchPage = {
  pageNo: 1,
  pageSize: 10,
}

const deriPage = {
  pageNo: 1,
  pageSize: 10,
}

let values = {}
function RuleEditModal(props) {
  const {
    visible,
    onHide,
    activeKey,
    selectItem,
    variableTabs,
    onFinalValidateAndSubmit,
    selectIndex,
    isHaveName,
  } = props
  const [activeTab, setActiveTab] = useState('0')
  const [list, setList] = useState({})
  const [allList, setAllList] = useState([])
  let [selectedFieldList, setSelectedFieldList] = useState([])
  const [variableTabList, setVariableTabList] = useState(VARIABLETABS)
  const [testResult, setTestResult] = useState([])
  const [scriptSource, setScriptSource] = useState('')
  const [markId, setMarkId] = useState('1')
  const el = useRef()
  const [form] = Form.useForm()
  const [nameForm] = Form.useForm()
  // console.log('selectItem', selectItem)

  // *-----------------------------------------------------

  // const [baseValue, setBaseValue] = useState({keyword: null})
  // const [outValue, setOutValue] = useState({keyword: null})
  // const [matchValue, setMatchValue] = useState({keyword: null})

  // *-----------------------------------------------------

  useEffect(() => {
    fetchList()
  }, [])
  useEffect(() => {
    // console.log('nameForm.getFieldsValue()', nameForm.getFieldsValue())
    nameForm.setFieldsValue({
      chinaName:
        selectItem && selectItem.nodeName !== '请选择条件'
          ? selectItem.nodeName
          : null,
    })
  }, [visible])

  useEffect(() => {
    function fetchData() {
      getAllVariables()
    }
    activeKey != -1 && fetchData()
  }, [activeKey])

  useEffect(() => {
    basePage.pageNo = 1
    outPage.pageNo = 1
    matchPage.pageNo = 1
    deriPage.pageNo = 1
    form.resetFields()
    fetchList({})
    // visible && fetchList({})
  }, [activeTab])

  useEffect(() => {
    function fetchData() {
      if (allList.length) {
        setSelectedFieldListOnProps()
      }
    }
    visible && fetchData()
  }, [selectItem, visible, allList])

  useEffect(() => {
    function fetchData() {
      setVariableTabListOnProps()
      setScriptSource(selectItem.scriptSource || '')
    }
    visible && fetchData()
  }, [selectItem, visible])

  const setSelectedFieldListOnProps = () => {
    selectedFieldList = []
    Array.isArray(selectItem.fieldList) &&
      selectItem.fieldList.length &&
      selectItem.fieldList.forEach((one) => {
        allList.find((item) => {
          if (one == item.fieldColumnName) {
            selectedFieldList.push({
              fieldColumnName: one,
              fieldShowName: item.fieldShowName,
            })
          }
        })
      })
    setSelectedFieldList([...selectedFieldList])
  }

  const setVariableTabListOnProps = () => {
    setVariableTabList(variableTabs)
    if (variableTabs && variableTabs.length) {
      setActiveTab(String(variableTabs[0].key))
    }
  }
  const getAllVariables = async () => {
    let allVariables = []
    for (var i = 0; i < 4; i++) {
      try {
        const {
          data: {data, code},
        } = await api.fetch_risk_variable({
          pageNo: 1,
          pageSize: 20000,
          fieldGroupIds: null,
          productId: activeKey,
          fieldType: i,
        })
        if (code == 0) {
          allVariables = allVariables.concat(data.list)
          setAllList([...allVariables])
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
  const fetchList = async (values = {}, params = pageParams) => {
    // console.log('basePage', basePage)
    // console.log('outPage', outPage)
    // console.log('values2', values)
    if (activeTab === '0') {
      params = basePage
    } else if (activeTab === '1') {
      params = outPage
    } else if (activeTab === '2') {
      params = matchPage
    } else if (activeTab === '3') {
      params = deriPage
    }
    try {
      const {
        data: {data, code},
      } = await api.fetch_risk_variable({
        ...params,
        ...values,
        productId: activeKey,
        fieldType: activeTab,
      })
      if (code == 0) {
        setList({...data})
      }
    } catch (err) {
      console.log(err)
    }
  }

  const changeTab = async (key, showError) => {
    setActiveTab(key)
    form.resetFields()
  }

  const onSearch = async (value) => {
    values = value
    pageParams.pageNo = 1
    if (activeTab === '0') {
      basePage.pageNo = 1
      // setBaseValue({...values})
    } else if (activeTab === '1') {
      outPage.pageNo = 1
      // setOutValue({...values})
    } else if (activeTab === '2') {
      matchPage.pageNo = 1
      // setMatchValue({...values})
    } else if (activeTab === '3') {
      deriPage.pageNo = 1
      // setMatchValue({...values})
    }
    fetchList({...values})
  }
  const onPage = async (params) => {
    let values = form.getFieldValue()
    // console.log('values22222', values2222)
    fetchList(values, params)
  }

  const renderTooltip = () => (
    <div>
      <p>== : 用于比较两端的值是否相等</p>
      <p>&& : 逻辑运算符“且”，两端需为判断语句</p>
      <p>|| : 逻辑运算符“或”，两端需为判断语句</p>
      <p>+ : 数学运算符“加”，两端需为整型/浮点</p>
      <p>- : 数学运算符“减”，两端需为整型/浮点</p>
      <p>* : 数学运算符“乘”，两端需为整型/浮点</p>
      <p>/ : 数学运算符“除”，两端需为整型/浮点，分母不可为0</p>
      <p>( ) : 优先级运算符，可层级套用</p>
      <p> > : 数学运算符“大于”，两端需为整型/浮点</p>
      <p> &lt; : 数学运算符“小于”，两端需为整型/浮点</p>
      <p> >= : 数学运算符“大于等于”，两端需为整型/浮点</p>
      <p> &lt;= : 数学运算符“小于等于”，两端需为整型/浮点</p>
      <p>Math.max( , ) : 返回(,) 中两个浮点/整型数值中较大的一个值</p>
      <p>Math.min( , ) : 返回(,) 中两个浮点/整型数值中较小的一个值</p>
      <p>Math.round( ) : 将( )中的数值进行四舍五入的取整</p>
    </div>
  )
  const onCopy = () => {
    message.success('已复制至剪切板')
  }
  const onImportToTextArea = (field) => {
    let newStr = scriptSource == null ? '' : scriptSource
    newStr =
      newStr.substring(0, el.current.selectionStart) +
      ('${' + field.fieldColumnName + '}') +
      newStr.substring(el.current.selectionEnd)
    setScriptSource(newStr)
  }
  const onTest = async () => {
    const fieldMap = {}
    if (selectedFieldList.length) {
      for (var i = 0; i < selectedFieldList.length; i++) {
        if (
          selectedFieldList[i].value == undefined ||
          selectedFieldList[i].value == ''
        ) {
          message.error('请检查有未赋值变量')
          return false
        }
        fieldMap[selectedFieldList[i].fieldColumnName] =
          selectedFieldList[i].value == undefined
            ? ''
            : selectedFieldList[i].value
      }
    }
    setTestResult('运算中...')
    try {
      const {
        data: {data, code},
      } = await api.test_risk_field({
        scriptSource: scriptSource,
        fieldMap: fieldMap,
        productId: activeKey,
      })
      if (code == 0) {
        {
          typeof data === 'object'
            ? JSON.stringify(setTestResult(data))
            : setTestResult(data + '')
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  const onSave = async () => {
    if (!scriptSource) {
      message.error('请检查脚本未填写')
      return
    }

    const values = await nameForm.validateFields()

    let refVarIds = []
    if (selectItem.scoreRuleGroupCode && selectIndex == 2) {
      refVarIds.push(selectItem.scoreRuleGroupCode)
    }
    for (let field of selectedFieldList) {
      refVarIds.push(field.fieldColumnName)
    }

    onFinalValidateAndSubmit({
      scriptSource,
      fieldList: refVarIds,
      nodeName: values.chinaName,
    })
  }
  const onRowConfig = (record) => {
    for (let field of selectedFieldList) {
      if (record.fieldColumnName == field.fieldColumnName) {
        message.error('变量重复选择')
        return false
      }
    }
    selectedFieldList.push(record)
    setSelectedFieldList([...selectedFieldList])
  }

  return (
    <Modal
      title="编辑"
      visible={visible}
      onCancel={onHide}
      cancelText="取消"
      okText="确定"
      width={'90%'}
      footer={null}
      maskClosable={false}
      destroyOnClose
    >
      <Row gutter={[18, 0]}>
        <Col span={11}>
          <Tabs
            activeKey={activeTab}
            onTabClick={(key) => {
              console.log('key', key)
              changeTab(key, false)
            }}
          >
            {variableTabList && variableTabList.length
              ? variableTabList.map((item) => (
                  <TabPane
                    tab={item.name}
                    key={item.key}
                    forceRender={true}
                  ></TabPane>
                ))
              : null}
          </Tabs>
          {activeTab === '0' ? (
            <DecoSearchToBaseVariableTableList
              {...{
                onSearch,
                list,
                onPage,
                // pageParams,
                selectedFieldList,
                setSelectedFieldList,
                onRowConfig,
                form,
                markId,
                activeKey,
              }}
              pageParams={basePage}
              // inputDefaultValue={{...baseValue}}
            />
          ) : null}
          {activeTab === '1' ? (
            <DecoSearchToBaseVariableTableList
              {...{
                onSearch,
                list,
                onPage,
                // pageParams,
                selectedFieldList,
                setSelectedFieldList,
                onRowConfig,
                form,
                markId,
                activeKey,
              }}
              pageParams={outPage}
              // inputDefaultValue={{...outValue}}
            />
          ) : null}
          {activeTab === '2' ? (
            <DecoSearchToBaseVariableTableList
              {...{
                onSearch,
                list,
                onPage,
                // pageParams,
                selectedFieldList,
                setSelectedFieldList,
                onRowConfig,
                form,
                markId,
                activeKey,
              }}
              pageParams={matchPage}
              // inputDefaultValue={{...matchValue}}
            />
          ) : null}
          {activeTab === '3' ? (
            <DecoSearchToBaseVariableTableList
              {...{
                onSearch,
                list,
                onPage,
                // pageParams,
                selectedFieldList,
                setSelectedFieldList,
                onRowConfig,
                form,
                markId,
                activeKey,
              }}
              pageParams={deriPage}
            />
          ) : null}
        </Col>
        <Col span={13}>
          <Row gutter={[12, 8]}>
            <Col span={24}>
              {selectItem
                ? selectItem.scoreRuleGroupCode &&
                  selectIndex == 2 && (
                    <Tag
                      style={{cursor: 'pointer'}}
                      color="blue"
                      onClick={() =>
                        onImportToTextArea({
                          fieldColumnName: selectItem.scoreRuleGroupCode,
                        })
                      }
                    >
                      {selectItem.scoreRuleGroupCode}
                    </Tag>
                  )
                : null}
            </Col>
          </Row>

          <Row gutter={[12, 8]} style={{height: '180px'}}>
            <Col span={21}>
              <FilterFieldInAllTableList
                {...{
                  selectedFieldList,
                  setSelectedFieldList,
                  onImportToTextArea,
                }}
              />
            </Col>
            <Col span={2}>
              <Button style={{marginBottom: 15}} onClick={onHide}>
                关闭
              </Button>
              <Button style={{marginBottom: 15}} onClick={onTest}>
                调试
              </Button>
              <Button
                style={{marginBottom: 15}}
                onClick={onSave}
                type="primary"
              >
                保存
              </Button>
            </Col>
          </Row>
          <Row gutter={[0, 8]}>
            <Col span={24}>
              运算符操作指引
              <Tooltip
                overlayStyle={{
                  wordBreak: 'break-all',
                  width: '400px',
                  maxWidth: '400px',
                }}
                title={renderTooltip()}
              >
                <ExclamationCircleOutlined style={{cursor: 'pointer'}} />
              </Tooltip>
            </Col>
          </Row>
          <Row gutter={[0, 8]}>
            <Col span={24}>
              <textarea
                ref={el}
                style={{
                  width: '100%',
                  height: '180px',
                  border: '1px #bfbdbd solid',
                }}
                value={scriptSource}
                onChange={(e) => {
                  setScriptSource(e.target.value)
                }}
                placeholder="示例: ${变量1} > 3 && ${变量2} <=3"
              />
            </Col>
          </Row>

          {isHaveName ? (
            <Form autoComplete="off" form={nameForm} name="nameForm">
              <Form.Item
                label="中文名称"
                name="chinaName"
                rules={[{required: true, message: '请先输入中文名称'}]}
              >
                <Input />
              </Form.Item>
            </Form>
          ) : null}
          <div style={{padding: '5px 0', position: 'relative'}}>
            编译结果：
            <CopyToClipboard text={testResult} onCopy={onCopy}>
              <span style={{position: 'absolute', right: 0, top: 0}}>复制</span>
            </CopyToClipboard>
          </div>
          <div
            className="varyLabels"
            style={{
              height: '120px',
              height: 'auto !important',
              minHeight: '120px',
              display: 'inline-block',
              width: '100%',
              background: '#ccc',
            }}
          >
            {typeof testResult === 'object'
              ? JSON.stringify(testResult)
              : testResult}
          </div>
        </Col>
      </Row>
    </Modal>
  )
}

export default RuleEditModal
