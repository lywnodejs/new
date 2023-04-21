import React from 'react';
import classNames from 'classnames';
import connect from '@utils/translateConnect';
import _ from 'lodash';
import { Tree, Checkbox } from 'antd';

import './index.less';

const TreeNode = Tree.TreeNode;
/**
 * 遍历树形结构
 * @param {*} nodes 树形结构节点
 * @param {*} iteratee 迭代器
 * @param {*} predicate 条件判断
 */
function traverse (nodes, iteratee, predicate) {

  if (_.isEmpty(nodes)) return;

  let next = nodes.slice();

  while (next.length) {
    let node = next.shift();

    // 迭代器，传入节点和父节点
    iteratee(node);

    // 遍历终止条件
    if (typeof predicate === 'function' && predicate()) return;

    let { children } = node,
      childrenNodes = children ? children.slice() : [];

    // 广度优先遍历
    while (childrenNodes.length) {
      let childNode = childrenNodes.shift();

      typeof childNode.parentNode === 'undefined' && (childNode.parentNode = node); // 设置父节点
      next.push(childNode);
    }
  }
}

/**
 * 获取匹配节点
 * @param {*} nodes
 * @param {*} matchkyes
 * @param {*} predicate
 */
function match (nodes, matchkyes, predicate) {
  let checkedNodes = [],
    checkedKeys = matchkyes.slice();

  /**
   * 设置选中节点
   */
  function setCheckedFlag (node) {
    let tmpKeys = checkedKeys.slice(),
      len = tmpKeys.length;

    for (let i = 0; i < len; i++) {
      if (predicate(tmpKeys[i], node)) {
        checkedNodes.push(node); // 匹配成功添加到集合
        checkedKeys.splice(i, 1); // 删除已匹配项
      }
    }
  }

  traverse(nodes, setCheckedFlag, () => checkedKeys.length == 0);

  return checkedNodes;
}

/**
 * 支持查询，动态展开
 * 由于性能问题，使用select模拟check效果
 *
 * onCheck 获取checked节点信息
 * onSelect 获取selected节点信息
 */
class UTree extends React.Component {

  constructor(props) {
    super(props);

    // 扁平化处理树形结构数据
    this.nodeMap = {};
    // 存放展开id
    this.expandedKeyList = [];
    this.state = {
      autoExpandParent: false, // 是否自动展开树，在查询和手动展开是区分
      expandedKeys: [],// 展开项
      list: [...props.nodes]
    };
    this.checkStrictly = true; // 级联选择模式
    this.loaded = false; //数据加载完成
  }


  /**
   * 隐射id
   */
  mapNodes = (nodes) => {
    traverse(nodes, node => {
      this.nodeMap[node.id] = node;
      node.checkChildren = [];
    });
  }

  /**
   * 根据id获取节点
   */
  getMatchedNode = id => {

    return this.nodeMap[id];
  }

  /**
   * 获取通过查询匹配的节点
   */
  getMatchedNodes = searchValue => {
    const { nodes, showName } = this.props,
    matchedNodes = [];

    traverse(nodes, node => {
      if (showName) {
        (node.name.indexOf(searchValue) != -1 || node.nameZh.indexOf(searchValue) != -1 || (node.url&&node.url.indexOf(searchValue) != -1)) && matchedNodes.push(node);
      } else {
        (node.name.indexOf(searchValue) != -1 || (node.url&&node.url.indexOf(searchValue) != -1)) && matchedNodes.push(node);
      }
    });

    return matchedNodes;
  }

  /**
   * 根据属性值匹配节点
   */
  getMatchedField = (item, fields, value) => {
    const match = {};
    const length = fields.length;

    for (let i = 0; i < length; i++) {
      const field = fields[i];

      if (typeof item[field] === 'string') {
        match[field] = item[field].indexOf(value);
      }
    }

    return match;
  }

  /**
   * 获取祖先节点
   */
  getParentKeys = nodeId => {
    let expandedKeys = this.expandedKeyList;
    let node = this.getMatchedNode(nodeId);
    if (node) {
      let parent = node.parentNode;

      while (parent) {
        const pid = parent[this.props.primaryKey];
        !_.includes(expandedKeys, pid) && expandedKeys.unshift(pid);
        parent = this.nodeMap[parent.pid];
      }
    }
  }

