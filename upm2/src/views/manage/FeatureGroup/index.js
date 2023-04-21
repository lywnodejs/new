import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Button, Table, Modal, Card, message } from 'antd';
import AvailableApps from '@components/AvailableApps';
import CardTitle from '@components/CardTitle';
import config from '@config/style';

import EditModal from './EditModal'; // 功能组组编辑页面
import FeatureModal from './FeatureModal'; // 关联功能页面
import RoleModal from './RoleModal'; // 关联角色页面
import RoleChoice from '@components/RoleChoice/index';

const FormItem = Form.Item;
const { Column } = Table;
const confirm = Modal.confirm;
const { searchForm } = config;
const TableStyle = {
  buttonSize: 'small'
};

/**
 * 功能组条件查询
 * @param {*} props
 */
function SearchForm ({ t, handleSearch, form, handleAdd }) {
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
          <FormItem label={t('名称')} {...searchForm}>
            {getFieldDecorator('name', {})(<Input placeholder={t('请输入关键字进行模糊搜索')} />)}
          </FormItem>
        </Col>
        <Col span={8}>
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
 * 功能组查询组件
 */
const SearchFormWrapper = Form.create({
  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields ({ params }) {
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
  onValuesChange (props, values) {
    props.handleValueChange(values);
  }
})(SearchForm);

/**
 * 功能组组管理组件
 * 包括查询和列表展示功能
 */
class FeatureGroupManage extends React.PureComponent {
  constructor(props) {
    super(props);

    // 设置查询参数
    this.state = {
      // 查询参数
      params: {
        name: '' // 名称
      },
      // 模态框设置
      modal: {
        type: 'edit', // 模态框类型 edit，编辑 FeatureGroup，功能组
        style: {}, // 模态框
        visible: false, // 模态框状态
        confirmLoading: false
      },
      oper: 'create', // 功能组操作类型 create，新增 update，编辑
      featureId: '',
      selectedRoleRows: [] //已选角色列表
    };
  }

  /**
  * 动态创建模态框
  */
  createModal = () => {
    // const { } = this.state;
    const { t } = this.props;
    const ModalMap = {
      'edit': <EditModal {...this.state.modal} oper={this.state.oper} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
      'feature': <FeatureModal {...this.state.modal} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
      'role': (this.state.modal.visible && <RoleChoice
        t={t}
        title={t('角色选择')}
        confirmLoading={this.state.modal.confirmLoading}
        modalVisible={this.state.modal.visible}
        onCancel={() => this.handleCancel()}
        submit={(params) => this.submitRole(params)}
        handleChange={(selectedRows) => this.handleChange(selectedRows)}
        featureId={this.state.featureId}
        type="groupRoleList"
      ></RoleChoice>)
    };

    return ModalMap[this.state.modal.type];
  };

  submitRole = (selected) => {
    const params = {
      appId: selected.appId,
      featureGroupId: selected.featureId,
      roleIds: selected.selectedRows.map(item => item.value)
    };
    this.setState({
      modal: {
        confirmLoading: true
      }
    });

    this.props.dispatch({
      type: 'featureGroup/groupInsertMutirole',
      payload: params
    }).then(() => {
      message.success('绑定成功');
      this.setState({
        modal: {
          ...this.state.modal,
          visible: false,
          confirmLoading: false
        }
      });
    });
  }

  /**
   * 已选角色列表绑定
   */
  handleChange = (selectedRows) => {
    this.setState({
      selectedRoleRows: selectedRows
    });
  }

  /**
   * 更新查询参数
   */
  changeState = state => {
    this.setState({
      params: {
        ...state
      }
    });
  };

  /**
   * 搜索
   */
  search = (page = 1) => {
    this.props.dispatch({
      type: 'featureGroup/fetchFeatureGroup',
      payload: {
        ...this.state.params,
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
  }

  /**
   * 分页操作
   */
  handlePageChange = page => {
    this.search(page);
  }

  /**
   * 操作完成关闭弹框
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
   * 操作取消关闭弹框
   */
  handleCancel = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        visible: false
      }
    });
  }

  /**
   * 打开模态框
   */
  openModal = (type, oper, featureId) => {
    this.setState({
      modal: {
        type,
        visible: true
      },
      oper,
      featureId
    });
  };

  /**
  * 设置当前选中功能组组
  */
  setCurrent = (group) => {
    // 更新功能组信息
    this.props.dispatch({
      type: 'featureGroup/mergeFeatureGroup',
      payload: group
    });
  };

  /**
   * 添加功能组组
   */
  createGroup = () => {
    this.setCurrent();
    this.openModal('edit', 'create');
  };

  /**
   * 新增功能组组
   */
  updateGroup = (group) => {
    this.setCurrent(group);
    this.openModal('edit', 'update');
  };

  /**
   * 删除功能组组
   */
  removeGroup = (group) => {
    const { t } = this.props;

    confirm({
      title: t('确定删此条记录'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        this.props.dispatch({
          type: 'featureGroup/removeFeatureGroup',
          payload: {
            id: group.id,
            appId: this.props.appId
          }
        }).then(() => this.search());
      }
    });
  };

  /**
   * 关联功能
   */
  relevantFeature = (group) => {
    this.setCurrent(group);

    // 获取功能全集
    this.props.dispatch({
      type: 'feature/fetch',
      payload: {
        appId: this.props.appId
      }
    });

    // 先查询功能关联组
    this.props.dispatch({
      type: 'featureGroup/fetchRelevantFeature',
      payload: {
        featureGroupId: group.id,
        appId: this.props.appId
      }
    }).then(() => {
      this.openModal('feature');
    });
  };

  /**
   * 关联角色
   */
  relevantRole = (group) => {
    // this.setCurrent(group);
    // Promise.all([this.props.dispatch({
    //   type: 'featureGroup/fetchRelevantRole',
    //   payload: {
    //     featureGroupId: group.id,
    //     appId: this.props.appId
    //   }
    // }), this.props.dispatch({
    //   type: 'role/fetchRoleAll',
    //   payload: {
    //     appId: this.props.appId
    //   }
    // })]).then(() => this.openModal('role'));
    // this.setCurrent(group);
    Promise.all([
      this.props.dispatch({
        type: 'role/fetchRolelabelListALL',
        payload: {
          appId: this.props.appId
        }
      }),
      this.props.dispatch({
        type: 'featureGroup/fetchBindGroupRoleList',
        payload: {
          appId: this.props.appId,
          featureGroupId: group.id,
        }
      })
    ]).then(() => this.openModal('role', undefined, group.id));
  };

  render () {
    const { t } = this.props;
    const { records: datas, current, size: pageSize, total } = this.props.featureGroupList;
    return (
      <Card title={
        <CardTitle
          title={t('功能组列表')}
          sub={t('(可创建系统功能的任意子集，即功能大于功能组)')}
        ></CardTitle>} bordered={false}>
        <SearchFormWrapper
          t={t}
          params={this.state.params}
          handleValueChange={this.changeState}
          handleSearch={this.handleSearch}
          handleAdd={this.createGroup}
        />
        <Table className="upm-table"
          rowKey="id"
          dataSource={datas}
          pagination={{
            current,
            pageSize,
            total,
            hideOnSinglePage: true,
            onChange: this.handlePageChange
          }}>
          <Column title={t('分组编号')} dataIndex="id" />
          <Column title={t('分组名称')} dataIndex="commonName" />
          <Column title={t('敏感级别')} dataIndex="riskLevel" />
          {/* <Column title="父级名称" dataIndex="parentName" /> */}
          <Column
            title={t('操作')}
            key="action"
            width={300}
            render={(text, record) => (
              <span>
                <Button size={TableStyle.buttonSize} onClick={() => this.updateGroup(record)}>{t('编辑')}</Button>
                <Button type="danger" size={TableStyle.buttonSize} onClick={() => this.removeGroup(record)}>
                  {t('删除')}
                </Button>
                <Button size={TableStyle.buttonSize} onClick={() => this.relevantFeature(record)}>{t('功能分配')}</Button>
                <Button size={TableStyle.buttonSize} onClick={() => this.relevantRole(record)}>{t('绑定角色')}</Button>
              </span>
            )}
          />
        </Table>
        {this.createModal()}
      </Card>
    );
  }

  componentDidMount () {
    // 查找数据
    this.search();
  }
}

export default connect(({ featureGroup, global }) => {
  return {
    featureGroupList: featureGroup.featureGroupList,
    appId: global.managingApp
  };
})(FeatureGroupManage);
