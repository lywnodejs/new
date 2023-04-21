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
  teacherTable,
  teacherColProps,
} from "../../../settings/projectMockData";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 16,
      height: "100%",
    },
    pageTitle: {
      margin: "10px 0",
    },
  })
);

export const TeacherDataProcessPage: React.FC = () => {
  const classes = useStyle();

  const subjectList = ["三年级语文", "三年级科学", "三年级英语", "三年级数学"];

  const transferMockList = [
    "三年级语文学科教案数据",
    "三年级语文学科教师行为数据",
  ];

  return (
    <div className={classes.root}>
      <Typography className={classes.pageTitle} variant="h5">
        教师数据处理
      </Typography>
      <DataProcess
        selectLabel="科目"
        selectOptionList={subjectList}
        transferMockList={transferMockList}
        dataGridData={teacherTable}
        dataGridColProps={teacherColProps}
      />
    </div>
  );
};
