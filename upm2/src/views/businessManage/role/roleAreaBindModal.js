import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import {Button, Modal, Tag, Input} from 'antd';
import { echoMessage } from '@utils/notice';
import {getRoleArea} from '../../../services/businessManage';
import UTree from '@components/UTree';
import debounce from 'lodash/debounce';

/**
 * 角色绑定地区
 * @param {*} props
 */
class RoleAreaBindModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      areaName: '',
      selectedRows: [],
      selectedKeys: [],
      tree: {
          nodes: [],
          loading: false
      },
      loading: false
    };
  }
  componentDidMount = () => {
    this.fetchData();
  }
  /**
  * 点击确认按钮
  */
  handleOk = () => {
    const {operateHandle, operateName, successHandle, t, role, resourceName} = this.props;
    const {selectedRows} = this.state;
    if (!selectedRows.length) {
      echoMessage(t(`至少选择一项进行${operateName}操作！`), 'error');
      return;
    }
    this.setState({
      loading: true
    });
    operateHandle({
      appId: role.appId,
      roleIdList: [role.id],
      resourceIdList: selectedRows.map(item => item.id)
    }).then(() => {
      this.setState({
        loading: false
      });
      echoMessage(t(`${resourceName}${operateName}成功！`), 'success');
      successHandle();
    }, () => {
      this.setState({
        loading: false
      });
    })
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
  }

  changeTreeData(tree) {
    this.setState({
        tree: {
            ...this.state.tree,
            ...tree
        }
    });
  }

  fetchData = () => {
    const {role} = this.props;
    this.changeTreeData({
        loading: true
    });
    getRoleArea({
      businessId: role.businessId
    }).then((data) => {
      this.changeTreeData({
          loading: false,
          nodes: data
      });
    }, () => {
        this.changeTreeData({
            loading: false
        });
    });
  }
  deleteSelectdRows(item) {
    let {selectedKeys} = this.state;
    _.remove(selectedKeys, (i) => item.id == i);
    this.setState({
        selectedKeys: [
        ...selectedKeys
      ]
    });
  }
  areaNameChange = (e) => {
    const {value} = e.target;
    this.setState({
        areaName: value
    });
  }

  render = () => {
    const {t, resourceName, operateName, role} = this.props;
    const {areaName, selectedKeys, selectedRows, tree: {nodes}} = this.state;
    const onTreeSelect = () => {
    };
    const onTreeCheck = (selectedKeys, selectedRows) => {
        this.setState({
            selectedKeys,
            selectedRows
        });
    };
    return (
      <Modal
        title={t(`${role.nameZh}-${resourceName}${operateName}`)}
        style={this.props.style}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose={true}
        width={650}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {t('取消')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.state.loading}
            onClick={this.handleOk}
          >
            {t(`${resourceName}${operateName}`)}
            </Button>
        ]}
      >
        <Input
            value={this.state.areaName}
            onChange={this.areaNameChange}
            placeholder={t('请输入地区名')}
        />
        <div style={{height: '300px', overflow: 'auto'}}>
            <UTree
                checkable
                showLine
                nodes={nodes}
                isSelectable={(item) => item.pid != null}
                isDisableCheckbox={(item) => item.pid != null}
                searchValue={areaName}
                checkedKeys={selectedKeys}
                onCheck={onTreeCheck}
                onSelect={onTreeSelect}
            />
        </div>
        <div className="selected-wrap">
           <label>{t('已选：')}</label> 
           {selectedRows.map(item => (<Tag key={item.id} closable onClose={() => {this.deleteSelectdRows(item)}}>{item.name}</Tag>))}
        </div>
      </Modal>
    );
  }
}

export default connect((global) => {
  return {
  };
})(RoleAreaBindModal);