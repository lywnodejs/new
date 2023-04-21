import React from 'react';
import {
  Button, Form, Input,
  Table, Row, Col,
  Select, Modal, Card,
  Popover, message
} from 'antd';
import connect from '@utils/translateConnect';
import AvailableApps from '../../../components/AvailableApps';
import DefaultAuthForm from './DefaultAuthForm';
import _ from 'lodash';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class ManageDefaultAuth extends React.Component {

  state = {
    modalVisible: false,
    defaultAuthFormValue: {data: {}, action: 'add'},
  }

  componentDidMount() {
    this.handleFetch();
    this.fetchAuthFormData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.appId !== this.props.appId) {
      this.handleFetch();
    }
  }

  handleFetch = (page = 1) => {
    const { fetchData, appId = 888 } = this.props;
    this.props.form.validateFields((err, value) => {
      fetchData({appId, page, ...value});
    });
  }

  handleSelectChange = (name, value) => {
    this.props.form.setFieldsValue({
      [name]: value,
    });
    this.handleFetch();
  }

  handlePageChange = (page) => {
    this.handleFetch(page);
  }

  handleDelete = (auth) => {
    const { t } = this.props;
    this.props.requestDelete(auth).then(() => {
      message.success(t('操作成功!'));
    });
  }

  handleCopy = (auth) => {
    const { t } = this.props;
    this.props.requestCopy(auth).then(() => {
      message.success(t('操作成功!'));
    });
  }

  handleEdit =(data, action) => {
    this.setState({
      defaultAuthFormValue: { data, action },
      modalVisible: true
    });
  }

  handleOpenModal = () => {
    this.setState({
      defaultAuthFormValue: { data: {}, action: 'add' },
      modalVisible: true,
    });
  }

  handleModalVisible = (isVisible) => {
    this.setState({
      modalVisible: isVisible,
    });
  }

  fetchAuthFormData = () => {
    const {
      fetchDept, fetchJobCode, fetchAreaList,
      fetchRoleList, fetchFlagList, appId = 888
    } = this.props;
    fetchDept({appId});
    fetchJobCode({appId});
    fetchRoleList({appId});
    fetchFlagList({appId});
    fetchAreaList({appId});
  }

  confirmDelete = (auth) => {
    const { t } = this.props;
    confirm({
      title: t('确定删除此记录?'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => this.handleDelete(auth)
    });
  }

  confirmCopy = (auth) => {
    const { t } = this.props;
    confirm({
      title: t('确定复制此记录?'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => this.handleCopy(auth)
    });
  }

  confirmToggleStatus = (btnText, auth) => {
    const { t } = this.props;
    confirm({
      title: t('确定{{btnText}}?', {btnText}),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => this.updateStatus(auth)
    });
  };

  updateStatus = (auth) => {
    const {
      status,
      id
    } = auth;
    const { appId, t } = this.props;

    this.props.requestUpdateStatus({
      appId,
      id,
      status: status === 0 ? 1 : 0
    }).then(() => {
      message.success(t('操作成功!'));
    });
  };

  getColumns = () => {
    const { t, defaultGrantEnums } = this.props;
    const { defaultGrantContentType, defautlGrantIsActiveStatus } = defaultGrantEnums;

    return [{
      title: t('默认授权编号'),
      dataIndex: 'id',
      width: 100
    }, {
      title: t('默认授权名称'),
      dataIndex: 'name',
    }, {
      title: t('默认授权类型'),
      dataIndex: 'grantType',
      render: (text) => defaultGrantContentType[text] || t('未知类型')
    }, {
      title: t('关联属性id'),
      dataIndex: 'relId',
    }, {
      title: t('使用状态'),
      dataIndex: 'status',
      render: (text) => defautlGrantIsActiveStatus[text] || t('未知状态')
    }, {
      title: t('详情'),
      dataIndex: 'details',
      render: (text) => {
        return _.map(text, (detail) =>  {
          return <p key={detail.id}>({detail.id}){detail.name}</p>;
        });
      }
    }, {
      title: t('操作'),
      dataIndex: 'action',
      render: (text, record) => {
        const { status } = record;
        const btnText = status === 0 ? t('启用') : t('停用');
        const content = (
          <span>
            <Button
              type="danger"
              size="small"
              className="btn delete-btn"
              onClick={() => this.confirmDelete(record)}
            >
              {t('删除')}
            </Button>

            <Button
              size="small"
              className="btn stop-btn"
              onClick={() => this.confirmToggleStatus(btnText, record)}
            >
              {btnText}
            </Button>

            <Button
              size="small"
              className="btn edit-btn"
              onClick={() => this.handleEdit(record, 'edit')}
            >
              {t('编辑')}
            </Button>

            <Button
              size="small"
              className="btn copy-btn"
              onClick={() => this.confirmCopy(record)}
            >
              {t('复制')}
            </Button>
          </span>
        );

        return (
          <Popover
            overlayStyle={{zIndex: 999}}
            content={content}
            placement="topRight"
            trigger="click">
            <Button size="small">
              {t('操作')}
            </Button>
          </Popover>
        );
      }
    }];
  }

  getDataSource = () => {
    const { records } = this.props.data;
    _.each(records, (record) => {
      record.details = [
        ...record.areaList,
        ...record.roleList,
        ...record.flagList,
      ];
    });
    return records;
  }

  renderOptions = (content) => {
    return _.map(content, (name, value) => (
      <Option key={value} value={value}>{name}</Option>
    ));
  }

  render() {
    const {
      t, defaultGrantEnums, data,
      requestAdd, requestUpdate,
    } = this.props;

    if (!defaultGrantEnums) {
      return null;
    }

    const { getFieldDecorator } = this.props.form;
    const { defaultGrantContentType, defautlGrantIsActiveStatus } = defaultGrantEnums;
    const {
      current, size, total,
      modalStatus,
    } = data;
    const { modalVisible, defaultAuthFormValue } = this.state;

    return (
      <div className="defaultauth-page">
        <Card title={t('默认授权管理')} bordered={false}>
          <Row gutter={24} className="search-fields">
          <Col span={8}>
            <FormItem label={t('目标系统：')}>
              <AvailableApps
                style={{width: '100%'}}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('默认授权名称：')}>
              {
                getFieldDecorator('name')(
                  <Input
                    placeholder={t('请输入关键字进行模糊匹配')}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('默认授权类型：')}>
              {
                getFieldDecorator('grantType')(
                  <Select
                    placeholder={t('请选择')}
                    className="menu-select"
                    onChange={(value) => {this.handleSelectChange('grantType', value);}}
                  >
                    {this.renderOptions(defaultGrantContentType)}
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('使用状态：')}>
              {
                getFieldDecorator('status')(
                  <Select
                    placeholder={t('请选择')}
                    className="menu-select"
                    onChange={(value) => {this.handleSelectChange('status', value);}}
                  >
                    {this.renderOptions(defautlGrantIsActiveStatus)}
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={16}>
            <FormItem label="">
              <Button
                type="primary"
                onClick={() => this.handleFetch()}>
                {t('查询')}
              </Button>
              <Button
                className="btn"
                onClick={this.handleOpenModal}>
                {t('新增默认授权')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        </Card>

        <Card title={t('默认授权列表')} bordered={false} className="defaultauth-list">
          <Table
            rowKey="id"
            className="upm-table"
            columns={this.getColumns()}
            dataSource={this.getDataSource()}
            pagination={{
              current,
              pageSize: size,
              hideOnSinglePage: true,
              total,
              onChange: this.handlePageChange
            }}
          />
        </Card>

        <DefaultAuthForm
          modalVisible={modalVisible}
          modalStatus={modalStatus}
          handleModalVisible={this.handleModalVisible}
          t={t}
          data={data}
          initialValue={defaultAuthFormValue}
          addAuth={requestAdd}
          updateAuth={requestUpdate}
        />
      </div>
    );
  }
}

export default connect(({ global, defaultauth }) => {
  const { defaultgrantenums } = global.enumMap;

  return {
    appId: global.managingApp,
    defaultGrantEnums: defaultgrantenums,
    data: defaultauth,
  };
}, (dispatch) => ({
  fetchData(params) {
    dispatch({
      type: 'defaultauth/fetchList',
      payload: params
    });
  },
  fetchDept(params) {
    dispatch({
      type: 'defaultauth/fetchDept',
      payload: params,
    });
  },
  fetchJobCode(params) {
    dispatch({
      type: 'defaultauth/fetchJobCode',
      payload: params,
    });
  },
  fetchRoleList(params) {
    dispatch({
      type: 'defaultauth/fetchRoleList',
      payload: params
    });
  },
  fetchFlagList(params) {
    dispatch({
      type: 'defaultauth/fetchFlagList',
      payload: params
    });
  },
  fetchAreaList(params) {
    dispatch({
      type: 'defaultauth/fetchAreaList',
      payload: params
    });
  },
  requestUpdateStatus(params) {
    return dispatch({
      type: 'defaultauth/updateStatus',
      payload: params
    });
  },
  requestDelete(params) {
    return dispatch({
      type: 'defaultauth/delete',
      payload: params
    });
  },
  requestAdd(params) {
    return dispatch({
      type: 'defaultauth/add',
      payload: params,
    });
  },
  requestUpdate(params) {
    return dispatch({
      type: 'defaultauth/updateData',
      payload: params,
    });
  },
  requestCopy(params) {
    return dispatch({
      type: 'defaultauth/copy',
      payload: params,
    });
  },
}))(Form.create()(ManageDefaultAuth));
