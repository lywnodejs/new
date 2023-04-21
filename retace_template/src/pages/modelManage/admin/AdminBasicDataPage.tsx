import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
// import redux
import { useDispatch } from "react-redux";
import {
  setAreaOptions,
  setFilterOptions,
} from "../../../redux/basicData/slice";
import { useSelector } from "../../../redux/hooks";
// import MD style & components
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
// import customize components
import {
  DataGrid,
  CoordinateSelectRegion,
  CoordinateSelectDetail,
  FilterForm,
} from "../../../components/common";
// import Mock Data
import {
  studentBasicDataTable,
  studentBasicDataTableColProps,
  filterType,
  filterData
} from "../../../settings/projectMockData";
import { flatNavMenu } from "../../../settings/newProjectNavMenu";

import { data } from "../../../settings/projectMockRegionArr";
//import icon
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import TableChartIcon from "@material-ui/icons/TableChart";

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
    select: {
      marginBottom: 10,
    },
    cardContainer: {
      marginTop: 10,
    },
    description: {
      color: theme.palette.grey[600],
      marginBottom: 10,
    },
    statistics: {
      textAlign: "center",
    },
    numButton: {
      width: 120,
      margin: "0 20px",
    },
    num: {
      color: "#ffc570",
      textAlign: "center",
      fontSize: "4em",
    },
    numLabel: {
      textAlign: "right",
      color: "#ccc",
    },
    numCard: {
      // minWidth: 200,
    },
    filterItem: {
      witdh: "100%",
      display: "flex",
      marginRight: 48,
    },
    filterDelBtn: {
      width: 48,
      height: 48,
    },
    selectRegion: {
      marginLeft: 48,
    },
    addBtn: {
      marginLeft: 48,
      padding: theme.spacing(1),
    },
    filterItemContainer: {
      marginTop: theme.spacing(2),
    },
    btnContainer: {
      display: "flex",
      margin: theme.spacing(1) + "px auto",
      justifyContent: "space-around",
      maxWidth: 500,
      textAlign: "center",
    },
    infoDetail: {
      marginTop: theme.spacing(4),
    },
  })
);

/**
 * ! Router: /admin/modelManage/basicData
 * * Function:
 */
export const AdminBasicDataPage: React.FC = () => {
  // style
  const classes = useStyle();
  // history router
  const history = useHistory();
  const location = useLocation() as any;
  const userRole = useSelector(state => state.user.userRole);
  const userRouter = useSelector(
    (state) => state.openPage.projectUserAuthorization
  )[0].router;
  const projectNavMenuItems = flatNavMenu[userRole];
  const open = location.state ? location.state.fromEducationData!== undefined : false
  

  // open table
  const [openDetail, setOpenDetail] = useState(open);

  const handleOpenDetail = (openDetail) => {
    setOpenDetail(openDetail);
  };

  const handleOpenEducationData = () => {
    history.push({
      pathname: userRouter + projectNavMenuItems?.find(item => item.title === '教学数据管理').router,
      state: {
        fromBasicData: true
      }
    });
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography className={classes.pageTitle} variant="h5">
          基础数据管理
        </Typography>
        {openDetail && (
          <div>
            <Button
              endIcon={<TableChartIcon />}
              style={{ marginRight: 10 }}
              variant="outlined"
              color="primary"
              onClick={handleOpenEducationData}
            >
              查看教学数据
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ExitToAppIcon />}
              onClick={() => handleOpenDetail(false)}
            >
              返回
            </Button>
          </div>
        )}
      </Grid>

      {openDetail ? (
        <DetailDataGrid />
      ) : (
        <BasicInfoSelect handleOpenDetail={handleOpenDetail} />
      )}
    </div>
  );
};

const AreaDetail = {
  教师人数: 456,
  学生人数: 72652,
  课程数: 317,
};

const SchoolDetail = {
  教师人数: 118,
  学生人数: 3452,
  课程数: 42,
};

const BasicInfoSelect = (props) => {
  const classes = useStyle();
  const { handleOpenDetail } = props;
  const dispatch = useDispatch();

  const [selectArea, setSelectArea] = useState<any>(null);
  const [selectedData, setSelectedData] = useState({
    province: "",
    city: "",
    area: "",
    school: "",
  });

  const handleChangeData = (data) => {
    // console.log(data)
    setSelectedData(data);
    // dispatch action to reducer
    dispatch(setAreaOptions(data));
  };

  const handleCheckDetail = (checkType) => {
    if (checkType === "area") {
      setSelectArea(AreaDetail);
    } else if (checkType === "school") {
      setSelectArea(SchoolDetail);
    } else {
      setSelectArea(null);
    }
  };

  return (
    <>
      <div className={classes.select}>
        <Card>
          <CardContent>
            <CoordinateSelectRegion
              {...data}
              handleCheckDetail={handleCheckDetail}
              handleChangeData={handleChangeData}
              selectedData={selectedData}
              className={classes.selectRegion}
            />
            {selectArea && <FilterForm handleOpenDetail={handleOpenDetail} filterType={filterType.filter(type => type !== '教学数据')} filterData={filterData}/>}
          </CardContent>
        </Card>
      </div>
      {selectArea ? (
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          className={classes.infoDetail}
        >
          {Object.keys(selectArea).map((el, idx) => {
            return (
              <Grid item style={{ flexGrow: 1 }} key={idx}>
                <Card className={classes.numCard}>
                  <CardContent>
                    <Typography className={classes.num}>
                      {selectArea[el]}
                    </Typography>
                    <Typography className={classes.numLabel}>{el}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Card>
          <CardContent className={classes.textIntro}>
            <h2>选择相应的区域或学校查看对应信息</h2>
          </CardContent>
        </Card>
      )}
    </>
  );
};

const DetailDataGrid = (props) => {
  return <DataGrid initialData={studentBasicDataTable} colsProps={studentBasicDataTableColProps} />;
};
