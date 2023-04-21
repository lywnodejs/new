import React from 'react';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Select, Icon, Card, Avatar, Tooltip, Modal, Table, Button } from 'antd';
import { routerRedux } from 'dva/router';
import { MANAGE } from '@routes/config';
import moment from 'moment';

class SlowestModal extends React.Component {

  state = {
    datas: [],
  }
  componentWillReceiveProps(nextProps) {
  // componentDidMount() {
    const { dispatch, appId, record, time } = nextProps;
    let startAt = null;
    const now = moment().subtract('days', 1)
    const endAt = moment(now).format('YYYY-MM-DD');
    if (time === 7) {
      startAt = moment(now).subtract('days', 6).format('YYYY-MM-DD');
    } else {
      startAt = moment(now).subtract('days', 30).format('YYYY-MM-DD');
    }
    dispatch({
      type: 'dashboard/getInfoDetails',
      payload: {
        appId,
        startAt,
        endAt,
        infoId: record.workflowId
      }
    }).then(res => {
      this.setState({
        datas: res
      })
    })
  }
  componentDidMount() {
    const { dispatch, appId, record, time } = this.props;
    let startAt = null;
    const now = moment().subtract('days', 1)
    const endAt = moment(now).format('YYYY-MM-DD');
    if (time === 7) {
      startAt = moment(now).subtract('days', 6).format('YYYY-MM-DD');
    } else {
      startAt = moment(now).subtract('days', 30).format('YYYY-MM-DD');
    }
    dispatch({
      type: 'dashboard/getInfoDetails',
      payload: {
        appId,
        startAt,
        endAt,
        infoId: record.workflowId
      }
    }).then(res => {
      this.setState({
        datas: res
      })
    })
  }

  handleCancel = () => {
    this.props.handleCancel();
  }

  handleOK = () => {
    this.props.dispatch(routerRedux.push(`${MANAGE}/role/list`));
  }

  render () {
    const { modalTitle, modalVisible, t } = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '审批单号',
        dataIndex: 'approveId',
      },
      {
        title: '审批人',
        dataIndex: 'approveUsername',
      },
      {
        title: '用时(h)',
        dataIndex: 'completeTime',
      },
      {
        title: '详情',
        dataIndex: 'approveUrl',
        width: 120,
        render: (text, record) => {
          return (
            <Button size="small" onClick={() => {window.open(text, '_blank')}}>{t('详情')}</Button>
          );
        }
      },
    ];
    
    return (
      <Modal
        title={modalTitle}
        visible={modalVisible}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {t('关闭')}
          </Button>
        ]}
      >
        <Table
          size="middle"
          rowKey="id"
          columns={columns}
          dataSource={this.state.datas}
          bordered
          pagination={false}
        />
      </Modal>
    )
  }
}

const SlowestModalPage = Form.create({})(SlowestModal);

export default connect(({ global }) => {
  return {

  };
})(SlowestModalPage);
