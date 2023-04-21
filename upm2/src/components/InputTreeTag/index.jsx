import React from 'react';
import _ from 'lodash';

import Trigger from 'rc-trigger';
import 'rc-trigger/assets/index.css';

import InputTag from '../InputTag';
import TreeSelector from '../TreeSelector';
import { saveRef } from '../util';
import { rcTriggerBuiltinPlacements } from '../config';
import './index.less';

class InputTreeTag extends React.Component {

  onInputTagChange = (e, option) => {
    const { value, onChange } = this.props;
    const id = option.value;
    const newValue = _.omit(value, id);
    console.log(option,value,id)
    onChange(newValue);
  }

  getPopup() {
    const { value, options, onChange } = this.props;
    return (
      <TreeSelector
        ref={saveRef(this, 'tree')}
        options={options}
        value={value}
        onChange={onChange}
      />
    );
  }

  getInputValue() {
    let { idMap } = this.props;
    // 如果上次没有传入 idMap，则退步使用 TreeSelector 的内部的idMap
    if (!idMap && this.tree) {
      idMap = this.tree.idMap;
    }
    idMap = idMap || {};

    return _.map(this.isEmptyObject(idMap) ? undefined : this.props.value, (checked, id) => idMap[id]);
  }

  isEmptyObject(obj) {
    for(let i in obj){
      return false
    }
    return true
  }

  render() {
    const { value, placeholder } = this.props;
    return (
      <Trigger
        action={['click']}
        // TODO 空间不够时的判断
        popupPlacement="bottomLeft"
        builtinPlacements={rcTriggerBuiltinPlacements}
        popupClassName="input-tree-tag-popup"
        popup={this.getPopup()}
        // 当value有值时，则强制触发TreeSelector的渲染，使idMap有效
        // 这样可以在InputTag里看到正常的tag值
        forceRender={!_.isEmpty(value)}
      >
        <InputTag
          value={this.getInputValue()}
          onChange={this.onInputTagChange}
          tagClosable={true}
          placeholder={placeholder}
        />
      </Trigger>
    );
  }
}

export default InputTreeTag;
