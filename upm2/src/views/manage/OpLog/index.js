import React, { Component } from 'react';
import {
  Button, Form, Input, Card, Select,
  Table, DatePicker, Col, Row, Modal
} from 'antd';
import moment from 'moment';
import connect from '@utils/translateConnect';
import AvailableApps from '@components/AvailableApps/index';

import {
  logSetting
} from '@services/oplog.js';

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
      sysName: '', // 详情系统名
      auditLogConfigList:[],
      operationTypeCommonList:[],
      type: []
    };

    this.pageSize = 10; // 每页条数

    // 日期默认值
    this.endTime = Date.now();
    this.startTime = this.endTime - 30 * 24 * 60 * 60 * 1000;

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
    this.typeUserMap = {};
    this.auditLogConfigMap={};
    this.operationTypeCommonMap={};
    this.optionUseList = [];
    this.detailContent = '';
  }
  initData = () => {
    logSetting().then(res => {
      this.setState({
        auditLogConfigList: res.auditLogConfigList,
        operationTypeCommonList: res.operationTypeCommonList,
        type: res.type
      });
      for (let k of res.type) {
        this.typeUserMap[k.code]=k.name;
      }
      for (let k of res.auditLogConfigList) {
        this.auditLogConfigMap[k.code]=k.name;
        if (k.operationTypeList!==null){
          for (let k1 of k.operationTypeList) {
            this.operationTypeCommonMap[k1.code]=k1.name;
            
          }
        }
        
      }
      for (let k of res.operationTypeCommonList) {
        this.operationTypeCommonMap[k.code]=k.name;
      }
    });
  }
  functionTypeChange = (value) => {
    const { form } = this.props;
    const values = form.getFieldsValue();
    const opList = [];
    for (let k of this.state.auditLogConfigList){
      if (values.functionType == k.code && k.operationTypeList){
        for (let k1 of k.operationTypeList) {
          opList.push(k1);
        }
      } 
    }
    for (let k of  this.state.operationTypeCommonList){
      opList.push(k);
    }
    this.optionUseList = opList;
  }
  getChangelogs = ({ page = 1 } = {}) => {
    const { form } = this.props;
    const values = form.getFieldsValue();
    const params = {
      ...values,
      startTime: moment(this.startTime).format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(this.endTime).format('YYYY-MM-DD HH:mm:ss'),
      page,
      appId: this.props.appId,
      size: this.pageSize
    };
    this.props.queryLog(params).then(res => {
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
        title: t('操作人'),
        dataIndex: 'opName',
        width: 150
      },
      {
        title: t('操作人类型'),
        dataIndex: 'opType',
        width: 100,
        render: (val) => (
          <span>{ this.typeUserMap[val] }</span>
        ),
      },
      {
        title: t('功能类型'),
        dataIndex: 'functionType',
        width: 200,
        render: (val) => (
          <span>{ this.auditLogConfigMap[val] }</span>
        ),
      },
      {
        title: t('操作类型'),
        dataIndex: 'operationFunctionType',
        width: 100,
        render: (val) => (
          <span>{ this.operationTypeCommonMap[val] }</span>
        ),
      },
      {
        title: t('操作对象'),
        dataIndex: 'objectName',
      },
      {
        title: t('操作时间'),
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
    this.detailContent = record.content;
   

  }
  onPageChange = (page) => {
    this.getChangelogs({ page });
    this.setState({
      current: page
    });
  }
  renderUserType = () => {
    const { t } = this.props;
    return Object.entries(this.typeUserMap).map((item) => {
      return (
        <Option key={item[0]} value={item[0]}>{t(item[1])}</Option>
      );
    });
  }
  handleOk = e => {
    console.log(e);
    this.setState({
      modalVisible: false,
    });
  };
  renderFunctionType  = () => {
    return Object.entries(this.auditLogConfigMap).map((item) => {
      return (
        <Option key={item[0]} value={item[0]}>{(item[1])}</Option>
      );
    });
  }
  renderOpFunctionType = () => {
    return this.optionUseList.map(entity => <Option key={entity.code} value={entity.code}>{entity.name}</Option>);
   
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
  componentDidMount() {
    this.initData();
    this.getChangelogs();
  }
  closeLogModal = (visible) => {
    this.setState({
      modalVisible: visible
    });
  }
  render() {
    const { t, form, appId } = this.props;
    const { getFieldDecorator } = form;
    const {
      dataSource,
      current,
      total,
    } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className="changelog">
        <Modal
          title="详情"
          visible={this.state.modalVisible}
          onCancel={this.handleOk}
          onOk={this.handleOk}
        >
          <p>{this.detailContent}</p>
        </Modal>
        <Card title={t('操作日志')} bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label={t('目标系统')}>
                  {getFieldDecorator('appId', {
                    initialValue: appId, 
                  })(
                    <AvailableApps changeCallBack={this.getChangelogs}  />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={t('操作人')}>
                {getFieldDecorator('opName', {
                  initialValue: ''
                })(
                  <Input placeholder={t('请输入操作人')} />
                )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={t('操作人类型')}>
                  {getFieldDecorator('opType', {
                    initialValue: '',
                  })(
                    <Select onChange={this.getChangelogs}>
                      <Option value="" key="-1">{t('全部')}</Option>
                      { this.renderUserType() }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
            <Col span={8}>
                <FormItem {...formItemLayout}  label={t('功能类型')}>
                {getFieldDecorator('functionType', {
                    initialValue: '',
                })(
                    <Select onChange={this.functionTypeChange()}>
                      <Option value="" key="-1">{t('全部')}</Option>
                      { this.renderFunctionType() }
                    </Select>
                 )}
                </FormItem>
                  
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout}  label={t('操作类型')}>
                {getFieldDecorator('operationFunctionType', {
                    initialValue: '',
                })(
                    <Select  >
                      <Option value="" key="-1">{t('全部')}</Option>
                      { this.renderOpFunctionType() }
                    </Select>
                 )}
                </FormItem>
                  
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={t('操作对象')}>
                {getFieldDecorator('objectName', {
                  initialValue: ''
                })(
                  <Input placeholder={t('请输入操作人')} />
                )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={t('开始时间')}>
                  <DatePicker
                    style={{width: '100%'}} showTime
                    showToday
                    defaultValue={moment(this.startTime)}
                    format={dateFormat}
                    onChange={this.changeStartPicker}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={t('结束时间')}>
                  <DatePicker
                    style={{width: '100%'}}
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
              <Col span={8}>
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

        </Card>
      </div>
    );
  }
}

export default connect(({ global }) => ({
  appId: global.managingApp
}), (dispatch) => ({
  queryLog(params) {
    return dispatch({
      type: 'oplog/queryLog',
      payload: params
    });
  }
}))(Form.create()(Changelog));