/**
 * 用户管理页面
 * by zhangdi
 *
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Button, Table, Modal, Popover } from 'antd';
import AvailableApps from '@components/AvailableApps';
import config from '@config/style';

import RegisterModal from './RegisterModal'; // 用户注册页面
import RoleModal from './RoleModal'; // 角色绑定页面
import RoleGroupModal from './RoleGroupModal'; // 角色组绑定页面
import RegionModal from './RegionModal'; // 地区绑定
import FlagModal from './FlagModal'; // 标识位绑定页面
import DataModal from './DataModal'; // 数据资源绑定页面

const FormItem = Form.Item;
const { Column } = Table;
const confirm = Modal.confirm;
const { searchForm } = config;
const TableStyle = {
  buttonSize: 'small'
};

/**
 * 角色条件查询
 * @param {*} props
 */
function SearchForm({ t, form, handleSearch, handleRegister }) {
  const { getFieldDecorator } = form;

  return (
    <Form className="upm-form" onSubmit={handleSearch}>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem label={t('目标系统')} {...searchForm}>
            <AvailableApps changeCallBack={handleSearch} />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label={t('账户')} {...searchForm}>
            {getFieldDecorator('username', {})(
              <Input placeholder={t('请输入关键字进行模糊搜索')} />
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label={t('姓名')} {...searchForm}>
            {getFieldDecorator('usernameZh', {})(
              <Input placeholder={t('请输入关键字进行模糊搜索')} />
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label={t('邮箱')} {...searchForm}>
            {getFieldDecorator('email', {})(
              <Input placeholder={t('请输入关键字进行模糊搜索')} />
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem>
            <Button
              className="upm-form__button"
              type="primary"
              htmlType="submit">
              {t('查询')}
            </Button>
            <Button className="upm-form__button" onClick={handleRegister}>
              {t('注册')}
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

  /**
   * 处理数据变化
   * @param {*} props
   * @param {*} values
   */
  onValuesChange(props, values) {
    props.handleValueChange(values);
  }
})(SearchForm);

/**
 * 角色管理组件
 * 包括查询和列表展示功能
 */
class Account extends React.PureComponent {
  constructor(props) {
    super(props);

    // 设置查询参数
    this.state = {
      // 查询参数
      params: {
        username: '', // 账户
        usernameZh: '', // 名称
        email: '' // 邮箱
      },
      // 模态框设置
      modal: {
        type: 'edit', // 模态框类型 edit，编辑 2，功能 3，标识位 rele，用户 group，角色组
        style: {}, // 模态框
        visible: false, // 模态框状态
        loading: false // 加载状态
      },
      appId: '',
      userName: '',
      userId: ''
      // currentAccountId: ''
    };
  }

  render() {
    const { t, params } = this.props;
    const {
      records: datas,
      current,
      size: pageSize,
      total
    } = this.props.accountList;

    return (
      <div className="upm-content">
        <SearchFormWrapper
          t={t}
          params={params}
          handleValueChange={this.changeState}
          handleSearch={this.handleSearch}
          handleRegister={this.registerAccount}
        />
        <Table
          className="upm-table"
          dataSource={datas}
          rowKey="id"
          pagination={{
            current,
            pageSize,
            total,
            hideOnSinglePage: true,
            onChange: this.handlePageChange
          }}>
          <Column title={t('用户编号')} dataIndex="id" />
          <Column title={t('账户')} dataIndex="username" />
          <Column title={t('姓名')} dataIndex="usernameZh" />
          <Column title={t('邮箱')} dataIndex="email" />
          <Column title={t('部门')} dataIndex="dept" />
          <Column title={t('岗位')} dataIndex="job" />
          <Column
            title={t('操作')}
            key="action"
            render={(text, record) => {
              const content = (
                <span>
                  <Button
                    className="upm-popover__button"
                    size={TableStyle.buttonSize}
                    onClick={() => this.copyAccount(record)}>
                    {t('复制')}
                  </Button>
                  <Button
                    className="upm-popover__button"
                    type="danger"
                    size={TableStyle.buttonSize}
                    onClick={() => this.removeAccount(record)}>
                    {t('删除')}
                  </Button>
                  <Button
                    className="upm-popover__button"
                    size={TableStyle.buttonSize}
                    onClick={() => this.distrRegion(record)}>
                    {t('地区绑定')}
                  </Button>
                  <Button
                    className="upm-popover__button"
                    size={TableStyle.buttonSize}
                    onClick={() => this.distrFlag(record)}>
                    {t('标识位')}
                  </Button>
                  <Button
                    className="upm-popover__button"
                    size={TableStyle.buttonSize}
                    onClick={() => this.distrRole(record)}>
                    {t('分配角色')}
                  </Button>
                  {/* <Button size={TableStyle.buttonSize} onClick={() => this.distrGroup(record)}>{t('角色组')}</Button> */}
                  <Button
                    className="upm-popover__button"
                    size={TableStyle.buttonSize}
                    onClick={() => this.distrData(record)}>
                    {t('数据资源')}
                  </Button>
                </span>
              );
              return (
                <Popover
                  overlayClassName="upm-popover"
                  overlayStyle={{ zIndex: 999 }}
                  content={content}
                  placement="topRight"
                  trigger="click">
                  <Button size={TableStyle.buttonSize}>{t('操作')}</Button>
                </Popover>
              );
            }}
          />
        </Table>
        {this.createModal()}
      </div>
    );
  }

  componentDidMount() {
    // 查找数据
    this.search();
  }

  /**
   * 动态创建模态框
   */
  createModal = () => {
    const ModalMap = {
      register: (
        <RegisterModal
          {...this.state.modal}
          appId={this.state.params.system}
          oper={this.state.oper}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
      ),
      role: (
        <RoleModal
          {...this.state.modal}
          appId={this.state.params.system}
          oper={this.state.oper}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
      ),
      group: (
        <RoleGroupModal
          {...this.state.modal}
          appId={this.state.params.system}
          oper={this.state.oper}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
      ),
      region: (
        <RegionModal
          {...this.state.modal}
          // appId={this.state.params.system}
          // accountId={this.state.currentAccountId}
          oper={this.state.oper}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
      ),
      flag: (
        <FlagModal
          {...this.state.modal}
          appId={this.state.params.system}
          oper={this.state.oper}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
      ),
      data: (
        <DataModal
          userId={this.state.userId}
          userName={this.state.userName}
          {...this.state.modal}
          appId={this.state.params.system}
          handleCancel={this.handleCancel}
          handleOk={this.handleOk}
        />
      )
    };

    return ModalMap[this.state.modal.type];
  };

  trim = data => {
    const result = {};
    for (let key in data) {
      result[key] = _.trim(data[key]);
    }
    return result;
  };

  /**
   * 更新查询参数
   */
  changeState = state => {
    this.props.dispatch({
      type: 'account/updateParams',
      payload: state
    });
  };

  /**
   * 搜索
   */
  search = (page = 1) => {
    this.props.dispatch({
      type: 'account/fetchAccount',
      payload: {
        ...this.trim(this.props.params),
        appId: this.props.appId,
        page
      }
    });
  };

  /**
   * 查询操作
   */
  handleSearch = e => {
    this.search();
    if (e) {
      e.preventDefault();
    }
  };

  /**
   * 分页操作
   */
  handlePageChange = page => {
    this.search(page);
  };

  /**
   * 点击确认按钮
   */
  handleOk = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        visible: false
      }
    });

    // 刷新页面
    this.search();
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        visible: false
      }
    });
  };

  /**
   * 打开模态框
   */
  openModal = type => {
    this.setState({
      modal: {
        ...this.state.modal,
        type,
        visible: true
      }
    });
  };

  /**
   * 设置当前选中角色
   */
  setCurrent = account => {
    // 更新角色信息
    return this.props.dispatch({
      type: 'account/mergeAccount',
      payload: account
    });
  };

  /**
   * 注册用户
   */
  registerAccount = () => {
    this.openModal('register');
  };

  /**
   *
   */
  copyAccount = account => {
    this.setState(account);
    window.open(`copy?susername=${account.username}&appId=${this.props.appId}`);
  };

  /**
   * 删除角色
   */
  removeAccount = account => {
    const { t } = this.props;
    confirm({
      title: t('确定删除此记录'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        this.props
          .dispatch({
            type: 'account/removeAccount',
            payload: {
              id: account.id,
              appId: this.props.appId
            }
          })
          .then(() => this.search());
      }
    });
  };

  /**
   * 分配地区
   */
  distrRegion = account => {
    this.setCurrent(account);
    // 保证accout数据通过reducer，set到modal后执行
    setTimeout(() => {
      this.openModal('region');
    });
    // this.setState(
    //   {
    //     currentAccountId: account.id
    //   },
    //   () => {
    //     this.openModal('region');
    //   }
    // );

    // Promise.all([
    //   this.props.dispatch({
    //     type: 'area/getAppArea',
    //     payload: this.props.appId
    //   }),
    //   this.props.dispatch({
    //     type: 'account/fetchRelevantRegion',
    //     payload: {
    //       appId: this.props.appId,
    //       userId: account.id
    //     }
    //   }),
    //   this.props.dispatch({
    //     type: 'cityBlacklist/fetchList',
    //     payload: {
    //       appId: this.props.appId
    //     }
    //   })
    // ]).then(() => );
    // this.openModal('region');
  };

  /**
   * 分配标识位
   */
  distrFlag = account => {
    this.setCurrent(account);

    // 获取标识位全集
    this.props.dispatch({
      type: 'flags/fetch',
      payload: this.props.appId
    });

    // 获取绑定标识位
    this.props
      .dispatch({
        type: 'account/fetchRelevantFlag',
        payload: {
          appId: this.props.appId,
          userId: account.id
        }
      })
      .then(() => this.openModal('flag'));
  };

  /**
   * 分配角色
   */
  distrRole = account => {
    const { appId, dispatch } = this.props;
    const { id, username } = account;

    const url = `./role-edit/${appId}/${id}/${username}`;
    dispatch(routerRedux.push(url));

    // this.setCurrent(account);
    // this.props.dispatch({
    //   type: 'account/fetchRelevantRole',
    //   payload: {
    //     appId: this.props.appId,
    //     userId: account.id
    //   }
    // }).then(() => {
    //   this.openModal('role');
    // });
  };

  /**
   * 分配角色组
   */
  distrGroup = account => {
    this.setCurrent(account);
    // 查找数据
    this.props
      .dispatch({
        type: 'account/fetchRelevantGroup',
        payload: {
          appId: this.props.appId,
          userId: account.id
        }
      })
      .then(() => {
        this.openModal('group');
      });
  };

  // 数据绑定
  distrData = record => {
    console.log('我是record', record, this.props);
    this.setState({
      userName: record.username,
      userId: record.id
    });
    this.openModal('data');
  };
}

export default connect(({ account, global }) => {
  return {
    accountList: account.accountList,
    params: account.params,
    appId: global.managingApp
  };
})(Account);
