/**
 * 查询系统接口人
 * 把 wujianjian 的组件提出
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '@utils/translateConnect';
import { Popover, Icon, Table } from 'antd';
import SystemList from '@components/SystemList';

class SearchSysAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popVisible: false,
      showLoading: false,
      querySystemValue: undefined,
      defaultValue: undefined,
      adminusers: []
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.appId != this.props.appId) {
      this.setState({
        querySystemValue: nextProps.appId
      });
      if (nextProps.appId) {
        this.getAdminusers(nextProps.appId);
      }
    }
    this.setState({ showLoading: false });
  }
  componentDidMount() {
    const { appId } = this.props;

    if (appId) {
      this.setState({
        querySystemValue: appId,
        showLoading: true
      });
      // this.getAdminusers(appId);
    } else {
      this.resetAdminusers();
    }
  }
  // 由于状态共用，改为内部维护数据
  getAdminusers(appId) {
    this.props
      .dispatch({
        type: 'interfacePerson/fetch',
        payload: {
          appId
        }
      })
      .then(adminusers => this.setState({ adminusers }));
  }
  resetAdminusers() {
    this.props
      .dispatch({
        type: 'interfacePerson/reset'
      })
      .then(() => this.setState({ adminusers: [] }));
  }
  handleVisibleChange = popVisible => {
    const { appId, disabled } = this.props;
    this.setState(
      {
        popVisible
      },
      () => {
        if (popVisible && disabled) {
          this.getAdminusers(appId);
        }
      }
    );
    if (!popVisible) {
      const { dispatch, clearable } = this.props;

      if (clearable) {
        this.setState({
          querySystemValue: undefined
        });
        this.resetAdminusers();
      }
    }
  };
  closeQueryInterfacePersonPopover = () => {
    this.handleVisibleChange(false);
  };
  interfacePersonChangeHandle = appId => {
    const { dispatch } = this.props;

    if (!appId) {
      this.setState({
        querySystemValue: appId
      });
      this.resetAdminusers();
      return;
    }
    this.setState({
      querySystemValue: appId,
      showLoading: true
    });
    this.getAdminusers(appId);
  };
  render() {
    const { t, placement, btnText, inline } = this.props;

    const columns = [
      {
        title: t('系统管理员'),
        dataIndex: 'usernameZh',
        align: 'center',
        width: 120
      },
      {
        title: t('邮箱'),
        dataIndex: 'email',
        render: email =>
          email ? (
            <a
              href={`https://im.xiaojukeji.com/contact?name=${
                email.split('@')[0]
              }`}
              target="_blank">
              {email}
            </a>
          ) : null
      }
    ];

    return (
      <Popover
        trigger="click"
        placement={placement}
        visible={this.state.popVisible}
        onVisibleChange={this.handleVisibleChange}
        title={
          <p className="interface-person-wrapper-title">
            {t('查询系统管理员')}
          </p>
        }
        content={
          <section className="interface-person-wrapper">
            {/* <p className="interface-person-popover-header">
              <Icon type="close" className="close-hover" onClick={this.closeQueryInterfacePersonPopover}/>
            </p> */}
            <div className="interface-person-body">
              <SystemList
                style={{ width: '100%' }}
                t={t}
                onChange={this.interfacePersonChangeHandle}
                value={this.state.querySystemValue}
                disabled={this.props.disabled}
              />
              <Table
                key={new Date()}
                className="interface-person-table"
                loading={this.state.showLoading}
                pagination={false}
                columns={columns}
                scroll={{ y: this.state.adminusers.length !== 0 ? 160 : 0 }}
                dataSource={this.state.adminusers}
              />
            </div>
            <div className="interface-person-footer">{this.props.children}</div>
          </section>
        }>
        <div
          className="query-interface-person"
          onClick={this.props.onClick}
          style={{
            display: inline ? 'inline' : 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
          {btnText || t('查询系统管理员')}
        </div>
      </Popover>
    );
  }
}

SearchSysAdmin.defaultProps = {
  placement: 'bottom',
  clearable: true,
  inline: false
};
SearchSysAdmin.propTypes = {
  placement: PropTypes.string // popover 方向
};

const mapStateToProps = state => {
  const { interfacePerson } = state;
  const { adminusers } = interfacePerson;
  return {
    adminusers
  };
};
export default connect(mapStateToProps)(SearchSysAdmin);
