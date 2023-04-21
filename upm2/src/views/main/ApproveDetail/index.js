import React from 'react';
import connect from '@utils/translateConnect';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { Button, Modal, Input, Icon, message, Affix } from 'antd';
import { MAIN, MOB } from '@routes/config';
import ContentCard from '../../../components/ContentCard';
import SheetDetail from '../../../components/SheetDetail';
import CBreadcrumb from '@components/Breadcrumb';
import SearchSysAdmin from '@components/SearchSysAdmin';
import { startRecordApproveTime } from '@utils/stat.js';
import uaParser from '@utils/uaParser.js';
import { trackEvent } from '@utils/omega';

import { APPROVE_PAGE_VIEW_CONSULIT } from '@config/omega';

import './index.less';
const { TextArea } = Input;
let loading = false;

/**
 * 对于模版/报表/数据集类型的权限点，显示更多信息
 * @return {Boolean}
 */
const getShowMoreInfoOnPermissionPoint = applyType => {
  const showDetailPermissionPointTypeList = [8, 10, 16];
  return showDetailPermissionPointTypeList.includes(applyType);
};

class ApproveDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      approveReason: '',
      showMoreInfoOnPermissionPoint: false,
      affixed: false
    };
    this.cachedParams = null;
    this.container = null;
  }

  componentDidMount() {
    this.container = document.querySelector(
      '.upm-main-layout__container__content'
    );
    // 每次进入页面回到顶部
    setTimeout(() => {
      this.container.scrollTo(0, 0);
    }, 0);
    // 开始审批打点
    startRecordApproveTime();
    const { location } = this.props;
    // 判断是否由 审批列表页面 跳转过来
    if (location.query) {
      // 由 审批列表页面 跳转过来，存下原页面参数
      this.cachedParams = location.query.cachedParams;
    }
    this.getPageData();
  }

  getPageData = () => {
    const { match, dispatch } = this.props;
    const { approveId } = match.params;

    if (approveId) {
      if (uaParser.isMobile()) {
        // 移动版：phone, pad
        dispatch(routerRedux.push(`${MOB}/approve-detail/${approveId}`));
        return;
      }
      dispatch({
        type: 'approveDetail/fetch',
        payload: { approveId }
      }).then(() => {
        const { approveDetail } = this.props;
        const { detail } = approveDetail;
        const { applyUser, workflowApplyDto, applyRoleDtos } = detail;
        const { accountName } = applyUser;
        const { appId, businessId } = workflowApplyDto;
        dispatch({
          type: 'applyArea/getAreas',
          payload: {
            appId,
            businessId,
            applyUserName: accountName
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
        const showMoreInfoOnPermissionPoint = getShowMoreInfoOnPermissionPoint(
          workflowApplyDto.applyType
        );
        this.setState(
          {
            showMoreInfoOnPermissionPoint
          },
          () => {
            if (this.state.showMoreInfoOnPermissionPoint) {
              //属于模版/报表/数据集类型
              const params = {
                appId: workflowApplyDto.appId,
                resourceIds: applyRoleDtos.map(item => item.refId),
                page: 1, //获取初始化列表数据
                size: 10
              };
              dispatch({
                type: 'newApply/fetchResourceList',
                payload: { params }
              });
            }
          }
        );
      });
    }
  };

  approveReasonChange = e => {
    this.setState({
      approveReason: e.target.value
    });
  };

  /**
   * 通过审批单
   */
  passLevelReminder = () => {
    const { t, match, dispatch, approveDetail } = this.props;
    const { approveId } = match.params;
    const { approveReason } = this.state;
    if (loading) {
      return;
    }
    loading = true;
    return dispatch({
      type: 'approveList/passApprove',
      payload: {
        id: approveId,
        reason: approveReason || '同意'
      }
    }).then(result => {
      // 审批详情页点击通过，异常情况处理
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

        // 提示框逻辑
        function genContent() {
          return (
            <div>
              <p>
                {bpmExceptionType == 1 ? null : (
                  <span>
                    <b>{appName}</b>系统没有在<b>BPM</b>配置审批流
                  </span>
                )}
              </p>
              {bpmExceptionType == 1 ? (
                <div>
                  <p>
                    {t('编号：') + approveDetail.detail.workflowApplyDto.id ||
                      '-'}
                  </p>
                  <p>{errorMessage}</p>
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
                  {applyUserNameZh}，抱歉，检测到{appName}系统审批流出现异常
                </span>
              ) : (
                '权限申请提交失败'
              ),
            content: genContent(),
            okText: t('确定')
          });
        } else {
          message.error(result);
        }
      } catch (e) {
        if (typeof result !== 'string') {
          message.success(t('审批成功'));
        } else {
          message.error(result);
        }
      }

      dispatch({
        type: 'approveList/isShowFeedbackModal'
      });
      dispatch(routerRedux.push(`${MAIN}/approve`));
      loading = false;
    });
  };

  /**
   * C4数据触发提示
   */
  levelReminderModalToggle = () => {
    const { t, approveDetail } = this.props;
    const { detail } = approveDetail;
    const { workflowApplyDto } = detail;
    const { id } = workflowApplyDto;
    const self = this;
    Modal.confirm({
      title: t('是否继续？'),
      content: `${t('当前审批单')} ${id} ${t(
        '包含高敏感权限，为避免高敏感数据泄露，请谨慎审批'
      )}`,
      okText: t('继续'),
      cancelText: t('返回'),
      onOk() {
        // 返回Promise，加入loading
        return self.passLevelReminder();
      }
    });
  };

  onOk = () => {
    const { t } = this.props;
    const { approveReason } = this.state;
    if (approveReason.length>200) {
      message.error(t('审批说明最大支持200字符'));
      return;
    }
    try {
      const riskLevel = this.props.approveDetail.detail.workflowApplyDto
        .riskLevel;
      if (riskLevel == 4) {
        // C4数据提示谨慎操作
        this.levelReminderModalToggle();
      } else {
        this.passLevelReminder();
      }
    } catch (error) {
      message.error(t('获取审批单权限敏感级别失败'));
    }
  };

  onNotOk = () => {
    const { t, match, dispatch } = this.props;
    const { approveId } = match.params;
    const { approveReason } = this.state;
    if (_.isEmpty(approveReason)) {
      message.error(t('请输入驳回申请的理由'));
      return;
    } else if(approveReason.length>200) {
      message.error(t('审批说明最大支持200字符'));
      return;
    }

    dispatch({
      type: 'approveList/rejectApprove',
      payload: {
        id: approveId,
        reason: approveReason
      }
    }).then(() => {
      dispatch({
        type: 'approveList/isShowFeedbackModal'
      });
      this.getPageData();
    });
  };

  getButtons = () => {
    const { affixed } = this.state;
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
            <Button
              className="option-button"
              key="0"
              type="primary"
              onClick={this.onOk}>
              {t('通过')}
            </Button>,
            <Button className="option-button" key="1" onClick={this.onNotOk}>
              {t('驳回')}
            </Button>
          ]
        : null;

    // 审批说明
    let applyRemark =
      status === 1 ? (
        <div className="shortcut-remark">
          <span className="shortcut-title">{t('审批说明')}：</span>
          <Input
            className="shortcut-approve-input"
            value={this.state.approveReason}
            onChange={this.approveReasonChange}
            // placeholder={t(
            //   '请输入审批说明：（通过默认理由为：同意，驳回操作必须填写理由）'
            // )}
            placeholder={t('通过默认理由为：同意，驳回操作必须填写理由')}
          />
        </div>
      ) : null;

    return (
      <div
        className="shortcut-wrapper"
        style={{ 
          width: status === 1 ? '666px' : '64px',
          backgroundColor: affixed ? '#ffffff' : 'transparent'
        }}>
        {applyRemark}
        <div className="options-wrapper">
          {recallButton}
          <Button
            key="2"
            onClick={() => {
              let url = `${MAIN}/approve`;
              let routerParams = {
                pathname: url
              };
              // 判断是否由 审批列表页面 跳转过来
              if (this.cachedParams) {
                // 由审批列表页面跳转过来，跳回带上原页面参数
                routerParams.query = {
                  cachedParams: this.cachedParams
                };
              }
              this.props.dispatch(routerRedux.push(routerParams));
            }}>
            {t('返回')}
          </Button>
        </div>
      </div>
    );
  };

  handleChangeOnAffix = affixed => {
    this.setState({
      affixed
    });
  };

  render() {
    const { showMoreInfoOnPermissionPoint, affixed } = this.state;
    const { global, approveDetail, applyArea, t, dispatch } = this.props;

    const { detail } = approveDetail;
    let status = undefined;
    if (detail && detail.workflowApplyDto) {
      status = detail.workflowApplyDto.status;
    }

    const breadcrumbProps = {
      data: [
        {
          text: t('我的审批'),
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
      <div className="approve-detail-container">
        <div className="float-window">
          <SearchSysAdmin
            onClick={() => trackEvent(APPROVE_PAGE_VIEW_CONSULIT)}
            btnText={
              <span>
                {t('审批有疑问？不该我审批？请咨询 ')}
                <a href="" className="upm-warning">
                  {t('系统管理员')}
                </a>
              </span>
            }
            placement="bottomRight"
            appId={detail.workflowApplyDto && detail.workflowApplyDto.appId}
            clearable={false}
            disabled>
            <span className="upm-warning">
              {t('审批流环节异常？无法审批？请联系系统管理员报错')}
            </span>
          </SearchSysAdmin>
        </div>
        <CBreadcrumb {...breadcrumbProps} />
        <div className="detail-header">
          <span className="title">{titleComp}</span>
          <span className="support">
            <Affix
              offsetTop={16}
              target={() => this.container}
              onChange={this.handleChangeOnAffix}>
              {this.getButtons()}
            </Affix>
          </span>
        </div>
        <SheetDetail
          global={global}
          data={approveDetail}
          applyArea={applyArea}
          showMoreInfoOnPermissionPoint={showMoreInfoOnPermissionPoint}
          workflowInfo={this.props.workflowInfo}
        />
        {/* <ContentCard
          className="approve-detail"
          title={titleComp}
          titleButton={this.getButtons()}>
          <SheetDetail
            global={global}
            data={approveDetail}
            applyArea={applyArea}
            showMoreInfoOnPermissionPoint={showMoreInfoOnPermissionPoint}
            workflowInfo={this.props.workflowInfo}
          />
        </ContentCard> */}
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
