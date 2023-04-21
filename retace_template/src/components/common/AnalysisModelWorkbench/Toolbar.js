import React, { useState } from "react";
// import component
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
// import icon
import AddIcon from "@material-ui/icons/Add";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
// import customize components
import { AccordionPanel } from "..";
import CascadingMenu from "./CascadingMenu";
// import mock data
import {
  analysisModels,
  basicMockDatabaseTree,
} from "../../../settings/projectMockData";

const menuItems = [
  {
    key: "1",
    caption: "选择数据表",
    type: 'inputNode',
    onClick: () => { },
  },
  {
    key: "2",
    caption: "理论量化模型",
    onClick: () => { },
    subMenuItems: [
      {
        key: "2-1",
        caption: "学生德育分析模型",
        type: 'modelNode',
        onClick: () => { },
      },
      {
        key: "2-2",
        caption: "学生智育分析模型",
        type: 'modelNode',
        onClick: () => { },
      },
      {
        key: "2-3",
        caption: "学生体育分析模型",
        type: 'modelNode',
        onClick: () => { },
      },
      {
        key: "2-4",
        caption: "学生美育分析模型",
        type: 'modelNode',
        onClick: () => { },
      },
      {
        key: "2-5",
        caption: "学生劳育分析模型",
        type: 'modelNode',
        onClick: () => { },
      },
      {
        key: "2-6",
        caption: "学生核心素养分析模型",
        type: 'modelNode',
        onClick: () => { },
      },
      {
        key: "2-8",
        caption: "教师教案分析模型",
        type: 'modelNode',
        onClick: () => { },
      },
      {
        key: "2-9",
        caption: "教师听评课分析模型",
        type: 'modelNode',
        onClick: () => { },
      },
      {
        key: "2-10",
        caption: "教师专业发展分析模型",
        type: 'modelNode',
        onClick: () => { },
      },
    ],
  },
  {
    key: "3",
    caption: "基础计算模型",
    onClick: () => { },
    subMenuItems: [
      {
        key: "3-1",
        caption: "加法模型",
        type: 'computingNode',
        onClick: () => { },
      },
      {
        key: "3-2",
        caption: "乘法模型",
        type: 'computingNode',
        onClick: () => { },
      },
      {
        key: "3-3",
        caption: "平均值模型",
        type: 'computingNode',
        onClick: () => { },
      },
    ],
  },
  {
    key: "4",
    caption: "输出结果",
    type: 'outputNode',
    onClick: () => { },
  },
];

const Toolbar = ({ isSidebarOpen, handleOpenSidebar, onAdd }) => {
  const [anchorElement, setAnchorElement] = useState(null);

  const handleClick = (event) => {
    setAnchorElement(event.currentTarget)
  };

  const handleClose = () => {
    setAnchorElement(null)
  };

  return (
    <div className="toolbar">
      <div>
        <Button
          variant="contained"
          color="primary"
          size="small"
          className="addBtn"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleClick}
        >
          添加量化分析模块
        </Button>&nbsp;
        <Button variant="text" color="primary">保存</Button>&nbsp;
        <Button variant="text" color="primary">清空</Button>&nbsp;
      </div>

      <CascadingMenu
        anchorElement={anchorElement}
        menuItems={menuItems}
        onClose={handleClose}
        open={Boolean(anchorElement)}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onAdd={onAdd}
      />
      <IconButton
        aria-label="setting"
        onClick={() => handleOpenSidebar(!isSidebarOpen)}
      >
        {isSidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </div>
  );
};

export default Toolbar;
