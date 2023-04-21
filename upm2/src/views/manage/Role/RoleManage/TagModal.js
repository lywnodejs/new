/**
 * 设置标签页面
 * by menghao
 */
import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Select, Button, Modal } from 'antd';

const { Option } = Select
const APPID = 888

class Tags extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: '1' // 标签的ID
    };
  }

  /**
  * 点击确认按钮
  */
  handleOk = () => {
    const { isRemove, idType = 2 } = this.props;
    const type = isRemove ? 'role/removeTags' : 'role/saveTags'

    this.props.dispatch({
      type,
      payload: {
        idList: idType == 2 ? [this.props.role.id] : [this.props.roleGroup.id],
        appId: this.props.role.appId || APPID,
        type: idType, // 角色
        label: 1 // 权限点
      }
    }).then(() => {
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
    const { t, isRemove } = this.props;

    return (
      <Modal
        title={isRemove ? t('选择删除的标签') : t('选择设置的标签')}
        style={this.props.style}
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
        <Select defaultValue={this.state.id} style={{ width: 200 }} onChange={(val)=>{
          this.setState({
            id: val.target.value
          })
        }}>
          <Option value="1">安全客服</Option>
        </Select>
      </Modal>
    );
  }
}

export default connect(({ role, global }) => {
  return {
    roleGroup: role.roleGroup,
    role: role.role,
    appId: global.managingAvailableApp
  };
})(Tags);
