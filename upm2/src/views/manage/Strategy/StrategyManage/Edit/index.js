/**
 * 角色策略编辑页面
 * by zhangdi
 */
import './style.less';
import React from 'react';
import connect from '@utils/translateConnect';
import { Row, Col, Button, message } from 'antd';

import StrategyEdit from '@components/StrategyEdit';

class StrategyEditPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  handleValueChange = value => {
    if (value.roleId) {
      this.props.dispatch({
        type: 'strategy/getStrategy',
        payload: {
          appId: this.props.appId,
          roleId: value.roleId
        }
      });
    }
    this.props.dispatch({
      type: 'strategy/mergeStrategy',
      payload: {
        ...value,
        appId: this.props.appId
      }
    });
  };

  /**
   * 保存
   */
  handleClick = () => {
    // this.strategyEdit指向form
    this.strategyEdit.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const { match } = this.props;
      this.props
        .dispatch({
          type:
            match.params.id && this.props.strategy.relationId
              ? 'strategy/updateStrategy'
              : 'strategy/createStrategy',
          payload: this.props.strategy
        })
        .then(() => {
          history.back();
        });
    });
  };

  render() {
    const { strategy, types, dimensions, roleList, match, t } = this.props;

    return (
      <div className="upm-content upm-strategy-edit-page">
        <StrategyEdit
          ref={ref => (this.strategyEdit = ref)}
          t={t}
          roles={roleList}
          types={types}
          disabled={!!match.params.id}
          dimensions={dimensions}
          strategy={strategy}
          onValueChange={this.handleValueChange}
        />
        <Row gutter={24}>
          <Col span={12}>
            <Button
              className="upm-strategy-edit-page__button"
              type="primary"
              onClick={this.handleClick}>
              {t('确定')}
            </Button>
          </Col>
        </Row>
      </div>
    );
  }

  componentDidMount() {
    const { appId, id } = this.props.match.params;
    if (id) {
      this.props.dispatch({
        type: 'strategy/getStrategy',
        payload: {
          appId,
          roleId: id
        }
      });
    }
    this.props.dispatch({
      type: 'dimension/fetchList',
      payload: appId
    });
    this.props.dispatch({
      type: 'strategy/fetchTypeAll',
      payload: {
        appId: appId
      }
    });
    this.props.dispatch({
      type: 'role/fetchRoleAll',
      payload: {
        appId: appId
      }
    });
    if (id) {
      this.props.dispatch({
        type: 'dimension/fetchList',
        payload: appId
      });
    }
  }
}

export default connect(({ role, strategy, dimension, global }) => {
  return {
    roleList: role.roleList, // 角色集合
    dimensions: dimension.dimension, // 策略维度
    types: strategy.typeList, // 策略类型
    strategy: strategy.strategy, // 策略对象
    appId: global.managingAvailableApp
  };
})(StrategyEditPage);
