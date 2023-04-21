import React from 'react';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Select, Icon, Card, Avatar, Tooltip, Modal, Table, Button } from 'antd';
import { routerRedux } from 'dva/router';
import { MANAGE } from '@routes/config';
import './style.less';

class RedundancyModal extends React.Component {

  state = {
    datas: [],
  }

  componentDidMount() {
    const { dispatch, appId } = this.props;
    dispatch({
      type: 'dashboard/getRedundantRoles',
      payload: appId
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
        width: 100
      },
      {
        title: t('角色名称'),
        dataIndex: 'name',
        // width: 150
      },
      {
        title: t('敏感等级'),
        dataIndex: 'riskLevel',
        width: 80
      },
      {
        // title: '角色用户数',
        title: () => {
          return (
            <div>
              <span>{t('角色用户数')}</span><Tooltip title={t('拥有该角色权限的用户数量')}><Icon type="question-circle-o" /></Tooltip>
            </div>
          );
        },
        dataIndex: 'roleUserCount',
        width: 120
      }
    ];
    
    return (
      <Modal
        title={modalTitle}
        visible={modalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {t('关闭')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={this.handleOK}
          >
            {t('前往清理')}
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
          scroll={{y: 400}}
        />
      </Modal>
    )
  }
}

const RedundancyModalPage = Form.create({})(RedundancyModal);

export default connect(({ global }) => {
  return {

  };
})(RedundancyModalPage);
