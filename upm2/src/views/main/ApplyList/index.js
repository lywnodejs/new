/*
 * @Author: Meng Hao
 * @Date: 2018-09-12 11:25:57
 * @LastEditors: GuoTeng
 * @LastEditTime: 2020-12-10 15:13:28
 */

import React, { Component } from 'react';
import {
  Tabs,
  Table,
  Form,
  Select,
  Col,
  Row,
  Divider,
  Popconfirm,
  Input,
  Button,
  message,
  Popover,
  Checkbox,
  Icon
} from 'antd';
import connect from '@utils/translateConnect';
import TextButton from '../../../components/TextButton';
import { MAIN } from '@routes/config';
// import { toggleClass } from '@utils/classOp';
import PressApprover from './PressApprover';
import { trackEvent } from '@utils/omega';

import './index.less';
import { routerRedux } from 'dva/router';
import _ from 'lodash';

import { APPLY_PAGE_VIEW_DETAIL } from '@config/omega';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
// const { Column } = Table;
const CheckboxGroup = Checkbox.Group;
const tabIdentifying = {
  '1': 'area',
  '2': 'role',
  '3': 'bigdata_report',
  '4': 'bigdata_extraction_tool',
  '5': 'bigdata_indicator',
  '7': 'flag'
};

const defaultFilterParams = {
  appId: '', // 目标系统
  type: '0', // 权限类型
  businessId: '0', // 业务线筛选
  approveName: '', // 当前审批人
  applyUserType: '0', // 申请方式
  username: '', // 权限获得人
  id: '' // 编号
};

