import React from 'react';
import { Row, Col, Form, Select, Icon, Button, Divider, Tooltip, Popover, Table, Modal } from 'antd';
import connect from '@utils/translateConnect';
import Panel from '../components/Panel';
import { MANAGE } from '@routes/config';

import AvailableApps from '@/components/AvailableApps';
import SystemInformation from '@/components/SystemInformation';

import '../style.less';

const { Column } = Table;

function Number (props) {
  const { number, unit = '', style = (number) => {
    if (number < 40) {
      return {
        color: '#F44336'
      };
    } else if (number < 70) {
      return {
        color: '#cddc39'
      };
    }
    return {
      color: '#8bc34a'
    };
  } } = props;

  let styleObj;

  if (typeof style == 'function') {
    styleObj = style(number);
  }

  return (
    <div style={styleObj}>
      {number + unit}
    </div>
  );
}

class Dashboard extends React.Component {

  state = {
    panel: 'ops',
    stats: {
      'userCount': 0, // 系统总用户数
      'sensitiveUserCount': 0, //敏感用户数
      'permissionCount': 0, // 权限数
      'sensitivePermissionCount': 0, //敏感权限数
      'avgApplyCompleteTime': 0, // 平均审批完成时间（单位h）
      'workflowCount': 0, //审批流个数
      'workflowCoverRatio': 0,//审批流覆盖率
      'roleRedundancy': 0, //角色申请冗余度
      'ninetyApplyCompleteTime': 0,//90分位审批时长
    },
    // tipsShow: {1: false, 2: false, 3: false, 4: false},
    modal: {
      modalVisible: false,
      title: '',
      type: '',
      record: {},
      time: 7
    },
    completeRatio: {
      'descriptionCoverRatio': '-', // 角色描述覆盖率
      'roleCategoryRatio': '-' // 角色分类覆盖率
    },
    visibleSystem: this.props.iShowSystemModal
  }

  constructor(props) {
    super(props);
    this.updateSysList = [];
  }

