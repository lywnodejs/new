import React, { useState } from 'react';
import ReactFlow, {
    removeElements,
    addEdge,
    MiniMap,
    Controls,
    Background,
} from 'react-flow-renderer';
// import custom nodes
import { InputNode, ModelNode, OutputNode, ScaleNode} from './customNode';
// import initial elms
import { initialElements } from './initial-elements';


const onLoad = (reactFlowInstance) => {
    console.log('flow loaded:', reactFlowInstance);
    reactFlowInstance.fitView();
};

const onElementClick = (event, element) => console.log('click', element);
const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    console.log('context menu:', node);
};

const nodeTypes = {
    inputNode: InputNode,
    modelNode: ModelNode,
    outputNode: OutputNode,
    scaleNode: ScaleNode,
};

export const Flow = () => {
    const [elements, setElements] = useState(initialElements);
    const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els));
    const onConnect = (params) => setElements((els) => addEdge(params, els));

    return (
        <ReactFlow
            elements={elements}
            nodeTypes={nodeTypes} // custom node type
            onElementsRemove={onElementsRemove}
            deleteKeyCode={46}
            onConnect={onConnect}
            onLoad={onLoad}
            selectNodesOnDrag={false}
            onElementClick={onElementClick}
            onNodeContextMenu={onNodeContextMenu}
        >
            {/* 右下加小地图 */}
            <MiniMap
                style={{height: 100}}
                // nodeStrokeColor={(n) => {
                //     if (n.style?.background) return n.style.background;
                //     if (n.type === 'input') return '#0041d0';
                //     if (n.type === 'output') return '#ff0072';
                //     if (n.type === 'default') return '#1a192b';

                //     return '#eee';
                // }}
                // nodeColor={(n) => {
                //     if (n.style?.background) return n.style.background;

                //     return '#fff';
                // }}
                nodeBorderRadius={2}
            />
            {/* 左下角控制按钮 */}
            <Controls />
            {/* 背景样式控制 */}
            <Background color="#aaa" gap={16} />
        </ReactFlow>
    );
}
