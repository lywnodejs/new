import React, { Component } from 'react';
import {
  Button, Form, Input, Card, Select,
  Table, DatePicker, Col, Row
} from 'antd';
import moment from 'moment';
import connect from '@utils/translateConnect';
import AvailableApps from '../../../components/AvailableApps/index';
// import SystemSelect from '@components/SystemSelect';
import LogModal from './LogModal';

import {
  queryLog,
} from '@services/manageChangelog.js';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

const dateFormat = 'YYYY-MM-DD HH:mm';

class Changelog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      dataSource: [],
      current: 1, // 当前页数
      total: 0, // 数据总数
      logId: '', // 详情 id
      sysName: '' // 详情系统名
    };

    this.pageSize = 10; // 每页条数

    // 日期默认值
    this.endTime = Date.now();
    // this.startTime = this.endTime - 6 * 30 * 24 * 60 * 60 * 1000;
    this.startTime = moment().subtract(6, 'month');

    const { t } = props;
    this.authTypeMap = {
      1: t('角色'),
      2: t('功能'),
      3: t('标识位'),
      4: t('地区'),
      5: t('资源权限'),
      6: t('功能组'),
      7: t('用户'),
      8: t('角色组'),
    };
  }
  getChangelogs = ({ page = 1 } = {}) => {
    const { form, appId } = this.props;
    const values = form.getFieldsValue();
    this.setState({
      queryName: values.queryName
    });
    const params = {
      ...values,
      startTime: this.startTime,
      endTime: this.endTime,
      page,
      size: this.pageSize,
      appId
    };

    queryLog(params).then(res => {
      const records = res.records || [];
      const total = res.total || 0;

      this.setState({
        dataSource: records,
        total
      });
    });
  }
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
        render: (val) => (
          <span>{this.authTypeMap[val]}</span>
        ),
      },
      {
        title: t('权限名称'),
        dataIndex: 'opAttrName',
        width: 200,
      },
      {
        title: t('业务线'),
        dataIndex: 'businessName',
        width: 100
      },
      {
        title: t('变更原因'),
        dataIndex: 'remark',
      },
      {
        title: t('操作人'),
        dataIndex: 'opUsername',
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
            <span className="detail-btn" onClick={() => this.showDetail(record)}>{t('详情')}
            </span>
          );
        }
      }
    ];

    return columns;
  }
  showDetail = (record) => {
    this.setState({
      modalVisible: true,
    });

    const logId = record.id;
    if (logId) {
      this.setState({
        logId,
        sysName: record.appName || ''
      });
    }

  }
  onPageChange = (page) => {
    this.getChangelogs({ page });
    this.setState({
      current: page
    });
  }
  renderAuthType = () => {
    const { t } = this.props;
    return Object.entries(this.authTypeMap).map((item) => {
      return (
        <Option key={item[0]} value={item[0]}>{t(item[1])}</Option>
      );
    });
  }
  handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    const { form } = this.props;

    form.validateFields((err) => {
      if (!err) {
        this.getChangelogs();
      }
    });
  }
  disabledDate = (currentDate) => {
    return currentDate > moment().endOf('day');
  }
  changeStartPicker = (date, dateStr) => {
    this.startTime = date.valueOf();
  }
  changeEndPicker = (date, dateStr) => {
    this.endTime = date.valueOf();
  }
  componentDidMount () {
    // setTimeout(() => {
    // this.getChangelogs();
    // }, 500);
  }
  closeLogModal = (visible) => {
    this.setState({
      modalVisible: visible
    });
  }
  render () {
    const { t, form } = this.props;
    const { getFieldDecorator } = form;
    const {
      dataSource,
      current,
      total,
      modalVisible,
      logId,
      sysName,
      queryName
    } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className="changelog">
        <Card title={t('变更日志')} bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label={t('用户名')}>
                  {getFieldDecorator('queryName', {
                    initialValue: '',
                    rules: [{ required: true, message: '必填' }]
                  })(
                    <Input placeholder={t('请输入用户名')} />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={t('目标系统')}>
                  {getFieldDecorator('appId', {})(
                    // <SystemSelect />
                    <AvailableApps
                      hideClosed={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={t('开始时间')}>
                  <DatePicker
                    style={{ width: '100%' }} showTime
                    showToday
                    defaultValue={moment(this.startTime)}
                    format={dateFormat}
                    onChange={this.changeStartPicker}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={t('结束时间')}>
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    showToday
                    defaultValue={moment(this.endTime)}
                    format={dateFormat}
                    onChange={this.changeEndPicker}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} colon={false} label=" ">
                  <Button type="primary" htmlType="submit" className="search-btn">{t('搜索')}</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>

          <Table
            rowKey="id"
            className="changlog-list"
            columns={this.getColumns()}
            dataSource={dataSource}
            size="small"
            pagination={{
              current,
              pageSize: this.pageSize,
              hideOnSinglePage: true,
              total,
              onChange: this.onPageChange
            }}
          />

          <LogModal modalVisible={modalVisible} queryName={queryName} logId={logId} sysName={sysName} onClose={this.closeLogModal} />

        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { global } = state;

  return {
    appId: global.managingAvailableApp
  };
};

export default connect(
  mapStateToProps
)(Form.create()(Changelog));