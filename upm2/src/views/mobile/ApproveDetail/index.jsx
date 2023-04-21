/*
 * @Author: GuoTeng
 * @Date: 2020-10-23 09:55:28
 * @LastEditors: GuoTeng
 * @LastEditTime: 2021-01-14 16:48:40
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { routerRedux } from 'dva/router';
import { isOversea } from '@config/env';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { translate } from 'react-i18next';
import {
  Badge,
  NavBar,
  ActionSheet,
  List,
  WingBlank,
  Steps,
  Modal,
  TextareaItem,
  Button,
  Toast,
  Icon,
  Tag,
  Flex
} from 'antd-mobile';
import { Row, Col, Tooltip, Table, Popover } from 'antd';
import { MAIN as MOBILE } from '@/entry/mobile/routes/config';
import './index.less';

const ListItem = List.Item;
const Step = Steps.Step;
const APPROVE_TYPE = {
  PASS: 'pass',
  REJECT: 'reject'
};
// 等级隐射
const levelMapping = {
  1: 'C1',
  2: 'C2',
  3: 'C3',
  4: 'C4'
};
/**
 * 对于模版/报表/数据集类型的权限点，显示更多信息
 * @return {Boolean}
 */
// const getShowMoreInfoOnPermissionPoint = applyType => {
//   const showDetailPermissionPointTypeList = [8, 10, 16];
//   return showDetailPermissionPointTypeList.includes(applyType);
// };
const formatTime = time => {
  return time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '-';
};

class ApproveDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // showMoreInfoOnPermissionPoint: false,
      height: (document.documentElement.clientHeight * 3) / 4, // 高度初始值
      modalVisible: false,
      approveType: APPROVE_TYPE.PASS,
      reason: ''
    };
    this.detailContent = React.createRef();
    this.detailFooter = React.createRef();
  }
  componentDidMount() {
    const { match, dispatch } = this.props;
    const { approveId } = match.params;
    if (approveId) {
      // 获取”审批详情“信息
      dispatch({
        type: 'approveDetail/fetch',
        payload: { approveId }
      }).then(() => {
        const { approveDetail } = this.props;
        const { detail } = approveDetail;
        const { applyUser, workflowApplyDto, applyRoleDtos } = detail;
        const { accountName } = applyUser;
        const { appId, businessId, status } = workflowApplyDto;
        // 获取“已有城市”信息
        dispatch({
          type: 'applyArea/getAreas',
          payload: {
            appId,
            businessId,
            applyUserName: accountName
          }
        });
        // 获取bpm流。移动端不显示bpm审批流
        // workflowApplyDto.bpmProcessId &&
        //   dispatch({
        //     type: 'workflow/getWorkflowInfo',
        //     payload: {
        //       applyId: workflowApplyDto.id
        //     }
        //   });

        // 对于数据资源，权限点显示更多信息。移动端不显示更多信息
        // const showMoreInfoOnPermissionPoint = getShowMoreInfoOnPermissionPoint(
        //   workflowApplyDto.applyType
        // );
        // this.setState(
        //   {
        //     showMoreInfoOnPermissionPoint
        //   },
        //   () => {
        //     if (this.state.showMoreInfoOnPermissionPoint) {
        //       //属于模版/报表/数据集类型
        //       const params = {
        //         appId: workflowApplyDto.appId,
        //         resourceIds: applyRoleDtos.map(item => item.refId),
        //         page: 1, //获取初始化列表数据
        //         size: 10
        //       };
        //       dispatch({
        //         type: 'newApply/fetchResourceList',
        //         payload: { params }
        //       });
        //     }
        //   }
        // );
        // 设置detailContent高度
        this.setState({
          /* eslint-disable react/no-find-dom-node */
          height:
            document.documentElement.clientHeight -
            ReactDOM.findDOMNode(this.detailContent.current).offsetTop -
            (status === 1
              ? ReactDOM.findDOMNode(this.detailFooter.current).offsetHeight
              : 0)
        });
      });
    }
  }

  /**
   * 获取审批状态
   * @param {object} workflowApplyDto
   */
  getApprovalStatus(workflowApplyDto, lastApproveUser) {
    const { status, bpmProcessId, result } = workflowApplyDto;
    const { username, usernameZh } = lastApproveUser || {};
    const { t } = this.props;
    let approvalStatus = null;
    let color = {
      color: 'red'
    };
    if (bpmProcessId && status == 3) {
      approvalStatus = (
        <span>
          {t('办理人')}：
          {usernameZh && username && `${usernameZh}<${username}>`}
          {/* <br />
          <span style={color}>
            {' '}
            {t('理由')}：{result}
          </span> */}
        </span>
      );
    }
    return approvalStatus;
  }

  /**
   * 返回
   */
  goBack = () => {
    // window.history.back();
    const url = MOBILE;
    this.props.dispatch(routerRedux.push(url));
  };

  /**
   * 操作成功后，回跳“审批列表”页面
   */
  redirectToMain = () => {
    const url = MOBILE;
    this.props.dispatch(routerRedux.push(url));
  };

  /**
   * 审批-调出操作面板
   */
  handleApprove = () => {
    const { t } = this.props;
    const BUTTONS = [t('通过'), t('驳回'), t('取消')];

    ActionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        maskClosable: true
      },
      index => {
        if (index === 0) {
          // 通过
          this.setState({
            modalVisible: true,
            approveType: APPROVE_TYPE.PASS,
            reason: '同意'
          });
        } else if (index === 1) {
          // 驳回
          this.setState({
            modalVisible: true,
            approveType: APPROVE_TYPE.REJECT
          });
        }
      }
    );
  };

  /**
   * 关闭操作面板
   */
  handleCloseOnModal = () => {
    this.setState({
      modalVisible: false
    });
  };
  /**
   * 关闭操作面板后的重置操作
   */
  handleAfterCloseOnModal = () => {
    this.setState({
      reason: ''
    });
  };

  /**
   * 审批理由绑定
   * @param {string} reason
   */
  handleChangeOnTextareaItem = reason => {
    this.setState({
      reason
    });
  };

  handlePass = () => {
    // 通过
    this.setState({
      modalVisible: true,
      approveType: APPROVE_TYPE.PASS,
      reason: '同意'
    });
  };
  handleReject = () => {
    // 驳回
    this.setState({
      modalVisible: true,
      approveType: APPROVE_TYPE.REJECT
    });
  };

  /**
   * 通过
   */
  pass = () => {
    const { t, match, dispatch } = this.props;
    const { approveId } = match.params;
    const { reason } = this.state;
    dispatch({
      type: 'approveList/passApprove',
      payload: {
        id: approveId,
        reason: reason || '同意'
      }
    }).then(() => {
      Toast.success(t('审批成功！'), 2, this.redirectToMain);
    });
  };

  /**
   * 驳回
   */
  reject = () => {
    const { t, match, dispatch } = this.props;
    const { approveId } = match.params;
    const { reason } = this.state;
    if (reason === '') {
      Toast.fail(t('请输入驳回申请的理由！'));
      return;
    }

    dispatch({
      type: 'approveList/rejectApprove',
      payload: {
        id: approveId,
        reason: reason
      }
    }).then(() => {
      Toast.success(t('审批成功！'), 2, this.redirectToMain);
    });
  };

  /**
   * 获取策略信息
   * @param {array} applyRoleDtos
   */
  getStrategyInfo(applyRoleDtos) {
    const { t } = this.props;

    const data = {};
    // 对后端返回的 展开式的数据 进行聚合，类似于group by
    _.each(
      applyRoleDtos,
      ({ refId, refName, strategyName, strategyId, dimeNodeList }) => {
        if (_.isNull(dimeNodeList) || !dimeNodeList.length) {
          // if (_.isNull(strategyId)) {
          //   return;
          // }
          return;
        }
        data[refId] = data[refId] || {
          id: refId,
          refNameOfRole: refName,
          label: strategyName,
          value: {}
        };
        const strategy = data[refId].value;

        _.each(
          dimeNodeList,
          ({ tagId, tagName, dimeId, dimeName, dimenodeName }) => {
            strategy[tagId] = strategy[tagId] || {
              id: tagId,
              label: tagName,
              value: {}
            };

            const tag = strategy[tagId].value;
            tag[dimeId] = tag[dimeId] || {
              id: dimeId,
              label: dimeName,
              value: []
            };
            const dimension = tag[dimeId].value;
            dimension.push(dimenodeName);
          }
        );
      }
    );

    if (_.isEmpty(data)) {
      return null;
    }

    return (
      <ListItem multipleLine>
        {t('申请策略信息')}
        {/* <div className="block-title">{t('申请策略信息')}</div> */}
        <div className="strategy-content">
          {_.map(data, strategy => {
            if (Object.keys(strategy.value).length === 0) {
              return null;
            }
            return (
              <div key={strategy.id} className="sheet-strategy">
                <div className="sheet-title-wrapper">
                  <span className="sheet-title">{t('名称')}</span>：
                  {`${strategy.refNameOfRole || '-'}（${strategy.label ||
                    '-'}）`}
                </div>
                {_.map(strategy.value, tag => (
                  <div key={tag.id} className="sheet-tag-wrapper">
                    <div className="sheet-tag-title">{`${t('策略类型')}：${
                      tag.label
                    }`}</div>
                    <div className="sheet-tag-content">
                      {_.map(tag.value, dimension => (
                        <div key={dimension.id} className="sheet-dimension">
                          <div className="sheet-dimension-title">
                            {dimension.label}：
                          </div>
                          <div className="sheet-dimension-content">
                            {_.map(dimension.value, dimenodeName => (
                              <Tag key={dimenodeName} disabled>
                                {dimenodeName}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </ListItem>
    );
  }

  /**
   * 获取bpm审批流
   * @param {*} data
   */
  getBpmChart(data) {
    const { bpmProcessId } = data;
    const { global = {}, workflowInfo } = this.props;

    // return bpmProcessId ? <ForecastGraph workflowInfo={workflowInfo} /> : null;
    return bpmProcessId ? <span>请在PC端进行查看</span> : null;
  }

  /**
   * 获取upm审批流
   * @param {*} status
   * @param {*} userArray
   * @param {*} step
   */
  getSteps(workflow) {
    const { global = {}, t, approveDetail } = this.props;
    const { workflowenums = {} } = global.enumMap || {};
    const { stepType = {} } = workflowenums;

    const getIconAndStatus = status => {
      // 默认 的step icon
      let icon = undefined;
      let stepStatus = 'wait';

      switch (status) {
        // 通过
        case 2:
          icon = <Icon type="check-circle" />;
          stepStatus = 'finish';
          break;
        // 驳回
        case 3:
          icon = <Icon type="close-circle" />;
          stepStatus = 'error';
          break;
        default:
          break;
      }

      return {
        icon,
        status: stepStatus
      };
    };

    const getTime = time => {
      return (
        <p className="workflow-timestamp">
          {moment(time).format('YYYY.MM.DD HH:mm')}
        </p>
      );
    };

    const getDescription = (status, userArray, step) => {
      const { approveWithProcessDtoList, approveUsers, type } = step;

      const userInfoMap = {};
      // 填充一个map，方便用户信息的查找
      _.each(approveUsers, userInfo => {
        userInfoMap[userInfo.accountName] = userInfo;
      });

      let result = undefined;
      // type == 8时 为并行审批
      if (status == 2 || status == 3 || type == 8) {
        result = _.map(userArray, (user, index) => {
          const userInfo = userInfoMap[user.username] || {};

          let resultNode = null;
          let timeNode = null;
          let className = '';
          if (user.status == 2) {
            resultNode = (
              <p className="workflow-result">
                {user.username} | {t('已通过')}
                <br />
                {user.reason}
              </p>
            );
            className = 'workflow-status-success';
            timeNode = getTime(
              approveWithProcessDtoList.find(item => item.status == 2).updatedAt
            );
          } else if (user.status == 3) {
            resultNode = (
              <p className="workflow-result">
                {user.username} | {t('驳回')}
                <br />
                {t('原因')}：{user.reason}
              </p>
            );
            className = 'workflow-status-fail';
            timeNode = getTime(
              approveWithProcessDtoList.find(item => item.status == 3).updatedAt
            );
          } else {
            resultNode = (
              <p className="workflow-result">
                {user.username} | {t('未审批')}
              </p>
            );
            className = 'workflow-status-doing';
          }

          return (
            <div key={index} className={`workflow-status ${className}`}>
              {timeNode}
              {resultNode}
              <p className="workflow-mail">
                {t('邮箱')}：{userInfo.emailAddr}
              </p>
              <p className="workflow-department">
                {t('部门')}：{userInfo.deptDescr1}-{userInfo.deptDescr2}
              </p>
            </div>
          );
        });
      }
      // status == 1 && type != 8
      else {
        result = (
          <div className="workflow-wait">
            <p className="workflow-result">{t('待审批')}</p>
            <p className="workflow-users">
              {_.map(userArray, (user, index) => {
                const userInfo = userInfoMap[user.username] || {};
                return (
                  <Tooltip key={index} title={userInfo.deptDescr1}>
                    <span className="workflow-users-item">{user.username}</span>
                  </Tooltip>
                );
              })}
            </p>
          </div>
        );
      }

      return <div className="workflow-content">{result}</div>;
    };

    // TODO 过长时的左右滑动
    return (
      <div>
        <Steps>
          {_.map(workflow, (step, index) => {
            const { approveWithProcessDtoList, approveUsers, type } = step;
            const agreeUsers = _.filter(approveWithProcessDtoList, {
              status: 2
            });
            const notAgreeUsers = _.filter(approveWithProcessDtoList, {
              status: 3
            });
            // 默认 审批中
            let status = 1;
            let userArray = [];
            // 先判断是否是并行审批 && 审批已经到了这一步
            if (type == 8 && !_.isEmpty(approveWithProcessDtoList)) {
              const allUserNum = _.size(approveWithProcessDtoList);
              // 并行审批时，展示全部的审批人
              userArray = approveWithProcessDtoList;

              if (_.size(notAgreeUsers) === allUserNum) {
                status = 3;
              } else if (_.size(agreeUsers) === allUserNum) {
                status = 2;
              }
            }
            // 优先判断 审批不通过
            else if (!_.isEmpty(notAgreeUsers)) {
              status = 3;
              userArray = notAgreeUsers;
            } else if (!_.isEmpty(agreeUsers)) {
              status = 2;
              userArray = agreeUsers;
            }
            // 其他 未审批的情况
            else {
              // 如果没有走到这一步
              if (_.isEmpty(approveWithProcessDtoList)) {
                userArray = _.map(approveUsers, ({ accountName }) => ({
                  // 把username同步过来
                  username: accountName,
                  // 默认都是未审批
                  status: 1
                }));
              } else {
                userArray = approveWithProcessDtoList;
              }
            }

            return (
              <Step
                key={index}
                {...getIconAndStatus(status)}
                title={<span>{t(stepType[step.type])}</span>}
                description={getDescription(status, userArray, step)}
              />
            );
          })}
        </Steps>
      </div>
    );
  }

  render() {
    const { approveType } = this.state;
    const {
      t,
      loadingForPassApprove,
      loadingForRejectApprove,
      global,
      approveDetail,
      applyArea
    } = this.props;
    const {
      workflowApplyDto = {},
      applyRoleDtos = [],
      workflowStepDtos,
      applyUser = {},
      workflowInfoDto = {},
      lastApproveUser = {}
    } = approveDetail.detail;
    const { status } = workflowApplyDto;
    const app =
      _.find(global.apps, ({ appId }) => appId == workflowApplyDto.appId) || {};

    const isPASS = approveType === APPROVE_TYPE.PASS;

    const isShowUserCities = applyArea => {
      if (applyArea && applyArea.areas.length) {
        return true;
      } else {
        return false;
      }
    };
    const isShowCities = applyRoleDtos => {
      if (applyRoleDtos && applyRoleDtos.length > 0) {
        let areaDtos = applyRoleDtos[0].areaDtos;
        if (areaDtos && areaDtos.length > 0) {
          return true;
        }
      }
      return false;
    };

    // 获取“已有城市”展示
    const getUserCities = applyArea => {
      const cities = [];
      if (applyArea && applyArea.areas.length) {
        applyArea.areas.forEach(i => {
          cities.push(i.name);
        });
      }
      return cities.length ? <span>{cities.join(', ')}</span> : '';
    };

    // 获取“城市”展示
    const getCities = applyRoleDtos => {
      let cities = [];
      if (applyRoleDtos && applyRoleDtos.length > 0) {
        let areaDtos = applyRoleDtos[0].areaDtos;
        if (areaDtos && areaDtos.length > 0) {
          areaDtos.map(item => {
            cities.push(item.name);
          });
        }
      }
      return cities.length > 0 ? <span>{cities.join()}</span> : '';
    };

    const getApplyColumns = () => {
      return [
        {
          title: t('权限名称'),
          dataIndex: 'refName',
          key: 'refName'
        },
        {
          title: t('权限描述'),
          dataIndex: 'description',
          key: 'description'
        }
      ];
    };

    const getApplyDataSource = () => {
      if (applyRoleDtos) {
        return applyRoleDtos.map((item, index) => ({
          id: index,
          refName: item.refName,
          description: item.description
        }));
      }
    };
    const { enumMap } = global;
    const { workflowenums = {} } = enumMap;
    const { approveStatus = {}, applyStatus = {} } = workflowenums;

    const isForOthers =
      workflowApplyDto.submissionUsername !== workflowApplyDto.username;
    return (
      <div className="upm-mobile-layout">
        <NavBar
          mode="light"
          // leftContent={t('返回')}
          // onLeftClick={this.goBack}
          // rightContent={[
          //   <a key={1} onClick={this.handleApprove}>
          //     {t('审批')}
          //   </a>
          // ]}
        >
          {t('审批详情')}
          <Badge
            text={isOversea ? t('国际') : t('国内')}
            style={{
              marginLeft: 5,
              backgroundColor: '#ff7d4c',
              borderRadius: 2
            }}
          />
        </NavBar>
        <div
          className="upm-mobile-approve-detail"
          ref={this.detailContent}
          style={{
            height: this.state.height,
            overflow: 'auto'
          }}>
          <List renderHeader={() => t('基本信息')}>
            <ListItem extra={applyUser.accountName || '-'}>
              {t('申请人')}
            </ListItem>
            <ListItem
              extra={`${applyUser.deptDescr1 || ''}-${applyUser.deptDescr2 ||
                ''}`}>
              {t('部门')}
            </ListItem>
            <ListItem extra={applyUser.emplId || '-'}>{t('ID')}</ListItem>
            <ListItem extra={applyUser.jobcodeDescr || '-'}>
              {t('职位')}
            </ListItem>
            <ListItem extra={applyUser.cgDHrStatus || '-'}>
              {t('岗位信息')}
            </ListItem>
            <ListItem extra={applyUser.emplClass || '-'}>
              {t('员工类型')}
            </ListItem>
          </List>
          <List renderHeader={() => t('申请的权限')}>
            <ListItem extra={isOversea ? t('海外') : t('国内')}>
              {t('申请类别')}
            </ListItem>
            <ListItem
              extra={
                workflowApplyDto.riskLevel
                  ? levelMapping[workflowApplyDto.riskLevel]
                  : '-'
              }>
              {t('权限敏感级别')}
            </ListItem>
            <ListItem extra={app.appName}>{t('申请系统')}</ListItem>
            <ListItem
              extra={
                (applyRoleDtos[0] && applyRoleDtos[0].businessName) || '-'
              }>
              {t('所属业务线')}
            </ListItem>
            <ListItem extra={t(workflowApplyDto.applyTypeName)}>
              {t('权限类型')}
            </ListItem>
            {isShowUserCities(applyArea) && (
              <ListItem extra={getUserCities(applyArea)}>
                {t('已有城市')}
              </ListItem>
            )}
            {isShowCities(applyRoleDtos) && (
              <ListItem extra={getCities(applyRoleDtos)}>{t('城市')}</ListItem>
            )}
            <ListItem extra={formatTime(workflowApplyDto.expireAt)}>
              {t('权限到期时间')}
            </ListItem>
            <ListItem extra={formatTime(workflowApplyDto.createdAt)}>
              {t('申请时间')}
            </ListItem>
            {this.getStrategyInfo(applyRoleDtos)}
            <ListItem multipleLine>
              权限点
              <Table
                className="permission-table"
                bordered={true}
                size="small"
                rowKey="id"
                pagination={false}
                columns={getApplyColumns()}
                dataSource={getApplyDataSource()}
              />
            </ListItem>
            {/* <WingBlank>
              <Table
                // size='small'
                rowKey="id"
                pagination={false}
                columns={getApplyColumns()}
                dataSource={getApplyDataSource()}
              />
            </WingBlank> */}
          </List>
          <List renderHeader={() => t('申请理由')}>
            <ListItem wrap>{workflowApplyDto.remark || '-'}</ListItem>
            {/* 如果是代申请，则展示提示信息 */}
            {isForOthers ? (
              <ListItem wrap>
                <span style={{ color: 'red' }}>
                  {t(
                    `注意：本权限由${workflowApplyDto.submissionUsername}代为发起申请，审批前请认真核对申请信息！`
                  )}
                </span>
              </ListItem>
            ) : null}
          </List>
          <List renderHeader={() => t('审批状态')}>
            <ListItem wrap>
              {t(workflowApplyDto.result) || t(approveStatus[status])}
              <br />
              {this.getApprovalStatus(workflowApplyDto, lastApproveUser)}
            </ListItem>
          </List>
          {/*已撤回不显示审批流程*/}
          {status === 4 ? null : (
            <List renderHeader={() => t('审批流程')}>
              <ListItem>
                {this.getBpmChart(workflowApplyDto) ||
                  this.getSteps(workflowStepDtos)}
              </ListItem>
            </List>
          )}
          <div
            className="footer"
            style={{ display: status === 1 ? 'block' : 'none' }}
            ref={this.detailFooter}>
            <div className="btn-group">
              <Button inline type="primary" onClick={this.handlePass}>
                通过
              </Button>
              {/* </Flex.Item> */}
              {/* <Flex.Item> */}
              <Button inline type="normal" onClick={this.handleReject}>
                驳回
              </Button>
            </div>
            {/* <div className=""> */}
            {/* <Flex.Item> */}

            {/* </Flex.Item> */}
            {/* </div> */}
          </div>
        </div>

        <Modal
          title={t(isPASS ? '通过理由' : '驳回理由')}
          popup
          onClose={this.handleCloseOnModal}
          afterClose={this.handleAfterCloseOnModal}
          visible={this.state.modalVisible}
          animationType="slide-up"
          className="reason-modal">
          <List>
            <TextareaItem
              rows={5}
              placeholder={t('请输入理由')}
              value={this.state.reason}
              onChange={this.handleChangeOnTextareaItem}
            />
            <List.Item>
              <Button
                loading={loadingForPassApprove || loadingForRejectApprove}
                // type={isPASS ? 'primary' : 'warning'}
                type="primary"
                onClick={isPASS ? this.pass : this.reject}>
                {t('提交')}
              </Button>
            </List.Item>
          </List>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { global, approveDetail, applyArea, approveList } = state;
  return {
    global,
    approveDetail,
    applyArea,
    loadingForPassApprove: approveList.loading.passApprove,
    loadingForRejectApprove: approveList.loading.rejectApprove
  };
};

export default translate()(connect(mapStateToProps)(ApproveDetail));
