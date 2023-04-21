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
import { AccordionPanel } from "../../../components/common";
import CascadingMenu from "./CascadingMenu";
// import mock data
import {
  analysisModels,
  basicMockDatabaseTree,
} from "../../../settings/projectMockData";
const menuItems = [
  {
    key: "1",
    caption: "输入数据",
    onClick: () => {},
  },
  {
    key: "2",
    caption: "特征模型",
    onClick: () => {},
    subMenuItems: [
      {
        key: "4",
        caption: "主成分分析",
        onClick: () => {},
      },
      {
        key: "5",
        caption: "因子分析",
        onClick: () => {},
      },
      {
        key: "6",
        caption: "奇异值分解",
        onClick: () => {},
      },
    ],
  },
  {
    key: "3",
    caption: "输出结果",
    onClick: () => {},
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
      
      <Button
        variant="contained"
        color="primary"
        size="small"
        className="addBtn"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleClick}
      >
        添加元素
      </Button>

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
