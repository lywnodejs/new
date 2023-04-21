import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    removeElements,
    Controls,
    Background,
    MiniMap,
    Elements
} from 'react-flow-renderer';
// import custom component
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import { InputNode, ModelNode, OutputNode, ComputingNode } from './customNode';
// import initial elms
// import { initialElements } from './initial-elements';
// import style
import './dnd.css';

let id = 0;
const getId = () => `dndnode_${id++}`;

const nodeTypes = {
    inputNode: InputNode,
    modelNode: ModelNode,
    outputNode: OutputNode,
    computingNode: ComputingNode,
};

export const AnalysisModelWorkbench: React.FC = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState<Elements>([]);
    const [openSidebar, setOpenSidebar] = useState(true);
    // 点击可拖拽的按钮
    const [clickElementValue, setClickElementValue] = useState(null);


    // const onConnect = (params) => setElements((els) => addEdge(params, els));
    const onConnect = (params) => setElements((els) => {
        // params: new edge
        // els: current elements (ole)
        params = {
            ...params,
            animated: true, style: { stroke: '#6c81a1' }, type: 'smoothstep',
        };
        return addEdge(params, els);
    });

    const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els));

    const onLoad = (_reactFlowInstance) => {
        setReactFlowInstance(_reactFlowInstance);
        // _reactFlowInstance.fitView();
    }

    const onAdd = (item) => {
        // 如果是模型节点, 则自动连结上输入数据与输出数据模块
        if (item.type === 'modelNode'){
            const inputNodeId = getId();
            const modelNodeId = getId();
            const outputNodeId = getId();
            const yPosition = 50 + 50 * elements.length;
            // 输入节点
            const newInputNode = {
                id: inputNodeId,
                data: {label: '选择数据表'},
                position: {
                    x: 100,
                    y: yPosition + 50,
                },
                type: 'inputNode'
            };
            setElements((els) => els.concat(newInputNode));
            // 模型节点
            const newModelNode = {
                id: modelNodeId,
                data: {label: item.caption },
                position: {
                    x: 300,
                    y: yPosition,
                },
                type: 'modelNode'
            };
            setElements((els) => els.concat(newModelNode));
            // 输出节点
            const newOutputNode = {
                id: outputNodeId,
                data: {label: '输出结果'},
                position: {
                    x: 550,
                    y: yPosition + 30,
                },
                type: 'outputNode'
            };
            setElements((els) => els.concat(newOutputNode));
            // 设置连结
            // { id: 'edge1', source: 'root', target: 'node1', type: 'smoothstep', animated: true, },
            const InputModelEdge = {
                id: getId(),
                source: inputNodeId,
                target: modelNodeId,
                type: 'smoothstep',
                animated: true
            };
            setElements((els) => els.concat(InputModelEdge));
            const ModelOutputEdge = {
                id: getId(),
                source: modelNodeId,
                target: outputNodeId,
                type: 'smoothstep',
                animated: true
            };
            setElements((els) => els.concat(ModelOutputEdge));
        } else {
            // 正常操作
            const newNode = {
                id: getId(),
                data: { label: item.caption },
                position: {
                    x: 100,
                    y: 50 + 50 * elements.length,
                },
                type: item.type
            };
            setElements((els) => els.concat(newNode));
        }
    }

    const handleOpenSidebar = open => {
        setOpenSidebar(open)
    }

    const handleElementClick = (event, element) => {
        setClickElementValue(element);
    };

    const onNodeContextMenu = (event, node) => {
        event.preventDefault();
        // console.log('context menu:', node);
    };


    return (
        <div className="dndflow">
            <div style={{ width: '100%' }}>
                <Toolbar handleOpenSidebar={handleOpenSidebar} isSidebarOpen={openSidebar} onAdd={onAdd} />
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
                            style={{ height: 'calc(100vh - 150px)' }}
                            onNodeContextMenu={onNodeContextMenu}
                            deleteKeyCode={46}
                        >
                            <Background color="#aaa" gap={16} />
                            <Controls />
                        </ReactFlow>
                    </div>
                </ReactFlowProvider>
            </div>
            <Sidebar
                open={openSidebar}
                clickElement={clickElementValue}
                elements={elements}
            />
        </div>
    );
};
