import React, {useEffect, useState} from 'react'
import _ from 'lodash'
import BodyWidget from './components/BodyWidget'
import useEngineModel from './hooks/useEngineModel'
import {FLOWCONFIG, VARIABLETABS} from '~/utils/const'

let CustomNodeModelNew
let DefaultPortModelNew
let DefaultDiagramStateNew
let PathFindingLinkFactoryNew
let pathfinding

const RuleSetTableList = (props) => {
  const {parameterData} = props
  const [diagramEngine, activeModel] = useEngineModel()
  const [customNodeFactoryNew, setCustomNodeFactoryNew] = useState(null)
  const [canvasHeight, setCanvasHeight] = useState('0')
  // console.log('parameterData', parameterData)
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
      // PathFindingLinkFactory
      const PathFindingLinkFactory = await import(
        '@projectstorm/react-diagrams'
      ).then((module) => module.PathFindingLinkFactory)

      // Default
      const DefaultNodeModel = await import(
        '@projectstorm/react-diagrams'
      ).then((module) => module.DefaultNodeModel)
      const DefaultPortModel = await import(
        '@projectstorm/react-diagrams'
      ).then((module) => module.DefaultPortModel)

      setCustomNodeFactoryNew(new CustomNodeFactory())
      CustomNodeModelNew = CustomNodeModel
      DefaultDiagramStateNew = DefaultDiagramState
      PathFindingLinkFactoryNew = PathFindingLinkFactory
      DefaultPortModelNew = DefaultPortModel
    })()
  }, [])

  // 服务端交互：初始化 canvas 数据，若有节点，则自动生成。
  useEffect(() => {
    // 做一些 model 和 engine 的配置
    if (
      activeModel &&
      customNodeFactoryNew &&
      DefaultDiagramStateNew &&
      PathFindingLinkFactoryNew
    ) {
      // // 整体比例
      // activeModel.setZoomLevel(75)
      // 注册直线
      pathfinding = diagramEngine
        .getLinkFactories()
        .getFactory(PathFindingLinkFactoryNew.NAME)
      // console.log('pathfinding', pathfinding)
      // 注册自定义 Factory
      diagramEngine.getNodeFactories().registerFactory(customNodeFactoryNew)
    }
    if (
      activeModel &&
      CustomNodeModelNew &&
      parameterData &&
      DefaultPortModelNew
    ) {
      // console.log('inter')
      newModel(parameterData)
    }
  }, [parameterData, activeModel, customNodeFactoryNew])

  // * --------------------------------------------------------------

  const newModel = (newdata) => {
    activeModel.setLocked(true)
    generateNodes([newdata.rootNode], null, pathfinding)
    diagramEngine.setModel(activeModel)
    // 整体比例
    activeModel.setZoomLevel(75)
  }

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

  const generateNodes = (nodes, prevNode, pathfinding) => {
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
      nodeModel.data = node

      if (node.referenceType === 0) {
        nodeModel.setPosition(node.x * 1, node.y * 2.3)
      } else {
        nodeModel.setPosition(node.x * 1, node.y * 1.2)
      }

      // 问题在这，只能取到 data 中，旧的 坐标。
      // nodeModel.setPosition(node.x, node.y)
      activeModel.addNode(nodeModel)

      let portIn

      if (node.referenceType !== 0) {
        portIn = nodeModel.ports.in
      }

      // line 连接
      if (prevNode !== null && portIn !== null) {
        try {
          let portOut = findNodePort(prevNode, false)
          if (pathfinding) {
            let link = portOut.link(portIn)
            activeModel.addLink(link)
          }
        } catch (error) {
          console.log(error)
        }
      }

      // 若 node.childrenNodeList 还有内容。则代表还有子节点。
      // 递归执行 generateNodes(node.childrenNodeList, nodeModel)
      if (
        Array.isArray(node.childrenNodeList) &&
        node.childrenNodeList.length > 0
      ) {
        generateNodes(node.childrenNodeList, nodeModel, pathfinding)
      }
      //  else {
      //   setCanvasHeight(`${node.y * 1.5 < 1080 ? 1080 : node.y * 1.5}px`)
      // }
    })
  }

  // 主体JSX
  return (
    <>
      {/* canvas 画布区域 */}
      {diagramEngine && (
        <BodyWidget
          model={activeModel}
          engine={diagramEngine}
          {...props}
          canvasHeight={canvasHeight}
        />
      )}
    </>
  )
}

export default RuleSetTableList
