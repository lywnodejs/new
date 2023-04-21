import {useState, useEffect} from 'react'

const useEngineModel = () => {
  const [diagramEngine, setDiagramEngine] = useState(null)
  const [activeModel, setActiveModel] = useState(null)

  // 页面加载时执行一次，初始化 库 的一些必要功能模块。(model、engine、factory等)
  useEffect(() => {
    ;(async function () {
      const createEngine = await import(
        '~/components/flow/engine/DiagramEngine'
      ).then((module) => module.default)

      // const createEngine = await import('@projectstorm/react-diagrams').then(
      //   (module) => module.default,
      // )

      const DiagramModel = await import('@projectstorm/react-diagrams').then(
        (module) => module.DiagramModel,
      )

      let engine = createEngine()
      let model = new DiagramModel()
      engine.setModel(model)

      setDiagramEngine(engine)
      setActiveModel(model)
    })()
  }, [])
  // console.log('diagramEngine', diagramEngine)
  return [diagramEngine, activeModel]
}

export default useEngineModel
