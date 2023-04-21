/**
 * 用户申请权限时，对于某角色，展示这个角色改配置的策略信息
 */

import React from 'react';
import _ from 'lodash';
import { Icon, Row, Col, Tag } from 'antd';
import { Link } from 'dva/router';
import classNames from 'classnames';

import { MAIN } from '@routes/config';

import './index.less';

class StrategyPanel extends React.Component {
  getEditLink = () => {
    const { data } = this.props;
    const { roleId, strategyDto } = data;
    return `${MAIN}/edit-strategy/${roleId}/${strategyDto.id}`;
  };

  getDimensionDetail(tag, dimension) {
    const { dimesionValue, dimensionIdMap, t } = this.props;
    const tagValue = dimesionValue[tag.id] || {};

    return _.map(dimension, d => {
      const idMap = dimensionIdMap[d.id];
      // 对 dimensionIdMap 进行容错处理，因为可能 dimensionIdMap 比 dimesionValue 加载来的慢
      if (!idMap) {
        return null;
      }

      const isValueEmpty = _.isEmpty(tagValue[d.id]);

      return (
        <Row className="dimension-row" key={d.id}>
          <Col span={6} className="dimension-name">
            {d.dimeName}：
          </Col>
          <Col
            span={18}
            className={classNames({
              'dimension-value': true,
              'empty-dimension-value': isValueEmpty
            })}>
            {isValueEmpty ? (
              // TODO 优化文案 + 去编辑的交互逻辑
              <span className="empty-dimension-value-hint">
                <Link to={this.getEditLink()}>{t('需要编辑')}</Link>
              </span>
            ) : (
              _.map(tagValue[d.id], (checked, id) => (
                <Tag key={id}>{idMap[id] ? idMap[id].label : ''}</Tag>
              ))
            )}
          </Col>
        </Row>
      );
    });
  }

  render() {
    const { data, roleIdNameMap = {}, t } = this.props;
    const { roleId, strategyDto, tagDimeList } = data;
    return (
      <div className="strategy-panel">
        <div className="panel-header">
          <div className="strategy-title">
            {roleIdNameMap[roleId] ? `${roleIdNameMap[roleId]}` : '-'}
            <span className="strategy-title-name">
              {strategyDto.strategyName || '-'}
            </span>
          </div>
          <div className="strategy-edit-button">
            {!_.isEmpty(tagDimeList) && (
              <Link to={this.getEditLink()}>
                <Icon type="edit" />
                {t('编辑')}
              </Link>
            )}
          </div>
        </div>
        <div className="panel-bodyer">
          {_.isEmpty(tagDimeList) ? (
            <span>{t('不需要配置')}</span>
          ) : (
            _.map(tagDimeList, ({ tag, dimeDtoList }) => (
              <div className="strategy-type-block" key={tag.id}>
                <p className="strategy-type-name">{`${t('策略类型')}：${
                  tag.tagName
                }`}</p>
                {this.getDimensionDetail(tag, dimeDtoList)}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default StrategyPanel;
