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
  Space,
} from 'antd'
import {useEffect, useState, useRef} from 'react'
import {ExclamationCircleOutlined} from '@ant-design/icons'
import Router, {withRouter} from 'next/router'
import copy from 'copy-to-clipboard'
import fetch from '~/utils/fetch'
import RuleSearchTableList from '../components/RuleSearchTableList'
import FilterFieldTableList from '../components/FilterFieldTableList'

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

function RuleEditModal(props) {
  const {onFinalValidateAndSubmit, onModelVisible} = props
  const [selectItem, setSelectItem] = useState({})

  const [scriptSource, setScriptSource] = useState(selectItem.extend)
  const [testResult, setTestResult] = useState('')
  const el = useRef()
  const [selectedFieldList, setSelectedFieldList] = useState([]) //选中变量列表

  const [visible, setVisible] = useState(false)

  const initSelectedFields = async (extend) => {
    if (extend == null || extend == '') {
      setSelectedFieldList([])
      return
    }
    const {params} = JSON.parse(extend)
    const ids = params.map((item) => {
      return item.id
    })
    const {
      data: {data, code},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getdetails',
      [{ids}],
    )

    if (code == 0) {
      setSelectedFieldList(data)
    }
  }
  const initScript = (extend) => {
    if (extend == null || extend == '') {
      setScriptSource('')
      return
    }
    const {script} = JSON.parse(extend)
    setScriptSource(script)
  }

  useEffect(() => {
    if (visible) {
      initSelectedFields(selectItem.extend)
      initScript(selectItem.extend)
    }
  }, [visible])

  useEffect(() => {
    onModelVisible(setVisible, setSelectItem)
  }, [])

  const onTest = async () => {
    const params = []
    if (selectedFieldList.length) {
      for (var i = 0; i < selectedFieldList.length; i++) {
        if (
          selectedFieldList[i].value == undefined ||
          selectedFieldList[i].value == ''
        ) {
          message.error('请检查有未赋值变量')
          return false
        }

        params.push({
          key: `${selectedFieldList[i].id}`,
          value: selectedFieldList[i].value,
        })
      }
    }
    setTestResult('运算中...')
    try {
      const {
        data: {data, code},
      } = await fetch(
        'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.runscript',
        [{params, scriptData: scriptSource}],
      )
      if (code == 0) {
        setTestResult(`${JSON.stringify(data)}`)
      } else {
        setTestResult('运算出错了')
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

    const ids = []
    for (let field of selectedFieldList) {
      ids.push({id: field.id})
    }
    // console.log('ids', ids);
    setVisible(false)
    const extend = JSON.stringify({script: scriptSource, params: ids})
    selectItem.extend = extend

    onFinalValidateAndSubmit(selectItem)
  }
  const onCopy = () => {
    copy(testResult)
    message.info('已复制到粘贴板')
  }

  //左边指标列表点击回调
  const onRowClick = (record) => {
    console.log('列表选中项', record)
    for (let field of selectedFieldList) {
      if (record.id == field.id) {
        message.error('变量重复选择')
        return false
      }
    }
    selectedFieldList.push(record)
    setSelectedFieldList([...selectedFieldList])
  }

  const onImportToTextArea = (field) => {
    let newStr = scriptSource == null ? '' : scriptSource
    newStr =
      newStr.substring(0, el.current.selectionStart) +
      field.name +
      newStr.substring(el.current.selectionEnd)
    setScriptSource(newStr)
  }

  return (
    <Modal
      title="编辑"
      maskClosable={false}
      visible={visible}
      onCancel={() => {
        setVisible(false)
      }}
      centered={true}
      cancelText="取消"
      okText="确定"
      width={'90%'}
      footer={null}
    >
      <Row gutter={[18, 0]}>
        <Col span={12}>
          <Button type="primary" style={{marginRight: 15, marginBottom: 20}}>
            基础指标
          </Button>
          <RuleSearchTableList {...{onRowClick}} />
        </Col>
        <Col span={12}>
          <Row gutter={[12, 8]}>
            <Col span={24}>
              <FilterFieldTableList
                {...{
                  selectedFieldList,
                  setSelectedFieldList,
                  onImportToTextArea,
                }}
              />
            </Col>
          </Row>

          <Row gutter={[12, 8]} style={{height: '100px'}}></Row>
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
                  height: '300px',
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
          <div style={{padding: '5px 0', position: 'relative'}}>
            编译结果：
            <Button
              type="link"
              onClick={onCopy}
              style={{position: 'absolute', right: 0, top: 0}}
            >
              复制
            </Button>
          </div>
          <Row gutter={[12, 8]}>
            <div
              className="varyLabels"
              style={{
                height: '220px',
                display: 'inline-block',
                width: '100%',
                background: '#ccc',
              }}
            >
              {testResult}
            </div>
          </Row>

          <Row gutter={[12, 8]} style={{height: '30px'}}></Row>
          <Row gutter={[12, 8]} style={{height: '180px'}}>
            <Col span={19}></Col>
            <Col span={5}>
              <Space>
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
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  )
}

export default withRouter(RuleEditModal)
