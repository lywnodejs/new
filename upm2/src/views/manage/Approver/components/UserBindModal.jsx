import React, { Component } from 'react';
import connect from '@utils/translateConnect';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  Table,
  Alert,
  Tooltip,
  Icon
} from 'antd';
import { echoMessage } from '@utils/notice';
import config from '@config/style';

const FormItem = Form.Item;
const { Column } = Table;
const { searchForm } = config;

class UserBindModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCurrent: 1,
      pageSize: 10,
      total: 0,
      unReleRelationIds: []
    };
  }

  componentDidMount() {
    // console.log('dd');
    // this.getAreaBindUsers();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      this.getAreaBindUsers();
    }
  }

  getAreaBindUsers = (username = '') => {
    const {
      params: { appId, businessId, areaId }
    } = this.props;
    const { pageCurrent, pageSize } = this.state;
    const params = {
      appId,
      businessId,
      areaId,
      username,
      page: pageCurrent,
      size: pageSize
    };
    this.props.dispatch({
      type: 'area/gerAreaBindedUsers',
      payload: params,
      callback: total => {
        this.setState({
          total
        });
      }
    });
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    // this.reset();
    this.props.handleCancel();
  };

  /**
   * 翻页
   */
  handlePageChange = current => {
    this.setState(
      {
        pageCurrent: current
      },
      () => {
        this.getAreaBindUsers();
      }
    );
  };

  formatUsernames = usernames => {
    return usernames
      .split(',')
      .map(username => username.trim())
      .filter(username => username !== '')
      .join(',');
  };

  handleSearch = () => {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      this.setState(
        {
          pageCurrent: 1
        },
        () => {
          this.getAreaBindUsers(this.formatUsernames(values.usernames));
        }
      );
    });
  };

  validateUsernames = (rule, value, callback) => {
    const { t } = this.props;
    if (this.formatUsernames(value).split(',').length > 50) {
      callback(t('最大支持50个'));
    }
    callback();
  };

  afterClose = () => {
    this.setState({
      pageCurrent: 1,
      unReleRelationIds: []
    });
    this.props.dispatch({
      type: 'area/save',
      payload: {
        areaBindedUsers: []
      }
    });
  };
  handleRele = () => {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const usernames = this.formatUsernames(values.usernames);
      if (usernames.trim() === '') {
        return;
      }
      const {
        t,
        params: { appId, businessId, areaId }
      } = this.props;
      const params = {
        appId,
        businessId,
        areaId,
        username: usernames
      };
      this.props
        .dispatch({
          type: 'area/bindUsersToArea',
          payload: params
        })
        .then(() => {
          echoMessage(t('用户绑定成功'), 'success');
          this.props.form.resetFields();
          this.setState(
            {
              pageCurrent: 1
            },
            () => {
              this.getAreaBindUsers();
            }
          );
        });
    });
  };
  handleUnRele = () => {
    const {
      t,
      params: { appId, areaId }
    } = this.props;
    const { unReleRelationIds } = this.state;
    const params = {
      appId,
      areaId,
      userIds: unReleRelationIds.map(item => item.split('-')[1])
    };
    this.props
      .dispatch({
        type: 'area/unBindUsersToArea',
        payload: params
      })
      .then(() => {
        echoMessage(t('用户解除绑定成功'), 'success');
        this.setState(
          {
            pageCurrent: 1,
            unReleRelationIds: []
          },
          () => {
            this.getAreaBindUsers();
          }
        );
      });
  };

  render() {
    const {
      t,
      editingAreaName,
      areaBindedUsers,
      loadingAreaBindedUsers,
      loadingBindUsersToArea,
      loadingUnBindUsersToArea
    } = this.props;
    const {
      form: { getFieldDecorator }
    } = this.props;
    const { pageCurrent, total, unReleRelationIds } = this.state;
    const rowSelection = {
      selectedRowKeys: unReleRelationIds,
      onChange: selectedRowKeys => {
        this.setState({
          unReleRelationIds: selectedRowKeys
        });
      },
      getCheckboxProps: record => {
        if (record.fromAreaName !== editingAreaName) {
          return {
            disabled: true
          };
        }
      }
    };
    return (
      <Modal
        title={`与${editingAreaName}关联的用户`}
        destroyOnClose={true}
        // style={this.props.style}
        // width={config.modal.size.large}
        width={800}
        visible={this.props.visible}
        // onOk={this.unReleUser}
        onCancel={this.handleCancel}
        afterClose={this.afterClose}
        footer={[
          // <Popconfirm
          //   key="popConfirm"
          //   placement="topLeft"
          //   title={t('是否一键清空所有绑定用户')}
          //   onConfirm={this.unReleAllUser}
          //   okText={t('确认')}
          //   cancelText={t('取消')}
          //   disabled={relevantUsers.length === 0}>
          //   <Button
          //     type="primary"
          //     loading={loadingForUnReleAllUser}
          //     disabled={relevantUsers.length === 0}>
          //     {t('一键清空用户')}
          //   </Button>
          // </Popconfirm>,
          <Button
            key="cancel"
            type="danger"
            loading={loadingUnBindUsersToArea}
            onClick={this.handleUnRele}
            disabled={unReleRelationIds.length === 0}
            style={{ marginLeft: '8px' }}>
            {t('解除绑定')}
          </Button>
        ]}>
        <Form className="upm-form">
          <Row gutter={12}>
            <Col span={16}>
              <FormItem label={t('用户名')} {...searchForm}>
                {getFieldDecorator('usernames', {
                  rules: [
                    {
                      validator: this.validateUsernames
                    }
                  ]
                })(
                  <Input
                    style={{ width: '300px' }}
                    placeholder={t('用户名，多用户以逗号间隔（上限50人）')}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              {/* <FormItem> */}
              <Button
                className="upm-form__button"
                loading={loadingBindUsersToArea}
                onClick={this.handleRele}>
                {t('关联用户')}
              </Button>
              <Button
                // className="upm-form__button"
                icon="search"
                type="primary"
                onClick={this.handleSearch}>
                {t('搜索')}
              </Button>
              {/* </FormItem> */}
            </Col>
          </Row>
        </Form>
        <Alert
          message={t(
            '用户权限，来源于更高层级地区时无法在本页进行权限删除，请到对应地区或用户管理页面进行相关操作'
          )}
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <Table
          className="upm-table"
          rowKey={record => {
            return `${record.relationId}-${record.id}`;
          }}
          size="middle"
          dataSource={areaBindedUsers}
          rowSelection={rowSelection}
          loading={loadingAreaBindedUsers}
          pagination={{
            current: pageCurrent,
            pageSize: 10,
            total: total,
            hideOnSinglePage: true,
            onChange: this.handlePageChange
          }}>
          <Column title={t('用户ID')} dataIndex="id" width={100} />
          <Column title={t('账号')} dataIndex="username" />
          <Column title={t('姓名')} dataIndex="usernameZh" />
          <Column
            title={
              <span>
                <span>{t('权限来源')} </span>
                <Tooltip
                  title={t(
                    '即用户申请/绑定权限时所选择的权限拥有更高层级地区的用户也会展示在当前地区权限名单中'
                  )}
                  placement="bottom">
                  <Icon type="question-circle-o" style={{ color: '#cccccc' }} />
                </Tooltip>
              </span>
            }
            dataIndex="fromAreaName"
          />
        </Table>
      </Modal>
    );
  }
}

export default connect(({ area }) => {
  return {
    areaBindedUsers: area.areaBindedUsers,
    loadingAreaBindedUsers: area.loading.loadingAreaBindedUsers,
    loadingBindUsersToArea: area.loading.loadingBindUsersToArea,
    loadingUnBindUsersToArea: area.loading.loadingUnBindUsersToArea
  };
})(Form.create()(UserBindModal));
