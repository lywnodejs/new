import React from 'react';
// import customize components
import { AccordionPanel } from '../../../components/common';
// import mock data
import { analysisModels, basicMockDatabaseTree } from '../../../settings/projectMockData';

const featureEngineerModels = analysisModels[0];
const dataAnalysisModels = analysisModels[1];

export default ({
  heads, subHeads, contents
}) => {
  const onDragStart = (event, nodeType, nodeLabel) => {
    event.dataTransfer.setData('application/reactFlowType', nodeType);
    event.dataTransfer.setData('application/reactFlowLabel', nodeLabel);
    event.dataTransfer.effectAllowed = 'move';
  };

  const BasicDataList = () => {

  };

  const FeatureEngineerModelsList = () => {
    return (
      <div>
        {
          featureEngineerModels.children.map(model => (
            <div
              className="process-node"
              onDragStart={(event) => onDragStart(event, 'default', model.title)}
              draggable
              key={model.title}
            >
              {model.title}
            </div>
          ))
        }
      </div>
    );
  };

  const DataAnalysisModelsList = () => {
    return (
      <div>
        {
          dataAnalysisModels.children.map(child => (
            child.children.map(model => {
              return (
                <>
                  <div
                    className="process-node"
                    onDragStart={(event) => onDragStart(event, 'default', model.title)}
                    draggable
                    key={model.title}
                  >
                    {model.title}
                  </div>
                </>
              )
            })))
        }
      </div>
    );
  };

  return (
    <aside>
      <h2>数据与模型选择</h2>
      <div className="description">选择您所需要进行特征工程处理的数据与模型，拖拽至右边工作区，以对您所选择的数据进行对应的特征工程处理，输出特征变量</div>
      <AccordionPanel
        heads={heads}
        subHeads={subHeads}
        contents={[
          (<div className="input-node input" onDragStart={(event) => onDragStart(event, 'input', '输入数据')} draggable>
            输入数据
          </div>),
          (contents === 'featureEngineer' ? <FeatureEngineerModelsList /> : <DataAnalysisModelsList />),
          (<div className="output-node output" onDragStart={(event) => onDragStart(event, 'output', '输出结果')} draggable>
            输出结果
          </div>),
        ]}
      />
    </aside>
  );
};