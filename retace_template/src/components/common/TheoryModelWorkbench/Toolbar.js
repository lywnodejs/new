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
import { DialogBox } from "../../../components/common";
import CascadingMenu from "./CascadingMenu";
// import mock data
import {
  analysisModels,
  basicMockDatabaseTree,
} from "../../../settings/projectMockData";
import { useHistory } from "react-router";

const Toolbar = ({ isSidebarOpen, handleOpenSidebar, onAdd, handleClearGraph }) => {
  const history = useHistory();
  const [anchorElement, setAnchorElement] = useState(null);

  const menuItems = [
    {
      key: "1",
      caption: "学生发展理论模型",
      type: 'inputNode',
      onClick: () => { },
      subMenuItems: [
        {
          key: "1-1",
          caption: "学生德育分析模型",
          type: 'modelNode',
          onClick: () => { },
        },
        {
          key: "1-2",
          caption: "学生智育分析模型",
          type: 'modelNode',
          onClick: () => { },
        },
        {
          key: "1-3",
          caption: "学生体育分析模型",
          type: 'modelNode',
          onClick: () => { },
        },
        {
          key: "1-4",
          caption: "学生美育分析模型",
          type: 'modelNode',
          onClick: () => { },
        },
        {
          key: "1-5",
          caption: "学生劳育分析模型",
          type: 'modelNode',
          onClick: () => { },
        },
        {
          key: "1-6",
          caption: "学生核心素养分析模型",
          type: 'modelNode',
          onClick: () => { },
        },
      ]
    },
    {
      key: "2",
      caption: "教师发展理论模型",
      type: 'inputNode',
      onClick: () => { },
      subMenuItems: [
        {
          key: "2-1",
          caption: "教师教案分析模型",
          type: 'modelNode',
          onClick: () => { },
        },
        {
          key: "2-2",
          caption: "教师听评课分析模型",
          type: 'modelNode',
          onClick: () => { },
        },
        {
          key: "2-3",
          caption: "教师专业发展分析模型",
          type: 'modelNode',
          onClick: () => { },
        },
      ]
    },
    {
      key: "3",
      caption: "+ 新建理论模型",
      type: 'inputNode',
      onClick: () => { },
    },
    {
      key: "4",
      caption: "+ 添加属性",
      type: 'modelNode',
      onClick: () => { },
    },
  ];

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
          选择理论模型
        </Button>&nbsp;
        <Button variant="text" color="primary">保存</Button>&nbsp;
        <Button variant="text" color="primary" onClick={handleClearGraph}>清空</Button>&nbsp;
        <Button variant="text" color="secondary" onClick={()=>{
          history.push('/admin/modelSetting/analysisModel');
        }} >下一步</Button>
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
