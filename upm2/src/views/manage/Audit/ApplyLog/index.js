import React from 'react';
import connect from '@utils/translateConnect';
import SystemList from '@components/SystemList';
import moment from 'moment';
import { Button, Form, Input, Table, Row, Col, Select, Modal, Card, Popover, DatePicker } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class ApplyLog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currTab: '1',
      opName: '',
      opType: '',
      functionType: '',
      operationFunctionType: '',
      startTime: moment().subtract(1, 'days'),
      endTime: moment()
    }
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'audit/fetchConfig'
    })
  }

  handleSearchFieldChange = (payload) => {
    this.props.dispatch({
      type: 'audit/update',
      payload
    })
  }

  onChangeState = (state) => {
    this.setState(state, () => {
      console.log(this.state)
    });
  }

  fetchAuditlog = (page) => {
    const {
      opName, opType, functionType,
      operationFunctionType, startTime,
      endTime
    } = this.state;
    this.props.dispatch({
      type: 'audit/fetchAuditlog',
      payload: {
        opName, opType, functionType,
        operationFunctionType, startTime: startTime.format('YYYY-MM-DD hh:mm:ss'),
        endTime: endTime.format('YYYY-MM-DD hh:mm:ss'), page, size: 20,
        appId: this.props.appId
      }
    })
  }

  render () {
    const { t, appId, config, auditlog } = this.props;
    const { opName, opType, functionType, operationFunctionType, startTime, endTime } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const columns = [{
      title: t('操作人'),
      dataIndex: 'opName',
      key: 'opName',
    }, {
      title: t('操作人类型'),
      dataIndex: 'opType',
      key: 'opType',
    }, {
      title: t('功能类型'),
      dataIndex: 'functionType',
      key: 'functionType',
    }, {
      title: t('功能操作类型'),
      dataIndex: 'operationFunctionType',
      key: 'operationFunctionType',
    }, {
      title: t('操作对象'),
      dataIndex: 'objectName',
      key: 'objectName',
    }, {
      title: t('更改内容'),
      dataIndex: 'content',
      key: 'content',
      width: 300
    }, {
      title: t('创建时间'),
      dataIndex: 'createdAt',
      key: 'createdAt',
    }];
    const {
      current,
      size,
      total,
      records
    } = auditlog;

    return (
      <Card title={t('操作日志')}  bordered={false}>
        <Row gutter={24} className="search-fields">
          <Col span={8}>
            <FormItem label={t('目标系统')+'：'} {...formItemLayout}>
              <SystemList
                value={appId}
                onChange={(appId) => this.handleSearchFieldChange({ appId })}
                style={{width: '100%'}}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('操作人')+'：'} {...formItemLayout}>
              <Input type="text" value={opName} onChange={(e) => this.onChangeState({ opName: e.target.value })} />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('操作人类型')+'：'} {...formItemLayout}>
              <Select
                value={opType}
                showSearch
                optionFilterProp="children"
                onChange={(opType) => this.onChangeState({ opType })}
                style={{width: '100%'}}
              >
                {config && config.type && config.type.map(item => <Option key={item.code} value={item.code}>{item.name}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('功能类型')+'：'} {...formItemLayout}>
              <Select
                value={functionType}
                showSearch
                optionFilterProp="children"
                onChange={(functionType) => this.onChangeState({ functionType })}
                style={{width: '100%'}}
              >
                {config && config.auditLogConfigList && config.auditLogConfigList.map(item => <Option key={item.code} value={item.code}>{item.name}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('功能操作类型')+'：'} {...formItemLayout}>
              <Select
                value={operationFunctionType}
                showSearch
                optionFilterProp="children"
                onChange={(operationFunctionType) => this.onChangeState({ operationFunctionType })}
                style={{width: '100%'}}
              >
                {config && config.operationTypeCommonList && config.operationTypeCommonList.map(item => <Option key={item.code} value={item.code}>{item.name}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('起止时间')+'：'} {...formItemLayout}>
              <RangePicker
                value={[startTime, endTime]}
                onChange={(date) => this.onChangeState({ startTime: date[0], endTime: date[1]})}
              />
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem>
              <Button onClick={() => {this.fetchAuditlog(1)}} type="primary" size="default" >{t('搜索')}</Button>
            </FormItem>
          </Col>
        </Row>

        <Table
          rowKey="id"
          className="upm-table"
          columns={columns}
          dataSource={records}
          pagination={{
            current,
            pageSize: size,
            hideOnSinglePage: true,
            total,
            onChange: this.fetchAuditlog
          }}
        />
      </Card>
    );
  }
}

export default connect(({ audit }) => {
  return {
    ...audit
  };
})(ApplyLog);