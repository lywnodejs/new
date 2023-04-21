import React from 'react';
import connect from '@utils/translateConnect';
import SystemList from '@components/SystemList';
import moment from 'moment';
import { Button, Form, Input, Table, Row, Col, Select, Modal, Card, Popover, DatePicker } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class AuditLog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currTab: '1',
      username: '',
      applyType: '',
      complete: '',
      status: '',
      createdAtStart: moment().subtract(1, 'days'),
      createdAtEnd: moment()
    }
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'audit/fetchApplyConfig'
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
      username, applyType, complete,
      status, createdAtStart,
      createdAtEnd
    } = this.state;
    this.props.dispatch({
      type: 'audit/fetchAuditApplyLog',
      payload: {
        username, applyType, complete,
        status, createdAtStart: createdAtStart.format('YYYY-MM-DD hh:mm:ss'),
        createdAtEnd: createdAtEnd.format('YYYY-MM-DD hh:mm:ss'), page, size: 20,
        appId: this.props.appId
      }
    })
  }

  getStatus = (status) => {
    const {
      t,
      applyConfig
    } = this.props;
    return t(applyConfig.workflowenums.applyProcessStatus[status]) || status;
  }

  render () {
    const { t, appId, applyConfig, applyList } = this.props;
    const { username, applyType, complete, status, createdAtStart, createdAtEnd } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const columns = [{
      title: t('子系统'),
      dataIndex: 'appName',
      key: 'appName',
    }, {
      title: t('申请人'),
      dataIndex: 'username',
      key: 'username',
    }, {
      title: t('申请内容'),
      dataIndex: 'applyRefName',
      key: 'applyRefName',
      width: 300
    }, {
      title: t('申请类型'),
      dataIndex: 'applyTypeName',
      key: 'applyTypeName',
    }, {
      title: t('申请备注'),
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: t('状态'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => this.getStatus(status)
    }, {
      title: t('审批备注'),
      dataIndex: 'result',
      key: 'result',
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
    } = applyList;

    return (
      <Card title={t('申请审计日志')}  bordered={false}>
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
            <FormItem label={t('申请人')+'：'} {...formItemLayout}>
              <Input type="text" value={username} onChange={(e) => this.onChangeState({ username: e.target.value })} />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('申请类型')+'：'} {...formItemLayout}>
              <Select
                value={applyType}
                showSearch
                optionFilterProp="children"
                onChange={(applyType) => this.onChangeState({ applyType })}
                style={{width: '100%'}}
              >
                {applyConfig && applyConfig.workflowenums && Object.keys(applyConfig.workflowenums.applyType).map(key => <Option key={key} value={key}>{t(applyConfig.workflowenums.applyType[key])}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('是否完成')+'：'} {...formItemLayout}>
              <Select
                value={complete}
                showSearch
                optionFilterProp="children"
                onChange={(complete) => this.onChangeState({ complete })}
                style={{width: '100%'}}
              >
                {applyConfig && applyConfig.workflowenums && Object.keys(applyConfig.workflowenums.applyComplete).map(key => <Option key={key} value={key}>{t(applyConfig.workflowenums.applyComplete[key])}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('申请状态')+'：'} {...formItemLayout}>
              <Select
                value={status}
                showSearch
                optionFilterProp="children"
                onChange={(status) => this.onChangeState({ status })}
                style={{width: '100%'}}
              >
                {applyConfig && applyConfig.workflowenums && Object.keys(applyConfig.workflowenums.applyProcessStatus).map(key => <Option key={key} value={key}>{t(applyConfig.workflowenums.applyProcessStatus[key])}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('起止时间')+'：'} {...formItemLayout}>
              <RangePicker
                value={[createdAtStart, createdAtEnd]}
                onChange={(date) => this.onChangeState({ createdAtStart: date[0], createdAtEnd: date[1]})}
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
})(AuditLog);