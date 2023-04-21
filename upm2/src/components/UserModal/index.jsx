/**
 * 用户关联页面
 * by zhangdi
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { echoMessage } from '@utils/notice';
import { Row, Col, Form, Input, Button, Modal, Table,Popconfirm } from 'antd';
import config from '@config/style';

const FormItem = Form.Item;
const { Column } = Table;
const { searchForm } = config;

function SearchForm(props) {
  const { t } = props;
  const { getFieldDecorator, getFieldsValue } = props.form;

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
            <Button className="upm-form__button" onClick={() => {
              props.handleRele();
            }}>{t('关联用户')}</Button>
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

class UserModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cancelIds: [], // 取消关联的用户集合
      // 查询参数
      params: {
        username: '' // 名称
      }
    };
  }

  changeState = state => {
    this.setState({
      params: {
        ...state
      }
    });
  };

  reset = () => {
    this.setState({
      cancelIds: [],
      params: {
        username: ''
      }
    });
  }

  search = (page = 1) => {
    this.props.fetchRelevantUser(this.state.params.username, page)
  }

  /**
   * 分页操作
   */
  handlePageChange = page => {
    this.search(page);
  }

  /**
   * 搜索
   */
  handleSearch = () => {
    this.search();
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
    this.props.relevantUser(this.state.params.username)
      .then(() => {
        this.reset();
        setTimeout(() => {
          this.search();
        }, 0);
      });
  };

  /**
   * 清空用户
   */
  handleCancelUser = () => {
    this.props.cancelUser()
      .then(() => {
        this.reset();
        setTimeout(() => {
          this.search();
        }, 0);
      });
  }

  /**
  * 取消关联
  */
  handleOk = () => {
    const { t } = this.props;

    // 更新数据之后关闭模态框
    if (this.state.cancelIds.length < 1) {
      return echoMessage(t('请至少选择一名用户！'), 'warning');
    }

    this.props.unRelevantUser(this.state.cancelIds)
      .then(() => {
        this.reset();
        setTimeout(() => {
          this.search();
        }, 0);
      });
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.reset();
    this.props.handleCancel();
  }

  /**
   * 更新选中项
   */
  onSelectChange = (selectedRowKeys) => {
    this.setState({
      cancelIds: selectedRowKeys
    });
  };

  render() {
    const { t } = this.props;
    const { records: datas, current, size: pageSize, total } = this.props.userList;

    // const datas = this.filter(this.props.role.userList.records);
    const rowSelection = {
      selectedRowKeys: this.state.cancelIds,
      onChange: this.onSelectChange,
    };
    const title = t('用户绑定');

    return (
      <Modal
        title={title}
        destroyOnClose={true}
        style={this.props.style}
        width={config.modal.size.large}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Popconfirm placement="topLeft" title={t('是否一键清空用户所有权限')} onConfirm={this.handleCancelUser} okText={t('确认')} cancelText={t('取消')}>
          <Button
            type="primary"
          >
            {t('一键清空用户')}
            </Button>
        </Popconfirm>
          ,
          <Button
            key="cancel"
            type="danger"
            loading={this.props.loading}
            onClick={this.handleOk}
          >
            {t('取消关联')}
            </Button>
        ]}
      >
        <SearchFormWrapper
          t={t}
          params={this.state.params}
          handleValueChange={this.changeState}
          handleSearch={this.handleSearch}
          handleRele={this.releUser}
        />
        <Table className="upm-table"
          rowKey="id"
          size="middle"
          dataSource={datas}
          rowSelection={rowSelection}
          pagination={{
            current,
            pageSize,
            total,
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
  userList: PropTypes.object.isRequired,
  fetchRelevantUser: PropTypes.func.isRequired, // 获取关联用户
  relevantUser: PropTypes.func.isRequired, // 关联用户
  unRelevantUser: PropTypes.func.isRequired, // 取消管理
  cancelUser: PropTypes.func.isRequired, // 清空关联
}

export default connect()(UserModal)
