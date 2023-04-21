import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
	DragDropContext,
	Droppable,
	Draggable
} from "react-beautiful-dnd";
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import barSimple from '../../../assets/image/charts/bar-simple.png';
import lineSimple from '../../../assets/image/charts/line-simple.png';

//样式
const grid = 8;
const getStyle= () => ({
	display: 'flex',
	justifyContent: 'space-between',
})
const getListStyle = isDraggingOver => ({
	background: isDraggingOver ? "#ffebe6" : "#f5f5f5",
    transition: 'background 0.2s ease 0s, opacity 0.1s ease 0s',
	padding: grid,
	flex: 0.45,
	// boxShadow: '0px 2px 1px -1px #00000033, 0px 1px 1px 0px #00000024, 0px 1px 3px 0px #0000001f',
    // borderRadius: '4px',
});
const getItemStyle = (isDragging, draggableStyle) => ({
	userSelect: "none",
	padding: grid * 3,
	margin: `0 0 ${grid * 2}px 0`,
	background: isDragging ? "#eae6ff" : "#ffffff",
	boxShadow: '0px 2px 1px -1px #00000033, 0px 1px 1px 0px #00000024, 0px 1px 3px 0px #0000001f',
    borderRadius: '4px',
	...draggableStyle
});
const textAreaStyle = {
	width: '100%',
	height: '100%',
	resize: 'none',
	fontSize: '16px',
	padding: '5px',
}
const richTextStyle = {
	padding: grid
}



//缩略图列表
const imageList = {
	'bar-simple': barSimple,
	'line-simple': lineSimple,
}
//增加菜单里的选项
const addOption = [{
	label: '描述文字',
	value: 'text',
},{
	label: '三年级语文学科教案数据分析图',
	value: 'bar-simple',
},{
	label: '三年级2班全体学生美育分析图',
	value: 'bar-simple',
}
]
//初始选项
const initalItem = [
	// {
	// 	id: 'select',
	// 	type: 'select',
	// 	component: (
	// 	  <select>
	// 		<option>Option 1</option>
	// 		<option>Option 2</option>
	// 		<option>Option 3</option>
	// 	  </select>
	// 	),
	// },  
	{
		id: 'richText',
		type: 'richText',
		component: `<h3>数据报表标题……</h3>`,
	}, 
	{
		id: 'text',
		type: 'text',
		component: '描述性文本……',
	}, 
	// {
	// 	id: 'line-simple',
	// 	type: 'line-simple',
	// 	component: <img alt='' src={lineSimple} style={{ width: '100%'}}/>
	// }, 
]


// 重新排次序
export const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};
//两个列表之间移动
export const move = (source, destination, droppableSource, droppableDestination) => {
	
	
	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);
	const [removed] = sourceClone.splice(droppableSource.index, 1);

	destClone.splice(droppableDestination.index, 0, removed);

	const result = {};
	result[droppableSource.droppableId] = sourceClone;
	result[droppableDestination.droppableId] = destClone;

	return result;
};

//main component
export const DragDrop = ( ) => {
	const [ optionList, setOptionList ] = useState(initalItem)
	const [ selectedList, setSelectedList ] = useState([])
	const [ anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl);


	//新建一个项目
	const getItem = (type) => {
		const id = `item-${new Date().getTime()}`;

		let component;
		if(type === 'text'){
			// component=<textarea id={id} placeholder="type some text here" value={value} onChange={onChange}/>
			component=''
		}else{
			component=(<img alt='' src={imageList[type]} style={{ width: '100%'}}/>)
		}
		return ({
			id: id,
			type: type,
			component: component,
		})
	}

   //open menu
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
  
	//close menu
	const handleClose = () => {
		setAnchorEl(null);
	};

	//click menu item
	const handleClickOption = (el) => {
		handleClose()
		//增加新项目
		optionList.push(getItem(el.value))
		setOptionList(optionList)
	}

	const onDragEnd = (result) => {
		const {
			source,
			destination
		} = result;

		// dropped outside the list
		if (!destination) {
			return;
		}
		const sInd = source.droppableId;
		const dInd = destination.droppableId;

		if (sInd === dInd) {
			//drop in save block
			if(sInd === 'option'){
				setOptionList(reorder(optionList, source.index, destination.index))
			}else{
				setSelectedList(reorder(selectedList, source.index, destination.index))
			}
		} else {
			// drop in different block
			let result;
			if(sInd === 'option'){
				result = move(optionList, selectedList, source, destination);
			}else{
				result = move(selectedList, optionList, source, destination);
			}
			setSelectedList(result.selected)
			setOptionList(result.option)
		}
	}

	// handle textarea onchange event
	const handleTextarea = (e, item) => {
		optionList.forEach(el => {
			if(el.id === item.id){
				el.component = el.type ==='text'? e.target.value: e.target.innerHTML;
			}
		})
		setOptionList(optionList)
	}

	//根据type渲染不同组件
	const renderComponent = (item) => {
		switch (item.type) {
			case 'text':
				return (
					// <textarea id={item.id} style={textAreaStyle} placeholder="type some text here" defaultValue={item.component} onChange={e => handleTextarea(e, item)}/>
					<TextField
						label="描述"
						multiline
						rows={4}
						placeholder="please type what you want"
						variant="outlined"
						style={textAreaStyle}
						defaultValue={item.component} 
						onChange={e => handleTextarea(e, item)}
					/>
				)
			case 'richText': 
				return (
				<div
					style={richTextStyle}
					contentEditable
					onKeyUp={e => handleTextarea(e, item)}
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{
						__html: item.component,
					}}
				/>
				)
			default:
				return (item.component)
		}
	}

	return (
	<div>
		<div>
			<IconButton
				onClick={handleClick}
			>
				<AddIcon />
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				keepMounted
				open={open}
				onClose={handleClose}
			>
				{addOption.map((el, idx) => (
				<MenuItem key={el.value}  onClick={()=>handleClickOption(el)}>
					{el.label}
				</MenuItem>
				))}
			</Menu>
		</div>
		<div style={getStyle()}>
		 	 <DragDropContext onDragEnd={onDragEnd}>
				{/* 左边 */}
				<Droppable droppableId="option">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
						>
                            {optionList.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
								>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
											id={item.id}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
                                            {
												renderComponent(item)
											}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
				{/* 右边 */}
                <Droppable droppableId="selected">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {selectedList.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
									disableInteractiveElementBlocking
								>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
												{
													item.type === 'richText'? (
														<div dangerouslySetInnerHTML={{__html: item.component}}></div>
													): (
														item.component
													)
												}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

		  </DragDropContext>
		</div>
	  </div>
	);
}