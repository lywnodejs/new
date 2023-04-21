import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import MD style & components
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import {
  SelectFormsErrorVerification,
  TextFormsErrorVerification,
  DataGrid,
  DataTable,
  DialogBox,
  move,
  reorder,
} from "../../../components/common";
import {
  // studentBasicDataTable,
  // studentBasicDataTableColProps,
  relatedTableData,
  relatedTableHeader,
  modelList,
  analysisMethod,
  analysisFieldList,
  methodDescription,
} from "../../../settings/projectMockData";
import frequencyAnalysisImage from "../../../assets/image/charts/frequencyAnalysis.png";
import LinkIcon from "@material-ui/icons/Link";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useSelector } from "../../../redux/hooks";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 16,
    },
    pageTitle: {
      margin: "10px 0",
    },
    selectContainer: {
      display: "flex",
      alignItems: "center",
    },
    buttonContainer: {
      padding: theme.spacing(1),
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
    tipText: {
      textAlign: "center",
      margin: "40px 5px",
      fontSize: 20,
      color: "grey",
    },
    card: {
      height: 500,
      display: "flex",
      flexDirection: "column",
    },
    cardTitle: {
      borderBottom: "1px solid #eee",
      fontWeight: "bold",
      marginBottom: 10,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "end",
    },
    methodContainer: {
      border: "1px solid #ddd",
      padding: theme.spacing(1),
      height: 380,
      overflow: "hidden auto",
    },
    methodCategory: {
      margin: "10px 0",
    },
    methodList: {
      display: "flex",
      flexFlow: "row wrap",
      alignContent: "flex-start",
    },
    methodItem: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      margin: 5,
      width: "80%",
      height: "80%",
    },
    methodItemContainer: {
      textAlign: "center",
      flex: "0 0 50%",
    },
    analysisField: {
      display: "flex",
      justifyContent: "space-between",
    },
    dragItem: {
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1),
    },
    dragContainer: {
      minHeight: 200,
      // backgroundColor: '#ddd',
      overflow: "hidden auto",
    },
    fieldType: {
      border: "1px solid #eee",
      padding: 5,
      width: 50,
      textAlign: "center",
      borderRadius: 5,
    },
    introTitle: {
      fontWeight: "bold",
      marginTop: 10,
    },
  })
);

interface DataAnalysisPageProps {}

