import React, { Component } from 'react';
import _ from 'lodash';
import {
  Button, Select, Form,
  Table, Card, Row,
  Col, Modal, Input,
  Divider, message
} from 'antd';
import moment from 'moment';
import connect from '@utils/translateConnect';
import RegionModal from '../../Account/RegionModal';
import TextButton from '../../../../components/TextButton';
import TableSelector from '../../../../components/TableSelector';
import AvailableApps from '@components/AvailableApps';

import './index.less';

const confirm = Modal.confirm;
const { Option } = Select;
const FormItem = Form.Item;

const editingItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
};

class BigDataUser extends Component {
  state = {
    isEditing: false,
    isDistributing: false,
    bindingType: 'add', // add: 新增用户, update: 更新用户
    editingRecordId: '',
    editingBusinessId: '',
    editingTypeId: '',
    editingResourceId: '',
    editingResourceName: '',
    editingResourceKey: '',
    editingUserName: '',
  }

  init(appId) {
    const { fetchBusinessLine, fetchResourceType, form } = this.props;
    
    Promise //初始化业务线选择后，默认选中业务线第一条数据做数据查询并且渲染
    .all([fetchBusinessLine(appId)])
    .then(() => {
      const timer = setInterval(() => {
        const { businessLine } = this.props.bigData
        if(businessLine.length > 0){
          clearInterval(timer)
          form.setFieldsValue({
            businessId: businessLine[0].id
          })
          this.handleSubmit()
        }
      }, 50)
    });
    fetchResourceType(appId);
  }

  componentWillMount () {
    const { appId } = this.props
    if (appId) {
      this.init(appId)
    }
  }

  /**
   * 改写逻辑，业务线id或者类型id有变化可能会有数据获取
   * wujianjian edit
   * July 28, 2018
   */
  componentDidUpdate(prevProps, prevState) {
    const { appId } = this.props
    if(appId && appId != prevProps.appId){
      this.init(appId)
    }
    const { editingTypeId, editingBusinessId } = this.state;

    if(editingTypeId === '' || //类型id和业务线id都有才能去请求数据
      editingTypeId === undefined || 
      editingBusinessId === '' || 
      editingBusinessId === undefined){
        return
    }

    const { fetchResourceList } = this.props;

    if (prevState.editingBusinessId != editingBusinessId || prevState.editingTypeId != editingTypeId) {
      fetchResourceList({ 
        businessId: editingBusinessId, 
        resourceTypeId: editingTypeId,
        appId
      });
    }
  }

  handleSubmit = (page) => {
    const { form, fetchResource } = this.props;
    this.setState({
      current: page
    })
    form.validateFields((err, values) => {
      if (!err) {
        const appId = this.props.appId;
        fetchResource({ appId, page, size: 10, ...values });
      }
    });
  }

  handleAddUser = () => {
    this.setState({
      editingRecordId: '',
      editingBusinessId: '',
      editingTypeId: '',
      editingResourceName: '',
      editingResourceKey: '',
      editingUserName: '',
      isEditing: true,
      bindingType: 'add',
    });
  }

  handlePageChange = (page) => {
    this.handleSubmit(page);
  }

  handleEdit = (record) => {
    const {
      businessId = '', typeId = '', resourceName = '',
      resourceKey = '', username = '', id = '', resourceId = '',
    } = record;
    this.setState({
      editingRecordId: id,
      editingBusinessId: businessId,
      editingTypeId: typeId,
      editingResourceId: resourceId,
      editingResourceName: resourceName,
      editingResourceKey: resourceKey,
      editingUserName: username,
      isEditing: true,
      bindingType: 'update',
    });
  }

  handleBinding = () => {
    const allFieldsFill = this.state.editingBusinessId
      && this.state.editingTypeId
      && this.state.editingResourceKey
      && this.state.editingResourceName
      && this.state.editingUserName;

    if (!allFieldsFill) {
      message.error('请填写必填项！');
      return;
    }
    const { updateUser, addUser, t, appId } = this.props;
    const {
      editingRecordId,
      editingBusinessId, editingTypeId, bindingType,
      editingResourceName, editingResourceKey, editingUserName
     } = this.state;
    const params = {
      id: editingRecordId,
      businessId: editingBusinessId,
      typeId: editingTypeId,
      resourceName: editingResourceName,
      resourceKey: editingResourceKey,
      username: editingUserName,
    };
    if (bindingType == 'update') {
      updateUser({ appId, ...params }).then(() => {
        message.success(t('操作成功！'));
        this.handleSubmit();
        this.setState({
          isEditing: false
        });
      });
    }
    else if (bindingType == 'add') {
      addUser({ appId, ...params }).then(() => {
        message.success(t('操作成功！'));
        this.handleSubmit();
        this.setState({
          isEditing: false
        });
      });
    }
  }

  handleOk = (key) => {
    this.setState({
      [key]: false
    });
  }

  handleCancel = (key) => {
    this.setState({
      [key]: false
    });
  }

