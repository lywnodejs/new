import React from 'react';
import connect from '@utils/translateConnect';
import { routerRedux } from 'dva/router';
import { MAIN } from '@routes/config';
import _ from 'lodash';
import { message, Modal, Button, Spin, Icon, Collapse, Steps } from 'antd';
const { Panel } = Collapse;
const { Step } = Steps;

import { BIG_DATA_APP_ID } from '@config/bigData';
import ContentCard from '../../../components/ContentCard';
import { saveRef } from '../../../components/util';
import ApplyForm from './ApplyForm';

import './index.less';

// 根据标识符来动态获取id
const getIdByIdentifying = (list, identifying) => {
  const data = _.filter(list, item => item.identifying == identifying)[0];
  return data ? data.id : -1;
};

class NewApply extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisiable: false
    };
  }

  componentWillMount() {
    // 从快速申请跳转过来
    if (
      location.search !== '' &&
      location.search.indexOf('appId') > 0 &&
      location.search.indexOf('id') > 0
    ) {
      const { dispatch } = this.props;
      const arr = location.search
        .split('?')[1]
        .split('&')
        .map(i => i.split('=')[1]);
      const appId = Number(arr[0]);
      const id = Number(arr[1]);

      dispatch({
        type: 'newApply/fetchResourceType',
        payload: { appId }
      });

      dispatch({
        type: 'newApply/setToStrategyApp',
        payload: { appId, id }
      }).then(() => {
        dispatch({
          type: 'newApply/fetchRoleList',
          payload: { appId }
        }).then(() => {
          dispatch({
            type: 'newApply/setToStrategyRole',
            payload: { id }
          }).then(() => {
            dispatch({
              type: 'newApply/fetchFastApplyToStrategyList'
            }).then(role => {
              dispatch({
                type: 'newApply/fetchStrategyList',
                payload: { role }
              });
            });
          });
        });
      });

      return;
    }

    const { match, dispatch } = this.props;
    const { resourceType, resourceKey, appId } = match.params;

    // 从大数据跳转到UPM
    if (resourceType && resourceKey && appId) {
      this.setState({
        showIcon: true
      });

      dispatch({
        type: 'newApply/fetchInitialFieldsValue',
        payload: { appId, type: resourceType, resourceKey }
      }).then(() => {
        const { initialFieldsValue } = this.props;
        const { typeId, resourceName, resourceId } = initialFieldsValue;
        Promise.all([
          dispatch({
            type: 'newApply/fetchResourceType',
            payload: { appId }
          }),
          this.handleFetchResource({ resourceTypeId: typeId, appId })
        ]).then(() => {
          dispatch({
            type: 'newApply/updateParams',
            payload: {
              appId,
              resourceType: typeId,
              resource: [{ label: resourceName, value: resourceId }]
            }
          });
        });
      });
    } else {
      const { params } = this.props;
      const { appId } = params;
      if (appId) {
        dispatch({
          type: 'newApply/fetchResourceType',
          payload: { appId }
        });
      }
    }
  }

  handleFormChange = values => {
    const { dispatch, params, resourceTypeList } = this.props;
    const { appId, role, resourceType } = values;

    // 如果修改了appId，则联动获取ResourceType
    if (appId) {
      dispatch({
        type: 'newApply/fetchResourceType',
        payload: { appId }
      });

      // 控制帮助按钮显示
      this.setState({
        showIcon: !!BIG_DATA_APP_ID[appId]
      });
    }

    // 如果修改了resourceType, 则联动获取资源
    if (resourceType) {
      if (resourceType == getIdByIdentifying(resourceTypeList, 'role')) {
        dispatch({
          type: 'newApply/fetchRoleList',
          payload: { appId: params.appId }
        });
      } else {
        this.handleFetchResource({
          appId: params.appId,
          resourceTypeId: resourceType,
          size: 10
        });
      }
    }

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
    const { dispatch, strategyList, params, t } = this.props;
    const { strategy } = params;
    // 去除角色策略验证
    // 校验策略是否已经填写完毕
    // let isStrategyOk = true;
    // 方法1：深入遍历 表单数据，挨个层遍历数据是否已经填写完毕
    /*
    _.each(strategyList, ({ roleId, tagDimeList }) => {
      // 校验 每个角色 的策略是否都填写了
      if (_.isEmpty(strategy[roleId])) {
        isStrategyOk = false;
        return false;
      }

      _.each(tagDimeList, ({ tag, dimeDtoList }) => {
        // 校验 策略的每个类型 是否都填写了
        if (_.isEmpty(strategy[roleId][tag.id])) {
          isStrategyOk = false;
          return false;
        }

        _.each(dimeDtoList, d => {
          // 校验 策略类型中 每个维度 是否都填写了
          if (_.isEmpty(strategy[roleId][tag.id][d.id])) {
            isStrategyOk = false;
            return false;
          }
        });
      });
    });
    */
    // HACK 方法2：
    // 因为jsx 父子组件的嵌套关系，已经形成了多层循环遍历
    // 且在最后的子节点上，可以判断出来最深层数据是否已经填写
    // 所以在这里直接通过 DOM 来直接找是否存在未填写完毕的DOM类，如果存在，则不通过
    // const formDOM = ReactDOM.findDOMNode(this.applyForm);
    // if (!_.isEmpty(formDOM.querySelector('.empty-dimension-value'))) {
    //   isStrategyOk = false;
    // }

    // if (!_.isEmpty(strategyList)) {
    //   // NOTE 2018-4-25 改变策略验证逻辑，只要有任何一个策略维度有值就可以提交
    //   isStrategyOk = !_.isEmpty(strategy);
    // }

    // if (!isStrategyOk) {
    //   message.destroy();
    //   message.warning(t('请编辑策略后，再提交申请！'));
    //   return;
    // }

    dispatch({
      type: 'newApply/addApply'
    }).then(({ success, result }) => {
      message.destroy();
      if (success) {
        // 提示成功，2秒后，跳转走
        message.success(t('申请成功'), 2, () => {
          dispatch(routerRedux.push(`${MAIN}/apply`));
          dispatch({
            type: 'newApply/reset'
          });
        });
      } else {
        message.error(result, 5);
      }
    });
  };

  // 获取审批流程，并打开审批流的弹窗
  handleCheckWorkflow = () => {
    const { params, dispatch, userInfo, t, resourceTypeList } = this.props;
    const {
      appId,
      role,
      username,
      isApplyForOthers,
      resourceType,
      resource
    } = params;
    const applyTypeIsRole =
      resourceType == getIdByIdentifying(resourceTypeList, 'role') ||
      !resourceType;

    if (isApplyForOthers && _.isEmpty(username)) {
      message.destroy();
      message.warning(t('还没有填写申请人'));
      return;
    }

    if (applyTypeIsRole) {
      if (_.isEmpty(role)) {
        message.destroy();
        message.warning(t('还没有选择要申请的角色'));
        return;
      }
      dispatch({
        type: 'newApply/fetchWorkflow',
        payload: {
          appId,
          role,
          username: isApplyForOthers ? username : userInfo.username
        }
      }).then(() => {
        this.setState({
          modalVisiable: true
        });
      });
    } else {
      if (_.isEmpty(resource)) {
        message.destroy();
        message.warning(t('还没有选择要申请的资源'));
        return;
      }
      dispatch({
        type: 'newApply/fetchWorkflow',
        payload: {
          appId,
          resource,
          username: isApplyForOthers ? username : userInfo.username
        }
      }).then(() => {
        this.setState({
          modalVisiable: true
        });
      });
    }
  };

  // 关闭审批流的弹窗
  hideWorkflow = () => {
    this.setState({
      modalVisiable: false
    });
  };

  // 获取大数据平台相关报表资源
  handleFetchResource = params => {
    const { dispatch } = this.props;
    // const { dispatch, resourceTypeList } = this.props;
    // const type = params.resourceTypeId == getIdByIdentifying(resourceTypeList, 'role')?'newApply/fetchRoleList':'newApply/fetchResourceList';

    dispatch({
      type: 'newApply/fetchResourceList',
      // type,
      payload: { params }
    });
  };

  render() {
    const {
      params,
      roleOptions,
      strategyList,
      dimensionIdMap,
      workflow,
      loading,
      userInfo,
      enumMap,
      t,
      resourceTypeList,
      resourceList,
      initialFieldsValue,
      page
    } = this.props;

    // TODO 申请理由 不实时 同步给store，暂存state（实时同步，会使用户输入变卡）
    // componentWillUnmount 时去同步？
    const formValue = {
      ...params
    };
    // console.log(params)
    // formValue.resourceType = params.resourceType || formValue.applyTypeName
    // 默认使用 用户自己，即给自己申请
    if (!formValue.isApplyForOthers) {
      formValue.username = userInfo.username;
    }

    return (
      <ContentCard title={t('申请新权限')}>
        <div className="new-apply">
          <ApplyForm
            ref={saveRef(this, 'applyForm')}
            value={formValue}
            userInfo={userInfo}
            initialFieldsValue={initialFieldsValue}
            roleOptions={roleOptions}
            strategyList={strategyList}
            resourceTypeList={resourceTypeList}
            resourceList={resourceList}
            dimensionIdMap={dimensionIdMap}
            onChange={this.handleFormChange}
            handleSubmit={this.handleSubmit}
            handleFetchResource={this.handleFetchResource}
            loading={loading}
            showIcon={this.state.showIcon}
            current={page}
            moreButtons={
              <Button
                className="new-apply-form-button"
                onClick={this.handleCheckWorkflow}>
                {t('查看审批流程')}
              </Button>
            }
          />

          {/* 审批流的查看 */}
          <Modal
            title={t('审批流')}
            visible={this.state.modalVisiable}
            maskClosable={false}
            onCancel={this.hideWorkflow}
            width="90%"
            wrapClassName="new-apply-modal-wrapper"
            footer={
              <Button type="primary" onClick={this.hideWorkflow}>
                {t('确定')}
              </Button>
            }>
            <Spin
              spinning={loading.loadingWorkflow}
              indicator={<Icon type="loading" style={{ fontSize: 30 }} />}
              size="large">
              <Collapse>
                {_.map(workflow, ({ userName, workflowInfos }) => (
                  <Panel
                    key={userName}
                    header={t('{{ username }}的审批流', {
                      username: userName
                    })}>
                    {_.map(
                      workflowInfos,
                      ({ id, name, roles, roleGroups, steps }) => {
                        let panelHeader;
                        if (roles && roles[0] !== null) {
                          const roleNames = _.map(
                            roles,
                            ({ nameZh }) => nameZh
                          );
                          const roleGroupNames = _.map(
                            roleGroups,
                            ({ nameZh }) => nameZh
                          );

                          panelHeader =
                            _.join([...roleNames, ...roleGroupNames], ',') +
                            `-${name}`;
                        } else {
                          panelHeader = name;
                        }

                        return (
                          <Collapse key={id} bordered={false}>
                            <Panel header={panelHeader}>
                              <Steps className="workflow-steps">
                                {_.map(steps, (step, stepIndex) => (
                                  <Step
                                    key={stepIndex}
                                    status="wait"
                                    title={t(
                                      enumMap.workflowenums.stepType[step.type]
                                    )}
                                    description={_.map(
                                      step.approveUsers,
                                      ({ accountName }) => {
                                        return accountName;
                                      }
                                    ).join(',')}
                                  />
                                ))}
                              </Steps>
                            </Panel>
                          </Collapse>
                        );
                      }
                    )}
                  </Panel>
                ))}
              </Collapse>
            </Spin>
          </Modal>
        </div>
      </ContentCard>
    );
  }
}

export default connect(({ newApply, userInfo, global }) => {
  return {
    ...newApply,
    userInfo: userInfo,
    enumMap: global.enumMap
  };
})(NewApply);
