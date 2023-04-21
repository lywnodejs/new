/**
 * 在输入框中展示Tag的组件
 * 一般和 *selector 组件结合使用
 */

import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { Input, Tag, Icon } from 'antd';
import _ from 'lodash';

import './index.less';

// 等级隐射
const levelMapping = {
  1: 'C1',
  2: 'C2',
  3: 'C3',
  4: 'C4'
};

const useRiskLevelResourceTypeIds = ['role', 'data', 'flag'];

class InputTag extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: ''
    };
  }

  handleInputChange = e => {
    // TODO 支持 输入后 search
    const { value } = e.target;
    this.setState({
      input: value
    });
    // console.log(this.state.input)
  };
  handleInputKeyDown = e => {
    // console.log(e.target.value);
    // e.preventDefault();
  };

  handleTagClose = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onChange(e, item);
  };

  handleTagClick = (e, item) => {
    const { onTagClick, onClick } = this.props;
    if (onTagClick) {
      onTagClick(e, item);
      return;
    }
    onClick && onClick(e);
  };

  getRiskLevel = (resourceTypeId, item) => {
    if (useRiskLevelResourceTypeIds.includes(resourceTypeId)) {
      return item.riskLevel || '-';
    } else {
      const list = [ 'C1', 'C2', 'C3', 'C4']
      if(list.findIndex(str => str === item.level) > 0) {
        return item.level || '-';
      }
      return levelMapping[item.level] || '-'
    }
  };

  render() {
    // return <Input {...this.props} />;

    const {
      resourceTypeId,
      value,
      // trigger props
      onClick,
      onMouseDown,
      onTouchStart,
      // 支持设置 每个tag的icon，放在末尾
      tagIconType,
      // tag是否有关闭按钮
      tagClosable,
      // 是否禁用 输入框
      disableInput,
      placeholder
    } = this.props;

    const icon = tagIconType ? <Icon type={tagIconType} /> : null;
    const inputStyle = {};
    if (disableInput) {
      inputStyle.display = 'none';
    }
    if (!_.isEmpty(value) || _.isEmpty(placeholder)) {
      inputStyle.width = 10;
    }

    return (
      <div className="input-tag ant-select-selection" onClick={onClick}>
        <div className="tags-area">
          {_.filter(value).length > 0 &&
            _.map(value, item => (
              <Tag
                key={item.value}
                onClick={e => this.handleTagClick(e, item)}
                closable={tagClosable}
                onClose={e => this.handleTagClose(e, item)}>
                {`${item.label}（${this.getRiskLevel(resourceTypeId, item)}）`}
                {icon}
              </Tag>
            ))}
          <input
            className="real-input"
            disabled
            style={inputStyle}
            value={this.state.input}
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown}
            placeholder={_.isEmpty(value) ? placeholder : ''}
          />
        </div>
      </div>
    );
  }
}

export default InputTag;
