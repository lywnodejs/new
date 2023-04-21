import React, { useState, useEffect, useCallback, useRef } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  DataGridPro,
  GridOverlay,
  useGridApiRef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridFooterContainer,
  GridSelectedRowCount,
  GridRowCount,
} from "@mui/x-data-grid-pro";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import { green } from "@material-ui/core/colors";
// import component
import { DialogBox, TextFormsErrorVerification } from "../";
import { renderCellExpand, renderStatus } from "./renderer";
// import icon
import AddIcon from "@material-ui/icons/Add";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
// import data
import { initialRows } from "./mockData";
import { zhCN } from "./zhCN";
import {
  defaultField2Name,
  defaultColsProps,
} from "../../../settings/projectMockData";

// 样式
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      height: "90%",
      width: "100%",
    },
    formStyle: {
      // justifyContent: 'center',
      marginRight: 10,

      "& > *": {
        margin: theme.spacing(1),
        width: "100%",
      },
    },
    alertMsgText: {
      textAlign: "center",
      color: theme.palette.grey[400],
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
    btnIcon: {
      marginRight: 6,
    },
    newRow: {},
    rowSpan: {
      display: "inline-block",
      borderRight: "2px solid #eee",
      marginRight: 5,
      padding: "0 5px",
      maxWidth: 150,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  })
);

// 接口
export interface customButtonProps {
  buttonName: string;
  buttonFunction(params?: any, event?: any): any;
  buttonColor?: "inherit" | "primary" | "secondary" | "default";
  buttonVariant?: "text" | "outlined" | "contained" | undefined;
}

interface DataGridProps {
  handleRowDoubleClick?(params, event): void;
  getMoreRows?(): void;
  initialData?: any[];
  height?: string | number;
  colsProps?: any[];
  canEdit?: boolean;
  handleCheckItem?(): void;
  handleEditItem?(): void;
  handleDelItem?(): void;
  handleAddItem?(): void;
  disableEdit?: boolean;
  disableDel?: boolean;
  disableCheck?: boolean;
  //自定义按钮
  customButtonList?: customButtonProps[];
  
}

const defaultRow = {
  id: 0,
  tool: "",
  company: "",
  frequency: 0,
  status: "",
  update_time: "",
};

// 辅助函数
async function sleep(duration) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const CustomLoadingOverlay = () => {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
};

const MAX_ROW_LENGTH = 50;