  /**
   * 设置展开节点（非手动展开情况下）
   * 展开节点受searchValue和checkedKeys两个影响
   */
  setExpandKeys = (searchValue, checkedKeys) => {
    const {list} = this.state;

    if (searchValue) {
      this.getMatchedNodes(searchValue).forEach(node => this.getParentKeys(node.id));
    }
    if (!this.loaded && checkedKeys) {
      // 首次加载数据，树节点展开状态受checkedKeys影响，之后展开状态有用户操作决定
      checkedKeys.forEach(nodeId => this.getParentKeys(nodeId));
      this.autoExpand(true);
    }else{
      this.autoExpand(false);
    }
    // checkedKeys.forEach(nodeId => this.getParentKeys(nodeId));
    // checkedKeys.forEach(nodeId => this.getParentKeys(nodeId));
  }

  /**
   * 设置节点选中的子节点集合
   */
  setCheckChildren = (checkedKeys) => {
    const keys = Object.keys(this.nodeMap);

    keys.forEach((id) => {
      const node = this.nodeMap[id];
      node.checkChildren = [];

      _.isArray(node.children) && node.children.forEach((item) => {
        const id = item.id.toString();

        (_.includes(checkedKeys, id) && !_.includes(node.checkChildren, id)) && node.checkChildren.push(id);
      });
    });
  }

  /**
   * 级联选择
   */
  handleChangeCheckStrictly = (e) => {
    this.checkStrictly = !e.target.checked;
  }

  /**
   * 注册选中事件
   */
  handlecheckedNodes = ({ checked }, { checkedNodes }, raw = false) => {
    // 更新选中id集合
    this.props.onCheck(checked, raw ? checkedNodes : checkedNodes.map(node => node.props.dataRe));
  }

  /**
   * 注册点击事件
   */
  handleSelectedNode = (selectedIds, { selected, node }) => {
    const { checkable, isSelectable = () => { return true; } } = this.props;
    const { dataRef } = node.props;
    const checkStrictly = this.checkStrictly;

    /**
     * 设置父节点选中状态
     */
    function changeParentState (node, state) {
      let id = node.id.toString(); // 子节点id
      let parentNode = node.parentNode; // 父节点

      while (parentNode) {
        const pid = parentNode.id.toString(); // 父节点id
        const checkChildren = parentNode.checkChildren; // 父节点记录子节点选中集合
        const children = parentNode.children; // 父节点的子节点集合
        const index = _.indexOf(selectedIds, pid); // 父节点是否已选中
        const cindex = _.indexOf(checkChildren, id); // 子节点是否已选中

        if (!state) {

          // 子节点未选中，父节点也变为未选中状态
          cindex >= 0 && checkChildren.splice(cindex, 1); // 从父节点选中集合移除
          index >= 0 && selectedIds.splice(index, 1); // 移除父节点
        } else {

          // 子节点选中，父节点需判断是否全选
          cindex < 0 && checkChildren.push(id); // 将子节点加入父节点选中集合
          if (checkChildren.length !== children.length) return;
          (index < 0 && isSelectable(parentNode)) && selectedIds.push(pid); // 子节点全选则父节点也变更选中状态
        }
        id = parentNode.id.toString();
        parentNode = parentNode.parentNode;
      }
    }

    /**
     * 设置子节点选中状态
     */
    function changeChildrenState (node, state) {
      const id = node.id.toString();
      const children = node.children;
      const index = _.indexOf(selectedIds, id);
      const isArray = _.isArray(children);
      if (state) {

        // 添加元素
        index === -1 && selectedIds.push(id);
        isArray && (node.checkChildren = children.map(item => item.id.toString()));
      } else {

        // 删除元素
        index > -1 && selectedIds.splice(index, 1);
        node.checkChildren = [];
      }
      if (isArray) {

        // 递归改变子节点状态
        children.forEach(item => {
          changeChildrenState(item, state);
        });
      }
    }

    if (checkable) {

      // 开启多选模式
      if (!checkStrictly) {
        changeChildrenState(dataRef, selected); // 改变子节点状态
        changeParentState(dataRef, selected); // 改变父节点状态
      }

      // 替换触发check事件
      this.handlecheckedNodes({ checked: selectedIds }, { checkedNodes: selectedIds.map(id => this.nodeMap[id]) }, true);
    }
    this.props.onSelect(selectedIds, node.props.dataRef);
  }

