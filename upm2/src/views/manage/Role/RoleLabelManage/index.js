import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import AvailableApps from '@components/AvailableApps/index';
import moment from 'moment';
import { Row, Col, Form, Input, Button, Table, Modal, message } from 'antd';
import config from '@config/style';

import EditModal from './EditModal'; // 分类编辑页面

const FormItem = Form.Item;
const { Column } = Table;
const confirm = Modal.confirm;
const { searchForm } = config;
const TableStyle = {
  buttonSize: 'small'
};

/**
 * 条件查询
 * @param {*} props
 */
function SearchForm({ t, form, handleSearch, handleAdd }) {
  const { getFieldDecorator } = form;

  return (
    <Form className="upm-form" onSubmit={handleSearch}>
      <Row gutter={24}>
        <Col span={8}>
          <FormItem {...searchForm} label={t('目标系统')}>
            {getFieldDecorator('appId', {})(
              <AvailableApps
                hideClosed={true}
              />
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label={t('角色分类名称')} {...searchForm}>
            {getFieldDecorator('name', {})(<Input placeholder={t('请输入关键字进行模糊搜索')} />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem>
            <Button className="upm-form__button" type="primary" htmlType="submit">
              {t('查询')}
            </Button>
            <Button className="upm-form__button" onClick={handleAdd}>{t('新增分类')}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
}

/**
 * 分类查询组件
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
 * 分类管理组件
 * 包括查询和列表展示功能
 */
class RoleLabelManage extends React.PureComponent {
  constructor(props) {
    super(props);

    // 设置查询参数
    this.state = {
      // 查询参数
      params: {
        appId: '',
        name: '', // 标识
      },
      // 模态框设置
      modal: {
        type: 'edit', // 模态框类型 edit，编辑
        title: '', // 模态框标题
        style: {}, // 模态框
        visible: false, // 模态框状态
        loading: false, // 加载状态
        footer: [] // 模态框页脚
      },
      oper: 'create', // 分类操作类型 create，新增 update，编辑 edit
      currentPage: 1
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
  search = (page = 1, appId) => {
    const { dispatch, managingAvailableApp } = this.props;
    this.setState({
      currentPage: page
    })
    dispatch({
      type: 'role/fetchRolelabelList',
      payload: {
        ...this.trim(this.state.params),
        appId: appId || managingAvailableApp,
        page,
        size: 10
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

  /**
  * 动态创建模态框
  */
  createModal = () => {
    const { managingAvailableApp } = this.props;
    const ModalMap = {
      'create': <EditModal {...this.state.modal} appId={managingAvailableApp} oper={this.state.oper} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
      'edit': <EditModal {...this.state.modal} appId={managingAvailableApp} oper={this.state.oper} handleOk={this.handleOk} handleCancel={this.handleCancel} />,
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
  * 设置当前选中分类
  */
  setCurrent = (data) => {
    // 更新分类信息
    this.props.dispatch({
      type: 'role/mergeRolelabel',
      payload: data
    });
  };

  /**
   * 添加分类
   */
  createRolelabel = () => {
    this.setCurrent();
    this.openModal('edit', 'create');
  };

  /**
   * 修改分类
   */
  updateRolelabel = (data) => {
    this.setCurrent(data);
    this.openModal('edit', 'update');
  };

  /**
   * 删除分类
   */
  removeRolelabel = (data) => {
    const { t, managingAvailableApp } = this.props;

    confirm({
      title: t('确定删除此记录'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        this.props.dispatch({
          type: 'role/deleteRolelabel',
          payload: {
            id: data.id,
            appId: managingAvailableApp
          }
        }).then(({ success, result }) => {
          message.destroy();
          if (success) {
            // 提示成功，2秒
            message.success(t('删除成功！'), 2, () => {});
            this.search();
          } else {
            message.error(result, 2, () => {});
          }
        })
      }
    });
  };

  /**
   * 点击确认按钮
   */
  handleOk = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
    message.info(this.props.t('操作成功！'));
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
    const { t, rolelabelList } = this.props;
    const { records: datas, size: pageSize, total } = rolelabelList;

    return (
      <div className="upm-content">
        <SearchFormWrapper
          {...this.state.params}
          t={t}
          handleValueChange={this.changeState}
          handleSearch={this.handleSearch}
          handleAdd={this.createRolelabel}
        />
        <Table className="upm-table"
          dataSource={datas}
          rowKey="id"
          pagination={{
            current: this.state.currentPage,
            pageSize,
            total,
            hideOnSinglePage: true,
            onChange: this.handlePageChange
          }}
        >
          <Column title={t('ID')} dataIndex="id" width={100} />
          <Column title={t('角色分类名称')} dataIndex="name" />
          <Column title={t('描述')} dataIndex="desc" />
          <Column title={t('创建人')} dataIndex="founder" />
          <Column
            title={t('创建时间')}
            dataIndex='createdAt'
            render={(text, record) => {
              return (
                <span>
                  {moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              )
            }}
          />
          <Column
            title={t('操作')}
            key="action"
            width={320}
            render={(text, record) => (
              <span>
                <Button size={TableStyle.buttonSize} onClick={() => this.updateRolelabel(record)}>{t('编辑')}</Button>
                <Button type="danger" size={TableStyle.buttonSize} onClick={() => this.removeRolelabel(record)}>{t('删除')}</Button>
              </span>
            )}
          />
        </Table>
        {this.createModal()}
      </div>
    );
  }

  componentDidMount() {
    if (this.props.managingAvailableApp) {
      this.search(1);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.managingAvailableApp !== this.props.managingAvailableApp && nextProps.managingAvailableApp) {
      this.search(1, nextProps.managingAvailableApp);
    }
  }
}

export default connect(({ role, global }) => {
  return {
    rolelabelList: role.rolelabelList,
    managingAvailableApp: global.managingAvailableApp
  };
})(RoleLabelManage);