export const DataGrid: React.FC<DataGridProps> = (props) => {
  const {
    handleRowDoubleClick,
    initialData,
    colsProps = defaultColsProps,
    getMoreRows,
    canEdit = false,
    handleCheckItem,
    handleDelItem,
    handleEditItem,
    handleAddItem,
    disableDel = false,
    disableEdit = false,
    disableCheck = false,
    customButtonList,
    height,
  } = props;

  const field2Name = colsProps
    .filter((el) => el.headerName !== "操作")
    .map((el) => el.headerName);
  const classes = useStyles();
  const apiRef = useGridApiRef();
  const [loading, setLoading] = useState(false);
  // const [loadedRows, setLoadedRows] = useState([]);
  const [rows, setRows] = useState(initialData);
  // const mounted = useRef(true);

  const [openDialog, setOpenDialog] = useState(false);
  // the row onchange
  const [currentRow, setCurrentRow] = useState(defaultRow);
  const [newRow, setNewRow] = useState(defaultRow);
  const [showNewRow, setShowNewRow] = useState(false);
  // add or modify
  const [dialogStatus, setDialogStatus] = useState("");

  useEffect(() => {
    let t: any;
    if (showNewRow) {
      t = setTimeout(() => setShowNewRow(false), 2000);
    }
    return () => {
      // if (!showNewRow) {
      //   clearTimeout(t);
      // }
    };
  }, [showNewRow]);

  const Addrows = async (newRowLength) => {
    setLoading(true);
    const newData = getRandomRows(rows?.length, newRowLength);
    // Simulate network throttle
    await sleep(Math.random() * 500 + 100);

    setLoading(false);
    setRows(rows?.concat(newData as []));
  };

  const handleOnRowsScrollEnd = (params, event) => {
    // console.log('scroll', params, event)
    // 在筛选器生效时不能无限加载
    if (
      rows &&
      rows.length < MAX_ROW_LENGTH &&
      params.virtualRowsCount >= 10 &&
      !isFiltering()
    ) {
      // Addrows(10);
      if (getMoreRows) {
        getMoreRows();
      }
    }
  };

  const handleModify = (p) => {
    if (handleEditItem) {
      handleEditItem();
    } else {
      setOpenDialog(true);
      setDialogStatus("modify");
      setCurrentRow(p.row);
    }
  };

  const handleDelBtn = (p) => {
    if (handleDelItem) {
      handleDelItem();
    } else {
      //发送请求从数据库删除

      //视图上删除
      setRows(rows?.filter((el) => el.id !== p.id));
    }
  };

  const handleCheck = (p, e) => {
    if (handleCheckItem) {
      handleCheckItem();
    } else {
      handleRowDoubleClick?.(p, e);
    }
  };

  // 批量删除
  const handelDelSweepBtn = () => {
    const selection = Array.from(apiRef.current.getSelectedRows().keys());
    if (selection.length === 0) {
      //提示选择元素
    } else {
      setRows(rows?.filter((el) => selection.indexOf(el.id as number) === -1));
    }
  };

  // 关闭dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 更改某一行 或新建一行
  const handleChangeRow = (e) => {
    console.log(currentRow);
    if (dialogStatus === "modify") {
      const newRows = rows?.map((row) => {
        if (row.id === currentRow.id) {
          row = currentRow;
        }
        return row;
      });
      setRows(newRows);
      handleCloseDialog();
    } else {
      setNewRow({ ...currentRow, id: MAX_ROW_LENGTH + 1 });
      setShowNewRow(true);
    }
  };

  const handleAddRow = (e) => {
    if (handleAddItem) {
      handleAddItem();
    } else {
      setOpenDialog(true);
      setCurrentRow(defaultRow);
      setDialogStatus("add");
    }
  };

  const renderActions = (p) => (
    <>
      {customButtonList?.map((el, idx) => {
        return (
          <Button
            variant={el.buttonVariant ? el.buttonVariant : "contained"}
            color={el.buttonColor ? el.buttonColor : "primary"}
            size="small"
            style={{ marginLeft: 16 }}
            onClick={(e) => el.buttonFunction(p, e)}
          >
            {el.buttonName}
          </Button>
        );
      })}
      {!disableCheck && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={(e) => handleCheck(p, e)}
        >
          查看
        </Button>
      )}
      {!disableEdit && (
        <Button
          variant="outlined"
          // color="secondary"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={(e) => handleModify(p)}
        >
          修改
        </Button>
      )}
      {!disableDel && (
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={(e) => handleDelBtn(p)}
        >
          删除
        </Button>
      )}
    </>
  );
  const renderCellOptions = {
    cellExpand: renderCellExpand,
    status: renderStatus,
    actions: renderActions,
  };

  //处理colsprops
  const cols = colsProps.map((el, idx) => {
    const item = { field: el.field };

    Object.keys(el).forEach((key, keyID) => {
      if (key !== "renderCell") {
        item[key] = el[key];
      } else {
        item[key] = renderCellOptions[el[key]];
      }
    });
    return item;
  });

  const getRandomRows = (start, num) => {
    let randomRows: any[] = [];
    for (let i = 1; i <= num; i++) {
      randomRows.push({
        id: start + i,
        tool: "工具名字" + (start + i),
        company: "大华",
        frequency: Math.random() * 10000,
        status: "Success",
        update_time: "2021-09-11",
      });
    }
    return randomRows;
  };

  // dialog内容
  const renderDialogContent = () => {
    // 改变text值
    const handleChangeText =
      (prop) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentRow({ ...currentRow, [prop]: event.target.value });
      };

    return (
      <form className={classes.textForm} noValidate autoComplete="off">
        {Object.keys(currentRow).map((el, idx) => {
          if (dialogStatus === "add") {
            //添加时序号不能自定义
            if (el !== "id") {
              return (
                <TextFormsErrorVerification
                  label={field2Name[el]}
                  value={currentRow[el]}
                  handleChangeText={handleChangeText(el)}
                  key={idx}
                />
              );
            }
            return null;
          } else {
            return (
              <TextFormsErrorVerification
                label={field2Name[el]}
                value={currentRow[el]}
                handleChangeText={handleChangeText(el)}
                disabled={el === "id"}
                key={idx}
              />
            );
          }
        })}
      </form>
    );
  };

  //判断是否有筛选器正在生效
  const isFiltering = () => {
    const filters = apiRef.current.getState().filter.items;
    if (filters.length > 1) {
      return true;
    } else {
      if (filters.length === 1 && filters[0]["value"] !== "") {
        return true;
      }
      return false;
    }
  };

  const CustomFooter = () => {
    // console.log('apiref', apiRef.current)
    const getVisibleRowsLen = () => {
      const visibleRows = apiRef.current.getState().visibleRows.visibleRows;
      if (visibleRows) {
        return visibleRows.length;
      } else {
        return rows ? rows.length : 0;
      }
    };

    const selectionRowsLen = Array.from(
      apiRef.current.getSelectedRows().keys()
    ).length;
    return (
      <GridFooterContainer>
        {selectionRowsLen > 0 ? (
          <GridSelectedRowCount selectedRowCount={selectionRowsLen} />
        ) : (
          <div />
        )}
        <Fade in={showNewRow}>
          <div className={classes.newRow}>
            <span className={classes.rowSpan}>
              <CheckCircleIcon
                style={{ color: green[500], verticalAlign: "sub" }}
              />
              新的一行已添加：
            </span>
            {Object.keys(newRow).map((el, idx) => {
              return (
                <span className={classes.rowSpan}>
                  {field2Name[el]} : {newRow[el]}
                </span>
              );
            })}
          </div>
        </Fade>
        <GridRowCount
          rowCount={rows ? rows.length : 0}
          visibleRowCount={getVisibleRowsLen()}
        />
      </GridFooterContainer>
    );
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        {canEdit && (
          <>
            {/* 添加一行 */}
            <div>
              <Button
                size="small"
                variant="text"
                color="primary"
                onClick={handleAddRow}
              >
                <AddIcon fontSize="small" className={classes.btnIcon} /> 添加
              </Button>
            </div>
            {/* 批量删除 */}
            <div>
              <Button
                size="small"
                variant="text"
                color="primary"
                onClick={handelDelSweepBtn}
              >
                <DeleteSweepIcon fontSize="small" className={classes.btnIcon} />{" "}
                批量删除
              </Button>
            </div>
          </>
        )}
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          csvOptions={{ allColumns: true, utf8WithBom: true }}
        />
      </GridToolbarContainer>
    );
  };

  return (
    <div className={classes.root} style={{ height: height}}>
      <DataGridPro
        // {...data}
        localeText={zhCN}
        columns={cols}
        rows={rows ? rows : []}
        // rows={data.rows.concat(loadedRows)}
        components={{
          Toolbar: CustomToolbar,
          LoadingOverlay: CustomLoadingOverlay,
          Footer: CustomFooter,
        }}
        loading={loading}
        onRowsScrollEnd={handleOnRowsScrollEnd}
        checkboxSelection
        disableSelectionOnClick
        hideFooterPagination
        apiRef={apiRef}
        onRowDoubleClick={handleRowDoubleClick}
        // {...pagination}
      />
      <DialogBox
        boxSize={"md"}
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        title={dialogStatus === "add" ? "添加数据" : "修改数据"}
        content={renderDialogContent()}
        action={
          <>
            <Button color="secondary" onClick={handleCloseDialog}>
              取消
            </Button>
            <Button color="primary" autoFocus onClick={handleChangeRow}>
              确定
            </Button>
          </>
        }
      />
    </div>
  );
};
