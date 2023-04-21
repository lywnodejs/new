/**
 * 申请工单的详细信息，包括审批流程、申请的详细内容
 * 常用在 申请详情、审批详情
 */

import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import connect from '@utils/translateConnect';
import { Row, Col, Steps, Icon, Tooltip, Tag, Table, Popover } from 'antd';
const { Step } = Steps;
// import { bpmHost } from '@config/apiConfig';
import { isOversea } from '@config/env';
import ForecastGraph from '@components/ForecastGraph';

import './index.less';

// 等级隐射
const levelMapping = {
  1: 'C1',
  2: 'C2',
  3: 'C3',
  4: 'C4'
};

class SheetDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  }

  getStrategyInfo(applyDetail) {
    const { t } = this.props;
    const data = {};
    // 对后端返回的 展开式的数据 进行聚合，类似于group by
    _.each(
      applyDetail,
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
      <div>
        <div className="block-title">{t('申请策略信息')}</div>
        <div className="block-content inner-block strategy-content">
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
                          {/* <Row> */}
                          {/* <Col className="dimension-label" span={2}> */}
                          {dimension.label}：{/* </Col> */}
                          {/* <Col span={21}> */}
                          {_.map(dimension.value, dimenodeName => (
                            <Tag key={dimenodeName}>{dimenodeName}</Tag>
                          ))}
                          {/* </Col> */}
                          {/* </Row> */}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  getBpmChart(data) {
    const { bpmProcessId } = data;
    const { global = {}, workflowInfo } = this.props;
    // return bpmProcessId ? (
    //   <iframe
    //     src={global.bpmHost + `/trace/${bpmProcessId}`}
    //     frameBorder="0"
    //     width="100%"
    //     height="485"></iframe>
    // ) : null;
    return bpmProcessId ? <ForecastGraph workflowInfo={workflowInfo} /> : null;
  }

  getSteps(workflow) {
    const { global = {}, t, data } = this.props;
    const { workflowenums = {} } = global.enumMap || {};
    const { stepType = {} } = workflowenums;
    // 是否显示 BPM 流程图
    const { bpmProcessGraph } = data.detail;

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
            timeNode = this.getTime(
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
            timeNode = this.getTime(
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

      return <div>{result}</div>;
    };

    // BPM 流程图
    const bpmFlowChart = bpmProcessGraph ? (
      <div className="flow-chart">
        <iframe
          src={bpmProcessGraph}
          className="bpm-flow-chart"
          width="100%"
          height="540"></iframe>
      </div>
    ) : null;

    // TODO 过长时的左右滑动
    return (
      <div style={{ padding: '20px' }}>
        <Steps size="small">
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
        {bpmFlowChart}
      </div>
    );
  }

  getTime(time) {
    return (
      <p className="workflow-timestamp">
        {moment(time).format('YYYY.MM.DD HH:mm')}
      </p>
    );
  }
  // 2020-04-16
  getApplyType = type => {
    switch (type) {
      case 1:
        return '角色组';
      case 2:
        return '角色';
      case 3:
        return '业务线的地区';
      case 4:
        return '地区权限';
      case 5:
        return '标识位';
      case 6:
        return '全局';
      case 7:
        return '数据';
      case 8:
        return '数易-报表';
      case 9:
        return '指标';
      case 10:
        return '提取工具-模板';
      case 15:
        return '实时监控';
      case 16:
        return '数易-数据集';
      default:
        return '权限';
    }
  };

  getCreateTime(time) {
    return time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '-';
  }

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
        <div className="last-approve-user">
          {t('办理人')}：
          {usernameZh && username && `${usernameZh}<${username}>`}
          {/* <div style={color}>
            {' '}
            {t('理由')}：{result}
          </div> */}
        </div>
      );
    }
    return approvalStatus;
  }

  isShowCities = data => {
    if (data && data.length > 0) {
      data = data[0].areaDtos;
      if (data && data.length > 0) {
        return true;
      }
    }
    return false;
  };
  getCities = (data, t) => {
    let cities = [];
    if (data && data.length > 0) {
      data = data[0].areaDtos;
      if (data && data.length > 0) {
        data.map(item => {
          cities.push(item.name);
        });
      }
    }
    return cities.length > 0 ? <span>{cities.join()}</span> : '';
  };

  isShowUserCities = applyArea => {
    if (applyArea && applyArea.areas.length) {
      return true;
    } else {
      return false;
    }
  };
  getUserCities = (applyArea, t) => {
    const cities = [];
    if (applyArea && applyArea.areas.length) {
      applyArea.areas.forEach(i => {
        cities.push(i.name);
      });
    }
    return cities.length ? <span>{cities.join()}</span> : '';
  };

  /**
   * 模版/报表/数据集类型,分页获取权限点table数据
   */
  getApplyDataSource = () => {
    const { currentPage, pageSize } = this.state;
    const {
      workflowApplyDto = {},
      applyRoleDtos = []
    } = this.props.data.detail;
    const { dispatch } = this.props;
    const params = {
      appId: workflowApplyDto.appId,
      resourceIds: applyRoleDtos.map(item => item.refId),
      page: currentPage,
      size: pageSize
    };
    dispatch({
      type: 'newApply/fetchResourceList',
      payload: { params }
    });
  };

  /**
   * table翻页操作
   * @param {*} page
   */
  handlePageChange = page => {
    this.setState(
      {
        currentPage: page
      },
      () => {
        this.getApplyDataSource();
      }
    );
  };

  /**
   * 更改每页显示数量
   * @param {number} current
   * @param {number} size
   */
  onShowSizeChange = (current, size) => {
    this.setState(
      {
        currentPage: current,
        pageSize: size
      },
      () => {
        this.getApplyDataSource();
      }
    );
  };

  render() {
    const {
      global,
      data,
      applyArea,
      t,
      isApply,
      showMoreInfoOnPermissionPoint,
      resourceList,
      loadingResourceList
    } = this.props;
    const {
      workflowApplyDto = {},
      applyRoleDtos = [],
      workflowStepDtos,
      applyUser = {},
      workflowInfoDto = {},
      lastApproveUser = {}
    } = data.detail;
    // 废弃，后端修改成直接返回applyTypeName， TODO：目前实现的考虑了i18n，改成后端返回之后没有做处理
    // const applyType = this.getApplyType(workflowApplyDto.applyType);
    const app =
      _.find(global.apps, ({ appId }) => appId == workflowApplyDto.appId) || {};

    // console.log('申请系统', app)

    const { enumMap } = global;
    const { workflowenums = {} } = enumMap;
    const { approveStatus = {}, applyStatus = {} } = workflowenums;
    const { status } = workflowApplyDto;
    const lineHeight = {
      lineHeight: '20px'
    };
    const applyTablePagination = {
      size: 'small',
      current: this.state.currentPage,
      pageSize: this.state.pageSize,
      total: resourceList.total,
      onChange: this.handlePageChange,
      showTotal: total => `${t('共')} ${total} ${t('条')}`,
      showQuickJumper: true,
      showSizeChanger: true,
      onShowSizeChange: this.onShowSizeChange,
      pageSizeOptions: ['10', '20', '50']
    };

    /**
     * 根据权限类型，获取权限点table表头数据
     */
    const getApplyColumns = () => {
      const { t } = this.props;
      return showMoreInfoOnPermissionPoint
        ? [
            {
              title: t('权限ID'),
              dataIndex: 'resourceKey',
              key: 'resourceKey',
              width: 100
            },
            {
              title: t('权限名称'),
              dataIndex: 'resourceName',
              key: 'resourceName',
              width: 140,
              render: (text, record) => {
                return record.resourceUrl ? (
                  <a target="_blank" href={record.resourceUrl}>
                    {text}
                  </a>
                ) : (
                  <Popover content={t('链接不存在')}>
                    <span>{text}</span>
                  </Popover>
                );
              }
            },
            {
              title: t('权限安全级别'),
              dataIndex: 'riskLevel',
              key: 'riskLevel',
              width: 100,
              render: text => {
                return <span>{levelMapping[text]}</span>;
              }
            },
            {
              title: t('权限owner'),
              dataIndex: 'resourceAdmins',
              key: 'resourceAdmins',
              width: 140
            },
            {
              title: t('权限所属项目'),
              dataIndex: 'projectName',
              key: 'projectName',
              width: 100
            },
            {
              title: t('权限描述'),
              dataIndex: 'describe',
              key: 'describe',
              width: 140
            }
          ]
        : [
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
    /**
     * 根据权限类型，获取权限点table列表数据
     */
    const getApplyDataSource = () => {
      if (showMoreInfoOnPermissionPoint) {
        if (resourceList.records && resourceList.records.length > 0) {
          const extendsFiels = [
            'riskLevel',
            'resourceAdmins',
            'projectName',
            'describe',
            'resourceUrl'
          ];
          return resourceList.records.map(item => {
            const baseInfo = {
              id: item.id,
              resourceKey: item.resourceKey,
              resourceName: item.resourceName
            };
            item.properties = item.properties || [];
            const extendsInfo = item.properties.reduce(
              (rstObj, propertyItem) => {
                extendsFiels.includes(propertyItem.attrName) &&
                  (rstObj[propertyItem.attrName] = propertyItem.attrValue);
                return rstObj;
              },
              {}
            );
            return {
              ...baseInfo,
              ...extendsInfo
            };
          });
        }
      } else {
        if (applyRoleDtos) {
          return applyRoleDtos.map((item, index) => ({
            id: index,
            refName: item.refName,
            description: item.description
          }));
        }
      }
    };

    const isForOthers =
      workflowApplyDto.submissionUsername !== workflowApplyDto.username;

    return (
      <div className="sheet-detail">
        <div className="detail-block">
          <div className="block-title">{t('基本信息')}</div>
          <div className="block-content col-info">
            <Row>
              <Col
                className="basic-info-item"
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}>
                <span className="basic-info-label">{t('申请人')}</span>
                <span>：</span>
                <span className="basic-info-content">
                  {applyUser.nameDisplay || '-'}({applyUser.accountName || '-'})
                </span>
              </Col>
              <Col
                className="basic-info-item"
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}>
                <span className="basic-info-label">{t('部门')}</span>
                <span>：</span>
                <span className="basic-info-content">
                  <Tooltip
                    title={() => {
                      return _.compact([
                        applyUser.deptDescr1,
                        applyUser.deptDescr2,
                        applyUser.deptDescr3,
                        applyUser.deptDescr4
                      ]).join('-');
                    }}>
                    {applyUser.deptDescr1}-{applyUser.deptDescr2}
                  </Tooltip>
                </span>
              </Col>
              <Col
                className="basic-info-item"
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}>
                <span className="basic-info-label">ID</span>
                <span>：</span>
                <span className="basic-info-content">
                  {applyUser.emplId || '-'}
                </span>
              </Col>
            </Row>
            <Row>
              <Col
                className="basic-info-item last-row-item"
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}>
                <span className="basic-info-label">{t('职位')}</span>
                <span>：</span>
                <span className="basic-info-content">
                  {applyUser.jobcodeDescr || '-'}
                </span>
              </Col>
              <Col
                className="basic-info-item last-row-item"
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}>
                <span className="basic-info-label">{t('岗位信息')}</span>
                <span>：</span>
                <span className="basic-info-content">
                  {applyUser.cgDHrStatus || '-'}
                </span>
              </Col>
              <Col
                className="basic-info-item last-row-item"
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}>
                <span className="basic-info-label">{t('员工类型')}</span>
                <span>：</span>
                <span className="basic-info-content">
                  {applyUser.emplClass || '-'}
                </span>
              </Col>
            </Row>
          </div>
        </div>

        <div className="detail-block">
          <div className="block-title">
            {t('申请的权限')}（{t(workflowApplyDto.businessName)}）
          </div>
          <div className="block-content inner-block col-info">
            <Row>
              <Col
                className="basic-info-item"
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}>
                <span className="basic-info-label">{t('申请类别')}</span>
                <span>：</span>
                <span className="basic-info-content">
                  {isOversea ? t('海外') : t('国内')}
                </span>
              </Col>
              <Col
                className="basic-info-item"
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}>
                <span className="basic-info-label">{t('权限敏感级别')}</span>
                <span>：</span>
                <span className="basic-info-content">
                  {workflowApplyDto.riskLevel
                    ? levelMapping[workflowApplyDto.riskLevel]
                    : '-'}
                </span>
              </Col>
              <Col
                className="basic-info-item"
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}>
                <span className="basic-info-label">{t('申请系统')}</span>
                <span>：</span>
                <span className="basic-info-content">{app.appName}</span>
              </Col>
            </Row>
            <Row>
              <Col
                className="basic-info-item"
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}>
                <span className="basic-info-label">{t('所属业务线')}</span>
                <span>：</span>
                <span className="basic-info-content">
                  {(applyRoleDtos[0] && applyRoleDtos[0].businessName) || '-'}
                </span>
              </Col>
              <Col
                className="basic-info-item"
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}>
                <span className="basic-info-label">{t('权限类型')}</span>
                <span>：</span>
                <span className="basic-info-content">
                  {t(workflowApplyDto.applyTypeName)}
                </span>
              </Col>
              {this.isShowUserCities(applyArea) ? (
                <Col
                  className="basic-info-item"
                  xs={24}
                  sm={8}
                  md={8}
                  lg={8}
                  xl={8}>
                  <span className="basic-info-label">{t('已有城市')}</span>
                  <span>：</span>
                  <span className="basic-info-content oneRowEllipsis">
                    <Popover
                      content={this.getUserCities(applyArea, t)}
                      trigger="hover">
                      {this.getUserCities(applyArea, t)}
                    </Popover>
                  </span>
                </Col>
              ) : null}
            </Row>
            <Row>
              <Col
                className="basic-info-item"
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}>
                <span className="basic-info-label">{t('权限到期时间')}</span>
                <span>：</span>
                <span className="basic-info-content">
                  {this.getCreateTime(workflowApplyDto.expireAt)}
                </span>
              </Col>
              <Col
                className="basic-info-item"
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}>
                <span className="basic-info-label">{t('申请时间')}</span>
                <span>：</span>
                <span className="basic-info-content">
                  {this.getCreateTime(workflowApplyDto.createdAt)}
                </span>
              </Col>
              {this.isShowCities(applyRoleDtos) ? (
                <Col
                  className="basic-info-item"
                  xs={24}
                  sm={8}
                  md={8}
                  lg={8}
                  xl={8}>
                  <span className="basic-info-label">{t('城市')}</span>
                  <span>：</span>
                  <span className="basic-info-content oneRowEllipsis">
                    <Popover
                      content={this.getCities(applyRoleDtos, t)}
                      trigger="hover">
                      {this.getCities(applyRoleDtos, t)}
                    </Popover>
                  </span>
                </Col>
              ) : null}
            </Row>
            <div className="permission-table">
              <Table
                // size='small'
                loading={loadingResourceList}
                rowKey="id"
                pagination={
                  showMoreInfoOnPermissionPoint ? applyTablePagination : false
                }
                columns={getApplyColumns()}
                dataSource={getApplyDataSource()}
              />
            </div>
            {/* {this.getUserCities(applyArea, t)} */}
            {/* {this.getCities(applyRoleDtos, t)} */}
          </div>
          {this.getStrategyInfo(applyRoleDtos)}
          <div className="block-title">{t('申请理由')}</div>
          <div className="block-content text-info">
            <span>{workflowApplyDto.remark || '-'}</span>
            <br />
            {/* 如果是代申请，则展示提示信息 */}
            {isForOthers ? (
              <span style={{ color: 'red' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {isApply
                  ? t(
                      `注意：本权限由${workflowApplyDto.submissionUsername}代为发起申请，若未经授权，请撤回此申请！`
                    )
                  : t(
                      `注意：本权限由${workflowApplyDto.submissionUsername}代为发起申请，审批前请认真核对申请信息！`
                    )}
              </span>
            ) : null}
          </div>
        </div>

        {/* <div className="detail-block">
          <div className="block-title">{t('申请理由')}</div>
          <div className="block-content">{workflowApplyDto.remark || '-'}</div>
        </div> */}

        <div className="detail-block">
          <div className="block-title">{t('审批状态')}</div>
          <div
            className={`block-content ${
              status === 4 ? '' : 'inner-block'
            } text-info`}>
            {t(workflowApplyDto.result) ||
              t(isApply ? t(applyStatus[status]) : t(approveStatus[status]))}
            <br />
            {this.getApprovalStatus(workflowApplyDto, lastApproveUser)}
          </div>
          {/*已撤回不显示审批流程*/}
          {status === 4 ? null : (
            <div className="detail-block workflow-block">
              <div className="block-title">
                {`${t('审批流程')}（${t(workflowInfoDto.name)}）`}
              </div>
              <div className="block-content">
                <div className="x-scroller">
                  {/* {this.getSteps(workflowStepDtos)} */}
                  {this.getBpmChart(workflowApplyDto) ||
                    this.getSteps(workflowStepDtos)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* {this.getStrategyInfo(applyRoleDtos)} */}

        {/* <div className="detail-block">
          <div className="block-title" >{t('备注')}</div>
            <div className="block-content">{workflowApplyDto.remark}</div>
        </div> */}
      </div>
    );
  }
}

export default connect(({ newApply }) => {
  return {
    resourceList: newApply.resourceList,
    loadingResourceList: newApply.loading.loadingResourceList
  };
})(SheetDetail);
