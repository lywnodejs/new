/**
 * 角色策略管理页面
 * by zhangdi
 */
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { translate } from 'react-i18next';
import connect from '@utils/translateConnect';
import { routerRedux } from 'dva/router';
import { Row, Col, Form, Input, Button, Table, Modal } from 'antd';
import AvailableApps from '@components/AvailableApps';
import config from '@config/style';
import { MANAGE } from '@routes/config';

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
function SearchForm({ form, t, handeAdd, handleSearch }) {
  const { getFieldDecorator } = form;

  return (
    <Form className="upm-form" onSubmit={handleSearch}>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem label={t('目标系统')} {...searchForm}>
            <AvailableApps hideClosed={true} changeCallBack={handleSearch}/>
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label={t('策略名称')} {...searchForm}>
            {getFieldDecorator('name', {})(<Input placeholder={t('请输入关键字进行模糊搜索')} />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem>
            <Button className="upm-form__button" type="primary" htmlType="submit">
              {t('查询')}
            </Button>
            <Button className="upm-form__button" onClick={handeAdd}>
              {t('新增')}
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
})(translate()(SearchForm));

class StrategyManage extends React.PureComponent {

  constructor(props) {
    super(props);

    // 设置查询参数
    this.state = {
      // 查询参数
      params: {
        name: '' // 名称
      }
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
      type: 'strategy/fetchStrategy',
      payload: {
        ...this.state.params,
        appId: this.props.appId,
        pageNo
      }
    });
  }

  handleSearch = e => {
    if (e) {
      e.preventDefault();
    }
    this.search();
  }

  handlePageChange = page => {
    this.search(page);
  }

  setCurrent = strategy => {
    this.props.dispatch({
      type: 'strategy/mergeStrategy',
      payload: strategy
    });
  }

  createStrategy = () => {
    this.setCurrent();
    this.props.dispatch(routerRedux.push(`${MANAGE}/strategy/create/${this.props.appId}`));
  }

  updateStrategy = strategy => {
    this.setCurrent(strategy);
    this.props.dispatch(routerRedux.push(`${MANAGE}/strategy/update/${this.props.appId}/${strategy.roleId}`));
  }

  removeStrategy = strategy => {
    const { t } = this.props;
    confirm({
      title: t('确定删除此记录'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        this.props.dispatch({
          type: 'strategy/removeStrategy',
          payload: {
            appId: this.props.appId,
            id: strategy.relationId
          }
        }).then(() => this.search());
      }
    });
  }

  render() {
    const { t } = this.props;
    const { records: datas, current, size: pageSize, total } = this.props.strategyList;

    return (
      <div className="upm-content">
        <SearchFormWrapper
          {...this.state.params}
          handeAdd={this.createStrategy}
          handleValueChange={this.changeState}
          handleSearch={this.handleSearch}
        />
        <Table className="upm-table"
          rowKey="relationId"
          pagination={{
            current,
            pageSize,
            total,
            hideOnSinglePage: true,
            onChange: this.handlePageChange
          }}
          dataSource={datas}>
          <Column title={t('策略编号')} dataIndex="tbStrategyDto.id" width={100}/>
          <Column title={t('角色名称')} dataIndex="roleName" />
          <Column title={t('策略名称')} dataIndex="tbStrategyDto.strategyName" />
          {/* <Column title={t('创建人')} dataIndex="creator" /> */}
          <Column
            title={t('创建时间')} dataIndex="tbStrategyDto.createdAt"
            render={(text, record) => (
              <span>
                {moment(record.createAt).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )}
          />
          <Column
            title={t('操作')}
            key="action"
            width={160}
            render={(text, record) => (
              <span>
                <Button size={TableStyle.buttonSize} onClick={() => this.updateStrategy(record)}>{t('编辑')}</Button>
                <Button type="danger"
                  size={TableStyle.buttonSize}
                  onClick={() => this.removeStrategy(record)}
                >
                  {t('删除')}
                </Button>
              </span>
            )}
          />
        </Table>
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
    strategyList: strategy.strategyList,
    appId: global.managingAvailableApp
  };
})(StrategyManage);
