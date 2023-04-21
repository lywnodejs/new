import React from 'react';
import connect from '@utils/translateConnect';
import _ from 'lodash';
import { Button, Row, Col, message } from 'antd';

import ContentCard from '../../../components/ContentCard';
import StrategyForm from '../../../components/StrategyForm';
// import TreeSelector from '../../../components/TreeSelector';

import './index.less';

class EditStrategy extends React.Component {
  onFormChange = (id, value) => {
    const { dispatch, match, params } = this.props;
    const { roleId } = match.params;
    const oldValue = params.strategy[roleId];

    dispatch({
      type: 'newApply/updateParamStrategy',
      payload: {
        [roleId]: {
          ...oldValue,
          [id]: value
        }
      }
    });
  };

  onSave = () => {
    this.props.history.goBack();
  };

  componentDidMount() {
    const { match, strategyList, t, history } = this.props;
    const { roleId } = match.params;

    // 从strategy的列表里找到当前正在编辑的
    const strategy = _.find(strategyList, s => s.roleId == roleId);
    if (!strategy) {
      message.warning(t('当前无进行中的申请，即将跳转到申请页面'));
      history.push('/upm2-static/main/new-apply');
    }
  }

  render() {
    const {
      match,
      strategyList,
      dimensionOptions,
      dimensionIdMap,
      params,
      t
    } = this.props;
    const { roleId, strategyId } = match.params;
    const value = params.strategy[roleId] || {};
    const roles = Object.values(params.role || {}).concat(
      params.resource_role || []
    );
    let targetRole = roles.find(item => item.value == roleId);
    // if (params.role) {
    //   targetRole = params.role.find(item => item.value == roleId);
    // } else if (params.resource_role) {
    //   targetRole = params.resource_role.find(item => item.value == roleId);
    // }

    // 从strategy的列表里找到当前正在编辑的
    const strategy = _.find(strategyList, s => s.roleId == roleId);

    if (!strategy) {
      return null;
    }

    const { strategyDto = {}, tagDimeList } = strategy;

    return (
      <ContentCard title={t('角色策略配置')}>
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

          <Row>
            <Col span={10} offset={4}>
              <Button onClick={this.onSave} type="primary">
                {t('保存')}
              </Button>
            </Col>
          </Row>
        </div>
      </ContentCard>
    );
  }
}

export default connect(({ newApply }) => {
  return {
    ...newApply
  };
})(EditStrategy);
