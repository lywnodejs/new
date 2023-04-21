import React, { Component } from 'react';

import './index.less';

import Icon from './a.png';

class TreeNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpand: false,
      childrenNodes: []
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.isExpand !== nextState.isExpand;
  }

  componentDidMount () {
    const {
      expand
    } = this.props;
    if (expand) {
      this.handleIconClick();
    }
  }

  handleIconClick = () => {
    let { childrenNodes } = this.state;
    if (!childrenNodes || !childrenNodes.length || childrenNodes.length < 0) {
      childrenNodes = this.getChildren();
    }
    const state = {
      ...this.state,
      isExpand: !this.state.isExpand,
      childrenNodes
    };
    this.setState(state);
  }

  handleClick = (e) => {
    const value = e.target.dataset.value;
    if (!value) {
      e.nativeEvent.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    }
  }

  getChildren = () => {
    const { source, children = 'children', value = 'value', title = 'title' } = this.props;
    let childrenNodes = [];
    if (source && source[children] && source[children].length && source[children].length > 0) {
      childrenNodes = source[children].map((item, index) => {
        return (
          <TreeNode
            key={index}
            value={value}
            title={title}
            children={children}
            source={item}
          />
        );
      });
    }
    return childrenNodes;
  }

  render() {
    const {
      title,
      value,
      source,
      children
    } = this.props;
    const {
      isExpand,
      childrenNodes
    } = this.state;
    return (
      <div
        className="tree-node-container"
        onClick={this.handleClick}
      >
        <div className={`tree-node-current ${(source[children] && source[children].length > 0) ? '' : 'tree-node-nochildren'}`}>
          <span className="tree-node-icon" onClick={this.handleIconClick}>
            <img className={`tree-node-icon-img ${isExpand && 'tree-node-icon-img-expand'}`} src={Icon} alt="" />
          </span>
          <div className="tree-node-content" data-value={source[value]}>
            {source[title]}
          </div>
        </div>
        <div className="tree-node-children" style={{display: isExpand ? '' : 'none'}}>
          {childrenNodes}
        </div>
      </div>
    );
  }
}

export default TreeNode;
