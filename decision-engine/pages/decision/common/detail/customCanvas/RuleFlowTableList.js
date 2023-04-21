import React, {useEffect, useState} from 'react'
import _ from 'lodash'
import BodyWidget from './components/BodyWidget'
import RuleFlowList from './components/RuleFlowList'
import useEngineModel from './hooks/useEngineModel'
import {Button, message, Form, Divider, Row, Col, Input} from 'antd'
import api from '~/api/risk'
import Router, {withRouter} from 'next/router'
import {FLOWCONFIG, VARIABLETABS} from '~/utils/const'

let CustomNodeModelNew
let DefaultDiagramStateNew

export const ThemeContext = React.createContext({})

const RuleSetTableList = (props) => {
  const {
    list,
    id,
    activeCategoryKey,
    productId,
    partialPro,
    form,
    updateTime,
  } = props
  const [diagramEngine, activeModel] = useEngineModel()
  const [customNodeFactoryNew, setCustomNodeFactoryNew] = useState(null)

  useEffect(() => {
    ;(async function () {
      // Factory
      const CustomNodeFactory = await import('./custom/CustomNodeFactory').then(
        (module) => module.default,
      )
      // NodeModel
      const CustomNodeModel = await import('./custom/CustomNodeModel').then(
        (module) => module.default,
      )
      // DefaultDiagramState
      const DefaultDiagramState = await import(
        '@projectstorm/react-diagrams'
      ).then((module) => module.DefaultDiagramState)

      setCustomNodeFactoryNew(new CustomNodeFactory())
      CustomNodeModelNew = CustomNodeModel
      DefaultDiagramStateNew = DefaultDiagramState
    })()
  }, [])

  // 服务端交互：初始化 canvas 数据，若有节点，则自动生成。
  useEffect(() => {
    // 做一些 model 和 engine 的配置
    if (activeModel && customNodeFactoryNew && DefaultDiagramStateNew) {
      // 整体比例
      activeModel.setZoomLevel(70)
      // 自动吸附
      activeModel.setGridSize(10)
      // 限制 line 圆点
      diagramEngine.setMaxNumberPointsPerLink(0)
      // 自动清除不完整的 line
      const state = diagramEngine.getStateMachine().getCurrentState()
      if (state instanceof DefaultDiagramStateNew) {
        state.dragNewLink.config.allowLooseLinks = false
      }
      // 注册自定义 Factory
      diagramEngine.getNodeFactories().registerFactory(customNodeFactoryNew)
    }
    if (activeModel && diagramEngine && CustomNodeModelNew && list) {
      newModel(list)
    }
  }, [list, activeModel, customNodeFactoryNew])

  // * --------------------------------------------------------------

  // 服务端交互：自动生成 node

  const newModel = (newdata) => {
    generateNodes([newdata.rootNode], null)
    diagramEngine.setModel(activeModel)
    // 配置 canvas 画布（生成 node 的坐标、比例...）
    canvasPosition(activeModel.getNodes())
  }

  // 服务端交互：设置 canvas 初始可视区域
  const canvasPosition = (nodes) => {
    // console.log('nodes', nodes);
    let minX = 0
    let minY = 0
    nodes.map((node) => {
      if (minX > node.data.x) {
        minX = node.data.x
      }
      if (minY > node.data.y) {
        minY = node.data.y
      }
    })
    activeModel.setOffset(-minX / (4 / 3), -minY + 50)
  }

  // 服务端交互：获取需要的 node 和 link，并将二者均逐一添加进 model 中。
  const generateNodes = (nodes, prevNode) => {
    // nodes：[newdata.rootNode] 入口 nodes，通过 childrenNodeList 属性 逐层深入
    nodes.forEach((node, i) => {
      if (!node || !node.type) {
        return
      }
      let findNodeType = FLOWCONFIG.find(
        (item) => item.referenceType == node.referenceType,
      )
      let color = findNodeType ? findNodeType.color : '#E5F4FF'

      // console.log('name, color', node.nodeName, color)

      let nodeModel = new CustomNodeModelNew({
        name: findNodeType.name,
        color: color,
      })

      // 问题在这，只能取到 data 中，旧的 坐标。
      nodeModel.setPosition(node.x, node.y)
      nodeModel.data = node
      activeModel.addNode(nodeModel)

      // Link
      let portIn

      if (node.referenceType !== 0) {
        portIn = nodeModel.ports.in
      }

      // line 连接
      if (prevNode !== null && portIn !== null) {
        let portOut = findNodePort(prevNode, false)
        let link = portOut.link(portIn)
        activeModel.addLink(link)
      }

      // 若 node.childrenNodeList 还有内容。则代表还有子节点。
      // 递归执行 generateNodes(node.childrenNodeList, nodeModel)
      if (
        Array.isArray(node.childrenNodeList) &&
        node.childrenNodeList.length > 0
      ) {
        generateNodes(node.childrenNodeList, nodeModel)
      }
    })

    // console.log(diagramEngine, activeModel);
  }

  // 服务端交互: 判断 node 的 port，是需要 in 的 port 还是 out 的 port
  const findNodePort = (node, isIn = true) => {
    // node：含有 data 属性的 node，可渲染。也可将其中 data 抽离传给服务端保存。
    let ports = node.ports
    let port = null
    // _.isEmpty()返回 false，代表有 可枚举内容。
    if (!_.isEmpty(ports)) {
      Object.keys(ports).forEach((k) => {
        if (ports[k].options.in === isIn) {
          return (port = ports[k])
        }
      })
    }
    return port
  }

  // 测试运行，简单的路由跳转
  const onTestRun = () => {
    let url = `/decision/edit/form?page=test&category=${activeCategoryKey}&productId=${productId}&id=${id}`
    Router.push(url)
  }

  // 服务端交互：判断 决策流 是否含有 “开始” 和 “结束” node，返回 true or false。
  const findStartAndEnd = (nodes, referenceType) => {
    let find = false
    nodes.forEach((node, index) => {
      if (node.referenceType == referenceType) {
        find = true
      }
    })
    return find
  }

  // 服务端交互：触发入口，点击 “保存” 触发
  const onSaveFlowFinally = async () => {
    try {
      const values = await form.validateFields()
      console.log('values', values)
      const nodes = serializeNode()
      // 判断 决策流 是否含有 “开始” 和 “结束” node，形成闭环。
      if (!findStartAndEnd(nodes, 0)) {
        message.error('尚未添加开始节点，请检查。')
        return
      }
      if (!findStartAndEnd(nodes, 99)) {
        message.error('尚未添加结束节点，请检查。')
        return
      }
      // postData
      let postData = {
        flowId: id == 'new' ? null : id,
        flowDetailId: list ? list.flowDetailId : null,
        productId,
        nodeArray: nodes,
        flowName: values.flowName,
        description: values.description,
        flowCode: values.flowCode,
      }
      console.log('postData', postData)
      const {
        data: {data, code},
      } = await api.save_risk_flow_detail(postData)
      if (code == 0) {
        message.success('保存成功')
        id == 'new' && Router.back()
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 服务端交互：序列化 node，处理成满足需求的数据结构。
  const serializeNode = () => {
    const result = []
    const nodes = activeModel.getNodes()
    // console.log("origin-nodes", nodes)
    const keys = Object.keys(nodes)
    keys.forEach((key, i) => {
      let node = nodes[key]
      let data = _.clone(node.data)
      data.x = node.getX()
      data.y = node.getY()
      //   delete data.childrenNodeList

      // parent
      let parentNodes = findNodes(node, true)
      if (parentNodes.length > 0) {
        data.parentNodes = parentNodes
      }

      //child
      let childNodes = findNodes(node, false)
      if (childNodes.length > 0) {
        data.childNodes = childNodes
      }

      result.push(data)
    })
    return result
  }

  // 服务端交互：获取 node 的 父子节点列表，isIn：为 true，代表检索父节点；为 false，代表检索子节点。
  const findNodes = (node, isIn) => {
    let nodes = []
    findLinkKey(
      node,
      (link) => {
        nodes = nodes.concat(findNodeByIn(link, node.options.id, !isIn))
      },
      isIn,
    )
    return nodes
  }

  // 服务端交互：将每一个 link 作为参数，传给 cb 回调函数进行执行。
  const findLinkKey = (node, cb, isIn = false) => {
    let ports = node.ports
    if (!_.isEmpty(ports)) {
      Object.keys(ports).forEach((k) => {
        let port = ports[k]
        // 判断是 父节点 还是 子节点
        if (port.reportedPosition === true && port.options.in === isIn) {
          let links = port.links
          if (!_.isEmpty(links)) {
            Object.keys(links).forEach(cb)
          }
        }
      })
    }
  }

  // 服务端交互：获取 port 之间匹配的 node。
  const findNodeByIn = (link, id, isIn = false) => {
    let result = []
    const nodes = activeModel.getNodes()
    const keys = Object.keys(nodes)
    keys.forEach((key, i) => {
      let node = nodes[key]
      // is not self
      if (node.id !== id) {
        findLinkKey(
          node,
          (l) => {
            // console.log('link-l', link, l)
            if (link === l) {
              let data = _.clone(node.data)
              data.x = node.x
              data.y = node.y
              delete data.childrenNodeList
              result.push(data)
            }
          },
          isIn,
        )
      }
    })
    return result
  }

  // * --------------------------------------------------------------

  // 拖拉拽部分

  // * --------------------------------------------------------------

  // 主体JSX
  return (
    <>
      {/* 表单列表 */}
      {!partialPro && (
        <div className="searchForm" style={{marginBottom: '10px'}}>
          <Form
            autoComplete="off"
            form={form}
            name="form"
            layout="inline"
            initialValues={{}}
          >
            <Form.Item
              label="编号"
              name="flowCode"
              rules={[{required: true, message: '请输入编号'}]}
            >
              <Input placeholder="请输入" disabled={id != 'new'} />
            </Form.Item>
            <Form.Item
              label="中文名称"
              name="flowName"
              rules={[{required: true, message: '请输入名称'}]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="说明"
              name="description"
              rules={[{required: true, message: '请输入说明'}]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Button
              type="primary"
              style={{marginRight: 15}}
              onClick={onTestRun}
              disabled={id == 'new'}
            >
              测试运行
            </Button>
            <Button
              type="primary"
              onClick={onSaveFlowFinally}
              style={{background: '#fa8c16', borderColor: '#fa8c16'}}
            >
              保存
            </Button>
          </Form>
        </div>
      )}
      <div style={{position: 'relative'}}>
        {/* 拖拽列表 */}
        {!partialPro && <RuleFlowList />}
        {/* canvas 画布区域 */}
        <ThemeContext.Provider value={partialPro}>
          {diagramEngine && (
            <BodyWidget
              model={activeModel}
              engine={diagramEngine}
              {...props}
              canvasPosition={canvasPosition}
            />
          )}
        </ThemeContext.Provider>
      </div>
    </>
  )
}

export default RuleSetTableList
