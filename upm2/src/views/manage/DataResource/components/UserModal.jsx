import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Button, Modal, Table,Popconfirm } from 'antd';
import config from '@config/style';
import { echoMessage } from '@utils/notice';

const FormItem = Form.Item;
const { Column } = Table;
const { searchForm } = config;


class UserModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // 查询参数
      params: {
        username: '' // 名称
      },
      unReleUsernames: [], // 取消关联的用户名集合
      pageCurrent: 1,
      loadingForUnReleUser: false,
      loadingForUnReleAllUser: false,
      loadingForReleUser: false
    };
  }

  /**
   * 筛选区域-双向绑定
   * @param {*} state 
   */
  changeState = state => {
    this.setState({
      params: {
        ...state
      },
    });
  };

  getRelevantUsers = () => {
    this.props.getRelevantUsers(this.state.params.username)
  }

  /**
   * 搜索
   */
  handleSearch = () => {
    this.getRelevantUsers();
  }

  /**
   * 重置
   */
  reset = () => {
    this.setState({
      unReleUsernames: [],
      params: {
        username: ''
      }
    });
  }

  /**
   * 过滤搜索条件
   */
  // filter = (datas = []) => {
  //   const { username } = this.state.params;
  //   const usernames = username.split(',');

  //   function macthName(data) {
  //     if (usernames.length === 1 && !usernames[0]) return true;
  //     return usernames.some(name => {
  //       if(!name) return false;
  //       return data.username.indexOf(name) !== -1 || data.usernameZh.indexOf(name) !== -1;
  //     });
  //   }

  //   return datas.filter(data => {
  //     return macthName(data);
  //   });
  // };

  /**
   * 关联用户
   */
  releUser = () => {
    const { t } = this.props;
    const {params:{username}} = this.state;
    if(username.trim()==='') {
      return;
    }
    if(username.trim().split(',').length>50) {
      echoMessage(t('批量关联用户，最大支持50个'),'error')
      return;
    }
    this.setState({
      loadingForReleUser: true
    })
    this.props.releUsers(username).then(() => {
      const {t} = this.props;
      echoMessage(t('关联用户成功'),'success')
      
      this.reset();
      setTimeout(() => {
        this.getRelevantUsers();
      }, 0);
    }).finally(()=>{
      this.setState({
        loadingForReleUser: false
      })
    })
  };

  /**
   * 一键清空用户
   */
  unReleAllUser = () => {
    const { t, relevantUsers } = this.props;
    this.setState({
      loadingForUnReleAllUser: true
    })
    const usernames = relevantUsers.map(user=>user.username).join(',')
    this.props.unReleUsers(usernames).then(() => {
      echoMessage(t('操作成功'),'success');
      this.reset();
      setTimeout(() => {
        this.getRelevantUsers();
      }, 0);
    }).finally(()=>{
      this.setState({
        loadingForUnReleAllUser: false
      })
    })
  }

  /**
  * 取消关联
  */
  unReleUser = () => {
    const { t } = this.props;
    this.setState({
      loadingForUnReleUser: true
    })
    const { unReleUsernames } = this.state;
    // if (unReleUsernames.length < 1) {
    //   echoMessage(t('请至少选择一名用户！'), 'warning');
    //   return;
    // }
    const usernames = unReleUsernames.join(',')
    this.props.unReleUsers(usernames).then(() => {
      echoMessage(t('取消关联成功'),'success');
      this.reset();
      setTimeout(() => {
        this.getRelevantUsers();
      }, 0);
    }).finally(()=>{
      this.setState({
        loadingForUnReleUser: false
      })
    })
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.reset();
    this.props.handleCancel();
  }

  /**
   * Modal关闭后操作
   */
  afterClose = () => {
    this.props.afterClose()
  }

  /**
   * 翻页
   */
  handlePageChange = current => {
    this.setState({
      pageCurrent: current
    })
  }

  render() {
    const { t,title, relevantUsers,loadingRelevantUsers } = this.props;
    const {pageCurrent,unReleUsernames,loadingForUnReleAllUser,loadingForUnReleUser,loadingForReleUser} = this.state;
    // const datas = this.filter(this.props.role.relevantUsers.records);
    const rowSelection = {
      selectedRowKeys: this.state.unReleUsernames,
      onChange: (selectedRowKeys) => {
        this.setState({
          unReleUsernames: selectedRowKeys
        });
      }
    };

    return (
      <Modal
        title={`${t('用户绑定')} - ${title}`}
        destroyOnClose={true}
        style={this.props.style}
        width={config.modal.size.large}
        visible={this.props.visible}
        onOk={this.unReleUser}
        onCancel={this.handleCancel}
        afterClose={this.afterClose}
        footer={[
          <Popconfirm
            key='popConfirm'
            placement="topLeft" 
            title={t('是否一键清空所有绑定用户')} 
            onConfirm={this.unReleAllUser} 
            okText={t('确认')} 
            cancelText={t('取消')}
            disabled={relevantUsers.length===0}
          >
            <Button 
              type="primary" 
              loading={loadingForUnReleAllUser}
              disabled={relevantUsers.length===0}
            >
              {t('一键清空用户')}
            </Button>
          </Popconfirm>
          ,
          <Button
            key="cancel"
            type="danger"
            loading={loadingForUnReleUser}
            onClick={this.unReleUser}
            disabled={unReleUsernames.length===0}
            style={{marginLeft: '8px'}}
          >
            {t('取消关联')}
          </Button>
        ]}
      >
        <SearchFormWrapper
          t={t}
          loadingForReleUser={loadingForReleUser}
          params={this.state.params}
          handleValueChange={this.changeState}
          handleSearch={this.handleSearch}
          handleRele={this.releUser}
        />
        <Table className="upm-table"
          rowKey="username"
          size="middle"
          dataSource={relevantUsers}
          rowSelection={rowSelection}
          loading={loadingRelevantUsers}
          // 因接口情况，为”实现一键清空“，这里为假分页
          pagination={{
            current: pageCurrent,
            pageSize: 10,
            total: relevantUsers.length,
            hideOnSinglePage: true,
            onChange: this.handlePageChange
          }}
          >
          <Column title={t('ID')} dataIndex="id" width={100}/>
          <Column title={t('账号')} dataIndex="username"/>
          <Column title={t('姓名')} dataIndex="usernameZh"/>
        </Table>
      </Modal>
    );
  }
}

