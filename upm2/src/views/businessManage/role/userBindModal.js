/**
 * 角色配置页面
 * by wujianjian
 */
import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Form, Input, Button, Modal} from 'antd';
import { echoMessage } from '@utils/notice';
import UserSelect from '@components/UserSelector';
const FormItem = Form.Item;

/**
 * 编辑页面
 * @param {*} props
 */
class UserBind extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBatch: _.isArray(props.role),
      loading: false
    }
  }
  /**
  * 点击确认按钮
  */
  handleOk = () => {
    const {dispatch, handleOk, t, form, role, appId} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let {userName} = values;
        this.setState({
          loading: true
        });
        dispatch({
          type: 'businessRoleList/roleBindResource',
          payload: {
            appId,
            permissionType: 8,
            roleIdList: this.state.isBatch? role.map(item => item.id) : [role.id],
            userIdList: userName.map(item => item.key)
          }
        }).then(() => {
          this.setState({
            loading: false
          });
          echoMessage(t('用户绑定成功！'), 'success');
          handleOk();
        }, () => {
          this.setState({
            loading: false
          });
        });
      }
    });
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
  }

  render = () => {
    const { t, role, form} = this.props;
    const { getFieldDecorator } = form;
    const required = { required: true, message: t('必填') };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const roleName = this.state.isBatch? role.map(item => item.nameZh).join(','): role.nameZh;
    return (
      <Modal
        title={this.state.isBatch ? t('批量绑定用户') : t('{{roleName}}-绑定用户', {roleName: roleName})}
        style={this.props.style}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {t('取消')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.state.loading}
            onClick={this.handleOk}
          >
            {this.state.isBatch? t('批量绑定') : t('绑定')}
            </Button>
        ]}
      >
        {this.state.isBatch? (<p>当前操作的角色：{roleName}</p>): ''}
        <FormItem {...formItemLayout} label={t('绑定用户')}>
          {getFieldDecorator('userName', {
              rules: [
                required
              ],
              initialValue: ''
            })(<UserSelect />)}
        </FormItem>
        
      </Modal>
    );
  }
}

const UserBindModal = Form.create({})(UserBind);

export default connect(({global}) => {
  return {
    // appId: global.globalAppId
  };
})(UserBindModal);