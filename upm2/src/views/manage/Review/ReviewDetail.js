import React from 'react';
import connect from '@utils/translateConnect';
import { Form, Card, Row, Col, Select, Button, Tree, message, Descriptions, Progress, Table, Tag, Tooltip, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import { MANAGE } from '@routes/config';
import moment, { min } from 'moment';
import request from '@utils/request';
import { apiHost } from '@config/apiConfig';
import _ from 'lodash';
import './index.less'


class ReviewDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baseInfo: {
        id: '',
        name: '',
        status: '',
        purpose: '',
        // riskLevel: '',
        appName: '',
        permissions: '',
        byUser: '',
        createdAt: '',
        remainDays: '',
        progress: 0,
        reviewTarget:'',
        totalUsers:0,
        approveUser: '',
        approveDeadline: '',
        reviewDeadline: '',
        approveFinished: '',
        finished: 0,
        total: 0,
        permissionsDisp: []
      },
      current: 1,
      datas: [],
      reviewId: null,
      records: [],
      size: 10,
      total: 10,
      selectedRows: []
    }
    const { t } = this.props;
    this.permissionTypeEnums = {
      0: t('全部'),
      2: t('角色'),
      7: t('标识位'),
      1: t('地区')
    }
      ;
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    const arr = location.search.split('?')[1].split('&').reduce((total, i) => { total[i.split('=')[0]] = i.split('=')[1]; return total }, {});
    this.setState({
      reviewId: arr.id
    }, this.handleFetch);
    dispatch({
      type: 'manageReview/fetchReviewDetail',
      payload: {
        appId: 888,
        id: arr.id
      }
    }).then(res => {
      if (res.success) {
        const { totalUsers,permissionTypeList, id, name, status, purpose, appId, reviewTarget, areaList, roleList,
          flagList, byUser, createdAt, remainDays, finished, total, appNames, percent, approveUser, approveDeadline,
          approveFinished, reviewDeadline,permissionsDisp } = res.result;
        const rolePermissions = roleList ? roleList.map(item => {
          return t('角色') + '-' + item.nameZh
        }) : [];
        const areaPermissions = areaList ? areaList.map(item => {
          return t('地区') + '-' + item.name
        }) : [];
        const flagPermissions = flagList ? flagList.map(item => {
          return t('标识位') + '-' + item.nameZh
        }) : [];
        let permissionsTmp = [];
        for (let index in permissionTypeList) {
          permissionsTmp.push(this.permissionTypeEnums[permissionTypeList[index]]);
        }
        const permissions = permissionsTmp.concat(rolePermissions, areaPermissions, flagPermissions).join(',');
        this.setState({
          baseInfo: {
            id,
            name,
            status: status ? <span style={{ color: '#ff7d4c' }}>{t('进行中')}</span> : <span style={{ color: '#ccc' }}>{t('已结束')}</span>,
            purpose,
            // riskLevel: 'C1',
            appName: appNames,
            permissions,
            byUser,
            totalUsers,
            reviewTarget,
            createdAt: moment(createdAt).format('YYYY-MM-DD HH:mm'),
            remainDays,
            progress: percent,
            approveUser,
            approveDeadline,
            approveFinished,
            reviewDeadline,
            finished,
            total,
            permissionsDisp
          }
        })
      }
    })
  }

  returnList = () => {
    const { dispatch } = this.props;

    dispatch(routerRedux.push(`${MANAGE}/review/list`));
  }

  handlePageChange = (page = 1) => {
    this.handleFetch(page);
    this.setState({
      current: page
    })
  };

  handleFetch = (page) => {
    this.props.dispatch({
      type: 'manageReview/fetchReviewManagers',
      payload: {
        page: page || 1,
        size: 20,
        id: this.state.reviewId,
        appId: 888
      }
    }).then(res => {
      if (res.success) {
        const { size, total, records } = res.result;
        this.setState({
          size,
          total,
          records
        })
      }
    })
  };
  getColumns = () => {
    const {
      t
    } = this.props;

    const columns = [{
      title: t('权限审核审批人'),
      dataIndex: 'managerName',
    }, {
      title: t('所属部门'),
      dataIndex: 'deptName',
    },
    {
      title: t('实际权限审核总用户数'),
      dataIndex: 'totalUsers',
    },
    {
      title: t('待权限审核用户数'),
      dataIndex: 'doing',
    }, {
      title: t('权限审核进度'),
      dataIndex: 'percent',
      width: 180,
      render: (text, record) => {
        return <Progress percent={text} size="small" />
      }
    }];

    return columns;
  };

  deleteSelectdRows = (item) => {
    let { selectedRows } = this.state;
    if (_.isArray(item)) {
      item.forEach(item => {
        _.remove(selectedRows, (i) => item.managerName === i.managerName);
      });
    } else {
      _.remove(selectedRows, (i) => item.managerName === i.managerName);
    }
    this.setState({
      selectedRows: [
        ...selectedRows
      ]
    });
  }

  selectAll = () => {
    const { reviewId } = this.state;
    request(`/v2/permissionreview/detail/managers/allDoing?id=${reviewId}&appId=888`).then(res => {
      this.setState({
        selectedRows: res
      });
    })
  }

  notice = () => {
    const { dispatch, t } = this.props;
    const { reviewId, selectedRows } = this.state;
    if (selectedRows.length) {
      dispatch({
        type: 'manageReview/notice',
        payload: {
          appId: 888,
          id: reviewId,
          managerNames: selectedRows.map(item => item.managerName)
        }
      }).then(res => {
        if (res.success) {
          message.destroy();
          message.success(t('通知成功'), 2);
        } else {
          message.destroy();
          message.error(t('通知失败，请联系管理员'), 2);
        }
      })
    } else {
      message.destroy();
      message.error(t('请选择需要通知的审批人'), 2);
    }
  }

  approveNotice = () => {
    const { dispatch, t } = this.props;
    const { reviewId } = this.state;
    dispatch({
      type: 'manageReview/approveNotice',
      payload: {
        appId: 888,
        id: reviewId
      }
    }).then(res => {
      if (res.success) {
        message.destroy();
        message.success(t('通知成功'), 2);
      } else {
        message.destroy();
        message.error(t('通知失败，请联系管理员'), 2);
      }
    })
  }

  render() {
    const { t } = this.props;
    const { baseInfo, current, size, total, records, selectedRows, reviewId } = this.state;
    const desList = [ {
      label: 'name',
      name: t('权限审核名称')
    }
    , {
      label: 'purpose',
      name: t('权限审核目的')
    }
    , {
      label: 'status',
      name: t('当前状态')
    }
    ,
    {
      label: 'byUser',
      name: t('发起人')
    },
    {
      label: 'appName',
      name: t('目标系统')
    },
    {
      label: 'reviewTarget',
      name: t('权限审核范围')
    }, {
      label: 'createdAt',
      name: t('发起时间')
    }
    , {
      label: 'totalUsers',
      name: t('实际权限审核用户数')
    }, {
      label: 'permissionsDisp',
      name: t('权限审核权限')
    }, {
      label: 'approveUser',
      name: t('权限审核人')
    }];
    const rowSelection = {
      selectedRowKeys: selectedRows.map(item => item.managerName),
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRows });
      },
      getCheckboxProps: record => ({
        disabled: record.percent==100,
      }),
    };
    return (
      <div className="ManagePermissionGroupPoint">
        <Card title={t('权限审核列表') + '|' + baseInfo.name + t('详情')} bordered={false} extra={<Button onClick={this.returnList}>{t('返回列表')}</Button>}>
          <Descriptions title={t('基本信息')} column={2} bordered={true}>
            {desList.map(item => {
              return <Descriptions.Item label={item.name} key={item.label}>{item.label ? baseInfo[item.label] : ''}</Descriptions.Item>
            })}
          </Descriptions>

          <Card
            type="inner"
            title={t('权限审核进度')}
            style={{ marginTop: 20 }}
          >
            <Row>
              <Col span={3}>
                {t('权限审核截止时间') + ': '}
              </Col>
              <Col span={21}>
                {/* {baseInfo.reviewDeadline} */}
                {baseInfo.reviewDeadline ? moment(baseInfo.reviewDeadline).format('YYYY-MM-DD HH:mm:ss') : ''}
              </Col>
            </Row>
            <Row>
              {/* <Col span={3}>
                {t('剩余天数') + ': '}
              </Col>
              <Col span={21}>
                {baseInfo.remainDays + '(' + t('天') + ')'}
              </Col> */}
              <Col span={3}>
                {t('权限审核进度')}
                <Tooltip title={t('完成权限审核的用户数') + '/' + t('被发起权限审核的用户数')}>
                  <Icon type="question-circle-o" />
                </Tooltip>
                {': '}
              </Col>
              <Col span={3}>
                {/* <Progress percent={baseInfo.progress} /> */}
                <span>
                  {baseInfo.finished + '/' + baseInfo.totalUsers}
                </span>
              </Col>
              <Col span={18} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={this.selectAll} style={{ marginRight: 10 }}>{t('一键全选')}</Button>
                <Button type="primary" onClick={this.notice} style={{ marginRight: 10 }}>{t('邮件提醒')}</Button>
                <Button onClick={() => {
                  window.open(`${apiHost}/v2/permissionreview/detail/export?id=${reviewId}&appId=888`)
                }}>{t('导出数据')}</Button>
              </Col>
            </Row>
            <Table
              rowKey="managerName"
              columns={this.getColumns()}
              rowSelection={rowSelection}
              style={{ marginTop: 20 }}
              className="upm-table"
              dataSource={records}
              pagination={{
                current,
                pageSize: size,
                hideOnSinglePage: true,
                total,
                onChange: this.handlePageChange
              }}
            />
            <div className="selected-wrap" style={{ maxWidth: 800 }}>
              <label>{t('已选：')}</label>
              {selectedRows.map(item => (<Tag key={item.managerName} closable onClose={() => { this.deleteSelectdRows(item) }}>{item.managerName}</Tag>))}
            </div>
          </Card>
          {baseInfo.approveUser ?
            <Card
            type="inner"
            title={t('审核进度')}
            style={{ marginTop: 20 }}>
              <Row>
                <Col span={3}>
                  {t('审核截止时间') + ': '}
                </Col>
                <Col span={21}>
                  {/* {baseInfo.approveDeadline} */}
                  {baseInfo.approveDeadline ? moment(baseInfo.approveDeadline).format('YYYY-MM-DD HH:mm:ss') : ''}
                </Col>
              </Row>
              <Row>
                <Col span={3}>
                  {t('审核进度')}
                  <Tooltip title={t('完成审核的用户数') + '/' + t('完成权限审核的用户数') + '/' + t('被发起权限审核的用户数')}>
                    <Icon type="question-circle-o" />
                  </Tooltip>
                  {': '}
                </Col>
                <Col span={3}>
                  <span>
                    {baseInfo.approveFinished + '/' + baseInfo.finished + '/' + baseInfo.totalUsers}
                  </span>
                </Col>
                <Col span={18} style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={this.approveNotice} style={{ marginRight: 10 }}>{t('邮件提醒')}</Button>
                </Col>
              </Row>
            </Card>
          : null}
        </Card>
      </div>
    );
  }
}

export default connect(({ global }) => {
  return {
    apps: global.apps
  };
})(ReviewDetail);
