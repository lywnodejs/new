import React from 'react';
import _ from 'lodash';
import { translate } from 'react-i18next';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Row,
  Col,
  Button,
  Input,
  notification,
  Modal,
  message,
  Dropdown,
  Menu,
  Icon,
  Card
} from 'antd';

import { echoMessage } from '@utils/notice';
import { trackEvent } from '@utils/omega';
import { MANAGE, BUSINESSMANAGE, MAIN } from '@routes/config';
import {
  MAIN_PAGE_VIEW_TAG,
  MAIN_PAGE_VIEW_APPLY,
  MAIN_PAGE_VIEW_PACKAGE_APPLY,
  MAIN_PAGE_VIEW_MANAGE_ENTRANCE,
  MAIN_PAGE_VIEW_BUSINESS_MANAGE_ENTRANCE,
  MAIN_PAGE_VIEW_APPROVE_DETAIL,
  MAIN_PAGE_VIEW_SYSTEM_DETAIL,
  MAIN_PAGE_VIEW_REVIEW_DETAIL,
  MAIN_PAGE_VIEW_APPLY_DETAIL,
  MAIN_PAGE_VIEW_EXPIRE_DETAIL,
  MAIN_PAGE_VIEW_EXPIRED_DETAIL,
  MAIN_PAGE_VIEW_CHANGE_DETAIL
} from '@config/omega';

import MyRecentApply from './MyRecentApply';
import ApproveTable from '../main/ApproveList/comps/ApproveTable';
import Panel from './Panel';
import PanelItem from './Panel/item';
import PanelLabel from './Panel/label';
import introJs from '@/lib/intro.js';

// import MyRolePermission from '../main/MyRolePermission';
// import MyDataPermission from '../main/MyDataPermission';

// import CardTitle from '@components/CardTitle';

import './index.less';

import { startRecordApproveTime } from '@utils/stat.js';
import { fetchData2Review } from '../../services/home';

const TextArea = Input.TextArea;
// const TabPane = Tabs.TabPane;
const PASS_PLACEHOLDER = '请输入审批通过的理由，必填';
const REJECT_PLACEHOLDER = '请输入审批驳回的理由，必填';

let noticed = false;

