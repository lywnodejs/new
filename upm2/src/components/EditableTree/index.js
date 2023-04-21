import React, { Component } from 'react';
import { Tree, Input, Popconfirm, Button, Modal, Row, Col, Select } from 'antd';
import PropTypes from 'prop-types';
import _, { uniqueId, find, isEqual } from 'lodash';
import { translate } from 'react-i18next';

import findTreeNodeById from '@utils/findTreeNodeById';
import languageList from '@assets/commonData/languageList';

import './index.less';

const fakeIdPrefix = 'new-node-';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const confirm = Modal.confirm;

const nodeShape = {
  name: PropTypes.string,
  commonName: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  requestAdd: PropTypes.func,
  requestDel: PropTypes.func,
  requestSelect: PropTypes.func,
  isNeedSearch: PropTypes.boolean
};
nodeShape.children = PropTypes.arrayOf(PropTypes.shape(nodeShape));

class EditableTree extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape(nodeShape)),
  };

  static defaultProps = {
    isNeedAdd: true,
    isNeedDel: true,
    nodeFilter(node, matched) {
      const { name, commonName } = node;
      let titleString = '';
      if (name) {
        titleString += name;
      }

      if (commonName) {
        titleString += commonName;
      }

      return titleString.indexOf(matched) < 0;
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      expandKeys: props.data.map((item) => `${item.id}`),
      autoExpandParent: true,
      selectedKeys: [],
      list: [...props.data]
    };

    if (props.isNeedSearch) {
      this.state.searchValue = '';
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      languageListValue: nextProps.languageSelectValue
    });
    if (this.props.data !== nextProps.data) {
      this.setState({
        list: [...nextProps.data],
      });

      const [selectedId] = this.state.selectedKeys;
      if (selectedId) {
        const item = findTreeNodeById(nextProps.data, selectedId);

        if (!item) {
          this.setState({
            selectedKeys: []
          });
        }
      }
    }
  }

  handleAddNode = (event, isRoot) => {
    event.stopPropagation();

    let item = null;

    if (!isRoot) {
      item = findTreeNodeById(this.state.list, this.state.selectedKeys[0]);
    }

    const fakeId = uniqueId(fakeIdPrefix);

    this.props.requestAdd(item, { fakeId });

    if (item && item.id) {
      this.setState({
        expandKeys: this.state.expandKeys.concat(`${item.id}`),
        selectedKeys: [fakeId]
      });
    } else {
      this.setState({
        selectedKeys: [fakeId]
      });
    }
  };

  confirmDelNode = () => {
    const { t } = this.props;
    confirm({
      title: t('确定删除?'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        const item = findTreeNodeById(this.state.list, this.state.selectedKeys[0]);
        this.handleDelNode(item)
      }
    });
  };

  handleDelNode = (item) => {
    this.props.requestDel(item);
  };

  handleSelect = (selectedKeys) => {
    this.setState({
      selectedKeys
    }, () => {
      const item = findTreeNodeById(this.state.list, selectedKeys[0]);
      this.props.requestSelect(item);
    });
  };

  getNodeMapper = (item) => {
    const {
      id,
      name,
      nameZh,
      commonName,
      children,
      isFake,
    } = item;
    // let displayName = name;
    let displayNameZh = nameZh && `(${nameZh})`;
    const titleEle = `${commonName||name}${displayNameZh ? displayNameZh : ''}`;
    //   (
    //   <p onClick={(event) => {
    //     this.props.requestSelect(item);
    //   }}>
    //     {displayName}
    //     {displaycommonName}
    //     <Button
    //       shape="circle"
    //       size="small"
    //       icon="plus"
    //       onClick={(e) => this.handleAddNode(e, item)}
    //       className="add-icon"
    //       disabled={isFake}
    //     />
    //
    //     <Popconfirm
    //       placement="top"
    //       title={
    //         <span style={{ color: 'red' }}>
    //           确定删除？
    //         </span>
    //       }
    //       onConfirm={() => this.handleDelNode(item)}
    //       okText="确定"
    //       cancelText="取消">
    //       <Button
    //         shape="circle"
    //         size="small"
    //         type="danger"
    //         icon="close"
    //         onClick={(e) => e.stopPropagation()}
    //         className="del-icon"
    //       />
    //     </Popconfirm>
    //   </p>
    // );

    if (!item.children) {
      return (
        <TreeNode title={titleEle} key={id} />
      );
    }

    return (
      <TreeNode
        title={titleEle}
        key={id}
      >
        {children.map(this.getNodeMapper)}
      </TreeNode>
    );
  };

  handleExpand = (expandedKeys) => {
    this.setState({
      expandKeys: expandedKeys.map((id) => `${id}`),
      autoExpandParent: false,
    });
  };

  onSearchChange = (e) => {
    const value = e.target.value;

    this.setState({
      searchValue: value,
      autoExpandParent: true,
    }, () => {
      this.filterNodes(value);
    });
  };

  onLanguageChange = (value) => {//改变语言设置
    this.props.changeLanguage(value)
  }

  filterNodes = (matched) => {
    const { data } = this.props;

    if (matched === '') {
      this.setState({
        list: [...data]
      });
      return;
    }

    this.matches = [];
    const matchedList = this.getMatchedItem(_.cloneDeep(data), matched);

    this.setState({
      list: matchedList,
    });

    if (this.matches.length === 1) {
      const item = this.matches[0];

      this.setState({
        selectedKeys: [`${item.id}`],
        expandKeys: item.path.map((id) => `${id}`)
      }, () => {
        this.props.requestSelect(item);
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

    let isFiltered = this.props.nodeFilter(node, matched);

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

  render() {
    const { data, isNeedSearch, t, needLanguageSelection, isNeedAdd, isNeedDel } = this.props;
    const { expandKeys, autoExpandParent, searchValue, selectedKeys, list } = this.state;

    return (
      <div className="EditableTree">
        {
          needLanguageSelection && (
            <Select
              mode="multiple"
              className="select-input"
              placeholder={t('选择输入的语言')}
              onChange={this.onLanguageChange}
              disabled={selectedKeys.length === 0}
              value={this.state.languageListValue}
              onDeselect={this.props.onDeselect}
            >
              {_.map(languageList, language =>
                <Select.Option key={language.lang} value={language.lang} >{language.name}</Select.Option>
              )}
            </Select>
          )
        }
        {
          isNeedSearch && (
            <Search
              className="search-input"
              placeholder={this.props.searchPlaceholder || t('请输入关键字进行模糊搜索')}
              onChange={this.onSearchChange}
            />
          )
        }

        <Row gutter={12}>
          {/*<Col span={8}>*/}
          {isNeedAdd && (
            <React.Fragment>
              <Button
                size="small"
                icon="plus"
                onClick={(e) => this.handleAddNode(e, true)}
                disabled={data.length === 1 && data[0].isFake}
                className="btn"
              >
                {t('新增根节点')}
              </Button>
              <Button
                size="small"
                icon="plus"
                type="primary"
                onClick={(e) => this.handleAddNode(e)}
                disabled={selectedKeys.length === 0}
                className="btn"
              >
                {t('给选中节点添加子节点')}
              </Button>
            </React.Fragment>
          )}
          {/*</Col>*/}
          {/*<Col span={8}>*/}
          {/*</Col>*/}
          {/*<Col span={8}>*/}
          {
            isNeedDel && (
              <Button
                size="small"
                icon="close"
                type="danger"
                onClick={this.confirmDelNode}
                disabled={selectedKeys.length === 0}
                className="btn"
              >
                {t('删除选中节点')}
              </Button>
            )
          }
          {/*</Col>*/}
        </Row>

        <div className="tree-area">
          <Tree
            autoExpandParent={autoExpandParent}
            expandedKeys={expandKeys}
            onExpand={this.handleExpand}
            selectedKeys={selectedKeys}
            onSelect={this.handleSelect}
          >
            {list.map(this.getNodeMapper)}
          </Tree>
        </div>
      </div>
    );
  }
}

export default translate()(EditableTree);
