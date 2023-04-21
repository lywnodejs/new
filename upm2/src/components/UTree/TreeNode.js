import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { Tree } from 'antd';

class TreeNode extends Tree.TreeNode {

  renderCheckbox = function renderCheckbox(props) {
    var _checkboxCls;

    var prefixCls = props.prefixCls;
    var checkboxCls = (_checkboxCls = {}, _checkboxCls[prefixCls + '-checkbox'] = true, _checkboxCls);
    if (props.checked) {
      checkboxCls[prefixCls + '-checkbox-checked'] = true;
    } else if (props.halfChecked) {
      checkboxCls[prefixCls + '-checkbox-indeterminate'] = true;
    }
    var customEle = null;
    if (typeof props.checkable !== 'boolean') {
      customEle = props.checkable;
    }
    if (props.disabled || props.disableCheckbox) {
      checkboxCls[prefixCls + '-checkbox-disabled'] = true;
    }
    return <span>xxx</span>
    // return <span className={classNames(checkboxCls)}>{customEle}</span>;
  }
}

export default TreeNode;
