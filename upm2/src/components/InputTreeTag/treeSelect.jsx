import React from 'react';
import _, { values } from 'lodash';

import { TreeSelect } from 'antd';

const { SHOW_PARENT, TreeNode } = TreeSelect;
import { saveRef } from '../util';


class TreeSelectTag extends React.Component {
  state = {
    value: [],
    searchValue:''
  };
  componentDidMount(){
    var setValue = this.getInputValue()
    this.setState({
      value:[...setValue]
    })
  }
  //设置父组件传过来的已选数据
  getInputValue() {
    let { idMap } = this.props;
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


  //给组件TreeSelect设置treeData
  renderTreeNode = (treeData) => {
    let treeNode = [];
    treeData.map((ele,index) => {
      treeNode.push(
      <TreeNode value={ele.value} title={ele.dimeNodeName} label={ele.label} key={ele.id}>{this.renderChild(ele)}</TreeNode>
      )
    })
    return treeNode;
  }
  renderChild = ele =>{
    let child = [];
    if(ele.children){
      ele.children.map((item,i)=>{
        child.push(<TreeNode value={item.value} title={item.dimeNodeName} label={item.label} key={item.id}>{this.renderChild(item)}</TreeNode>)
      })
    }
    return child;
  }

  //选中标签传给父组件
  onChange = (value) => {
    this.setState({ value });
    var obj={};
    value.map(function(e,index){
      obj[e.value] = true;
    })
    const newValue = _.omit(obj, value)
    this.props.onChange(newValue)
  };

  //处理搜索失焦清空搜索框
  qureHandleSearch = (value) => {
    this.setState({
      searchValue:value
    })
  }
  clearSearchValue = () =>{
    setTimeout(() => {
      this.setState({
        searchValue:''
      })
    },300);}

  render() {
    return (
      <TreeSelect
        ref={saveRef(this, 'tree')}
        value={this.state.value}
        onChange={this.onChange}
        showCheckedStrategy={SHOW_PARENT}
        placeholder={this.props.placeholder}
        style={{ width: '100%'}}
        treeCheckable
        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
        showSearch
        treeNodeFilterProp="label"
        allowClear
        labelInValue
        multiple
        onSearch={this.qureHandleSearch}
        onBlur={this.clearSearchValue}
        searchValue={this.state.searchValue}
      >
        {this.renderTreeNode(this.props.options)}
      </TreeSelect>)
  }
}

export default TreeSelectTag;