class Entrance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: '',
      approveId: '',
      tabKey: 'apply',
      // 模态框设置
      modal: {
        type: 'pass', // pass, 通过 reject，驳回
        title: '',
        style: {}, // 模态框
        visible: false // 模态框状态
      },
      // fix: false,
      sys: '',
      visible: false, // 首次登录模态框
      maskVisible: false,
      preIntroVisible: false,
      postIntroVisible: false
    };
    //intro是否完成flag
    this.introCompleted = false;
  }

  // componentWillReceiveProps(nextProps){
  //   const { availableApps, managingAvailableApp } = nextProps;
  //   const availableApp = _.find(availableApps, ['id', managingAvailableApp])

  //   if ( managingAvailableApp != this.props.managingAvailableApp ) {
  //     this.setState({
  //       sys: availableApp && availableApp.name
  //     })
  //   }
  // }

  setContainer = e => {
    this.$el = e;
  };

  // setContent = e => {
  //   this.$content = e;
  // };

  handleApprove = () => {
    const { dispatch } = this.props;

    notification.close('entranceNotice');
    dispatch(routerRedux.push(MAIN + '/approve'));
  };

  renderNotice = () => {
    const { t } = this.props;

    return (
      <div style={{ textAlign: 'center', color: '#ffffff', fontSize: '16px' }}>
        {t('请提升审批效率哦~')}
        <Button
          onClick={this.handleApprove}
          style={{ marginTop: '20px' }}
          shape="round"
          size="small">
          {t('现在审批')}
        </Button>
        <div
          style={{
            color: 'rgba(0, 0, 0, 0.25)',
            width: '100%',
            position: 'absolute',
            bottom: '-8px'
          }}>
          {t('30s后自动关闭')}
        </div>
      </div>
    );
  };

  // handleScroll = _.debounce(e => {
  //   const { scrollTop } = e.target;

  //   this.setState({
  //     fix: scrollTop > 0
  //   });
  // }, 100);

  componentDidMount() {
    const { dispatch, t } = this.props;
    dispatch({ type: 'entrance/fetchApply' });
    // dispatch({ type: 'entrance/fetchApprove' });
    // dispatch({ type: 'entrance/fetchPermission' });
    this.search();
    dispatch({ type: 'entrance/fetchModules' });
    dispatch({ type: 'entrance/fetchDataChanged' });
    dispatch({ type: 'entrance/fetchDataApplying' });
    dispatch({ type: 'entrance/fetchDataExpiring' });
    dispatch({ type: 'entrance/fetchDataExpired' });

    dispatch({ type: 'entrance/fetchData2Approve' }).then(data => {
      // 页面切换只提示一次
      if (!noticed) {
        noticed = true;
        // 最长等待时间超过24小时提示
        if (data.longestWaitTime > 24 * 60) {
          notification.open({
            key: 'entranceNotice',
            getContainer: () => this.$el,
            description: this.renderNotice(),
            placement: 'bottomRight',
            duration: 30,
            className: 'entrance-notice',
            style: {
              width: 230,
              height: 300,
              marginBottom: -5
            }
          });
        }
      }
    });
    dispatch({ type: 'entrance/fetchData2Review' });
    dispatch({ type: 'entrance/fetchDataManage', payload: {} });
    dispatch({ type: 'entrance/fetchDataTeam' });

    // this.$content.addEventListener('scroll', this.handleScroll);

    dispatch({
      type: 'userInfo/shouldDisplay'
    }).then(res => {
      if (res) {
        this.props.dispatch({
          type: 'entrance/save',
          payload: {
            maskVisible: true,
            preIntroVisible: true
          }
        });

        // this.setState({
        //   maskVisible: true,
        //   preIntroVisible: true
        // });
      }
    });
    // setTimeout(() => {
    //   this.setState({
    //     maskVisible: true,
    //     preIntroVisible: true
    //   });
    // }, 100);

    // setTimeout(() => {
    //   introJs()
    //     .setOptions({
    //       doneLabel: '关闭',
    //       exitOnOverlayClick: false,
    //       showBullets: false,
    //       overlayOpacity: 0.6,
    //       disableInteraction: true,
    //       showStepNumbers: false,
    //       steps: [
    //         {
    //           element: '#intro-entrance-1',
    //           intro: t('系统管理员入口迁移到这里了~'),
    //           position: 'bottom'
    //         }
    //       ],
    //       highlightClass: {
    //         opacity: 0.4
    //       }
    //     })
    //     .start();
    // }, 2000);
  }

  // componentWillUnmount() {
  //   this.$content.removeEventListener('scroll', this.handleScroll);
  // }

  goNewApply = () => {
    trackEvent(MAIN_PAGE_VIEW_APPLY, MAIN_PAGE_VIEW_TAG);
    let { match } = this.props;
    this.props.dispatch(routerRedux.push(`${match.url}/newapply`)); // 换新版

    // this.props.dispatch(routerRedux.push(`${match.url}/new-apply`));
  };

  goPackageApply = () => {
    trackEvent(MAIN_PAGE_VIEW_PACKAGE_APPLY, MAIN_PAGE_VIEW_TAG);
    let { match } = this.props;
    this.props.dispatch(routerRedux.push(`${match.url}/packageapply`));
  };

  goSystemApply = () => {
    window.open(
      'http://bpm.didichuxing.com/process/form/bykey/information_security_upm_admin_process?tenantId=BPM'
    );
  };

  goManage = () => {
    trackEvent(MAIN_PAGE_VIEW_MANAGE_ENTRANCE, MAIN_PAGE_VIEW_TAG);
    this.props.dispatch(routerRedux.push(MANAGE + '/home/base'));
  };

  goBusinessManage = () => {
    trackEvent(MAIN_PAGE_VIEW_BUSINESS_MANAGE_ENTRANCE, MAIN_PAGE_VIEW_TAG);
    this.props.dispatch(routerRedux.push(BUSINESSMANAGE));
  };

  goApply = () => {
    this.props.dispatch(routerRedux.push(MAIN + '/apply'));
  };

  goApprove = () => {
    this.props.dispatch(routerRedux.push(MAIN + '/approve'));
  };

  goPermission = () => {
    this.props.dispatch(routerRedux.push(MAIN + '/permission'));
  };

  goAccessUpm = () => {
    window.open(
      'https://bpm.didichuxing.com/process/form/bykey/information_security_sso_insert?tenantId=BPM'
    );
    window.open(
      'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=408949683'
    );
  };

  /**
   * 切换标签
   */
  onTabChange = (key, type) => {
    this.setState({ [type]: key });

    if (key === 'approval') {
      // 开始审批打点
      startRecordApproveTime();
    }
  };

  /**
   * 查询
   */
  search = page => {
    this.props.dispatch({
      type: 'approveList/fetchApprove',
      payload: {
        approveStatuses: ['1'],
        page: page || 1,
        size: 10
      }
    });
  };

  /**
   * 分页
   */
  handlePageChange = page => {
    this.search(page);
  };

  /**
   * 查看详情
   */
  handleShowDetail = approve => {
    const { dispatch } = this.props;
    const url = `${MAIN}/approve/approve-detail/${approve.approveId}`;
    dispatch(routerRedux.push(url));
  };

  /**
   * 通过操作
   */
  handlePass = ({ approveId }) => {
    const { t } = this.props;
    this.setState({
      approveId,
      reason: '',
      modal: {
        title: t('通过原因'),
        type: 'pass',
        visible: true
      }
    });
  };

  /**
   * 驳回操作
   */
  handleReject = ({ approveId }) => {
    const { t } = this.props;
    this.setState({
      approveId,
      reason: '',
      modal: {
        title: t('驳回原因'),
        type: 'reject',
        visible: true
      }
    });
  };

  /**
   * wujianjian 30 July, 2018
   * 批量审批申请操作
   * mode: true为批量通过；false为批量驳回
   */
  handleBatchOption = (approveIds, mode) => {
    const { t } = this.props;

    if (
      !approveIds ||
      (approveIds instanceof Array && approveIds.length === 0)
    ) {
      const str = '请选择您要' + (mode ? '通过' : '驳回') + '的申请';
      return echoMessage(t(str), 'warning');
    }

    this.setState({
      approveIds,
      reason: mode ? t('同意') : '',
      modal: {
        title: mode ? t('批量通过原因(默认同意)') : t('批量驳回原因'),
        type: mode ? 'batchPass' : 'batchReject',
        visible: true
      }
    });
  };

  handleReasonChange = e => {
    const reason = e.target.value;
    this.setState({
      reason
    });
  };

  handleOk = () => {
    const { type } = this.state.modal;
    const { t } = this.props;

    let reason = this.state.reason,
      action = 'approveList/',
      payload = {
        id: this.state.approveId,
        reason: reason
      },
      batchOption = [];

    reason = _.trim(reason);

    if (!reason) {
      return echoMessage(t('请输入审批理由'), 'warning');
    }

    switch (type) {
      case 'pass':
        action += 'passApprove';
        break;
      case 'reject':
        action += 'rejectApprove';
        break;
      case 'batchPass':
        action += 'batchPassApprove';
        this.state.approveIds.map(item => {
          batchOption.push({
            id: item,
            reason: reason
          });
        });
        payload = batchOption;
        break;
      case 'batchReject':
        action += 'batchRejectApprove';
        this.state.approveIds.map(item => {
          batchOption.push({
            id: item,
            reason: reason
          });
        });
        payload = batchOption;
        break;
      default:
        return echoMessage(t('请选择审批操作'), 'warning');
    }

    // 更新数据之后关闭模态框
    this.props
      .dispatch({
        type: action,
        payload
      })
      .then(result => {
        this.setState({
          modal: {
            visible: false
          }
        });

        let fail = [];

        for (const item in result) {
          if (result[item] != 0) {
            fail.push({ key: item, value: result[item] });
          }
        }

        const { t } = this.props;
        if (fail.length === 0) {
          message.success(t('批量操作成功'), 2, this.batchOptionCallback);
        } else {
          Modal.error({
            title: t('批量审批处理结果'),
            content: fail.map(item => {
              return (
                <p key={item.key}>
                  {t('编号') +
                    '：' +
                    item.key +
                    '，' +
                    t('失败原因') +
                    '：' +
                    t(item.value)}
                </p>
              );
            }),
            onOk: this.batchOptionCallback
          });
        }
      });
  };

  batchOptionCallback = () => {
    this.search();
    this.setState({
      approveIds: []
    });
  };

  getOptionPlaceholder = () => {
    const { t } = this.props;
    switch (this.state.modal.type) {
      case 'pass':
        return t('请输入审批通过的理由，必填');
      case 'reject':
      case 'batchReject':
        return t('请输入审批驳回的理由，必填');
      case 'batchPass':
        return t('同意');
    }
  };

  handleCancel = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  handleSysClick = (appId, name) => {
    const { dispatch } = this.props;

    this.appId = appId;
    this.setState({
      sys: name
    });
    dispatch({ type: 'entrance/fetchDataManage', payload: { appId } });
  };

  handleManageDetail = () => {
    trackEvent(MAIN_PAGE_VIEW_SYSTEM_DETAIL);
    const { dispatch } = this.props;

    dispatch({
      type: 'global/selectAppToManage',
      payload: { appId: this.appId }
    });
    dispatch(routerRedux.push(MANAGE + '/'));
  };

  timeFormatter = value => {
    const hour = 60;
    const day = 24 * hour;
    const { t } = this.props;

    if (value < hour) {
      // 不足一小时
      return value + t('分钟');
    } else if (value >= hour && value < day) {
      // 不足一天
      const h = Math.floor(value / hour);
      const m = value % hour;

      return m ? h + t('小时') + m + t('分钟') : h + t('小时');
    } else {
      // 超过一天
      const d = Math.floor(value / day);
      const m = value % day;

      return (
        <span style={{ color: 'red' }}>
          {m
            ? m < hour
              ? d + t('天') + m + t('分钟')
              : d + t('天') + Math.floor(m / hour) + t('小时')
            : d + t('天')}
        </span>
      );
    }
  };

  sysName = () => {
    const { sys } = this.state;

    if (sys) return sys;

    const { availableApps, managingAvailableApp } = this.props;
    const availableApp = _.find(availableApps, ['id', managingAvailableApp]);

    this.appId = managingAvailableApp;
    return availableApp ? availableApp.name : '';
  };

  ModalHandleClose = () => {
    this.setState({
      visible: false
    });
  };

  toggleIntro = () => {
    const {
      t,
      modules,
      maskVisible,
      preIntroVisible,
      postIntroVisible
    } = this.props;
    if (preIntroVisible) {
      this.props.dispatch({
        type: 'entrance/save',
        payload: { preIntroVisible: false }
      });
      // this.setState({
      //   preIntroVisible: false
      // });
      this.introCompleted = false;
      introJs()
        .setOptions({
          nextLabel: t('下一步'),
          prevLabel: t('上一步'),
          skipLabel: t('跳过'),
          doneLabel: t('完成'),
          exitOnOverlayClick: false,
          disableInteraction: true,
          showStepNumbers: false,
          showBullets: false,
          overlayOpacity: 0.1,
          highlightClass: 'introHighlightClass',
          helperElementPadding: 0,
          steps: [
            {
              element: '#intro-entrance-1',
              intro: t('点击此处申请新权限/礼包权限'),
              position: 'bottom'
            },
            {
              element: '#intro-entrance-2',
              intro: t('点击此处接入UPM'),
              position: 'bottom'
            },
            ...(modules.length > 0
              ? [
                  {
                    element: '#intro-entrance-3',
                    intro: t(
                      '查看自己的待办/管理事项，点击「查看详情」即可跳转至相应页面'
                    ),
                    position: 'bottom'
                  }
                ]
              : []),
            {
              element: '#intro-entrance-4',
              intro: t('查看我的权限近况，权限近况一览无遗'),
              position: 'top'
            },
            {
              element: '#intro-entrance-5',
              intro: t('查看已发起的权限申请单——支持催办哦'),
              position: 'right'
            },
            {
              element: '#intro-entrance-6',
              intro: t(
                '查看我需要审批的申请单<br/>1、表格可通过「表格设置」进行配置， 想看什么就看什么<br/>2、批量操作不要太方便！'
              ),
              position: 'right'
            },
            {
              element: '#intro-entrance-7',
              intro: t(
                '查看我的使用中/将过期/已过期权限，在此可以申请权限延期哦'
              ),
              position: 'right'
            },
            {
              element: '#intro-entrance-8',
              intro: t('查看我的权限变更情况'),
              position: 'right'
            },
            {
              element: '#intro-entrance-9',
              intro: t('可通过系统和url定位到角色'),
              position: 'right'
            },
            {
              element: '#intro-entrance-10',
              intro: t(
                '输入系统即可查看对应系统管理员，权限申请相关的问题可以咨询管理员'
              ),
              position: 'right'
            },
            {
              element: '#intro-entrance-11',
              intro: t('更多UPM系统管理及接入指引可到文档中心查看'),
              position: 'bottom'
            },
            {
              element: '#intro-entrance-12',
              intro: t('在使用上遇到问题欢迎咨询信息安全小助手哦'),
              position: 'bottom'
            },
            {
              element: '#intro-entrance-13',
              intro: t('欢迎给UPM的使用体验打分，您的反馈是我们改进的动力！'),
              position: 'left'
            }
          ]
        })
        .start()
        .onexit(() => {
          // 点击“跳过”逻辑
          if (!this.introCompleted && !postIntroVisible) {
            // this.setState({
            //   maskVisible: false
            // });
            this.props.dispatch({
              type: 'entrance/save',
              payload: { maskVisible: false }
            });
            // 设置引导页“关闭状态”，1、触发菜单“小工具”收起，2、触发“nps反馈弹窗”收起，3、触发右下角“新手指引”提示，展示5s
            this.props.dispatch({
              type: 'userInfo/save',
              payload: { introEntranceShow: false }
            });
            // 回到页面顶部
            this.container = document.querySelector(
              '.upm-main-layout__container__content'
            );
            this.container.scrollTo(0, 0);
          }
        })
        .oncomplete(() => {
          //dispatch有延迟，导致onexit拿不到最新值，通过introComplete这个flag进行辅助判断
          this.introCompleted = true;
          this.props.dispatch({
            type: 'entrance/save',
            payload: { postIntroVisible: true }
          });
          // this.setState({
          //   postIntroVisible: true
          // });
        });
    }
    if (postIntroVisible) {
      // this.setState({
      //   postIntroVisible: false,
      //   maskVisible: false
      // });
      this.props.dispatch({
        type: 'entrance/save',
        payload: { postIntroVisible: false, maskVisible: false }
      });
      // 设置引导页“关闭状态”，1、触发菜单“小工具”收起，2、触发“nps反馈弹窗”收起，3、触发右下角“新手指引”提示，展示5s
      this.props.dispatch({
        type: 'userInfo/save',
        payload: {
          introEntranceShow: false
        }
      });
      // 回到页面顶部
      this.container = document.querySelector(
        '.upm-main-layout__container__content'
      );
      this.container.scrollTo(0, 0);
    }
  };

  render() {
    const { maskVisible, preIntroVisible, postIntroVisible } = this.props;
    const {
      t,
      list,
      availableApps,
      dataApplying,
      dataExpiring,
      dataExpired,
      dataChanged,
      dataApprove,
      dataReview,
      dataManage,
      dataTeam,
      modules,
      dispatch
    } = this.props;
    const { records } = list;
    const tabList = [
      {
        key: 'apply',
        tab: t('我的最近申请')
      },
      {
        key: 'approval',
        tab: t('待审批的申请')
      }
    ];
    const contentList = {
      apply: <MyRecentApply {...this.props} />,
      approval: (
        <ApproveTable
          datas={list}
          onChange={this.handlePageChange}
          onShowDetail={this.handleShowDetail}
          onPass={this.handlePass}
          onReject={this.handleReject}
          onBatchOption={this.handleBatchOption}
        />
      )
    };

    const sys = (
      <Menu>
        {availableApps.slice(0, 10).map(app => {
          return (
            <Menu.Item
              onClick={() => this.handleSysClick(app.id, app.name)}
              value={app.id}
              key={app.id}>
              {app.name}
            </Menu.Item>
          );
        })}
      </Menu>
    );

    if (records && records.length > 0) {
      records.map(item => {
        return (item.applyTypeName = t(item.applyTypeName));
      });
    }

    // console.log(modules);
    // const modules = [];

    return (
      <div className="entrance-page" ref={this.setContainer}>
        <div
          className={`mask ${maskVisible ? 'pre-animation' : 'post-animation'}`}
          // className={`mask ${maskVisible ? 'pre-animation' : ''}`}
          onClick={this.toggleIntro}>
          <div
            className="pre-intro"
            style={{ display: preIntroVisible ? 'block' : 'none' }}>
            <img
              className="img"
              src={require('../../assets/pre-intro.png')}
              alt="引导页前置图"
            />
            <div className="text">
              <h1 className="title">欢迎来到UPM！</h1>
              <p className="tooltip">
                UPM是滴滴内部的统一权限管控平台，您可以在这里查看自己的权限状况、
                申请新权限，或者把自己的系统接入UPM，实现账号权限的统一管控
              </p>
            </div>
          </div>
          <div
            className="post-intro"
            style={{ display: postIntroVisible ? 'block' : 'none' }}>
            <img
              className="img-post"
              src={require('../../assets/post-intro.png')}
              alt="引导页后置图"
            />
            <div className="text">
              <p className="tooltip">现在开始体验 UPM 吧！</p>
              <img
                className="img-line"
                src={require('../../assets/post-intro-line.png')}
                alt="引导页引线图"
              />
              <div>
                <Button
                  className="enter-button"
                  type="dashed"
                  size="large"
                  ghost>
                  进入
                </Button>
              </div>
            </div>
            {/* <p className="tooltip">
              欢迎给UPM的使用体验打分，您的反馈是我们改进的动力！
              现在开始体验UPM吧！
            </p> */}
          </div>
        </div>
        <div className="entrance-page__shortcuts">
          <div id="intro-entrance-1" className="entrance-page__shortcuts--oper">
            <li className="entrance-page__shortcuts--oper__li">
              <img src={require('../../assets/apply_new.png')}></img>
              <Button
                className="entrance-page__shortcuts--oper__li__button"
                type="primary"
                onClick={this.goNewApply}>
                {t('申请新权限')}
              </Button>
            </li>
            <li className="entrance-page__shortcuts--oper__li">
              <img src={require('../../assets/apply_libao.png')}></img>
              <Button
                className="entrance-page__shortcuts--oper__li__button"
                type="primary"
                onClick={this.goPackageApply}>
                {t('申请礼包权限')}
              </Button>
            </li>
          </div>
          <div className="entrance-page__shortcuts--oper">
            <li
              id="intro-entrance-2"
              className="entrance-page__shortcuts--oper__li">
              <img src={require('../../assets/apply_jieruupm.png')}></img>
              <Button
                className="entrance-page__shortcuts--oper__li__button"
                type="primary"
                onClick={this.goAccessUpm}>
                {t('申请接入UPM')}
              </Button>
            </li>
            <li className="entrance-page__shortcuts--oper__li">
              <img src={require('../../assets/apply_manager.png')}></img>
              <Button
                className="entrance-page__shortcuts--oper__li__button"
                type="primary"
                onClick={this.goSystemApply}>
                {t('申请系统管理员')}
              </Button>
            </li>
          </div>
        </div>
        {modules.length > 0 ? (
          <div className="entrance-page__affairs" id="intro-entrance-3">
            <Panel title={t('我的待办/管理事项')}>
              {_.includes(modules, 1) ? (
                <PanelItem
                  className="entrance-approve"
                  title={t('待审批列表')}
                  icon=""
                  onClick={() => {
                    trackEvent(MAIN_PAGE_VIEW_APPROVE_DETAIL);
                    dispatch(routerRedux.push(MAIN + '/approve'));
                  }}
                  detailText={t('查看详情')}>
                  <PanelLabel
                    label={t('待审批数')}
                    value={dataApprove.toApproveCount}
                  />
                  <PanelLabel
                    label={t('最长等待时间')}
                    value={dataApprove.longestWaitTime}
                    formatter={this.timeFormatter}
                    content={t('待审批列表中等待时长最久的审批单')}
                  />
                  <PanelLabel
                    label={t('平均审批时长')}
                    value={dataApprove.avgApproveTime}
                    formatter={this.timeFormatter}
                    content={t('迄今为止所有已完成审批单的平均审批时长')}
                  />
                </PanelItem>
              ) : null}
              {_.includes(modules, 2) ? (
                <PanelItem
                  className="entrance-review"
                  title={t('待Review权限列表')}
                  icon=""
                  onClick={() => {
                    trackEvent(MAIN_PAGE_VIEW_REVIEW_DETAIL);
                    dispatch(routerRedux.push(MAIN + '/review'));
                  }}
                  detailUrl=""
                  detailText={t('查看详情')}>
                  <PanelLabel
                    label={t('待Review列表数')}
                    value={dataReview.toReviewCount}
                  />
                  <PanelLabel
                    label={t('临到期Review')}
                    value={dataReview.expiringReviewName}
                    content={t('待review列表中最快到期的review表单')}
                  />
                  <PanelLabel
                    label={t('剩余时间')}
                    value={dataReview.remainDays}
                    formatter={value => value + t('天')}
                    content={t('待review列表中最快到期的review表单所剩余时间')}
                  />
                </PanelItem>
              ) : null}
              {_.includes(modules, 3) ? (
                <PanelItem
                  className="entrance-manage"
                  title={t('我的系统管理')}
                  icon=""
                  onClick={this.handleManageDetail}
                  detailUrl=""
                  detailText={t('查看详情')}>
                  <PanelLabel
                    label={t('系统名称')}
                    value={
                      <Dropdown
                        overlay={sys}
                        overlayStyle={{
                          maxHeight: '100px',
                          overflow: 'auto',
                          boxShadow: '#CCCCCC 0px 2px 16px 0px'
                        }}
                        trigger={['click']}>
                        <span style={{ cursor: 'pointer' }}>
                          {this.sysName()}
                          <Icon type="down" />
                        </span>
                      </Dropdown>
                    }
                  />
                  <PanelLabel
                    label={t('角色申请冗余度')}
                    value={dataManage.redundancy}
                    content={
                      <div style={{ maxWidth: '300px' }}>
                        {t(
                          '系统中的角色权限超过半年未被申请，即为角色申请冗余，整体此类角色占全部角色的比例即为冗余度'
                        )}
                      </div>
                    }
                  />
                  <PanelLabel
                    label={t('平均申请时长')}
                    value={dataManage.avgApplyTime}
                    formatter={this.timeFormatter}
                    content={t('该系统近7天的平均申请完成时长')}
                  />
                </PanelItem>
              ) : null}
            </Panel>
          </div>
        ) : null}

        <div className="entrance-page__permissions" id="intro-entrance-4">
          <Panel title={t('我的权限近况')}>
            <PanelItem
              className="entrance-applying"
              title={t('申请中权限')}
              onClick={() => {
                trackEvent(MAIN_PAGE_VIEW_APPLY_DETAIL);
                dispatch(routerRedux.push(MAIN + '/apply'));
              }}
              detailText={t('查看详情')}>
              <PanelLabel label={t('角色数')} value={dataApplying.roleCount} />
              <PanelLabel label={t('地区数')} value={dataApplying.areaCount} />
              <PanelLabel
                label={t('标识位数')}
                value={dataApplying.flagCount}
              />
              <PanelLabel
                label={t('工作簿数')}
                value={dataApplying.tableauWorkBookCount}
              />
              <PanelLabel
                label={t('指标数')}
                value={dataApplying.indicatorCoun}
              />
              <PanelLabel
                label={t('报表数')}
                value={dataApplying.reportCount}
              />
              <PanelLabel
                label={t('模板数')}
                value={dataApplying.extractionToolCount}
              />
            </PanelItem>
            <PanelItem
              className="entrance-expiring"
              title={t('近30天到期权限')}
              onClick={() => {
                trackEvent(MAIN_PAGE_VIEW_EXPIRE_DETAIL);
                dispatch(routerRedux.push(MAIN + '/permission-expiring'));
              }}
              detailText={t('查看详情')}>
              <PanelLabel label={t('角色数')} value={dataExpiring.roleCount} />
              <PanelLabel label={t('地区数')} value={dataExpiring.areaCount} />
              <PanelLabel
                label={t('标识位数')}
                value={dataExpiring.flagCount}
              />
              <PanelLabel
                label={t('工作簿数')}
                value={dataExpiring.tableauWorkBookCount}
              />
              <PanelLabel
                label={t('指标数')}
                value={dataExpiring.indicatorCoun}
              />
              <PanelLabel
                label={t('报表数')}
                value={dataExpiring.reportCount}
              />
              <PanelLabel
                label={t('模板数')}
                value={dataExpiring.extractionToolCount}
              />
            </PanelItem>
            <PanelItem
              className="entrance-expired"
              title={t('已到期权限')}
              onClick={() => {
                trackEvent(MAIN_PAGE_VIEW_EXPIRED_DETAIL);
                dispatch(routerRedux.push(MAIN + '/permission-expired'));
              }}
              detailText={t('查看详情')}>
              <PanelLabel label={t('角色数')} value={dataExpired.roleCount} />
              <PanelLabel label={t('地区数')} value={dataExpired.areaCount} />
              <PanelLabel label={t('标识位数')} value={dataExpired.flagCount} />
              <PanelLabel
                label={t('工作簿数')}
                value={dataExpired.tableauWorkBookCount}
              />
              <PanelLabel
                label={t('指标数')}
                value={dataExpired.indicatorCoun}
              />
              <PanelLabel label={t('报表数')} value={dataExpired.reportCount} />
              <PanelLabel
                label={t('模板数')}
                value={dataExpired.extractionToolCount}
              />
            </PanelItem>
            <PanelItem
              className="entrance-changed"
              title={t('近30天变更权限')}
              onClick={() => {
                trackEvent(MAIN_PAGE_VIEW_CHANGE_DETAIL);
                dispatch(routerRedux.push(MAIN + '/changelog'));
              }}
              detailText={t('查看详情')}>
              <PanelLabel label={t('角色数')} value={dataChanged.roleCount} />
              <PanelLabel label={t('地区数')} value={dataChanged.areaCount} />
              <PanelLabel label={t('标识位数')} value={dataChanged.flagCount} />
              <PanelLabel
                label={t('工作簿数')}
                value={dataChanged.tableauWorkBookCount}
              />
              <PanelLabel
                label={t('指标数')}
                value={dataChanged.indicatorCoun}
              />
              <PanelLabel label={t('报表数')} value={dataChanged.reportCount} />
              <PanelLabel
                label={t('模板数')}
                value={dataChanged.extractionToolCount}
              />
            </PanelItem>
          </Panel>
        </div>
        <Modal
          title="静默权限审计功能上线了~"
          visible={this.state.visible}
          onCancel={this.ModalHandleClose}
          footer={[
            <Button key="submit" type="primary" onClick={this.ModalHandleClose}>
              关闭
            </Button>
          ]}>
          <p>
            根据权限管理要求，用户权限需要做到最小化。针对某些用户申请权限后，长时间不使用的问题，我们增加了静默权限审计功能。该功能将审核用户的权限，超过90天没有使用过的权限，将被回收。
          </p>
          <p>
            存量权限将在该功能上线之日（2020/05/28）凌晨1：00进行集中回收。后续将以天为单位，持续对静默权限进行审计与回收。
          </p>
          <p>
            权限回收记录可在【变更日志】功能，进行查看。如有其它疑问，可联系“信息安全小助手”进行咨询。
          </p>
          <br />
          <p>谢谢您的支持</p>
        </Modal>
      </div>
    );
  }
}

export default translate()(
  connect(({ entrance, global, approveList }) => {
    return {
      ...entrance,
      ...approveList,
      ...global
    };
  })(Entrance)
);
