/*
 * @Author: Meng Hao
 * @Date: 2018-09-12 11:26:09
 * @LastEditors: GuoTeng
 * @LastEditTime: 2020-12-10 15:12:19
 */

import React from 'react';
import _ from 'lodash';
import ClipboardJS from 'clipboard';
import connect from '@utils/translateConnect';
import request from '@utils/request';
import { toggleClass } from '@utils/classOp';
import { routerRedux } from 'dva/router';
import {
  Input,
  Tabs,
  Button,
  Modal,
  message,
  Form,
  Table,
  Select,
  Col,
  Row,
  Divider,
  Popover,
  Checkbox,
  Icon
} from 'antd';
import TextButton from '@components/TextButton';
import { MAIN } from '@routes/config';
import './../ApplyList/index.less';
import './index.less';
import { startRecordApproveTime } from '@utils/stat.js';
import moment from 'moment';
import { trackEvent } from '@utils/omega';

import { APPROVE_PAGE_VIEW_DETAIL } from '@config/omega';

const TextArea = Input.TextArea;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const { Column } = Table;
const CheckboxGroup = Checkbox.Group;
const PASS = 'pass';
const WITHDRAW = 'withdraw';
const BATCH_PASS = 'batchPass';
const BATCH_WITHDRAW = 'batchWithdraw';

const riskLevelOptions = ['C1', 'C2', 'C3', 'C4'];
const userTypeOptions = ['正式员工', '外包员工', '实习生员工'];

const defaultFilterParams = {
  appId: '',
  type: '0',
  businessId: '0',
  applyName: '',
  deptKeyword: '',
  applyId: '',
  userType: '-1', // 员工类型
  riskLevel: '0' // 敏感级
};

