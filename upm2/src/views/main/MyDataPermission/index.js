import React from 'react';
import connect from '@utils/translateConnect';
import { Row, Col, Form,
  Select, Table, Card,
  Button, Input, Divider,
  Modal
} from 'antd';
import TextButton from '../../../components/TextButton';
import SystemList from '../../../components/SystemList';
import moment from 'moment';

import './index.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;

class DataPermission extends React.Component {

  state = {
    resourceTypeId: '',
    resourceName: '',
    modalVisible: false,
    currentDataId: ''
  };

  fetchDataList = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'permissionList/fetchDataList',
      payload: { ...params }
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'permissionList/resetData'
    });
  }

  // linkToApplyDetail = (applyId) => {
  //   const { dispatch } = this.props;
  //   const url = `${MAIN}/apply-detail/${applyId}`;
  //   dispatch(routerRedux.push(url));
  // }

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

  handleDelete = (record) => {
    const { dispatch, dataSearches } = this.props;

    dispatch({
      type: 'permissionList/removeDataPermission',
      payload: {
        ...record,
        appId: this.state.appId
      }
    }).then(() => {
      this.handleFetch(dataSearches.current);
    });
  };

  getColumns = () => {
    const { t } = this.props;
    const columns = [{
      title: t('ID'),
      dataIndex: 'resourceKey',
    }, {
      title: t('类型'),
      dataIndex: 'resourceType',
    },
    //   {
    //   title:  t('业务主题'),
    //   dataIndex: 'role',
    // },
    {
      title:  t('名称'),
      dataIndex: 'resourceName',
    },
    //   {
    //   title:  t('中文名'),
    //   dataIndex: 'chineseName',
    // },
    {
      title:  t('到期时间'),
      dataIndex: 'expireTime',
      render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm')
    },{
      title:  t('操作'),
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <div>
            <TextButton
              onClick={() => {this.openModal(record);}}
            >
              {t('详情')}
            </TextButton>
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
  };

  openModal = (resource) => {
    const { dataMap, dispatch } = this.props;
    const resourceId = resource.resourceId

    if (!dataMap[resourceId]) {
      dispatch({
        type: 'permissionList/fetchDataDetail',
        payload: {
          resourceId
        }
      });
    }

    this.setState({
      modalVisible: true,
      currentDataId: resourceId
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
      currentDataId: ''
    });
  };

  handleSearchFieldChange = (key, value) => {
    this.setState({
      [key]: key === 'resourceName' ? value.target.value : value
    });
    if(key == 'appId'){
      const { dispatch } = this.props;

      dispatch({//获取数据权限列表
        type: 'bigData/fetchResourceType',
        payload: { appId:value }
      });
    }
  };

  renderSystemOptions = () => {
    const { t, appIdNames } = this.props;

    return  _.map(appIdNames, (v, k) => {
      return (
        <Option key={k} value={k}>
          {t(v)}
        </Option>
      );
    });
  }

  renderOptions = () => {
    const { resourceType, t } = this.props;
    return  _.map(resourceType, (type) => {
      return (
        <Option key={type.id} value={type.id}>
          {t(type.name)}
        </Option>
      );
    });
  };

  handleFetch = (page) => {
    const { resourceTypeId, resourceName, appId } = this.state;

    this.fetchDataList({appId: appId, resourceTypeId, resourceName, page: page || 1});
  };

  handlePageChange = (page) => this.handleFetch(page);

  render() {
    const { t, dataSearches, dataList, dataMap } = this.props;

    if(dataList && dataList.length > 0){
      dataList.map(item => {
        return item.resourceType = t(item.resourceType)
      })
    }

    const { current, size, total } = dataSearches;
    const { modalVisible, currentDataId, appId } = this.state;
    const detail = currentDataId ? (dataMap[currentDataId] ? dataMap[currentDataId] : dataList.find(item => item.resourceId == currentDataId)) : null;

    return (
      <Card title={t('我拥有的数据权限')} style={{ marginTop: 25 }} className="MyDataPermission">
        <div className="content-area">
          <Row gutter={24}>
            <Col span={10} className="search-fields">
              <FormItem
                label={t('目标系统') + ':'}
              >
                <SystemList
                  value={appId}
                  onChange={(appId) => this.handleSearchFieldChange('appId', appId)}
                  style={{width: '100%'}}
                />
              </FormItem>
            </Col>
            <Col span={10} className="search-fields">
              <FormItem
                label={t('类型选择：')}
              >
                <Select
                  placeholder={t('请选择')}
                  onChange={(value) => this.handleSearchFieldChange('resourceTypeId', value)}
                  style={{width: '100%'}}
                >
                  {this.renderOptions()}
                </Select>
              </FormItem>
            </Col>
            <Col span={10}  className="search-fields">
              <FormItem
                label={t('名称：')}
              >
                <Input
                  placeholder = {t('请输入关键字进行模糊搜索')}
                  onChange={(e) => this.handleSearchFieldChange('resourceName', e)}
                  style={{width: '100%'}}
                />
              </FormItem>
            </Col>
            <Col span={3} className="search-button">
              <FormItem label="">
                <Button
                  type="primary"
                  onClick={() => this.handleFetch()}>
                  {t('搜索')}
                </Button>
              </FormItem>
            </Col>
          </Row>

          <Table
            size="small"
            className="upm-table"
            rowKey="resourceId"
            columns={this.getColumns()}
            dataSource={dataList}
            pagination={{
              current,
              pageSize: size,
              hideOnSinglePage: true,
              total,
              onChange: this.handlePageChange
            }}
          />
        </div>

        <Modal
          width={620}
          visible={modalVisible}
          onOk={this.handleCancel}
          onCancel={this.handleCancel}
          title={t('报表详情查看')}
        >
          {this.getDetailInfo(detail, t)}
        </Modal>
      </Card>
    );
  }

  getDetailInfo = (detail, t) => {
    if (!detail) {
      return null;
    }

    const {
      applyReason,
      resourceKey,
      resourceName
    } = detail;

    return (
      <div className="detail-area">
        <div className="detail-info">
          <div className="label">
            {t('报表ID')}
          </div>
          <div className="info">
            {resourceKey}
          </div>
        </div>
        <div className="detail-info">
          <div className="label">
            {t('报表名称')}
          </div>
          <div className="info">
            {resourceName}
          </div>
        </div>
        <div className="detail-info">
          <div className="label">
            {t('业务线名称')}
          </div>
          <div className="info">
            {this.getProductionLine(detail)}
          </div>
        </div>
        {this.getApplyReason(applyReason, t)}
      </div>
    );
  }

  getProductionLine = (detail) => {
    return detail.properties.find(item => item.attrName === 'business').attrValue
  }

  getApplyReason = (applyReason, t) => {
    return applyReason ?
    (<div className="detail-info">
      <div className="label">
        {t('申请原因')}
      </div>
      <div className="info">
        {applyReason}
      </div>
    </div>)
    : ''
  }
}

export default connect(({ permissionList, bigData }) => {
  return {
    dataList: permissionList.dataList,
    dataSearches: permissionList.dataSearches,
    dataMap: permissionList.dataMap,
    resourceType: bigData.resourceType,
    appIdNames: bigData.appIdNames
  };
})(DataPermission);
