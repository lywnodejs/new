import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Button, Table } from 'antd';

import Logo from '../../Layout/Logo';
import Header from '../../Layout/Header';

const FormItem = Form.Item;
const { TextArea } = Input;
const Column = Table.Column;
const TableStyle = {
  buttonSize: 'small'
};

function SearchForm(props) {
  const { getFieldDecorator, getFieldsValue } = props.form;
  const { t } = props;

  return (
    <Form className="upm-form" onSubmit={e => {
      e.preventDefault();
      props.handleSearch(getFieldsValue(['username']));
    }}>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem label={t('复制对象')}>{getFieldDecorator('username', {})(<TextArea autosize />)}</FormItem>
        </Col>
        <Col span={16}>
          <FormItem>
            <Button className="upm-form__button" type="primary" htmlType="submit">
              {t('添加')}
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
}

const SearchFormWrapper = Form.create()(SearchForm);

class AccountCopy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      matchList: [],
      copyList: [],
    };
    this.susername = null;
    this.appId = null;
    this.usernames = [];
  }

  handleSearch = ({ username }) => {
    const usernames = username.split(',');
    const increment = [];

    usernames.forEach(name => {
      if (!_.includes(this.usernames, name)) {
        this.usernames.push(name);
        increment.push(name);
      }
    });

    if (increment.length > 0) {
      this.props.dispatch({
        type: 'account/fetchMatchAccount',
        payload: {
          appId: this.props.appId,
          userNames: increment
        }
      });
    }
  }

  updateCopyList = (accountName) => {
    const newCpList = this.state.copyList.slice();

    // 更新集合
    _.remove(newCpList, name => name == accountName);
    this.setState({
      copyList: newCpList
    });
  }

  copyAccount = (account => {
    if (_.includes(this.state.copyList, account.accountName)) return

    // 存储待copy用户
    this.setState({
      copyList: [
        ...this.state.copyList,
        account.accountName
      ]
    });

    // copy用户
    this.props.dispatch({
      type: 'account/copyAccount',
      payload: {
        appId: this.appId,
        sourceUserName: this.susername,
        desUserName: account.accountName
      }
    }).finally(() => {
      this.updateCopyList(account.accountName);
    });
  });

  componentDidMount() {
    const { location } = this.props;
    const result = /^(?:\?|&)susername=(.*?)&appId=(\d+)(&|$)/.exec(location.search);
    if (result) {
      this.susername = result[1];
      this.appId = result[2];
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      matchList: this.state.matchList.concat(...nextProps.matchList)
    });
  }

  render() {
    const { t } = this.props;

    return (
      <div className="upm-manage-layout">
        <div className="upm-layout-body-header">
          <Logo />
          <Header>{t('权限系统')}</Header>
        </div>
        <div className="upm-layout-body-content">
          <div className="upm-content">
            <SearchFormWrapper
              t={t}
              username={this.state.username}
              handleSearch={this.handleSearch}
            />
            <Table className="upm-table"
              dataSource={this.state.matchList}
              rowKey="accountName"
              pagination={{
                hideOnSinglePage: true
              }}
              scroll={{ x: 1500 }}>
              <Column title={t('账号')} dataIndex="accountName" width={150} fixed="left" />
              <Column title={t('姓名')} dataIndex="nameDisplay" width={100} />
              <Column title={t('邮箱')} dataIndex="emailAddr" width={300} />
              <Column title={t('部门')} dataIndex="dept"
                render={(text, record) => (
                  <span>
                    {[record.deptDescr0, record.deptDescr1, record.deptDescr2, record.deptDescr3, record.deptDescr4].join('-')}
                  </span>
                )}
              />
              <Column title={t('岗位')} dataIndex="jobcodeDescr" />
              <Column
                title={t('操作')}
                key="action"
                width={100}
                fixed="right"
                render={(text, record) => (
                  <span>
                    <Button loading={_.includes(this.state.copyList, record.accountName)} size={TableStyle.buttonSize} onClick={() => this.copyAccount(record)}>{t('复制')}</Button>
                  </span>
                )}
              />
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((({ account, global }) => {
  return {
    account: account.account,
    matchList: account.matchList,
    appId: global.managingApp
  };
}))(AccountCopy);
