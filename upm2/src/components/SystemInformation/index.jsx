import React from 'react';
import { Modal, Button, Table, Input, Select, Icon, Popover, Form, message, Switch } from 'antd';
import connect from '@utils/translateConnect';

const { Column } = Table;
const Option = Select.Option;

class SystemInformation extends React.Component {
  state = {
    visible: this.props.visibleSystem || true,
    searchValue: '',
    staffList: [],
    timeout: null,
    currentValue: null,
    params: [],
    isLoading: false
  }

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps (nextProps) {
    // if (this.props.availableApps === nextProps.availableApps) return;
    this.setState({
      availableApps: nextProps.availableApps
    });
  }

  onCancelSystemInfo = () => {
    this.setState({
      visible: false,
    }, () => {
    });
  }

  submitSystemInfo = () => {
    this.setState({
      isLoading: true
    })
    let isAdminParams = []
    this.state.params.map(item => {
      isAdminParams.push({
        userName: this.props.username,
        appId: item.id,
        operateAppId: item.id,
        roleName: 'app_administrator',
        isAdmin: item.isAdmin
      })
    })
    Promise.all([
      this.props.dispatch({
        type: 'manageApp/forceFillSystem',
        payload: {
          params: this.state.params,
          appId: this.props.appId
        }
      }),
      this.props.dispatch({
        type: 'manageApp/updateAdminSwitch',
        payload: isAdminParams
      })
    ]).then(() => {
      message.success('提交成功')
      this.setState({
        visible: false,
        availableApps: null,
        isLoading: false
      })
    }).catch(() => {
      this.setState({
        isLoading: false
      })
    })
  }

  handleChange = (event, value, index) => {
    let { params } = this.state;
    params[index].permissionConsultant = event.target.value;
    this.setState({
      params
    });
  };

  handleChangeGroup = (event, value, index) => {
    let { params } = this.state;
    params[index].consultGroup = event.target.value;
    this.setState({
      params
    });
  };

  handleChangeSwitch = (value, row, index) => {
    let { params, availableApps } = this.state;
    availableApps[index].isAdmin = value ? 1 : 0
    params[index].isAdmin = value ? 1 : 0 // 调用'更新是否为权限负责人'接口所需参数
    this.setState({
      params
    });
  }

  render () {
    const { t, visibleSystem, systemSonList, appId, form } = this.props;
    let { visible, searchValue, availableApps, params, isLoading } = this.state;
    const { getFieldDecorator } = form;

    let tableData = this.state.availableApps ? this.state.availableApps : this.props.availableApps;
    if (!params.length) {
      tableData.map(item => {
        params.push({
          id: item.id,
          consultGroup: item.consultGroup,
          permissionConsultant: item.permissionConsultant,
          isAdmin: item.isAdmin
        });
      });
    }
    return (
      <Modal
        title={
          <span style={{ color: 'red' }}>
            <span>{this.props.username}</span>
            <span>{t('（用户名）您好，为了方便普通用户在申请权限时便捷的找到相应工作人员，请您在拥有“子系统管理员”权限的')}</span>
            <span>{t('系统中完善权限申请咨询人、系统咨询群信息，并注明是否在实际工作中负责权限管理')}</span>
          </span>
        }
        centered
        // closable={false}
        maskClosable={false}
        // visible={iShowSystemModal}
        visible={this.state.visible}
        onCancel={this.onCancelSystemInfo}
        onOk={this.submitSystemInfo}
        width={900}
        key="systemInfo"
        footer={[
          <span>
            <span>如有疑问请到</span>
            <a target="_blank" href="https://im.xiaojukeji.com/channel?uid=91012&token=d9e51a49b116b1dc3100a2e060fa55c8&id=406096024827090432">UPM管理员群咨询</a>
            &nbsp;&nbsp;
          </span>,
          <Button key="submitVal" type="primary" onClick={this.submitSystemInfo} loading={isLoading}>
            {t('确定')}
          </Button>,
        ]}>
        <Table
          // rowKey="id"
          rowKey={record => record.id}
          dataSource={tableData}
          size="small"
          pagination={false}
          scroll={{ y: 240 }}
        >
          <Column title={t('系统')} width={120} dataIndex="name" key="appName" />
          <Column
            title={
              <span>
                <span style={{ color: 'red' }}>*</span>
                {t('权限申请咨询人')}
                <Popover
                  placement="right"
                  content={<p style={{ width: '200px' }}>{t('请输入系统权限申请相关问题答疑接口人，输入后该用户名字将显示在权限申请页上方')}</p>}
                >
                  <span>{t('忽略')} <Icon type="question-circle-o" /></span>
                </Popover>
              </span>
            }
            width={200}
            key="permissionConsultant"
            render={(data, row, index) => {
              return (
                <Input placeholder="请输入员工邮箱前缀（用逗号隔开）" onChange={(event) => this.handleChange(event, row, index)} key={row.id} defaultValue={row.permissionConsultant} />
              );
            }}
          />
          <Column
            title={
              <span>
                <span style={{ color: 'red' }}>*</span>
                {t('系统咨询群')}
              </span>
            }
            width={200}
            key="contactGroup"
            render={(row, data, index) => {
              return (
                <Input placeholder="请输入D-chat咨询群链接" onChange={(event) => this.handleChangeGroup(event, row, index)} key={row.id} defaultValue={row.consultGroup} />
              );
            }}></Column>
          <Column
            title="是否负责权限管理"
            width={100}
            key="isAdminManage"
            render={(row, data, index) => {
              return (
                <Switch
                  key={'switch' + data.id}
                  checked={data.isAdmin == 1 ? true : false}
                  checkedChildren="是"
                  unCheckedChildren="否"
                  onChange={(value, e) => this.handleChangeSwitch(value, row, index)}
                />
              );
            }}></Column>
        </Table>
      </Modal>
    );
  }
}
export default connect(({ global, manageApp, userInfo }) => ({
  appId: global.managingAvailableApp,
  availableApps: manageApp.availableApps,
  username: userInfo.username,
  perminssionAdminList: manageApp.adminManageApps
}))(Form.create()(SystemInformation));