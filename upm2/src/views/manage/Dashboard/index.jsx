import React from 'react';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Select, Icon, Card, Avatar, Tooltip } from 'antd';

import AvailableApps from '@/components/AvailableApps'
import ApprovePanel from './components/Approve'
import RedundancyModal from './RedundancyModal'
import SlowestModal from './components/Approve/SlowestModal'

import './style.less';

class Dashboard extends React.Component {

  state = {
    panel: 'ops',
    stats: {
      "userCount": 0, // 系统总用户数
      "sensitiveUserCount": 0, //敏感用户数
      "permissionCount": 0, // 权限数
      "sensitivePermissionCount": 0, //敏感权限数
      "avgApplyCompleteTime": 0, // 平均审批完成时间（单位h）
      "workflowCount": 0, //审批流个数
      "workflowCoverRatio": 0,//审批流覆盖率
      "roleRedundancy": 0, //角色申请冗余度
      "ninetyApplyCompleteTime": 0,//90分位审批时长
    },
    // tipsShow: {1: false, 2: false, 3: false, 4: false},
    modal: {
      modalVisible: false,
      title: '',
      type: '',
      record: {},
      time: 7
    }
  }

  handleCancel = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        modalVisible: false,
      }
    });
  }

  createModal = () => {
    const ModalMap = {
      'redundancy': <RedundancyModal {...this.state.modal} appId={this.props.appId} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
      'slowest': <SlowestModal {...this.state.modal} appId={this.props.appId} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
    };

    return ModalMap[this.state.modal.type];
  };

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
        modalTitle: this.props.t('{{ name }}|近{{ time }}天审批节点最慢TOP10', {name:record.workflowName, time}),
        record,
        time
      },
    });
  }

  handleSystemChange = () => {
    this.props.getRealTimeStats(this.props.appId).then(data => {
      this.setState({
        stats: data
      })
    })
  };

  componentWillMount() {
    const HHEIGHT = 64
    const PADDING = 10
    const wheight = window.innerHeight || document.documentElement.clientHeight
    this.dheight = wheight - HHEIGHT - PADDING * 2
  }

  componentDidMount() {
    this.props.getRealTimeStats(this.props.appId).then(data => {
      this.setState({
        stats: data
      })
    })
  }

  // showTips(index, flag) {
  //   this.setState({
  //     tipsShow: {
  //       ...this.state.tipsShow,
  //       [index]: flag
  //     }
  //   })
  // }

  render() {
    const { t } = this.props;
    const { tipsShow, stats } = this.state;
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

    return (
      <div className="manage-dashboard" style={{height: this.dheight + 'px'}}>
        <div className="manage-dashboard__header">
          <Row>
            <Col span={8}>
              <Form.Item label={t('当前系统')}>
                <AvailableApps style={{ width: 200 }} changeCallBack={this.handleSystemChange} />
              </Form.Item>
            </Col>
            <Col span={16}>
              <div className="manage-dashboard__hint">
                {/* <Icon type="warning" />
                xxxx */}
              </div>
            </Col>
          </Row>
        </div>
        <div className="manage-dashboard__statistics">
          <Row gutter={12} style={{padding: '10px 10px 35px'}}>
            <span style={{fontSize: 16}}>{t('系统整体情况')}</span><span style={{fontSize: 12}}>{'(' +t('点击指标可查看详情') + ')'}</span><Tooltip title={t('鼠标轻放可查看注释')}><Icon type="question-circle-o" /></Tooltip>
          </Row>
          <Row gutter={12} style={{paddingBottom: 30}}>
            {panalData.map((item, index) => {
              return (
                <Col key={index} span={6} className="manage-dashboard__span" onClick={() => {item.onclick && this.showRedundancy()}}>
                  <p>
                  <span style={{color: '#ff7d4c'}}>{item.data1}</span><span>/</span><span>{item.data2}</span></p>
                  <Tooltip overlayClassName="manage-dashboard__tooltip" title={t(item.tooltip1)}><p style={{color: '#ff7d4c'}}>{t(item.name1)}</p></Tooltip>
                  <Tooltip overlayClassName="manage-dashboard__tooltip" title={t(item.tooltip2)} placement="bottom"><p>{t(item.name2)}</p></Tooltip>
                </Col>
              )
            })}
          </Row>
        </div>
        <div className="manage-dashboard__panel">
          <ApprovePanel showSlowest={this.showSlowest} avgApplyCompleteTime={avgApplyCompleteTime} ninetyApplyCompleteTime={ninetyApplyCompleteTime}/>
        </div>

        {this.createModal()}
      </div>
    );
  }
}

export default connect(({ global }) => ({
  appId: global.managingApp
}), (dispatch) => ({
  getRealTimeStats(appId) {
    return dispatch({
      type: 'dashboard/getRealTimeStats',
      payload: appId
    });
  }
}))(Dashboard);
