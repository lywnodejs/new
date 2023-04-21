import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    removeElements,
    Controls,
    Background,
    MiniMap,
    Elements,
    Position
} from 'react-flow-renderer';
// import custom component
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
// import initial elms
import { initialElements } from './initial-elements';
// import mock data
import { TheoryModelDetail } from '../../../pages/modelManage/newModelManage/mockData/TheoryModel';
// import style
import './dnd.css';
import { DialogBox } from "../../../components/common";
import { Button, TextField } from '@material-ui/core';
// import redux
import { useSelector } from '../../../redux/hooks';

let id = 0;
const getId = () => `new_node_${id++}`;

export const TheoryModelWorkbench: React.FC = () => {
    const currentOpenModel = useSelector(state => state.theoryModel.currentModel);
    const reactFlowWrapper = useRef(null);
    const [elements, setElements] = useState<Elements>([]);
    const [openSidebar, setOpenSidebar] = useState(true);
    // 点击可拖拽的按钮
    const [clickElementValue, setClickElementValue] = useState(null);
    // 新建模型
    const [openNewModelDialog, setOpenNewModelDialog] = useState(false);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    // 打开了模型
    const [openModelDetail, setOpenModelDetail] = useState('');

    useEffect(()=>{
        if (currentOpenModel){
            TheoryModelDetail.map(model => {
                if (model.name === currentOpenModel){
                    setElements(model.elms);
                }
            })
        }
    },[currentOpenModel]);

    const onAdd = (item) => {
        // console.log(item);
        // 后续可根据item['caption']筛选对应的模型
        if (item['caption'] === '+ 新建理论模型') {
            setOpenNewModelDialog(true);
        } else if (item['caption'] === '+ 添加属性') {
            /**
             * {
                id: 'node1',
                targetPosition: Position.Left,
                sourcePosition: Position.Right,
                type: 'default',
                data: { label: '美术课程' },
                position: { x: 250, y: 50 },
            },
             */
            const newNode = {
                id: getId(),
                data: { label: '自定义新属性' + id },
                position: {
                    x: 50,
                    y: 50,
                },
                type: 'default',
                targetPosition: Position.Left,
                sourcePosition: Position.Right,
            };
            // console.log(elements);
            setElements((els) => els.concat(newNode));
            // let newELS = elements;
            // newELS.push(newNode);
            // console.log(newELS);
            // setElements(newELS);

        } else {
            TheoryModelDetail.map(model => {
                if (model.name === item.caption) {
                    console.log(model);
                    setElements(model.elms);
                    setOpenModelDetail(model.name);
                }
            });
        }
    };

    const handleOpenSidebar = open => {
        setOpenSidebar(open)
    }

    const handleElementClick = (event, element) => {
        setClickElementValue(element);
    };

    const onNodeContextMenu = (event, node) => {
        event.preventDefault();
        console.log('context menu:', node);
    };

    const onLoad = (_reactFlowInstance) => {
        setReactFlowInstance(_reactFlowInstance);
        // _reactFlowInstance.fitView();
    };

    const onConnect = (params) => setElements((els) => {
        // params: new edge
        // els: current elements (ole)
        params = {
            ...params,
            animated: true, style: { stroke: '#6c81a1' }, type: 'smoothstep',
        };
        return addEdge(params, els);
    });

    // 清空
    const handleClearGraph = () => {
        setElements([]);
    }

    return (
        <div className="dndflow">
            <div style={{ width: '100%' }}>
                <Toolbar handleOpenSidebar={handleOpenSidebar} isSidebarOpen={openSidebar} onAdd={onAdd} handleClearGraph={handleClearGraph} />
                {/* 新建模型dialog */}
                <DialogBox
                    boxSize="md"
                    openDialog={openNewModelDialog}
                    handleCloseDialog={() => { }}
                    title={'新建理论模型'}
                    content={
                        <div>
                            <div style={{ paddingTop: 0, }}>模型名称</div>
                            <TextField style={{ width: '400px' }} id="standard-basic" placeholder='请输入模型名称' />
                            <div style={{ paddingTop: 20, }}>模型简介</div>
                            <TextField style={{ width: '400px' }} id="standard-basic" placeholder='请输入模型简介' />
                        </div>
                    }
                    action={
                        <div>
                            <Button color="secondary" onClick={() => { setOpenNewModelDialog(false) }}>取消</Button>
                            <Button color="primary" onClick={() => { setOpenNewModelDialog(false) }}>确认</Button>
                        </div>
                    }
                />
                <ReactFlowProvider>
                    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                        <ReactFlow
                            elements={elements}
                            onLoad={onLoad}
                            onConnect={onConnect}
                            onElementClick={handleElementClick}
                            zoomOnScroll={false}
                            preventScrolling={false}
                            style={{ height: 'calc(100vh - 150px)' }}
                            onNodeContextMenu={onNodeContextMenu}
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
                openModelDetail={openModelDetail}
            />
        </div>
    )
}
