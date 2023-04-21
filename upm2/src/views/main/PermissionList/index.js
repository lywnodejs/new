/*
 * @Author: Meng Hao
 * @Date: 2018-09-12 11:23:57
 * @LastEditors: GuoTeng
 * @LastEditTime: 2020-11-16 15:52:05
 */

import React from 'react';
import _, { filter } from 'lodash';
import connect from '@utils/translateConnect';
import { routerRedux } from 'dva/router';
import {
  Tabs,
  Button,
  Popconfirm,
  message,
  Table,
  Divider,
  Modal,
  Icon
} from 'antd';
import TextButton from '../../../components/TextButton';
import moment from 'moment';
import { MAIN } from '@routes/config';
import FilterForm from './components/FilterForm';
import BatchApplyOrPostponeModal from './components/BatchApplyOrPostponeModal';
import ErrorApplyListModal from './components/ErrorApplyListModal';
import './index.less';

const TabPane = Tabs.TabPane;

const tabIdentifying = {
  1: 'area',
  2: 'role',
  7: 'flag'
  // 100: 'bigdata_data_set'
};
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
  resourceTypeIdList: '',
  riskLevelList: '',
  fuzzySearch: ''
};

class PermissionList extends React.PureComponent {
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
      errorApplyList: [],
      batchApplyOrPostponeModalVisible: false,
      errorApplyListModalVisible: false,
      batchCloseButtonLoading: false,
      batchApplyOrPostponeModalLoading: false,
      twoConfirmClick: false,
      confirmId: null
    };
    this.loadingFlagByTabChange = false;
  }

  componentDidMount() {
    //获取tabs各项count
    this.getPermissionCount();
    this.search();
  }

  /**
   * 获取tab栏count
   */
  getPermissionCount = () => {
    const { expire } = this.props;
    this.props.dispatch({
      type: 'entrance/fetchPermission',
      payload: {
        expire
      }
    });
  };

  /**
   * 请求权限列表
   */
  search = () => {
    const { dispatch, expire } = this.props;
    const { pageCurrent, pageSize, permissionType, filterParams } = this.state;

    const baseParams = {
      page: pageCurrent,
      size: pageSize,
      permissionType: permissionType,
      riskLevelList: filterParams.riskLevelList,
      expire: expire
    };
    let params = {};
    if (permissionType == 100) {
      //数据资源
      params = {
        ...baseParams,
        appId: filterParams.appId,
        resourceTypeIdList: filterParams.resourceTypeIdList,
        businessId: filterParams.businessId,
        fuzzySearch: filterParams.fuzzySearch
      };
    } else {
      //其他tab
      params = {
        ...baseParams,
        appId: filterParams.appId,
        permissionName: filterParams.permissionName,
        businessId: filterParams.businessId
      };
    }
    dispatch({
      type: 'permissionList/fetchPermissionList',
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
    const { t, expire } = this.props;
    const { permissionType } = this.state;
    const customColumns =
      permissionType != '100'
        ? [
            {
              title: t(tabIdNameMapping[permissionType] + '名称'),
              dataIndex: 'name',
              key: 'name',
              width: 100
            }
          ]
        : [
            {
              title: t('数据资源ID'),
              dataIndex: 'resourceKey',
              key: 'resourceKey',
              width: 100
            },
            {
              title: t(tabIdNameMapping[permissionType] + '名称'),
              dataIndex: 'name',
              key: 'name',
              width: 100
            },
            {
              title: t('数据类型'),
              dataIndex: 'resourceTypeName',
              key: 'resourceTypeName',
              width: 100
            }
          ];
    return [
      {
        title: t('系统名称'),
        dataIndex: 'appName',
        key: 'appName',
        width: 100
      },
      ...customColumns,
      {
        title: t('业务线'),
        dataIndex: 'businessName',
        key: 'businessName',
        width: 100
      },
      {
        title: t('数据敏感级'),
        dataIndex: 'riskLevel',
        key: 'riskLevel',
        width: 100,
        render: riskLevel => (
          <span>{riskLevel ? riskLevelNameMapping[riskLevel] : '-'}</span>
        )
      },
      {
        title: t('申请时间'),
        dataIndex: 'applyDate',
        key: 'applyDate',
        width: 100,
        render: time => (time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '')
      },
      {
        title: t('过期时间'),
        dataIndex: 'expireDate',
        key: 'expireDate',
        width: 100,
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
        width: 120,
        render: (text, record) => {
          return expire != '-1' ? (
            <div>
              <TextButton onClick={() => this.reapply(record)}>
                {t('申请延期')}
              </TextButton>
              <Divider type="vertical" />
              <TextButton onClick={() => this.TwoClose(record)}>
                {t('关闭权限')}
              </TextButton>
              {/*<Popconfirm*/}
              {/*    placement="top"*/}
              {/*    title={t('确定关闭权限？')}*/}
              {/*    onConfirm={() => this.handleClose(record)}*/}
              {/*    okText={t('确定')}*/}
              {/*    cancelText={t('取消')}>*/}
              {/*    <TextButton>*/}
              {/*      {t('关闭权限')}*/}
              {/*    </TextButton>*/}
              {/*  </Popconfirm>*/}
            </div>
          ) : (
            <div>
              <TextButton onClick={() => this.reapply(record)}>
                {t('重新申请')}
              </TextButton>
            </div>
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
      type: 'permissionList/permissionClose',
      payload: params
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
   * 重新申请权限
   * @param {object} record
   */
  reapply = record => {
    const { dispatch } = this.props;
    const { permissionType } = this.state;
    if (['1', '2', '7'].indexOf(permissionType) > -1) {
      // 角色，地区，标识位
      dispatch(
        routerRedux.push(
          `${MAIN}/newapply?appId=${record.appId}&identifying=${tabIdentifying[permissionType]}&id=${record.id}`
        )
      );
    } else {
      // 资源类的跳转链接
      dispatch(
        routerRedux.push(
          `${MAIN}/new-apply/${record.identifying}/${record.appId}/${record.resourceKey}`
        )
      );
    }
  };

  /**
   @description: 关闭二次确认
   @item.id  当前id
   **/
  TwoClose = record => {
    this.setState({
      twoConfirmClick: true,
      confirmId: record
    });
  };
  /**
   @description: 二次确认取消
   **/
  confirmCancel = () => {
    this.setState({
      twoConfirmClick: false,
      confirmId: null
    });
  };

  /**
   @description: 二次确认 确定
   **/
  okConfirm = () => {
    this.handleClose(this.state.confirmId);
    this.setState({
      twoConfirmClick: false
    });
  };

  /**
   * 批量延期
   */
  batchPostpone = () => {
    this.setState({
      batchApplyOrPostponeModalVisible: true
    });

    // this.setState({
    //   params: {
    //     dateTime: null,
    //     reason: null
    //   },
    //   visible: true
    // })
  };

  /**
   * 批量关闭弹窗，确认操作
   * @param {object} params
   */
  handleOkOnBatchApplyOrPostponeModal = params => {
    this.setState({
      //modal中采用直接return的方式，所以这里采取这种方式
      batchApplyOrPostponeModalLoading: true
    });
    const { dispatch, t } = this.props;
    const { selectedRows, permissionType } = this.state;
    dispatch({
      type: 'permissionList/permissionBatchApply',
      payload: params
    })
      .then(data => {
        if (data) {
          //有重复申请项
          this.setState(
            {
              batchApplyOrPostponeModalVisible: false
            },
            () => {
              this.setState({
                errorApplyListModalVisible: true,
                errorApplyList: data
              });
            }
          );
        } else {
          //无重复申请项
          message.success(t('操作成功'));
          this.setState({
            batchApplyOrPostponeModalVisible: false,
            selectedRows: {
              ...selectedRows,
              [permissionType]: []
            }
          });
          // this.getPermissionCount();
          this.search();
        }
      })
      .finally(() => {
        this.setState({
          batchApplyOrPostponeModalLoading: false
        });
      });
  };
  /**
   * 批量关闭弹窗，取消操作
   */
  handleCancelOnBatchApplyOrPostponeModal = () => {
    this.setState({
      batchApplyOrPostponeModalVisible: false
    });
  };

  /**
   * 重复申请项弹窗，取消操作
   */
  handleCancelOnErrorApplyListModal = () => {
    this.setState({
      errorApplyListModalVisible: false
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
    const { t, permission, permissionData = {}, expire, loading } = this.props;
    const {
      permissionType,
      selectedRows,
      errorApplyList,
      batchApplyOrPostponeModalVisible,
      errorApplyListModalVisible,
      batchCloseButtonLoading,
      batchApplyOrPostponeModalLoading
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
      // onChange: (selectedRowKeys, selectedRecords) => {
      //   this.setState({
      //     selectedRows: {
      //       ...selectedRows,
      //       [permissionType]: [
      //         ...selectedRecords
      //       ]
      //     }
      //   });
      // }
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
      <div className="permission-list upm-filter-content-page">
        <Tabs
          size="large"
          className="tabs"
          defaultActiveKey="2"
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
            key="100"></TabPane>
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
            {expire != '-1' ? (
              <Button
                type="primary"
                ghost
                loading={batchCloseButtonLoading}
                onClick={() => {
                  this.TwoClose();
                }}
                disabled={!hasSelected}>
                {t('批量关闭权限')}
              </Button>
            ) : null}
            {expire == '30' ? (
              <Button
                type="primary"
                ghost
                onClick={() => {
                  this.batchPostpone();
                }}
                disabled={!hasSelected}>
                {t('批量申请延期')}
              </Button>
            ) : null}
            {expire == '-1' ? (
              <Button
                type="primary"
                ghost
                onClick={() => {
                  this.batchPostpone();
                }}
                disabled={!hasSelected}>
                {t('批量重新申请')}
              </Button>
            ) : null}
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
        <Modal
          className="y_premission_confirm"
          title="关闭权限"
          visible={this.state.twoConfirmClick}
          footer={null}
          onCancel={this.confirmCancel}
          width={400}
          mask={false}
          maskClosable={false}
          centered={true}>
          <Icon type="info-circle" theme="filled" className="info-icon" />
          <p className="content">{t('是否确定关闭权限？')}</p>
          <div className="footer">
            <Button onClick={this.confirmCancel}>{t('取消')}</Button>
            <Button onClick={this.okConfirm} type="primary">
              {t('确定')}
            </Button>
          </div>
        </Modal>
        <BatchApplyOrPostponeModal
          title={expire == '-1' ? t('批量重新申请权限') : t('批量延期权限')}
          visible={batchApplyOrPostponeModalVisible}
          confirmLoading={batchApplyOrPostponeModalLoading}
          permissionType={permissionType}
          records={selectedRows[permissionType]}
          handleOk={this.handleOkOnBatchApplyOrPostponeModal}
          handleCancel={this.handleCancelOnBatchApplyOrPostponeModal}
        />
        <ErrorApplyListModal
          visible={errorApplyListModalVisible}
          errorApplyList={errorApplyList}
          handleCancel={this.handleCancelOnErrorApplyListModal}
        />
      </div>
    );
  }
}

export default connect(({ entrance, global, permissionList }) => {
  return {
    permission: entrance.permission, //tabs各项count
    permissionData: permissionList.permissionData, //权限列表{records,total}
    loading: permissionList.loading, //获取permissionList的loading状态
    apps: global.apps
  };
})(PermissionList);
