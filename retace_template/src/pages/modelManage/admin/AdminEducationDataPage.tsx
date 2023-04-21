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
// import customize components
import {
  DataGrid,
  CoordinateSelectRegion,
  CoordinateSelectDetail,
  FilterForm,
  DialogBox,
  TextFormsErrorVerification,
} from "../../../components/common";
// import Mock Data
import {
  thirdPartyAppTable,
  teacherTable,
  teacherColProps,
  filterType,
  filterData,
} from "../../../settings/projectMockData";
import { data } from "../../../settings/projectMockRegionArr";
import { useSelector } from "../../../redux/hooks";
import { flatNavMenu } from "../../../settings/newProjectNavMenu";
//import icon
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SaveIcon from "@material-ui/icons/Save";

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
    textForm: {
      width: 500,
      justifyContent: "center",
      marginRight: 20,
      // marginLeft: 35,
      "& > *": {
        margin: "8px 8px",
        width: "100%",
      },
    },
  })
);

/**
 * ! Router: /admin/modelManage/basicData
 * * Function:
 */
export const AdminEducationDataPage: React.FC = () => {
  // router
  const history = useHistory();
  const location = useLocation() as any;

  const userRole = useSelector((state) => state.user.userRole);
  const userRouter = useSelector(
    (state) => state.openPage.projectUserAuthorization
  )[0].router;
  const projectNavMenuItems = flatNavMenu[userRole];

  // style
  const classes = useStyle();
  // open table
  const [openDetail, setOpenDetail] = useState(false);
  // open save dialog
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDetail = (openDetail) => {
    setOpenDetail(openDetail);
  };

  const handleReturnBasicData = () => {
    // history.goBack()
    history.push({
      pathname:
        userRouter +
        projectNavMenuItems?.find((item) => item.title === "基础数据管理")
          .router,
      state: {
        fromEducationData: true,
      },
    });
  };

  // 打开保存数据表dialog
  const handleSaveTable = () => {
    setOpenDialog(true);
  };

  // 关闭dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // dialog内容
  const DialogContent: React.FC = () => {
    const [value, setValue] = useState("");
    // 改变text值
    const handleChangeText = (event) => {
      setValue(event.target.value);
    };

    return (
      <form className={classes.textForm} noValidate autoComplete="off">
        <TextFormsErrorVerification
          label={"数据表名称"}
          value={value}
          handleChangeText={handleChangeText}
        />
      </form>
    );
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
          教学数据管理
        </Typography>
        <div>
          {location.state && !openDetail && (
            <Button
              variant="contained"
              color="primary"
              endIcon={<ExitToAppIcon />}
              onClick={handleReturnBasicData}
              style={{ marginRight: 10 }}
            >
              返回基础数据管理
            </Button>
          )}
          {openDetail && (
            <>
              <Button
                endIcon={<SaveIcon />}
                style={{ marginRight: 10 }}
                variant="outlined"
                color="primary"
                onClick={handleSaveTable}
              >
                保存
              </Button>
              <Button
                variant="contained"
                color="primary"
                endIcon={<ExitToAppIcon />}
                onClick={() => handleOpenDetail(false)}
              >
                返回
              </Button>
            </>
          )}
        </div>
      </Grid>

      {openDetail ? (
        <>
          <DetailDataGrid />
          <DialogBox
            boxSize={"md"}
            openDialog={openDialog}
            handleCloseDialog={handleCloseDialog}
            title={"保存教学数据表"}
            content={<DialogContent />}
            action={
              <>
                <Button color="secondary" onClick={handleCloseDialog}>
                  取消
                </Button>
                <Button color="primary" autoFocus onClick={handleCloseDialog}>
                  确定
                </Button>
              </>
            }
          />
        </>
      ) : (
        <BasicInfoSelect
          handleOpenDetail={handleOpenDetail}
          locationState={location.state}
        />
      )}
    </div>
  );
};

const BasicInfoSelect = (props) => {
  const classes = useStyle();
  const { handleOpenDetail, locationState } = props;
  const defaultAreaOption = {
    province: "",
    city: "",
    area: "",
    school: "",
  };
  const areaOption = useSelector((state) => state.basicData.areaOption);
  const filterOption = useSelector((state) => state.basicData.filterOption);

  const [selectArea, setSelectArea] = useState<any>(
    locationState ? true : false
  );
  const [selectedData, setSelectedData] = useState(
    locationState ? areaOption : defaultAreaOption
  );

  const handleChangeData = (data) => {
    setSelectedData(data);
  };

  const handleCheckDetail = (checkType) => {
    if (checkType) {
      setSelectArea(true);
    } else {
      setSelectArea(false);
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
              className={classes.selectRegion}
              handleChangeData={handleChangeData}
              selectedData={selectedData}
            />

            {selectArea && (
              <FilterForm
                handleOpenDetail={handleOpenDetail}
                dateRangePicker={true}
                filterInitialList={locationState ? filterOption : undefined}
                filterType={filterType}
                filterData={filterData}
              />
            )}
          </CardContent>
        </Card>
      </div>
      {!selectArea && (
        <Card>
          <CardContent className={classes.textIntro}>
            <h2>选择相应的区域或学校进行查询</h2>
          </CardContent>
        </Card>
      )}
    </>
  );
};

const DetailDataGrid = (props) => {
  return <DataGrid initialData={teacherTable} colsProps={teacherColProps} />;
};
