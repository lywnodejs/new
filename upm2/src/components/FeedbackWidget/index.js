/**
 * 反馈浮窗小工具
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  message,
  Icon,
  Rate,
  Checkbox,
  Select,
  Divider,
  Row,
  Col,
  Popover,
  Button
} from 'antd';
import { postJSON } from '@utils/request';
import request from '@utils/request';
import connect from '@utils/translateConnect';
import './index.css';

const qrcodeImg = require('@assets/dchat-qrcode.png');

import uaParser from '@utils/uaParser.js';

class FeedbackWidget extends Component {
  constructor(props) {
    super(props);

    const { t } = props;
    this.state = {
      appId: undefined,
      fbType: t('反馈问题'), // 反馈类型
      fbContent: '', // 反馈内容
      nps: 0, // NPS 分数
      reasons: [],
      params: {
        reasons: []
      },
      lowReasons: [],
      highReasons: [],
      expectTime: '',
      introPopoverVisible: false,
      introToggleButtonVisible: false,
      submitButtonLoading: false
    };

    this.fbFormVisible = false; // NPS 调研表单
  }
  componentDidMount() {
    // 根据路由，展示/隐藏 “引导页入口”,可根据不同页面打开，对应引导页
    const { routing, prefix } = this.props;
    this.isShowIntroToggleButton(routing, prefix);
    //NPS
    let { npsAutoOpen } = this.props;
    if (npsAutoOpen) {
      npsAutoOpen = true;
    } else {
      npsAutoOpen = false;
    }
    // NPS 调研自动打开
    if (npsAutoOpen) {
      request('/nps/feedback/shouldDisplay').then(res => {
        if (res) {
          this.toggleFeedbackForm();
          postJSON('/nps/feedback/recordDisplay');
        }
      });
    }

    // 获取原因列表
    // request('/nps/feedback/lowReason?appId=888').then((res) => {
    //   // Promise.resolve([{
    //   //   id: 0,
    //   //   name: '审批慢'
    //   // }, {
    //   //   id: 1,
    //   //   name: '界面丑'
    //   // }, {
    //   //   id: 2,
    //   //   name: '操作复杂'
    //   // }, {
    //   //   id: 3,
    //   //   name: '指引太少'
    //   // }, {
    //   //   id: -1,
    //   //   name: '其他'
    //   // }]).then((res) => {
    //   if (res && res.length) {
    //     this.setState({
    //       reasons: res,
    //       lowReasons: res
    //     })
    //   }
    // })

    // 获取高分原因列表
    request('/nps/getReasons?feedbackType=1&positive=true').then(res => {
      if (res && res.length) {
        this.setState({
          highReasons: res
        });
      }
    });

    // 获取低分原因列表
    request('/nps/getReasons?feedbackType=1&positive=false').then(res => {
      if (res && res.length) {
        this.setState({
          lowReasons: res
        });
      }
    });
    // ebot 暂不支持 HTTPS，先下掉
    // const RobotSDKReady = function (readyCallback) {
    //   if(readyCallback && typeof readyCallback == 'function'){
    //     if(window.__robot_front_sdk__ && typeof window.__robot_front_sdk__ === 'object'){
    //       readyCallback();
    //     }else{
    //       document.addEventListener('RobotSDKReady', function() {
    //         readyCallback();
    //       }, false);
    //     }
    //   }
    // };

    // RobotSDKReady(() => {
    //   window.__robot_front_sdk__.init({
    //     id: '7836a1ac4252468595f413569918c39e', //机器人id
    //     username: 'zhangjinlong', // 用户名
    //     show: false, // 是否显示开关小图标
    //     theme: '#547bfa', // 对话框、链接等颜色设置
    //     sdkRight: 40, // 机器人对话框距离网页右边的距离
    //     sdkBottom: 20, // 机器人对话框距离网页底部的距离
    //     iconRight: 0, // 右侧图标距离网页右边的距离
    //     iconBottom: 0, // 右侧图标距离网页底部的距离
    //     width: 400, // 对话框宽度
    //     height: 610, // 对话框高度
    //   });
    // });
  }
  componentWillReceiveProps(nextProps) {
    // 根据路由，展示/隐藏 “引导页入口”,可根据不同页面打开，对应引导页
    const { routing, prefix } = nextProps;
    this.isShowIntroToggleButton(routing, prefix);
    // 根据entrance首页，引导页展示状态，打开或收起“nps反馈弹窗”
    if (
      nextProps.userInfo.introEntranceShow !=
      this.props.userInfo.introEntranceShow
    ) {
      if (nextProps.userInfo.introEntranceShow) {
        this.toggleFeedbackForm();
      } else {
        this.toggleFeedbackForm();
        // 关闭entrance首页引导页后，给出提示5秒
        this.setState(
          {
            introPopoverVisible: true
          },
          () => {
            setTimeout(() => {
              this.setState({
                introPopoverVisible: false
              });
            }, 5000);
          }
        );
      }
    }
  }
  isShowIntroToggleButton = (routing, prefix) => {
    const { pathname } = routing.location;
    const path = pathname.split(prefix)[1];
    if (path === '' || path === '/newapply') {
      this.setState({
        introToggleButtonVisible: true
      });
    } else {
      this.setState({
        introToggleButtonVisible: false
      });
    }
  };

  selectOpt = e => {
    const target = e.target;
    let opt = target.options[target.selectedIndex].text;
    this.setState({
      fbType: opt
    });
  };
  inputContent = e => {
    let txt = e.target.value;
    this.setState({
      fbContent: txt
    });
  };
  submitFeedback = () => {
    const { t } = this.props;
    const { fbContent, nps, appId, params, expectTime } = this.state;
    // if (!appId) {
    //   message.destroy();
    //   return message.error(t('请选择常用系统'));
    // }
    if (nps == 0) {
      return message.error(t('请打分后再提交'));
    }
    if (nps <= 3 && !params.reasons.length) {
      message.destroy();
      return message.error(t('请至少选择一个理由'));
    }
    if (
      params.reasons.indexOf(0) > -1 &&
      (fbContent.trim() == '' || fbContent == '')
    ) {
      return message.error(t('其他理由不能为空且不能只有空格'));
    }
    if (params.reasons.indexOf(1) > -1 && expectTime == '') {
      return message.error(t('勾选审批慢时请填写理想审批时长'));
    }
    if (
      params.reasons.indexOf(1) > -1 &&
      Number(expectTime).toString() == 'NaN'
    ) {
      return message.error(t('理想审批时长必须为数字'));
    }
    this.setState({
      submitButtonLoading: true
    });
    let str = nps <= 3 ? '期望审批时间' + expectTime + 'h' : '';
    if (params.reasons.indexOf(1) == -1) str = '';
    const postData = {
      grade: nps + '',
      feedbackContent:
        params.reasons.indexOf(0) == -1 ? '' + str : fbContent + str,
      appId,
      reasonValue: params.reasons
    };
    postJSON('/nps/feedback/sub', postData)
      .then(() => {
        message.success(t('提交反馈成功'));

        this.setState({
          appId: undefined,
          fbContent: '',
          expectTime: '',
          nps: 0,
          params: {
            reasons: []
          }
        });
        this.toggleFeedbackForm();
      })
      .catch(error => {
        message.error(t('提交反馈失败'));
      })
      .finally(() => {
        this.setState({
          submitButtonLoading: false
        });
      });
  };
  // toggleRobot = () => {
  //   const npsPanel = document.querySelector('.fb-widget .upm-feedback');
  //   npsPanel.style.display = 'none';
  //   this.fbFormVisible = false;

  //   let robotOpened = window.__robot_front_sdk__.getStatus();
  //   if (!robotOpened) {
  //     window.__robot_front_sdk__.open();
  //   } else {
  //     window.__robot_front_sdk__.close();
  //   }
  //   robotOpened = !robotOpened;
  // }
  toggleFeedbackForm = () => {
    // if (window.__robot_front_sdk__) {
    //   window.__robot_front_sdk__.close();
    // }

    const npsPanel = document.querySelector('.fb-widget .upm-feedback');
    if (!npsPanel) return;
    if (!this.fbFormVisible) {
      // 打开
      npsPanel.style.display = 'block';
    } else {
      // 关闭
      window.localStorage.setItem('npsStartTime', new Date().getTime());
      npsPanel.style.display = 'none';
    }
    this.fbFormVisible = !this.fbFormVisible;
  };
  selectNPS = nps => {
    const { lowReasons, highReasons } = this.state;
    const reasons = nps <= 3 ? [...lowReasons] : [...highReasons];
    const index = reasons.findIndex(item => item.reasonValue == 1);
    if (index > -1) {
      reasons[index].isShow = false;
    }
    this.setState({
      nps,
      fbContent: '',
      expectTime: '',
      params: {
        reasons: []
      },
      reasons
    });
  };
  onReasonChange = reasonList => {
    let { reasons } = this.state;
    const index = reasons.findIndex(item => item.reasonValue == 1);
    if (reasonList.indexOf(1) > -1) {
      reasons[index].isShow = true;
    } else {
      if (index > -1) reasons[index].isShow = false;
      this.setState({
        expectTime: ''
      });
    }
    this.setState({
      params: {
        ...this.state.params,
        reasons: reasonList
      },
      reasons
    });
  };
  changeAppId = appId => {
    this.setState({
      appId
    });
  };
  changeExpectTime = e => {
    this.setState({
      expectTime: e.target.value
    });
  };
  handleMouseEnterOnNpsToggleButton = () => {
    this.setState({
      introPopoverVisible: true
    });
  };
  handleMouseLeaveOnNpsToggleButton = () => {
    this.setState({
      introPopoverVisible: false
    });
  };
  /**
   * 开启引导页
   * 根据不同页面，打开对应引导页
   */
  startIntro = () => {
    const { routing, prefix } = this.props;
    const { pathname } = routing.location;
    const path = pathname.split(prefix)[1];
    if (path === '') {
      this.props.dispatch({
        type: 'userInfo/save',
        payload: { introEntranceShow: true }
      });
      this.props.dispatch({
        type: 'entrance/save',
        payload: { maskVisible: true, preIntroVisible: true }
      });
    } else if (path === '/newapply') {
      this.props.dispatch({
        type: 'userInfo/save',
        payload: { introApplyNewShow: true }
      });
    }
  };
  render() {
    const { t, apps } = this.props;
    const {
      nps,
      reasons,
      params,
      appId,
      introPopoverVisible,
      submitButtonLoading,
      introToggleButtonVisible
    } = this.state;
    const desc = ['非常不满意', '不太满意', '一般', '满意', '非常满意'];
    const reasonsOpts = reasons.map(item => {
      return {
        isShow: item.isShow || false,
        label: item.reason,
        value: item.reasonValue
      };
    });
    if (uaParser.isMobile()) {
      // 不支持移动版
      return null;
    }

    return (
      <div className="fb-widget">
        <ul>
          {/* <li className="robot">
            <a href="http://e.xiaojukeji.com/robot/7836a1ac4252468595f413569918c39e" target="_blank">
              <div className="icon-wrap">
                <svg viewBox="64 64 896 896" className="" data-icon="question-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path></svg>
              </div>
            </a>
            <div className="gap"></div>
          </li> */}
          <li
            className="dingding"
            style={{
              display: introToggleButtonVisible ? 'list-item' : 'none'
            }}>
            <Popover
              content={t('点击此处可再次查看新手指引噢！')}
              title={null}
              // trigger="hover"
              overlayClassName="nps-toggle-button-popover"
              placement="leftBottom"
              visible={introPopoverVisible}>
              <div
                className="icon-wrap"
                onClick={this.startIntro}
                onMouseEnter={this.handleMouseEnterOnNpsToggleButton}
                onMouseLeave={this.handleMouseLeaveOnNpsToggleButton}>
                {/* <Icon type="step-forward" /> */}
                <svg
                  // viewBox="64 64 896 896"
                  viewBox="0 0 1024 1024"
                  className=""
                  data-icon="qrcode"
                  width="1.1em"
                  height="1.1em"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                    d="M804.535 914.275q0-14.847-10.848-25.727t-25.727-10.847-25.727 10.847-10.848 25.727 10.848 25.728 25.727 10.847 25.727-10.847 10.848-25.728z m73.15-436.53q0-107.997-95.421-107.997-14.848 0-32 2.848-9.151-17.151-30.015-27.135t-42.014-10.015-39.423 10.271q-28.575-30.27-67.998-30.27-14.271 0-31.71 5.727t-27.136 14.272V146.299q0-29.727-21.727-51.422T438.818 73.15q-29.15 0-51.134 22.271t-22.015 50.846V475.41q-11.424 0-27.712-8.576t-31.423-18.847-38.846-18.847-48.287-8.576q-38.27 0-55.71 25.44t-17.44 66.013q0 13.728 79.422 51.422 25.151 13.728 37.15 21.152 36.576 22.847 82.846 63.998 46.27 40.574 60.574 57.726 32.575 39.423 32.575 79.997v18.272h365.717V786.31q0-41.15 18.271-95.42t36.575-110.557 18.272-102.557z m73.15-2.88q0 75.998-39.423 183.994-33.727 93.725-33.727 127.42V950.85q0 30.271-21.44 51.71t-51.71 21.44H438.818q-30.27 0-51.71-21.44t-21.44-51.71V786.28q0-5.728-2.56-12.288t-8-13.44-10.27-12.863-12.864-13.728-12.288-11.712-12.288-10.847-9.727-8q-42.271-37.15-73.726-57.15-12-7.424-35.423-18.848t-41.15-21.15-36-23.136-28.287-31.423-10.015-39.711q0-71.422 38.27-118.012t107.997-46.559q38.847 0 73.15 12.576V146.267q0-59.422 43.423-102.844T438.178 0Q498.176 0 541.6 43.135t43.423 103.132v96.573q35.423 2.272 67.998 21.152 12-1.728 24.575-1.728 57.726 0 101.725 34.27 79.421-0.575 125.436 48.575t46.014 129.724z"
                    p-id="726"
                    fill="#737373"></path>
                </svg>
              </div>
            </Popover>
          </li>
          <li className="feedback">
            <div className="icon-wrap" onClick={this.toggleFeedbackForm}>
              <svg
                viewBox="64 64 896 896"
                className=""
                data-icon="smile"
                width="1.1em"
                height="1.1em"
                fill="currentColor"
                aria-hidden="true">
                <path d="M288 421a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm352 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zM512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm263 711c-34.2 34.2-74 61-118.3 79.8C611 874.2 562.3 884 512 884c-50.3 0-99-9.8-144.8-29.2A370.4 370.4 0 0 1 248.9 775c-34.2-34.2-61-74-79.8-118.3C149.8 611 140 562.3 140 512s9.8-99 29.2-144.8A370.4 370.4 0 0 1 249 248.9c34.2-34.2 74-61 118.3-79.8C413 149.8 461.7 140 512 140c50.3 0 99 9.8 144.8 29.2A370.4 370.4 0 0 1 775.1 249c34.2 34.2 61 74 79.8 118.3C874.2 413 884 461.7 884 512s-9.8 99-29.2 144.8A368.89 368.89 0 0 1 775 775zM664 533h-48.1c-4.2 0-7.8 3.2-8.1 7.4C604 589.9 562.5 629 512 629s-92.1-39.1-95.8-88.6c-.3-4.2-3.9-7.4-8.1-7.4H360a8 8 0 0 0-8 8.4c4.4 84.3 74.5 151.6 160 151.6s155.6-67.3 160-151.6a8 8 0 0 0-8-8.4z"></path>
              </svg>
            </div>
            <div className="gap"></div>
            <div className="upm-feedback panel" id="intro-entrance-13">
              <span className="icon-close" onClick={this.toggleFeedbackForm}>
                <Icon type="close" />
              </span>
              <Divider />
              <div>
                <span>{t('请为本次UPM使用体验打分：')}</span>

                <div className="nps-rate">
                  <Rate
                    defaultValue={0}
                    tooltips={desc}
                    value={nps}
                    count={5}
                    style={{ fontSize: 50 }}
                    onChange={this.selectNPS}
                  />
                  <Row style={{ fontSize: 12 }}>
                    <Col span={5}>{t('非常不满意')}</Col>
                    <Col span={5}>{t('不太满意')}</Col>
                    <Col span={4}>{t('一般')}</Col>
                    <Col span={5}>{t('满意')}</Col>
                    <Col span={5}>{t('非常满意')}</Col>
                  </Row>
                </div>
              </div>
              <p style={{ margin: '10px 0' }}>
                {t('您最常用的子系统是') + ':'}
              </p>
              <Select
                value={appId}
                style={{ width: '100%' }}
                placeholder={t('输入关键字检索')}
                showSearch
                allowClear
                optionFilterProp="children"
                onChange={this.changeAppId}
                onSearch={value => {
                  this.setState({ searchValue: value });
                }}>
                {apps.map((item, index) => {
                  return (
                    <Select.Option key={index} value={item.appId}>
                      {item.appName}
                    </Select.Option>
                  );
                })}
              </Select>
              {nps != 0 &&
                (nps <= 3 ? (
                  <div>
                    <p
                      style={{ margin: '10px 0' }}
                      className="ant-form-item-required">
                      {t('您给低分的理由是(多选)')}
                    </p>
                    <Checkbox.Group
                      value={params.reasons}
                      defaultValue={[]}
                      onChange={this.onReasonChange}>
                      <Row>
                        {reasonsOpts.map(item => {
                          return !item.isShow ? (
                            <Col key={item.value}>
                              <Checkbox value={item.value} key={item.value}>
                                {item.label}
                              </Checkbox>
                            </Col>
                          ) : (
                            <Col key={item.value}>
                              <Checkbox value={item.value} key={item.value}>
                                {t('审批慢，理想审批时长为')}
                                <input
                                  type="text"
                                  style={{
                                    width: '30px',
                                    border: '0',
                                    borderBottom: '1px solid #000',
                                    textAlign: 'center'
                                  }}
                                  onChange={this.changeExpectTime}></input>
                                {t('h')}
                              </Checkbox>
                            </Col>
                          );
                        })}
                      </Row>
                    </Checkbox.Group>
                  </div>
                ) : (
                  <div>
                    <p style={{ margin: '10px 0' }}>
                      {t('请为本次体验做出评价(多选)：')}
                    </p>
                    <Checkbox.Group
                      value={params.reasons}
                      options={reasonsOpts}
                      defaultValue={[]}
                      onChange={this.onReasonChange}
                    />
                  </div>
                ))}
              {params.reasons.indexOf(0) > -1 ? (
                <textarea
                  value={this.state.fbContent}
                  onChange={this.inputContent}
                  placeholder={t('您认为UPM系统还有哪些可以改进的地方？')}
                  cols="30"
                  rows="4"></textarea>
              ) : null}
              <p style={{ margin: '10px 0' }}>
                {t('您的反馈是我们改进的动力！')}
              </p>
              <div className="options-wrapper">
                <Button
                  type="primary"
                  className="submit-button"
                  loading={submitButtonLoading}
                  onClick={this.submitFeedback}>
                  {t('提交反馈')}
                </Button>
              </div>
            </div>
          </li>
          <li className="dingding">
            <div className="icon-wrap">
              <svg
                viewBox="64 64 896 896"
                className=""
                data-icon="qrcode"
                width="1.1em"
                height="1.1em"
                fill="currentColor"
                aria-hidden="true">
                <path d="M468 128H160c-17.7 0-32 14.3-32 32v308c0 4.4 3.6 8 8 8h332c4.4 0 8-3.6 8-8V136c0-4.4-3.6-8-8-8zm-56 284H192V192h220v220zm-138-74h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm194 210H136c-4.4 0-8 3.6-8 8v308c0 17.7 14.3 32 32 32h308c4.4 0 8-3.6 8-8V556c0-4.4-3.6-8-8-8zm-56 284H192V612h220v220zm-138-74h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm590-630H556c-4.4 0-8 3.6-8 8v332c0 4.4 3.6 8 8 8h332c4.4 0 8-3.6 8-8V160c0-17.7-14.3-32-32-32zm-32 284H612V192h220v220zm-138-74h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm194 210h-48c-4.4 0-8 3.6-8 8v134h-78V556c0-4.4-3.6-8-8-8H556c-4.4 0-8 3.6-8 8v332c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V644h78v102c0 4.4 3.6 8 8 8h190c4.4 0 8-3.6 8-8V556c0-4.4-3.6-8-8-8zM746 832h-48c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm142 0h-48c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path>
              </svg>
            </div>
            <div className="gap"></div>
            <div className="ding-qrcode panel">
              <h4>{t('账号权限答疑群')}</h4>
              <img src={qrcodeImg} />
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

FeedbackWidget.defaultProps = {
  npsAutoOpen: true // 默认自动打开
};

FeedbackWidget.propTypes = {
  npsAutoOpen: PropTypes.bool // NPS 调研自动打开
};

export default connect(({ routing, global, userInfo }) => {
  return {
    routing,
    apps: global.apps,
    userInfo
  };
})(FeedbackWidget);
