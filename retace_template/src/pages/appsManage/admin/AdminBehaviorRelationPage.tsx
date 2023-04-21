import React, { useState, useEffect } from "react";
// import Customize Components
import {
  DataTable,
  AlertBox,
  DialogBox,
  DataGrid,
  customButtonProps,
} from "../../../components/common";
// import Redux
import { useSelector } from "../../../redux/hooks";
// import MD style
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
// import MD components
import {
  Grid,
  Paper,
  Button,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";
// import MD Icon
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
// import mock data
import {
  behaviorRelationListColsProps,
  behaviorRelationListTable,
} from "../../../settings/projectMockData";
import appImg2 from "../../../assets/image/apps/appImage2.jpg";
import { CheckAppBehavior } from "./AdminBehaviorManagePage";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      height: "100%",
    },
    pageTitle: {
      margin: "10px 0",
    },
    btnContainer: {
      display: "flex",
      maxWidth: 300,
      margin: "40px auto",
      justifyContent: "space-around",
    },
  })
);

export const AdminBehaviorRelationPage = () => {
  const classes = useStyle();
  // state
  const [openDetail, setOpenDetail] = useState(false);

  // datagrid function
  const handleEditItem = () => {
    setOpenDetail(true);
  };

  const handleExit = () => {
    setOpenDetail(false);
  };

  const customButton: customButtonProps = {
    buttonName: "关联",
    buttonFunction: (p, e) => {setOpenDetail(true)},
    buttonColor: "primary",
    buttonVariant: "contained",
  };

  return (
    <div className={classes.root}>
      {openDetail ? (
        <>
          <RelationDetail handleExit={handleExit} openType={openDetail} />
        </>
      ) : (
        <>
          <Typography className={classes.pageTitle} variant="h5">
            行为关联管理
          </Typography>
          <DataGrid
            initialData={behaviorRelationListTable}
            colsProps={behaviorRelationListColsProps}
            handleEditItem={handleEditItem}
            disableCheck
            disableDel
            customButtonList={[customButton]}
          />
        </>
      )}
    </div>
  );
};

const RelationDetail = (props) => {
  const classes = useStyle();
  const { handleExit } = props;

  const defaultBehaviorItem = {
    companyName: "大华",
    toolName: "工具1",
    behaviorName: "观看视频",
    appImg: appImg2,
    functionIntro:
      "功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍",
  };

  // button function
  const handleSave = () => {
    handleExit();
  };
  const handleDel = () => {};

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography className={classes.pageTitle} variant="h5">
          行为关联注册
        </Typography>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ExitToAppIcon />}
          onClick={handleExit}
        >
          返回
        </Button>
      </Grid>
      <Grid container spacing={4}>
        <CheckAppBehavior relation {...defaultBehaviorItem} />
      </Grid>
      <div className={classes.btnContainer}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          保存
        </Button>
        <Button variant="outlined" color="primary" onClick={handleDel}>
          删除
        </Button>
      </div>
    </>
  );
};
