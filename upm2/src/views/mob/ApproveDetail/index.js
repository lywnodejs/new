import React from 'react';
import connect from '@utils/translateConnect';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { Button, Input, message } from 'antd';
import { MAIN, MOB } from '@routes/config';
import ContentCard from '../../../components/ContentCard';
import SheetDetail from '../../../components/SheetDetail';
// import CBreadcrumb from '@components/Breadcrumb';
import { startRecordApproveTime } from '@utils/stat.js';
import uaParser from '@utils/uaParser.js';
import { MAIN as MOBILE } from '@/entry/mobile/routes/config';

import './index.less';
const { TextArea } = Input;

class ApproveDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      approveReason: ''
    };
  }

  componentWillMount() {
    this.getPageData();
  }
  componentDidMount() {
    // 开始审批打点
    startRecordApproveTime();
  }

  getPageData = () => {
    const { match, dispatch } = this.props;
    const { approveId } = match.params;

    if (approveId) {
      dispatch({
        type: 'approveDetail/fetch',
        payload: { approveId }
      }).then(() => {
        const { approveDetail } = this.props;
        const { detail } = approveDetail;
        const { workflowApplyDto } = detail;
        const { appId, businessId } = workflowApplyDto;
        dispatch({
          type: 'applyArea/getAreas',
          payload: {
            appId,
            businessId
          }
        });
        // 获取bpm流
        workflowApplyDto.bpmProcessId &&
          dispatch({
            type: 'workflow/getWorkflowInfo',
            payload: {
              applyId: workflowApplyDto.id
            }
          });
      });
    }
  };

  approveReasonChange = e => {
    this.setState({
      approveReason: e.target.value
    });
  };

  onOk = () => {
    const { t, match, dispatch } = this.props;
    const { approveId } = match.params;
    const { approveReason } = this.state;

    dispatch({
      type: 'approveList/passApprove',
      payload: {
        id: approveId,
        reason: approveReason || '同意'
      }
    }).then(() => {
      // TODO 将页面整合为单页面或者重构详情页
      message.success(t('审批成功！'), 2.5).then(() => this.goBack());
      // this.getPageData();
    });
  };

  onNotOk = () => {
    const { t, match, dispatch } = this.props;
    const { approveId } = match.params;
    const { approveReason } = this.state;
    if (_.isEmpty(approveReason)) {
      message.warning(t('请输入驳回申请的理由！'));
      return;
    }

    dispatch({
      type: 'approveList/rejectApprove',
      payload: {
        id: approveId,
        reason: approveReason
      }
    }).then(() => {
      this.getPageData();
    });
  };

  goBack = () => {
    // let url = `${MAIN}/approve`;
    // if (uaParser.isMobile()) { // 移动版
    //   url = `${MOB}/main`;
    // }
    // this.props.dispatch( routerRedux.push(url) );

    const url = MOBILE;

    window.location = url;
  };
  getButton = () => {
    const { t, approveDetail } = this.props;
    const { detail } = approveDetail;

    if (_.isEmpty(detail)) {
      return null;
    }

    const { workflowApplyDto } = detail;
    const { status } = workflowApplyDto;

    const recallButton =
      status === 1
        ? [
            <Button key="0" type="primary" onClick={this.onOk}>
              {t('通过')}
            </Button>,
            <Button key="1" onClick={this.onNotOk}>
              {t('驳回')}
            </Button>
          ]
        : null;

    // 审批说明
    let applyRemark =
      status === 1 ? (
        <div>
          <span className="shortcut-title">{t('审批说明')}</span>
          <TextArea
            autosize
            className="shortcut-approve-input"
            value={this.state.approveReason}
            onChange={this.approveReasonChange}
            placeholder={t(
              '请输入审批说明：（通过默认理由为：同意，驳回操作必须填写理由）'
            )}
          />
        </div>
      ) : null;

    return (
      <div className="shortcut-wrapper">
        {applyRemark}
        {recallButton}
        <Button key="2" onClick={this.goBack}>
          {t('返回')}
        </Button>
      </div>
    );
  };

  render() {
    const { global, approveDetail, applyArea, t, dispatch } = this.props;

    const { detail } = approveDetail;
    let status = undefined;
    if (detail && detail.workflowApplyDto) {
      status = detail.workflowApplyDto.status;
    }

    const breadcrumbProps = {
      data: [
        {
          text: t('首页'),
          url: `${MAIN}`
        },
        {
          text: t('审批列表'),
          url: `${MAIN}/approve`
        },
        {
          text: t('审批详情')
        }
      ],
      dispatch
    };

    // 审批状态
    let approveStatus = null;
    if (status !== undefined) {
      if (status === 2) {
        approveStatus = (
          <span style={{ color: 'green', marginRight: 10 }}>
            ({t('已通过')})
          </span>
        );
      }
      if (status === 3) {
        approveStatus = (
          <span style={{ color: 'red', marginRight: 10 }}>({t('已驳回')})</span>
        );
      }
      if (status === 4) {
        approveStatus = (
          <span style={{ color: 'red', marginRight: 10 }}>({t('已撤回')})</span>
        );
      }
    }

    const titleComp = (
      <span>
        {t('审批详情')} {approveStatus}
      </span>
    );

    return (
      <div>
        {/* <CBreadcrumb {...breadcrumbProps} /> */}
        <ContentCard
          className="approve-detail"
          title={titleComp}
          titleButton={this.getButton()}>
          <SheetDetail
            global={global}
            data={approveDetail}
            applyArea={applyArea}
            t={t}
            workflowInfo={this.props.workflowInfo}
          />
        </ContentCard>
      </div>
    );
  }
}

export default connect(({ global, approveDetail, applyArea, workflow }) => {
  return {
    // 根据表单id，获取对应的文本信息，比如选择的系统id，获取对应的系统名
    global,
    approveDetail,
    applyArea,
    workflowInfo: workflow.workflowInfo
  };
})(ApproveDetail);
