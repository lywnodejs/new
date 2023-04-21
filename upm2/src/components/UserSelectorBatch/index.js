import request from '@utils/request';
import React from 'react';
import { Modal, Input, message, Alert, Button, Table } from 'antd';
import _ from 'lodash';
import './style.less';

const { TextArea } = Input;
class UserSelectorBatch extends React.Component {
  constructor(props) {
    super(props);
    const { value, style } = props;
    this.state = {
      style: style || { width: '100%' },
      value: value || [],
      // batchStringSeperatedByComma: '1,2,3,4,5,6,7,8,9,0,q,w,e,r,t,y,u,i,o,a,s,d,f,g,h,j,k,z,x,c,v,b,n,m',
      batchStringSeperatedByComma: '',
      visible: false,
      warningMessage: null,
      isCanSubmit: false, // 是否能提交
      errorUserList: [],
      correctUserList: [],
      current: 1
    };
  }

  componentWillReceiveProps({ value }) {
    // 更新value值
    this.setState({
      value
    });
  }

  validateUsernames = usernames => {
    return request('/v2/nopermission/user/batchQuery', {
      params: {
        usernames
      }
    });
  };
  handleConfirm = () => {
    const { onChange } = this.props;
    const { batchStringSeperatedByComma } = this.state;
    if (batchStringSeperatedByComma !== '') {
      // [...new Set(batchStringSeperatedByComma.split(','))].filter(item=>item!=='')
      const users = [...new Set(batchStringSeperatedByComma.split(','))]
        .map(item => item.trim())
        .filter(item => item !== '');
      // console.log(users)
      if (users.length > 50) {
        message.error('批量添加最大支持50条');
        if (onChange) {
          onChange(-1);
        }
        return;
      }

      this.validateUsernames(users.join(','))
        .then(data => {
          const { correctUserList, errorUserList } = data;
          if (errorUserList.length === 0) {
            this.setState({
              visible: true,
              isCanSubmit: true,
              errorUserList: [...errorUserList],
              correctUserList: [...correctUserList]
            });
          } else {
            this.setState({
              visible: true,
              isCanSubmit: false,
              errorUserList: [...errorUserList],
              correctUserList: [...correctUserList]
            });
            if (onChange) {
              onChange(-1);
            }
          }
        })
        .catch(error => {
          message.error('验证失败');
        });
    } else {
      message.error('请输入批量信息');
      if (onChange) {
        onChange([]);
      }
    }
  };

  handleChangeOnTextArea = e => {
    this.setState({
      batchStringSeperatedByComma: e.target.value
    });
    const { onChange } = this.props;
    if (onChange) {
      if (e.target.value === '') {
        onChange([]);
      } else {
        onChange(-2);
      }
    }
  };

  warningMessage = () => {
    const { t } = this.props;
    const { errorUserList } = this.state;
    return (
      <div>
        {errorUserList.length > 0 ? (
          <span style={{ color: '#FF4747' }} key="warning">
            {errorUserList.join(',') + t('信息错误或不存在')}
            <br />
          </span>
        ) : null}

        <span key="prompt">
          {t(
            '为避免输入错误导致申请失败，提交前请核对代申请人的姓名、部门、岗位信息是否正确！'
          )}
        </span>
      </div>
    );
  };

  onOk = () => {
    const { onChange, t } = this.props;
    const { correctUserList } = this.state;
    if (onChange) {
      const newCorrectUserList = correctUserList.map(user => ({
        key: user.username,
        label: user.username
      }));
      onChange(newCorrectUserList);
    }
    this.setState(
      {
        visible: false,
        current: 1
      },
      () => {
        message.success(t('校验成功'));
      }
    );
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      current: 1
    });
  };

  handlePageChange = page => {
    this.setState({
      current: page
    });
  };

  getColumns = () => {
    const { t } = this.props;
    let columns = [
      {
        title: t('邮箱前缀'),
        dataIndex: 'username',
        key: 'username',
        width: 100
      },
      {
        title: t('姓名'),
        dataIndex: 'usernameZh',
        key: 'usernameZh',
        width: 100
      },
      {
        title: t('部门'),
        dataIndex: 'dept',
        key: 'dept',
        width: 200
      }
    ];
    return columns;
  };

  render() {
    const {
      value,
      style,
      batchStringSeperatedByComma,
      visible,
      isCanSubmit,
      correctUserList
    } = this.state;
    const { disabled, t } = this.props;
    return (
      <div className="user-selector-batch">
        <TextArea
          rows={3}
          value={batchStringSeperatedByComma}
          onChange={this.handleChangeOnTextArea}
          disabled={disabled}
          placeholder="请输入用户邮箱前缀、以英文逗号分隔，最多输入50条"
        />
        <Modal
          title={t('代申请名单校验')}
          width={600}
          visible={visible}
          onCancel={this.handleCancel}
          footer={[
            <Button
              key="back"
              onClick={this.handleCancel}
              style={{ marginRight: '10px' }}>
              {t('返回修改')}
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.onOk}
              disabled={!isCanSubmit}>
              {t('确认无误')}
            </Button>
          ]}>
          <Alert
            message={this.warningMessage()}
            type="warning"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <Table
            dataSource={correctUserList}
            columns={this.getColumns()}
            className="upm-table"
            rowKey="username"
            pagination={{
              current: this.state.current,
              onChange: this.handlePageChange
            }}
            // scroll={{ y: 300 }}
          />
        </Modal>
      </div>
    );
  }
}

export default UserSelectorBatch;
