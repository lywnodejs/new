import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { Menu, Icon, Divider, Spin } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';

import { dfs } from '../../../../utils/treeUtil';

const SubMenu = Menu.SubMenu;

import './index.less';

class Menus extends Component {
  constructor(props) {
    super(props);

    // id -> menu
    this.menuIdMap = {};
    // key -> menu
    this.menuUrlMap = {};

    this.state = {
      selectedKeys: '',
      openKeys: []
    };
  }

  // 默认打开菜单
  handleMenuClick = ({ key }) => {
    // console.log(key);
    const { prefix, changeRoute } = this.props;
    const target = prefix === key ? prefix : `${prefix}${key}`;

    changeRoute(target);
  };

  handleMenuOpen = openKeys => {
    this.setState({
      openKeys
    });
  };

  // 初始化 menu 的map，方便查找
  mapMenu = menus => {
    dfs(menus, menu => {
      this.menuIdMap[menu.id] = menu;
      this.menuUrlMap[menu.url] = menu;
    });
  };

  /**
   * 获取展开节点
   */
  getOpenKeys = url => {
    const openKeys = [];
    const menu = this.menuUrlMap[url];

    if (!menu) return openKeys;

    let parent = this.menuIdMap[menu.pid];
    while (parent) {
      // Menu组件需要的key是string
      openKeys.push(`${parent.id}`);
      parent = this.menuIdMap[parent.pid];
    }

    return _.reverse(openKeys);
  };

  // 获取 selectedKeys 和 openKeys
  getMenuKeys(props) {
    const { routing, prefix } = props;
    const { pathname } = routing.location;

    const selectedKeys =
      pathname === prefix ? prefix : pathname.split(prefix)[1];
    const openKeys = this.getOpenKeys(selectedKeys);

    this.setState({
      selectedKeys,
      openKeys: _.uniq([...this.state.openKeys, ...openKeys])
    });
  }

  /**
   * 首次挂载
   */
  componentWillMount() {
    const { menus } = this.props;

    // 设置映射关系
    this.mapMenu(menus);

    this.getMenuKeys(this.props);
  }

  /**
   * 更新发生时
   * @param {*} nextProps
   */
  componentWillReceiveProps(nextProps) {
    const { menus } = nextProps;

    // 更新映射关系
    this.props.menus != menus && this.mapMenu(menus);

    this.getMenuKeys(nextProps);
  }

  isNewMenu = isNew => {
    const redColor = {
      color: '#ff7d4c',
      position: 'absolute',
      fontSize: '25px',
      // top: '0px',
      right: '-24px',
      top: '-20px'
    };

    if (isNew == 'true') {
      return <i className="iconfont iconlablenew" style={redColor}></i>;
    }
  };

  render() {
    const { menus, loading } = this.props;
    const { selectedKeys, openKeys } = this.state;
    return (
      <Spin
        spinning={!!loading.fetchMyMenus}
        wrapperClassName="upm-main-layout__container__side upm-manage-layout__container__side upm-menu upm-manage-menu"
        tip="Loading...">
        <Menu
          className="custom-menu"
          mode="inline"
          theme="dark"
          openKeys={openKeys}
          selectedKeys={[selectedKeys]}
          onClick={this.handleMenuClick}
          onOpenChange={this.handleMenuOpen}>
          {/* <Menu.Item key={'/'}>
            <Icon type={null} />
            <span>
              UPM管理指标
            </span>
          </Menu.Item> */}
          {menus.map(menu => {
            const childs = menu.children;
            if (childs) {
              return (
                <SubMenu
                  key={menu.id}
                  title={
                    <span>
                      {menu.icon && <Icon type={menu.icon} />}
                      <span>{menu.name}</span>
                    </span>
                  }>
                  {childs.map(child => (
                    <Menu.Item key={child.url}>
                      {child.icon && <Icon type={child.icon} />}
                      <span style={{ position: 'relative' }}>
                        {child.name}
                        {this.isNewMenu(child.isNew)}
                      </span>
                    </Menu.Item>
                  ))}
                </SubMenu>
              );
            }

            return (
              <Menu.Item key={menu.url}>
                {menu.icon && <Icon type={menu.icon} />}
                <span>{menu.name}</span>
              </Menu.Item>
            );
          })}
        </Menu>

        <Divider className="base-line">底线</Divider>
      </Spin>
    );
  }
}

export default connect(
  ({ routing, loading }) => {
    return {
      routing,
      loading: loading.menus || {}
    };
  },
  dispatch => ({
    changeRoute(route) {
      dispatch(
        routerRedux.push({
          pathname: route
        })
      );
    }
  })
)(Menus);
