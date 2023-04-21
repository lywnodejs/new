/**
 * 角色策略管理页面
 * by zhangdi
 */
import React from 'react';
import moment from 'moment';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Button, Table, Modal } from 'antd';
import AvailableApps from '@components/AvailableApps';
import config from '@config/style';

import EditModal from './EditModal';

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
function SearchForm({ t, handleSearch, handleAdd }) {
  return (
    <Form className="upm-form" onSubmit={handleSearch}>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem label={t('目标系统')} {...searchForm}>
            <AvailableApps changeCallBack={handleSearch}/>
          </FormItem>
        </Col>
        <Col span={16}>
          <FormItem>
            <Button className="upm-form__button" type="primary" htmlType="submit">
              {t('查询')}
            </Button>
            <Button className="upm-form__button" onClick={handleAdd}>
              {t('新增')}
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
}

class TypeManage extends React.PureComponent {

  constructor(props) {
    super(props);

    // 设置查询参数
    this.state = {
      // 模态框设置
      modal: {
        type: 'edit', // 模态框类型 edit，编辑 2，功能 3，标识位 rele，用户 group，角色组
        style: {}, // 模态框
        visible: false, // 模态框状态
        loading: false // 加载状态
      },
      oper: 'create' // 角色操作类型 create，新增 update，编辑
    };
  }

  changeState = state => {
    this.setState({
      params: {
        ...state
      }
    });
  }

  search = (pageNo = 1) => {
    this.props.dispatch({
      type: 'strategy/fetchType',
      payload: {
        ...this.state.params,
        appId: this.props.appId,
        pageNo
      }
    });
  }

  handleSearch = e => {
    this.search();
    if (e) {
      e.preventDefault();
    }
  }

  handleOk = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
    this.search();
  };

  handleCancel = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
  }

  createModal = () => {
    const ModalMap = {
      'edit': <EditModal {...this.state.modal} oper={this.state.oper} handleOk={this.handleOk} handleCancel={this.handleCancel} />
    };

    return ModalMap[this.state.modal.type];
  };

  openModal = (type, oper) => {
    this.setState({
      modal: {
        ...this.state.modal,
        type,
        visible: true
      },
      oper
    });
  }

  handlePageChange = page => {
    this.search(page);
  }

  setCurrent = type => {
    this.props.dispatch({
      type: 'strategy/mergeType',
      payload: type
    });
  }

  createType = () => {
    this.setCurrent();
    this.openModal('edit', 'create');
  }

  updateType = type => {
    this.setCurrent(type);
    this.openModal('edit', 'update');
  }

  removeType = type => {
    const { t } = this.props;

    confirm({
      title: t('确定删除此记录'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        this.props.dispatch({
          type: 'strategy/removeType',
          payload: {
            appId: this.props.appId,
            tagId: type.id
          }
        }).then(() => this.search());
      }
    });
  }

  render() {
    const { t } = this.props;

    const { records: datas, current, size: pageSize, total } = this.props.typeList;

    return (
      <div className="upm-content">
        <SearchForm
          t={t}
          handleSearch={this.handleSearch}
          handleAdd={this.createType}
        />
        <Table className="upm-table"
          rowKey="id"
          pagination={{
            current,
            pageSize,
            total,
            hideOnSinglePage: true,
            onChange: this.handlePageChange
          }}
          dataSource={datas}>
          <Column title={t('策略类型编号')} dataIndex="id" width={100}/>
          <Column title={t('策略类型唯一标识')} dataIndex="tagKey" />
          <Column title={t('策略类型名称')} dataIndex="tagName" />
          {/* <Column title={t('创建人')} dataIndex="creator" /> */}
          <Column
            title={t('创建时间')} dataIndex="createdAt"
            render={(text, record) => (
              <span>
                {moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )}
          />
          <Column
            title={t('操作')}
            key="action"
            width={160}
            render={(text, record) => (
              <span>
                <Button size={TableStyle.buttonSize} onClick={() => this.updateType(record)}>{t('编辑')}</Button>
                <Button type="danger"
                  size={TableStyle.buttonSize}
                  onClick={() => this.removeType(record)}
                >
                  {t('删除')}
                </Button>
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

export default connect(({ strategy, global }) => {
  return {
    typeList: strategy.typeList,
    appId: global.managingApp
  };
})(TypeManage);