  handleCancel = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        modalVisible: false,
      }
    });
  }

  showRedundancy = () => {
    this.setState({
      modal: {
        type: 'redundancy',
        modalVisible: true,
        modalTitle: this.props.t('角色申请冗余数|详情')
      },
    });
  }

  showSlowest = (record, time) => {
    this.setState({
      modal: {
        type: 'slowest',
        modalVisible: true,
        modalTitle: this.props.t('{{ name }}|近{{ time }}天审批节点最慢TOP10', { name: record.workflowName, time }),
        record,
        time
      },
    });
  }

  handleSystemChange = () => {
    this.props.getRealTimeStats(this.props.appId).then(data => {
      this.setState({
        stats: data
      });
    });
    this.props.getCompleteRatio(this.props.appId).then(data => {
      this.setState({
        completeRatio: data
      });
    });
    this.props.getDetail(this.props.appId);
    this.props.getAppRank(this.props.appId).then(data => {
      this.setState({
        appRank: data
      });
    });
    // this.props.getWeeklyReport(this.props.appId).then(data => {
    //   this.setState({
    //     stats: data
    //   })
    // })
  };

  handleRoleDetail = () => {
    const { history } = this.props;

    history.push(`${MANAGE}/role/list`);
  }

  handleDeptChange = ({ id }, value) => {
    this.props.updateManageAppList({ id, deptId: value });
  }

  handleEnvChange = ({ id }, value) => {
    this.props.updateManageAppList({ id, appDefinedEnv: value });
  }

  handleBatchUpdateSys = () => {
    const { appList, appId } = this.props;

    this.props.batchUpdateSys(appList.map(({ id, deptId, appDefinedEnv }) => ({ id, deptId, appDefinedEnv }))).then(() => {
      this.props.getDetail(appId);
      this.props.getManageAppList();
    });
  }

  handleUpdateSys = () => {
    const { history, availableApps } = this.props;

    if (availableApps && availableApps.length == 0) {
      this.setState({
        authorityVisible: true
      })
    } else {
      history.push(`${MANAGE}/app/admin`);
    }
  }

  handleAuhorityVisibleOk = () => {
    this.setState({
      authorityVisible: false
    })
  }

  componentWillMount () {
    const HHEIGHT = 64;
    const PADDING = 10;
    const wheight = window.innerHeight || document.documentElement.clientHeight;
    this.dheight = wheight - HHEIGHT - PADDING * 2;

  }

  componentDidMount () {
    this.props.getRealTimeStats(this.props.appId).then(data => {
      this.setState({
        stats: data
      });
    });
    this.props.getCompleteRatio(this.props.appId).then(data => {
      this.setState({
        completeRatio: data
      });
    });
    this.props.getRankingListByApplyTime();
    this.props.getRankingListByComplete();
    this.props.getDeptRankingListByApplyTime();
    this.props.getDeptRankListByComplete();
    this.props.getManageAppList();
    this.props.getDepartmentLevelOneList();
    this.props.getSyetemEnv();
    this.props.getDetail(this.props.appId);
    this.props.getAppRank(this.props.appId);
    this.props.isShowSystemInfoConfig();
    this.props.fetchAvailableApps();
    // this.props.fetchPermissionAdminList();

    this.props.gfetchAvailableApps().then(availableApps => {
      if (availableApps && availableApps.length == 0) {
        this.setState({
          authorityVisible: true
        })
      } else {
        this.setState({
          authorityVisible: false
        })
      }
    })

    // this.props.getWeeklyReport(this.props.appId).then(data => {
    //   this.setState({
    //     stats: data
    //   })
    // })
  }

  // componentWillReceiveProps() {
  //   let { availableApps } = this.props
  //   if (availableApps && availableApps.length == 0) {
  //     this.setState({
  //       authorityVisible: true
  //     })
  //   } else {
  //     this.setState({
  //       authorityVisible: false
  //     })
  //   }
  // }

  // showTips(index, flag) {
  //   this.setState({
  //     tipsShow: {
  //       ...this.state.tipsShow,
  //       [index]: flag
  //     }
  //   })
  // }

  render () {
    const { t, listByApplyTime, listByComplete, deptListByComplete, deptListByApplyTime, appList, departmentLevelOneList, systemEnv, appInfo, iShowSystemModal } = this.props;
    const { tipsShow, stats, completeRatio } = this.state;
    const { avgApplyCompleteTime, ninetyApplyCompleteTime } = stats;
    const panalData = [{
      data1: stats.sensitiveUserCount,
      data2: stats.userCount,
      name1: '敏感用户数',
      name2: '系统总用户数',
      tooltip1: '拥有敏感等级为C4权限的用户总数',
      tooltip2: '该系统所有账户的数量'
    }, {
      data1: stats.sensitivePermissionCount,
      data2: stats.permissionCount,
      name1: '敏感权限数',
      name2: '权限数',
      tooltip1: '敏感等级为C4的权限总数，敏感权限数较多时要做必要监控',
      tooltip2: '该系统所有权限的数量(包括角色、地区、标识位)'
    }, {
      data1: stats.avgApplyCompleteTime,
      data2: stats.workflowCount,
      name1: '近7天平均审批时长',
      name2: '审批流个数',
      tooltip1: '该系统所有权限的平均审批时长',
      tooltip2: '该系统拥有的审批流个数'
    }, {
      data1: stats.workflowCoverRatio,
      data2: stats.roleRedundancy,
      name1: '审批流覆盖率',
      name2: '角色申请冗余度',
      tooltip1: '系统权限使用自定义审批流的比率，覆盖率越高，个性化审批流配置比越高，一定程度反应审批流配置越合理。审批流覆盖率=(未使用默认审批流的权限数/所有权限数)*100%',
      tooltip2: '超过半年没有被申请过的角色数量，系统管理员可根据实际情况对相关角色进行清理(点击可查看详情)',
      onclick: true
    }];

    const baseColumns = [
      {
        dataIndex: 'appName',
        render (text, record, index) {
          return <span><span className={index < 3 ? 'manage-dashboard__index manage-dashboard__index--hgl' : 'manage-dashboard__index'}>{index + 1}</span>{text}</span>;
        }
      }
    ];
    const complateCols = baseColumns.concat({
      dataIndex: 'indicatorValue',
      width: 100,
      render (text) {
        return text + '%';
      }
    });
    const applyCols = baseColumns.concat({
      dataIndex: 'indicatorValue',
      width: 100,
      render (text) {
        return text + 'min';
      }
    });

    const deptBaseColumns = [
      {
        dataIndex: 'deptName',
        render (text, record, index) {
          return <span><span className={index < 3 ? 'manage-dashboard__index manage-dashboard__index--hgl' : 'manage-dashboard__index'}>{index + 1}</span>{text}</span>;
        }
      }
    ];

    const deptComplateCols = deptBaseColumns.concat({
      dataIndex: 'indicatorValue',
      width: 100,
      render (text) {
        return text + '%';
      }
    });
    const deptApplyCols = deptBaseColumns.concat({
      dataIndex: 'indicatorValue',
      width: 100,
      render (text) {
        return text + 'min';
      }
    });

    return (
      <div className="manage-dashboard" style={{ height: this.dheight + 'px' }}>
        <div className="manage-dashboard__header">
          <Row>
            <Col span={8}>
              <Form.Item label={t('当前系统')}>
                <AvailableApps hideClosed={true} style={{ width: 200 }} changeCallBack={this.handleSystemChange} />
              </Form.Item>
            </Col>
            <Col span={16}>
              <div className="manage-dashboard__hint">
                <span>{t('所属一级部门')}</span>
                {appInfo.deptDescr01 || '-'}<Divider type="vertical" />{appInfo.appDefinedEnvName || '-'}
                <Button type="link" onClick={this.handleUpdateSys}>{t('修改')}</Button>
              </div>
            </Col>
          </Row>
        </div>
        <Panel title={t('系统整体情况')} subTitle={<span><Tooltip title={t('鼠标轻放可查看注释')}><Icon type="question-circle-o" /></Tooltip><span style={{ fontSize: 12 }}>{'（' + t('点击指标可查看详情') + '）'}</span></span>}>
          <Row>
            {panalData.map((item, index) => {
              return (
                <Col key={index} span={6} className="manage-dashboard__span" onClick={() => { item.onclick && this.showRedundancy(); }}>
                  <p>
                    <span style={{ color: '#ff7d4c' }}>{item.data1}</span><span>/</span><span>{item.data2}</span></p>
                  <Tooltip overlayClassName="manage-dashboard__tooltip" title={t(item.tooltip1)}><p style={{ color: '#ff7d4c' }}>{t(item.name1)}</p></Tooltip>
                  <Tooltip overlayClassName="manage-dashboard__tooltip" title={t(item.tooltip2)} placement="bottom"><p>{t(item.name2)}</p></Tooltip>
                </Col>
              );
            })}
          </Row>
        </Panel>
        <Row gutter={10}>
          <Col span={24}>
            <Panel title={t('角色权限完整度')} subTitle={<span><Popover content={<div>{t('角色权限完善度 =（角色描述覆盖率+角色分类覆盖率）/ 2')}<br />{t('角色完善度越高，越能提高权限申请、审批、管理的效率')}</div>}><Icon type="question-circle-o" /></Popover><span onClick={this.handleRoleDetail} style={{ fontSize: 12, cursor: 'pointer' }}>{'（' + t('点击提高权限完整度') + '）'}</span></span>}>
              <Row>
                <Col span={12}>
                  <div className="manage-dashboard__statistics__item">
                    <div className="manage-dashboard__statistics__number">
                      <Number number={completeRatio.descriptionCoverRatio} unit="%" />
                    </div>
                    <div className="manage-dashboard__statistics__description">{t('角色描述覆盖率')}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="manage-dashboard__statistics__item">
                    <div className="manage-dashboard__statistics__number">
                      <Number number={completeRatio.roleCategoryRatio} unit="%" />
                    </div>
                    <div className="manage-dashboard__statistics__description">{t('角色分类覆盖率')}</div>
                  </div>
                </Col>
              </Row>
            </Panel>
          </Col>
          {/* <Col span={12}>
            <div className="manage-dashboard__statistics">
              <Row className="manage-dashboard__statistics__header">
                <span className="manage-dashboard__statistics__title">{t('系统用户反馈')}</span>
              </Row>
              <Row style={{paddingBottom: 30}}>
                <Col span={12}>
                  <div className="manage-dashboard__statistics__item">
                    <div className="manage-dashboard__statistics__number">
                      <Number number={75}/>
                    </div>
                    <div className="manage-dashboard__statistics__description">{t('近7天系统用户评分')}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="manage-dashboard__statistics__item">
                    <div>{t('批评者人数')}</div>
                    <div>{t('中立者人数')}</div>
                    <div>{t('赞扬者人数')}</div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col> */}
        </Row>
        <Row>
          <Col>
            <Panel title={t('系统排行榜（每天0点更新）')} subTitle={<Popover placement="right" content={
              <div>
                {t('1、系统权限点数>=10，且用户数>=100的正式系统参与本排行。（预发/测试环境系统不参与本排行）')}<br />
                {/* {t('2、用户数量榜即参与排行系统中，用户数量最多的子系统排行')}<br/> */}
                {t('2、角色完善榜即参与排行系统中，角色完善率最高的子系统排行权限完善率=（角色描述覆盖率+角色分类覆盖率）/2')}<br />
                {t('3、审批效率榜即参与排行系统中，系统近7天平均审批时长最短的子系统排行')}<br />
                {/* {t('（本系统排行榜最终解释权归IAM团队所有）')} */}
              </div>}><Icon type="question-circle-o" /></Popover>}>
              <Row>
                <Col span={12}>
                  <div className="manage-dashboard__statistics__list">
                    <div className="manage-dashboard__statistics__lhead">
                      <div className="manage-dashboard__statistics__lhead__title">{t('角色完善榜')}</div>
                      <div className="manage-dashboard__statistics__lhead__subtitle">{t('尽善尽美好风范')}</div>
                      <div className="manage-dashboard__statistics__lhead__appnumber">
                        {t('当前系统排序：')}
                        <span>
                          {
                            this.props.roleCompleteRank == '0' ?
                              <span>
                                -
                                &nbsp;
                                <Popover placement="bottom" content={
                                  <div>
                                    {t('预发/测试系统')}<br />
                                    {t('不参与排名')}
                                  </div>}><Icon type="question-circle-o" />
                                </Popover>
                              </span>
                              : this.props.roleCompleteRank
                          }
                          &nbsp;&nbsp;
                        </span>
                        {/* <Popover placement="bottom" content={
                          <div>
                            {t('预发/测试系统')}<br />
                            {t('不参与排名')}
                          </div>}><Icon type="question-circle-o" />
                        </Popover> */}
                      </div>
                    </div>
                    <Table className="manage-dashboard__table" rowKey="appId" columns={complateCols} dataSource={listByComplete} showHeader={false} pagination={false} size="small" />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="manage-dashboard__statistics__list">
                    <div className="manage-dashboard__statistics__lhead">
                      <div className="manage-dashboard__statistics__lhead__title">{t('审批效率榜')}</div>
                      <div className="manage-dashboard__statistics__lhead__subtitle">{t('雷厉风行霹雳侠')}</div>
                      <div className="manage-dashboard__statistics__lhead__appnumber">
                        {t('当前系统排序：')}
                        <span>
                          {
                            this.props.applyRank == '0' ?
                              <span>
                                -
                                &nbsp;
                                <Popover placement="bottom" content={
                                  <div>
                                    {t('预发/测试系统')}<br />
                                    {t('不参与排名')}
                                  </div>}><Icon type="question-circle-o" />
                                </Popover>
                              </span>
                              : this.props.applyRank
                          }
                          &nbsp;&nbsp;
                        </span>
                      </div>
                    </div>
                    <Table className="manage-dashboard__table" rowKey="appId" columns={applyCols} dataSource={listByApplyTime} showHeader={false} pagination={false} size="small" />
                  </div>
                </Col>
              </Row>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col>
            <Panel title={t('部门排行榜（每天0点更新）')} subTitle={<Popover placement="right" content={
              <div>
                {t('1、系统权限点数>=10，且用户数>=100的正式系统参与本排行。（预发/测试环境系统不参与本排行）')}<br />
                {/* {t('2、用户数量榜即参与排行系统中，用户数量最多的子系统排行')}<br/> */}
                {t('2、角色完善榜即参与排行部门中，相关系统角色完善率最高的子系统排行权限完善率=（相关系统平均角色')}<br />
                {t('描述覆盖率+相关系统平均角色分类覆盖率）/2')}<br />
                {t('3、审批效率榜即参与排行部门中，相关系统近7天加权平均审批时长的排行榜')}<br />
                {/* {t('（本系统排行榜最终解释权归IAM团队所有）')} */}
              </div>}><Icon type="question-circle-o" /></Popover>}>
              <Row>
                <Col span={12}>
                  <div className="manage-dashboard__statistics__list">
                    <div className="manage-dashboard__statistics__lhead">
                      <div className="manage-dashboard__statistics__lhead__title">{t('角色完善榜')}</div>
                      <div className="manage-dashboard__statistics__lhead__subtitle">{t('尽善尽美好风范')}</div>
                    </div>
                    <Table className="manage-dashboard__table" rowKey="appId" columns={deptComplateCols} dataSource={deptListByComplete} showHeader={false} pagination={false} size="small" />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="manage-dashboard__statistics__list">
                    <div className="manage-dashboard__statistics__lhead">
                      <div className="manage-dashboard__statistics__lhead__title">{t('审批效率榜')}</div>
                      <div className="manage-dashboard__statistics__lhead__subtitle">{t('雷厉风行霹雳侠')}</div>
                    </div>
                    <Table className="manage-dashboard__table" rowKey="appId" columns={deptApplyCols} dataSource={deptListByApplyTime} showHeader={false} pagination={false} size="small" />
                  </div>
                </Col>
              </Row>
            </Panel>
          </Col>
        </Row>
        <Modal
          title={t('请选择系统所属一级部门（若为测试系统则选择测试）')}
          centered
          closable={false}
          maskClosable={false}
          key="department"
          visible={appList.length > 0}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleBatchUpdateSys}>
              {t('确定')}
            </Button>,
          ]}>
          <Table
            rowKey="id"
            dataSource={appList}
            size="small"
            pagination={false}
            scroll={{ y: 240 }}
          >
            <Column title={t('系统名称')} width={120} dataIndex="name" key="appName" />
            <Column
              title={t('一级部门')}
              width={200}
              key="departName"
              render={(data) => {
                return (
                  <div style={{ width: '200px' }}>
                    <Select style={{ width: '100%' }}
                      value={data.deptId == 0 ? null : data.deptId}
                      onChange={(value) => this.handleDeptChange(data, value)}
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }>
                      {departmentLevelOneList.map(dep => {
                        return <Select.Option key={dep.deptId} value={+dep.deptId}>{dep.deptName}</Select.Option>;
                      })}
                    </Select>
                  </div>
                );
              }}
            />
            <Column
              title={t('系统类型')}
              width={100}
              key="sysType"
              render={(data) => {
                return (
                  <div style={{ width: '100px' }}>
                    <Select style={{ width: '100%' }}
                      value={+data.appDefinedEnv}
                      onChange={(value) => this.handleEnvChange(data, value)}>
                      {systemEnv.map(env => {
                        return <Select.Option key={env.code} value={env.code}>{env.name}</Select.Option>;
                      })}
                    </Select>
                  </div>
                );
              }}
            />
          </Table>
        </Modal>
        <Modal
          title={t('提示')}
          visible={this.state.authorityVisible}
          onOk={this.handleAuhorityVisibleOk}
          onCancel={this.handleAuhorityVisibleOk}
          footer={[
            <span>
              {/* {t('点击【前往】即跳转到链接')} */}
            </span>,
            <Button key="submit" type="primary" onClick={this.handleAuhorityVisibleOk}>
              {t('确定')}
            </Button>
          ]}>
          <p>
            {t('您还没有系统管理员权限，如需权限请咨询EEC-信息安全小助手或参考')}
            <a target="_blank" href="http://i.xiaojukeji.com/service/question/detail/null/1022368?lang=zh-CN">如何申请成为子系统管理员</a>进行申请
          </p>
        </Modal>
        {
          iShowSystemModal && <SystemInformation
            key="system"
            t={t}
            visibleSystem={this.state.visibleSystem}
          ></SystemInformation>
        }
      </div>
    );
  }
}

