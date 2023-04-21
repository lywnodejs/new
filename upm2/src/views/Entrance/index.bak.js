import React from 'react';
import _ from 'lodash';
import { translate } from 'react-i18next';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Button, Input, Icon, Card, Modal, message } from 'antd';

import { echoMessage } from '@utils/notice';
import { MANAGE, BUSINESSMANAGE, MAIN } from '@routes/config';

import MyRecentApply from './MyRecentApply';
import ApproveTable from '../main/ApproveList/comps/ApproveTable';

// import MyRolePermission from '../main/MyRolePermission';
// import MyDataPermission from '../main/MyDataPermission';

// import CardTitle from '@components/CardTitle';

import './index.less';

import { startRecordApproveTime } from '@utils/stat.js';

const TextArea = Input.TextArea;
// const TabPane = Tabs.TabPane;
const PASS_PLACEHOLDER = '请输入审批通过的理由，必填';
const REJECT_PLACEHOLDER = '请输入审批驳回的理由，必填';

class Entrance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: '',
      approveId: '',
      tabKey: 'apply',
      // 模态框设置
      modal: {
        type: 'pass', // pass, 通过 reject，驳回
        title: '',
        style: {}, // 模态框
        visible: false // 模态框状态
      }
    };
  }

  // componentWillReceiveProps(props){
  //   console.log(props.batchRejectResult)
  // }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'entrance/fetchApply' });
    // dispatch({ type: 'entrance/fetchApprove' });
    // dispatch({ type: 'entrance/fetchPermission' });
    this.search();
  }

  goNewApply = () => {
    let { match } = this.props;
    this.props.dispatch(routerRedux.push(`${match.url}/newapply`)); // 换新版
    // this.props.dispatch(routerRedux.push(`${match.url}/new-apply`));
  };

  goPackageApply = () => {
    let { match } = this.props;
    this.props.dispatch(routerRedux.push(`${match.url}/packageapply`));
  };

  goManage = () => {
    this.props.dispatch(routerRedux.push(MANAGE));
  };

  goBusinessManage = () => {
    this.props.dispatch(routerRedux.push(BUSINESSMANAGE));
  };

  goApply = () => {
    this.props.dispatch(routerRedux.push(MAIN + '/apply'));
  };

  goApprove = () => {
    this.props.dispatch(routerRedux.push(MAIN + '/approve'));
  };

  goPermission = () => {
    this.props.dispatch(routerRedux.push(MAIN + '/permission'));
  };

  /**
   * 切换标签
   */
  onTabChange = (key, type) => {
    this.setState({ [type]: key });

    if (key === 'approval') {
      // 开始审批打点
      startRecordApproveTime();
    }
  };

  /**
   * 查询
   */
  search = page => {
    this.props.dispatch({
      type: 'approveList/fetchApprove',
      payload: {
        approveStatuses: ['1'],
        page: page || 1,
        size: 10
      }
    });
  };

  /**
   * 分页
   */
  handlePageChange = page => {
    this.search(page);
  };

  /**
   * 查看详情
   */
  handleShowDetail = approve => {
    const { dispatch } = this.props;
    const url = `${MAIN}/approve/approve-detail/${approve.approveId}`;
    dispatch(routerRedux.push(url));
  };

  /**
   * 通过操作
   */
  handlePass = ({ approveId }) => {
    const { t } = this.props;
    this.setState({
      approveId,
      reason: '',
      modal: {
        title: t('通过原因'),
        type: 'pass',
        visible: true
      }
    });
  };

  /**
   * 驳回操作
   */
  handleReject = ({ approveId }) => {
    const { t } = this.props;
    this.setState({
      approveId,
      reason: '',
      modal: {
        title: t('驳回原因'),
        type: 'reject',
        visible: true
      }
    });
  };

  /**
   * wujianjian 30 July, 2018
   * 批量审批申请操作
   * mode: true为批量通过；false为批量驳回
   */
  handleBatchOption = (approveIds, mode) => {
    const { t } = this.props;

    if (
      !approveIds ||
      (approveIds instanceof Array && approveIds.length === 0)
    ) {
      const str = '请选择您要' + (mode ? '通过' : '驳回') + '的申请';
      return echoMessage(t(str), 'warning');
    }

    this.setState({
      approveIds,
      reason: mode ? t('同意') : '',
      modal: {
        title: mode ? t('批量通过原因(默认同意)') : t('批量驳回原因'),
        type: mode ? 'batchPass' : 'batchReject',
        visible: true
      }
    });
  };

  handleReasonChange = e => {
    const reason = e.target.value;
    this.setState({
      reason
    });
  };

  handleOk = () => {
    const { type } = this.state.modal;
    const { t } = this.props;

    let reason = this.state.reason,
      action = 'approveList/',
      payload = {
        id: this.state.approveId,
        reason: reason
      },
      batchOption = [];

    reason = _.trim(reason);

    if (!reason) {
      return echoMessage(t('请输入审批理由'), 'warning');
    }

    switch (type) {
      case 'pass':
        action += 'passApprove';
        break;
      case 'reject':
        action += 'rejectApprove';
        break;
      case 'batchPass':
        action += 'batchPassApprove';
        this.state.approveIds.map(item => {
          batchOption.push({
            id: item,
            reason: reason
          });
        });
        payload = batchOption;
        break;
      case 'batchReject':
        action += 'batchRejectApprove';
        this.state.approveIds.map(item => {
          batchOption.push({
            id: item,
            reason: reason
          });
        });
        payload = batchOption;
        break;
      default:
        return echoMessage(t('请选择审批操作'), 'warning');
    }

    // 更新数据之后关闭模态框
    this.props
      .dispatch({
        type: action,
        payload
      })
      .then(result => {
        this.setState({
          modal: {
            visible: false
          }
        });

        let fail = [];

        for (const item in result) {
          if (result[item] != 0) {
            fail.push({ key: item, value: result[item] });
          }
        }

        const { t } = this.props;
        if (fail.length === 0) {
          message.success(t('批量操作成功'), 2, this.batchOptionCallback);
        } else {
          Modal.error({
            title: t('批量审批处理结果'),
            content: fail.map(item => {
              return (
                <p key={item.key}>
                  {t('编号') +
                    '：' +
                    item.key +
                    '，' +
                    t('失败原因') +
                    '：' +
                    t(item.value)}
                </p>
              );
            }),
            onOk: this.batchOptionCallback
          });
        }
      });
  };

  batchOptionCallback = () => {
    this.search();
    this.setState({
      approveIds: []
    });
  };

  getOptionPlaceholder = () => {
    const { t } = this.props;
    switch (this.state.modal.type) {
      case 'pass':
        return t('请输入审批通过的理由，必填');
      case 'reject':
      case 'batchReject':
        return t('请输入审批驳回的理由，必填');
      case 'batchPass':
        return t('同意');
    }
  };

  handleCancel = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  render() {
    const { t, list } = this.props;
    const { records } = list;
    const tabList = [
      {
        key: 'apply',
        tab: t('我的最近申请')
      },
      {
        key: 'approval',
        tab: t('待审批的申请')
      }
    ];
    const contentList = {
      apply: <MyRecentApply {...this.props} />,
      approval: (
        <ApproveTable
          datas={list}
          onChange={this.handlePageChange}
          onShowDetail={this.handleShowDetail}
          onPass={this.handlePass}
          onReject={this.handleReject}
          onBatchOption={this.handleBatchOption}
        />
      )
    };

    if (records && records.length > 0) {
      records.map(item => {
        return (item.applyTypeName = t(item.applyTypeName));
      });
    }

    return (
      <div className="entrance-page">
        <Row gutter={24}>
          <Col span={6}>
            <Card className="nopadding" bordered={false}>
              {/* <Row gutter={24}>
                <Col span={24} style={{marginBottom: '4px'}}> */}
              <Button
                type="primary"
                className="apply-new"
                onClick={this.goNewApply}
                style={{ width: '100%', height: '58px' }}>
                <Icon type="plus-circle-o" />
                {t('申请新权限')}
              </Button>
              {/* </Col>
                <Col span={12} style={{paddingRight: '2px'}}>
                  <Button type="primary" onClick={this.goBusinessManage} style={{width: '100%', height: '58px'}}>
                    <Icon type="setting" />
                    <span style={{width: '100%', whiteSpace: 'pre-wrap'}}>{t('业务线管理员')}</span>
                  </Button>
                </Col>
                <Col span={12} style={{paddingLeft: '2px'}}>
                  <Button type="primary" onClick={this.goManage} style={{width: '100%', height: '58px'}}>
                    <Icon type="setting" />
                    <span style={{width: '100%', whiteSpace: 'pre-wrap'}}>{t('系统管理员')}</span>
                  </Button>
                </Col>
              </Row> */}
            </Card>
          </Col>
          <Col span={6}>
            <Card className="nopadding" bordered={false}>
              {/* <Row gutter={24}>
                <Col span={24} style={{marginBottom: '4px'}}> */}
              <Button
                type="primary"
                className="apply-new"
                onClick={this.goPackageApply}
                style={{ width: '100%', height: '58px' }}>
                <Icon type="plus-circle-o" />
                {t('申请礼包权限')}
              </Button>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="nopadding" bordered={false}>
              {/* <Row gutter={24}>
                <Col span={24} style={{marginBottom: '4px'}}> */}
              <Button
                type="primary"
                className="apply-new"
                onClick={this.goBusinessManage}
                style={{ width: '100%', height: '58px' }}>
                <Icon type="plus-circle-o" />
                {t('业务线管理员')}
              </Button>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="nopadding" bordered={false}>
              {/* <Row gutter={24}>
                <Col span={24} style={{marginBottom: '4px'}}> */}
              <Button
                type="primary"
                className="apply-new"
                onClick={this.goManage}
                style={{ width: '100%', height: '58px' }}>
                <Icon type="plus-circle-o" />
                {t('系统管理员')}
              </Button>
            </Card>
          </Col>
          {/* <Col span={6}>
            <Card bordered={false}>
              <Row gutter={24}>
                <Col span={6} className="entrance-num" style={{ padding: 0 }}>
                  {t('审批中')}:{this.props.apply.approveingCount||0}
                </Col>
                <Col span={6} className="entrance-num" style={{ padding: 0 }}>
                  {t('已通过')}:{this.props.apply.approveSuccessCount||0}
                </Col>
                <Col span={6} className="entrance-num" style={{ padding: 0 }}>
                  {t('已驳回')}:{this.props.apply.approveFailCount||0}
                </Col>
                <Col span={6} className="entrance-num" style={{ padding: 0 }}>
                  {t('已撤回')}:{this.props.apply.approveWithdrawCount||0}
                </Col>
                <Col span={24} className="entrance-num" style={{ padding: 0, margin: '10px 0' }}>
                  {t('历史上共提交申请数量')}:{this.props.apply.approveTotalCount||0}
                </Col>
                <Col span={24} className="entrance-num" style={{ padding: 0, paddingTop: '12px', borderTop: '1px solid #E8E8E8' }}>
                  <a onClick={this.goApply}>{t('我的申请')}</a>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Row gutter={24}>
                <Col span={8} className="entrance-num" style={{ padding: 0 }}>
                  {t('待审批')}:{this.props.approve.approveingCount}
                </Col>
                <Col span={8} className="entrance-num" style={{ padding: 0 }}>
                  {t('已通过')}:{this.props.approve.approveSuccessCount}
                </Col>
                <Col span={8} className="entrance-num" style={{ padding: 0 }}>
                  {t('已驳回')}:{this.props.approve.approveFailCount}
                </Col>
                <Col span={24} className="entrance-num" style={{ padding: 0, margin: '10px 0' }}>
                  {t('历史上共接收审批数量')}:{this.props.approve.approveTotalCount}
                </Col>
                <Col span={24} className="entrance-num" style={{ padding: 0, paddingTop: '12px', borderTop: '1px solid #E8E8E8' }}>
                  <a onClick={this.goApprove}>{t('我的审批')}</a>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Row gutter={24}>
                <Col span={8} className="entrance-num" style={{ padding: 0 }}>
                  {t('地区')}:{this.props.permission.areaCount||0}
                </Col>
                <Col span={8} className="entrance-num" style={{ padding: 0 }}>
                  {t('标志位')}:{this.props.permission.flagCount||0}
                </Col>
                <Col span={8} className="entrance-num" style={{ padding: 0 }}>
                  {t('指标')}:{this.props.permission.indicatorCount||0}
                </Col>
                <Col span={8} className="entrance-num" style={{ padding: 0 }}>
                  {t('报表')}:{this.props.permission.reportCount||0}
                </Col>
                <Col span={8} className="entrance-num" style={{ padding: 0 }}>
                  {t('模板')}:{this.props.permission.templateCount||0}
                </Col>
                <Col span={8} className="entrance-num" style={{ padding: 0 }}>
                  {t('角色')}:{this.props.permission.roleCount||0}
                </Col>
                <Col span={24} className="entrance-num" style={{ padding: 0 }}>
                  {t('权限点')}:{this.props.permission.menuCount||0}
                </Col>
                <Col span={24} className="entrance-num" style={{ padding: 0, paddingTop: '12px', borderTop: '1px solid #E8E8E8' }}>
                  <a onClick={this.goPermission}>{t('我的权限')}</a>
                </Col>
              </Row>
            </Card>
          </Col> */}
        </Row>
        <Card
          style={{ width: '100%' }}
          tabList={tabList}
          // activeTabKey={this.state.tabKey}
          onTabChange={key => {
            this.onTabChange(key, 'tabKey');
          }}>
          {contentList[this.state.tabKey]}
        </Card>
        {/* <Tabs defaultActiveKey="1">
          <TabPane tab={t('我的最近申请')} key="1">
            <div className="my-apply" >
              <Card
                title = {
                  <CardTitle
                  title={t('我的最近申请')}
                  sub={t('(按照时间排序，展示最新10条申请，点击“我的申请”查看更多)')} >
                  </CardTitle>
                }
              >
                <MyRecentApply {...this.props} />
              </Card>
            </div>
          </TabPane>
          <TabPane tab={t('待审批的申请')} key="2">
            <div className="my-approval" >
              <Card
                title = {
                  <CardTitle
                  title = {t('待审批的申请')}
                  sub = {t('(展示所有状态为“待审批”的申请)')} >
                  </CardTitle>}
              >
                <ApproveTable
                  datas={list}
                  onChange={this.handlePageChange}
                  onShowDetail={this.handleShowDetail}
                  onPass={this.handlePass}
                  onReject={this.handleReject}
                  onBatchOption={this.handleBatchOption}
                />
              </Card>
            </div>
          </TabPane>
        </Tabs> */}

        {/*没有放这两个表格进去 1. 选择完成才能筛选数据 2风格不统一*/}
        {/*<MyRolePermission />*/}
        {/*<MyDataPermission />*/}

        <Modal
          title={this.state.modal.title}
          style={this.state.modal.style}
          visible={this.state.modal.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              {t('取消')}
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={this.props.loading}
              onClick={this.handleOk}>
              {t('确定')}
            </Button>
          ]}>
          <TextArea
            required
            value={this.state.reason}
            placeholder={
              this.state.modal.type == 'pass'
                ? t(PASS_PLACEHOLDER)
                : t(REJECT_PLACEHOLDER)
            }
            autosize={{ minRows: 2, maxRows: 6 }}
            onChange={this.handleReasonChange}
          />
        </Modal>
      </div>
    );
  }
}

export default translate()(
  connect(({ entrance, global, approveList }) => {
    return {
      ...entrance,
      ...approveList,
      global
    };
  })(Entrance)
);
