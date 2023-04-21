/**
 * 反馈浮窗小工具
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  message,
  Rate,
  Checkbox,
  Divider,
  Modal,
  Row,
  Col,
  Button
} from 'antd';
import { postJSON } from '@utils/request';
import request from '@utils/request';
import connect from '@utils/translateConnect';
import './index.css';
import uaParser from '@utils/uaParser.js';
class ApplyFeedbackWidget extends Component {
  constructor(props) {
    super(props);

    const { t } = props;
    this.state = {
      appId: undefined,
      fbType: t('反馈问题'), // 反馈类型
      fbContent: '', // 反馈内容
      nps: 0, // NPS 分数
      reasons: [],
      visible: false,
      params: {
        reasons: []
      },
      submitUrl: '', // 提交反馈接口
      modalTitle: '', // 弹窗title
      applyHighReasons: [], // 申请反馈高分原因列表
      applyLowReasons: [], // 申请反馈低分原因列表
      approveHighReasons: [], // 审批反馈高分原因列表
      approveLowReasons: [], // 审批反馈低分原因列表
      expectTime: '',
      submitButtonLoading: false
    };
  }
  componentDidMount() {
    this.context.router.history.listen(() => {
      if (location.pathname == '/upm2-static/main/apply') {
        // 获取申请反馈原因列表
        Promise.all([
          // 获取高分原因列表
          request('/nps/getReasons?feedbackType=2&positive=true').then(res => {
            if (res && res.length) {
              this.setState({
                applyHighReasons: res
              });
            }
          }),
          // 获取低分原因列表
          request('/nps/getReasons?feedbackType=2&positive=false').then(res => {
            if (res && res.length) {
              this.setState({
                applyLowReasons: res
              });
            }
          })
        ]).then(() => {
          this.setState({
            submitUrl: '/apply/feedback/sub',
            modalTitle: '请为本次UPM申请体验打分：'
          });
        });
        this.refreshShow();
      }
      if (
        location.pathname == '/upm2-static/main/approve' ||
        location.pathname.indexOf('/upm2-static/main/approve/approve-detail/') >
          -1
      ) {
        // 获取审批反馈原因列表
        Promise.all([
          // 获取高分原因列表
          request('/nps/getReasons?feedbackType=3&positive=true').then(res => {
            if (res && res.length) {
              this.setState({
                approveHighReasons: res
              });
            }
          }),
          // 获取低分原因列表
          request('/nps/getReasons?feedbackType=3&positive=false').then(res => {
            if (res && res.length) {
              this.setState({
                approveLowReasons: res
              });
            }
          })
        ]).then(() => {
          this.setState({
            submitUrl: '/approve/feedback/sub',
            modalTitle: '请为本次UPM审批体验打分：'
          });
        });
      }
    });
  }

  //审批完成后是否打开反馈弹窗
  componentWillReceiveProps(nextProps) {
    // if (nextProps.visible === this.props.visible) return;
    this.setState({
      visible: nextProps.visible
    });
  }

  //是否展示申请反馈弹窗
  refreshShow = () => {
    request('/apply/feedback/shouldDisplay').then(res => {
      if (res) {
        this.toggleFeedbackForm();
      }
    });
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
    const { fbContent, nps, appId, params, submitUrl, expectTime } = this.state;
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
    if (params.reasons.indexOf(7) > -1 && expectTime == '') {
      return message.error(t('勾选审批慢时请填写理想审批时长'));
    }
    if (
      params.reasons.indexOf(7) > -1 &&
      Number(expectTime).toString() == 'NaN'
    ) {
      return message.error(t('理想审批时长必须为数字'));
    }
    this.setState({
      submitButtonLoading: true
    });
    let str = nps <= 3 ? '期望审批时间' + expectTime + 'h' : '';
    if (params.reasons.indexOf(7) == -1) str = '';
    const postData = {
      grade: nps + '',
      feedbackContent:
        params.reasons.indexOf(0) == -1 ? '' + str : fbContent + str,
      appId,
      reasonValue: params.reasons
    };
    postJSON(submitUrl, postData)
      .then(() => {
        message.success(t('提交反馈成功'));
        this.setState({
          appId: undefined,
          visible: false,
          fbContent: '',
          expectTime: '',
          nps: 0,
          params: {
            reasons: []
          }
        });
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
  toggleFeedbackForm = () => {
    this.setState({
      visible: true
    });
  };
  selectNPS = nps => {
    let npsType = '';
    if (
      location.pathname == '/upm2-static/main/approve' ||
      location.pathname.indexOf('/upm2-static/main/approve/approve-detail/') >
        -1
    ) {
      npsType = 'approve';
    }
    if (location.pathname == '/upm2-static/main/apply') {
      npsType = 'apply';
    }
    let reasons = null;
    if (nps <= 3) {
      reasons = npsType != '' ? [...this.state[npsType + 'LowReasons']] : [];
    } else {
      reasons = npsType != '' ? [...this.state[npsType + 'HighReasons']] : [];
    }
    const index = reasons.findIndex(item => item.reasonValue == 7);
    if (index > -1) {
      reasons[index].isShow = false;
    }

    this.setState({
      nps,
      expectTime: '',
      fbContent: '',
      params: {
        reasons: []
      },
      reasons
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  onReasonChange = reasonList => {
    let { reasons } = this.state;
    const index = reasons.findIndex(item => item.reasonValue == 7);

    if (reasonList.indexOf(7) > -1) {
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
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        createHref: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };
  changeExpectTime = e => {
    this.setState({
      expectTime: e.target.value
    });
  };

  render() {
    const { t, apps, match } = this.props;
    const {
      nps,
      reasons,
      params,
      appId,
      modalTitle,
      submitButtonLoading
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
      <div className="apply-fb-widget-bg">
        <Modal
          width={350}
          visible={this.state.visible}
          centered
          maskClosable={false}
          okText={t('提交反馈')}
          footer={null}
          onCancel={this.handleCancel}>
          <div className="apply-fb-widget">
            <ul>
              <li className="apply-feedback">
                <div className="apply-upm-feedback panel">
                  <Divider />
                  <div>
                    <span>{t(modalTitle)}</span>
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
                      cols="33"
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
            </ul>
          </div>
        </Modal>
      </div>
    );
  }
}
export default connect(({ global, approveList }) => {
  return {
    apps: global.apps,
    visible: approveList.visible
  };
})(ApplyFeedbackWidget);
