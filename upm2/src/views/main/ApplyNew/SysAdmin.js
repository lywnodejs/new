/**
 * 查看系统管理员
 */
import React, { Component } from 'react';
import connect from '@utils/translateConnect';
import { Table } from 'antd';

class SysAdmin extends Component {
  constructor(props) {
    super(props);
    // this.state = {  }
  }
  componentDidMount() {
    const { dispatch, system } = this.props;
    dispatch({
      type: 'interfacePerson/fetch',
      payload: {
        appId: system.appId
      },
    });
  }
  render() {
    const { t, adminusers } = this.props;

    const columns = [{
      title: t('系统管理员'),
      dataIndex: 'usernameZh',
      align: 'center'
    },{
      title: t('邮箱'),
      dataIndex: 'email'
    }];

    return (
      <div className="sys-admin">
        <Table 
          key={new Date()}
          bordered 
          pagination={false} 
          columns={columns} 
          dataSource={adminusers}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { interfacePerson } = state;
  const { adminusers } = interfacePerson;
  return {
    adminusers
  };
};
 
export default connect(
  mapStateToProps
)(SysAdmin);