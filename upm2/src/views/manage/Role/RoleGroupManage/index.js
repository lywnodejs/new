/**
 * 角色组管理页面
 * by zhangdi
 *
 */

import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Button, Table, Modal } from 'antd';
import AvailableApps from '@components/AvailableApps';
import UserModal from '@components/UserModal'
import config from '@config/style';

import EditModal from './EditModal'; // 角色组编辑页面
import RoleModal from './RoleModal'; // 关联角色页面
import TagModal from './../RoleManage/TagModal'; // 设置/删除标签

const FormItem = Form.Item;
const { Column } = Table;
const confirm = Modal.confirm;
const { searchForm } = config;
const TableStyle = {
  buttonSize: 'small'
};
const TAGS_OBJ = {
  [1]: '安全客服'
}

/**
 * 角色条件查询
 * @param {*} props
 */
function SearchForm({ t, form, handleSearch, handleAdd }) {
  const { getFieldDecorator } = form;

  return (
    <Form className="upm-form" onSubmit={handleSearch}>
      <Row gutter={12}>
        <Col span={12}>
          <FormItem label={t('目标系统')} {...searchForm}>
            <AvailableApps changeCallBack={handleSearch}/>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={t('角色组唯一标识')} {...searchForm}>
            {getFieldDecorator('name', {})(<Input placeholder={t('请输入关键字进行模糊搜索')} />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={t('角色组名称')} {...searchForm}>
            {getFieldDecorator('nameZh', {})(<Input placeholder={t('请输入关键字进行模糊搜索')} />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem>
            <Button className="upm-form__button" type="primary" htmlType="submit">
              {t('查询')}
            </Button>
            <Button className="upm-form__button" onClick={handleAdd}>{t('新增')}</Button>
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
  mapPropsToFields(props) {
    let fields = {};
    _.each(props, (value, key) => {
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
 * 角色组管理组件
 * 包括查询和列表展示功能
 */
class RoleGroupManage extends React.PureComponent {
  constructor(props) {
    super(props);

    // 设置查询参数
    this.state = {
      // 查询参数
      params: {
        name: '', // 标识
        nameZh: '' // 名称
      },
      // 模态框设置
      modal: {
        type: 'edit', // 模态框类型 edit，编辑 role，角色
        title: '', // 模态框标题
        style: {}, // 模态框
        visible: false, // 模态框状态
        loading: false, // 加载状态
        footer: [] // 模态框页脚
      },
      oper: 'create', // 角色操作类型 create，新增 update，编辑
      userList: []
    };
  }

  trim = (data) => {
    const result = {};
    for (let key in data) {
      result[key] = _.trim(data[key]);
    }
    return result;
  }

  /**
   * 更新查询参数
   */
  changeState = state => {
    this.setState({
      params: {
        ...this.state.params,
        ...state
      }
    });
  };

  /**
   * 搜索
   */
  search = (page = 1) => {
    this.props.dispatch({
      type: 'role/fetchRoleGroup',
      payload: {
        ...this.trim(this.state.params),
        appId: this.props.appId,
        page
      }
    });
  }

  /**
   * 查询操作
   */
  handleSearch = e => {
    this.search();
    if (e) {
      e.preventDefault();
    }
  }

  /**
   * 分页操作
   */
  handlePageChange = page => {
    this.search(page);
  }

  handleFetchRelevantUser = (username = '', page = 1) => {
    return this.props.dispatch({
      type: 'role/getRoleGroupRelevantUser',
      payload: {
        appId: this.props.appId,
        id: this.roleGroupId,
        username,
        page
      }
    }).then(data => {
      this.setState({
        userList: data
      })
    })
  }

  handleRelevantUser = (usernames) => {
    return this.props.dispatch({
      type: 'role/relevantUser2Group',
      payload: {
        appId: this.props.appId,
        id: this.roleGroupId,
        usernames,
      }
    })
  }

  handleUnRelevantUser = (userIds) => {
    return this.props.dispatch({
      type: 'role/unRelevantUser2Group',
      payload: {
        appId: this.props.appId,
        id: this.roleGroupId,
        userIds,
      }
    })
  }

  handleCancelUser = () => {
    return this.props.dispatch({
      type: 'role/clearRelevantUser2Group',
      payload: {
        appId: this.props.appId,
        id: this.roleGroupId
      }
    })
  }

  /**
  * 动态创建模态框
  */
  createModal = () => {
    const ModalMap = {
      'edit': <EditModal {...this.state.modal} oper={this.state.oper} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
      'role': <RoleModal {...this.state.modal} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
      'setTags' : <TagModal {...this.state.modal} handleOk={this.handleOk} handleCancel={this.handleCancel} idType={5}/>,
      'removeTags': <TagModal {...this.state.modal} handleOk={this.handleOk} handleCancel={this.handleCancel} isRemove idType={5}/>,
      'rele': <UserModal {...this.state.modal}
                name={this.state.roleGroupName}
                userList={this.state.userList}
                handleOk={this.handleOk}
                handleCancel={this.handleCancel}
                fetchRelevantUser={this.handleFetchRelevantUser}
                relevantUser={this.handleRelevantUser}
                unRelevantUser={this.handleUnRelevantUser}
                cancelUser={this.handleCancelUser}
                />,
    };

    return ModalMap[this.state.modal.type];
  };

  /**
   * 打开模态框
   */
  openModal = (type, oper) => {
    this.setState({
      modal: {
        type,
        visible: true
      },
      oper
    });
  };

  /**
  * 设置当前选中角色组
  */
  setCurrent = (group) => {
    // 更新角色信息
    this.props.dispatch({
      type: 'role/mergeRoleGroup',
      payload: group
    });
  };

  /**
   * 添加角色组
   */
  createGroup = () => {
    this.setCurrent();
    this.openModal('edit', 'create');
  };

  /**
   * 新增角色组
   */
  updateGroup = (group) => {
    this.setCurrent(group);
    this.openModal('edit', 'update');
  };

  /**
   * 删除角色组
   */
  removeGroup = (group) => {
    const { t } = this.props;

    confirm({
      title: t('确定删除此记录'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        this.props.dispatch({
          type: 'role/removeRoleGroup',
          payload: {
            id: group.id,
            appId: group.appId
          }
        }).then(() => {
          this.search();
        });
      }
    });
  };

  /**
   * 关联角色
   */
  relevantRole = (group) => {
    this.setCurrent(group);
    Promise.all([this.props.dispatch({
      type: 'role/fetchRelevantRole',
      payload: {
        id: group.id,
        appId: group.appId
      }
    }), this.props.dispatch({
      type: 'role/fetchRoleAll',
      payload: {
        appId: group.appId
      }
    })]).then(() => this.openModal('role'));
  };

  relevantUser = (group) => {
    // 设置当前角色组
    this.setCurrent(group);
    this.roleGroupId = group.id
    // 获取当前角色组绑定用户
    this.handleFetchRelevantUser().then(() => {
      this.openModal('rele')
    })
  }

  showTags = (role, type) => {
    this.setCurrent(role)
    this.openModal(type)
  }

  /**
   * 点击确认按钮
   */
  handleOk = () => {
    this.setState({
      modal: {
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
        visible: false
      }
    });
  }

  render() {
    const { t } = this.props;
    const { records: datas, current, size: pageSize, total } = this.props.roleGroup;

    return (
      <div className="upm-content">
        <SearchFormWrapper
          {...this.state.params}
          t={t}
          handleValueChange={this.changeState}
          handleSearch={this.handleSearch}
          handleAdd={this.createGroup}
        />
        <Table className="upm-table"
          dataSource={datas}
          rowKey="id"
          pagination={{
            current,
            pageSize,
            total,
            hideOnSinglePage: true,
            onChange: this.handlePageChange
          }}
        >
          <Column title={t('角色组编号')} dataIndex="id" width={100} />
          <Column title={t('角色组唯一标识')} dataIndex="name" />
          <Column title={t('角色组名称')} dataIndex="nameZh" />
          {/* <Column title="父级名称" dataIndex="parentName" width="200" /> */}
          <Column title={t('标签')} render={(text, record) => {
            return record.tags && record.tags.length ? record.tags.map(i => TAGS_OBJ[i]) : ''
          }}/>
          <Column title={t('敏感级')} dataIndex="riskLevel"/>
          <Column
            title={t('操作')}
            key="action"
            width={320}
            render={(text, record) => (
              <span>
                <Button size={TableStyle.buttonSize} onClick={() => this.updateGroup(record)}>{t('编辑')}</Button>
                <Button type="danger" size={TableStyle.buttonSize} onClick={() => this.removeGroup(record)}>{t('删除')}</Button>
                <Button size={TableStyle.buttonSize} onClick={() => this.relevantRole(record)}>{t('角色')}</Button>
                <Button size={TableStyle.buttonSize} onClick={() => this.relevantUser(record)}>{t('用户绑定')}</Button>
                <Button size={TableStyle.buttonSize} onClick={() => this.showTags(record, 'setTags')}>{t('设置标签')}</Button>
                {
                  record.tags && record.tags.length ? (
                    <Button type="danger" size={TableStyle.buttonSize} onClick={() => this.showTags(record, 'removeTags')}>{t('删除标签')}</Button>
                  ) : null
                }
              </span>
            )}
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
}

export default connect(({ role, global }) => {
  return {
    roleGroup: role.roleGroupList,
    appId: global.managingApp
  };
})(RoleGroupManage);
