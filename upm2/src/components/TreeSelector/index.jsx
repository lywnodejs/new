/**
 * 树状的多层级 级联checkbox 选择组件
 * 支持联动、值压缩
 */

import React from 'react';
import 'rc-trigger/assets/index.css';
import _ from 'lodash';

import Menus from './Menus';

import {
  patchNodeParent,
  patchChildrenCount,
  countCheckedChildrenNode,
  fixCheckedChange,
  zipCheckedMap, unzipCheckedMap,
} from '../../utils/treeUtil';


class TreeSelector extends React.Component {

  constructor(props) {
    super(props);

    const options = this.patchTree();
    
    const fixedValue = unzipCheckedMap(this.isEmptyObject(this.idMap) ? undefined : this.props.value, this.idMap);

    this.state = {
      popupVisible: props.popupVisible,
      options,
      expandValue: [],
      value: fixedValue,
      // 某节点下 有多少个子节点 已经checked 的map
      checkedCountMap: countCheckedChildrenNode(fixedValue, this.idMap),
    };
  }

  isEmptyObject(obj) {
    for(let i in obj){
      return false
    }
    return true
  }

  patchTree(options) {
    const { root, idMap } = patchNodeParent(options || this.props.options);
    // nodeId 到 node节点的一个映射关系
    this.idMap = idMap;
    patchChildrenCount(root);

    return root;
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const { options, value } = nextProps;
    if (options !== this.props.options) {
      this.setState({
        options: this.patchTree(options),
      });
    }

    if (value !== this.props.value) {
      const fixedValue = unzipCheckedMap(value, this.idMap);
      this.setState({
        value: fixedValue,
        checkedCountMap: countCheckedChildrenNode(fixedValue, this.idMap),
      });
    }
  }

  handleMenuSelect = (targetOption, menuIndex, checked) => {
    let map = fixCheckedChange(
      this.state.value,
      this.state.checkedCountMap,
      { node: targetOption, checked },
    );
    zipCheckedMap(map, this.idMap);
    map = _.pickBy(map, checked => !!checked);

    this.props.onChange(map);

  }

  handleMenuExpand = (targetOption, menuIndex, e) => {
    e.preventDefault();
    const expandValue = [ ...this.state.expandValue ];
    expandValue[menuIndex] = targetOption.value;

    this.setState({
      expandValue,
    });
  }

  render() {
    const { value, options, checkedCountMap } = this.state;

    return (
      <Menus
        options={options}
        value={value}
        checkedCountMap={checkedCountMap}
        onSelect={this.handleMenuSelect}
        expandValue={this.state.expandValue}
        onExpand={this.handleMenuExpand}
      />
    );
  }
}

export default TreeSelector;

