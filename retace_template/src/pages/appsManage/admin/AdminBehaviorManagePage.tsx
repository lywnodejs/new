import React, { useState, useEffect } from "react";
// import Customize Components
import {
  DataTable,
  AlertBox,
  DialogBox,
  DataGrid,
  menuProps,
  CoordinateSelectDetail,
} from "../../../components/common";
// import Redux
import { useSelector } from "../../../redux/hooks";
// Dropzone
import { Dropzone, FileItem, FullScreenPreview } from "dropzone-ui";
// transition group
import { TransitionGroup } from "react-transition-group";
// import MD style
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
// import MD components
import {
  Grid,
  Paper,
  Button,
  Typography,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
  Card,
  CardContent,
  Collapse,
  IconButton,
} from "@material-ui/core";
// import MD Icon
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

// import mock data
import {
  appBehaviorListColsProps,
  appBehaviorListTable,
  modelList,
  attributes,
} from "../../../settings/projectMockData";
import appImg2 from "../../../assets/image/apps/appImage2.jpg";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      height: "100%",
    },
    pageTitle: {
      margin: "10px 0",
    },
  })
);

export const AdminBehaviorManagePage = () => {
  const classes = useStyle();
  // state
  const [openDetail, setOpenDetail] = useState("");

  // datagrid function
  const handleEditItem = () => {
    setOpenDetail("editAppBehavior");
  };

  const handleCheckItem = () => {
    setOpenDetail("checkAppBehavior");
  };

  const handleAddItem = () => {
    setOpenDetail("addAppBehavior");
  };

  const handleExit = () => {
    setOpenDetail("");
  };

  return (
    <div className={classes.root}>
      {openDetail !== "" ? (
        <>
          <AppBehaviorDetail handleExit={handleExit} openType={openDetail} />
        </>
      ) : (
        <>
          <Typography className={classes.pageTitle} variant="h5">
            应用行为管理
          </Typography>
          <DataGrid
            initialData={appBehaviorListTable}
            colsProps={appBehaviorListColsProps}
            handleEditItem={handleEditItem}
            handleCheckItem={handleCheckItem}
            handleAddItem={handleAddItem}
            canEdit
          />
        </>
      )}
    </div>
  );
};

const AppBehaviorDetail = (props) => {
  const classes = useStyle();
  const { handleExit, openType } = props;

  const defaultBehaviorItem = {
    companyName: "大华",
    toolName: "工具1",
    behaviorName: "观看视频",
    appImg: appImg2,
    functionIntro:
      "功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍功能介绍",
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography className={classes.pageTitle} variant="h5">
          {openType === "checkAppBehavior"
            ? "应用行为信息查看"
            : "应用行为信息注册"}
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
      {openType === "checkAppBehavior" ? (
        <CheckAppBehavior {...defaultBehaviorItem} />
      ) : (
        <AddAppBehavior handleExit={handleExit} />
      )}
    </>
  );
};

const useBehaviorDetailStyles = makeStyles((theme: Theme) =>
  createStyles({
    behaviorDetailRoot: {
      margin: "0 auto",
      maxWidth: 800,
    },
    formItem: {
      margin: theme.spacing(2),
      minWidth: 120,
      flex: 1,
    },
    card: {
      marginTop: 20,
    },
    infoContainer: {
      display: "flex",
      marginTop: 5,
      justifyContent: "space-between",
    },
    btnContainer: {
      display: "flex",
      maxWidth: 300,
      margin: "20px auto",
      justifyContent: "space-around",
    },
    appImg: {
      width: "100%",
    },
    selectItem: {
      witdh: "100%",
      display: "flex",
      alignItems: "center",
    },
    selectDelBtn: {
      width: 48,
      height: 48,
    },
    addBtn: {
      marginLeft: 48,
      padding: theme.spacing(1),
    },
    select: {
      margin: theme.spacing(1),
      minWidth: 120,
      width: "100%",
    },
  })
);

