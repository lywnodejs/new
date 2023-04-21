import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import request from '@utils/request';
import moment from 'moment';
import {
  Form,
  Input,
  Button,
  Modal,
  Select,
  message,
  Layout,
  Menu,
  Tabs,
  Row,
  Col,
  Table,
  Icon,
  Progress,
  Tag,
  Spin,
  Tooltip,
  Card,
  Steps
} from 'antd';
import DetailTree from './DetailTree';

import './index.less';

const { Footer, Sider, Content } = Layout;
const Option = Select.Option;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { Column } = Table;
const { SubMenu } = Menu;
const { Step } = Steps;

const Search = Input.Search;
const tabObj = t => {
  return {
    '1': t('地区'),
    '2': t('角色'),
    '3': t('报表'),
    '4': t('模板'),
    '5': t('指标'),
    '6': t('权限点'),
    '7': t('标识位'),
    '100': t('数据资源')
  };
};

const DEFAULT_STATE = {
  permissionName: '',
  businessId: '0',
  permissionType: '2',
  expire: '-1',
  selectedRows: [],
  appId: 0,
  currPage: 1,
  currCloseApproveTablePage: 1,
  currOpenApproveTablePage: 1,
  currUsername: '',
  currUserInfo: {},
  detailNow: {
    id: '',
    name: ''
  },
  userList: {
    allList: [],
    doneList: [],
    doingList: []
  },
  doneList: [],
  doingList: [],
  modalVisible: false,
  openPermissonCount: 0,
  closedPermissionCount: 0,
  totalCount: 0,
  pageSize: 10,
  dataType: [],
  resourceTypeIdList: [''],
  riskLevelList: [''],
  fuzzySearch: '',
  tableList: [],
  tableCount: 0,
  btnLoadding: false,
  btnReviewLoadding: false,
  expandedRowKeys: [],
  currentStep: 0, // 当前step
  stepStatus: {},
  stepToPermissionType: {}
};
const permissionTypes = {
  角色: 'ROLE',
  地区: 'AREA',
  标识位: 'FLAG',
  数据资源: 'DATA'
};
/**
 * 编辑页面
 * @param {*} props
 */
class DetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
  }

  componentDidMount() {
    const { match, dispatch } = this.props;
    const { reviewId } = match.params;

    this.setState({
      detailNow: {
        id: reviewId
      }
    });

    // 获取review用户
    this.getReviewUserList();

    // 获取review详情
    dispatch({
      type: 'manageReview/fetchReviewDetail',
      payload: {
        appId: 888,
        id: reviewId,
        reviewAppId: this.state.appId ? this.state.appId : 0
      }
    }).then(({ success, result }) => {
      if (success) {
        this.setState({
          detailNow: {
            ...this.state.detailNow,
            name: result.name
          }
        });
      }
    });
  }

  // 选择系统获取数据类型
  getDataType = params => {
    let dataType = [];
    this.props
      .dispatch({
        type: 'dataResource/getDataType',
        payload: params
      })
      .then(res => {
        dataType = res;
        this.setState({
          dataType
        });
        return dataType;
      });
  };

  // 目标系统
  reviewApps = params => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'review/fetchUseApps',
      payload: params
    }).then(res => {
      this.setState({
        appId: this.props.apps[0] ? this.props.apps[0].id : 0
      });
    });
  };
  onSearchUserName = val => {
    let doneListTmp = this.state.doneList;
    let doingListTmp = this.state.doingList;
    const name = val.target.value;
    if (val.target.value.length > 0) {
      doneListTmp = doneListTmp.filter(f => {
        return f.user.usernameZh.indexOf(name) >= 0;
      });
      doingListTmp = doingListTmp.filter(f => {
        return f.user.usernameZh.indexOf(name) >= 0;
      });
    }
    this.setState({
      userList: {
        doneList: doneListTmp,
        doingList: doingListTmp
      }
    });
  };
  getReviewUserList = () => {
    const { match, dispatch } = this.props;
    const { reviewId } = match.params;

    dispatch({
      type: 'review/fetchApproveUserList',
      payload: {
        appId: 888,
        reviewId: reviewId
      }
    }).then(res => {
      const { approveUserList } = res;
      if (approveUserList && approveUserList.length) {
        const doneList = [];
        const doingList = [];
        let defaultUser = null;
        for (let i = 0; i < approveUserList.length; i++) {
          if (approveUserList[i].approveStatus) {
            doingList.push(approveUserList[i]);
          } else {
            doneList.push(approveUserList[i]);
          }
        }
        if (doingList.length) {
          defaultUser = doingList[0].user.username;
        } else if (doneList.length) {
          defaultUser = doneList[0].user.username;
        }
        this.reviewApps({
          reviewId: reviewId,
          username: defaultUser,
          permissionType: this.state.permissionType
        });
        this.setState(
          {
            currUsername: defaultUser,
            userList: {
              allList: approveUserList,
              doneList,
              doingList
            },
            doneList,
            doingList
          },
          () => {
            this.onMenuClick({ key: defaultUser });
          }
        );
      }
    });
  };

  onMenuClick = ({ key }) => {
    this.setState(
      {
        currentPage: 1,
        currUsername: key,
        currUserInfo: this.getUserInfo(key)
      },
      () => {
        this.reviewApps({
          reviewId: this.state.detailNow.id,
          username: this.state.currUsername,
          permissionType: this.state.permissionType
        }).then(res => {
          this.props
            .dispatch({
              type: 'review/fetchApproveUserPermissionCount',
              payload: {
                username: key,
                reviewId: this.state.detailNow.id,
                appId: 888
              }
            })
            .then(() => {
              this.setSteps();
              this.fetchPermissionNumber();
            });
        });
      }
    );
  };

  // 请求列表统一的入口
  search = (page = 1) => {
    const { dispatch } = this.props;
    const { currUsername, detailNow } = this.state;
    const {
      businessId,
      permissionType,
      permissionName,
      expire,
      pageSize,
      resourceTypeIdList,
      riskLevelList,
      fuzzySearch
    } = this.state;
    const params = {
      page,
      username: currUsername,
      permissionType: Number(permissionType),
      reviewId: detailNow.id,
      appId: 888,
      reviewAppId: this.state.appId ? this.state.appId : 0,
      size: pageSize
    };

    if (resourceTypeIdList != ['']) {
      params.resourceTypeIdList = Array(resourceTypeIdList);
    }

    if (riskLevelList != ['']) {
      params.riskLevelList = Array(riskLevelList);
    }

    if (businessId !== '0') {
      params.businessId = Number(businessId);
    }

    if (expire !== '-1') {
      params.expire = Number(expire);
    }

    if (permissionName) {
      params.permissionName = permissionName;
    }

    if (fuzzySearch) {
      params.fuzzySearch = fuzzySearch;
    }

    dispatch({
      type: 'review/fetchApproveUserPermissionList',
      payload: params
    }).then(res => {
      this.setState({
        tableList: res.records,
        tableCount: res.total,
        currentPage: page
      });
    });
  };

  searchModal = page => {
    // 获取关闭权限的列表
    this.props.dispatch({
      type: 'review/fetchCloseApproveConfirmList',
      payload: {
        size: 10,
        page,
        permissionReviewId: this.state.detailNow.id,
        username: this.state.currUsername,
        appId: 888
      }
    });
    // 获取关闭权限的统计
    this.props.dispatch({
      type: 'review/fetchCloseApproveCount',
      payload: {
        reviewId: this.state.detailNow.id,
        username: this.state.currUsername,
        appId: 888
      }
    });

    // 获取保留权限的列表
    this.props.dispatch({
      type: 'review/fetchOpenApproveConfirmList',
      payload: {
        size: 10,
        page,
        permissionReviewId: this.state.detailNow.id,
        username: this.state.currUsername,
        appId: 888
      }
    });
    // 获取保留权限的统计
    this.props.dispatch({
      type: 'review/fetchOpenApproveCount',
      payload: {
        reviewId: this.state.detailNow.id,
        username: this.state.currUsername,
        appId: 888
      }
    });
  };

  onCloseApprovePageChange = page => {
    // 获取关闭权限的列表
    this.props.dispatch({
      type: 'review/fetchCloseApproveConfirmList',
      payload: {
        size: 10,
        page,
        permissionReviewId: this.state.detailNow.id,
        username: this.state.currUsername,
        appId: 888
      }
    });
    this.setState({
      currCloseApproveTablePage: page
    });
  };

  onOpenApprovePageChange = page => {
    // 获取保留权限的列表
    this.props.dispatch({
      type: 'review/fetchOpenApproveConfirmList',
      payload: {
        size: 10,
        page,
        permissionReviewId: this.state.detailNow.id,
        username: this.state.currUsername,
        appId: 888
      }
    });
    this.setState({
      currOpenApproveTablePage: page
    });
  };

  handleSearchFieldChange = (key, value = '') => {
    this.reviewApps({
      reviewId: this.state.detailNow.id,
      username: this.state.currUsername,
      permissionType: value
    }).then(res => {
      this.setState(
        {
          [key]: value,
          tableList: [],
          tableCount: 0
        },
        () => {
          this.fetchPermissionNumber();
          // 切换tab页时，页码切换为第一页
          this.setState({
            currentPage: 1
          });
          this.search(1);
          if (value == '100') {
            this.getDataType({ appId: this.state.appId });
          }
        }
      );
    });
  };

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
    this.search(page);
  };

  // 获取待保留和删除权限的数量
  fetchPermissionNumber = () => {
    const { dispatch } = this.props;
    const params = {
      username: this.state.currUsername,
      reviewId: this.state.detailNow.id,
      opUserType: 1,
      appId: 888
    };

    dispatch({
      type: 'review/fetchPermissionNum',
      payload: params
    }).then(() => {
      this.updatePermissionCount(this.state.permissionType);
    });
  };

  // 更新待保留和删除权限数量
  updatePermissionCount = value => {
    const { t } = this.props;
    this.props.permissionNumList.map(item => {
      if (item.permissionType == permissionTypes[tabObj(t)[value]]) {
        this.setState({
          openPermissonCount: item.openPermissonCount,
          closedPermissionCount: item.closedPermissionCount,
          totalCount: item.openPermissonCount + item.closedPermissionCount
        });
      }
    });
  };

  batchClose = () => {
    this.setState({
      btnLoadding: true
    });
    const { dispatch, t } = this.props;
    if (!this.state.selectedRows.length) {
      message.error(t('请选择至少一条记录'));
      this.setState({
        btnLoadding: false
      });
      return;
    }
    const params = {
      appId: this.state.appId,
      permissionReviewId: this.state.detailNow.id,
      permissionIds: this.state.selectedRows.map(i => {
        if (this.state.permissionType == '1') {
          return { targetId: i.businessId, appId: i.appId };
        } else {
          return { targetId: i.id, appId: i.appId };
        }
      }),
      username: this.state.currUsername,
      permissionType: Number(this.state.permissionType),
      opUserType: 1
    };
    dispatch({
      type: 'review/reviewClose',
      payload: params
    }).then(result => {
      if (result) {
        message.error(result);
      } else {
        message.success(t('操作成功'));
        // 清空选中的数据
        this.setState({
          selectedRows: []
        });
      }
      this.setState({
        btnLoadding: false
      });
      this.fetchPermissionNumber();
      this.search(this.state.currentPage);
    });
  };

  batchOpen = () => {
    this.setState({
      btnLoadding: true
    });
    const { dispatch, t } = this.props;
    if (!this.state.selectedRows.length) {
      message.error(t('请选择至少一条记录'));
      this.setState({
        btnLoadding: false
      });
      return;
    }
    const params = {
      appId: this.state.appId,
      permissionReviewId: this.state.detailNow.id,
      permissionIds: this.state.selectedRows.map(i => {
        if (this.state.permissionType == '1') {
          return { targetId: i.businessId, appId: i.appId };
        } else {
          return { targetId: i.id, appId: i.appId };
        }
      }),
      username: this.state.currUsername,
      permissionType: Number(this.state.permissionType),
      opUserType: 1
    };
    dispatch({
      type: 'review/reviewOpen',
      payload: params
    }).then(result => {
      if (result) {
        message.error(result);
      } else {
        message.success(t('操作成功'));
        // 清空选中的数据
        this.setState({
          selectedRows: []
        });
      }
      this.setState({
        btnLoadding: false
      });
      this.fetchPermissionNumber();
      this.search(this.state.currentPage);
    });
  };

  // 一键全选
  allSelectHandle = () => {
    const { currUsername, detailNow, permissionType, appId } = this.state;
    request(
      `/v2/permissionreview/permissions/all?username=${currUsername}&reviewId=${
        detailNow.id
      }&permissionType=${Number(permissionType)}`
    ).then(res => {
      this.setState({
        selectedRows: res.map(item => {
          return {
            id: item.id,
            relId: item.relId,
            appId: item.appId
          };
        })
      });
    });
  };

  openModal = () => {
    this.searchModal(1);
    this.setState({
      currCloseApproveTablePage: 1,
      currOpenApproveTablePage: 1,
      modalVisible: true
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false
    });
  };

  handleModalOk = () => {
    const { t, dispatch } = this.props;
    this.setState({
      btnReviewLoadding: true
    });
    dispatch({
      type: 'review/approveSubmit',
      payload: {
        username: this.state.currUsername,
        permissionReviewId: Number(this.state.detailNow.id),
        appId: 888
      }
    }).then(({ success, result }) => {
      this.setState({
        btnReviewLoadding: false
      });
      message.destroy();
      if (success) {
        message.success(t('审核已完成'), 2, () => {
          this.setState({
            modalVisible: false
          });
          this.onStepChange('permissionType', 0);
        });
        this.getReviewUserList();
      } else {
        message.error(result, 4);
      }
    });
  };

  getUserInfo = username => {
    const {
      userList: { allList }
    } = this.state;
    for (let i = 0; i < allList.length; i++) {
      if (allList[i].user.username === username) {
        return allList[i];
      }
    }
    return {};
  };

  onShowSizeChange = (current, size) => {
    this.setState(
      {
        currentPage: current,
        pageSize: size
      },
      () => {
        this.search(current);
      }
    );
  };

  getCloseWord = () => {
    const { currUsername } = this.state;
    const { closeApproveCount, t, closeApproveConfirmList } = this.props;
    let { total: modalTotal } = closeApproveConfirmList;
    let { ROLE = 0, AREA = 0, FLAG = 0, DATA = 0 } = closeApproveCount;
    let result =
      t('本次审核一共') +
      `<span style="color: red;">${t('关闭')}</span>` +
      t('了{{ username }} 的 {{ modaltotal }} 项权限', {
        username: currUsername,
        modaltotal: ROLE + AREA + FLAG + DATA
      });
    if (ROLE + AREA + FLAG + DATA > 0) {
      result =
        result +
        '，' +
        t('其中') +
        '：' +
        t('角色 {{ ROLE }} 项，', { ROLE: ROLE }) +
        t('地区 {{ AREA }} 项，', { AREA: AREA }) +
        t('标识位 {{ FLAG }} 项，', { FLAG: FLAG }) +
        t('数据资源 {{ DATA }} 项，', { DATA: DATA }) +
        t('详情如下表。') +
        t(
          '确认审核完成后将即刻生效，如需再次获得权限需要重新申请审批，请确保本次审核操作无误。'
        );
    } else {
      result += '。';
    }
    return result;
  };

  getOpenWord = () => {
    const { currUsername } = this.state;
    const { openApproveCount, t, openApproveConfirmList } = this.props;
    let { total: openTableTotal } = openApproveConfirmList;
    let { ROLE = 0, AREA = 0, FLAG = 0, DATA = 0 } = openApproveCount;
    let result =
      t('本次审核一共') +
      `<span style="color: green;">${t('保留')}</span>` +
      t('了{{ username }} 的 {{ modaltotal }} 项权限', {
        username: currUsername,
        modaltotal: ROLE + AREA + FLAG + DATA
      });

    if (ROLE + AREA + FLAG + DATA > 0) {
      result =
        result +
        '，' +
        t('其中') +
        '：' +
        t('角色 {{ ROLE }} 项，', { ROLE: ROLE }) +
        t('地区 {{ AREA }} 项，', { AREA: AREA }) +
        t('标识位 {{ FLAG }} 项，', { FLAG: FLAG }) +
        t('数据资源 {{ DATA }} 项，', { DATA: DATA }) +
        t('详情如下表。') +
        t(
          '确认审核完成后将即刻生效，如需再次获得权限需要重新申请审批，请确保本次审核操作无误。'
        );
    } else {
      result += '。';
    }
    return result;
  };

  reloadTableList = () => {
    this.reviewApps({
      reviewId: this.state.detailNow.id,
      username: this.state.currUsername,
      permissionType: '1'
    }).then(res => {
      this.setState(
        {
          permissionType: '1',
          tableList: [],
          tableCount: 0
        },
        () => {
          this.fetchPermissionNumber();
          this.search();
        }
      );
    });
  };

  handleBtnLoadding = status => {
    this.setState({
      btnLoadding: status
    });
  };

  // 地区表格展开行
  onTableExpand = (expanded, record) => {
    if (expanded) {
      this.setState({
        expandedRowKeys: [
          `${record.relId}_${record.businessId}_${record.appId}`
        ]
      });
    } else {
      this.setState({
        expandedRowKeys: []
      });
    }
  };

  // 点击步骤条回调
  onStepChange = (key, value = '') => {
    const { stepStatus, stepToPermissionType } = this.state;

    const type = stepToPermissionType[value];
    // 当前点击变为正在查看，并且状态改为已经浏览
    for (let prop in stepStatus) {
      if (type == prop) {
        stepStatus[prop].status = 'process';
        stepStatus[prop].isWatched = true;
      } else {
        stepStatus[prop].status = 'wait';
      }
    }

    this.setState({
      [key]: type,
      currentStep: value,
      tableList: [],
      tableCount: 0,
      currentPage: 1
    });

    this.reviewApps({
      reviewId: this.state.detailNow.id,
      username: this.state.currUsername,
      permissionType: type
    }).then(res => {
      setTimeout(() => {
        this.fetchPermissionNumber();
        this.search(1);
        if (type == '100') {
          this.getDataType({ appId: this.state.appId });
        }
      }, 200);
    });
  };

  // 初始化步骤条
  setSteps = () => {
    const { approveUserPermissionCount } = this.props;
    const { stepToPermissionType, currUserInfo } = this.state;
    let _stepStatus = {};
    const permissionNumber = {
      '2': approveUserPermissionCount.roleCount,
      '1': approveUserPermissionCount.areaCount,
      '7': approveUserPermissionCount.flagCount,
      '100': approveUserPermissionCount.resourceCount
    };

    for (let prop in permissionNumber) {
      if (permissionNumber[prop] && permissionNumber[prop] > 0) {
        _stepStatus[prop] = {
          isWatched: currUserInfo.approveStatus ? false : true,
          status: 'wait',
          lastStaus: 'wait'
        };
      }
    }
    let permissionType = 2;

    // 将第一个步骤条设置为已读，并在precess中
    if (Object.keys(_stepStatus)[0]) {
      _stepStatus[Object.keys(_stepStatus)[0]] = {
        isWatched: true,
        status: 'process',
        lastStaus: 'process'
      };
      permissionType = Object.keys(_stepStatus)[0];
    }
    Object.keys(_stepStatus).map((prop, index) => {
      stepToPermissionType[index] = prop;
    });

    this.setState(
      {
        stepStatus: {
          ..._stepStatus
        },
        permissionType
      },
      () => {
        this.search(1);
      }
    );
  };

  // 点击下一步
  nextStep = () => {
    const { stepToPermissionType } = this.state;
    // 如果是最后一个则什么都不做
    const lastType = Object.keys(stepToPermissionType)[
      Object.keys(stepToPermissionType).length - 1
    ];

    if (this.state.currentStep == lastType) return;
    this.onStepChange('permissionType', this.state.currentStep + 1);
  };

  render() {
    const {
      t,
      approveUserPermissionCount,
      loading,
      allBusiness,
      closeApproveConfirmList,
      openApproveConfirmList
    } = this.props;
    const {
      businessId,
      userList,
      selectedRows,
      modalVisible,
      currCloseApproveTablePage,
      currUserInfo,
      currOpenApproveTablePage,
      permissionType,
      dataType,
      resourceTypeIdList,
      riskLevelList,
      tableList,
      tableCount,
      stepStatus,
      stepToPermissionType,
      currentStep
    } = this.state;

    // 关闭列表数据
    const {
      total: closeApproveTableTotal,
      records: closeApproveTableRecords
    } = closeApproveConfirmList;
    const {
      total: openApproveTableTotal,
      records: openApproveTableRecords
    } = openApproveConfirmList;

    const tabName = tabObj(t)[this.state.permissionType];
    const rowSelection = currUserInfo.approveStatus
      ? {
          rowSelection: {
            selectedRowKeys: selectedRows.map(
              item => `${item.relId}_${item.businessId}_${item.appId}`
            ),
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({
                selectedRows
              });
            },
            getCheckboxProps: record => {
              return {
                relId: record.relId && record.relId.toString()
              };
            }
          }
        }
      : {};

    // 保留理由
    let reviewComment = '';

    const hasSelected = selectedRows.length > 0;
    // 是否显示待保留数量
    const isShowCount = userList.doneList.findIndex(
      item => item.user.username === this.state.currUsername
    );

    const stepStyle = {
      boxShadow: '0px -1px 0 0 #e8e8e8 inset',
      fontSize: '16px'
    };

    const permissionNumber = {
      '2': approveUserPermissionCount.roleCount,
      '1': approveUserPermissionCount.areaCount,
      '7': approveUserPermissionCount.flagCount,
      '100': approveUserPermissionCount.resourceCount
      // '3': otherpermission.reportCount,
      // '4': otherpermission.templateCount,
      // '5': otherpermission.indicatorCount,
      // '13': otherpermission.dataSetCount
    };
    const permissionTypeList = {
      '2': '角色',
      '1': '地区',
      '7': '标识位',
      '100': '数据资源'
    };

    const lastType = Object.keys(stepToPermissionType)[
      Object.keys(stepToPermissionType).length - 1
    ];
    let isShowSubmitBtn = true;

    for (let prop in stepStatus) {
      if (stepStatus[prop].status == 'process') {
        stepStatus[prop].lastStatus = 'process';
      } else {
        if (stepStatus[prop].isWatched) {
          stepStatus[prop].lastStatus = 'finish';
        } else {
          stepStatus[prop].lastStatus = 'wait';
        }
      }
      if (stepStatus[prop].lastStatus == 'wait') {
        isShowSubmitBtn = false;
      }
    }
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

    // 模糊搜索筛选条件布局
    const vagueFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };

    return (
      <div className="review-user-detail">
        <Spin
          size="large"
          spinning={this.state.btnLoadding}
          tip={t('正在执行，请稍后……')}>
          <Layout>
            <Layout>
              <Sider theme="light">
                <div className="search-review-name">
                  <Search
                    placeholder={t('搜索')}
                    onChange={value => this.onSearchUserName(value)}
                    style={{ width: '90%' }}
                  />
                </div>
                <Menu
                  mode="inline"
                  onClick={this.onMenuClick}
                  selectedKeys={[this.state.currUsername]}
                  defaultOpenKeys={['sub1', 'sub2']}>
                  <SubMenu
                    key="sub1"
                    title={
                      <span>
                        <Icon type="user" />
                        <span>
                          {t('待审核')}(
                          {userList.doingList ? userList.doingList.length : 0})
                        </span>
                      </span>
                    }>
                    {userList.doingList.map(item => {
                      return (
                        <Menu.Item key={item.user.username}>
                          {item.user.usernameZh}
                        </Menu.Item>
                      );
                    })}
                  </SubMenu>
                  <SubMenu
                    key="sub2"
                    title={
                      <span>
                        <Icon type="user" />
                        <span>
                          {t('已完成')}(
                          {userList.doneList ? userList.doneList.length : 0})
                        </span>
                      </span>
                    }>
                    {userList.doneList.map(item => {
                      return (
                        <Menu.Item key={item.user.username}>
                          {item.user.usernameZh}
                        </Menu.Item>
                      );
                    })}
                  </SubMenu>
                </Menu>
                <Row className="speed-progress">
                  <Col span={6}>{t('进度')}:</Col>
                  <Col span={18}>
                    <Progress
                      percent={Math.floor(
                        (100 * userList.doneList.length) /
                          (userList.doneList.length + userList.doingList.length)
                      )}
                    />
                  </Col>
                </Row>
              </Sider>
              <Content>
                <div className="main">
                  <Row
                    gutter={24}
                    style={{
                      position: 'relative',
                      height: '48px',
                      width: '100%',
                      margin: 0,
                      fontSize: '14px',
                      background: '#FEFBE6',
                      border: '1px solid #FCE58F'
                    }}>
                    <Col
                      span={15}
                      style={{
                        position: 'relative',
                        height: '48px'
                      }}>
                      <span
                        style={{
                          position: 'absolute',
                          left: '16px',
                          top: '12px',
                          color: '#F6893E'
                        }}>
                        {currUserInfo.approveStatus
                          ? t('确认完成后该用户权限审核立即生效，请谨慎操作')
                          : t('切换下方权限类型可查看更多审核细节')}
                      </span>
                    </Col>

                    <div
                      style={{
                        position: 'absolute',
                        right: '0px',
                        top: '8px'
                      }}>
                      {Object.keys(stepStatus).length > 1 &&
                      this.state.currentStep != lastType &&
                      currUserInfo.approveStatus ? (
                        <Button
                          type="primary"
                          style={{ marginRight: '8px' }}
                          onClick={this.nextStep}>
                          {t('下一步')}
                        </Button>
                      ) : null}
                      <Tooltip
                        placement="bottom"
                        arrowPointAtCenter
                        title={
                          !isShowSubmitBtn
                            ? this.state.currentStep != lastType
                              ? t('您还有尚未审核的权限，请点击下一步进行操作')
                              : t('您还有尚未审核的权限类型')
                            : null
                        }
                        className="submitTootip">
                        {currUserInfo.approveStatus ? (
                          <Button
                            type="primary"
                            onClick={this.openModal}
                            disabled={!isShowSubmitBtn}
                            ghost={!isShowSubmitBtn}
                            style={{ marginRight: '24px' }}>
                            {t('权限审核完成')}
                          </Button>
                        ) : (
                          <Button
                            disabled
                            ghost
                            style={{ marginRight: '24px' }}>
                            {t('已完成')}
                          </Button>
                        )}
                      </Tooltip>
                    </div>
                  </Row>

                  <div className="content-area">
                    <Card style={{ margin: '0 0 24px 0', border: 0 }}>
                      <div className="header-steps">
                        <Steps
                          type="navigation"
                          size="small"
                          current={currentStep}
                          onChange={value =>
                            this.onStepChange('permissionType', value)
                          }
                          style={
                            Object.keys(stepStatus).length > 0
                              ? stepStyle
                              : null
                          }>
                          {Object.keys(stepStatus).map(item => {
                            return (
                              <Step
                                key={item}
                                status={
                                  stepStatus[item] &&
                                  stepStatus[item].lastStatus
                                }
                                title={
                                  t(permissionTypeList[item]) +
                                  `(${permissionNumber[item] || 0})`
                                }
                              />
                            );
                          })}
                        </Steps>
                      </div>
                      <Form layout="horizontal" {...formItemLayout}>
                        <Row
                          gutter={24}
                          className="search-fields"
                          style={{ marginTop: '32px', paddingRight: '24px' }}>
                          <Col span={8} style={{ paddingLeft: '18px' }}>
                            <FormItem label={t('目标系统：')}>
                              <Select
                                placeholder={t('请选择')}
                                value={this.state.appId}
                                onChange={value => {
                                  permissionType == '100'
                                    ? this.setState({
                                        appId: value,
                                        dataType: this.getDataType({
                                          appId: value
                                        })
                                      })
                                    : this.setState({ appId: value });
                                }}
                                className="form-select"
                                showSearch
                                optionFilterProp="children">
                                {this.props.apps.map(item => {
                                  if (item.id == 0) {
                                    return (
                                      <Select.Option
                                        key={item.id}
                                        value={item.id}>
                                        {t('全部')}
                                      </Select.Option>
                                    );
                                  }
                                  return (
                                    <Select.Option
                                      key={item.id}
                                      value={item.id}>
                                      {item.name}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </FormItem>
                          </Col>
                          {permissionType == '100' ? (
                            <div>
                              <Col span={8} style={{ paddingLeft: '18px' }}>
                                <FormItem label={t('数据类型：')}>
                                  <Select
                                    style={{ width: '100%' }}
                                    placeholder="请选择"
                                    mode="multiple"
                                    value={resourceTypeIdList}
                                    onChange={type => {
                                      let realType = [];
                                      if (type.length > 1) {
                                        for (let index in type) {
                                          if (type[index] > 0) {
                                            realType.push(type[index]);
                                          }
                                        }
                                        if (type[type.length - 1] === '') {
                                          realType = [''];
                                        }
                                      } else {
                                        realType = type;
                                      }
                                      this.setState({
                                        resourceTypeIdList: realType
                                      });
                                    }}
                                    showSearch
                                    optionFilterProp="children">
                                    <Select.Option value={''} key={''}>
                                      {t('全部')}
                                    </Select.Option>
                                    {_.map(dataType, type => (
                                      <Option key={type.id} value={type.id}>
                                        {type.name}
                                      </Option>
                                    ))}
                                  </Select>
                                </FormItem>
                              </Col>
                              <Col span={8} style={{ paddingLeft: '18px' }}>
                                <FormItem label={t('数据敏感级：')}>
                                  <Select
                                    style={{ width: '100%' }}
                                    mode="multiple"
                                    placeholder="请选择"
                                    value={riskLevelList}
                                    onChange={type => {
                                      let realType = [];
                                      if (type.length > 1) {
                                        for (let index in type) {
                                          if (type[index] > 0) {
                                            realType.push(type[index]);
                                          }
                                        }
                                        if (type[type.length - 1] === '') {
                                          realType = [''];
                                        }
                                      } else {
                                        realType = type;
                                      }
                                      this.setState({
                                        riskLevelList: realType
                                      });
                                    }}
                                    showSearch
                                    optionFilterProp="children">
                                    <Select.Option value="">
                                      {t('全部')}
                                    </Select.Option>
                                    <Select.Option value="1">C1</Select.Option>
                                    <Select.Option value="2">C2</Select.Option>
                                    <Select.Option value="3">C3</Select.Option>
                                    <Select.Option value="4">C4</Select.Option>
                                  </Select>
                                </FormItem>
                              </Col>
                            </div>
                          ) : permissionType != '1' ? (
                            <Col span={8} style={{ paddingLeft: '18px' }}>
                              <FormItem label={t(tabName + '名称') + ':'}>
                                <Input
                                  // placeholder={t('请输入{{ tabName }}名称', {tabName: tabName})}
                                  ref={permissionNameInput =>
                                    (this.permissionNameInput = permissionNameInput)
                                  }
                                  onChange={e =>
                                    this.setState({
                                      permissionName: e.target.value
                                    })
                                  }
                                />
                              </FormItem>
                            </Col>
                          ) : null}

                          <Col span={8} style={{ paddingLeft: '18px' }}>
                            <FormItem label={t('业务线：')}>
                              <Select
                                showSearch
                                placeholder={t('请选择')}
                                value={businessId}
                                onChange={value =>
                                  this.setState({ businessId: value })
                                }
                                className="form-select"
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }>
                                <Option value="0">{t('全部')}</Option>
                                {_.map(allBusiness, business => (
                                  <Option key={business.id} value={business.id}>
                                    {business.name}
                                  </Option>
                                ))}
                              </Select>
                            </FormItem>
                          </Col>

                          {permissionType == '100' ? (
                            <Col span={16}>
                              <FormItem
                                label={t('搜索：')}
                                {...vagueFormItemLayout}>
                                <Input
                                  ref={fuzzySearchInput =>
                                    (this.fuzzySearchInput = fuzzySearchInput)
                                  }
                                  style={{ width: '100%' }}
                                  placeholder={t(
                                    '请输入数据资源ID、数据资源名称'
                                  )}
                                  onChange={e =>
                                    this.setState({
                                      fuzzySearch: e.target.value
                                    })
                                  }
                                />
                              </FormItem>
                            </Col>
                          ) : null}
                        </Row>
                        <Row gutter={24} className="search-fields">
                          <Col span={24} style={{ padding: '0' }}>
                            <FormItem>
                              <Button
                                style={{
                                  margin: '0 24px 0 12px',
                                  float: 'right'
                                }}
                                type="primary"
                                icon="search"
                                onClick={e => this.search()}>
                                {t('搜索')}
                              </Button>
                              <Button
                                onClick={e => this.empty()}
                                style={{ float: 'right' }}>
                                {t('重置')}
                              </Button>
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </Card>

                    <Card
                      style={{
                        border: 0,
                        // boxShadow: '0 0 30px 6px #eff0f2 inset',
                        padding: '24px'
                      }}>
                      {this.state.permissionType !== '6' &&
                      this.state.currUserInfo.approveStatus ? (
                        <Row gutter={24}>
                          <Col span={24}>
                            <FormItem
                              style={{
                                float: 'right',
                                margin: '0 0 16px 0'
                              }}>
                              <span
                                style={{ color: 'red', marginRight: '20px' }}>
                                {t('修改权限状态')}
                              </span>
                              <Button
                                type="primary"
                                onClick={this.batchOpen}
                                disabled={!hasSelected}
                                ghost={!hasSelected}>
                                {t('设置为保留')}
                              </Button>
                              {this.state.permissionType != '1' ? (
                                <Button
                                  style={{ marginLeft: '12px' }}
                                  type="primary"
                                  onClick={this.batchClose}
                                  disabled={!hasSelected}
                                  ghost={!hasSelected}>
                                  {t('设置为删除')}
                                </Button>
                              ) : null}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null}
                      {this.state.currUserInfo.approveStatus == 0 &&
                      this.state.currUserInfo.reviewComment ? (
                        <Row gutter={24} className="search-fields">
                          <Col span={6}>
                            <FormItem
                              label={t('保留理由')}
                              style={{ margin: '0' }}>
                              {this.state.currUserInfo.reviewComment}
                            </FormItem>
                          </Col>
                        </Row>
                      ) : null}

                      {isShowCount == '-1' ? (
                        <div>
                          <Tag
                            style={{
                              height: '40px',
                              fontSize: '14px',
                              background: '#FEFBE6',
                              lineHeight: '40px',
                              width: '100%',
                              border: '1px solid #FCE58F'
                            }}>
                            <span
                              className="iconfont iconzhuyishixiang_f"
                              style={{ color: '#ff7d4c' }}></span>
                            {t(tabObj(t)[this.state.permissionType])}
                            {t('类型权限将保留')}
                            <span style={{ color: '#ff7d4c' }}>
                              {this.state.openPermissonCount}
                            </span>
                            {t('条，删除')}
                            <span style={{ color: '#ff7d4c' }}>
                              {this.state.closedPermissionCount}
                            </span>
                            {t('条 | 共')}
                            <span style={{ color: '#ff7d4c' }}>
                              {this.state.openPermissonCount +
                                this.state.closedPermissionCount ||
                                this.state.openPermissonCount}
                            </span>
                            {t('条')}
                          </Tag>
                        </div>
                      ) : null}
                      {permissionType == '1' ? (
                        <Table
                          dataSource={tableList}
                          // size="small"
                          pagination={{
                            current: this.state.currentPage,
                            pageSize: this.state.pageSize,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            total: tableCount,
                            showTotal: total =>
                              `${t('共')} ${total} ${t('条')}`,
                            onChange: this.handlePageChange,
                            onShowSizeChange: this.onShowSizeChange,
                            pageSizeOptions: ['10', '20', '50', '100']
                          }}
                          onExpand={this.onTableExpand}
                          expandedRowKeys={this.state.expandedRowKeys}
                          expandedRowRender={record => (
                            <DetailTree
                              record={record}
                              currUserInfo={
                                this.state.currUserInfo.approveStatus
                              }
                              username={this.state.currUsername}
                              permissionReviewId={this.state.detailNow.id}
                              btnLoaddingStatus={this.state.btnLoadding}
                              handleBtnLoadding={this.handleBtnLoadding}
                              reloadTableList={
                                this.reloadTableList
                              }></DetailTree>
                          )}
                          className="upm-table"
                          rowKey={record =>
                            `${record.relId}_${record.businessId}_${record.appId}`
                          }
                          loading={loading}
                          {...rowSelection}>
                          <Column
                            title={t('系统名称')}
                            dataIndex="appName"
                            key="appName"
                          />
                          <Column
                            title={t('业务线')}
                            dataIndex="businessName"
                            key="businessName"
                          />
                          <Column
                            title={t('状态')}
                            dataIndex="status"
                            key="status"
                            render={status => {
                              if (status == 0) {
                                return (
                                  <span style={{ color: 'red' }}>
                                    {t('删除')}
                                  </span>
                                );
                              } else if (status == 1) {
                                return (
                                  <span style={{ color: 'green' }}>
                                    {t('保留')}
                                  </span>
                                );
                              } else if (status == 2) {
                                return <span>-</span>;
                              }
                            }}
                          />
                        </Table>
                      ) : (
                        <Table
                          dataSource={tableList}
                          // size="small"
                          pagination={{
                            current: this.state.currentPage,
                            pageSize: this.state.pageSize,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            total: tableCount,
                            showTotal: total =>
                              `${t('共')} ${total} ${t('条')}`,
                            onChange: this.handlePageChange,
                            onShowSizeChange: this.onShowSizeChange,
                            pageSizeOptions: ['10', '20', '50']
                          }}
                          className="upm-table"
                          rowKey={record =>
                            `${record.relId}_${record.businessId}_${record.appId}`
                          }
                          loading={loading}
                          {...rowSelection}>
                          {permissionType == '100' ? (
                            <Column
                              title={t('数据资源ID')}
                              dataIndex="id"
                              key="id"
                            />
                          ) : null}
                          <Column
                            title={t('系统名称')}
                            dataIndex="appName"
                            key="appName"
                          />
                          <Column
                            title={
                              tabObj(t)[this.state.permissionType] + t('名称')
                            }
                            dataIndex="name"
                            key="name"
                          />
                          {permissionType == '100' ? (
                            <Column
                              title={t('数据类型')}
                              dataIndex="resourceTypeName"
                              key="resourceTypeName"
                            />
                          ) : null}
                          <Column
                            title={t('敏感级')}
                            dataIndex="riskLevel"
                            key="riskLevel"
                          />
                          <Column
                            title={t('业务线')}
                            dataIndex="businessName"
                            key="businessName"
                          />
                          <Column
                            title={t('申请时间')}
                            dataIndex="applyDate"
                            key="applyDate"
                            render={time =>
                              time
                                ? moment(time).format('YYYY.MM.DD HH:mm')
                                : ''
                            }
                          />
                          <Column
                            title={t('过期时间')}
                            dataIndex="expireDate"
                            key="expireDate"
                            render={time => {
                              if (time) {
                                if (time < Date.now()) {
                                  return (
                                    <span style={{ color: 'red' }}>
                                      {moment(time).format('YYYY.MM.DD HH:mm')}
                                    </span>
                                  );
                                } else {
                                  return moment(time).format(
                                    'YYYY.MM.DD HH:mm'
                                  );
                                }
                              } else {
                                return '';
                              }
                            }}
                          />
                          <Column
                            title={t('状态')}
                            dataIndex="status"
                            key="status"
                            render={status => {
                              if (status == 0) {
                                return (
                                  <span style={{ color: 'red' }}>
                                    {t('删除')}
                                  </span>
                                );
                              } else if (status == 1) {
                                return (
                                  <span style={{ color: 'green' }}>
                                    {t('保留')}
                                  </span>
                                );
                              } else if (status == 2) {
                                return <span>-</span>;
                              }
                            }}
                          />
                        </Table>
                      )}
                    </Card>
                  </div>
                </div>
              </Content>
            </Layout>
          </Layout>
        </Spin>

        <Modal
          title={t('审核完成')}
          visible={modalVisible}
          onOk={this.handleModalOk}
          onCancel={this.closeModal}
          footer={[
            <Button key="back" onClick={this.closeModal}>
              {t('取消')}
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={this.state.btnReviewLoadding}
              onClick={this.handleModalOk}>
              {t('确认')}
            </Button>
          ]}
          width={900}>
          <p
            style={{ margin: '0px 0 15px 0' }}
            dangerouslySetInnerHTML={{ __html: this.getCloseWord() }}></p>
          {closeApproveTableTotal > 0 ? (
            <Table
              rowKey="id"
              dataSource={closeApproveTableRecords}
              size="small"
              pagination={{
                current: currCloseApproveTablePage,
                pageSize: 10,
                hideOnSinglePage: true,
                total: closeApproveTableTotal,
                onChange: this.onCloseApprovePageChange
              }}>
              <Column title={t('系统名称')} dataIndex="appName" key="appName" />
              <Column
                title={t('权限类型及名称')}
                dataIndex="name"
                key="name"
                render={(name, record) => {
                  return (
                    <div>
                      <span>{tabObj(t)[record.permissionType]}</span>-
                      <span>{name}</span>
                    </div>
                  );
                }}
              />
              <Column
                title={t('敏感级')}
                dataIndex="riskLevel"
                key="riskLevel"
              />
              <Column
                title={t('业务线')}
                dataIndex="businessName"
                key="businessName"
              />
              <Column
                title={t('申请时间')}
                dataIndex="applyDate"
                key="applyDate"
                render={time =>
                  time ? moment(time).format('YYYY.MM.DD HH:mm') : ''
                }
              />
              <Column
                title={t('过期时间')}
                dataIndex="expireDate"
                key="expireDate"
                render={time => {
                  if (time) {
                    if (time < Date.now()) {
                      return (
                        <span style={{ color: 'red' }}>
                          {moment(time).format('YYYY.MM.DD HH:mm')}
                        </span>
                      );
                    } else {
                      return moment(time).format('YYYY.MM.DD HH:mm');
                    }
                  } else {
                    return '';
                  }
                }}
              />
            </Table>
          ) : null}

          <p
            style={{ margin: '20px 0 15px 0' }}
            dangerouslySetInnerHTML={{ __html: this.getOpenWord() }}></p>
          {openApproveTableTotal > 0 ? (
            <div>
              <Table
                rowKey="id"
                dataSource={openApproveTableRecords}
                size="small"
                pagination={{
                  current: currOpenApproveTablePage,
                  pageSize: 10,
                  hideOnSinglePage: true,
                  total: openApproveTableTotal,
                  onChange: this.onOpenApprovePageChange
                }}>
                <Column
                  title={t('系统名称')}
                  dataIndex="appName"
                  key="appName"
                />
                <Column
                  title={t('权限类型及名称')}
                  dataIndex="name"
                  key="name"
                  render={(name, record) => {
                    return (
                      <div>
                        <span>{tabObj(t)[record.permissionType]}</span>-
                        <span>{name}</span>
                      </div>
                    );
                  }}
                />
                <Column
                  title={t('敏感级')}
                  dataIndex="riskLevel"
                  key="riskLevel"
                />
                <Column
                  title={t('业务线')}
                  dataIndex="businessName"
                  key="businessName"
                />
                <Column
                  title={t('申请时间')}
                  dataIndex="applyDate"
                  key="applyDate"
                  render={time =>
                    time ? moment(time).format('YYYY.MM.DD HH:mm') : ''
                  }
                />
                <Column
                  title={t('过期时间')}
                  dataIndex="expireDate"
                  key="expireDate"
                  render={time => {
                    if (time) {
                      if (time < Date.now()) {
                        return (
                          <span style={{ color: 'red' }}>
                            {moment(time).format('YYYY.MM.DD HH:mm')}
                          </span>
                        );
                      } else {
                        return moment(time).format('YYYY.MM.DD HH:mm');
                      }
                    } else {
                      return '';
                    }
                  }}
                />
              </Table>
            </div>
          ) : null}
        </Modal>
      </div>
    );
  }
  empty = () => {
    if (this.props.apps.length == 1) {
      this.setState({
        permissionName: '',
        businessId: '0',
        resourceTypeIdList: [''],
        riskLevelList: [''],
        fuzzySearch: ''
      });
    } else {
      this.setState({
        permissionName: '',
        businessId: '0',
        resourceTypeIdList: [''],
        riskLevelList: [''],
        appId: 0,
        fuzzySearch: ''
      });
    }
    this.permissionNameInput
      ? (this.permissionNameInput.state.value = '')
      : null;
    this.fuzzySearchInput ? (this.fuzzySearchInput.state.value = '') : null;
  };
}

const DetailModalPage = Form.create({})(DetailModal);

export default connect(({ global, review }) => {
  return {
    loading: review.loading,
    apps: review.useApps,
    allBusiness: global.allBusiness,
    approveUserList: review.approveUserList,
    approveUserPermissionCount: review.approveUserPermissionCount,
    approveUserPermissionList: review.approveUserPermissionList,
    closeApproveConfirmList: review.closeApproveConfirmList,
    closeApproveCount: review.closeApproveCount,
    openApproveConfirmList: review.openApproveConfirmList,
    openApproveCount: review.openApproveCount,
    permissionNumList: review.permissionNumList
  };
})(DetailModalPage);
