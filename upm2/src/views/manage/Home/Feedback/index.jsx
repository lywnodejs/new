import React from 'react';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, DatePicker, Select, Button, Table, Modal, Icon, message } from 'antd';
import AvailableApps from '@/components/AvailableApps';
import Panel from '../components/Panel';
import moment from 'moment';
import { apiHost } from '@config/apiConfig';
import TextButton from '../../../../components/TextButton';
import './index.less';
import { postJSON } from '@utils/request';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const { Column } = Table;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

class Feedback extends React.Component {
  state = {
    feedbackType: '',
    currentPage: 1,
    pageSize: 20,
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
    feedbackList: [
      {
        label: '全部',
        value: ''
      },
      {
        label: '批评者（0-6分）',
        value: 'isDetractor'
      },
      {
        label: '中立者（7-8分）',
        value: 'isNeutral'
      },
      {
        label: '赞扬者（9-10分）',
        value: 'isPromoter'
      },
    ],
    feedbackSources: [
      {
        label: '全部',
        value: ''
      },
      {
        label: '全局反馈体验',
        value: '1'
      },
      {
        label: '申请体验反馈',
        value: '2'
      },
      {
        label: '审批体验反馈',
        value: '3'
      },
    ],
    startTime: moment().subtract(7, 'days'),
    endTime: moment(),
    username: '',
    visible: false,
    tableList: [],
    type: '',
    feedbackContent: '',
    feedType: '', //反馈来源
    grades: []
  }

  constructor(props) {
    super(props);
  }

  componentWillMount () {
    const HHEIGHT = 64;
    const PADDING = 10;
    const wheight = window.innerHeight || document.documentElement.clientHeight;
    this.dheight = wheight - HHEIGHT - PADDING * 2;
  }

  componentDidMount () {
    this.fetchFeedbackList();
    this.props.fetchNpsGradeList();
  }

  // componentWillReceiveProps () {
  //   this.fetchFeedbackList();
  // }

  handleSystemChange = () => {
    this.props.getRealTimeStats(this.props.appId).then(data => {
      this.setState({
        stats: data
      });
    }).then(() => {
      this.fetchFeedbackList();
    });
  }

  // 翻页事件
  handlePageChange = (page) => {
    this.setState({
      currentPage: page
    }, () => {
      this.fetchFeedbackList(page);
    });
  };

  onShowSizeChange = (current, size) => {
    this.setState({
      currentPage: current,
      pageSize: size
    }, () => {
      this.fetchFeedbackList();
    });
  }

  exportFeedbackList = () => {
    let query = [
      `appId=${this.props.appId}`
    ];
    'username,startTime,endTime,grades'.split(',').forEach(item => {
      if (this.state[item] !== '') {
        if (item === 'grades') {
          query.push(`${item}=${this.state[item].join(',')}`);
        } else if (item === 'startTime' || item === 'endTime') {
          let time = this.state[item] ? moment(this.state[item]).format('YYYY-MM-DD') : '';
          query.push(`${item}=${time}`);
        } else {
          query.push(`${item}=${this.state[item]}`);
        }

      }
    });
    window.open(`${apiHost}/nps/feedBackExport?${query.join('&')}`);
  };

  fetchFeedbackList = (page = 1) => {
    const {
      username,
      startTime,
      endTime,
      currentPage,
      pageSize,
      feedType,
      grades
    } = this.state;
    const { feedbackType } = this.state;
    let params = null;
    params = {
      page,
      size: pageSize,
      username,
      startTime: startTime ? moment(startTime).format('YYYY-MM-DD') : '',
      endTime: endTime ? moment(endTime).format('YYYY-MM-DD') : '',
      appId: this.props.appId,
      feedbackType: feedType,
      grades
    };
    this.props.fetchFeedbackList(params);
  }

