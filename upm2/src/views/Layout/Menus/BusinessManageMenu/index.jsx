import React from 'react';
import connect from '@utils/translateConnect';
import { routerRedux } from 'dva/router';
import { Menu, Icon } from 'antd';
import pathToRegexp from 'path-to-regexp';

import IconFont from '../../../../components/IconFont';

class MainMenu extends React.Component {
  onMenuItemClick = ({ key }) => {
    const { prefix, dispatch } = this.props;
    // 首页的 / 走父路径
    const path = key === '/' ? prefix : `${prefix}/${key}`;
    dispatch(routerRedux.push(path));
  };

  getSelectedKeys() {
    const { routing, prefix } = this.props;
    const { pathname } = routing.location;
    if (pathname === prefix) {
      return ['/'];
    }

    const ptr = pathToRegexp(`${prefix}/:subMenuKey`).exec(pathname);
    return ptr ? [ptr[1]] : [];
  }

  render() {
    const { t } = this.props;

    return (
      <div className="upm-main-layout__container__side upm-manage-layout__container__side upm-menu">
        <Menu
          className="custom-menu"
          mode="inline"
          theme="dark"
          selectedKeys={this.getSelectedKeys()}
          onClick={this.onMenuItemClick}>
          {/* <Menu.Item key="/" ><Icon type="home" />{t('系统首页')}</Menu.Item> */}
          <Menu.Item key="role">
            <IconFont type="icon-hand" />
            {t('角色管理')}
          </Menu.Item>
          <Menu.Item key="user">
            <IconFont type="icon-shenhe" />
            {t('用户管理')}
          </Menu.Item>
          <Menu.Item key="permission">
            <IconFont type="icon-quanxianguanli" />
            {t('权限管理')}
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default connect(({ routing }) => {
  return {
    routing
  };
})(MainMenu);