UserModal.propTypes = {
  relevantUsers: PropTypes.array.isRequired, // 用户列表
  visible: PropTypes.bool.isRequired, // modal显示
  loadingRelevantUsers: PropTypes.bool.isRequired, // 用户加载loading
  handleCancel: PropTypes.func.isRequired, // 关闭modal
  getRelevantUsers: PropTypes.func.isRequired, // 获取用户列表
  releUsers: PropTypes.func.isRequired, // 关联用户
  unReleUsers: PropTypes.func.isRequired, //取消关联用户
}


function SearchForm(props) {
  const { t } = props;
  const { getFieldDecorator } = props.form;
  return (
    <Form className="upm-form">
      <Row gutter={12}>
        <Col span={8}>
          <FormItem label={t('用户名')} {...searchForm}>
            {getFieldDecorator('username', {})(<Input placeholder={t('用户名，多用户以逗号间隔')} />)}
          </FormItem>
        </Col>
        <Col span={16}>
          <FormItem>
            <Button className="upm-form__button" type="primary" onClick={() => {
              props.handleSearch();
            }}>{t('查询')}</Button>
            <Button 
              className="upm-form__button"
              loading={props.loadingForReleUser}
              onClick={() => {
              props.handleRele();
            }}>
              {t('关联用户')}
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
}

/**
 * 角色查询组件
 */
const SearchFormWrapper = Form.create({
  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields({ params }) {
    let fields = {};
    _.each(params, (value, key) => {
      fields[key] = Form.createFormField({ value });
    });
    return fields;
  },
  onValuesChange(props, values) {
    props.handleValueChange(values);
  }
})(SearchForm);

export default connect()(UserModal)