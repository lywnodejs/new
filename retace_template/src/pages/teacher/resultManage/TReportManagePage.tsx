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

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    pageTitle: {
      margin: "10px 0",
    },
    textTitle: {
      margin: 10,
      color:
        theme.palette.type === "light"
          ? theme.palette.grey[800]
          : theme.palette.grey[200],
    },
    textIntro: {
      textAlign: "center",
      margin: "20px 0px",
      lineHeight: "200px",
      color:
        theme.palette.type === "light"
          ? theme.palette.grey[500]
          : theme.palette.grey[200],
    },
    root: {
      padding: 16,
      height: "100%",
    },
  })
);

/**
 * ! Router: /admin/modelManage/basicData
 * * Function:
 */
export const TReportManagePage: React.FC = () => {
  const classes = useStyle();

  return (
    <div className={classes.root}>
      教师数据分析
    </div>
  );
};
