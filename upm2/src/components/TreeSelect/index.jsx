import React, { Component } from 'react';

import TN from './TreeNode';
import {
  Spin
} from 'antd';

import './index.less';
import Icon from './arr.png';

const sizeClassMap = {
  small: 'small-size',
  default: 'default-size',
  large: 'large-size'
};

const antClassMap = {
  small: 'ant-select-sm',
  default: 'default-size',
  large: 'large-size'
}

class TreeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
      value: '',
      placeholder: '请选择',
      isIntra: false,
      search: ''
    };
    this.searchRef = React.createRef();
    this.title = this.getTitle(props);
  }

  title = ''

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.source.length !== nextProps.source.length) {
      this.title = this.getTitle(nextProps);
    }
    return true;
  }

  componentDidUpdate(preProps) {
    if (this.props.source.length !== preProps.source.length) {
      this.title = this.getTitle(this.props);
    }
  }

  handleClick = () => {
    const state = {
      ...this.state,
      isFocus: false,
      search: ''
    };
    this.setState(state);
  }

  handleIntraClick = (e) => {
    if (!this.state.isFocus) {
      e.nativeEvent.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      const state = {
        ...this.state,
        isFocus: true
      };
      this.setState(state);
      if (!!this.props.showSearch) {
        this.searchRef.current.focus();
      }
    }
  }

  handleNodeClick = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
  }

  handleSelect = (e) => {
    const value = e.target.dataset.value;
    if (value) {
      const state = {
        ...this.state,
        value,
        isFocus: false
      };
      this.title = this.getTitle({...this.props, value});
      this.setState(state);
      this.props.onChange(value);
    }
  }

  handleSearchChange = (e) => {
    const state = {
      ...this.state,
      search: e.target.value
    };
    this.setState(state);
  }

  handleSearchEnter = (e) => {
    const {
      isSearching
    } = this.props;
    const {
      search
    } = this.state;

    if (e.keyCode == '13') {
      e.nativeEvent.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();

      if (isSearching) return;

      if (this.props.onSearch) {
        this.props.onSearch(search);
      }
    }
  }

  getTreeTitle = (source, nodeValue, nodeTitle, value) => {
    if (!source) return false;

    for(let i = 0;i < source.length;i++) {
      if (source[i][nodeValue] == value) {
        return source[i][nodeTitle];
      } else {
        const result = this.getTreeTitle(source[i].children, nodeValue, nodeTitle, value);
        if (result) {
          return result;
        }
      }
    }
    return false;
  }

  getTitle = ({ source, nodeValue, nodeTitle, value }) => {
    value = value || this.state.value;
    if (source && nodeValue && nodeTitle && value) {
      const title = this.getTreeTitle(source, nodeValue, nodeTitle, value);
      if (title) {
        return title;
      }
    }
    return value;
  }

  render() {
    const {
      isFocus,
      search,
    } = this.state;
    const {
      children,
      size,
      isSearching,
      showSearch
    } = this.props;
    return (
      <div
        className={`${sizeClassMap[size]} tree-select-container`}
      >
        <div
          className={`${antClassMap[size]} ant-select-enabled ant-select select ant-tree-select ${isFocus && 'ant-select-open ant-select-focused'}`}
          onClick={this.handleIntraClick}
        >
        <div
          className="ant-select-selection ant-select-selection--single tree-select-input-container"
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="true"
          aria-expanded="false"
          tabIndex="0">
          <div className="ant-select-selection__rendered">
            <div
              className="ant-select-selection-selected-value"
              title={this.title} style={{display: "block", opacity: 1}}>{this.title}</div>
              {!this.title &&(
                <div
                  unselectable="on"
                  className="ant-select-selection__placeholder"
                  style={{display: "block", userSelect: "none"}}>请选择</div>
              )}
            </div>
            <span
              className="ant-select-arrow"
              unselectable="on"
              style={{userSelect: "none"}}>
              <i className="anticon anticon-down ant-select-arrow-icon">
                <svg viewBox="64 64 896 896" className="" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
                </svg>
              </i>
            </span>
          </div>
        </div>
        <div
          className={`tree-node ${isFocus ? 'tree-node-display' : ''}`}
          onClick={this.handleNodeClick}
        >
          {!!showSearch && (
            <div className="search-container">
              <input
                type="text"
                ref={this.searchRef}
                className="tree-search"
                placeholder="请输入"
                value={search}
                onChange={this.handleSearchChange}
                onKeyDown={this.handleSearchEnter}
              />
            </div>
          )}
          <div
            className="tree-node-container"
            onClick={this.handleSelect}
          >
            <Spin spinning={!!isSearching}>
              { children }
              {(!children || !children.length || children.length === 0) && (
                <div className="placeholder">未搜索到可选项</div>
              )}
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}


export default TreeSelect;
export const TreeNode = TN;