  /**
   * 展开操作
   */
  expand = expandedKeys => {
    // this.expandedKeyList = expandedKeys;
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  /**
   * 自动展开
   * bool  是否自动打开
   */
  autoExpand = (bool) => {
    setTimeout(()=>{
      let expandedKeys=bool ? [...new Set([...this.state.expandedKeys,...this.expandedKeyList.map(item => ''+item)])]
                            :[...new Set([...this.state.expandedKeys])]
      this.setState({
        expandedKeys: expandedKeys,
        autoExpandParent: bool,
      });
    },0)
  }

  /**
   * 渲染checkbox
   * 由于rc-tree的性能问题，每个节点都进行了事件注册，
   * 导致节点多的情况下，占用内存过多
   */
  // renderCheckbox = (props, title) => {
  //   const {
  //     checkable,
  //     isDisabled = _.noop,
  //     isDisableCheckbox = _.noop
  //   } = this.props;
  //   if (!checkable) return null;

  //   const prefixCls = 'ant-tree';

  //   let _checkboxCls;
  //   let checkboxCls = (_checkboxCls = {}, _checkboxCls[prefixCls + '-checkbox'] = true, _checkboxCls);
  //   if (props.checked) {
  //     checkboxCls[prefixCls + '-checkbox-checked'] = true;
  //   } else if (props.halfChecked) {
  //     checkboxCls[prefixCls + '-checkbox-indeterminate'] = true;
  //   }
  //   if (isDisabled(props) || isDisableCheckbox(props)) {
  //     checkboxCls[prefixCls + '-checkbox-disabled'] = true;
  //   }

  //   return (
  //     <span>
  //       <span
  //         className={classNames(checkboxCls)}
  //       >
  //         <span className="ant-tree-checkbox-inner"></span>
  //       </span>
  //       {title}
  //     </span>
  //   );
  // }

  /**
   * 渲染节点内容
   */
  renderMatchedNode = (value, search, index) => {
    if (search && index > -1) {
      const before = value.substr(0, index);
      const after = value.substr(index + search.length);

      return (<span>{before}<span style={{ color: '#f50' }}>{search}</span>{after}</span>);
    }

    return value;
  }

  /**
   * 递归渲染
   */
  renderRecursion = (item, title) => {
    const {
      primaryKey,
      isDisabled = _.noop,
      isSelectable = () => { return true; },
    } = this.props;
    const itemSelectable = isSelectable(item);

    if (item.children) {
      return (
        <TreeNode className={!itemSelectable ? 'upm-tree--unselect' : null} title={title} key={item[primaryKey]} dataRef={item} selectable={itemSelectable} disabled={isDisabled(item)}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode className={!itemSelectable ? 'upm-tree--unselect' : null} title={title} key={item[primaryKey]} dataRef={item} selectable={itemSelectable} disabled={isDisabled(item)} />;
  }

  /**
   * 渲染树节点
   */
  renderTreeNodes = nodes => {
    const {
      searchValue = '',
      showName = false
    } = this.props;

    let filterFields = ['name','url'];

    if (showName) {
      let filterFields = ['name', 'nameZh','url'];

      return nodes.map((item) => {
        const { name, nameZh } = item;
        const match = this.getMatchedField(item, filterFields, searchValue);

        let sname = this.renderMatchedNode(name, searchValue, match.name),
          snameZh = this.renderMatchedNode(nameZh, searchValue, match.nameZh),
          title = <span className="ant-tree-title">{sname}（{snameZh}）</span>;

        return this.renderRecursion(item, title);
      });
    }

    return nodes.map((item) => {
      const { name } = item;
      const match = this.getMatchedField(item, filterFields, searchValue);

      let sname = this.renderMatchedNode(name, searchValue, match.name),
        title = <span className="ant-tree-title">{sname}</span>;

      return this.renderRecursion(item, title);
    });
  }

  /**
   * 首次挂载
   */
  componentWillMount () {
    const { nodes, checkedKeys, searchValue } = this.props;

    // 设置隐射关系
    this.mapNodes(nodes);

    // this.filterNodes(searchValue,[]);

    // 设置展开节点
    this.setExpandKeys(searchValue, checkedKeys);
    this.setCheckChildren(checkedKeys);
    this.loaded = nodes.length > 0;
  }

  componentDidMount () {
    const { onRef,searchValue,nodes } = this.props;
    setTimeout(()=>{
      // console.log(nodes)
      this.filterNodes(searchValue,nodes);
    },0)
    if (onRef) {
      onRef(this);
    }
  }

  /**
   * 更新发生时
   * @param {*} nextProps
   */
  componentWillReceiveProps (nextProps) {
    const { nodes, checkedKeys, searchValue } = nextProps;
    // console.log('componentWillReceiveProps',nodes)
    // 更新隐射关系
    this.props.nodes != nodes && this.mapNodes(nodes);
    this.filterNodes(nextProps.searchValue,nodes);
    if(this.props.searchValue!==nextProps.searchValue) {
      setTimeout(()=>{
        this.setState({expandedKeys:[]})
      },0)
      this.expandedKeyList = []
    }
    if(nextProps.checkedKeys.length>=this.props.checkedKeys.length) {

    }
    // 更新展开节点
    this.setExpandKeys(searchValue, checkedKeys);
    this.setCheckChildren(checkedKeys);
    if (!this.loaded) {
      this.loaded = this.props.nodes.length === 0 && nodes.length > 0;
    }
  }



  filterNodes = (matched,nodes) => {
    // const { nodes } = this.props;

    if (matched === '') {
      this.setState({
        list: [...nodes]
      });
      return;
    }

    this.matches = [];
    const matchedList = this.getMatchedItem(_.cloneDeep(nodes), matched);

    this.setState({
      list: matchedList,
    });

    if (this.matches.length === 1) {
      const item = this.matches[0];

      this.setState({
        selectedKeys: [`${item.id}`],
        expandKeys: item.path.map((id) => `${id}`)
      }, () => {
        // this.props.requestSelect(item);
      });
    }
  };

  getMatchedItem = (list, matched) => {
    const shouldItemFiltered = (item) => this.shouldFilter(item, matched);

    return list.filter((item) => {
      if (item.children) {
        const children = this.getMatchedItem(item.children, matched);
        item.children = children;
      }
      return !shouldItemFiltered(item);
    });
  };

  shouldFilter = (node, matched) => {
    const { id } = node;

    let isFiltered = this.nodeFilter(node, matched);

    if (isFiltered) {
      // 需要判断子节点以及子节点的子节点是否被过滤，只要有一个没有被过滤就不应该过滤掉
      if (node.children) {
        return node.children.every((child) => this.shouldFilter(child, matched));
      }

      return true;
    }

    if (!_.find(this.matches, { id })) {
      this.matches.push(node);
    }

    return false;
  };

  nodeFilter(node, matched) {
    const { name, commonName, url } = node;
    let titleString = '';
    if (name) {
      titleString += name;
    }

    if (commonName) {
      titleString += commonName;
    }

    if (url) {
      titleString += url;
    }

    return titleString.indexOf(matched) < 0;
  }

  render () {
    const { nodes, selectedKeys, t } = this.props;
    const checkedKeys = this.props.checkedKeys.map(key => key.toString());
    const _selectedKeys = this.props.checkable
      ?
      _.isArray(selectedKeys)
        ? checkedKeys.concat(...selectedKeys)
        : checkedKeys
      : selectedKeys;

    return (
      <div className="upm-tree"
        onClick={this.handleClick}>
        <Checkbox className="upm-tree__oper" onChange={this.handleChangeCheckStrictly}>{t('级联选择')}</Checkbox>
        <div className="upm-tree__content">
          <Tree
            {...this.props}
            showIcon={false}
            showLine={false}
            checkable={false}
            multiple={this.props.checkable}
            checkStrictly={this.props.checkStrictly}
            selectedKeys={_selectedKeys}
            checkedKeys={checkedKeys}
            autoExpandParent={this.state.autoExpandParent}
            expandedKeys={this.state.expandedKeys}
            onExpand={this.expand}
            onCheck={this.handlecheckedNodes}
            onSelect={this.handleSelectedNode}
          >
            {/* {this.renderTreeNodes(nodes)} */}
            {this.renderTreeNodes(this.state.list)}
          </Tree>
        </div>
      </div>
    );
  }
}

UTree.defaultProps = {
  primaryKey: 'id'
  // primaryKey: 'idStr'
};

UTree.match = match;

export default connect()(UTree);
