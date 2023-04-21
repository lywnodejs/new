import React from 'react';
import arrayTreeFilter from 'array-tree-filter';
import _ from 'lodash';
import classNames from 'classnames';
import { Checkbox, Icon } from 'antd';

import './menus.less';

class Menus extends React.Component {

  /**
   * 根据需要展开的menu的 level: value 节点映射
   * 找到需要展开 第level的 值是value的那个menu
   * 得到一个list
   */
  getExpandMenus(values) {
    const expandValue = values || this.props.expandValue;
    const { options } = this.props;
    return arrayTreeFilter(options, (o, level) => o.value === expandValue[level]);
  }

  getMenus() {
    const { options } = this.props;
    const expandMenus = this.getExpandMenus();

    // 拿到需要展开的节点的 children menu
    let moreMenus = _.map(expandMenus, ({ children }) => children);
    moreMenus = _.filter(moreMenus, menu => !_.isEmpty(menu));
    // 把第1 level的menu默认展开
    return [options, ...moreMenus];
  }

  getOption(option, menuIndex) {
    const id = option.value;
    const {
      onExpand, onSelect,
      value = {},
      expandValue = {},
      checkedCountMap,
    } = this.props;

    const checkboxProps = {
      indeterminate: false,
      checked: value[id],
      onChange: (e) => {
        const { checked } = e.target;
        onSelect(option, menuIndex, checked);
      },
      onClick: (e) => {
        // 防止点击checkbox时，也展开右侧子菜单，所以这里不冒泡
        e.stopPropagation();
      }
    };
    // 对于 有子节点&&!checked 的节点，进行是否 显示全选 的逻辑判断
    if (!_.isEmpty(option.children) && !value[id]) {
      const { childrenCount } = option;
      const checkedCount = checkedCountMap[id];
      if (checkedCount > 0 && checkedCount < childrenCount) {
        checkboxProps.indeterminate = true;
      }
    }

    // TODO 判断是否是最后一级，是则铺开展示
    return (
      <div
        key={id}
        onClick={(e) => onExpand(option, menuIndex, e)}
        className={classNames({
          'tree-selector-menu-item': true,
          // 当前level是展开，且有子节点，则active显示。使展现的menu路径更客观
          'active': expandValue[menuIndex] === id && !_.isEmpty(option.children)
        })}
      >
        <Checkbox {...checkboxProps} />
        <p className="tree-selector-menu-item-label" >
          <span>{option.label}</span>
          {!_.isEmpty(option.children) && <Icon type="right" />}
        </p>
      </div>
    );
  }

  // 判断当前menu是否是最后一级menu（所有节点均无子节点）
  isLastMenu(menu) {
    return _.every(menu, option => _.isEmpty(option.children));
  }

  render() {
    const menus = this.getMenus();
    return (
      <div className="tree-selector-menus-bodyer" >
        {_.map(menus, (menu, menuIndex) => {
          const className = classNames({
            'tree-selector-menu': true,
            'tree-selector-menu-tail': menuIndex !== 0 && this.isLastMenu(menu),
          });

          return (
            <div key={menuIndex} className={className} >
              {_.map(menu, option => this.getOption(option, menuIndex))}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Menus;