export default connect(({ global, dashboard, account, admin, manageApp }) => ({
  appId: global.managingAvailableApp,
  availableApps: global.availableApps,
  departmentLevelOneList: global.departmentLevelOneList,
  systemEnv: global.systemEnv,
  listByApplyTime: dashboard.listByApplyTime,
  listByComplete: dashboard.listByComplete,
  deptListByComplete: dashboard.deptListByComplete,
  deptListByApplyTime: dashboard.deptListByApplyTime,
  appList: account.account.appList,
  appInfo: admin.detail,
  roleCompleteRank: dashboard.appRank.roleCompleteRank,
  applyRank: dashboard.appRank.applyRank,
  fetchAvailableApps: global.fetchAvailableApps,
  iShowSystemModal: manageApp.iShowSystemModal
}), (dispatch) => ({
  gfetchAvailableApps () {
    return dispatch({
      type: 'global/fetchAvailableApps'
    });
  },
  getRealTimeStats (appId) {
    return dispatch({
      type: 'dashboard/getRealTimeStats',
      payload: appId
    });
  },
  getCompleteRatio (appId) {
    return dispatch({
      type: 'dashboard/getCompleteRatio',
      payload: appId
    });
  },
  getWeeklyReport (appId) {
    return dispatch({
      type: 'dashboard/getWeeklyReport',
      payload: appId
    });
  },
  getRankingListByApplyTime () {
    return dispatch({
      type: 'dashboard/getRankingListByApplyTime'
    });
  },
  getRankingListByComplete () {
    return dispatch({
      type: 'dashboard/getRankingListByComplete'
    });
  },
  getAppRank (appId) {
    return dispatch({
      type: 'dashboard/getAppRank',
      payload: appId
    });
  },
  getDeptRankListByComplete () {
    return dispatch({
      type: 'dashboard/getDeptRankListByComplete'
    });
  },
  getDeptRankingListByApplyTime () {
    return dispatch({
      type: 'dashboard/getDeptRankingListByApplyTime'
    });
  },
  getManageAppList () {
    return dispatch({
      type: 'account/getManageAppList'
    });
  },
  getDepartmentLevelOneList () {
    return dispatch({
      type: 'global/getDepartmentLevelOneList'
    });
  },
  getSyetemEnv () {
    return dispatch({
      type: 'global/getSyetemEnv'
    });
  },
  batchUpdateSys (sys) {
    return dispatch({
      type: 'account/batchUpdateSys',
      payload: sys
    });
  },
  updateManageAppList (sys) {
    return dispatch({
      type: 'account/updateManageAppList',
      payload: sys
    });
  },
  getDetail (appId) {
    return dispatch({
      type: 'admin/getDetail',
      payload: {
        appId
      }
    });
  },
  isShowSystemInfoConfig () {
    return dispatch({
      type: 'manageApp/isShowSystemInfoConfig',
    });
  },
  fetchAvailableApps () {
    return dispatch({
      type: 'manageApp/fetchAvailableApps',
    });
  },
  // fetchPermissionAdminList () {
  //   return dispatch({
  //     type: 'manageApp/fetchPermissionAdminList'
  //   })
  // }
}))(Dashboard);
