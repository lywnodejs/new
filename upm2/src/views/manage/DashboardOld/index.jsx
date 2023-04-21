import React from 'react';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Select, Icon, Card, Avatar } from 'antd';

import AvailableApps from '@/components/AvailableApps'
import ApplyPanel from './components/Apply'
import OpsPanel from './components/Ops'
import ApprovePanel from './components/Approve'

import './style.less';

class Dashboard extends React.Component {

  state = {
    panel: 'ops',
    stats: {
      roleCount: '', //角色总数
      redundancy: '', //权限冗余度
      workflowCount: '' // 审批流总数
    }
  }

  handleSystemChange = () => {
    this.props.getRealTimeStats(this.props.appId).then(data => {
      this.setState({
        stats: data
      })
    })
  };

  handleCardClick = (panel) => {
    this.setState({
      panel
    })
  };

  renderPanle() {
    switch (this.state.panel) {
      case 'ops':
        return <OpsPanel />
      case 'apply':
        return <ApplyPanel />
      case 'approve':
        return <ApprovePanel />
      default:
        return <OpsPanel />
    }
  }

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

  render() {
    const { t } = this.props;

    return (
      <div className="manage-dashboard" style={{height: this.dheight + 'px'}}>
        <div className="manage-dashboard__header">
          <Row>
            <Col span={8}>
              <Form.Item label={t('当前系统')}>
                <AvailableApps style={{ width: 200 }} changeCallBack={this.handleSystemChange} />
                {/* <Select
                  defaultValue="lucy"
                  style={{ width: 120 }}
                  onChange={this.handleSystemChange}
                >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select> */}
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
          <Row gutter={12}>
            <Col span={8}>
              <Card className="manage-dashboard__card" bordered={false} onClick={() => {this.handleCardClick('ops')}}>
                <Card.Meta
                  avatar={<Avatar shape="square" size={60} src={require('@/assets/dashboard1.png')} />}
                  title={t('权限分布统计')}
                  description={`角色总数: ${this.state.stats.roleCount}`}
                />
                {/* <div className="manage-dashboard__statistics__icon">xxxx</div>
                <div className="manage-dashboard__statistics__info">
                  <div>{t('权限分布统计')}</div>
                  <div>角色总数</div>
                </div> */}
              </Card>
            </Col>
            <Col span={8}>
              <Card className="manage-dashboard__card" bordered={false} onClick={() => {this.handleCardClick('apply')}}>
                <Card.Meta
                  avatar={<Avatar shape="square" size={60} src={require('@/assets/dashboard2.png')} />}
                  title={t('权限使用统计')}
                  description={`权限冗余: ${this.state.stats.redundancy}`}
                />
                {/* <div className="manage-dashboard__statistics__icon">xxxx</div>
                  <div className="manage-dashboard__statistics__info">
                    <div>{t('权限使用统计')}</div>
                    <div>权限冗余</div>
                  </div> */}
              </Card>
            </Col>
            <Col span={8}>
              <Card className="manage-dashboard__card" bordered={false} onClick={() => {this.handleCardClick('approve')}}>
                <Card.Meta
                  avatar={<Avatar shape="square" size={60} src={require('@/assets/dashboard3.png')} />}
                  title={t('审批流情况统计')}
                  description={`审批流总数: ${this.state.stats.workflowCount}`}
                />
                {/* <div className="manage-dashboard__statistics__icon">xxxx</div>
                  <div className="manage-dashboard__statistics__info">
                    <div>{t('审批流情况统计')}</div>
                    <div>审批流总数</div>
                  </div> */}
              </Card>
            </Col>
          </Row>
        </div>
        <div className="manage-dashboard__panel">
          {this.renderPanle()}
        </div>
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
