import React from 'react';
import { Card, Table, Button } from 'antd';
import connect from '@utils/translateConnect';
import FilterForm from './components/FilterForm';
import UserModal from './components/UserModal';
import BatchBindModal from './components/BatchBindModal';
import { echoMessage } from '@utils/notice';
import './style.less';

const riskLevelNameMapping = {
  1: 'C1',
  2: 'C2',
  3: 'C3',
  4: 'C4'
};

const defaultFilterParams = {
  resourceTypeIdList: '',
  riskLevelList: '',
  businessIdList: '',
  fuzzySearch: ''
}

const getValueByNameInObjArr = (properties,attrName='id') => {
  let attrValue;
  properties.some(property => {
    if(property.attrName===attrName) {
      attrValue = property.attrValue;
      return true;
    }
  })
  return attrValue
}
class DataRescource extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterParams:{
        ...defaultFilterParams
      },
      dataSource:[], // 数据资源列表
      selectedRowKeys: [], // 选中的数据资源id列表
      total: 0, // 页码总数
      pageCurrent: 1, // 当前页码
      pageSize: 10,
      currentRecord: {},
      modalVisibleForUserModal: false,
      modalVisibleForBatchBindModal: false
    }
    this.columns = [ // 表头信息
      {
        title: '数据资源ID',
        dataIndex: 'resourceKey',
      },
      {
        title: '数据资源名称',
        dataIndex: 'resourceName',
      },
      {
        title: '数据类型',
        dataIndex: 'resourceTypeName',
      },
      {
        title: '数据敏感级',
        dataIndex: 'properties',
        render: (properties, record) => {
          return (
            <span>
              {riskLevelNameMapping[getValueByNameInObjArr(properties,'riskLevel')]||'-'}
            </span>
          );
        }
      },
      {
        title: '业务线',
        dataIndex: 'businessName',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) => {
          return (
            <span>
              <Button size="small" onClick={()=>{this.bindUser(record)}}>用户绑定</Button>
            </span>
          );
        }
      }
    ]
  }

  componentDidMount () {
    const {managingApp} = this.props;
    if(managingApp) {
      this.getDataSource(managingApp);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.managingApp !== this.props.managingApp) {
      this.setState({
        filterParams: {
          ...defaultFilterParams
        },
        pageCurrent: 1,
        selectedRowKeys: []
      },()=>{
        this.getDataSource(nextProps.managingApp);
      })
    }
  }

  /**
   * 获取数据资源列表
   */
  getDataSource = (appId) => {
    let newAppId;
    if(appId) {
      newAppId = appId;
    } else {
      const {managingApp} = this.props;
      if(!managingApp) {
        return;
      }
      newAppId = managingApp;
    }
    
    const {filterParams,pageCurrent,pageSize} = this.state;
    const params = {
      appId: newAppId,
      ...filterParams,
      page: pageCurrent,
      size: pageSize,
    }
    this.props.dispatch({
      type: 'dataResource/getQueryList',
      payload: params
    }).then((res) => {
      this.setState({
        dataSource: res.records,
        total: res.total,
        pageCurrent: res.current
      })
    })
  }

  
  /**
   * 筛选区域-查询
   * @param {object} filterParams
   */
  handleSearchFromFilterForm = (filterParams) => {
    this.setState({
      filterParams,
      pageCurrent: 1,
      selectedRowKeys: []
    },()=>{
      this.getDataSource();
    })
  }

  /**
   * 筛选区域-清空
   */
  handleResetFromFilterForm = () => {
    this.setState({
      filterParams: {
        ...defaultFilterParams
      },
      pageCurrent: 1,
      selectedRowKeys: []
    },()=>{
      this.getDataSource();
    })
  }

  /**
   * 用户绑定
   * @param {object} record 
   */
  bindUser = (record) => {
    this.setState({
      currentRecord: record,
      modalVisibleForUserModal: true
    },()=>{
      this.getRelevantUsers()
    })
  }
  /**
   * 获取绑定的用户列表
   * @param {string}} userNames 
   */
  getRelevantUsers = (userNames='') => {
    const {currentRecord} = this.state;
    const {dispatch,managingApp } = this.props;
    const params = {
      appId: managingApp,
      resourceId: currentRecord.id,
      userNames
    }
    dispatch({
      type: 'dataResource/getRelevantUsers',
      payload: params
    })
  }

  /**
   * 绑定用户Modal-关联用户
   * @param {string} userNames 
   */
  releUsers = (userNames='') => {
    const {currentRecord} = this.state;
    const {dispatch,managingApp } = this.props;
    const params = {
      appId: managingApp,
      userNames,
      addResourceIdList: [currentRecord.id],
      removeResourceIdList: []
    }
    return dispatch({
      type: 'dataResource/relation',
      payload: params
    })
  }

  /**
   * 绑定用户Modal-取消关联/一键清空用户
   * @param {string} userNames 
   */
  unReleUsers = (userNames='') => {
    const {currentRecord} = this.state;
    const {dispatch,managingApp } = this.props;
    const params = {
      appId: managingApp,
      userNames,
      addResourceIdList: [],
      removeResourceIdList: [currentRecord.id]
    }
    return dispatch({
      type: 'dataResource/relation',
      payload: params
    })
  }

  /**
   * 绑定用户Modal-取消
   */
  handleCancelOnUserModal = () => {
    this.setState({
      modalVisibleForUserModal: false
    })
  }

  /**
   * 绑定用户Modal-关闭-清空列表
   */
  handleAfterCloseOnUserModal = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'dataResource/save',
      payload: {
        relevantUsers: []
      }
    })
  }

  /**
   * 批量绑定用户
   */
  batchReleUser = () => {
    this.setState({
      modalVisibleForBatchBindModal: true
    })
  }

  /**
   * 批量绑定用户Modal-确认
   * @param {string} userNames 
   */
  handleOkOnBatchBindModal = (userNames) => {
    const {t, dispatch, managingApp} = this.props;
    const params = {
      appId: managingApp,
      userNames,
      addResourceIdList: this.state.selectedRowKeys,
      removeResourceIdList: []
    }
    dispatch({
      type: 'dataResource/relation',
      payload: params
    }).then(()=>{
      this.setState({
        selectedRowKeys: [],
        modalVisibleForBatchBindModal: false
      })
      echoMessage(t('批量绑定成功'),'success')
    })

  }
  /**
   * 批量绑定用户Modal-取消
   */
  handleCancelOnBatchBindModal = () => {
    this.setState({
      modalVisibleForBatchBindModal: false
    })
  }

  /**
   * 翻页
   * @param {number} page
   */
  handlePageChange = page => {
    this.setState(
      {
        pageCurrent: page
      },
      () => {
        this.getDataSource();
      }
    );
  };

  /**
   * 每页显示数量改变
   * @param {number} current
   * @param {number} size
   */
  onShowSizeChange = (current, size) => {
    this.setState(
      {
        pageCurrent: current,
        pageSize: size
      },
      () => {
        this.getDataSource();
      }
    );
  };
  

  render(){
    const{t,dataResource:{relevantUsers,loading:{loadingRelevantUsers}}} = this.props
    const{ selectedRowKeys,currentRecord, pageCurrent, pageSize, total, modalVisibleForBatchBindModal } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({
          selectedRowKeys
        })
      },
    }
    
    return(
      <div className="dataRescource">
        <Card title={t('数据资源')} bordered={false}>
          <FilterForm 
            data={this.state}
            search={this.handleSearchFromFilterForm}
            reset={this.handleResetFromFilterForm}
          />
        </Card>
        <Card bordered={false} className="dataList">
          <div className="options">
            <Button
              type="primary"
              ghost
              onClick={this.batchReleUser}
              disabled={selectedRowKeys.length===0}
            >
              {t('批量绑定用户')}
            </Button>
          </div>
          <Table
            rowKey='id'
            rowSelection={rowSelection} 
            columns={this.columns} 
            dataSource={this.state.dataSource} 
            onChange={this.tabChange} 
            pagination={{
              current: pageCurrent,
              pageSize: pageSize,
              total: total,
              onChange: this.handlePageChange,
              showTotal: total => `${t('共')} ${total} ${t('条')}`,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10','20','50'],
              onShowSizeChange: this.onShowSizeChange,
            }} 
          />
        </Card>
        <UserModal
          title={currentRecord.resourceName||''}
          relevantUsers={relevantUsers}
          visible={this.state.modalVisibleForUserModal}
          loadingRelevantUsers={loadingRelevantUsers}
          handleCancel={this.handleCancelOnUserModal}
          afterClose={this.handleAfterCloseOnUserModal}
          getRelevantUsers={this.getRelevantUsers}
          releUsers={this.releUsers}
          unReleUsers={this.unReleUsers}
        />
        <BatchBindModal
          visible={modalVisibleForBatchBindModal}
          handleOkOnBatchBindModal={this.handleOkOnBatchBindModal}
          handleCancelOnBatchBindModal={this.handleCancelOnBatchBindModal}
        />

      </div>
    );
  }
}

export default connect(({ global, dataResource }) => {
  return {
    managingApp: global.managingApp,
    dataResource
  };
})(DataRescource);
