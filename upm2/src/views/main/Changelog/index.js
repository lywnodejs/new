import React, { Component } from 'react';
import {
  Button,
  Form,
  Input,
  Card,
  Select,
  Table,
  DatePicker,
  Col,
  Row
} from 'antd';
import moment from 'moment';
import connect from '@utils/translateConnect';
import LogModal from './LogModal';

import { queryLog } from '@services/changelog.js';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

const dateFormat = 'YYYY-MM-DD HH:mm';
const startTime = Date.now() - 30 * 24 * 60 * 60 * 1000;
class Changelog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      dataSource: [],
      current: 1, // 当前页数
      total: 0, // 数据总数
      logId: '', // 详情 id
      sysName: '', // 详情系统名
      opUsername: '', //详情操作人
      endTime: Date.now(),
      startTime: startTime
    };

    this.pageSize = 10; // 每页条数

    // 日期默认值
    // this.endTime = Date.now();
    // this.setState({
    //   startTime:this.endTime - 30 * 24 * 60 * 60 * 1000
    // })
    // this.startTime = this.endTime - 30 * 24 * 60 * 60 * 1000;

    const { t } = props;
    this.authTypeMap = {
      1: t('角色'),
      2: t('功能'),
      3: t('标识位'),
      4: t('地区'),
      5: t('数据资源'),
      6: t('功能组'),
      7: t('用户'),
      8: t('角色组')
    };
  }
  getChangelogs = ({ page = 1 } = {}) => {
    const { form } = this.props;
    const values = form.getFieldsValue();

    const params = {
      ...values,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      page,
      size: this.pageSize
    };
    queryLog(params).then(res => {
      const records = res.records || [];
      const total = res.total || 0;

      this.setState({
        dataSource: records,
        total
      });
    });
  };
  getColumns = () => {
    const { t } = this.props;

    let columns = [
      {
        title: t('ID'),
        dataIndex: 'id',
        width: 80
      },
      {
        title: t('系统名称'),
        dataIndex: 'appName',
        width: 150
      },
      {
        title: t('权限类型'),
        dataIndex: 'opType',
        width: 100,
        render: val => <span>{this.authTypeMap[val]}</span>
      },
      {
        title: t('权限名称'),
        dataIndex: 'opAttrName',
        width: 200
      },
      {
        title: t('业务线'),
        dataIndex: 'businessName',
        width: 100
      },
      {
        title: t('变更原因'),
        dataIndex: 'remark'
      },
      {
        title: t('操作人'),
        dataIndex: 'opUsername'
      },
      {
        title: t('变更时间'),
        dataIndex: 'createdAt',
        width: 160
      },
      {
        title: t('操作'),
        key: 'action',
        width: 80,
        render: (text, record) => {
          return (
            <span
              className="detail-btn"
              onClick={() => this.showDetail(record)}>
              {t('详情')}
            </span>
          );
        }
      }
    ];

    return columns;
  };
  showDetail = record => {
    this.setState({
      modalVisible: true
    });

    const logId = record.id;
    if (logId) {
      this.setState({
        logId,
        sysName: record.appName || '',
        opUsername: record.opUsername
      });
    }
  };
  onPageChange = page => {
    this.getChangelogs({ page });
    this.setState({
      current: page
    });
  };
  renderAuthType = () => {
    const { t } = this.props;
    return Object.entries(this.authTypeMap).map(item => {
      return (
        <Option key={item[0]} value={item[0]}>
          {t(item[1])}
        </Option>
      );
    });
  };
  handleSubmit = e => {
    if (e) {
      e.preventDefault();
    }

    const { form } = this.props;

    form.validateFields(err => {
      if (!err) {
        this.getChangelogs();
      }
    });
  };
  disabledDate = currentDate => {
    return currentDate > moment().endOf('day');
  };
  changeStartPicker = (date, dateStr) => {
    this.setState({
      startTime: date.valueOf()
    });
    // this.startTime = date.valueOf();
  };
  changeEndPicker = (date, dateStr) => {
    this.setState({
      endTime: date.valueOf()
    });
  };
  componentDidMount() {
    // setTimeout(() => {
    this.getChangelogs();
    // }, 500);
  }
  closeLogModal = visible => {
    this.setState({
      modalVisible: visible
    });
  };

  resetSearch = () => {
    this.setState(
      {
        startTime: startTime,
        endTime: Date.now()
      },
      () => {
        this.props.form.resetFields();
        this.getChangelogs();
      }
    );
  };

  render() {
    const { t, form } = this.props;
    const { getFieldDecorator } = form;
    const {
      dataSource,
      current,
      total,
      modalVisible,
      logId,
      sysName,
      opUsername,
      startTime,
      endTime
    } = this.state;

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 }
    };

    const { apps, allBusiness } = this.props;

    const Options = apps.map(item => {
      return (
        <Option key={item.appId} value={item.appId}>
          {item.appName}
        </Option>
      );
    });
    const businessIdOptions = allBusiness.map(business => {
      return (
        <Option key={business.id} value={business.id}>
          {business.name}
        </Option>
      );
    });
    return (
      <div className="changelog upm-filter-content-page">
        <div className="filter-area">
          <div className="filter-title">{t('变更日志')}</div>
          <Form onSubmit={this.handleSubmit} {...formItemLayout}>
            <Row gutter={24} className="filter-fields">
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('目标系统')}>
                  {getFieldDecorator('appId', {
                    initialValue: ''
                  })(
                    <Select
                      placeholder={t('请选择系统')}
                      className="form-select"
                      showSearch
                      optionFilterProp="children">
                      <Option value="">{t('全部')}</Option>
                      {Options}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('业务线')}>
                  {getFieldDecorator('businessId', {
                    initialValue: ''
                  })(
                    <Select
                      showSearch
                      placeholder={t('请选择业务线')}
                      className="form-select"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }>
                      <Option value="">{t('全部')}</Option>
                      {businessIdOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('权限类型')}>
                  {getFieldDecorator('opType', {
                    initialValue: ''
                  })(
                    <Select onChange={this.selectAuth}>
                      <Option value="" key="-1">
                        {t('全部')}
                      </Option>
                      {this.renderAuthType()}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('权限名称')}>
                  {getFieldDecorator('opAttrName', {
                    initialValue: ''
                  })(<Input placeholder={t('请输入权限名称')} />)}
                </FormItem>
              </Col>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('开始时间')}>
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    showToday
                    defaultValue={moment(startTime)}
                    value={moment(startTime)}
                    allowClear={false}
                    format={dateFormat}
                    onChange={this.changeStartPicker}
                  />
                </FormItem>
              </Col>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormItem label={t('结束时间')}>
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    showToday
                    allowClear={false}
                    defaultValue={moment(endTime)}
                    value={moment(endTime)}
                    format={dateFormat}
                    onChange={this.changeEndPicker}
                  />
                </FormItem>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="filter-fields-option">
                <FormItem>
                  <Button onClick={this.resetSearch}>{t('重置')}</Button>
                  <Button
                    icon="search"
                    type="primary"
                    htmlType="submit"
                    className="search-btn">
                    {t('搜索')}
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>

        <div className="content-area">
          <Table
            rowKey="id"
            className="upm-table changlog-list"
            columns={this.getColumns()}
            dataSource={dataSource}
            // size="small"
            pagination={{
              current,
              pageSize: this.pageSize,
              // hideOnSinglePage: true,
              total,
              onChange: this.onPageChange
            }}
          />
        </div>

        <LogModal
          modalVisible={modalVisible}
          logId={logId}
          sysName={sysName}
          opUsername={opUsername}
          onClose={this.closeLogModal}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { global } = state;

  return {
    appId: global.managingApp,
    apps: global.apps,
    allBusiness: global.allBusiness
  };
};

export default connect(mapStateToProps)(Form.create()(Changelog));
