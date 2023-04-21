import React, { Component } from 'react';
import {
  Form, Modal, Table,
  Col, Row, Icon
} from 'antd';
import connect from '@utils/translateConnect';

const FormItem = Form.Item;

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
      9: t('维度节点'),
    };
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
        title: t('权限类型'),
        dataIndex: 'type',
        width: 100,
        render: (val) => (
          <span>{this.authTypeMap[val]}</span>
        ),
      },
      {
        title: t('变更状态'),
        dataIndex: 'op',
        width: 100,
        render: (val) => (
          <span>{opMap[val]}</span>
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
  componentWillReceiveProps (nextProps) {
    if (nextProps.modalVisible === true) {
      const logId = nextProps.logId;
      if (logId) {
        this.getDetailInfo({
          logId,
          page: 1,
        });
      }
    }
    if (nextProps.modalVisible !== undefined) {
      this.setState({
        visible: nextProps.modalVisible
      });
    }
  }
  getDetailInfo = ({ logId, page = 1 }) => {
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
  render () {
    const { t, username, sysName, opUsername } = this.props;
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

    return (
      <Modal
        title={t('变更详情')}
        wrapClassName="changelog-detail-modal"
        width={800}
        visible={visible}
        centered={true}
        mask={false}
        maskClosable={false}
        footer={null}
        onCancel={this.handleCancel}
      >
        <Form>
          <Row>
            <Col span={12}>
              <FormItem {...detailFormLayout} label={t('操作人')}>
                {opUsername}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...detailFormLayout} label={t('系统名称')}>
                {sysName || ''}
              </FormItem>
            </Col>
          </Row>
          <div className="warning">
            {t('如有疑问，请联系系统管理员，或钉钉联系')} &nbsp;
            <a href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=2s9-su4p8rqje">
              {/*<Icon type="dingding-o" style={{ marginLeft: 4, marginRight: 4, color: 'dodgerblue' }} />*/}
              {t('信息安全小助手')}
            </a>
          </div>
          <Table
            rowKey="attrId"
            columns={this.getDetailColumns()}
            dataSource={detailDS}
            bordered={false}
            pagination={{
              current,
              pageSize: this.pageSize,
              hideOnSinglePage: true,
              total,
              onChange: this.onPageChange
            }}
            locale={{ emptyText: '本权限尚未关联权限点' }}
          />
        </Form>
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
