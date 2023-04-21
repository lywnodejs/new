import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import AvailableApps from '@components/AvailableApps';

import {
  Button, Form, Input, Table, Row, Col, Select, Modal, Card, message
} from 'antd';
import connect from '@utils/translateConnect';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const formItemLayout = null;

class BigDataAdmin extends Component {
  state = {
    businessId: '',
    name: '',
    modalVisible: false,
    currentPage: 1
  };

  componentDidMount() {
    // 获取当前用户的可管理业务线
    // this.props.getAvailableBusiness();
  }

  handleSearchFieldChange = (e, type) => {
    this.setState({
      [type]: type === 'name' ? e.target.value : e
    });
  };

  handleFetch = (page=1) => {
    const {
      businessId,
      name,
    } = this.state;
    const { appId, fetchAdmins} = this.props;

    fetchAdmins({
      businessId,
      name,
      page,
      appId
    });
  };

  openModal = () => {
    this.setState({
      modalVisible: true
    });
  };

  handleModalOk = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const {
        username,
        usernameZh
      } = fieldsValue;

      const { appId, addAdmin, t } = this.props;

      addAdmin({
        username,
        usernameZh,
        appId,
        businessId: this.state.businessId
      }).then(() => {
        message.info(t('增加成功'));
        this.handleFetch(this.state.currentPage);
        this.closeModal();
      });
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false
    }, () => {
      this.props.form.resetFields();
    });
  };

  confirmDelete = (user) => {
    const { t } = this.props;
    confirm({
      title: t('确定删除此管理员'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => this.handleDelete(user)
    });
  };

  handleDelete = (user) => {
    this.props.delAdmin(user).then(() => {
      message.info(this.props.t('删除成功'));
    });
  };

  getColumns = () => {
    const { t } = this.props;

    return [{
      title: t('ID'),
      dataIndex: 'id',
      key: 'id',
      width: 60
    }, {
      title: t('系统名'),
      dataIndex: 'appName',
      key: 'appName',
    }, {
      title: t('业务线'),
      dataIndex: 'businessName',
      key: 'businessName',
    }, {
      title: t('创建时间'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm')
    }, {
      title: t('姓名'),
      dataIndex: 'usernameZh',
      key: 'usernameZh',
    }, {
      title: t('用户名'),
      dataIndex: 'username',
      key: 'username',
    }, {
      title: t('操作'),
      key: 'action',
      render: (text, record) => {
        return (
          <Button
            type="danger"
            size="small"
            className="btn delete-btn"
            onClick={() => this.confirmDelete(record)}
          >
            {t('删除')}
          </Button>
        );
      }
    }];
  };

  handlePageChange = (page) => {
    this.setState({
      currentPage: page
    }, () => {
      this.handleFetch(page);
    })
  };

  render() {
    const { t, bigDataAdmin, appId, allBusiness, form } = this.props;
    const { currentPage } = this.state;
    const {
      //availableBusinessList
      // current,
      records,
      total,
      size
    } = bigDataAdmin;

    if (!appId) {
      return null;
    }

    const {
      businessId,
      name,
      modalVisible
    } = this.state;

    const { getFieldDecorator } = form;

    return (
      <div className="BigData-admin">
        <Card title={t('管理员管理')} bordered={false}>
          <Row gutter={24} className="search-fields">
            <Col span={10}>
              <FormItem label={t('系统选择：')}>
                <AvailableApps
                  style={{width: '100%'}}
                  changeCallBack={() => this.handleFetch()}
                />
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem label={t('业务线选择')}>
                <Select
                  showSearch
                  placeholder={t('请选择')}
                  value={businessId}
                  onChange={(e) => this.handleSearchFieldChange(e, 'businessId')}
                  className="menu-select"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {_.map(allBusiness, (business) => (
                    <Option key={business.id} value={business.id}>
                      {business.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem label={t('用户名')}>
                <Input
                  placeholder={t('用户名')}
                  value={name}
                  onChange={(e) => this.handleSearchFieldChange(e, 'name')}
                />
              </FormItem>
            </Col>

            <Col span={10}>
              <FormItem label="">
                <Button
                  type="primary"
                  onClick={() => this.handleFetch()}>
                  {t('查询')}
                </Button>
                <Button
                  className="btn"
                  disabled={businessId === ''}
                  onClick={() => this.openModal()}>
                  {t('新增用户')}
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Card>

        <Card title={t('管理员列表')} bordered={false} className="admin-list">
          <Table
            rowKey="id"
            className="upm-table"
            columns={this.getColumns()}
            dataSource={records}
            pagination={{
              current: currentPage,
              pageSize: size,
              hideOnSinglePage: true,
              total,
              onChange: this.handlePageChange
            }}
          />
        </Card>

        <Modal
          title={t('新增用户')}
          visible={modalVisible}
          onOk={this.handleModalOk}
          onCancel={this.closeModal}
          cancelText={t('取消')}
          okText={t('确定')}
        >
          <Form className="edit-form">
            <FormItem label={t('系统选择：')}>
              <AvailableApps
                disabled
                style={{width: '100%'}}
              />
            </FormItem>
            <FormItem label={t('业务线选择')}>
              <Select
                placeholder={t('请选择')}
                value={businessId}
                className="menu-select"
                disabled
              >
                {_.map(allBusiness, (business) => (
                  <Option key={business.id} value={business.id}>
                    {business.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={t('姓名')}
            >
              {getFieldDecorator('usernameZh', {
                rules: [{ required: true, message: t('请输入姓名') }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={t('用户名')}
            >
              {getFieldDecorator('username', {
                rules: [{ required: true, message: t('请输入用户名') }],
              })(
                <Input />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect(({ global, bigDataAdmin }) => {
  return {
    appId: global.managingApp,
    bigDataAdmin,
    allBusiness: global.allBusiness
  };
}, (dispatch) => ({
  getAvailableBusiness() {
    dispatch({
      type: 'bigDataAdmin/getAvailableBusiness',
    });
  },
  fetchAdmins(payload) {
    dispatch({
      type: 'bigDataAdmin/fetch',
      payload
    });
  },
  addAdmin(payload) {
    return dispatch({
      type: 'bigDataAdmin/addAdmin',
      payload
    });
  },
  delAdmin(payload) {
    return dispatch({
      type: 'bigDataAdmin/delAdmin',
      payload
    });
  },
}))(Form.create()(BigDataAdmin));
