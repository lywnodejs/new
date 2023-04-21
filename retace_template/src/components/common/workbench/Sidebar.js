import React from "react";
import Slide from "@material-ui/core/Slide";
// import customize components
import { TextFormsErrorVerification, SelectFormsErrorVerification } from "../";
// import mock data
import {
  analysisModels,
  basicMockDatabaseTree,
} from "../../../settings/projectMockData";

const featureEngineerModels = analysisModels[0];
const dataAnalysisModels = analysisModels[1];

const SideBar = ({ open, clickElement }) => {
  const elementType = clickElement != null ? clickElement.type : null;
  const elementLabel = clickElement != null ? clickElement.data.label : "设置";

  const settingElement = () => {
    if (elementLabel === "设置") {
      return "选择你需要配置的模块";
    } else if (elementType === "inputNode" || elementType === "scaleNode") {
      return (
        <div>
          选择输入的基础数据表或分类后的数据
          <div className="formStyle">
            <SelectFormsErrorVerification
              label={"选择数据表"}
              // value={inputDataState}
              items={[
                "大同中学-101班-教师板书行为数据表",
                "大同中学-101班-学生课堂互动行为数据表",
                "大同中学-101班-学生课后练习数据表",
                "大同中学-101班-师生课堂交互数据表",
              ]}
              // handleChangeSelect={handleInputDataState}
            />
          </div>
        </div>
      );
    } else if (elementType === "outputNode") {
      return <div>点击"下一步"即可输出特征工程分析结果</div>;
    } else {
      return (
        <div className="formStyle">
          <TextFormsErrorVerification
            label={"提取因子数量"}
            // value={textValue}
            // handleChangeText={handleTextChange}
          />
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
