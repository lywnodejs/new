/**
 * 用户管理页 上的 角色（组）编辑
 * 比如：给某用户 直接在管理端增加权限（角色）
 */

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Button, message } from 'antd';

import connect from '@utils/translateConnect';
import ContentCard from '@components/ContentCard';
import { saveRef } from '@components/util';
import ApplyForm from '../../../main/NewApply/ApplyForm';

import './index.less';

class RoleEditor extends React.Component {
  componentDidMount() {
    const { match, dispatch, params } = this.props;
    let { appId, userId, username } = match.params;
    appId = +appId;
    userId = +userId;

    // 如果appId、username有变化，则重新拉取值
    if (params.appId !== appId || params.username !== username) {
      dispatch({
        type: 'newApply/fetchAllDataOnUser',
        payload: {
          appId: +appId,
          userId: +userId,
          username
        }
      });

      dispatch({
        type: 'newApply/fetchRoleList',
        payload: { appId }
      });
    }
  }

  handleFormChange = values => {
    const { dispatch } = this.props;
    const { role } = values;
    // 修改了roles，则联动获取角色策略
    if (role) {
      dispatch({
        type: 'newApply/fetchStrategyList',
        payload: { role }
      });
    }

    dispatch({
      type: 'newApply/updateParams',
      payload: values
    });
  };

  handleSubmit = (/* params */) => {
    const {
      dispatch,
      history,
      t,
      match,
      params: { strategy },
      strategyList,
      ...others
    } = this.props;
    const { userId } = match.params;

    // 去除角色策略验证
    // let isStrategyOk = false;
    // if (!strategyList || strategyList.length === 0) {
    //   isStrategyOk = true;
    // } else {
    //   // 存在不需要配置的策略直接可以提交
    //   isStrategyOk = _.some(
    //     strategyList,
    //     item => item.tagDimeList.length === 0
    //   );

    //   if (!isStrategyOk) {
    //     _.each(strategyList, ({ roleId, tagDimeList }) => {
    //       _.each(tagDimeList, ({ tag, dimeDtoList }) => {
    //         _.each(dimeDtoList, d => {
    //           // 只要 策略类型中 一个维度 填写了就可以提交
    //           if (
    //             strategy[roleId] &&
    //             strategy[roleId][tag.id] &&
    //             !_.isEmpty(strategy[roleId][tag.id][d.id])
    //           ) {
    //             isStrategyOk = true;
    //             return false;
    //           }
    //         });
    //       });
    //     });
    //   }
    // }

    // if (!isStrategyOk) {
    //   message.destroy();
    //   message.warning(t('请编辑策略后，再提交申请！'));
    //   return;
    // }

    dispatch({
      type: 'newApply/addRoleWithoutApply',
      payload: { userId }
    }).then(({ success, result }) => {
      // console.log(success, result);

      message.destroy();
      if (success) {
        // 提示成功，2秒后，跳转走
        message.success(t('绑定成功'), 2, () => {
          history.goBack();
          dispatch({
            type: 'newApply/reset'
          });
        });
      } else {
        message.error(result, 5);
      }
    });
  };

  render() {
    const {
      params,
      roleOptions,
      strategyList,
      dimensionIdMap,
      loading,
      t
    } = this.props;

    const formValue = {
      ...params
    };

    return (
      <ContentCard title={t('用户角色策略管理')}>
        <div className="account-role-editor">
          <ApplyForm
            ref={saveRef(this, 'applyForm')}
            useAvailableApps
            value={formValue}
            onChange={this.handleFormChange}
            handleSubmit={this.handleSubmit}
            roleOptions={roleOptions}
            strategyList={strategyList}
            dimensionIdMap={dimensionIdMap}
            loading={loading}
            moreButtons={
              <Button
                className="new-apply-form-button"
                onClick={() => {
                  this.props.history.goBack();
                }}>
                {t('取消')}
              </Button>
            }
            showRole
            disabledAppId
            disabledApplyForOthers
            disabledReason
            disabledResourceType
          />
        </div>
      </ContentCard>
    );
  }
}

export default connect(({ newApply }) => {
  return {
    ...newApply
  };
})(RoleEditor);