export const DataAnalysisPage: React.FC<DataAnalysisPageProps> = (props) => {
  const classes = useStyle();
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [tableHeader, setTableHeader] = useState([""]);
  const [tableData, setTableData] = useState([[""]]);

  const tableList = [
    "三年级语文学科教案数据",
    "三年级3班全体学生美育数据",
    "三年级2班全体学生美育数据",
  ];

  const handleSelectedTable = (e) => {
    setSelectedTable(e.target.value);
  };

  const handleSelectedModel = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleGetTable = () => {
    setTableData(relatedTableData);
    setTableHeader(relatedTableHeader);
    setShowTable(true);
  };

  const handleDownloadTable = () => {};

  // 打开保存数据表dialog
  const handleSaveTable = () => {
    setOpenDialog(true);
  };

  const handleAnalyse = () => {
    setShowAnalysis(true);
  };
  // 关闭dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.pageTitle} variant="h5">
        数据分析
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <div className={classes.selectContainer}>
                <SelectFormsErrorVerification
                  width={200}
                  label="数据表"
                  value={selectedTable}
                  handleChangeSelect={handleSelectedTable}
                  items={tableList}
                />
                <LinkIcon />
                <SelectFormsErrorVerification
                  width={200}
                  label="模型"
                  value={selectedModel}
                  handleChangeSelect={handleSelectedModel}
                  items={[...modelList, "不使用任何模型"]}
                />
                <Button
                  // size="small"
                  color="primary"
                  variant="contained"
                  onClick={handleGetTable}
                >
                  生成
                </Button>
              </div>
              {showTable ? (
                <>
                  <div style={{ maxWidth: "80vw" }}>
                    <DataTable
                      headMinWidth={80}
                      header={tableHeader}
                      data={tableData}
                      overflowEllipsis
                    />
                  </div>
                  <DialogBox
                    boxSize={"md"}
                    openDialog={openDialog}
                    handleCloseDialog={handleCloseDialog}
                    title={"保存数据表"}
                    content={<SaveDialogContent title={"数据表名称"} />}
                    action={
                      <>
                        <Button color="secondary" onClick={handleCloseDialog}>
                          取消
                        </Button>
                        <Button
                          color="primary"
                          autoFocus
                          onClick={handleCloseDialog}
                        >
                          确定
                        </Button>
                      </>
                    }
                  />
                  <div
                    className={classes.buttonContainer}
                    style={{
                      textAlign: "right",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      onClick={handleDownloadTable}
                      style={{ marginRight: 30 }}
                    >
                      下载
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      variant="outlined"
                      onClick={handleSaveTable}
                    >
                      保存
                    </Button>
                  </div>
                  <div
                    className={classes.buttonContainer}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={handleAnalyse}
                    >
                      开始分析
                    </Button>
                  </div>
                </>
              ) : (
                <div className={classes.tipText}>
                  <div>请选择数据表和模型</div>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
        {showAnalysis && <AnalysisDetail />}
      </Grid>
    </div>
  );
};

interface SaveDialogContentProps {
  title: string,
}

// dialog内容
const SaveDialogContent: React.FC<SaveDialogContentProps> = ({ title }) => {
  const classes = useStyle();
  const [value, setValue] = useState("");
  // 改变text值
  const handleChangeText = (event) => {
    setValue(event.target.value);
  };

  return (
    <form className={classes.textForm} noValidate autoComplete="off">
      <TextFormsErrorVerification
        label={title}
        value={value}
        handleChangeText={handleChangeText}
      />
    </form>
  );
};

// 数据分析
const AnalysisDetail: React.FC = (props) => {
  const classes = useStyle();
  // router
  const history = useHistory();
  const role = useSelector(state => state.user.userRole);
  const userRouter = useSelector(state => state.openPage.projectUserAuthorization).find(el => el.role === (role || '系统管理员')).router;
 
  // state
  const [selectAnalysisMethod, setSelectAnalysisMethod] = useState("");
  const [selectedList, setSelectedList] = useState<any[]>([]);
  const [toBeSelectedList, setToBeSelectedList] = useState(analysisFieldList);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const handleSelectAnalysisMethod = (method) => {
    setSelectAnalysisMethod(method);
  };

  const handleOpenDetailDialog = () => {
    setOpenDetailDialog(true);
  };

  // 打开保存数据表dialog
  const handleSaveTable = () => {
    setOpenSaveDialog(true);
  };

  // 关闭dialog
  const handleCloseDialog = () => {
    setOpenDetailDialog(false);
    setOpenSaveDialog(false);
  };

  const handleReset = () => {
    setToBeSelectedList(analysisFieldList);
    setSelectedList([]);
  };

  const handleGenerateGraph = () => {
    console.log(userRouter)
    
    if(userRouter === '/teacher'){
      history.push({
        pathname: "/teacher/resultManage/graphManage",
      });
    }else{
      history.push({
        pathname: "/researcher/modelApply/modelUsing",
      });
      window.location.reload()
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }

    const sInd = source.droppableId;
    const dInd = destination.droppableId;

    if (sInd !== dInd) {
      // drop in different block
      let result;
      if (sInd === "selectedList") {
        //从右到左
        result = move(selectedList, toBeSelectedList, source, destination);
      } else {
        //从左到右
        result = move(toBeSelectedList, selectedList, source, destination);
      }
      setSelectedList(result.selectedList);
      setToBeSelectedList(result.list);
    } else {
      if (sInd === "list") {
        setToBeSelectedList(
          reorder(toBeSelectedList, source.index, destination.index)
        );
      } else {
        setSelectedList(reorder(selectedList, source.index, destination.index));
      }
    }
  };

  const AnalysisFieldItem = (props) => {
    const { field, type } = props;
    const color = type === "基础" ? "#4b9fea" : "#ffc570";

    return (
      <div className={classes.analysisField}>
        {field}
        <div
          className={classes.fieldType}
          style={{
            color: color,
            borderColor: color,
          }}
        >
          {type}
        </div>
      </div>
    );
  };

  return (
    <>
      <Grid item xs={3}>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.cardTitle} variant="h6">
              数据分析
            </Typography>
            <Typography className={classes.cardTitle} variant="subtitle1">
              选择算法
            </Typography>
            <div className={classes.methodContainer}>
              <Button
                variant="outlined"
                color="primary"
                style={{
                  margin: 10,
                }}
                onClick={() => handleSelectAnalysisMethod("不选择任何算法")}
              >
                不选择任何算法
              </Button>
              {analysisMethod.map((el) => {
                return (
                  <div>
                    <div className={classes.methodCategory}>{el.category}</div>
                    <div className={classes.methodList}>
                      {el.methods.map((item) => (
                        <div className={classes.methodItemContainer}>
                          <Button
                            variant="outlined"
                            color="primary"
                            className={classes.methodItem}
                            onClick={() => handleSelectAnalysisMethod(item)}
                          >
                            {item}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </Grid>

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid item xs={3}>
          <Card className={classes.card}>
            <CardContent>
              <div className={classes.cardTitle}>
                <Typography
                  style={{
                    fontWeight: "bold",
                  }}
                  variant="h6"
                >
                  全部指标
                </Typography>
                <Typography variant="subtitle1">
                  已选：{selectedList.length}
                </Typography>
              </div>
              {/* 拖动 */}
              <Droppable droppableId="list">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={classes.dragContainer}
                    style={{
                      height: 420,
                    }}
                  >
                    {toBeSelectedList.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            id={item.id}
                            className={classes.dragItem}
                          >
                            <AnalysisFieldItem {...item} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.card}>
            <CardContent>
              {selectAnalysisMethod.length ? (
                <>
                  <Typography className={classes.cardTitle} variant="h6">
                    {selectAnalysisMethod}
                  </Typography>
                  <div
                    style={{
                      height: 420,
                      overflow: "hidden auto",
                    }}
                  >
                    {methodDescription[selectAnalysisMethod] && (
                      <Typography variant="body1">
                        {methodDescription[selectAnalysisMethod]}
                        <Button
                          variant="text"
                          endIcon={<ChevronRightIcon />}
                          color="primary"
                          onClick={handleOpenDetailDialog}
                        >
                          详细
                        </Button>
                      </Typography>
                    )}
                    {/* 放置 */}
                    <Droppable droppableId="selectedList">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={classes.dragContainer}
                          style={{
                            border: "1px dashed #aaa",
                          }}
                        >
                          {selectedList.length ? (
                            selectedList.map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    id={item.id}
                                    className={classes.dragItem}
                                  >
                                    <AnalysisFieldItem {...item} />
                                  </div>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <div className={classes.tipText}>
                              拖拽变量到此区域
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    <div
                      className={classes.buttonContainer}
                      style={{
                        textAlign: "right",
                      }}
                    >
                      <Button
                        size="small"
                        color="primary"
                        variant="contained"
                        onClick={handleReset}
                        style={{ marginRight: 30 }}
                      >
                        重置
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        variant="outlined"
                        onClick={handleSaveTable}
                      >
                        生成图表
                      </Button>
                    </div>
                    <DialogBox
                      boxSize={"md"}
                      openDialog={openSaveDialog}
                      handleCloseDialog={handleCloseDialog}
                      title={"生成图表名字"}
                      content={<SaveDialogContent title={"生成图表名字"}/>}
                      action={
                        <>
                          <Button color="secondary" onClick={handleCloseDialog}>
                            取消
                          </Button>
                          <Button
                            color="primary"
                            autoFocus
                            onClick={handleGenerateGraph}
                          >
                            生成
                          </Button>
                        </>
                      }
                    />
                  </div>
                </>
              ) : (
                <div
                  className={classes.tipText}
                  style={{
                    lineHeight: "300px",
                  }}
                >
                  请选择数据分析算法
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </DragDropContext>
      <DialogBox
        boxSize={"md"}
        openDialog={openDetailDialog}
        handleCloseDialog={handleCloseDialog}
        title={selectAnalysisMethod}
        content={<DetailDialogContent />}
        action={
          <>
            <Button color="primary" autoFocus onClick={handleCloseDialog}>
              我知道了
            </Button>
          </>
        }
      />
    </>
  );
};

// dialog内容
const DetailDialogContent: React.FC = () => {
  const classes = useStyle();

  return (
    <div>
      <Typography variant="h6" className={classes.introTitle}>
        详细解释
      </Typography>
      <Typography variant="body1">
        频数分析是对一组数据的不同数值的频数，或者数据落入指定区域内的频数进行统计，了解其数据分布状况的方式。通过频数分析，能在一定程度上反映出样本是否具有总体代表性，抽样是否存在系统偏差，并以此证明以后相关问题分析的代表性和可信性。
      </Typography>
      <Typography
        variant="body2"
        style={{
          color: "#aaa",
          display: "flex",
        }}
      >
        <img alt="" src={frequencyAnalysisImage} />
        示例： 汇总统计某个学校性别这个变量的男性、 女性的个数
      </Typography>

      <Typography variant="h6" className={classes.introTitle}>
        输入输出描述
      </Typography>
      <Typography variant="body1">输入：一个或多个定类变量</Typography>
      <Typography variant="body1">
        输出：每个定类变量中不同类别样本的的分布状况与频数统计
      </Typography>

      <Typography variant="h6" className={classes.introTitle}>
        更多信息
      </Typography>
    </div>
  );
};
