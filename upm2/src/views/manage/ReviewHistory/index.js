import React, { Component } from 'react';
import { Button, Form, Input, Table, Row, Col, Select, Card, DatePicker, message, Tooltip} from 'antd';
import connect from '@utils/translateConnect';
import CardTitle from '@components/CardTitle';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { MANAGE } from '@routes/config';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
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


const TableStyle = {
  buttonSize: 'small'
};
const transferOptions = (data) => {
  const options = [];
  data.forEach((option) => {
    const newOption = {};
    newOption.key = `${option.id}`,
      newOption.value = `${option.id}`,
      newOption.label = option.name,
      newOption.children = option.children ? transferOptions(option.children) : null;
    options.push(newOption);
  });
  return options;
};



class ReviewHistory extends Component {
  state = {
    current: 1,
    name: '',
    op: '',
    startTime: moment().subtract(1, 'month'),
    endTime: moment(),
    nowReviewModel: {},
    visibleCopy: false,
    modalVisible: false,
    visibleStart: false,
    editingId: '',
    selectedType: '',
    treeData: [],
    reviewDays: 0,
    appId: 888,
    reviewAppList: [],
    radioRole: 0,
    radioArea: 0,
    radioBu: 0,
    radioFlag: 0,
    disableCustom: false,
    permissionRiskLevelList: []
  };
  copyReviewTxt = ''
  componentDidMount() {
    const { fetchReviewAppList } = this.props;
    fetchReviewAppList().then(res => {
      if (res.success && res.result && res.result.length) {
        this.setState({
          reviewAppList: res.result,
          appId: res.result[0].id
        }, () => {
          this.handleFetch(1);
        })
      }
    });
  }

  handlePageChange = (page = 1) => {
    this.handleFetch(page);
    this.setState({
      current: page
    })
  }

  handleFetch = (page) => {
    const {
      name,
      op,
      startTime,
      endTime,
      appId
    } = this.state;
    const {t} = this.props
    if(!startTime){
      message.error(t('请选择时间'), 5);
      return;
    }
    this.props.fetchData({
      name,
      op,
      startTime,
      endTime,
      page,
      appId: 888,
      reviewAppId: appId
    });
  };

  handleSearchFieldChange = (event, fieldName) => {
    this.setState({
      [fieldName]: event.target.value
    });
  };





  getColumns = () => {
    const {
      t
    } = this.props;

    const columns = [{
      title: t('ID'),
      dataIndex: 'id',
      key: 'id',
      width: 80
    }, {
      title: t('权限审核名称'),
      dataIndex: 'name',
      key: 'name',
    }, {
      title: t('目标系统'),
      dataIndex: 'appNames',
      key: 'appNames'
    }, {
      title: t('权限审核目的'),
      dataIndex: 'purpose',
      key: 'purpose',
      width: 200,
      ellipsis: true,
      render: (text) => {
        if (text.length > 10) {
          return <Tooltip title={text}>
                  <span className="table__coloumn--ellipsis">{text}</span>
                </Tooltip>
        } else {
          return <span>{text}</span>
        }
      }
    }, {
      title: t('实际权限审核用户数'),
      dataIndex: 'totalUsers',
      key: 'totalUsers'
    }, {
      title: t('权限默认'),
      dataIndex: 'defaultPermissionStatus',
      key: 'defaultPermissionStatus',
      render: (text) => {
        if (text === 0) {
          return t('保留');
        } else if (text === 1) {
          return t('删除')
        } else {
          return ''
        }
      }
    // }, {
    //   title: t('剩余时间'),
    //   dataIndex: 'remainDays',
    //   key: 'remainDays',
    //   render:(text)=>{
    //     return text+t('天');
    //   }
    }, {
      title: t('发起人'),
      dataIndex: 'byUser',
      key: 'byUser'
    }, {
      title: t('权限审核人账号'),
      dataIndex: 'approveUser',
      key: 'approveUser',
    }, {
      title: t('当前状态'),
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (text === 0) {
          return t('已结束');
        } else if (text === 1) {
          return t('未启动')
        } else if (text === 2) {
          return t('上级审核')
        } else if (text === 3) {
          return t('审核人审核')
        } else {
          return ''
        }
      }
    }, {
      title: t('启动时间'),
      dataIndex: 'startedAt',
      key: 'startedAt',
      render: (text) => {
        return moment(text).format('YYYY-MM-DD HH:mm')
      }
    }, {
    title: t('操作'),
    key: 'action',
    render: (text, record) => {
      return (
          <Button size={TableStyle.buttonSize} onClick={() => this.showDetail(record)}>{t('详情')}</Button>
      )
    }
    }];

