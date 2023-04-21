/**
 * 用户选择 策略 的组件（其实不是选择，只是查看，交互看起来像在选择）
 * 常用在 用户申请的过程中，选择要申请的角色
 */

import React from 'react';
import _ from 'lodash';

import Trigger from 'rc-trigger';
import 'rc-trigger/assets/index.css';
import {
  Input, Checkbox, Select,
  Row, Col,
} from 'antd';

import { rcTriggerBuiltinPlacements } from '../config';
import InputTag from '../InputTag';
import StrategyPanel from '../StrategyPanel';
import './index.less';

class StrategySelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      popupVisible: false,
      activeTag: null,
    };
  }

  onInputTagChange = (e, option) => {
    const { value, onChange } = this.props;
    const id = option.value;
    const newValue = _.omit(value, id);
    onChange(newValue);
  }

  getPopup() {
    const { activeTag } = this.state;
    if (!activeTag) {
      const firstTag = _.first(this.props.value);
      return firstTag
        ? <StrategyPanel data={firstTag} />
        : <div />;
    }
    return <StrategyPanel data={activeTag} />;
  }

  onTagClick = (e, tag) => {
    e.stopPropagation();

    this.setActiveTag(tag);
    this.setPopupVisible(true);
  }

  setActiveTag = (tag) => {
    this.setState({
      activeTag: tag
    });
  }

  setPopupVisible = (popupVisible) => {
    this.setState({ popupVisible });
  }

  handlePopupVisibleChange = (popupVisible) => {
    this.setPopupVisible(popupVisible);
  }

  render() {
    return (
      <div className="strategy-selector" >
        <Trigger
          action={['click']}
          popupPlacement="bottomLeft"
          builtinPlacements={rcTriggerBuiltinPlacements}
          popup={this.getPopup()}
          popupVisible={this.state.popupVisible}
          onPopupVisibleChange={this.handlePopupVisibleChange}
        >
          <InputTag
            value={this.props.value}
            onChange={this.onInputTagChange}
            tagIconType="edit"
            onTagClick={(e, tag) => this.onTagClick(e, tag)}
            disableInput
          />
        </Trigger>
      </div>
    );
  }
}

export default StrategySelector;
