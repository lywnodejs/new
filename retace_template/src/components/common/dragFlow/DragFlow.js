import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
  Background,
  MiniMap,
} from 'react-flow-renderer';

import Sidebar from './Sidebar';
import Toolbar from './Toolbar';

import './dnd.css';

const initialElements = [{}];

let id = 0;
const getId = () => `dndnode_${id++}`;

export const DragFlow = ({
  heads, subHeads, contents
}) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState(initialElements);
  const [ openSidebar, setOpenSidebar ] = useState(true);
  // 点击可拖拽的按钮
  const [clickElementValue, setClickElementValue] = useState(null);


  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onLoad = (_reactFlowInstance) =>
    setReactFlowInstance(_reactFlowInstance);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactFlowType');
    const label = event.dataTransfer.getData('application/reactFlowLabel');
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: getId(),
      type,
      position,
      data: { label: label },
    };

    setElements((es) => es.concat(newNode));
  };

  const onAdd = (item) => {

    const newNode = {
      id: getId(),
      data: { label: item.caption },
      position: {
        x: 100,
        y: 50*elements.length,
      },
    };
    setElements((els) => els.concat(newNode));
  }

  const handleOpenSidebar = open =>{
    setOpenSidebar(open)
  }

  const handleElementClick = (event, element) => {
    setClickElementValue(element);
  };


  return (
    <div className="dndflow">
      <div style={{width: '100%'}}>
        <Toolbar handleOpenSidebar={handleOpenSidebar} isSidebarOpen={openSidebar} onAdd={onAdd}/>
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              elements={elements}
              onConnect={onConnect}
              onElementsRemove={onElementsRemove}
              onElementClick={handleElementClick}
              onLoad={onLoad}
              onDrop={onDrop}
              onDragOver={onDragOver}
              zoomOnScroll={false}
              preventScrolling={false}
              style={{height: 'calc(100vh - 196px)'}}
            >
              <Background color="#aaa" gap={16} />
              {/* <MiniMap /> */}
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