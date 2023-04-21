import React from 'react';
import connect from '@utils/translateConnect';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { MAIN } from '@routes/config';
import { Popconfirm, Button, Affix } from 'antd';
import SearchSysAdmin from '@components/SearchSysAdmin';
import CBreadcrumb from '@components/Breadcrumb';
import { trackEvent } from '@utils/omega';
import ContentCard from '../../../components/ContentCard';
import SheetDetail from '../../../components/SheetDetail';
import './index.less';

import { APPLY_PAGE_VIEW_CONSULIT } from '@config/omega';

class ApplyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.cachedParams = null;
    this.container = null;
  }

  componentDidMount() {
    this.container = document.querySelector(
      '.upm-main-layout__container__content'
    );
    const { location, match, dispatch } = this.props;
    // 判断是否由 申请列表页面 跳转过来
    if (location.query) {
      // 由 申请列表页面 跳转过来，存下原页面参数
      this.cachedParams = location.query.cachedParams;
    }
    const { applyId } = match.params;

    if (applyId) {
      dispatch({
        type: 'applyDetail/fetch',
        payload: { applyId }
      }).then(() => {
        const { applyDetail } = this.props;
        const { detail } = applyDetail;
        const { applyUser,workflowApplyDto } = detail;
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
              applyId: applyId
            }
          });
      });
    }
  }

  onOk = () => {
    const { match, dispatch } = this.props;
    const { applyId } = match.params;
    dispatch({
      type: 'applyList/recall',
      payload: {
        applyId
      }
    }).then(() => {
      setTimeout(() => {
        dispatch(routerRedux.push(MAIN));
      }, 1500);
    });
  };

  getButtons = () => {
    const { t, applyDetail } = this.props;
    const { detail } = applyDetail;
    if (_.isEmpty(detail)) {
      return null;
    }

    const { workflowApplyDto } = detail;
    const { status } = workflowApplyDto;

    const recallButton =
      status === 1 ? (
        <Popconfirm
          title={t('确定撤回此申请吗？')}
          okText={t('确定')}
          cancelText={t('取消')}
          onConfirm={this.onOk}
          className="status-button">
          <Button type="primary">{t('撤回')}</Button>
        </Popconfirm>
      ) : null;

    return (
      <div className="block-content">
        {recallButton}
        <Button
          style={{ marginLeft: '8px' }}
          onClick={() => {
            let url = `${MAIN}/apply`;
            let routerParams = {
              pathname: url
            };
            // 判断是否由 申请列表页面 跳转过来
            if (this.cachedParams) {
              // 由申请列表页面跳转过来，跳回带上原页面参数
              routerParams.query = {
                cachedParams: this.cachedParams
              };
            }
            this.props.dispatch(routerRedux.push(routerParams));
          }}>
          {t('返回')}
        </Button>
      </div>
    );
  };

  render() {
    const { global, applyDetail, applyArea, t, dispatch } = this.props;
    const { detail } = applyDetail;
    const breadcrumbProps = {
      data: [
        // {
        //   text: t('首页'),
        //   url: `${MAIN}`
        // },
        {
          text: t('我的申请'),
          url: `${MAIN}/apply`
        },
        {
          text: t('申请详情')
        }
      ],
      dispatch
    };

    let status = undefined;
    if (detail && detail.workflowApplyDto) {
      status = detail.workflowApplyDto.status;
    }

    // 申请状态
    let approveStatus = null;
    if (status !== undefined) {
      if (status === 2) {
        approveStatus = (
          <span style={{ color: 'green', fontSize: '16px', marginRight: 10 }}>
            （{t('已通过')}）
          </span>
        );
      }
      if (status === 3) {
        approveStatus = (
          <span style={{ color: 'red', fontSize: '16px', marginRight: 10 }}>
            ({t('已驳回')})
          </span>
        );
      }
      if (status === 4) {
        approveStatus = (
          <span style={{ color: 'red', fontSize: '16px', marginRight: 10 }}>
            ({t('已撤回')})
          </span>
        );
      }
    }
    const titleComp = (
      <span>
        {t('申请详情')}
        {approveStatus}
      </span>
    );
    return (
      <div className="apply-detail-container">
        <div className="float-window">
          <SearchSysAdmin
            onClick={() => trackEvent(APPLY_PAGE_VIEW_CONSULIT)}
            btnText={
              <span>
                {t('申请有疑问？请咨询 ')}
                <a href="" className="upm-warning">
                  {t('系统管理员')}
                </a>
              </span>
            }
            placement="bottomRight"
            appId={detail.workflowApplyDto && detail.workflowApplyDto.appId}
            clearable={false}
            disabled>
            {/* <span className="upm-warning">{t('审批流环节异常？无法审批？请联系系统管理员报错')}</span> */}
          </SearchSysAdmin>
        </div>
        <CBreadcrumb {...breadcrumbProps} />
        <div className="detail-header">
          <span className="title">{titleComp}</span>
          <span className="support">
            <Affix offsetTop={16} target={() => this.container}>
              {this.getButtons()}
            </Affix>
          </span>
        </div>
        <SheetDetail
          global={global}
          data={applyDetail}
          applyArea={applyArea}
          t={t}
          isApply
          workflowInfo={this.props.workflowInfo}
        />
        {/* <ContentCard
          className="apply-detail"
          title={titleComp}
          t={t}
          titleButton={this.getButtons()}>
          <SheetDetail
            global={global}
            data={applyDetail}
            applyArea={applyArea}
            t={t}
            isApply
            workflowInfo={this.props.workflowInfo}
          />
        </ContentCard> */}
      </div>
    );
  }
}

export default connect(({ global, applyDetail, applyArea, workflow }) => {
  return {
    // 根据表单id，获取对应的文本信息，比如选择的系统id，获取对应的系统名
    global,
    applyDetail,
    applyArea,
    workflowInfo: workflow.workflowInfo
  };
})(ApplyDetail);
