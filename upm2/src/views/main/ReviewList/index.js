/*
 * @Author: unknown
 * @Date: unknown
 * @LastEditors: GuoTeng
 * @LastEditTime: 2020-11-16 15:54:47
 */
import React, { Component } from 'react';
import {
  Button,
  Form,
  Input,
  Card,
  Table,
  DatePicker,
  Col,
  Row,
  Progress,
  Tooltip,
  Icon
} from 'antd';
import TextButton from '../../../components/TextButton';
import moment from 'moment';
import connect from '@utils/translateConnect';
import './index.less';
import { routerRedux } from 'dva/router';
import { MAIN } from '@routes/config';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const defaultFilterParams = {
  name: '',
  op: '',
  timeRange: [moment().subtract(1, 'years'), moment()]
};
class ReviewList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterParams: {
        ...defaultFilterParams
      },
      dataSource: [],
      pageCurrent: 1, // 当前页数
      pageSize: 10
      // startTime: moment().subtract(1, 'years'),
      // endTime: moment()
      // detailNow: {}
    };
  }

  componentDidMount() {
    const { match, dispatch, t } = this.props;
    const { reviewId } = match.params;

    if (reviewId) {
      dispatch({
        type: 'manageReview/fetchReviewDetail',
        payload: {
          appId: 888,
          id: reviewId
        }
      }).then(({ success, result }) => {
        if (success) {
          this.showDetail(result);
        } else {
          this.showDetail({
            id: reviewId,
            name: t('权限审核')
          });
        }
      });
    }
    this.getReviewList();
  }

  /**
   * 获取review列表
   */
  getReviewList = () => {
    const { dispatch } = this.props;
    const { pageCurrent, pageSize, filterParams } = this.state;

    const params = {
      ...filterParams,
      startTime: filterParams.timeRange[0].valueOf(),
      endTime: filterParams.timeRange[1].valueOf(),
      page: pageCurrent,
      size: pageSize,
      appId: 888
    };
    delete params.timeRange;
    dispatch({
      type: 'review/fetchReviewList',
      payload: params
    });
  };

  /**
   * 搜索
   * @param {*} e
   */
  handleSearch = e => {
    if (e) {
      e.preventDefault();
    }

    const { form } = this.props;

    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      this.setState(
        {
          pageCurrent: 1,
          filterParams: values
        },
        () => {
          this.getReviewList();
        }
      );
    });
  };

  /**
   * 重置
   */
  handleReset = () => {
    this.props.form.resetFields();
    this.setState(
      {
        filterParams: { ...defaultFilterParams },
        pageCurrent: 1
      },
      () => {
        this.getReviewList();
      }
    );
  };

  /**
   * 获取列表-列信息
   */
  getColumns = () => {
    const { t } = this.props;
    let columns = [
      {
        title: t('ID'),
        dataIndex: 'id',
        width: 80
      },
      {
        title: t('权限审核名称'),
        dataIndex: 'name'
      },
      {
        title: t('权限审核目的'),
        dataIndex: 'purpose',
        ellipsis: true,
        width: 200,
        render: text => {
          if (text.length > 10) {
            return (
              <Tooltip title={text}>
                <span className="table__coloumn--ellipsis">{text}</span>
              </Tooltip>
            );
          } else {
            return <span>{text}</span>;
          }
        }
      },
      {
        title: t('当前状态'),
        dataIndex: 'status',
        render: text =>
          text ? (
            <span style={{ color: '#ff7d4c' }}>{t('进行中')}</span>
          ) : (
            <span style={{ color: '#ccc' }}>{t('已结束')}</span>
          )
      },
      {
        title: t('剩余天数'),
        dataIndex: 'remainDays'
      },
      {
        title: t('发起人'),
        dataIndex: 'byUser'
      },
      {
        title: t('发起时间'),
        dataIndex: 'createdAt',
        render: text => {
          return moment(text).format('YYYY-MM-DD HH:mm');
        }
      },
      {
        title: t('权限默认'),
        dataIndex: 'defaultPermissionStatus',
        key: 'defaultPermissionStatus',
        render: text => {
          if (text === 0) {
            return t('保留');
          } else if (text === 1) {
            return t('删除');
          } else {
            return '';
          }
        }
      },
      {
        // title: t('review进度'),
        title: (
          <span>
            {t('审核进度')}&nbsp;
            <Tooltip title={t('权限审核完成人数') + '/' + t('权限审核总人数')}>
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        ),
        dataIndex: 'percent',
        render: (text, record) => {
          // return <Progress percent={text} size="small" />
          return <span>{record.finished + ' / ' + record.totalUsers}</span>;
        }
      },
      {
        title: t('操作'),
        key: 'action',
        width: 80,
        render: (text, record) => {
          return (
            <TextButton onClick={() => this.showDetail(record)}>
              {t('审核')}
            </TextButton>
          );
        }
      }
    ];

    return columns;
  };

  /**
   * 审核操作
   * @param {object} record
   */
  showDetail = record => {
    this.props.dispatch(
      routerRedux.push(MAIN + '/mini_approve/review/review-detail/' + record.id)
    );
  };

  /**
   * 翻页
   * @param {number} current
   */
  handlePageChange = current => {
    this.setState(
      {
        pageCurrent: current
      },
      () => {
        this.getReviewList();
      }
    );
  };

  /**
   * 每页显示数量改变
   * @param {number} current
   * @param {number} size
   */
  onShowSizeChange = (current, size) => {
    this.setState(
      {
        pageCurrent: current,
        pageSize: size
      },
      () => {
        this.getReviewList();
      }
    );
  };

  // disabledDate = currentDate => {
  //   return currentDate > moment().endOf('day');
  // };

  // changeStartPicker = (date, dateStr) => {
  //   this.startTime = date.valueOf();
  // };

  // changeEndPicker = (date, dateStr) => {
  //   this.endTime = date.valueOf();
  // };

  // onChangeState = state => {
  //   this.setState(state, () => {
  //     console.log(this.state);
  //   });
  // };

  render() {
    const { t, form, reviewList, loadingFetchReviewList } = this.props;
    const { records, total } = reviewList;
    const { getFieldDecorator } = form;
    const { pageCurrent, pageSize } = this.state;

    // 筛选条件布局
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    // 筛选条件，操作按钮布局
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        }
      }
    };
    return (
      <div className="review-list upm-filter-content-page">
        {/* <Card title={t('上级审核')} bordered={false} className="filter-area"> */}
        <div className="filter-area">
          <div className="filter-title">{t('上级审核')}</div>
          <Form {...formItemLayout}>
            <Row gutter={24} className="filter-fields">
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('权限审核名称')}>
                  {getFieldDecorator('name', {
                    initialValue: ''
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('发起人')}>
                  {getFieldDecorator('op', {
                    initialValue: ''
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('起止时间') + '：'}>
                  {getFieldDecorator('timeRange', {
                    initialValue: defaultFilterParams.timeRange
                  })(<RangePicker />)}
                  {/* <RangePicker
                    value={[startTime, endTime]}
                    onChange={date =>
                      this.onChangeState({
                        startTime: date[0],
                        endTime: date[1]
                      })
                    }
                  /> */}
                </FormItem>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="filter-fields-option">
                <FormItem {...tailFormItemLayout}>
                  <span className="filter-options-wrapper">
                    <Button onClick={this.handleReset}>{t('重置')}</Button>
                    <Button
                      icon="search"
                      type="primary"
                      onClick={this.handleSearch}>
                      {t('搜索')}
                    </Button>
                  </span>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="content-area">
          <Table
            dataSource={records}
            columns={this.getColumns()}
            pagination={{
              current: pageCurrent,
              pageSize: pageSize,
              total,
              onChange: this.handlePageChange,
              showTotal: total => `${t('共')} ${total} ${t('条')}`,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              onShowSizeChange: this.onShowSizeChange
            }}
            loading={loadingFetchReviewList}
            className="upm-table"
            rowKey="id"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { global, review } = state;

  return {
    appId: global.managingApp,
    reviewList: review.reviewList,
    loadingFetchReviewList: review.loadings['fetchReviewList']
  };
};

export default connect(mapStateToProps)(Form.create()(ReviewList));
