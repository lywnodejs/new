import React from "react";
import Slide from "@material-ui/core/Slide";
import { TextField } from "@material-ui/core";
// import customize components
import { TextFormsErrorVerification, SelectFormsErrorVerification } from "..";
// import mock data
import {
  analysisModels,
  basicMockDatabaseTree,
} from "../../../settings/projectMockData";
import { TheoryModelDetail } from '../../../pages/modelManage/newModelManage/mockData/TheoryModel';


const featureEngineerModels = analysisModels[0];
const dataAnalysisModels = analysisModels[1];

const SideBar = ({ open, clickElement, openModelDetail }) => {
  const elementType = clickElement != null ? clickElement.type : null;
  const elementLabel = clickElement != null ? clickElement.data.label : "理论模型配置";

  const settingElement = () => {
    console.log(clickElement);
    if (elementLabel === "理论模型配置") {
      return (
        <div style={{textAlign: 'center', margin: '40px 5px', fontSize: 20, color: 'grey'}}>
          <div>请点击“选择理论模型”，调出需要更新配置的教育理论模型</div>
        </div>
      );
    } else if (clickElement['type'] === 'input') {
      let modelIntro = '';
      TheoryModelDetail.map(model => {
        if(model.name === openModelDetail){
          modelIntro = model.intro
        }
      });
      // console.log(modelIntro);
      return (
        <div>
          <div style={{ paddingTop: 0, }}>模型名称</div>
          <TextField style={{ width: '100%' }} id="standard-basic" defaultValue={openModelDetail} />
          <div style={{ paddingTop: 20, }}>模型简介</div>
          <TextField style={{ width: '100%' }} multiline id="standard-basic" defaultValue={modelIntro} />
        </div>
      );
    } else {
      return (
        <div>
          <div style={{ paddingTop: 0, }}>属性名称配置</div>
          <TextField style={{ width: '100%' }} id="standard-basic" value={elementLabel} />
          <div style={{ paddingTop: 20, }}>属性简介配置</div>
          <TextField style={{ width: '100%' }} id="standard-basic" defaultValue='属性基本信息介绍……' />
          <div style={{ paddingTop: 20, }}>权重配置（0.00~1.00）</div>
          <TextField style={{ width: '100%' }} id="standard-basic" defaultValue='0.65' />
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