  handleQuery = () => {
    this.setState({
      currentPage: 1
    });
    this.fetchFeedbackList();
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      type: '',
      feedbackContent: ''
    });
    this.fetchFeedbackList();
  };

  addTableData = (record) => {
    const { feedbackContent, type, tableList } = this.state;
    const { t, appId, trackList } = this.props;
    let params = {
      feedbackContent,
      feedbackType: type,
      feedbackId: record.id,
      appId
    };

    if (feedbackContent == '' || type == '') {
      message.error(t('请输入跟踪类型和跟踪内容'));
      return;
    }

    // const index = tableList.findIndex((item) => item === record);
    postJSON('/nps/npsTracking/add', params).then(() => {
      message.success(t('添加成功'));
    }).then(() => {
      this.props.fetchFeedbackRecord({
        feedbackId: record.id,
        appId: appId
      }).then(() => {
        tableList.splice(1, tableList.length - 2, ...this.props.trackList);
        this.setState({
          tableList: [...tableList]
        });
      });
    });
  }

  deleteTableData = (record) => {
    const { t, appId } = this.props;
    let { tableList } = this.state;
    const index = tableList.findIndex((item) => item === record);

    tableList.splice(index, 1);
    this.props.deleteFeedbackTrack({
      id: record.id,
      appId
    }).then(() => {
      message.success(t('删除成功'));
      this.setState({
        tableList: [...tableList]
      });
    });
  }

  onChangeState = (state) => {
    this.setState(state, () => {
      // console.log(this.state);
    });
  }

  render () {
    const {
      data, t,
      // apply
    } = this.props;
    const {
      total,
      records,
      loading,
      tableLoading,
      npsGradeList
    } = data;
    const { feedbackType, feedbackList, tableList, feedbackSources, feedType } = this.state;
    const { startTime, endTime } = this.state;

    return (
      <div className="manage-dashboard" style={{ height: this.dheight + 'px' }}>
        <div className="manage-dashboard__header">
          <Row>
            <Col span={8}>
              <Form.Item label={t('当前系统')}>
                <AvailableApps hideClosed={true} style={{ width: 200 }} changeCallBack={this.handleSystemChange} />
              </Form.Item>
            </Col>
          </Row>
          <Panel>
            <Row gutter={24} className="search-fields">
              <Col span={6}>
                <Form.Item label={t('用户名：')}>
                  <Input
                    placeholder={t('输入用户名搜索')}
                    onChange={(e) => this.setState({
                      username: e.target.value
                    })
                    } />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label={t('反馈类型')}>
                  <Select
                    // showSearch
                    mode="multiple"
                    placeholder='请选择（可多选）'
                    defaultValue={[]}
                    style={{ width: '100%' }}
                    onChange={(grades) => {
                      this.setState({
                        // grade: grade.join(',')
                        grades
                      });
                    }}
                  >
                    {
                      npsGradeList.map(item => {
                        return (
                          <Option key={item.grade} value={item.grade}>
                            {t(item.emotion + '（' + item.gradeName + '）')}
                          </Option>
                        );
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label={t('反馈来源')}>
                  <Select
                    showSearch
                    defaultValue={feedType}
                    style={{ width: '100%' }}
                    onChange={(feedType) => {
                      this.setState({
                        feedType: feedType
                      });
                    }}
                  >
                    {
                      feedbackSources.map(item => {
                        return (
                          <Option key={item.value} value={item.value}>
                            {item.label}
                          </Option>
                        );
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={t('反馈时间') + '：'} {...formItemLayout}>
                  <RangePicker
                    value={[startTime, endTime]}
                    onChange={(date) => this.onChangeState({ startTime: date[0], endTime: date[1] })}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <Button
                    type="primary"
                    className="btn first-btn"
                    onClick={() => this.handleQuery()}>
                    {t('查询')}
                  </Button>
                  <Button
                    type="primary"
                    className="btn first-btn"
                    onClick={() => this.exportFeedbackList()}>
                    {t('导出')}
                  </Button>
                </Form.Item>
              </Col>

            </Row>

            <Table
              dataSource={records}
              size="small"
              pagination={{
                current: this.state.currentPage,
                pageSize: this.state.pageSize,
                hideOnSinglePage: true,
                total,
                showQuickJumper: true,
                showTotal: (total) => {
                  return '共 ' + total + ' 条';
                },
                showSizeChanger: true,
                onChange: this.handlePageChange,
                onShowSizeChange: this.onShowSizeChange
              }}
              className="upm-table"
              key="firstTable"
              loading={loading}
            >
              <Column title={t('ID')} width={50} dataIndex="id" key="id" />
              <Column title={t('用户名')} width={50} dataIndex="username" key="username" />
              <Column title={t('评分')} width={50} dataIndex="grade" key="grade" />
              <Column title={t('反馈类型')} width={50} dataIndex="feedbackUserType" key="feedbackUserType" />
              <Column title={t('反馈内容')} width={100} dataIndex="feedbackContent" key="feedbackContent" />
              <Column title={t('反馈来源')} width={60} dataIndex="feedbackType" key="feedbackType" render={(value) => {
                let text = '';
                if (value) {
                  // feedbackSources.map(item => {
                  //   if (value == item.value) {
                  //     text = item.label;
                  //   }
                  // });
                  text = feedbackSources.find(item => value == item.value).label || ''
                }
                return text;
              }} />
              <Column title={t('反馈时间')} width={100} dataIndex="createdAt" key="createdAt" render=
                {(time) => {
                  return moment(time).format('YYYY-MM-DD HH:mm');
                }} />
              <Column title={t('是否回访')} width={50} dataIndex="isProcessed" key="isProcessed" render={(value) => {
                if (value) {
                  return '是';
                } else {
                  return '否';
                }
              }} />
              <Column title={t('回访人')} width={50} dataIndex="processor" key="processor" render=
                {(processor) => {
                  if (processor) { return processor; } else { return '-'; }
                }} />
              <Column
                title={t('操作')} width={50} dataIndex="operate" key="operate"
                render={(text, record) => {
                  return <TextButton onClick={() => {
                    this.setState({
                      visible: true
                    });
                    let addData = {
                      addRow: true,
                      username: this.props.username,
                      usernameZh: this.props.usernameZh,
                      createdAt: moment().format('YYYY-MM-DD HH:mm'),
                      id: record.id
                    };
                    this.props.fetchFeedbackRecord({
                      feedbackId: record.id,
                      appId: this.props.appId
                    }).then(() => {
                      const tractList = this.props.data.trackList;
                      this.setState({
                        tableList: [record, ...tractList, addData]
                      });
                    });
                    record.isBase = true;

                  }}>跟踪详情</TextButton>;
                }}
              />
            </Table>
          </Panel>
          <Modal
            title="跟踪详情"
            width={800}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Table
              dataSource={tableList}
              size="small"
              className="upm-table"
              key="secondTable"
              style={{ marginRight: '30px' }}
              loading={tableLoading}
              pagination={false}
            // loading={loading}
            >
              <Column title={t('类型')} width={50} dataIndex="feedbackType" key="feedbackType" render=
                {(text, record) => {
                  if (record.addRow) {
                    return (<Input
                      onChange={(e) => this.setState({
                        type: e.target.value
                      })
                      } />);
                  } else {
                    return record.isBase ? '原始问题' : record.feedbackType;
                  }
                }} />
              <Column title={t('用户名')} width={50} dataIndex="username" key="username" />
              <Column title={t('姓名')} width={50} dataIndex="usernameZh" key="usernameZh" />
              <Column title={t('跟踪内容')} width={50} dataIndex="feedbackContent" key="feedbackContent" render=
                {(text, record) => {
                  if (record.addRow) {
                    return (<Input
                      onChange={(e) => this.setState({
                        feedbackContent: e.target.value
                      })
                      } />);
                  } else {
                    return record.isBase ? '' : record.feedbackContent;
                  }
                }} />
              <Column title={t('日期')} width={50} dataIndex="createdAt" key="createdAt_" render=
                {(time, record) => {
                  if (record.addRow) {
                    return (
                      <p style={{ position: 'reletive' }}>
                        {moment(time).format('YYYY-MM-DD HH:mm')}
                        <Icon className="addTableData" type="plus-circle" onClick={() => this.addTableData(record)} />
                      </p>
                    );
                  } else {
                    if (record.isBase) {
                      return moment(time).format('YYYY-MM-DD HH:mm');
                    } else {
                      return (
                        <p style={{ position: 'reletive' }}>
                          {moment(time).format('YYYY-MM-DD HH:mm')}
                          <Icon className="addTableData" type="minus-circle" onClick={() => this.deleteTableData(record)} />
                        </p>
                      );
                    }
                  }
                }} />
            </Table>
          </Modal>
        </div>
      </div>
    );
  }
}

export default connect(({ global, userInfo, userFeedback }) => ({
  username: userInfo.username,
  usernameZh: userInfo.usernameZh,
  appId: global.managingAvailableApp,
  data: userFeedback,
  trackList: userFeedback.trackList,
  global
}), (dispatch) => ({
  getRealTimeStats (appId) {
    return dispatch({
      type: 'dashboard/getRealTimeStats',
      payload: appId
    });
  },
  fetchFeedbackList (params) {
    return dispatch({
      type: 'userFeedback/fetchFeedbackList',
      payload: params
    });
  },
  fetchFeedbackRecord (params) {
    return dispatch({
      type: 'userFeedback/fetchFeedbackRecord',
      payload: params
    });
  },
  addFeedbackTrack (params) {
    return dispatch({
      type: 'userFeedback/addFeedbackTrack',
      payload: params
    });
  },
  deleteFeedbackTrack (params) {
    return dispatch({
      type: 'userFeedback/deleteFeedbackTrack',
      payload: params
    });
  },
  fetchNpsGradeList () {
    return dispatch({
      type: 'userFeedback/fetchNpsGradeList'
    })
  }
}))(Feedback);