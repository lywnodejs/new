import React, { Component } from 'react';
import {
  Form, Modal, Table,
  Col, Row, Input
} from 'antd';
import connect from '@utils/translateConnect';

const FormItem = Form.Item;
const { TextArea } = Input;

import {
  getLogDetail
} from '@services/changelog.js';

class LogModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      detailDS: [],
      current: 1, // 当前页数
      total: 0, // 数据总数
    };

    this.pageSize = 8; // 每页条数
  }
  getDetailColumns = () => {
    const { t } = this.props;

    const opMap = {
      '1': t('删除'),
      '2': t('添加')
    };
    let columns = [
      {
        title: t('权限点'),
        dataIndex: 'attrName',
      },
      {
        title: t('当前状态'),
        dataIndex: 'op',
        width: 100,
        render: (val) => (
          <span>{ opMap[val] }</span>
        ),
      },
      {
        title: t('操作人'),
        dataIndex: 'opUsername',
        width: 150
      }
    ];

    return columns;
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.onClose(false);
  }
  onPageChange = (page) => {
    const logId = this.props.logId;

    this.setState({
      current: page
    });
    this.getDetailInfo({
      logId,
      page
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.modalVisible === true) {
      // const logId = nextProps.logId;
      // if (logId) {
      //   this.getDetailInfo({
      //     logId,
      //     page: 1,
      //   });
      // }
    }
    
    if (nextProps.modalVisible !== undefined) {
      this.setState({
        visible: nextProps.modalVisible
      });
    }
  }
  getDetailInfo = ({logId, page = 1}) => {
    getLogDetail({
      logId,
      page,
      size: this.pageSize
    }).then(res => {
      const records = res.records || [];
      const total = res.total || 0;

      this.setState({
        detailDS: records,
        total
      });
    });
  }
  render() {
    const { t, username, sysName } = this.props;
    const {
      detailDS,
      current,
      total,
      visible
    } = this.state;

    const detailFormLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const detailLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    };

    return (
      <Modal
        title={t('变更详情')}
        wrapClassName="changelog-detail-modal"
        width={800}
        visible={visible}
        footer={null}
        onCancel={this.handleCancel}
        >
          <Form>
            <Row>
              <Col span={12}>
                <FormItem {...detailFormLayout} label={t('用户名')}>
                  {username}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...detailFormLayout} label={t('系统名称')}>
                  {sysName || ''}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Table 
            rowKey="attrId"
            columns={this.getDetailColumns()}
            dataSource={detailDS}
            size="small"
            pagination={{
              current,
              pageSize: this.pageSize,
              hideOnSinglePage: true,
              total,
              onChange: this.onPageChange
            }}
            />
          <Row style={{ marginTop: 20}}>
            <Col span={24}>
              <FormItem {...detailLayout} label={t('日志详情')}>
                <TextArea rows={6} />
              </FormItem>
            </Col>
          </Row>
        </Modal>
    );
  }
}
 
const mapStateToProps = (state) => {
  const { userInfo } = state;
  
  return {
    username: userInfo.username
  };
};

export default connect(
  mapStateToProps
)(Form.create()(LogModal));