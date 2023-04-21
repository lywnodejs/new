/**
 * 角色绑定功能页面
 * by zhangdi
 */
import './style.less';
import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Row, Col, Form, Input, Select, Button, Modal, Tag } from 'antd';
import config from '@config/style';
import UTree from '@components/UTree';

const FormItem = Form.Item;
const match = UTree.match;
const { searchForm } = config;

function SearchForm (props) {
  const { t } = props;
  const { getFieldDecorator, getFieldsValue } = props.form;

  return (
    <Form className="upm-form" onSubmit={e => {
      e.preventDefault();
      props.handleSearch(getFieldsValue(['name']));
    }}>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem label={t('名称')} {...searchForm}>
            {getFieldDecorator('name', {})(<Input placeholder={t('名称/中文名/URL')} />)}
          </FormItem>
        </Col>
        <Col span={16}>
          <FormItem>
            <Button className="upm-form__button" type="primary" htmlType="submit">
              {t('查询')}
            </Button>
            <Button className="upm-form__button" type="primary" onClick={props.handleClear}>
              {t('清空选择')}
            </Button>
            <Button className="upm-form__button" type="primary" onClick={props.handleSave}>
              {t('保存')}
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
  mapPropsToFields (props) {
    let fields = {};
    _.each(props.params, (value, key) => {
      fields[key] = Form.createFormField({ value });
    });
    return fields;
  },
})(SearchForm);

class FeatureRele extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      params: {
        name: ''
      },
      selectedFeature: {
        name: '',
        nameZh: ''
      },
      checkedFeatures: [] // 选中项
    };
  }

  /**
   * 重置筛选条件
   */
  resetFilterFields = () => {
    this.setState({
      params: {
        name: ''
      }
    });
  }

  /**
   * 搜索功能
   */
  search = ({ name }) => {
    this.setState({
      params: {
        name
      }
    });
  }

  /**
   * 清楚选择功能
   */
  clear = () => {
    this.props.dispatch({
      type: 'role/mergeRole',
      payload: {
        featureList: []
      }
    });
  }

  /**
   * 绑定标识位
   */
  relevantFeature = () => {
    const { id, appId, featureList } = this.props.role;

    this.props.dispatch({
      type: 'role/relevantFeature',
      payload: {
        id,
        appId,
        featureIds: featureList
      }
    }).then(() => {
      this.props.handleOk();
    });
  }

  /**
   * 更新选中节点
   */
  checkedFeatures = (checked, checkedFeatures) => {

    // 更新选中节点集合
    this.setState({
      checkedFeatures
    });

    // 更新选中id集合
    this.props.dispatch({
      type: 'role/mergeRole',
      payload: {
        featureList: checked
      }
    });
  }

  /**
   * 设置当前点击项
   */
  selectedFeature = (keys, selectedFeature) => {
    this.setState({
      selectedFeature
    });
  }

  /**
   * 格式化输出选中信息
   */
  formatChecked = () => {

    const { features, role } = this.props;
    const checkedFeatures = match(features, role.featureList, (key, node) => key == node.id);
    this.state.checkedFeatures = checkedFeatures;

    return checkedFeatures.map(feature => {
      return <Tag key={feature.id} closable onClose={() => { this.deleteSelect(feature); }}>{feature.name}</Tag>;
    });
  }

  /**
   * 删除选中的一项
   */
  deleteSelect = (feature) => {
    let { checkedFeatures } = this.state;

    let checked = [];
    checkedFeatures.map((item, index) => {
      if (item === feature) {
        checkedFeatures.splice(index, 1);
        this.selectedFeature(index, feature);
      }
    });
    checkedFeatures.map(item => {
      checked.push(item.id + '');
    });

    //调用子组件UTree方法，刷新选中节点
    this.UTree.handlecheckedNodes({ checked }, { checkedNodes: checkedFeatures }, true);
  }

  /**
   * 模态框关闭
   */
  handleCancel = () => {
    this.props.handleCancel();
  }
  /**
   * 设置UTree组件的ref
   */
  onRef = (ref) => {
    this.UTree = ref;
  }

  render () {
    const { features, role, t } = this.props;
    const formItemLayout = null;

    return (
      <Modal
        afterClose={this.resetFilterFields}
        className='upm-role-rele-group'
        title={t('分配功能')}
        destroyOnClose={true}
        style={{
          top: '40px',
          ...this.props.style
        }}
        width={config.modal.size.large}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[]}
      >
        <SearchFormWrapper
          t={t}
          params={this.state.params}
          handleSearch={this.search}
          handleClear={this.clear}
          handleSave={this.relevantFeature}
        />
        <Row className="upm-tree-panel">
          <Col className="upm-tree-panel__left"
            span={12}>
            <div>
              <UTree
                checkable
                showLine
                nodes={features}
                searchValue={this.state.params.name}
                checkedKeys={role.featureList}
                onCheck={this.checkedFeatures}
                onSelect={this.selectedFeature}
                onRef={this.onRef}
              />
            </div>
          </Col>
          <Col className="upm-tree-panel__right"
            span={12}>
            <div className="upm-role-rele-group__info upm-border-bottom">
              <label className="upm-tree-panel__label">{t('当前选中：')}</label>
              {this.formatChecked()}
            </div>
            <div>
              <label className="upm-tree-panel__label">{t('功能详情：')}</label>
              <Form className="upm-role-rele-group__detail">
                <FormItem label={t('名称')} {...formItemLayout}>
                  <Input value={this.state.selectedFeature.name} disabled />
                </FormItem>
                <FormItem label={t('URL')} {...formItemLayout}>
                  <Input value={this.state.selectedFeature.url} disabled />
                </FormItem>
                <FormItem label={t('备注')} {...formItemLayout}>
                  <Input value={this.state.selectedFeature.remark} disabled />
                </FormItem>
                <FormItem label={t('是否菜单')} {...formItemLayout}>
                  <Select value={this.state.selectedFeature.isMenu} disabled >
                    <Option value={1}>{t('是')}</Option>
                    <Option value={0}>{t('否')}</Option>
                  </Select>
                </FormItem>
              </Form>
            </div>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default connect(({ feature, role }) => {
  return {
    features: feature.list,
    role: role.role
  };
})(FeatureRele);
