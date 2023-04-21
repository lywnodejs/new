/*
 * @Author: unknown
 * @Date: unknown
 * @LastEditors: GuoTeng
 * @LastEditTime: 2020-11-17 14:52:41
 */
import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { routerRedux } from 'dva/router';
import {
  Input,
  Tabs,
  Button,
  Popconfirm,
  message,
  Form,
  Table,
  Select,
  Col,
  Row,
  Divider
} from 'antd';
import './index.less';
import FilterForm from './components/FilterForm';
import TextButton from '../../../components/TextButton';
import moment from 'moment';
import { MAIN } from '@routes/config';

const TabPane = Tabs.TabPane;

const tabIdNameMapping = {
  1: '地区',
  2: '角色',
  7: '标识位',
  100: '数据资源'
};

const riskLevelNameMapping = {
  1: 'C1',
  2: 'C2',
  3: 'C3',
  4: 'C4'
};

const defaultFilterParams = {
  appId: '',
  permissionName: '',
  businessId: '',
  expire: '',
  resourceTypeIdList: '',
  riskLevelList: '',
  fuzzySearch: ''
};

class MemberList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      permissionType: '2',
      selectedRows: {
        '2': [], // 角色
        '1': [], //地区
        '7': [], //标识位
        '100': [] // 数据资源
      },
      pageCurrent: 1,
      pageSize: 10,
      filterParams: {
        ...defaultFilterParams
      },
      currentUsername: '',
      batchCloseButtonLoading: false
    };
    this.loadingFlagByTabChange = false;
  }

  componentDidMount() {
    const { match } = this.props;
    const { username } = match.params;
    this.setState(
      {
        currentUsername: username
      },
      () => {
        //获取tabs各项count
        this.getPermissionCount();
        this.search();
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.username !== this.props.match.params.username) {
      const { username } = nextProps.match.params;
      this.setState(
        {
          currentUsername: username
        },
        () => {
          //获取tabs各项count
          this.getPermissionCount();
          this.search();
        }
      );
    }
    // // 这时候还没有更新global.globalAppId，所以放到下一次eventLoop里面更新
    // if (nextProps.global.globalAppId !== this.props.global.globalAppId) {
    //   setTimeout(() => {
    //     this.search()
    //   }, 0)
    // }
  }

  /**
   * 获取tab栏count
   */
  getPermissionCount = () => {
    this.props.dispatch({
      type: 'review/fetchPermission',
      payload: {
        username: this.state.currentUsername
      }
    });
  };

  /**
   * 请求权限列表
   */
  search = () => {
    const { dispatch } = this.props;
    // const { username } = match.params;
    const { pageCurrent, pageSize, permissionType, filterParams } = this.state;

    const baseParams = {
      page: pageCurrent,
      size: pageSize,
      permissionType: permissionType,
      username: this.state.currentUsername
      // expire: expire,
    };
    let params = {};
    if (permissionType == 100) {
      //数据资源
      params = {
        ...baseParams,
        expire: 0,
        appId: filterParams.appId,
        resourceTypeIdList: filterParams.resourceTypeIdList,
        riskLevelList: filterParams.riskLevelList,
        businessId: filterParams.businessId,
        fuzzySearch: filterParams.fuzzySearch
      };
    } else {
      //其他tab
      params = {
        ...baseParams,
        expire: filterParams.expire,
        appId: filterParams.appId,
        permissionName: filterParams.permissionName,
        businessId: filterParams.businessId
      };
    }

    dispatch({
      type: 'review/fetchPermissionList',
      payload: params
    });
  };

  /**
   * 搜索操作
   * @param {object} filterParams
   */
  handleSearchFromFilterForm = filterParams => {
    this.setState(
      {
        pageCurrent: 1,
        filterParams: {
          ...this.state.filterParams,
          ...filterParams
        }
      },
      () => {
        this.search();
      }
    );
  };
  /**
   * 重置操作
   */
  handleResetFromFilterForm = () => {
    this.setState(
      {
        filterParams: { ...defaultFilterParams },
        pageCurrent: 1
      },
      () => {
        this.search();
      }
    );
  };

  /**
   * Tabs切换
   * @param {string} tabKey
   */
  handlePermissionTypeChange = tabKey => {
    this.loadingFlagByTabChange = true;
    this.filterForm.resetFields();
    this.setState(
      {
        permissionType: tabKey,
        pageCurrent: 1,
        filterParams: {
          ...defaultFilterParams
        }
      },
      () => {
        setTimeout(() => {
          this.loadingFlagByTabChange = false;
          this.search();
        }, 300);
      }
    );
  };

  /**
   * 获取列表-列信息
   */
  getColumns = () => {
    const { t } = this.props;
    const { permissionType } = this.state;
    const customColumns =
      permissionType != '100'
        ? [
            {
              title: t(tabIdNameMapping[permissionType] + '名称'),
              dataIndex: 'name',
              key: 'name'
            }
          ]
        : [
            {
              title: t('数据资源ID'),
              dataIndex: 'resourceKey',
              key: 'resourceKey'
            },
            {
              title: t(tabIdNameMapping[permissionType] + '名称'),
              dataIndex: 'name',
              key: 'name'
            },
            {
              title: t('数据类型'),
              dataIndex: 'resourceTypeName',
              key: 'resourceTypeName'
            },
            {
              title: t('数据敏感级'),
              dataIndex: 'riskLevel',
              key: 'riskLevel',
              render: riskLevel => (
                <span>{riskLevelNameMapping[riskLevel]}</span>
              )
            }
          ];
    return [
      {
        title: t('系统名称'),
        dataIndex: 'appName',
        key: 'appName',
        width: 180,
        fixed: 'left'
      },
      ...customColumns,
      {
        title: t('业务线'),
        dataIndex: 'businessName',
        key: 'businessName'
      },
      {
        title: t('申请时间'),
        dataIndex: 'applyDate',
        key: 'applyDate',
        render: time => (time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '')
      },
      {
        title: t('过期时间'),
        dataIndex: 'expireDate',
        key: 'expireDate',
        render: time => {
          if (time) {
            if (time < Date.now()) {
              return (
                <span style={{ color: 'red' }}>
                  {moment(time).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              );
            } else {
              return moment(time).format('YYYY-MM-DD HH:mm:ss');
            }
          } else {
            return '';
          }
        }
      },
      {
        title: t('操作'),
        dataIndex: 'operate',
        key: 'operate',
        width: 160,
        fixed: 'right',
        render: (text, record) => {
          return (
            <Popconfirm
              placement="top"
              title={t('确定关闭权限？')}
              onConfirm={() => this.handleClose(record)}
              okText={t('确定')}
              cancelText={t('取消')}>
              <TextButton>{t('关闭权限')}</TextButton>
            </Popconfirm>
          );
        }
      }
    ];
  };

  /**
   * 关闭权限
   * @param {object} record
   */
  handleClose = record => {
    const { permissionType, selectedRows } = this.state;
    const { dispatch, t } = this.props;
    let params = [];
    if (record) {
      //单条数据关闭
      params = [
        {
          appId: record.appId,
          permissionType: Number(permissionType),
          targetId: record.id
        }
      ];
    } else {
      //批量关闭
      this.setState({
        batchCloseButtonLoading: true
      });
      params = selectedRows[permissionType].map(item => ({
        appId: item.appId,
        permissionType: Number(permissionType),
        targetId: item.id
      }));
    }
    dispatch({
      type: 'review/permissionClose',
      payload: {
        username: this.state.currentUsername,
        data: params
      }
    })
      .then(data => {
        //success，data为null
        if (data) {
          message.error(t('删除失败'));
        } else {
          message.success(t('操作成功'));
          this.setState({
            selectedRows: {
              ...selectedRows,
              [permissionType]: []
            }
          });
          this.getPermissionCount();
          this.search();
        }
      })
      .finally(() => {
        this.setState({
          batchCloseButtonLoading: false
        });
      });
  };

  /**
   * 删除特定rows
   * 多选支持跨页选择
   * @param {*} key
   * @param {*} value
   */
  deleteSelectdRows = (key, value) => {
    let { selectedRows } = this.state;

    if (_.isArray(value)) {
      value.forEach(item => {
        _.remove(selectedRows[key], i => item === i.relId);
      });
    } else {
      _.remove(selectedRows[key], i => value == i.relId);
    }

    this.setState({
      selectedRows: {
        ...selectedRows,
        [key]: [...selectedRows[key]]
      }
    });
  };

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
        this.search();
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
        this.search();
      }
    );
  };

  render() {
    const { t, permission, permissionData = {}, loading } = this.props;

    const {
      permissionType,
      selectedRows,
      batchCloseButtonLoading
    } = this.state;

    const {
      // current,
      // size,
      total,
      records
    } = permissionData;

    const rowSelection = {
      selectedRowKeys: selectedRows[permissionType]
        ? selectedRows[permissionType].map(item => item.relId)
        : [],
      // onChange: (selectedRowKeys, selectedRows) => {
      //   this.setState({
      //     selectedRows
      //   })
      // },
      onSelect: (record, selected) => {
        if (selected) {
          const newSelectedRows = JSON.parse(JSON.stringify(selectedRows));
          newSelectedRows[permissionType].push(record);
          this.setState({
            selectedRows: newSelectedRows
          });
        } else {
          this.deleteSelectdRows(permissionType, record.relId);
        }
      },
      onSelectAll: selected => {
        if (selected) {
          this.setState({
            selectedRows: {
              ...selectedRows,
              [permissionType]: [
                ...(selectedRows[permissionType] || []),
                ...records
              ]
            }
          });
        } else {
          this.deleteSelectdRows(permissionType, records.map(i => i.relId));
        }
      }
    };
    const hasSelected = selectedRows[permissionType].length > 0;
    return (
      <div className="member-list upm-filter-content-page">
        <Tabs
          size="large"
          className="tabs"
          defaultActiveKey="2"
          activeKey={permissionType}
          onChange={this.handlePermissionTypeChange}>
          <TabPane
            tab={t('角色') + `(${permission.roleCount || 0})`}
            key="2"></TabPane>
          <TabPane
            tab={t('地区') + `(${permission.areaCount || 0})`}
            key="1"></TabPane>
          <TabPane
            tab={t('标识位') + `(${permission.flagCount || 0})`}
            key="7"></TabPane>
          <TabPane
            tab={t('数据资源') + `(${permission.resourceCount || 0})`}
            key={100}></TabPane>
        </Tabs>

        <div className="filter-area">
          <FilterForm
            ref={ref => {
              this.filterForm = ref;
            }}
            permissionType={permissionType}
            search={this.handleSearchFromFilterForm}
            reset={this.handleResetFromFilterForm}
          />
        </div>
        <div className="content-area">
          <div className="options">
            <Button
              type="primary"
              ghost
              loading={batchCloseButtonLoading}
              onClick={() => {
                this.handleClose();
              }}
              disabled={!hasSelected}>
              {t('批量关闭权限')}
            </Button>
          </div>
          <Table
            dataSource={records}
            columns={this.getColumns()}
            // size="small"
            // scroll={{ x: 1000 }}
            pagination={{
              current: this.state.pageCurrent,
              pageSize: this.state.pageSize,
              // hideOnSinglePage: true,
              total,
              onChange: this.handlePageChange,
              showTotal: total => `${t('共')} ${total} ${t('条')}`,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              onShowSizeChange: this.onShowSizeChange
            }}
            className="upm-table"
            rowKey="relId"
            loading={loading || this.loadingFlagByTabChange}
            rowSelection={rowSelection}
          />
        </div>
      </div>
    );
  }
}

export default connect(({ global, review }) => {
  return {
    // global,
    // ...entrance,
    // appId: global.globalAppId,
    permission: review.permission,
    permissionData: review.permissionData,
    loading: review.loading,
    apps: global.apps
  };
})(MemberList);
