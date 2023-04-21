import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import {
  DataTable,
  menuProps,
  SelectFormsErrorVerification,
} from "../../../components/common/";
// import redux hook
import { useSelector } from "../../../redux/hooks";
//import user info mock data
import {
  myProfileMockData,
  reportList,
  teacherTable,
} from "../../../settings/projectMockData";
import { flatNavMenu } from "../../../settings/newProjectNavMenu";
//import icon
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import SmsOutlinedIcon from "@material-ui/icons/SmsOutlined";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 16,
    },
    titleText: {
      margin: "20px 0 10px 0",
    },
    card: {
      boxShadow: "none",
    },
    userAvatar: {
      width: "72px",
      height: "72px",
      // marginTop: '-40px',
    },
    userSummary: {
      textAlign: "center",
    },
    tabs: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      color: "#1e88e5",
    },
    postTextfield: {
      width: "100%",
      marginTop: "20px",
    },
    postBtn: {
      margin: "10px 0",
    },
    postItemContainer: {
      padding: "20px",
    },
    postItem: {
      borderBottom: `1px dashed ${theme.palette.divider}`,
    },
    imageList: {
      width: 500,
    },
    postItemBottom: {
      textAlign: "right",
    },
    postItemIcon: {
      color: "#aaa",
      margin: "0 5px 0 20px",
      verticalAlign: "middle",
    },
    postItemTitle: {
      // marginLeft: -15,
      marginBottom: 10,
    },
    topPost: {},
    topPostImgList: {
      width: "100%",
    },
    topPostTitle: {
      margin: 10,
      textAlign: "center",
    },
    topPostContent: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
    userInfo: {
      display: "flex",
      justifyContent: "space-around",
    },
    cardHeader: {
      padding: 16,
      borderBottom: "1px solid #ddd",
      display: "flex",
      justifyContent: "space-between",
    },
    cardBtn: {
      height: 20,
      lineHeight: "20px",
    },
    loginLogItem: {
      fontSize: 14,
      color: "#676767",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 1,
      WebkitBoxOrient: "vertical",
      height: 25,
      lineHeight: "25px",
      "&>span": {
        marginRight: 4,
      },
    },
    graph: {
      width: "100%",
    },
    modelContainer: {
      borderCollapse: "collapse",
      borderStyle: "hidden",
    },
    info: {
      textAlign: "center",
    },
    tableItem: {},

    selectBtn: {
      marginTop: 24,
      marginLeft: 50,
    },
  })
);

