/**
 * 编辑策略的表单
 *  权限类型选择、维度编辑
 *    可增加多组
 */

import React from 'react';
import _ from 'lodash';

import { Row, Col } from 'antd';

import InputTreeTag from '../InputTreeTag';
import TreeSelectTag from '../InputTreeTag/treeSelect';

import './index.less';

class StrategyForm extends React.Component {
  handleChange = (field, value) => {
    this.props.onChange({
      ...this.props.value,
      [field]: value
    });
    this.setState({
      areaList: value
    });
  };

  render() {
    const {
      tag,
      dimeDtoList,
      dimensionOptions,
      dimensionIdMap,
      value,
      t
    } = this.props;

    return (
      <div className="strategy-form">
        <Row className="strategy-form-item">
          <Col span={4} className="strategy-form-label">
            {t('策略类型')}：
          </Col>
          <Col span={12} className="strategy-form-uneditable-value">
            <span>{tag.tagName}</span>
          </Col>
        </Row>

        {_.map(dimeDtoList, d => {
          let dimension = dimensionOptions[d.id] || {};

          return (
            <Row className="strategy-form-item" key={d.id}>
              <Col span={12} offset={4}>
                {/* <InputTreeTag
                  options={dimension.options}
                  value={value[d.id]}
                  idMap={dimensionIdMap[d.id]}
                  onChange={v => this.handleChange(d.id, v)}
                  placeholder={d.dimeName}
                /> */}
                <TreeSelectTag
                  options={dimension.options}
                  value={value[d.id]}
                  idMap={dimensionIdMap[d.id]}
                  onChange={v => this.handleChange(d.id, v)}
                  placeholder={d.dimeName}
                />
              </Col>
            </Row>
          );
        })}
      </div>
    );
  }
}

export default StrategyForm;
