// @ts-nocheck
import React from 'react';
import { List, InputItem, WhiteSpace, Button, Toast, Picker } from 'antd-mobile';
import { createForm } from 'rc-form';
import {
  queryCompanyByInviteCode,
  queryCompanyServiceEntity
} from '@/utils/api/staff';
import './style.less';

class BasicInputExample extends React.Component {
  state = {
    canSendVerifyCodeSencond: 0,
    inviteCode: '',
    companyList: [],
    orgType: ''
  };

  componentDidMount() {
    // const vConsole = new VConsole();
    const inviteCode = this.props.location.query?.inviteCode || null
    this.props.form.setFieldsValue({
      inviteCode
    })
    this.setState({
      inviteCode
    })
    this.getCode(inviteCode)

  }

  getCode = async (inviteCode) => {
    if (!inviteCode) return;
    const { data, errmsg } = await queryCompanyByInviteCode({
      inviteCode,
    });
    if (data) {
      this.props.form.setFieldsValue({
        companyId: data?.companyId,
        companyName: data?.companyName,
      });
      this.getCompanyList(data?.companyId)
    } else {
      Toast.info(errmsg);
    }
  }

  getCompanyList = (companyId) => {
    let query = {
      companyId
    }
    queryCompanyServiceEntity(query).then(res => {
      if (res && res.errno === 0 && !_.isEmpty(res.data)) {
        let companyList = res.data.map(item => {
          return {
            ...item,
            label: item.orgName,
            value: item.relEntity
          }
        })

        this.setState({
          companyList: companyList,
          orgType: res?.data[0].orgTypeCode
        })
      }
    })
  }

  submit = () => {
    const { validateFields } = this.props.form;
    validateFields(async (errors, values) => {
      if (!errors) {
        this.props.history.push({
          pathname: '/h5/registerEdit',
          query: {
            inviteCode: this.state.inviteCode,
            companyId: this.props.form.getFieldValue('companyId'),
            // orgType: this.state.orgType,
            clientId: this.props.form.getFieldValue('clientId')
          }
        })
      }
    });
  }

  render() {
    const {
      getFieldProps,
      onFieldsChange,
      getFieldValue,
      setFieldsValue,
      getFieldError,
    } = this.props.form;
    const formatInputProps = () => ({
      labelNumber: 6,
      // error: this.state.errors.includes(name),
    });

    return (
      <div>
        <List renderHeader={() => '填写报名信息'}>
          <InputItem
            {...getFieldProps('inviteCode', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '招募邀请码必填',
                },
              ],
            })}
            type="text"
            placeholder="请输入"
            {...formatInputProps('inviteCode')}
            onBlur={async () => {
              const inviteCode = getFieldValue('inviteCode');
              this.getCode(inviteCode)
            }}
          >
            <font style={{ color: 'red' }}>*</font>招募邀请码
          </InputItem>
          <div style={{ color: 'red', paddingLeft: '30px' }}>
            {(getFieldError('inviteCode') || []).join(', ')}
          </div>
          <input
            type="text"
            hidden
            placeholder="合作方编码"
            {...getFieldProps('companyId')}
          />

          <InputItem
            {...getFieldProps('companyName', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '所属合作方必填',
                },
              ],
            })}
            type="text"
            {...formatInputProps('companyName')}
            disabled
          >
            <font style={{ color: 'red' }}>*</font>所属合作方
          </InputItem>

          <Picker extra="请选择"
            data={this.state.companyList}
            {...getFieldProps('clientId', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '所属仓库必填',
                },
              ],
            })}
            title='所属仓库'
            cols={1}
          >
            <List.Item arrow="horizontal"><font style={{ color: 'red' }}>*</font>所属仓库</List.Item>
          </Picker>
          <div style={{ color: 'red', paddingLeft: '30px' }}>
            {(getFieldError('clientId') || []).join(', ')}
          </div>
        </List>
        <WhiteSpace />
        <button className={'next-but'} onClick={this.submit}>
          下一步
        </button>
      </div >
    );
  }
}

export default createForm()(BasicInputExample);
