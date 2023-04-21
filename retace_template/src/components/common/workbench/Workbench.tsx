import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
  Background,
  MiniMap,
} from 'react-flow-renderer';
// import custom component
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import { InputNode, ModelNode, OutputNode, ScaleNode} from './customNode';
// import initial elms
import { initialElements } from './initial-elements';
// import style
import './dnd.css';


let id = 0;
const getId = () => `dndnode_${id++}`;

const nodeTypes = {
  inputNode: InputNode,
  modelNode: ModelNode,
  outputNode: OutputNode,
  scaleNode: ScaleNode,
};

export const Workbench = ({}) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState(initialElements);
  const [ openSidebar, setOpenSidebar ] = useState(true);
  // 点击可拖拽的按钮
  const [clickElementValue, setClickElementValue] = useState(null);


  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onLoad = (_reactFlowInstance) =>{
    setReactFlowInstance(_reactFlowInstance);
    // _reactFlowInstance.fitView();
  }

  const onAdd = (item) => {

    const newNode = {
      id: getId(),
      data: { label: item.caption },
      position: {
        x: 100,
        y: 50*elements.length,
      },
      type: item.type
    };
    setElements((els) => els.concat(newNode));
  }

  const handleOpenSidebar = open =>{
    setOpenSidebar(open)
  }

  const handleElementClick = (event, element) => {
    setClickElementValue(element);
  };

  const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    console.log('context menu:', node);
  };


  return (
    <div className="dndflow">
      <div style={{width: '100%'}}>
        <Toolbar handleOpenSidebar={handleOpenSidebar} isSidebarOpen={openSidebar} onAdd={onAdd}/>
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              elements={elements}
              nodeTypes={nodeTypes} // custom node type
              onConnect={onConnect}
              onElementsRemove={onElementsRemove}
              onElementClick={handleElementClick}
              onLoad={onLoad}
              zoomOnScroll={false}
              preventScrolling={false}
              style={{height: 'calc(100vh - 196px)'}}
              onNodeContextMenu={onNodeContextMenu}
              deleteKeyCode={46}
            >
              <Background color="#aaa" gap={16} />
              {/* <MiniMap
                  style={{height: 100}}
                  nodeBorderRadius={2}
              /> */}
              <Controls />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
      <Sidebar
        open={openSidebar}
        clickElement={clickElementValue}
      />
    </div>
  );
};