const toolList = ["工具1", "工具2", "工具3", "工具4", "工具5"];
const companyList = ["大华"];
const changeNum = ["零", "一", "二", "三", "四", "五", "六"];

const AddAppBehavior = (props) => {
  const classes = useBehaviorDetailStyles();
  const { handleExit } = props;
  // Dropzone state
  const [files, setFiles] = useState([]);
  const [imageSrc, setImageSrc] = useState(undefined);
  // select state
  const [companyName, setCompanyName] = useState("大华");
  const [toolName, setToolName] = useState("");

  // Dropzone
  const updateFiles = (incommingFiles) => {
    console.log("incomming files", incommingFiles);
    setFiles(incommingFiles);
  };
  const onDelete = (id) => {
    setFiles(files.filter((x) => x["id"] !== id));
  };
  const handleSee = (imageSource) => {
    setImageSrc(imageSource);
  };

  // select function
  const handleChangeToolName = (e) => {
    setToolName(e.target.value);
  };

  // button function
  const handleSave = () => {
    handleExit();
  };
  const handleDel = () => {};

  return (
    <div className={classes.behaviorDetailRoot}>
      <Dropzone
        style={{ minWidth: "300px", width: "100%" }}
        //view={"list"}
        onChange={updateFiles}
        value={files}
        maxFiles={1}
        //header={false}
        // footer={false}
        maxFileSize={2998000}
        label="将图片拖拽至此处或点击上传"
        //label="Suleta tus archivos aquí"
        accept=".png,image/*"
        // uploadingMessage={"Uploading..."}
        // url="http://ec2-99-99-9-9.compute-1.amazonaws.com:2800/upload-my-file"
        //of course this url doens´t work, is only to make upload button visible
        //uploadOnDrop
        //clickable={false}
        fakeUploading
        //localization={"ES-es"}
      >
        {files.map((file) => (
          <FileItem
            {...file}
            onDelete={onDelete}
            onSee={handleSee}
            //localization={"ES-es"}
            preview
            info
            hd
          />
        ))}
        <FullScreenPreview
          imgSource={imageSrc}
          openImage={imageSrc}
          onClose={(e) => handleSee(undefined)}
        />
      </Dropzone>
      <Card className={classes.card}>
        <CardContent>
          <div className={classes.infoContainer}>
            <FormControl className={classes.formItem}>
              <InputLabel>厂商名称</InputLabel>
              <Select
                value={companyName}
                // onChange={handleChangeToolName}
                MenuProps={menuProps}
                disabled
              >
                {companyList.map((el, idx) => {
                  return <MenuItem value={el}>{el}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <FormControl className={classes.formItem}>
              <InputLabel>教学工具</InputLabel>
              <Select
                value={toolName}
                onChange={handleChangeToolName}
                MenuProps={menuProps}
              >
                {toolList.map((el, idx) => {
                  return <MenuItem value={el}>{el}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <FormControl className={classes.formItem}>
              <TextField label="行为名称" />
            </FormControl>
          </div>

          <div className={classes.infoContainer}>
            <FormControl className={classes.formItem}>
              <TextField label="页面功能介绍" multiline />
            </FormControl>
          </div>
        </CardContent>
      </Card>
      <div className={classes.btnContainer}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          保存
        </Button>
        <Button variant="outlined" color="primary" onClick={handleDel}>
          删除
        </Button>
      </div>
    </div>
  );
};

export const CheckAppBehavior = (props) => {
  const classes = useBehaviorDetailStyles();

  const {
    appImg,
    companyName,
    toolName,
    behaviorName,
    functionIntro,
    relation,
  } = props;

  const [modelName, setModelName] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([""]);

  const handleChangeModelName = (e) => {
    setModelName(e.target.value);
    setSelectedAttributes([""])
  };

  const onAddSelect = () => {
    if (
      selectedAttributes.indexOf("") === -1 &&
      getMenuItemList(selectedAttributes.length).length !== 0
    ) {
      setSelectedAttributes([...selectedAttributes, ""]);
    }
  };
  const onDelSelect = (selectID) => {
    setSelectedAttributes(
      selectedAttributes.filter((el, idx) => idx < selectID)
    );
  };

  const handleChangeAttribute = (e, selectID) => {
    let arr = selectedAttributes.filter((el, idx) => idx <= selectID);
    arr[selectID] = e.target.value;
    setSelectedAttributes([...arr]);
  };

  const getMenuItemList = (idx) => {
    if (idx === 0) {
      return attributes[modelName];
    } else {
      let arr = attributes[modelName];
      for (let i = 0; i < idx; i++) {
        arr = arr.find((el) => el.name === selectedAttributes[i])?.children;
        console.log('arr', arr)
        if (!arr) {
          return [];
        }
      }
      return arr;
    }
  };

  return (
    <Grid
      className={classes.behaviorDetailRoot}
      style={{
        maxWidth: relation ? 1200 : 1000,
      }}
      container
      spacing={4}
    >
      <Grid item xs={3}>
        <Card className={classes.card} style={{ height: "100%" }}>
          <CardContent>
            <img alt="" src={appImg} className={classes.appImg} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs>
        <Card className={classes.card} style={{ height: "100%" }}>
          <CardContent>
            <div className={classes.infoContainer}>
              <TextField
                label="厂商名称"
                variant="outlined"
                defaultValue={companyName}
                className={classes.formItem}
                inputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className={classes.infoContainer}>
              <TextField
                label="教学工具"
                variant="outlined"
                inputProps={{
                  readOnly: true,
                }}
                defaultValue={toolName}
                className={classes.formItem}
              />
            </div>
            <div className={classes.infoContainer}>
              <TextField
                label="行为名称"
                variant="outlined"
                inputProps={{
                  readOnly: true,
                }}
                defaultValue={behaviorName}
                className={classes.formItem}
              />
            </div>
            <div className={classes.infoContainer}>
              <TextField
                label="页面功能介绍"
                variant="outlined"
                inputProps={{
                  readOnly: true,
                }}
                defaultValue={functionIntro}
                multiline
                className={classes.formItem}
              />
            </div>
          </CardContent>
        </Card>
      </Grid>
      {relation && (
        <Grid item xs={4}>
          <Card className={classes.card} style={{ height: "100%" }}>
            <CardContent>
              <div className={classes.infoContainer}>
                <FormControl className={classes.formItem}>
                  <InputLabel>选择模型名称</InputLabel>
                  <Select
                    value={modelName}
                    onChange={handleChangeModelName}
                    MenuProps={menuProps}
                  >
                    {modelList.map((el, idx) => {
                      return <MenuItem value={el}>{el}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </div>
              {modelName && (
                <>
                  <div>
                    <TransitionGroup>
                      {selectedAttributes?.map((el, idx) => {
                        return (
                          <Collapse key={idx}>
                            <div className={classes.selectItem}>
                              {idx !== 0 ? (
                                <IconButton
                                  className={classes.selectDelBtn}
                                  onClick={() => onDelSelect(idx)}
                                >
                                  <RemoveIcon />
                                </IconButton>
                              ) : (
                                <IconButton
                                  className={classes.selectDelBtn}
                                  disabled
                                />
                              )}
                              <FormControl
                                size="small"
                                variant="outlined"
                                className={classes.select}
                              >
                                <InputLabel>
                                  选择{changeNum[idx + 1]}级属性
                                </InputLabel>
                                <Select
                                  value={selectedAttributes[idx]}
                                  onChange={(e) =>
                                    handleChangeAttribute(e, idx)
                                  }
                                  MenuProps={menuProps}
                                  label="选择一级属性"
                                >
                                  {getMenuItemList(idx).map((el, idx) => {
                                    return (
                                      <MenuItem value={el.name}>
                                        {el.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </div>
                          </Collapse>
                        );
                      })}
                    </TransitionGroup>
                  </div>
                  <div className={classes.addBtn}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={onAddSelect}
                      // disabled={filterList.length >= filterType.length}
                    >
                      选择下一级属性
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};