  handleChangeEditingField = (key, value = '') => {
    this.setState({
      [key]: value
    });
  }

  handleDelete = (record) => {
    const { deleteUser, t, appId } = this.props;
    deleteUser({ ...record, appId }).then(() => {
      message.success(t('操作成功！'));
      this.handleSubmit();
    });
  }

  handleSelectResource = (record) => {
    let resourceKey = '';
    let label = '';
    let id = 0
    if (!_.isEmpty(record)) {
      resourceKey = record[0].resourceKey;
      label = record[0].label;
      id = record[0].key
    }
    this.setState({
      editingResourceId: id,
      editingResourceKey: resourceKey,
      editingResourceName: label,
    });
  }

  confirmDelete = (record) => {
    const { t } = this.props;
    confirm({
      title: t('确定删除此记录?'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => this.handleDelete(record)
    });
  }

  /**
   * 设置当前选中角色, 配合地区绑定
   */
  setCurrent = (account) => {
    // 更新角色信息
    this.props.mergeAccount(account);
  };

  distrRegion = (account) => {
    const { appId } = this.props
    this.setCurrent(account);

    Promise.all([
      this.props.getAppArea({ appId }),
      this.props.fetchRelevantRegion({ appId, userId: account.id }),
      this.props.fetchList({ appId}),
    ]).then(() => this.setState({
      isDistributing: true,
    }));
  }

  getSelectorInitialValue = (resourceId, resourceName) => {
    if (resourceId !== undefined && resourceName) {
      return [{label: resourceName, value: resourceId}];
    }
    return [];
  }

  getBusinessNameById = (id) => {
    const { allBusiness } = this.props;
    const businessName = _.filter(allBusiness, (business) => business.id == id)[0];
    return businessName;
  };

  getColumns = () => {
    const { t } = this.props;
    const columns = [
    //   {
    //   title: t('ID'),
    //   dataIndex: 'id',
    // }, {
    {
      title: t('业务线'),
      dataIndex: 'businessName',
    }, {
      title:  t('类型'),
      dataIndex: 'typeName',
    }, {
      title:  t('ID'),
      dataIndex: 'resourceKey',
    },{
      title:  t('名称'),
      dataIndex: 'resourceName',
    },{
      title:  t('授权日期'),
      dataIndex: 'createdAt',
      render: (text) => moment(text).format('YYYY-MM-DD')
    },{
      title:  t('权限失效日期'),
      dataIndex: 'expireAt',
      render: (text) => moment(text).format('YYYY-MM-DD')
    },{
      title: t('姓名'),
      dataIndex: 'usernameZh',
    },{
      title: t('用户名'),
      dataIndex: 'username',
    },{
      title:  t('操作'),
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <div>
            <TextButton
              onClick={() => {this.handleEdit(record);}}
            >
              {t('编辑')}
            </TextButton>
            {/* <Divider type="vertical" />
            <TextButton
              onClick={() => {this.distrRegion(record);}}
            >
              {t('地区绑定')}
            </TextButton> */}
            <Divider type="vertical" />
            <TextButton
              onClick={() => {this.confirmDelete(record);}}
            >
              {t('删除')}
            </TextButton>
          </div>
        );
      }
    }];
    return columns;
  }

  getDataSource = () => {
    const { bigData } = this.props;
    return bigData.resource.records;
  }

  getEditingForm = () => {
    const { t, fetchResourceList, resourceList, bigData } = this.props;
    const { resourceType } = bigData;
    const {
      editingBusinessId, editingTypeId, editingUserName,
      editingResourceId, editingResourceName
    } = this.state;
    const selectorInitialValue = this.getSelectorInitialValue(editingResourceId, editingResourceName);
    return (
      <React.Fragment>
        <FormItem
          {...editingItemLayout}
          label={t('业务线：')}
          required
        >
          <Select
            style={{width: '100%'}}
            value={editingBusinessId}
            onChange={(value) => { this.handleChangeEditingField('editingBusinessId', value); }}
          >
            {this.renderBusinessOptions()}
          </Select>
        </FormItem>
        <FormItem
          {...editingItemLayout}
          label={t('类型选择：')}
          required
        >
          <Select
            style={{width: '100%'}}
            value={editingTypeId}
            onChange={(value) => { this.handleChangeEditingField('editingTypeId', value); }}
          >
            {this.renderTypeOptions()}
          </Select>
        </FormItem>
        <FormItem
          {...editingItemLayout}
          label={t('名称：')}
          required
        >
          <TableSelector
            t={t}
            value={selectorInitialValue}
            selectType="radio"
            resourceList={resourceList}
            resourceTypeId={editingTypeId}
            businessId={editingBusinessId}
            handleFetchResource={fetchResourceList}
            resourceTypeList={resourceType}
            onChange={this.handleSelectResource}
            needShowCloseBtn={true}
          />
        </FormItem>
        <FormItem
          {...editingItemLayout}
          label={t('用户名：')}
          required
        >
          <Input
            style={{width: '100%'}}
            value={editingUserName}
            onChange={(e) => { this.handleChangeEditingField('editingUserName', e.target.value); }}
          />
        </FormItem>
      </React.Fragment>
    );
  }

  renderBusinessOptions = () => {
    const { bigData, t } = this.props;
    const { businessLine } = bigData;
    
    return _.map(businessLine, (business) => {
      return (
        <Option key={business.id} value={business.id}>
          {t(business.name)}
        </Option>
      );
    });
  }

  renderTypeOptions = () => {
    const { bigData, t } = this.props;
    const { resourceType } = bigData;
    return  _.map(resourceType, (type) => {
      return (
        <Option key={type.id} value={type.id}>
          {t(type.name)}
        </Option>
      );
    });
  }

  render() {
    const { form, t, bigData, appId } = this.props;
    const { isEditing, isDistributing } = this.state;
    const { getFieldDecorator } = form;
    const { resource } = bigData;
    const { size, total } = resource;

    return (
      <div className="usermanage-page">
        <Card title={t('用户管理')} bordered={false}>
          <Row gutter={24} className="search-fields">
          <Col span={8}>
            <FormItem label={t('目标系统')} >
              <AvailableApps style={{width: '100%'}}/>
            </FormItem>
          </Col>          
          <Col span={8}>
            <FormItem label={t('业务线选择：')}>
              {
                getFieldDecorator('businessId')(
                  <Select
                    placeholder={t('请选择')}
                    className="menu-select"
                  >
                    {this.renderBusinessOptions()}
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('类型选择：')}>
              {
                getFieldDecorator('typeId')(
                  <Select
                    placeholder={t('请选择')}
                    className="menu-select"
                  >
                    {this.renderTypeOptions()}
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('名称：')}>
              {
                getFieldDecorator('resourceName')(
                  <Input/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('ID：')}>
              {
                getFieldDecorator('resourceKey')(
                  <Input/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('用户名：')}>
              {
                getFieldDecorator('username')(
                  <Input/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="">
              <Button
                type="primary"
                onClick={() => this.handleSubmit()}>
                {t('搜索')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        </Card>
        <Card title={t('用户列表')} bordered={false} className="defaultauth-list">
          <Button
            className="btn assign-auth"
            onClick={this.handleAddUser}>
            {t('分配权限')}
          </Button>
          <Table
            rowKey="id"
            className="upm-table"
            columns={this.getColumns()}
            dataSource={this.getDataSource()}
            pagination={{
              current: this.state.current || 1,
              pageSize: size,
              hideOnSinglePage: true,
              total,
              onChange: this.handlePageChange
            }}
          />
        </Card>

        <Modal
          title={t("分配权限")}
          okText={t("确认分配")}
          visible={isEditing}
          onCancel={() => this.handleCancel('isEditing')}
          onOk={this.handleBinding}
        >
          {isEditing && this.getEditingForm()}
        </Modal>
        <RegionModal
          visible={isDistributing}
          appId={appId}
          handleOk={() => this.handleOk('isDistributing')}
          handleCancel={() => this.handleCancel('isDistributing')}
        />
        </div>
    );
  }
}

export default connect(({ bigData, newApply, global }) => {
  return {
    appId: global.managingApp,
    bigData,
    resourceList: newApply.resourceList,
    appId: global.managingApp
  };
}, (dispatch) => ({
  fetchBusinessLine(appId) {
    dispatch({
      type: 'bigData/fetchBusinessLine',
      payload: { appId }
    });
  },
  fetchResourceType(appId) {
    dispatch({
      type: 'bigData/fetchResourceType',
      payload: { appId }
    });
  },
  fetchResource(params) {
    dispatch({
      type: 'bigData/fetchResource',
      payload: { ...params }
    });
  },
  addUser(params) {
    return dispatch({
      type: 'bigData/addUser',
      payload: { ...params }
    });
  },
  updateUser(params) {
    return dispatch({
      type: 'bigData/updateUser',
      payload: { ...params }
    });
  },
  deleteUser(params) {
    return dispatch({
      type: 'bigData/deleteUser',
      payload: { ...params }
    });
  },
  mergeAccount(account) {
    return dispatch({
      type: 'account/mergeAccount',
      payload: account
    });
  },
  getAppArea(params) {
    const { appId } = params;
    return dispatch({
      type: 'area/getAppArea',
      payload: appId
    });
  },
  fetchRelevantRegion(params) {
    const { appId, userId } = params;
    return dispatch({
      type: 'account/fetchRelevantRegion',
      payload: {
        appId,
        userId,
      }
    });
  },
  fetchList(params) {
    const { appId } = params;
    return dispatch({
      type: 'cityBlacklist/fetchList',
      payload: { appId }
    });
  },
  fetchResourceList(params) {
    const { appId } = params;
    dispatch({
      type: 'newApply/fetchResourceList',
      payload: { appId, params }
    });
  },
}))(Form.create()(BigDataUser));
