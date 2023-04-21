import React from 'react';
import connect from '@utils/translateConnect';
import { Button, Modal } from 'antd';
import config from '@config/style';

import StrategyEdit from '@components/StrategyEdit';

class StrategyModal extends React.PureComponent {

  /**
  * 点击确认按钮
  */
  handleOk = () => {
    // 更新数据之后关闭模态框
    this.props.dispatch().then(() => {
      this.props.handleOk();
    });
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
  }

  render() {
    const { t } = this.props;

    return (
      <Modal
        title={t('绑定策略')}
        style={this.props.style}
        width={config.modal.size.large}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {t('取消')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.loading}
            onClick={this.handleOk}
          >
            {t('确定')}
            </Button>
        ]}
      >
        <StrategyEdit
          t={t}
          roles={this.props.roleList}
          types={this.props.types}
          dimensions={this.props.dimensions}
          strategy={{role: '', name: '', tags: []}}
          onValueChange={this.handleValueChange}
        />
      </Modal>
    );
  }
}

export default connect(({ role, strategy, dimension, global }) => {
  return {
    role: role.role, // 当前选中角色
    roleList: role.roleList, // 角色集合
    dimensions: dimension.list, // 策略维度
    types: strategy.typeList, // 策略类型
    appId: global.managingAvailableApp
  };
})(StrategyModal);
