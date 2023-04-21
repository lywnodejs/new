import React, {useState, useEffect} from 'react'
import * as _ from 'lodash'
import dynamic from 'next/dynamic'
import {FLOWCONFIG, VARIABLETABS} from '~/utils/const'
import {
  findApiByKey,
  findKeyByName,
  findFieldByKey,
} from '../../../mapActionToApi'
import ScriptSourceDetailModal from '../../../ScriptSourceDetailModal'
import RuleFlowStrategyModal from './RuleFlowStrategyModal'
import RuleEditModal from '../../../RuleEditModal'
import api from '~/api/risk'
import {Button} from 'antd'
import {
  CompressOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'

// cavas 画布组件
const CanvasWidget = dynamic(
  () =>
    import('@projectstorm/react-canvas-core').then(
      (module) => module.CanvasWidget,
    ),
  {ssr: false},
)

let NodeModel
let values = {}

const BodyWidget = (props) => {
  const {
    model,
    engine,
    list,
    id,
    activeCategoryKey,
    productId,
    partialPro,
    form,
    updateTime,
    canvasPosition,
  } = props

  const [activeNode, setActiveNode] = useState(null)
  const [selectStrategyVisible, setSelectStrategyVisible] = useState(false)
  const [category, setCategory] = useState('-1')
  const [strategyList, setStrategyList] = useState([])
  const [scriptSourceVisible, setScriptSourceVisible] = useState(false)
  const [ruleEditVisible, setRuleEditVisible] = useState(false)
  const [variableTabs, setVariableTabs] = useState(VARIABLETABS.slice(0, 3))
  const [zoomLevel, setZoomLevel] = useState(70)

  useEffect(() => {
    // 禁用 触摸板 双指事件
    const canvasBox = document.querySelector('.canvasBox')
    canvasBox.addEventListener(
      'wheel',
      (event) => {
        // if (event.deltaX % 1 !== 0 || event.deltaY % 1 !== 0) {
        //   // console.log('在放大或缩放')
        //   event.preventDefault()
        // }
        event.preventDefault()
      },
      {
        passive: false,
      },
    )
  })

  // 组件加载时，异步调用 CustomNodeModel
  useEffect(() => {
    ;(async function () {
      const CustomNodeModel = await import('../custom/CustomNodeModel').then(
        (module) => module.default,
      )
      NodeModel = CustomNodeModel
    })()
  }, [])

  // 拖拉拽：定义各个组件
  const newNodeByType = (data, node) => {
    // 判断 非条件 node
    if (typeof NodeModel == 'function' && data.referenceType !== null) {
      let findNodeType = FLOWCONFIG.find(
        (item) => item.referenceType == data.referenceType,
      )
      // console.log('findNodeType', findNodeType)
      let nodeName = findNodeType ? findNodeType.nodeName : null
      let color = findNodeType ? findNodeType.color : '#E5F4FF'
      node = new NodeModel({
        name: findNodeType.name,
        color: color,
      })
      node.data = {
        nodeName: nodeName,
        nodeNumber: node.options.id,
        referenceId: '',
        referenceType: data.referenceType,
        type: data.type,
      }
    }
    // 判断 条件 node
    else if (data.type === 'REF') {
      node = new NodeModel({
        name: '条件',
        color: '#855000',
      })
      node.data = {
        fieldList: [],
        nodeName: '请选择条件',
        nodeNumber: node.options.id,
        scriptSource: '',
        type: data.type,
      }
    }
    return node
  }

  // 拖拉拽：将配置好的 Node ，加入 model 中
  const addNode = (event, node) => {
    // 1. 获取鼠标松开时的 node 坐标，返回对象：Point{x: number, y: number}
    let point = engine.getRelativeMousePoint(event)
    node.setPosition(point)

    // 2. 将定义好的 node，塞进 model 里面
    model.addNode(node)

    engine.setModel(model)
  }

  // *---------------------------------------------------------

  // 获取 “非条件组件” 规则集列表，弹出框选择所用，核心：setStrategyList(data.list)
  const fetchList = async (category, values = {}) => {
    try {
      let postData = {
        pageNo: 1,
        pageSize: 10000,
        moduleType: 'all',
        productId: productId,
        fieldType: category,
        partialPro: 1,
        ...values,
      }
      const {
        data: {data, code},
      } = await findApiByKey(+category, postData, 'fetch')()

      if (code == 0) {
        // console.log('data.list', data.list)
        setStrategyList(data.list)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // drop部分: node 组件拓展弹出框，生产模式也已考虑进
  const editNode = (node) => {
    const data = node.data

    if (data.type == 'EXEC') {
      if (partialPro) {
        return
      }
      if (data.referenceType !== 0 && data.referenceType !== 99) {
        let findNodeType = FLOWCONFIG.find(
          (item) => item.referenceType == data.referenceType,
        )
        // categoryKey：key: number
        let categoryKey = findKeyByName(findNodeType.name)
        // 弹出框 visible，弹出框分类（规则集、评分卡...）
        setSelectStrategyVisible(true)
        setCategory(categoryKey)
        // 获取拓展框的数据
        fetchList(categoryKey)
      }
    } else if (data.type == 'REF') {
      console.log('inter')
      if (partialPro) {
        // 生成环境，弹出框内容： “已选择的规则”
        setScriptSourceVisible(true)
        return
      }
      // 弹出框 visible
      setRuleEditVisible(true)
    }
  }

  // 拖拉拽：创建 Node 流程入口
  const createNode = (event) => {
    // 获取数据：
    // 1. data 类型(用JSON.parse() 转换成对象)
    let data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'))
    // 2. 初始化一个空对象(之后将一个自定义的 node 塞进去)
    let node = newNodeByType(data, null)
    // 3. 生成 node (核心：此处定义生成 node 逻辑)
    addNode(event, node)
    setActiveNode(node)
    // 4. 拖拽完毕，组件拓展框（规则集、条件集...）初次要默认弹出
    editNode(node)
  }

  // drop部分：鼠标移出 canvas 区域，取消 node 选中状态，防止误删
  const cancelSelected = () => {
    if (!selectStrategyVisible && !ruleEditVisible) {
      let selectElements = model.getSelectedEntities()
      // console.log('selectElements', selectElements)
      _.forEach(selectElements, (element) => {
        element.setSelected(false)
      })
    }
  }

  // drop部分：双击弹出拓展框
  const doubleClick = () => {
    let selectElements = model.getSelectedEntities()
    _.forEach(selectElements, (element) => {
      setActiveNode(element)
      // console.log('1.取消选中状态；2.触发editNode(node)')
      editNode(element)
    })
  }

  // 条件组件 “点击保存” 触发，将所需数据 post 至 服务端。
  const onFinalValidateAndSubmit = async (params) => {
    const {scriptSource, fieldList, nodeName} = params
    try {
      const {
        data: {data, code},
      } = await api.validate_risk_script({
        scriptSource,
        fieldList,
        productId: productId,
      })
      if (code == 0) {
        activeNode.data = Object.assign(activeNode.data || {}, {
          nodeName: nodeName,
          scriptSource,
          fieldList,
        })
        activeNode.setSelected(false)
        setRuleEditVisible(false)
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  // 非条件组件 弹出框，search 特定类型的 规则 list
  const onSearch = async (value, category) => {
    values = value
    fetchList(category, {
      ...values,
    })
  }

  // drop 部分：非条件组件 弹出框 选择完规则后，点击保存 触发
  // 1. 将 规则 id 存入 data 中，为 referenceId 属性的 value
  // 2. 关闭 弹出框
  const onSave = async (values) => {
    try {
      const {strategyId} = values
      activeNode.data.nodeName = findNodeNameBytrategyId(strategyId)
      activeNode.data = Object.assign(activeNode.data || {}, {
        nodeName: activeNode.data.nodeName,
        referenceId: strategyId,
      })
      activeNode.setSelected(false)
      setSelectStrategyVisible(false)
    } catch (error) {
      console.log('Failed:', errorInfo)
    }
  }

  // 规则集查询的约束条件
  const findNodeNameBytrategyId = (id) => {
    for (var i = 0; i < strategyList.length; i++) {
      if (strategyList[i].id == id) {
        return strategyList[i][findFieldByKey(+category, 'name')]
      }
    }
  }

  // 获取当前时间，生产环境展示所用
  const nowDate = () => {
    function Appendzero(obj) {
      if (obj < 10) return '0' + '' + obj
      else return obj
    }

    let nowDate = new Date()

    let year = nowDate.getFullYear()
    let mouth = Appendzero(nowDate.getMonth() + 1)
    let day = Appendzero(nowDate.getDate())
    let hour = Appendzero(nowDate.getHours())
    let minutes = Appendzero(nowDate.getMinutes())
    let seconds = Appendzero(nowDate.getSeconds())

    let formatNowDay = [year, mouth, day].join('-')
    let formatNowSecond = [hour, minutes, seconds].join(':')

    let formatNowDate = [formatNowDay, formatNowSecond].join(' ')

    return formatNowDate
  }

  // 元素

  return (
    <div className="flow" style={{position: 'relative'}}>
      <div className="flow-box">
        {/* 提示文字 + 复位 */}
        <div className="flow-tool-top">
          <div>
            {partialPro ? (
              <p style={{fontSize: '12px', color: '#ccc', marginTop: '5px'}}>
                转化数据产生的日前范围：{updateTime} ~ {nowDate()}
              </p>
            ) : null}
          </div>
          <div className="right-tool-box">
            {/* 全局图 */}
            <div
              className="flow-cover"
              onClick={() => {
                engine.zoomToFitSelectedNodes(50)
                let zoomLevel = Math.floor(model.getZoomLevel())
                let zoomFit = 80 / (zoomLevel / 100)
                engine.zoomToFitSelectedNodes(zoomFit < 80 ? 80 : zoomFit)
                // 设置画布 zoomLevel
                model.setZoomLevel(zoomLevel)
                // 显示百分比
                setZoomLevel(zoomLevel)
                engine.setModel(model)
              }}
            >
              <CompressOutlined className="flow-cover-btn" />
            </div>
            {/* 放大缩小 */}
            <div className="flow-zoom">
              <div
                className="zoom-reduce"
                onClick={() => {
                  let zoomLevel = Math.floor(model.getZoomLevel())
                  if (zoomLevel < 20) {
                    model.setZoomLevel(10)
                    setZoomLevel(10)
                  } else {
                    model.setZoomLevel(zoomLevel - 10)
                    setZoomLevel(zoomLevel - 10)
                  }
                  engine.setModel(model)
                }}
                style={{
                  zIndex: '1000',
                }}
              >
                <ZoomOutOutlined />
              </div>
              <div className="zoom-percent">
                <p>{zoomLevel ? zoomLevel + '%' : null}</p>
              </div>
              <div
                className="zoom-inc"
                onClick={() => {
                  let zoomLevel = Math.floor(model.getZoomLevel())
                  model.setZoomLevel(zoomLevel + 10)
                  setZoomLevel(zoomLevel + 10)
                  engine.setModel(model)
                }}
                style={{
                  zIndex: '1000',
                }}
              >
                <ZoomInOutlined />
              </div>
            </div>
          </div>
        </div>
        <div className="flow-right-content">
          <div
            className="canvasBox"
            onDrop={(event) => {
              createNode(event)
            }}
            onDragOver={(event) => {
              // console.log('进入有效区域，可松开鼠标，能起效')
              event.preventDefault()
            }}
            onDoubleClick={() => {
              doubleClick()
            }}
            onMouseLeave={() => {
              // console.log('出有效区域，自动清除所有 select 状态')
              cancelSelected()
            }}
            style={{
              height: `${
                // partialPro ? 'calc(100vh - 180px)' : 'calc(100vh - 320px)'
                `calc(100vh - 70px)`
              }`,
            }}
          >
            <CanvasWidget
              onWheel={(event) => {
                console.log('event', event)
              }}
              className="srd-demo-canvas"
              engine={engine}
            />
          </div>
        </div>
      </div>
      {/* 非条件组件 拓展弹出框 */}
      <RuleFlowStrategyModal
        selectItem={activeNode ? activeNode.data : null}
        {...{
          category,
          activeCategoryKey,
          strategyList,
          visible: selectStrategyVisible,
          onHide: () => setSelectStrategyVisible(false),
          onSearch: onSearch,
          onSave: onSave,
        }}
      />
      {/* 条件组件 拓展弹出框 */}
      <RuleEditModal
        selectItem={activeNode ? activeNode.data : null}
        {...{
          variableTabs,
          activeKey: productId,
          visible: ruleEditVisible,
          onHide: () => setRuleEditVisible(false),
          onFinalValidateAndSubmit: onFinalValidateAndSubmit,
          isHaveName: true,
        }}
      />
      {/* 生产模式下的 条件组件 拓展弹出框 */}
      <ScriptSourceDetailModal
        {...{
          scriptSource: activeNode && activeNode.data.scriptSource,
          visible: scriptSourceVisible,
          onHide: () => setScriptSourceVisible(false),
        }}
      />
    </div>
  )
}

export default BodyWidget