class Approve extends React.PureComponent {
  constructor(props) {
    super(props);
    const { workflowenums = {} } = props.global.enumMap || {};
    const { approveStatus = {} } = workflowenums;

    let defaultCheckedColumnNameList = window.localStorage.getItem(
      'my-approve-checked-column-name-list'
    )
      ? JSON.parse(
          window.localStorage.getItem('my-approve-checked-column-name-list')
        )
      : [
          'applyId',
          'nameDisplay',
          'deptDisplay',
          'userType',
          'appName',
          'applyTypeName',
          'role',
          'riskLevel',
          'processStatus',
          'applyRemark',
          'applyCreateAt'
        ];
    const { t } = props;

    this.state = {
      // deptList: [],
      // dept: [],
      status: '1', // 当前审批的状态；1：待审批；2：已通过；3：已审批；all：全部
      // 筛选params
      ...defaultFilterParams,
      selectedRows: [],
      modalType: undefined,
      modalShow: false,
      // modalContent: '',
      modalTitle: '',
      modalApproveId: -1,
      modalApplyId: 0,
      pageCurrent: 1,
      pageSize: 10,
      loadingOnModalSubmit: false, //优化点击事件
      // iconLoading: false
      checkedColumnNameList: defaultCheckedColumnNameList, // 选中的展示column
      columnNameList: [
        //表格设置checkGroup的dataSource
        {
          label: t('编号'),
          value: 'applyId'
        },
        {
          label: t('申请人'),
          value: 'nameDisplay'
        },
        {
          label: t('部门'),
          value: 'deptDisplay'
        },
        {
          label: t('员工类型'),
          value: 'userType'
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
          label: t('权限敏感级'),
          value: 'riskLevel'
        },
        {
          label: t('流程状态'),
          value: 'processStatus',
          disabled: true
        },
        {
          label: t('申请理由'),
          value: 'applyRemark'
        },
        {
          label: t('申请时间'),
          value: 'applyCreateAt'
        }
      ]
    };
    this.loadingFlagByTabChange = false;
    this.columns = [
      //table的column
      {
        title: t('编号'),
        dataIndex: 'applyId',
        key: 'applyId',
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
        title: t('申请人'),
        dataIndex: 'applyUser',
        key: 'nameDisplay',
        width: 60,
        render: (text, record) => {
          record.applyUser = record.applyUser || {};
          return (
            <Popover
              overlayClassName="applyer-popover"
              content={
                <div className="popovercontent">
                  <p>{t('账号') + '：' + record.applyUser.accountName}</p>
                  {/* <p>{t('部门')+'：'+record.applyUser.deptDescr1 + '-' + record.applyUser.deptDescr2}</p> */}
                  <p>{t('职位') + '：' + record.applyUser.jobcodeDescr}</p>
                </div>
              }>
              <span style={{ cursor: 'pointer' }} className="twoRowsEllipsis">
                {record.applyUser.nameDisplay || '-'}
              </span>
            </Popover>
          );
        }
      },
      {
        title: t('部门'),
        dataIndex: 'applyUser',
        key: 'deptDisplay',
        width: 100,
        render: (text, record) => {
          record.applyUser = record.applyUser || {};
          const data = `${record.applyUser.deptDescr1}-${record.applyUser.deptDescr2}`;
          return (
            <Popover content={data} trigger="hover">
              <span className="twoRowsEllipsis">{data}</span>
            </Popover>
          );
        }
      },
      {
        title: t('员工类型'),
        dataIndex: 'applyUser',
        key: 'userType',
        width: 80,
        render: (text, record) => {
          record.applyUser = record.applyUser || {};
          const data = record.applyUser.emplClass || '';
          return (
            <Popover content={data} trigger="hover">
              <span className="twoRowsEllipsis">{data}</span>
            </Popover>
          );
        }
      },
      {
        title: t('目标系统'),
        dataIndex: 'appName',
        key: 'appName',
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
        width: 100,
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
        title: t('权限敏感级'),
        dataIndex: 'riskLevel',
        key: 'riskLevel',
        width: 80,
        render: text => {
          if (text == 0) {
            return <span>{t('-')}</span>;
          } else {
            const data = riskLevelOptions[text - 1];
            return (
              <Popover content={data} trigger="hover">
                <span className="twoRowsEllipsis">{data}</span>
              </Popover>
            );
          }
        }
      },
      {
        title: t('流程状态'),
        dataIndex: 'processStatus',
        key: 'processStatus',
        width: 80,
        render: text => {
          const data = t(approveStatus[text]);
          return (
            <Popover content={data} trigger="hover">
              <span className="twoRowsEllipsis">{data}</span>
            </Popover>
          );
        }
      },
      {
        title: t('申请理由'),
        dataIndex: 'applyRemark',
        key: 'applyRemark',
        width: 120,
        render: text => {
          return (
            <Popover content={text} trigger="hover">
              <span className="twoRowsEllipsis">{text}</span>
            </Popover>
          );
        }
      },
      // // processColumn(),
      {
        title: t('申请时间'),
        dataIndex: 'applyCreateAt',
        key: 'applyCreateAt',
        width: 120,
        render: text => {
          const time = moment(text).format('YYYY-MM-DD HH:mm:ss');
          return (
            <Popover content={time} trigger="hover">
              <span className="twoRowsEllipsis">{time}</span>
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
          const { t, dispatch } = this.props;
          let operationEle = null;

          if (record.processStatus === 1) {
            operationEle = (
              <span>
                <TextButton
                  onClick={() => {
                    if (record.riskLevel == 4) {
                      // C4数据提示谨慎操作
                      this.levelReminderModalToggle(
                        record.approveId,
                        '' + record.applyId,
                        'single'
                      );
                    } else {
                      this.passLevelReminder(
                        record.approveId,
                        'single',
                        record.applyId
                      );
                    }
                  }}>
                  {t('通过')}
                </TextButton>
                <Divider type="vertical" />
                <TextButton
                  onClick={() => {
                    this.setState({
                      modalType: WITHDRAW,
                      modalShow: true,
                      // modalContent: '',
                      modalTitle: t('驳回审批'),
                      modalApproveId: record.approveId
                    });
                  }}>
                  {t('驳回')}
                </TextButton>
                <Divider type="vertical" />
              </span>
            );
          }

          return (
            <div style={{ width: '114px' }}>
              {operationEle}
              <TextButton
                onClick={() => {
                  trackEvent(APPROVE_PAGE_VIEW_DETAIL);
                  const {
                    status,
                    appId,
                    type,
                    businessId,
                    applyName,
                    deptKeyword,
                    applyId,
                    userType,
                    riskLevel,
                    pageCurrent,
                    pageSize
                  } = this.state;
                  const cachedParams = {
                    status,
                    appId,
                    type,
                    businessId,
                    applyName,
                    deptKeyword,
                    applyId,
                    userType,
                    riskLevel,
                    pageCurrent,
                    pageSize
                  };
                  const url = `${MAIN}/approve/approve-detail/${record.approveId}`;
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
            </div>
          );
        }
      }
    ];
  }

  componentDidMount() {
    // 开始审批打点
    startRecordApproveTime();
    // 判断是否由 审批详情 页面，跳转回来
    let newState = {};
    if (this.props.location.query) {
      // 由 审批详情 页面，跳转回来
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
        this.getApproveList();
      }, 0);
    }
  }

  /**
   * 页面初始化
   */
  init = () => {
    this.getApproveList();
    //根据缓存的tabKey，改变表格设置中column(流程状态)的disable状态
    this.setSettingColumnDisable(this.state.status);
  };

  getApproveList = () => {
    const { dispatch } = this.props;
    const {
      type,
      businessId,
      status,
      applyName,
      applyId,
      appId,
      // dept,
      deptKeyword,
      riskLevel,
      userType,
      pageCurrent,
      pageSize
    } = this.state;

    const params = {
      page: pageCurrent,
      deptKeyword,
      size: pageSize
      // deptIdList: dept,
    };

    // appId为''的时候，就是选择【全部】
    if (appId !== '') {
      params.appId = appId;
    }

    if (type !== '0') {
      params.applyType = Number(type);
    }

    if (businessId !== '0') {
      params.businessId = Number(businessId);
    }

    if (status && status !== 'all') {
      params.approveStatuses = [Number(status)];
    }

    if (applyName.trim()) {
      params.applyUsername = applyName;
    }

    if (applyId && parseInt(applyId) >= 0) {
      params.applyId = Number(applyId);
    }

    if (riskLevel && riskLevel != 0) {
      params.riskLevel = Number(riskLevel);
    }

    if (userType != -1) {
      params.userType = Number(userType);
    }

    dispatch({
      type: 'approveList/fetchApprove2',
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
        this.getApproveList();
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
        this.getApproveList();
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
          this.getApproveList();
          this.setSettingColumnDisable(tabKey);
        }, 300);
      }
    );
  };

  /**
   * 根据tabKey设置表格设置中 流程状态column 的disable
   * @param {*} status
   */
  setSettingColumnDisable = status => {
    const newColumnNameList = _.cloneDeep(this.state.columnNameList);
    newColumnNameList[8].disabled = status !== 'all' ? true : false;
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
          'my-approve-checked-column-name-list',
          JSON.stringify(checkedList)
        );
      }
    );
  };

  /**
   * 审批对话框-取消
   */
  handleCancel = () => {
    this.setState({
      modalShow: false,
      modalApproveId: -1
    });
  };

  /**
   * 审批对话框-确定
   */
  handleOK = () => {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const { reason } = values;
      this.setState({
        loadingOnModalSubmit: true
      });
      // console.log('进入');
      const { dispatch, t } = this.props;
      let params = null;
      let action = null;

      // if (!this.state.modalContent.trim()) {
      //   message.error(t('请输入理由'));
      //   this.setState({
      //     loadingOnModalSubmit: false
      //   });
      //   return;
      // }
      switch (this.state.modalType) {
        case PASS:
          params = {
            id: this.state.modalApproveId,
            reason
          };
          action = 'passApprove';
          break;
        case WITHDRAW:
          params = {
            id: this.state.modalApproveId,
            reason
          };
          action = 'rejectApprove';
          break;
        case BATCH_PASS:
          params = this.state.selectedRows.map(i => ({
            id: i.approveId,
            reason
          }));
          action = 'batchPassApprove';
          break;
        case BATCH_WITHDRAW:
          params = this.state.selectedRows.map(i => ({
            id: i.approveId,
            reason
          }));
          action = 'batchRejectApprove';
          break;
        default:
          break;
      }
      // console.log(this.state.modalType);

      dispatch({
        type: `approveList/${action}`,
        payload: params
      }).then(result => {
        // 批量操作的提示
        let fail = [];
        // console.log(this.state.modalType);

        if (this.state.modalType === PASS) {
          // 单条审批，自动加入已驳回列表
          if (typeof result === 'string') {
            try {
              const {
                bpmExceptionType,
                appName,
                applyUserNameZh,
                isBPM,
                processInstanceId,
                traceId,
                errorMessage
              } = JSON.parse(result);
              const { modalApplyId } = this.state;
              this.setState({
                modalShow: false,
                modalApproveId: -1,
                selectedRows: []
              });
              // 提示框逻辑
              function genContent() {
                return (
                  <div>
                    <p>
                      {// bpmExceptionType == 1
                      //   ? <span><b>{appName}</b>审批流出现问题</span>
                      //   : <span><b>{appName}</b>系统没有在<b>BPM</b>配置审批流</span>
                      bpmExceptionType == 1 ? null : (
                        <span>
                          <b>{appName}</b>系统没有在<b>BPM</b>配置审批流
                        </span>
                      )}
                    </p>
                    {bpmExceptionType == 1 ? (
                      <div>
                        <p>{t('编号：') + modalApplyId}</p>
                        <p>{errorMessage}</p>
                        {/* <p style={{ textAlign: 'right' }}><a className="copy" data-clipboard-text={traceId + '|' + errorMessage + '|' + processInstanceId}>复制问题反馈信息</a></p> */}
                        {/* <b>请复制问题反馈信息，并提供给 信息安全小助手，以便尽快解决该问题</b> */}
                      </div>
                    ) : null}
                  </div>
                );
              }
              if (isBPM) {
                Modal.error({
                  width: 500,
                  centered: true,
                  title:
                    bpmExceptionType == 1 ? (
                      <span>
                        {applyUserNameZh}，抱歉，检测到{appName}
                        系统审批流出现异常
                      </span>
                    ) : (
                      '权限申请提交失败'
                    ),
                  content: genContent(),
                  okText: t('确定')
                });

                this.clipboard = new ClipboardJS('.copy');
              } else {
                message.error(result);
              }
            } catch (e) {
              message.error(result);
            }
            this.setState({
              loadingOnModalSubmit: false
            });

            this.getApproveList();
            return;
          }
        } else if (this.state.modalType === BATCH_WITHDRAW) {
          for (const item in result) {
            if (result[item] != 0) {
              fail.push({ applyId: item, resultMsg: result[item] });
            }
          }
          this.setState({
            loadingOnModalSubmit: false
          });
        } else if (this.state.modalType === BATCH_PASS) {
          fail = result.filter(res => res.resultCode != 0);
          this.setState({
            loadingOnModalSubmit: false
          });
        } else if (this.state.modalType === WITHDRAW) {
          if (typeof result === 'string') {
            const {
              bpmExceptionType,
              appName,
              applyUserNameZh,
              isBPM,
              processInstanceId,
              traceId,
              errorMessage
            } = JSON.parse(result);
            this.setState({
              modalShow: false,
              modalApproveId: -1,
              selectedRows: []
            });
            // 提示框逻辑
            function genContent() {
              return (
                <div>
                  <p>
                    {bpmExceptionType == 1 ? (
                      <span>
                        <b>{appName}</b>审批流出现问题
                      </span>
                    ) : (
                      <span>
                        <b>{appName}</b>系统没有在<b>BPM</b>配置审批流
                      </span>
                    )}
                  </p>
                  {bpmExceptionType == 1 ? (
                    <div>
                      问题反馈信息：
                      <p>
                        {traceId}|{errorMessage}|{processInstanceId}
                      </p>
                      <p style={{ textAlign: 'right' }}>
                        <a
                          className="copy"
                          data-clipboard-text={
                            traceId +
                            '|' +
                            errorMessage +
                            '|' +
                            processInstanceId
                          }>
                          复制问题反馈信息
                        </a>
                      </p>
                      <b>
                        请复制问题反馈信息，并提供给
                        信息安全小助手，以便尽快解决该问题
                      </b>
                    </div>
                  ) : null}
                </div>
              );
            }
            if (isBPM) {
              Modal.error({
                width: 780,
                centered: true,
                title:
                  bpmExceptionType == 1 ? (
                    <span>
                      {applyUserNameZh}，抱歉，检测到您的审批流出现异常
                    </span>
                  ) : (
                    '权限申请提交失败'
                  ),
                content: genContent(),
                okText: t('确定')
              });

              this.clipboard = new ClipboardJS('.copy');
            } else {
              message.error(result);
            }
            this.setState({
              loadingOnModalSubmit: false
            });

            this.getApproveList();
            return;
          }
        }

        if (fail.length === 0) {
          message.success(t('操作成功'));
        } else {
          // console.log(fail.map(item => {
          //    return item.resultMsg
          // }));
          Modal.error({
            title: t('审批处理结果'),
            content: fail.map(item => {
              return (
                <p key={item.applyId}>
                  {t('编号') +
                    '：' +
                    item.applyId +
                    '，' +
                    t('失败原因') +
                    '：' +
                    `${item.resultMsg}`}
                </p>
              );
            })
          });
        }

        this.setState(
          {
            modalShow: false,
            modalApproveId: -1,
            selectedRows: [],
            loadingOnModalSubmit: false
          },
          () => {
            dispatch({
              type: 'approveList/isShowFeedbackModal'
            });
          }
        );
        this.getApproveList();
      });
    });
  };

  /**
   * 审批对话框-获取默认提示
   */
  getOptionPlaceholder = () => {
    const { t } = this.props;
    switch (this.state.modalType) {
      case PASS:
      case BATCH_PASS:
        return t('请输入审批通过的理由，必填');
      case WITHDRAW:
      case BATCH_WITHDRAW:
        return t('请输入审批驳回的理由，必填');
    }
  };

  /**
   * 继续通过审批
   * @param {number} approveId
   * @param {string} type 'single'/'batch'
   */
  passLevelReminder = (approveId, type, applyId) => {
    const { t } = this.props;

    if (type === 'single') {
      this.setState(
        {
          modalType: PASS,
          modalShow: true,
          // modalContent: t('同意'),
          modalTitle: t('通过审批'),
          modalApproveId: approveId,
          modalApplyId: applyId || 0
        },
        () => {
          this.props.form.setFieldsValue({
            reason: t('同意')
          });
        }
      );
    } else if (type === 'batch') {
      this.setState(
        {
          modalType: BATCH_PASS,
          modalShow: true,
          // modalContent: t('同意'),
          modalTitle: t('批量通过审批')
        },
        () => {
          this.props.form.setFieldsValue({
            reason: t('同意')
          });
        }
      );
    }
  };

  /**
   * C4数据触发提示
   * @param {*} approveId
   * @param {*} highLevelApplyIds
   * @param {*} type
   */
  levelReminderModalToggle = (approveId, highLevelApplyIds, type) => {
    const { t } = this.props;
    const self = this;
    Modal.confirm({
      title: t('是否继续？'),
      content: `${t('审批单')} ${highLevelApplyIds} ${t(
        '包含高敏感权限，为避免高敏感数据泄露，请谨慎审批'
      )}`,
      okText: t('继续'),
      cancelText: t('返回'),
      onOk() {
        self.passLevelReminder(approveId, type, highLevelApplyIds);
      }
    });
  };

  /**
   * 批量通过
   */
  batchPass = () => {
    const highLevelApplyIds = this.state.selectedRows
      .filter(item => item.riskLevel === 4)
      .map(item => item.applyId)
      .join('，');
    if (highLevelApplyIds !== '') {
      this.levelReminderModalToggle(-1, highLevelApplyIds, 'batch');
    } else {
      this.passLevelReminder(-1, 'batch');
    }
  };

  /**
   * 批量驳回
   */
  batchReject = () => {
    const { t } = this.props;
    this.setState({
      modalType: BATCH_WITHDRAW,
      modalShow: true,
      // modalContent: '',
      modalTitle: t('批量驳回审批')
    });
  };

  /**
   * 翻页
   * @param {*} current
   */
  handlePageChange = current => {
    this.setState(
      {
        pageCurrent: current
      },
      () => {
        this.getApproveList();
      }
    );
  };

  /**
   * 每页显示数量改变
   * @param {*} current
   * @param {*} size
   */
  handleShowSizeChange = (current, size) => {
    this.setState(
      {
        pageCurrent: current,
        pageSize: size
      },
      () => {
        this.getApproveList();
      }
    );
  };

  render() {
    const {
      t,
      form: { getFieldDecorator },
      approveList = {},
      global = {}
    } = this.props;
    const {
      type,
      selectedRows,
      status,
      // deptList,
      businessId,
      riskLevel,
      userType
    } = this.state;
    const {
      current = 0,
      size = 0,
      total = 0,
      records = [],
      loading
    } = approveList;
    const { workflowenums = {} } = global.enumMap || {};
    const { approveStatus = {}, infoType = {} } = workflowenums;

    // 国际化
    if (records && records.length > 0) {
      records.map(item => {
        return (item.applyTypeName = t(item.applyTypeName));
      });
    }

    // 多选
    const rowSelection = {
      selectedRowKeys: selectedRows.map(item => item.approveId),
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows
        });
      },
      getCheckboxProps: record => {
        return {
          approveId: record.approveId.toString(),
          disabled: record.processStatus !== 1 // Column configuration not to be checked
        };
      }
    };

    // const debouncedDeptSearch = _.debounce((word) => {
    //   request(`/my/dept/search/${word}`).then((res) => {
    //     this.setState({
    //       deptList: res
    //     })
    //   });
    // }, 500);

    // const formatDept = (item) => {
    //   let result = item.deptName;
    //   while (item.parentDept) {
    //     result = item.parentDept.deptName + '-' + result;
    //     item = item.parentDept;
    //   }
    //   return result;
    // }

    // 获取实际column
    const getColumns = () => {
      const newColumns = _.cloneDeep(this.columns);
      return newColumns.filter(column => {
        if (column.key === 'operate') return true;
        if (this.state.checkedColumnNameList.includes(column.key)) {
          if (column.key === 'processStatus' && status !== 'all') {
            return false;
          }
          return true;
        }
      });
    };

    // 获取表格设置popover内容
    const getColunmSettingContent = () => {
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
      <div className="approve-list upm-filter-content-page">
        <Tabs
          size="large"
          className="tabs"
          activeKey={status}
          onChange={this.handleChangeOnTabs}>
          <TabPane
            tab={t('待审批') + `(${approveList.approveingCount || 0})`}
            key="1"></TabPane>
          <TabPane
            tab={t('已通过') + `(${approveList.approveSuccessCount || 0})`}
            key="2"></TabPane>
          <TabPane
            tab={t('已驳回') + `(${approveList.approveFailCount || 0})`}
            key="3"></TabPane>
          <TabPane
            tab={t('全部') + `(${approveList.approveTotalCount || 0})`}
            key="all"></TabPane>
        </Tabs>
        <div className="filter-area">
          <Form {...formItemLayout}>
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
                      <Select.Option key={item.appId} value={item.appId}>
                        {item.appName}
                      </Select.Option>
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
                <FormItem label={t('申请人：')}>
                  <Input
                    placeholder={t('请输入申请人账号')}
                    onChange={e => this.setState({ applyName: e.target.value })}
                  />
                </FormItem>
              </Col>

              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('申请人部门：')}>
                  <Input
                    placeholder={t('请输入部门')}
                    onChange={e =>
                      this.setState({ deptKeyword: e.target.value })
                    }
                  />
                  {/* <Select
                  placeholder={t('请选择')}
                  dropdownMatchSelectWidth={false}
                  style={{width: '100%'}}
                  showSearch
                  mode="multiple"
                  onSearch={(word) => {word?debouncedDeptSearch(word):''}}
                  onChange={(value) => this.setState({dept: value})}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {deptList.length&&deptList.map((item, index) => (
                    <Option key={index} value={item.deptId}>{formatDept(item)}</Option>
                  ))}
                </Select> */}

                  {/* <Select
                  showSearch
                  placeholder={t('请选择')}
                  value={businessId}
                  onChange={(value) => this.setState({businessId: value})}
                  className="form-select"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="0">
                    {t('全部')}
                  </Option>
                  {_.map(global.allBusiness, (business) => (
                    <Option key={business.id} value={business.id}>
                      {business.name}
                    </Option>
                  ))}
                </Select> */}
                </FormItem>
              </Col>

              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('编号：')}>
                  <Input
                    placeholder={t('请输入编号')}
                    onChange={e => this.setState({ applyId: e.target.value })}
                  />
                </FormItem>
              </Col>

              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('员工类型：')}>
                  <Select
                    placeholder={t('请选择')}
                    value={userType}
                    onChange={value => this.setState({ userType: value })}
                    className="form-select"
                    dropdownMatchSelectWidth={false}>
                    <Option value="-1">{t('全部')}</Option>
                    {_.map(userTypeOptions, (item, index) => (
                      <Option key={index} value={index}>
                        {t(item)}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('权限敏感级：')}>
                  <Select
                    placeholder={t('请选择')}
                    value={riskLevel}
                    onChange={value => {
                      this.setState({ riskLevel: value });
                    }}
                    className="form-select"
                    dropdownMatchSelectWidth={false}>
                    <Option value="0">{t('全部')}</Option>
                    {_.map(riskLevelOptions, (item, index) => (
                      <Option key={index} value={index + 1}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col
                xs={8}
                sm={8}
                md={8}
                lg={8}
                xl={8}
                className="filter-fields-option">
                <FormItem {...tailFormItemLayout}>
                  <span className="filter-options-wrapper">
                    <Button onClick={() => this.handleReset()}>
                      {t('重置')}
                    </Button>
                    <Button
                      type="primary"
                      icon="search"
                      onClick={this.handleSearch}>
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
              title={'列设置'}
              content={getColunmSettingContent()}
              trigger="click">
              <a className="table-setup-text">
                {t('表格设置')} <Icon type="down" />
              </a>
            </Popover>
            <Button
              type="primary"
              ghost
              disabled={this.state.selectedRows.length === 0 ? true : false}
              onClick={this.batchReject}>
              {t('批量驳回')}
            </Button>
            <Button
              type="primary"
              ghost
              disabled={this.state.selectedRows.length === 0 ? true : false}
              onClick={this.batchPass}>
              {t('批量通过')}
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
              onShowSizeChange: this.handleShowSizeChange
            }}
            className="upm-table"
            rowKey="approveId"
            loading={loading || this.loadingFlagByTabChange}
            rowSelection={rowSelection}
          />
        </div>

        <Modal
          title={this.state.modalTitle}
          visible={this.state.modalShow}
          wrapClassName="approve-modal"
          destroyOnClose
          onOk={this.handleOK}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              {t('取消')}
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleOK}
              loading={this.state.loadingOnModalSubmit}>
              {t('确定')}
            </Button>
          ]}>
          <Form>
            <FormItem>
              {getFieldDecorator('reason', {
                rules: [
                  { required: true, message: t('必填') },
                  { max: 200, message: t('最大支持200字符') }
                ],
                initialValue: ''
              })(
                <TextArea
                  required
                  // value={this.state.modalContent}
                  placeholder={this.getOptionPlaceholder()}
                  autosize={{ minRows: 2, maxRows: 6 }}
                  // onChange={e => {
                  //   this.setState({
                  //     modalContent: e.target.value
                  //   });
                  // }}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(
  connect(({ approveList, global }) => {
    return {
      global,
      // ...entrance,
      // appId: global.globalAppId,
      approveList: approveList.list2,
      apps: global.apps
    };
  })(Approve)
);
