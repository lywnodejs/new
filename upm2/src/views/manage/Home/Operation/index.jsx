import React from 'react';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Select, Icon, Card, Avatar, Tooltip } from 'antd';

import AvailableApps from '@/components/AvailableApps'
import ApprovePanel from '../components/Approve'
import RedundancyModal from './RedundancyModal'
import SlowestModal from '../components/Approve/SlowestModal'

import '../style.less';

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
    const { stats } = this.state;
    const { avgApplyCompleteTime, ninetyApplyCompleteTime } = stats;

    return (
      <div className="manage-dashboard" style={{height: this.dheight + 'px'}}>
        <div className="manage-dashboard__header">
          <Row>
            <Col span={8}>
              <Form.Item label={t('当前系统')}>
                <AvailableApps hideClosed={true} style={{ width: 200 }} changeCallBack={this.handleSystemChange} />
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
        <div className="manage-dashboard__panel">
          <ApprovePanel showSlowest={this.showSlowest} avgApplyCompleteTime={avgApplyCompleteTime} ninetyApplyCompleteTime={ninetyApplyCompleteTime}/>
        </div>

        {this.createModal()}
      </div>
    );
  }
}

export default connect(({ global }) => ({
  appId: global.managingAvailableApp
}), (dispatch) => ({
  getRealTimeStats(appId) {
    return dispatch({
      type: 'dashboard/getRealTimeStats',
      payload: appId
    });
  }
}))(Dashboard);
