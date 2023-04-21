import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Form, Input, Button, Modal, Table, Tag} from 'antd';
import { echoMessage } from '@utils/notice';
const { Column } = Table;
const FormItem = Form.Item;
/**
 * 角色解绑弹窗
 * @param {*} props
 */
class UserUnBind extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      loading: false
    }
  }
  componentDidMount = () => {
    this.fetchData();
  }

  /**
  * 点击确认按钮
  */
  handleOk = () => {
    const {dispatch, role, t, handleOk} = this.props;
    let {selectedRows} = this.state;
    if (!selectedRows.length) {
      echoMessage(t('至少选择一个用户进行解绑操作！'), 'error');
      return;
    }
    this.setState({
      loading: true
    });
    dispatch({
      type: 'businessRoleList/roleUnBindResource',
      payload: {
        appId: role.appId,
        permissionType: 8,
        roleIdList: [role.id],
        userIdList: selectedRows.map(item => item.id)
      }
    }).then(() => {
      this.setState({
        loading: false
      });
      echoMessage(t('用户解除绑定成功！'), 'success');
      handleOk();
    }, () => {
      this.setState({
        loading: false
      });
    });
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
  }
  handleTableChange = (pagination) => {
    this.fetchData(pagination.current);
  }
  fetchData = (page) => {
    const { dispatch, role, form, bindUsers: {current, size} } = this.props;
    const {username} = form.getFieldsValue();
    dispatch({
      type: 'businessRoleList/getRoleBindUsers',
      payload: {
        appId: role.appId,
        id: role.id,
        page: page || current,
        username,
        size
      }
    });
  }

  deleteSelectdRows = (item) => {
    let {selectedRows} = this.state;
    if (_.isArray(item)) {
      item.forEach(item => {
        _.remove(selectedRows, (i) => item.id === i.id);
      });
    } else {
      _.remove(selectedRows, (i) => item.id === i.id);
    }
    this.setState({
      selectedRows: [
        ...selectedRows
      ]
    });
  }

  render = () => {
    const { t, role, form, bindUsers: {records, current, size, total, loading}} = this.props;
    const { getFieldDecorator } = form;
    const {selectedRows} = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRows.map((item) => _.findIndex(records, function(o) { return o.id === item.id; })),
      onChange: (selectedRowKeys, selectedRows) => { 
        if (selectedRows.length) {
          let validSelectedRows =  _.filter(selectedRows, (item) => {
            return _.findIndex(this.state.selectedRows, i => i.id === item.id) === -1; 
          });
          this.setState({
            selectedRows: [
              ...this.state.selectedRows,
              ...validSelectedRows
            ]
          })
        } else {
          this.deleteSelectdRows(records);
        }
      },
      onSelect: (record, selected, selectedRows) => {
        if (!selected) {
          this.deleteSelectdRows(record);
        }
      }
    };
    return (
      <Modal
        title={t('{{roleName}}-解绑用户', {roleName: role.nameZh})}
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
            {t('解除绑定')}
            </Button>
        ]}
      >
        <Form layout="inline">
            <FormItem label={t('用户名')}>
              {getFieldDecorator('username', {
                initialValue: ''
              })(<Input />)}
            </FormItem>
            <FormItem>
                <Button
                    type="primary"
                    icon="search"
                    onClick={() => {this.fetchData()}}
                >
                    {t('搜索')}
                </Button>
            </FormItem>
        </Form>
        <Table rowSelection={rowSelection} loading={loading} pagination={{current, total, pageSize: size}} onChange={this.handleTableChange} dataSource={records}>
          <Column
            title={t('ID')}
            dataIndex="id"
            key="id"
          />
          <Column
            title={t('账号')}
            dataIndex="username"
            key="username"
          />
          <Column
            title={t('姓名')}
            dataIndex="usernameZh"
            key="usernameZh"
          />
        </Table>

        <div className="selected-wrap">
           <label>{t('已选：')}</label> 
          {selectedRows.map(item => (<Tag key={item.id} closable onClose={() => {this.deleteSelectdRows(item)}}>{item.username}</Tag>))}
        </div>
      </Modal>
    );
  }
}

const UserUnBindModal = Form.create({})(UserUnBind);

export default connect(({businessRoleList}) => {
  return {
    bindUsers: businessRoleList.bindUsers
  };
})(UserUnBindModal);