class ApplyList extends Component {
  constructor(props) {
    super(props);
    const { workflowenums = {} } = props.global.enumMap || {};
    const { applyStatus = {} } = workflowenums;
    // 表格设置，默认显示列
    let defaultCheckedColumnNameList = window.localStorage.getItem(
      'my-apply-checked-column-name-list'
    )
      ? JSON.parse(
          window.localStorage.getItem('my-apply-checked-column-name-list')
        )
      : [
          'id',
          'appName',
          'applyTypeName',
          'role',
          'submissionUsername',
          'remark',
          'status',
          'username',
          'approveNames',
          'result',
          'createdAt'
        ];
    const { t } = props;
    this.state = {
      status: '1', // tabKey,当前审批的状态；1：审批中；2：已通过；3：已驳回；4：已撤回；all：全部
      // 筛选params
      ...defaultFilterParams,
      selectedRows: [],
      pageCurrent: 1,
      pageSize: 10,
      loadingOnBatchWithdrawButton: false,
      checkedColumnNameList: defaultCheckedColumnNameList, // 选中的展示column
      columnNameList: [
        // 表格设置checkGroup的dataSource,value是this.columns的key
        {
          label: t('编号'),
          value: 'id'
        },
        {
          label: t('目标系统'),
          value: 'appName'
        },
        {
          label: t('权限类型'),
          value: 'applyTypeName'
        },
        {
          label: t('权限名称'),
          value: 'role'
        },
        {
          label: t('申请人'),
          value: 'submissionUsername'
        },
        {
          label: t('申请理由'),
          value: 'remark'
        },
        {
          label: t('流程状态'),
          value: 'status',
          disabled: true
        },
        {
          label: t('权限获得人'),
          value: 'username'
        },
        {
          label: t('当前审批人'),
          value: 'approveNames'
        },
        {
          label: t('驳回理由'),
          value: 'result',
          disabled: true
        },
        {
          label: t('申请时间'),
          value: 'createdAt'
        }
      ]
    };
    this.loadingFlagByTabChange = false;
    this.columns = [
      //table的column
      {
        title: t('编号'),
        dataIndex: 'id',
        key: 'id',
        width: 60,
        render: text => {
          return (
            <Popover content={text} trigger="hover">
              <span className="twoRowsEllipsis">{text}</span>
            </Popover>
          );
        }
      },
      {
        title: t('目标系统'),
        dataIndex: 'appName',
        key: 'appName',
        width: 80,
        render: text => {
          return (
            <Popover content={text} trigger="hover">
              <span className="twoRowsEllipsis">{text}</span>
            </Popover>
          );
        }
      },
      {
        title: t('权限类型'),
        dataIndex: 'applyTypeName',
        key: 'applyTypeName',
        width: 80,
        render: text => {
          return (
            <Popover content={text} trigger="hover">
              <span className="twoRowsEllipsis">{text}</span>
            </Popover>
          );
        }
      },
      {
        title: t('权限名称'),
        dataIndex: 'applyRoleDtos',
        key: 'role',
        width: 80,
        render: text => {
          const data = _.uniqBy(text, 'refId')
            .map(role => role.refNameZh)
            .join(',');
          return (
            <Popover content={data} trigger="hover">
              <span className="twoRowsEllipsis">{data}</span>
            </Popover>
          );
        }
      },
      {
        title: t('申请人'),
        dataIndex: 'submissionUsername',
        key: 'submissionUsername',
        width: 80,
        render: text => {
          return (
            <Popover content={text} trigger="hover">
              <span className="twoRowsEllipsis">{text}</span>
            </Popover>
          );
        }
      },
      {
        title: t('申请理由'),
        dataIndex: 'remark',
        key: 'remark',
        width: 100,
        render: text => {
          return (
            <Popover content={text} trigger="hover">
              <span className="twoRowsEllipsis">{text}</span>
            </Popover>
          );
        }
      },
      {
        title: t('流程状态'),
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render: text => {
          return (
            <Popover content={t(applyStatus[text])} trigger="hover">
              <span className="twoRowsEllipsis">{t(applyStatus[text])}</span>
            </Popover>
          );
        }
      },
      {
        title: t('权限获得人'),
        dataIndex: 'username',
        key: 'username',
        width: 80,
        render: text => {
          return (
            <Popover content={text} trigger="hover">
              <span className="twoRowsEllipsis">{text}</span>
            </Popover>
          );
        }
      },
      {
        title: t('当前审批人'),
        dataIndex: 'approveNames',
        key: 'approveNames',
        width: 80,
        render: text => {
          const data = text.join(', ');
          return (
            <Popover content={data} trigger="hover">
              <span className="twoRowsEllipsis">{data}</span>
            </Popover>
          );
        }
      },
      {
        title: t('驳回理由'),
        dataIndex: 'result',
        key: 'result',
        width: 100,
        render: text => {
          return (
            <Popover content={text} trigger="hover">
              <span className="twoRowsEllipsis">{text}</span>
            </Popover>
          );
        }
      },
      {
        title: t('申请时间'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 80,
        render: text => {
          return (
            <Popover content={text} trigger="hover">
              <span className="twoRowsEllipsis">{text}</span>
            </Popover>
          );
        }
      },
      {
        title: t('操作'),
        dataIndex: 'operate',
        key: 'operate',
        width: 120,
        render: (text, record) => {
          const { t } = this.props;
          let recallEle = null;
          let reapply = null;

          if (record.status === 3 || record.status === 4) {
            reapply = (
              <span>
                <Divider type="vertical" />
                <TextButton onClick={() => this.toReapply(record)}>
                  {t('重新申请')}
                </TextButton>
              </span>
            );
          }

          if (record.status === 1) {
            // 审批中
            recallEle = (
              <span>
                <PressApprover record={record} />
                <Divider type="vertical" />
                <Popconfirm
                  placement="top"
                  title={t('确定撤回？')}
                  onConfirm={() => this.recall(record)}
                  okText={t('确定')}
                  cancelText={t('取消')}>
                  <TextButton>{t('撤回')}</TextButton>
                </Popconfirm>
                <Divider type="vertical" />
              </span>
            );
          }
          return (
            <div>
              {recallEle}
              <TextButton
                onClick={() => {
                  trackEvent(APPLY_PAGE_VIEW_DETAIL);
                  const {
                    status,
                    appId,
                    type,
                    businessId,
                    approveName,
                    applyUserType,
                    username,
                    id,
                    pageCurrent,
                    pageSize
                  } = this.state;
                  const cachedParams = {
                    status,
                    appId,
                    type,
                    businessId,
                    approveName,
                    applyUserType,
                    username,
                    id,
                    pageCurrent,
                    pageSize
                  };
                  let url = `${MAIN}/apply/apply-detail/${record.id}`;
                  // this.props.dispatch(routerRedux.push(url));
                  this.props.dispatch(
                    routerRedux.push({
                      pathname: url,
                      query: {
                        cachedParams
                      }
                    })
                  );
                }}>
                {t('详情')}
              </TextButton>
              {reapply}
            </div>
          );
        }
      }
    ];
  }
  componentDidMount() {
    // 判断是否由 申请详情 页面，跳转回来
    let newState = {};
    if (this.props.location.query) {
      // 由 申请详情 页面，跳转回来
      Object.assign(newState, this.props.location.query.cachedParams);
    }
    this.setState(newState, () => {
      this.init();
    });
  }

  // TODO 作用是什么，不太理解
  componentWillReceiveProps(nextProps) {
    // 这时候还没有更新global.globalAppId，所以放到下一次eventLoop里面更新
    if (nextProps.global.globalAppId !== this.props.global.globalAppId) {
      setTimeout(() => {
        this.getApplyList();
      }, 0);
    }
  }

  /**
   * 页面初始化
   */
  init = () => {
    this.getApplyList();
    this.setSettingColumnDisable(this.state.status);
  };

  /**
   * 获取申请列表
   */
  getApplyList = () => {
    const {
      type,
      username,
      applyUserType,
      businessId,
      status,
      approveName,
      appId,
      id,
      pageCurrent,
      pageSize
    } = this.state;
    const { dispatch } = this.props;

    const params = {
      page: pageCurrent,
      size: pageSize
    };

    // appId为''的时候，就是选择【全部】
    if (appId !== '') {
      params.appId = appId;
    }

    if (type !== '0') {
      params.applyType = type;
    }

    if (businessId !== '0') {
      params.businessId = businessId;
    }

    if (applyUserType !== '0') {
      params.applyUserType = applyUserType;
    }

    if (status && status !== 'all') {
      params.status = status;
    }

    if (approveName.trim()) {
      params.approveName = approveName;
    }

    if (username.trim()) {
      params.username = username;
    }

    if (id && parseInt(id) >= 0) {
      params.id = id;
    }
    dispatch({
      type: 'applyList/fetch',
      payload: params
    });
  };

  /**
   * 搜索
   */
  handleSearch = () => {
    this.setState(
      {
        pageCurrent: 1
      },
      () => {
        this.getApplyList();
      }
    );
  };

  /**
   * 重置筛选条件，页码置1
   */
  handleReset = () => {
    this.setState(
      {
        ...defaultFilterParams,
        pageCurrent: 1
      },
      () => {
        this.getApplyList();
      }
    );
  };

  /**
   * Tabs切换
   * @param {*} tabKey
   */
  handleChangeOnTabs = tabKey => {
    this.loadingFlagByTabChange = true;
    this.setState(
      {
        status: tabKey,
        pageCurrent: 1
      },
      () => {
        setTimeout(() => {
          this.loadingFlagByTabChange = false;
          this.getApplyList();
          this.setSettingColumnDisable(tabKey);
        }, 300);
      }
    );
  };

  /**
   * 根据tabKey设置表格设置中 相关column 的disable
   * @param {string} status
   */
  setSettingColumnDisable = status => {
    const newColumnNameList = _.cloneDeep(this.state.columnNameList);
    newColumnNameList[6].disabled = status !== 'all' ? true : false;
    newColumnNameList[9].disabled = status !== '3' ? true : false;
    this.setState({
      columnNameList: newColumnNameList
    });
  };

  /**
   * 表格设置，列选择
   * @param {array} checkedList
   */
  handleChangeOnColumnCheck = checkedList => {
    this.setState(
      {
        checkedColumnNameList: checkedList
        // indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
        // checkAll: checkedList.length === plainOptions.length,
      },
      () => {
        // 缓存 checkedColumnNameList 状态
        window.localStorage.setItem(
          'my-apply-checked-column-name-list',
          JSON.stringify(checkedList)
        );
      }
    );
  };

  /**
   * 重新申请
   * @param {object} record
   */
  toReapply = record => {
    const { dispatch } = this.props;
    const infoObj = {};
    record.applyRoleDtos.forEach(item => {
      if (infoObj[item.typeName]) {
        infoObj[item.typeName].push(item.keyName);
      } else {
        infoObj[item.typeName] = [item.keyName];
      }
    });
    const infoArr = [];
    Object.keys(infoObj).forEach(typeName => {
      infoArr.push(`${typeName}:${infoObj[typeName].join(',')}`);
    });
    const info = infoArr.join('-');
    dispatch(
      routerRedux.push(`${MAIN}/newapply?appId=${record.appId}&info=${info}`)
    );
    // let idArr = [];
    // record.applyRoleDtos.map(item => {
    //   idArr.push(item.refId);
    // });
    // dispatch(
    //   routerRedux.push(
    //     `${MAIN}/newapply?appId=${record.appId}&identifying=${
    //       tabIdentifying[record.applyType]
    //     }&id=${idArr.join()}`
    //   )
    // );
  };

  /**
   * 撤回
   * @param {object} record
   */
  recall = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'applyList/recall',
      payload: {
        applyId: record.id
      }
    }).then(() => {
      this.setState({
        selectedRows: []
      });
      this.getApplyList();
      // 侧边栏我的审批count进行刷新
      dispatch({
        type: 'approveList/fetchApprove2',
        payload: { size: 0 }
      });
    });
  };

  /**
   * 批量撤回
   */
  batchWithdraw = () => {
    this.setState({
      loadingOnBatchWithdrawButton: true
    });
    const { dispatch, t } = this.props;
    // if (!this.state.selectedRows.length) {
    //   message.error('请选择至少一条记录');
    //   this.setState({
    //     loadingOnBatchWithdrawButton:false
    //   })
    //   return;
    // }
    dispatch({
      type: 'applyList/batchRecall',
      payload: {
        batchApplyId: this.state.selectedRows
      }
    })
      .then(({ success, result }) => {
        message.destroy();
        if (success) {
          message.success(t('批量撤回成功'));
          this.setState(
            {
              selectedRows: []
            },
            () => {
              this.getApplyList();
            }
          );
          // 侧边栏我的审批count进行刷新
          dispatch({
            type: 'approveList/fetchApprove2',
            payload: { size: 0 }
          });
        } else {
          message.error(result, 5);
        }
      })
      .finally(() => {
        this.setState({
          loadingOnBatchWithdrawButton: false
        });
      });
  };

  /**
   * 翻页
   * @param {number} current
   */
  handlePageChange = current => {
    this.setState(
      {
        pageCurrent: current
      },
      () => {
        this.getApplyList();
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
        this.getApplyList();
      }
    );
  };

  render() {
    const {
      data,
      t,
      global = {}
      // apply
    } = this.props;
    const {
      type,
      businessId,
      status,
      applyUserType,
      selectedRows
    } = this.state;
    const { workflowenums = {} } = global.enumMap || {};
    const { applyStatus = {}, infoType = {} } = workflowenums;

    const { total, records, loading } = data;

    // 国际化
    if (records && records.length > 0) {
      records.map(item => {
        return (item.applyTypeName = t(item.applyTypeName));
      });
    }

    // 多选
    const rowSelection = {
      selectedRowKeys: selectedRows,
      onChange: selectedRows => {
        this.setState({
          selectedRows: selectedRows
        });
      },
      getCheckboxProps: record => {
        return {
          id: record.id.toString(),
          disabled: record.status !== 1 // Column configuration not to be checked
        };
      }
    };

    // 获取实际column
    const getColumns = () => {
      const newColumns = _.cloneDeep(this.columns);
      return newColumns.filter(column => {
        if (column.key === 'operate') return true;
        if (this.state.checkedColumnNameList.includes(column.key)) {
          if (column.key === 'status' && status !== 'all') {
            // 仅status为all时，显示status列
            return false;
          }
          if (column.key === 'result' && status !== '3') {
            // 仅status为(已驳回)时，显示result(驳回理由)列
            return false;
          }
          return true;
        }
      });
    };

    // 获取表格设置popover内容
    const getColumnSettingContent = () => {
      return (
        <CheckboxGroup
          className="column-check-group"
          options={this.state.columnNameList}
          value={this.state.checkedColumnNameList}
          onChange={this.handleChangeOnColumnCheck}
        />
      );
    };

    // 筛选条件布局
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    // 筛选条件，操作按钮布局
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        }
      }
    };

    return (
      <div className="apply-list upm-filter-content-page">
        <Tabs
          size="large"
          className="tabs"
          activeKey={status}
          onChange={this.handleChangeOnTabs}>
          <TabPane
            tab={t('审批中') + `(${data.approveingCount || 0})`}
            key="1"></TabPane>
          <TabPane
            tab={t('已通过') + `(${data.approveSuccessCount || 0})`}
            key="2"></TabPane>
          <TabPane
            tab={t('已驳回') + `(${data.approveFailCount || 0})`}
            key="3"></TabPane>
          <TabPane
            tab={t('已撤回') + `(${data.approveWithdrawCount || 0})`}
            key="4"></TabPane>
          <TabPane
            tab={t('全部') + `(${data.approveTotalCount || 0})`}
            key="all"></TabPane>
        </Tabs>

        <div className="filter-area">
          <Form {...formItemLayout} layout="horizontal">
            <Row gutter={24} className="filter-fields">
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('目标系统：')}>
                  <Select
                    placeholder={t('请选择')}
                    value={this.state.appId}
                    onChange={value => this.setState({ appId: value })}
                    className="form-select"
                    showSearch
                    optionFilterProp="children">
                    <Option value="">{t('全部')}</Option>
                    {this.props.apps.map(item => (
                      <Option key={item.appId} value={item.appId}>
                        {item.appName}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('权限类型：')}>
                  <Select
                    placeholder={t('请选择')}
                    value={type}
                    onChange={value => this.setState({ type: value })}
                    className="form-select"
                    dropdownMatchSelectWidth={false}>
                    <Option value="0">{t('全部')}</Option>
                    {_.map(infoType, (typeName, typeValue) => (
                      <Option key={typeValue} value={typeValue}>
                        {t(typeName)}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('业务线筛选：')}>
                  <Select
                    showSearch
                    placeholder={t('请选择')}
                    value={businessId}
                    onChange={value => this.setState({ businessId: value })}
                    className="form-select"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }>
                    <Option value="0">{t('全部')}</Option>
                    {_.map(global.allBusiness, business => (
                      <Option key={business.id} value={business.id}>
                        {business.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('当前审批人：')}>
                  <Input
                    placeholder={t('请输入审批人账号')}
                    onChange={e =>
                      this.setState({ approveName: e.target.value })
                    }
                  />
                </FormItem>
              </Col>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('申请方式：')}>
                  <Select
                    placeholder={t('请选择')}
                    value={applyUserType}
                    onChange={value => this.setState({ applyUserType: value })}
                    className="form-select"
                    dropdownMatchSelectWidth={false}>
                    <Option value="0">{t('全部')}</Option>
                    <Option value="1">{t('本人申请')}</Option>
                    <Option value="2">{t('代申请')}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('权限获得人：')}>
                  <Input
                    placeholder={t('请输入实际申请人账号')}
                    onChange={e => this.setState({ username: e.target.value })}
                  />
                </FormItem>
              </Col>

              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('编号：')}>
                  <Input
                    placeholder={t('请输入编号')}
                    onChange={e => this.setState({ id: e.target.value })}
                  />
                </FormItem>
              </Col>

              <Col
                xs={16}
                sm={16}
                md={16}
                lg={16}
                xl={16}
                className="filter-fields-option">
                <FormItem {...tailFormItemLayout}>
                  <span className="filter-options-wrapper">
                    <Button onClick={() => this.handleReset()}>
                      {t('重置')}
                    </Button>
                    <Button
                      type="primary"
                      icon="search"
                      onClick={() => this.handleSearch()}>
                      {t('搜索')}
                    </Button>
                  </span>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="content-area">
          <div className="options">
            <Popover
              overlayClassName="column-setting-popover"
              placement="bottomRight"
              title={t('列设置')}
              content={getColumnSettingContent()}
              trigger="click">
              <a className="table-setup-text">
                {t('表格设置')} <Icon type="down" />
              </a>
            </Popover>
            <Button
              type="primary"
              ghost
              disabled={this.state.selectedRows.length === 0 ? true : false}
              loading={this.state.loadingOnBatchWithdrawButton}
              onClick={() => this.batchWithdraw()}>
              {t('批量撤回')}
            </Button>
          </div>
          <Table
            dataSource={records}
            // size="small"
            columns={getColumns()}
            pagination={{
              current: this.state.pageCurrent,
              pageSize: this.state.pageSize,
              total,
              onChange: this.handlePageChange,
              showTotal: total => `${t('共')} ${total} ${t('条')}`,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              onShowSizeChange: this.onShowSizeChange
            }}
            className="upm-table"
            rowKey="id"
            loading={loading || this.loadingFlagByTabChange}
            rowSelection={rowSelection}
          />
        </div>
      </div>
    );
  }
}

export default connect(({ applyList, global }) => {
  return {
    data: applyList,
    // ...entrance,
    global,
    // appId: global.globalAppId,
    apps: global.apps
  };
})(ApplyList);
