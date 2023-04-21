import React from 'react';
import connect from '@utils/translateConnect';
import _ from 'lodash';
import { Button, Row, Col, message } from 'antd';

import ContentCard from '../ContentCard';
import StrategyForm from '../StrategyForm';
// import TreeSelector from '../../../components/TreeSelector';

import './index.less';

class EditStrategy extends React.Component {
  onFormChange = (id, value) => {
    const { dispatch, match, params, packageParams, appId } = this.props;
    const { roleId } = params;
    const { appsData } = packageParams;
    const strategy = packageParams.appsData[appId].strategy;
    const oldValue = strategy[roleId];
    dispatch({
      type: 'managePackage/mergePackage',
      payload: {
        appsData: {
          ...appsData,
          [appId]: {
            ...appsData[appId],
            strategy: {
              ...strategy,
              [roleId]: {
                ...oldValue,
                [id]: value
              }
            }
          }
        }
      }
    });
  };

  render() {
    const {
      match,
      strategyList,
      dimensionOptions,
      dimensionIdMap,
      params,
      appId,
      packageParams,
      t
    } = this.props;
    const { roleId, strategyDto, tagDimeList } = params;
    const strategy = packageParams.appsData[appId].strategy;
    const value = strategy[roleId] || {};
    const targetRole =
      packageParams.appsData[appId].role &&
      packageParams.appsData[appId].role.find(item => item.value == roleId);

    return (
      <div className="edit-strategy">
        <Row className="strategy-form-row">
          <Col span={4} className="strategy-form-label">
            {t('角色名称')}：
          </Col>
          <Col
            span={10}
            className="strategy-form-uneditable-value strategy-name">
            <span>{targetRole ? targetRole.label : '-'}</span>
          </Col>
        </Row>
        <Row className="strategy-form-row">
          <Col span={4} className="strategy-form-label">
            {t('策略名称')}：
          </Col>
          <Col
            span={10}
            className="strategy-form-uneditable-value strategy-name">
            <span>{strategyDto.strategyName || '-'}</span>
          </Col>
        </Row>

        {_.map(tagDimeList, ({ tag, dimeDtoList }, index) => (
          <Row key={index} className="strategy-form-row">
            <Col span={24}>
              <StrategyForm
                tag={tag}
                dimeDtoList={dimeDtoList}
                dimensionOptions={dimensionOptions}
                dimensionIdMap={dimensionIdMap}
                value={value[tag.id] || {}}
                onChange={value => this.onFormChange(tag.id, value)}
                t={t}
              />
            </Col>
          </Row>
        ))}
      </div>
    );
  }
}

export default connect(({ newApply, managePackage }) => {
  return {
    packageParams: managePackage.package,
    strategyList: managePackage.strategyList,
    dimensionIdMap: managePackage.dimensionIdMap,
    dimensionOptions: managePackage.dimensionOptions
  };
})(EditStrategy);
