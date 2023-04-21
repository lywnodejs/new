import React, { useEffect, useState } from "react";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Slide from "@material-ui/core/Slide";
import { TextField, Select, MenuItem } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Paper, Button } from "@material-ui/core";
import AddBoxIcon from '@material-ui/icons/AddBox';
import CancelIcon from '@material-ui/icons/Cancel';
// import customize components
import { TextFormsErrorVerification, SelectFormsErrorVerification } from "..";
// import mock data
import {
  analysisModels,
  basicMockDatabaseTree,
} from "../../../settings/projectMockData";
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => createStyles({
  closeIcon: {
    fontSize: 14,
    // marginTop: 10,
    "&:hover": {
      color: 'steelblue',
      cursor: 'pointer'
    }
  },
}));

const featureEngineerModels = analysisModels[0];
const dataAnalysisModels = analysisModels[1];
let indexID = 1;

const SideBar = ({ open, clickElement, elements }) => {
  const [inputComputingNumbers, setInputComputingNumbers] = useState(0);
  const classes = useStyles();
  const elementType = clickElement != null ? clickElement.type : null;
  const elementLabel = clickElement != null ? clickElement.data.label : "量化模型配置";
  // 输出结果选择
  const [outputStyle, setOutputStyle] = useState('');

  const handleChangeSelectStyle = (event) => {
    setOutputStyle(event.target.value);
  };

  // 等级指标Paper组件添加与删除
  const [indexArray, setIndexArray] = useState([1]);

  const handleAddIndex = () => {
    const newIndexID = ++indexID;
    setIndexArray([
      ...indexArray,
      newIndexID
    ]);
  };

  useEffect(() => {
    // 计算Node
    let number = 0;
    if (clickElement && clickElement.type === 'computingNode') {
      elements.map(elm => {
        // 判断是否有edge
        if (elm.hasOwnProperty('target') && elm.target === clickElement.id) {
          number += 1;
        }
      });
    }
    setInputComputingNumbers(number);
  }, [clickElement, elements]);

  const settingElement = () => {
    if (elementLabel === "量化模型配置") {
      return (
        <div style={{ textAlign: 'center', margin: '40px 5px', fontSize: 19, color: 'grey' }}>
          <div>请点击“选择/创建量化模型”，调出需要配置或创建的量化分析模型</div>
        </div>
      );
    } else if (elementType === "inputNode") {
      return (
        <div>
          选择输入的基础数据表或分类后的数据
          <div className="formStyle">
            <SelectFormsErrorVerification
              label={"选择数据表"}
              // value={inputDataState}
              /**
               * 
               */
              items={[
                "三年级语文学科教案数据",
                "三年级2班全体学生美育数据",
                "三年级3班全体学生美育数据",
              ]}
            // handleChangeSelect={handleInputDataState}
            />
          </div>
        </div>
      );
    } else if (elementType === "outputNode") {
      return (
        <div style={{ marginLeft: -5, width: '100%' }}>
          <SelectFormsErrorVerification
            label={"呈现方式"}
            items={[
              "柱状图",
              "直方图",
              "折线图",
              "散点图",
              "雷达图",
            ]}
            value={outputStyle}
            handleChangeSelect={handleChangeSelectStyle}
          />
          {
            outputStyle !== '雷达图' &&
            <SelectFormsErrorVerification
              label={"x轴名称"}
              items={[
                "时间",
                "姓名",
              ]}
            />
          }
        </div>
      );
    } else if (elementType === "computingNode") {
      let dataTable = [];
      console.log('input numbers:', inputComputingNumbers);
      for (let index = 1; index <= inputComputingNumbers; index++) {
        dataTable.push(index);
      }
      return (
        <div>
          {
            inputComputingNumbers === 0 ? (
              <h2 style={{ color: '#a3a3a3' }}>将“选择数据表”节点与计算模型相连结后，自动呈现数据字段配置选项</h2>
            ) : (
              dataTable.map((node, index) => (
                <Paper style={{ padding: '20px 10px', marginTop: 5 }} key={index}>
                  <div className={classes.textBody}>
                    <div>输入数据表{index + 1}</div>
                    <FormControl style={{ width: '100%', marginTop: 10 }}>
                      <InputLabel id="demo-simple-select-label">选择数据字段</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                      >
                        <MenuItem value={10}>美术课程期末成绩</MenuItem>
                        <MenuItem value={20}>美术课程平时成绩</MenuItem>
                        <MenuItem value={30}>音乐课程期末成绩</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Paper>
              ))
            )
          }
        </div>
      );
    } else {
      return (
        <div>
          <FormControl style={{ width: '100%', marginBottom: 10 }}>
            <InputLabel id="demo-simple-select-label">选择全局量规分类</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
            >
              <MenuItem value={1}>量规1</MenuItem>
              <MenuItem value={2}>量规2</MenuItem>
              <MenuItem value={3}>量规3</MenuItem>
            </Select>
          </FormControl>
          {
            indexArray.map(index => (
              <Paper style={{ padding: '20px 10px', marginTop: 5 }} key={index}>
                <div className={classes.textBody}>
                  <div style={{ display: 'flex' }}>
                    <FormControl style={{ width: '100%', marginRight: 6 }}>
                      <InputLabel id="demo-simple-select-label">属性</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                      >
                        <MenuItem value={1}>教学目标的得分</MenuItem>
                        <MenuItem value={2}>教学内容的得分</MenuItem>
                        <MenuItem value={3}>学习活动任务设计的得分</MenuItem>
                        <MenuItem value={4}>学习活动方式设计的得分</MenuItem>
                        <MenuItem value={5}>资源媒体运用的得分</MenuItem>
                        <MenuItem value={6}>学习评价设计的得分</MenuItem>
                      </Select>
                    </FormControl>
                    <CancelIcon className={classes.closeIcon} />
                  </div>
                  <FormControl style={{ width: '100%', marginTop: 10 }}>
                    <InputLabel id="demo-simple-select-label">数据字段</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                    >
                    {
                      ["时间","教职工号","姓名","任教班级","任教学科","教学目标的得分","教学内容的得分","学习活动任务设计的得分","学习活动方式设计的得分","资源媒体运用的得分"].map((el, idx)=>(
                        
                        <MenuItem value={idx}>{el}</MenuItem>
                      ))
                    }
                    </Select>
                  </FormControl>
                  <FormControl style={{ width: '100%', marginTop: 10 }}>
                    <InputLabel id="demo-simple-select-label">选择量规(默认与全局量规相同)</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                    >
                      <MenuItem value={1}>量规1</MenuItem>
                      <MenuItem value={2}>量规2</MenuItem>
                      <MenuItem value={3}>量规3</MenuItem>
                    </Select>
                  </FormControl>
                  <div style={{ display: 'flex', marginTop: 10 }}>
                    <TextField id="standard-basic" label="等级" style={{ width: '25%', marginRight: 10 }} />
                    <TextField id="standard-basic" label="数值范围" style={{ width: '70%' }} />
                  </div>
                  <TextField id="standard-basic" label="量规描述" style={{ width: '100%', marginTop: 10 }} />
                </div>
              </Paper>
            ))
          }
          <Button variant="outlined" style={{ width: '100%', marginTop: 10 }} color="primary" startIcon={<AddBoxIcon />} onClick={handleAddIndex} >添加量规</Button>
        </div>
      );
    }
  };

  return (
    <Slide direction="left" in={open} mountOnEnter unmountOnExit>
      <div className="sidebar">
        <h2>{elementLabel}</h2>
        <div className="description">
          <div className="detailBox">
            <form className="loginForm" noValidate autoComplete="off">
              {settingElement()}
            </form>
          </div>
        </div>
      </div>
    </Slide>
  );
};
export default SideBar;
