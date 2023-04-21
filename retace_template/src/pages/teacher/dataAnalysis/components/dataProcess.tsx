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
import {
  SelectFormsErrorVerification,
  TextFormsErrorVerification,
  Datepicker,
  TransferListBox,
  DataGrid,
  DialogBox,
} from "../../../../components/common";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // padding: 16,
    },
    pageTitle: {
      margin: "10px 0",
    },
    select: {
      display: "flex",
      width: "100%",
      // maxWidth: 600,
      margin: theme.spacing(1),
    },
    buttonContainer: {
      margin: theme.spacing(2),
    },
    mgRight30: {
      marginRight: 30,
    },
    generateBtn: {
      width: "100%",
      margin: "auto",
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

interface DataProcessProps {
  selectLabel: string;
  selectOptionList: string[];
  transferMockList: string[];
  dataGridData: any[];
  dataGridColProps: any[];
}

export const DataProcess: React.FC<DataProcessProps> = (props) => {
  const classes = useStyle();
  const {
    selectLabel,
    selectOptionList,
    transferMockList,
    dataGridColProps,
    dataGridData,
  } = props;

  const [selected, setSelected] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transferList, setTransferList] = useState<any[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedListItems, setSelectedListItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  // router
  const history = useHistory();

  const handleChangeSelect = (e) => {
    setSelected(e.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleSearch = () => {
    setTransferList(transferMockList);
  };

  const handleReset = () => {
    setTransferList([]);
    setSelected("");
    setStartDate(null);
    setEndDate(null);
  };

  const handleGenerate = () => {
    setShowTable(true);
  };

  const handleSave = () => {
    setOpenDialog(true);
  };

  // 关闭dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAnalyse = () => {
    history.push("/teacher/dataAnalysis/dataAnalysis");
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card className={classes.root}>
          <CardContent>
            <div className={classes.select}>
              <SelectFormsErrorVerification
                width={120}
                style={{
                  flex: 0.2,
                }}
                label={selectLabel}
                value={selected}
                handleChangeSelect={handleChangeSelect}
                items={selectOptionList}
              />
              <Datepicker
                startDate={startDate}
                endDate={endDate}
                handleEndDateChange={handleEndDateChange}
                handleStartDateChange={handleStartDateChange}
              />
            </div>
            <div className={classes.buttonContainer}>
              <Button
                variant="contained"
                onClick={handleSearch}
                color="primary"
                className={classes.mgRight30}
              >
                查询
              </Button>
              <Button variant="contained" onClick={handleReset}>
                重置条件
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card className={classes.root}>
          <CardContent>
            <TransferListBox
              toBeSelectedItems={transferList}
              boxWidth={240}
              boxHeight={245}
              right={selectedListItems}
              setRight={(list) => setSelectedListItems(list)}
            />
            <div className={classes.buttonContainer}>
              <Button
                variant="contained"
                onClick={handleGenerate}
                color="primary"
                className={classes.generateBtn}
                disabled={selectedListItems.length === 0}
              >
                生成
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>
      {showTable && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <DataGrid
                initialData={dataGridData}
                colsProps={dataGridColProps}
                height={400}
              />
              <DialogBox
                boxSize={"md"}
                openDialog={openDialog}
                handleCloseDialog={handleCloseDialog}
                title={"保存数据表"}
                content={<SaveDialogContent />}
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
                style={{ textAlign: "right" }}
              >
                <Button
                  variant="contained"
                  onClick={handleSave}
                  color="primary"
                  className={classes.mgRight30}
                >
                  保存
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleAnalyse}
                  color="primary"
                >
                  分析
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

// dialog内容
const SaveDialogContent: React.FC = () => {
  const classes = useStyle();
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
