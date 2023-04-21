import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import {Button, Modal, Tag, Input, Select, Form} from 'antd';
import { echoMessage } from '@utils/notice';
import {getRoleArea} from '../../../services/businessManage';
import UTree from '@components/UTree';
import UserSelect from '@components/UserSelector';

/**
 * 角色绑定地区
 * @param {*} props
 */
class UserAreaBindModal extends React.Component {
  constructor(props) {
    const {businessLine, user} = props;
    super(props);
    this.state = {
      areaName: '',
      selectedRows: [],
      selectedKeys: [],
      user: {},
      search: {
        businessId: businessLine && businessLine.length ? businessLine[0].id : ''
      },
      tree: {
          nodes: [],
          loading: false
      },
      loading: false
    };
    if (!user.id) {
      this.isCreate = true;
    }
  }
  componentDidMount = () => {
    this.fetchData();
  }
  /**
  * 点击确认按钮
  */
  handleOk = () => {
    const {operateHandle, operateName, successHandle, t, user, resourceName, appId} = this.props;
    const {selectedRows} = this.state;
    if (this.isCreate && !this.state.user.id) {
      echoMessage(t('请先选择新增用户！'), 'error');
      return;
    }
    if (!selectedRows.length) {
      echoMessage(t(`至少选择一项进行${operateName}操作！`), 'error');
      return;
    }
    this.setState({
      loading: true
    });
    operateHandle({
      appId: appId,
      userIdList: this.isCreate? [this.state.user.id]: [user.id],
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

  fetchData = (businessId) => {
    this.changeTreeData({
        loading: true
    });
    getRoleArea({
      businessId: businessId || this.state.search.businessId
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
  businessIdChange = (value) => {
    if (this.state.search.businessId !== value) {
      this.setState({
        search: {
          businessId: value
        }
      });
      this.fetchData(value);
    }
  }
  userChange = (value, option, user) => {
    this.setState({
      user: user || {}
    });
  }
  render = () => {
    const {t, resourceName, operateName, user, businessLine} = this.props;
    const {areaName, search: {businessId}, selectedKeys, selectedRows, tree: {nodes}} = this.state;
    const {usernameZh='', dept=''} = this.state.user;
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
        title={t(`${this.isCreate? t('新增'):user.username}-${resourceName}${operateName}`)}
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
        {this.isCreate? (<div style={{marginBottom: 5}}>
          <label>{t('绑定用户：')}</label>
          <UserSelect onChange={this.userChange} style={{width: 200}} selectType="single" />
          {usernameZh? <span style={{marginLeft: 10}}>{`${t('描述：')}${usernameZh}(${dept})`}</span>: ''}
        </div>): ''}
        <Form layout="inline">
          <Form.Item label={t('业务线')}>
            <Select
              showSearch
              optionFilterProp="children"
              style={{ width: 200 }}
              onChange={this.businessIdChange}
              value={businessId}
            >
              {businessLine.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label={t('地区名')}>
            <Input
                style={{ width: 200 }}
                value={this.state.areaName}
                onChange={this.areaNameChange}
                placeholder={t('请输入地区名')}
            />
          </Form.Item>
        </Form>
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

export default connect(({global, bigData}) => {
    return {
        businessLine: bigData.businessLine,
        // appId: global.globalAppId
    };
})(UserAreaBindModal);