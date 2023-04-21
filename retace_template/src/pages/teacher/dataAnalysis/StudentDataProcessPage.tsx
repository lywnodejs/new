import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
// import MD style & components
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { DataProcess } from "./components/dataProcess";
import {
  studentBasicDataTable,
  studentBasicDataTableColProps,
} from "../../../settings/projectMockData";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    pageTitle: {
      margin: "10px 0",
    },
    root: {
      padding: 16,
      // height: "100%",
    },
  })
);

/**
 * ! Router: /admin/modelManage/basicData
 * * Function:
 */
export const StudentDataProcessPage: React.FC = () => {
  const classes = useStyle();

  const classList = ["三（一）班", "三（二）班", "三（三）班"];

  const transferMockList = [
    "三（一）班美育数据",
    "三（一）班体育数据",
    "三（一）班德育数据",
  ];

  return (
    <div className={classes.root}>
      <Typography className={classes.pageTitle} variant="h5">
        学生数据处理
      </Typography>
      <DataProcess
        selectLabel="班级"
        selectOptionList={classList}
        transferMockList={transferMockList}
        dataGridData={studentBasicDataTable}
        dataGridColProps={studentBasicDataTableColProps}
      />
    </div>
  );
};
