import {
  // DiagramEngine,
  // DefaultDiagramState,
  LinkLayerFactory,
  NodeLayerFactory,
} from '@projectstorm/react-diagrams-core'
import {DefaultDiagramState} from './CustomDefaultDiagramState'
import {DiagramEngine} from './CustomDiagramEngine'
import {
  DefaultLabelFactory,
  DefaultLinkFactory,
  DefaultNodeFactory,
  DefaultPortFactory,
} from '@projectstorm/react-diagrams-defaults'
import {PathFindingLinkFactory} from '@projectstorm/react-diagrams-routing'
import {
  SelectionBoxLayerFactory,
  CanvasEngineOptions,
} from '@projectstorm/react-canvas-core'

// export * from '@projectstorm/react-diagrams-core'
// export * from '@projectstorm/react-diagrams-defaults'
// export * from '@projectstorm/react-diagrams-routing'

/**
 * Construct an engine with the defaults installed
 */

const engineIndex = (options = {}) => {
  const engine = new DiagramEngine(options)

  // register model factories
  engine.getLayerFactories().registerFactory(new NodeLayerFactory())
  engine.getLayerFactories().registerFactory(new LinkLayerFactory())
  engine.getLayerFactories().registerFactory(new SelectionBoxLayerFactory())

  engine.getLabelFactories().registerFactory(new DefaultLabelFactory())
  engine.getNodeFactories().registerFactory(new DefaultNodeFactory()) // i cant figure out why
  engine.getLinkFactories().registerFactory(new DefaultLinkFactory())
  engine.getLinkFactories().registerFactory(new PathFindingLinkFactory())
  engine.getPortFactories().registerFactory(new DefaultPortFactory())

  // register the default interaction behaviours
  engine.getStateMachine().pushState(new DefaultDiagramState())
  return engine
}
export default engineIndex