    return columns;
  };


  showDetail = (obj) => {
    this.props.dispatch(routerRedux.push(`${MANAGE}/review/detail?id=${obj.id}`));
    return;
  }

  onDaysChange = (e) => {
    const reviewDays = e.target.value;

    this.setState({
      reviewDays
    })
  }
  onChangeState = (state) => {
    this.setState(state, () => {
    });
  };
  render() {
    const {
      name,
      op,
      current,
      startTime, endTime,
      editingId,
      appId,
      reviewAppList,
    } = this.state;

    const {
      data,
      form,
      t,
      availableApps
    } = this.props;
    let addAllSystem = [];
    addAllSystem.push({ id: 0, name: '全部' });
    for (let index in availableApps) {
      addAllSystem.push(availableApps[index])
    }

    const {
      // current,
      pages,
      size,
      total,
      records
    } = data;

    const { getFieldDecorator } = form;
    const isviewing = !!editingId;

    return (
      <div className="workflow-page">
        <Card title={< CardTitle title={t('权限审核历史查询')} > </CardTitle>} bordered={false}>
          <Row gutter={24} className="search-fields">
            <Col span={8}>
              <FormItem label={t('目标系统')}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  value={appId}
                  style={{ width: '100%' }}
                  onChange={(appId) => this.onChangeState({ appId })}
                >
                  {reviewAppList.map((bus) => (
                    <Option
                      key={bus.id}
                      value={bus.id}
                    >
                      {bus.id ? bus.name : t('全部')}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={t('权限审核名称')}>
                <Input
                  placeholder={t('请输入关键字进行模糊搜索')}
                  value={name}
                  onChange={(e) => this.handleSearchFieldChange(e, 'name')}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={t('发起人')}>
                <Input
                  placeholder={t('请输入关键字进行模糊搜索')}
                  value={op}
                  onChange={(e) => this.handleSearchFieldChange(e, 'op')}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={t('启动时间') + '：'} {...formItemLayout}>
                <RangePicker
                  value={[startTime, endTime]}
                  onChange={(date) => this.onChangeState({ startTime: date[0], endTime: date[1] })}
                />
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem label="">
                <Button
                  type="primary"
                  onClick={() => this.handlePageChange()}>
                  {t('查询')}
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Card>

        <Card title={t('权限审核列表')} bordered={false} className="workflow-list">
          <Table
            rowKey="id"
            className="upm-table"
            columns={this.getColumns()}
            dataSource={records}
            pagination={{
              current,
              pageSize: size,
              hideOnSinglePage: true,
              total,
              onChange: this.handlePageChange
            }}
          />
        </Card>

      </div>
    );
  }
}

export default connect(({ manageReview, global }) => {
  return {
    data: manageReview.list,
    departments: manageReview.departments,
    availableApps: global.availableApps,
    appbindedbusiness: manageReview.appbindedbusiness,
    resourceList: manageReview.resourceList,
  };
}, (dispatch) => ({
  dispatch(params) {
    return dispatch(params);
  },
  fetchData(params) {
    dispatch({
      type: 'manageReview/fetchHistory',
      payload: params
    });
  },
  fetchReviewDetail(params) {
    return dispatch({
      type: 'manageReview/fetchReviewDetail',
      payload: params
    })
  },
  fetchReviewAppList(params) {
    return dispatch({
      type: 'manageReview/fetchReviewAppList',
      payload: params
    })
  }
}))(Form.create()(ReviewHistory));
