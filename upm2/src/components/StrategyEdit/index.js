/**
 * 角色策略编辑页面
 * by zhangdi
 */
import './style.less';
import React from 'react';
import _ from 'lodash';
import { Row, Col, Input, Select, Form } from 'antd';
import { translate } from 'react-i18next';

const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 角色选择
 * @param {*} param0
 */
class RoleSelect extends React.Component {
  render() {
    const { value, onChange, roles, disabled } = this.props;
    return (
      <Select
        showSearch
        allowClear
        {...this.props}
        value={value}
        onChange={onChange}
        disabled={disabled}
        filterOption={(input, option) => {
          const { children } = option.props;
          return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        }}>
        {_.isArray(roles) &&
          _.map(roles, ({ nameZh, id }) => {
            return (
              <Option key={id} value={id}>
                {nameZh}
              </Option>
            );
          })}
      </Select>
    );
  }
}

/**
 * 类型选择
 * @param {*} props
 */
function TypeSelect(props) {
  const { value, onChange, types, t } = props;
  return (
    <Select
      showSearch
      allowClear
      {...props}
      value={value}
      onChange={onChange}
      placeholder={t('请选择已创建的策略类型')}
      filterOption={(input, option) => {
        const { children } = option.props;
        return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}>
      {_.map(types, ({ tagKey, id }) => {
        return (
          <Option key={id} value={id}>
            {tagKey}
          </Option>
        );
      })}
    </Select>
  );
}

class Tags extends React.Component {
  /**
   * 类型变化事件处理
   */
  handleTypeChange = (value, index) => {
    const tags = this.props.value;
    const newTags = tags.slice();
    const oldType = newTags[index];

    // 更新数据
    newTags.splice(index, 1, {
      ...oldType,
      tagId: value
    });

    this.props.onChange(newTags);
  };

  /**
   * 维度变化事件处理
   */
  handleDimensionChange = (value, index) => {
    const tags = this.props.value;
    const newTags = tags.slice();
    const oldType = newTags[index];

    // 更新数据
    newTags.splice(index, 1, {
      ...oldType,
      dimeIds: value
    });

    this.props.onChange(newTags);
  };

  /**
   * 添加操作
   */
  handleAdd = () => {
    const tags = this.props.value;
    const newTags = tags.slice();

    newTags.push({
      tagId: '',
      dimeIds: []
    });

    this.props.onChange(newTags);
  };

  /**
   * 删除操作
   */
  handleRemove = index => {
    const tags = this.props.value;
    const newTags = tags.slice();

    newTags.splice(index, 1);

    this.props.onChange(newTags);
  };

  renderDimension = () => {
    const { dimensions } = this.props;
    return dimensions.map(dimension => {
      return <Option key={dimension.id.toString()}>{dimension.dimeKey}</Option>;
    });
  };

  renderOper = index => {
    const { t } = this.props;

    return index == 0 ? (
      <a
        className="upm-strategy-tags__oper"
        onClick={() => this.handleAdd(index)}>
        {t('添加策略类型和维度')}
      </a>
    ) : (
      <a
        className="upm-strategy-tags__oper"
        onClick={() => this.handleRemove(index)}>
        {t('删除策略类型和维度')}
      </a>
    );
  };

  renderTags = () => {
    const { t } = this.props;
    const tags = this.props.value;

    return tags.map(({ tagId, dimeIds }, index) => {
      return (
        <div className="upm-strategy-tags" key={index}>
          {/* 类型选择 */}
          <TypeSelect
            t={t}
            value={tagId}
            types={this.props.types}
            placeholder={t('请选择已创建的策略类型')}
            onChange={value => this.handleTypeChange(value, index)}
          />
          {this.renderOper(index)}
          {/* 维度选择 */}
          <Select
            mode="tags"
            placeholder={t('请选择已创建的维度')}
            value={dimeIds.map(id => id.toString())}
            onChange={value => this.handleDimensionChange(value, index)}>
            {this.renderDimension()}
          </Select>
        </div>
      );
    });
  };

  render() {
    return <div>{this.renderTags()}</div>;
  }
}

class StrategyEdit extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="upm-strategy-edit">
        <Form className="upm-form">
          <Row gutter={24}>
            <Col span={8}>
              <FormItem label={t('角色名称')} required>
                {getFieldDecorator('roleId', {
                  rules: [{ required: true, message: t('必填') }]
                })(
                  <RoleSelect
                    roles={this.props.roles}
                    disabled={this.props.disabled}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={t('策略唯一标识')} required>
                {getFieldDecorator('strategyKey', {
                  rules: [
                    { required: true, message: t('必填') },
                    {
                      whitespace: true,
                      message: t('不可为空')
                    }
                  ]
                })(<Input placeholder={t('策略唯一标识')} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={t('策略名称')} required>
                {getFieldDecorator('strategyName', {
                  rules: [
                    { required: true, message: t('必填') },
                    {
                      whitespace: true,
                      message: t('不可为空')
                    }
                  ]
                })(<Input placeholder={t('策略名称')} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={t('策略类型')}>
                {getFieldDecorator('tagList', {})(
                  <Tags
                    t={t}
                    types={this.props.types}
                    dimensions={this.props.dimensions}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const StrategyEditPage = Form.create({
  /**
   * 映射props和fields
   * @param {*} props
   */
  mapPropsToFields(props) {
    let fields = {};
    _.each(props.strategy, (value, key) => {
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
    props.onValueChange(values);
  }
})(StrategyEdit);

export default StrategyEditPage;
