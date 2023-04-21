/**
 * 用户关联页面
 * by zhangdi
 */
import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { echoMessage } from '@utils/notice';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  Table,
  Popconfirm,
  message
} from 'antd';
import config from '@config/style';
import request from '../../../../utils/request';
import moment from 'moment';

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
            {getFieldDecorator('username', {})(
              <Input placeholder={t('用户名，多用户以逗号间隔')} />
            )}
          </FormItem>
        </Col>
        <Col span={16}>
          <FormItem>
            <Button
              className="upm-form__button"
              type="primary"
              onClick={() => {
                props.handleSearch();
              }}>
              {t('查询')}
            </Button>
            <Button
              className="upm-form__button"
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

class UserRele extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      size: 4,
      list: [],
      totalList: [],
      cancelIds: [], // 取消关联的用户集合
      // 查询参数
      params: {
        username: '' // 名称
      },
      loading: false
    };
  }

  componentDidMount() {
    let list = [...this.props.info];
    this.setState({
      totalList: list
    });
  }
  componentWillReceiveProps(nextProps) {
    let list = [...nextProps.info];
    this.setState({
      totalList: list
    });
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
  };

  search = (page = 1) => {
    this.setState({
      cancelIds: []
    });
    this.props.search();
  };

  /**
   * 分页操作
   */
  handlePageChange = page => {
    this.search(page);
  };

  /**
   * 搜索
   */
  handleSearch = () => {
    let data = {
      packageId: this.props.package.id,
      appId: 888,
      userNames: this.state.params.username
    };
    this.props.searchChild(data);
  };

  /**
   * 关联用户
   */
  releUser = () => {
    const { t } = this.props;
    if (this.state.params.username.trim() === '') {
      message.error(t('请输入用户名'));
      return;
    }
    this.props
      .dispatch({
        type: 'managePackage/savePackageUserList',
        payload: {
          userNames: this.state.params.username.split(','),
          packageId: this.props.package.id,
          appId: 888
        }
      })
      .then(() => {
        message.success(
          t('绑定成功！权限生效需要几分钟时间，请稍后刷新列表查看')
        );
        this.reset();
        setTimeout(() => {
          this.search();
        }, 0);
      });
  };
  handleCancleUser = () => {
    let info = this.props.info;
    if (info) {
      const { t } = this.props;
      let userNames = info.map(item => {
        return item.username;
      });
      this.props
        .dispatch({
          type: 'managePackage/unRelevantUser',
          payload: {
            appId: 888,
            packageId: this.props.package.id,
            userNames: userNames
          }
        })
        .then(() => {
          message.success(t('清空用户成功'));
          this.reset();
          setTimeout(() => {
            this.search();
          }, 0);
        });
    }
  };
  /**
   * 取消关联
   */
  handleOk = () => {
    const { t } = this.props;
    // 更新数据之后关闭模态框
    if (this.state.cancelIds.length < 1) {
      return echoMessage(t('请至少选择一名用户！'), 'warning');
    }
    this.setState({
      loading: true
    });

    this.props
      .dispatch({
        type: 'managePackage/unRelevantUser',
        payload: {
          appId: 888,
          packageId: this.props.package.id,
          userNames: this.state.cancelIds
        }
      })
      .then(() => {
        this.setState({
          loading: false,
          cancelIds: []
        });
        message.success(t('取消关联成功'));
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
    // this.reset();
    this.props.handleCancel();
  };

  /**
   * 更新选中项
   */
  onSelectChange = selectedRowKeys => {
    this.setState({
      cancelIds: selectedRowKeys
    });
  };

  render() {
    const { cancelIds } = this.state;
    const { t } = this.props;
    const datas = this.state.totalList;

    const rowSelection = {
      selectedRowKeys: cancelIds,
      onChange: this.onSelectChange
    };
    const title = t('与{{role}}关联的用户', { role: this.props.package.name });

    return (
      <Modal
        afterClose={this.reset}
        title={title}
        destroyOnClose={true}
        style={this.props.style}
        width={config.modal.size.large}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Popconfirm
            placement="topLeft"
            title={t('是否一键清空用户所有权限')}
            onConfirm={this.handleCancleUser}
            okText={t('确认')}
            cancelText={t('取消')}>
            <Button style={{ display: 'none' }} type="primary">
              {t('一键清空用户')}
            </Button>
          </Popconfirm>,
          <Button
            style={{ display: 'none' }}
            key="cancel"
            type="danger"
            loading={this.state.loading}
            onClick={this.handleOk}>
            {t('取消关联')}
          </Button>
        ]}>
        <SearchFormWrapper
          t={t}
          params={this.state.params}
          handleValueChange={this.changeState}
          handleSearch={this.handleSearch}
          handleRele={this.releUser}
        />
        <Table
          className="upm-table"
          rowKey="username"
          size="middle"
          dataSource={datas}
          rowSelection={rowSelection}
          // pagination={{
          //   current,
          //   size,
          //   total,
          //   // hideOnSinglePage: true,
          //   onChange: this.handlePageChange
          // }}
        >
          <Column title={t('ID')} dataIndex="id" width={100} />
          <Column title={t('账号')} dataIndex="username" />
          <Column title={t('姓名')} dataIndex="usernameZh" />
          <Column
            title={t('绑定时间')}
            dataIndex="relationTime"
            render={(text, record) => (
              <span>
                {moment(record.relationTime).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )}
          />
        </Table>
      </Modal>
    );
  }
}

// TODO 关联用户Model
export default connect(({ global }) => {
  return {
    appId: global.managingAvailableApp
  };
})(UserRele);