export const AdminGrowthFile = () => {
  const classes = useStyles();
  const [grade, setGrade] = useState("");
  const [cls, setCls] = useState("");
  const [openDetail, setOpenDetail] = useState("");

  // router
  const history = useHistory();
  const userRole = useSelector((state) => state.user.userRole);
  const userRouter = useSelector(
    (state) => state.openPage.projectUserAuthorization
  )[0].router;
  const projectNavMenuItems = flatNavMenu[userRole || "系统管理员"];

  const handleReturn = () => {
    setOpenDetail("");
  };

  const {
    username,
    career,
    avatar,
    studentNum,
    visits,
    rankInTeam,
    teamMemberSum,
    loginLog,
    commonUsedModel,
    latestGraph,
    tableList,
  } = myProfileMockData;

  const gradeData = [
    "一年级",
    "二年级",
    "三年级",
    "四年级",
    "五年级",
    "六年级",
  ];

  const clsData = ["一班", "二班", "三班", "四班", "五班"];

  const onChangeSelect = (type, value) => {
    if (type === "grade") {
      setGrade(value);
    } else {
      setCls(value);
    }
  };

  const handleOpenAllModels = () => {
    history.push(
      userRouter +
        projectNavMenuItems?.find((item) => item.title === "模型库管理").router
    );
  };

  const handleOpenAllReport = () => {
    history.push(
      userRouter +
        projectNavMenuItems?.find((item) => item.title === "报表配置").router
    );
  };

  const handleOpenAllGraph = () => {
    history.push(
      userRouter +
        projectNavMenuItems?.find((item) => item.title === "模型应用").router
    );
  };

  const handleOpenTable = (table) => {
    setOpenDetail(table);
  };

  const MySpace = (props) => {
    return (
      <>
        {/* 左侧小卡片:个人的统计信息-发博数 被赞总数 被评论数; 热点动态卡片*/}
        <Grid
          item
          sm={8}
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item>
            <Card className={classes.card}>
              <div className={classes.cardHeader}>
                <Typography variant="body2" color="textSecondary" component="p">
                  最新生成图表
                </Typography>
                <Button
                  className={classes.cardBtn}
                  size="small"
                  color="primary"
                  onClick={handleOpenAllGraph}
                >
                  全部图表
                </Button>
              </div>

              <CardContent>
                <img
                  alt="latestGraph"
                  className={classes.graph}
                  src={latestGraph}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card className={classes.card}>
              <div className={classes.cardHeader}>
                <Typography variant="body2" color="textSecondary" component="p">
                  我的报表
                </Typography>
                <Button
                  size="small"
                  color="primary"
                  className={classes.cardBtn}
                  onClick={handleOpenAllReport}
                >
                  全部报表
                </Button>
              </div>
              <CardContent>
                <List>
                  {reportList.map((el, idx) => {
                    return (
                      <>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar src={el.avatar} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={el.title}
                            secondary={el.updateTime}
                          />
                        </ListItem>
                        {idx < reportList.length - 1 && <Divider />}
                      </>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* 右侧卡片 */}
        <Grid
          container
          item
          sm={4}
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item>
            <Card className={classes.card}>
              <div className={classes.cardHeader}>
                <Typography variant="body2" color="textSecondary" component="p">
                  常用数据表
                </Typography>
                <Button
                  className={classes.cardBtn}
                  size="small"
                  color="primary"
                  onClick={() => setOpenDetail("allDataTable")}
                >
                  全部数据表
                </Button>
              </div>
              <CardContent>
                {tableList.map((el, idx) => {
                  return (
                    <Button
                      size="small"
                      color="primary"
                      style={{
                        width: "100%",
                        justifyContent: "flex-start",
                      }}
                      className={classes.tableItem}
                      onClick={() => handleOpenTable(el.title)}
                    >
                      {el.title}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card className={classes.card}>
              <div className={classes.cardHeader}>
                <Typography variant="body2" color="textSecondary" component="p">
                  登录日志
                </Typography>
                <Button
                  className={classes.cardBtn}
                  size="small"
                  color="primary"
                  onClick={() => setOpenDetail("loginLog")}
                >
                  全部日志
                </Button>
              </div>
              <CardContent>
                {loginLog.map((el, idx) => {
                  return (
                    <Typography className={classes.loginLogItem}>
                      <span>{el.loginTime} </span>
                      <span>{el.location}</span>
                      <span>{el.ip}</span>
                    </Typography>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card className={classes.card}>
              <div className={classes.cardHeader}>
                <Typography variant="body2" color="textSecondary" component="p">
                  常用模型
                </Typography>
                <Button
                  size="small"
                  color="primary"
                  className={classes.cardBtn}
                  onClick={handleOpenAllModels}
                >
                  全部模型
                </Button>
              </div>

              <CardContent>
                <List>
                  {commonUsedModel.map((el, idx) => {
                    return (
                      <>
                        <ModelCard {...el} />
                        {idx < commonUsedModel.length - 1 && (
                          <Divider
                            style={{
                              marginBottom: 10,
                            }}
                          />
                        )}
                      </>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <Grid className={classes.root}>
      <Grid container spacing={3}>
        {/* 顶部个人基本信息 */}
        <Grid item sm={12}>
          <Card className={classes.card}>
            <CardContent>
              <div className={classes.userInfo}>
                <Grid container item spacing={2}>
                  <Avatar
                    alt="User Picture"
                    src={avatar}
                    className={classes.userAvatar}
                  />
                  <Grid item>
                    <Typography gutterBottom variant="h5" component="h2">
                      {username}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {career}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  className={classes.info}
                  container
                  item
                  spacing={3}
                  direction="row-reverse"
                >
                  <Grid item>
                    <Typography
                      gutterBottom
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      访问数
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {visits.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      gutterBottom
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      团队内排名
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {rankInTeam}{" "}
                      <span style={{ fontSize: 20, color: "#87888A" }}>
                        {" "}
                        / {teamMemberSum}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      gutterBottom
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      学生数
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {studentNum}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </CardContent>
          </Card>
        </Grid>
        {openDetail !== "" ? (
          <ShowDetail
            type={openDetail}
            tableData={loginLog}
            handleReturn={handleReturn}
            tableList={tableList}
          />
        ) : (
          <MySpace />
        )}
      </Grid>
    </Grid>
  );
};

const useModelStyles = makeStyles((theme: Theme) =>
  createStyles({
    modelCardRoot: {
      // border: "1px solid #eee",
      display: "block",
      padding: 8,
      verticalAlign: "baseline",
      cursor: "pointer",

      "&:hover $title": {
        color: theme.palette.primary.light,
      },
    },
    icon: {
      backgroundColor: theme.palette.primary.light,
      borderRadius: "50%",
      padding: 5,
      fontSize: 24,
      color: theme.palette.primary.contrastText,
      verticalAlign: "middle",
      marginRight: 5,
    },
    title: {
      lineHeight: "2em",
      // display: 'inline-block'
    },
    description: {
      fontSize: 14,
      color: "#87888A",
      marginTop: 10,
      overflow: "hidden",
      textOverflow: "ellipsis",
      // whiteSpace: "nowrap",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
    },
    footer: {
      color: "#c1c1c1",
      marginTop: 10,
      display: "flex",
      justifyContent: "space-between",
      fontSize: 12,
    },
  })
);

const ModelCard = (props) => {
  const classes = useModelStyles();
  const { name, description, creator, updateTime } = props;

  return (
    <ListItem className={classes.modelCardRoot}>
      <div>
        <props.icon className={classes.icon} />
        <span className={classes.title}>{name}</span>
      </div>
      <div className={classes.description}>{description} </div>
      <div className={classes.footer}>
        <span>{creator}</span>
        <span>{updateTime}</span>
      </div>
    </ListItem>
  );
};

const ShowDetail = (props) => {
  const classes = useStyles();
  const { type, handleReturn, tableData, tableList } = props;
  const [table, setTable] = useState(
    ["allDataTable", "loginLog"].indexOf(type) === -1
      ? type
      : tableList[0].title
  );
  const [tableAssociateList, setTableAssociateList] = useState([
    tableList[0].title,
  ]);

  console.log("type", type);

  let header: any[];
  let data: any[];

  if (type === "loginLog") {
    header = ["登录时间", "用户名", "身份", "位置", "ip地址", "登录设备"];
    data = tableData.map((el, idx) => {
      return Object.values(el);
    });
  } else {
    header = [
      "时间",
      "教职工号",
      "姓名",
      "任教班级",
      "任教学科",
      "对教学目标的处理",
      "对教学内容的处理",
      "学习活动任务设计",
      "学习活动方式设计",
      "资源媒体运用",
      "学习评价的设计",
    ];
    data = teacherTable.map((el, idx) => {
      return Object.values(el)
        .slice(1)
        .map((e) => e.toString());
    });
  }

  const handleChangeTable = (e, idx) => {
    // setTable(e.target.value);
    setTableAssociateList(
      tableAssociateList.map((el, id) => (id === idx ? e.target.value : el))
    );
  };

  const handleAddAssociateTable = () => {
    setTableAssociateList([...tableAssociateList, ""]);
  };

  return (
    <Grid item sm={12}>
      <Card className={classes.card}>
        <div className={classes.cardHeader}>
          <Typography variant="body2" color="textSecondary" component="p">
            {type === "loginLog" ? "全部日志" : "全部数据表"}
          </Typography>
          <Button
            className={classes.cardBtn}
            size="small"
            color="primary"
            onClick={handleReturn}
          >
            返回
          </Button>
        </div>
        <CardContent>
          {type !== "loginLog" && (
            <div>
              {tableAssociateList.map((el, idx) => {
                console.log(tableAssociateList[idx], el);
                return (
                  <SelectFormsErrorVerification
                    key={idx}
                    width={120}
                    label="数据表"
                    value={tableAssociateList[idx]}
                    handleChangeSelect={(e) => handleChangeTable(e, idx)}
                    items={tableList.map((el) => el.title)}
                  />
                );
              })}
              <Button
                size="small"
                variant="contained"
                color="primary"
                className={classes.selectBtn}
              >
                查看
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                className={classes.selectBtn}
                style={{ marginLeft: 24 }}
              >
                删除
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                className={classes.selectBtn}
                style={{ marginLeft: 24 }}
                onClick={handleAddAssociateTable}
              >
                关联
              </Button>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <DataTable header={header} data={data} />
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};
