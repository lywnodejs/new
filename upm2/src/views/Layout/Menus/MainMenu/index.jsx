import React from 'react';
import connect from '@utils/translateConnect';
import { routerRedux } from 'dva/router';
import { Menu, Icon, Badge } from 'antd';
import pathToRegexp from 'path-to-regexp';

// import IconFont from '../../../../components/IconFont';
import SearchSysAdmin from '@components/SearchSysAdmin';

import './style.less';

const SubMenu = Menu.SubMenu;

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // currKey: '',
      openKeys: [],
      selectKeys: []
    };
    this.lastOpenKeys = [];
  }

  componentDidMount() {
    // console.log(this.props.userInfo.introEntranceShow);
    const { dispatch } = this.props;
    // 获取“我的团队权限”子菜单数据
    dispatch({
      type: 'review/fetchSubordinate'
    });
  }

  componentWillReceiveProps(nextProps) {
    // 根据首页(entrance)-引导页展示状态，进行菜单调整，打开或收起“小工具”菜单
    if (
      nextProps.userInfo.introEntranceShow !=
      this.props.userInfo.introEntranceShow
    ) {
      if (nextProps.userInfo.introEntranceShow) {
        this.setState({
          openKeys: ['tools']
        });
      } else {
        this.setState({
          openKeys: []
        });
      }
    }
    const { routing, prefix } = nextProps;
    const { pathname } = routing.location;

    if (pathname.indexOf(prefix) != -1) {
      // TODO: 可改成JSON配置菜单，通过判断是否有children来确定是否是singleLevelMenuItem
      // 仅包含一级的菜单key数组
      const singleLevelMenuItems = [
        'apply',
        'approve',
        'permission_confirm',
        'changelog'
      ];
      // path情况：
      // 1、''
      // 2、'/a[/b/c/d...]'，
      const path = pathname.split(prefix)[1];
      const pathSections = path.split('/');
      if (pathSections.length === 1) {
        // 情况1，选中“首页”
        this.setState({
          selectKeys: ['/']
        });
      } else {
        // 情况2
        // a为newaaply或packageapply时，为首页进入特定页，需选中“/”；
        // a是一级菜单时，选中该一级菜单；a不是一级菜单时，展开a，选中下一级信息
        const firstLevelPath = pathSections[1];
        const secondLevelPath = pathSections[2];
        if (
          firstLevelPath === 'newapply' ||
          firstLevelPath === 'packageapply'
        ) {
          this.setState({
            selectKeys: ['/']
          });
        } else if (singleLevelMenuItems.includes(firstLevelPath)) {
          this.setState({
            selectKeys: [firstLevelPath]
          });
        } else {
          this.setState({
            openKeys: [firstLevelPath],
            selectKeys: secondLevelPath
              ? [`${firstLevelPath}/${secondLevelPath}`]
              : []
          });
        }
      }
    } else {
      this.setState({
        selectKeys: []
      });
    }

    // if (pathname === prefix) {
    //   return this.setState({
    //     selectKeys: ['/']
    //   });
    // }

    // const ptr = pathToRegexp(`${prefix}/:subMenuKey`).exec(pathname);

    // if (ptr) {
    //   const path = ptr[1];
    //   console.log(path.split('-'));
    //   const pathSections = path.split('-');
    //   if (pathSections.length === 1) {
    //     this.setState({
    //       selectKeys: [pathSections[0]]
    //     });
    //   } else {
    //     this.setState({
    //       openKeys: [pathSections[0]],
    //       selectKeys: [`${pathSections[0]}-${pathSections[1]}`]
    //     });
    //   }
    //   // if (path.indexOf('-') != -1) {
    //   //   // 设置打开二级菜单
    //   //   this.setState({
    //   //     openKeys: [path.split('-')[0]]
    //   //   });
    //   // }

    //   // if (path == 'newapply' || path == 'packageapply') {
    //   //   this.setState({
    //   //     selectKeys: ['/']
    //   //   });
    //   // } else {
    //   //   this.setState({
    //   //     selectKeys: [path]
    //   //   });
    //   // }
    // } else {
    //   this.setState({
    //     selectKeys: []
    //   });
    // }
  }

  onMenuItemClick = ({ key }) => {
    if (key === 'sys-admin') {
      return;
    }
    // this.setState({
    //   currKey: key
    // });
    const { prefix, dispatch } = this.props;
    // 首页的 / 走父路径
    const path = key === '/' ? prefix : `${prefix}/${key}`;
    dispatch(routerRedux.push(path));
  };

  onOpenChange = openKeys => {
    this.setState({
      openKeys
    });
  };

  handleCollapseMenu = ({ item, key, keyPath, domEvent }) => {
    const { dispatch, collapsed } = this.props;
    if (collapsed) {
      //打开
      this.setState({
        openKeys: this.lastOpenKeys
      });
    } else {
      //收起
      this.lastOpenKeys = this.state.openKeys;
      this.setState({
        openKeys: []
      });
    }
    // this.setState({
    //   openKeys: []
    // });
    dispatch({
      type: 'global/save',
      payload: {
        collapsed: !collapsed
      }
    });
  };

  render() {
    const { t, subordinate, userInfo, collapsed, approveingCount } = this.props;
    const { openKeys, selectKeys } = this.state;
    return (
      <div
        className="upm-main-layout__container__side"
        style={{ width: collapsed ? '64px' : '200px' }}>
        <div className="upm-menu upm-main-menu">
          <Menu
            className="custom-menu"
            mode="inline"
            theme="dark"
            selectedKeys={selectKeys}
            openKeys={openKeys}
            onOpenChange={this.onOpenChange}
            onClick={this.onMenuItemClick}
            inlineCollapsed={collapsed}>
            <Menu.Item key="/">
              <Icon type="home" />
              <span>{t('系统首页')}</span>
            </Menu.Item>
            <Menu.Item key="apply" id="intro-entrance-5">
              {/* <IconFont type="icon-hand" /> */}
              <Icon type="unordered-list" />
              <span>{t('我的申请')}</span>
            </Menu.Item>
            <Menu.Item key="approve" id="intro-entrance-6">
              {/* <IconFont type="icon-shenhe" /> */}
              <Icon type="audit" />
              <span>
                {t('我的审批')}
                {collapsed ? null : (
                  <Badge count={approveingCount} className="badge-count" />
                )}
              </span>
            </Menu.Item>
            {/* <Menu.Item key="permission" ><IconFont type="icon-quanxianguanli" />{t('我的权限')}</Menu.Item> */}
            <SubMenu
              key="permission"
              id="intro-entrance-7"
              title={
                <span>
                  {/* <IconFont type="icon-quanxianguanli" /> */}
                  <Icon type="user" />
                  <span>{t('我的权限')}</span>
                </span>
              }>
              <Menu.Item key="permission/valid">{t('使用中权限')}</Menu.Item>
              <Menu.Item key="permission/expiring">{t('将过期权限')}</Menu.Item>
              <Menu.Item key="permission/expired">{t('已过期权限')}</Menu.Item>
            </SubMenu>
            {subordinate.length ? (
              <SubMenu
                key="member"
                title={
                  <span>
                    {/* <IconFont type="icon-quanxianguanli" style={{ fontSize: '16px' }} /> */}
                    <Icon type="team" />
                    <span>{t('我的团队权限')}</span>
                  </span>
                }>
                {subordinate.map(item => (
                  <Menu.Item
                    key={`member/${item.username}`}
                    // className={
                    //   `member/${item.username}` === currKey
                    //     ? 'ant-menu-item-selected'
                    //     : null
                    // }
                  >
                    {item.usernameZh}
                  </Menu.Item>
                ))}
              </SubMenu>
            ) : null}
            {/* <Menu.Item key="approve-my" ><IconFont type="icon-quanxianguanli" />{t('权限最小化审核')}</Menu.Item>
            <Menu.Item key="review" ><IconFont type="icon-shenhe" />{t('我的review列表')}</Menu.Item>
            <Menu.Item key={'permission_confirm'} ><IconFont type="icon-shenhe" />{t('转岗人员权限审核')}</Menu.Item> */}
            <SubMenu
              key="mini_approve"
              title={
                <span>
                  {/* <IconFont type="icon-quanxianguanli" /> */}
                  <Icon type="file-sync" />
                  <span>{t('权限最小化审核')}</span>
                </span>
              }>
              <Menu.Item key="mini_approve/approve_my">
                {t('审核人审核')}
              </Menu.Item>
              <Menu.Item key="mini_approve/review">{t('上级审核')}</Menu.Item>
            </SubMenu>
            <Menu.Item key="permission_confirm">
              {/* <IconFont type="icon-shenhe" /> */}
              <Icon type="solution" />
              <span>{t('转岗人员权限审核')}</span>
            </Menu.Item>
            <Menu.Item key="changelog" id="intro-entrance-8">
              <Icon type="copy" />
              <span>{t('变更日志')}</span>
            </Menu.Item>
            <SubMenu
              key="tools"
              title={
                <span>
                  <Icon type="tool" style={{ fontSize: '16px' }} />
                  <span>{t('小工具')}</span>
                </span>
              }>
              <Menu.Item key="tools/role" id="intro-entrance-9">
                {t('角色定位工具')}
              </Menu.Item>
              <Menu.Item key="sys-admin" id="intro-entrance-10">
                <SearchSysAdmin placement="right" />
              </Menu.Item>
            </SubMenu>
          </Menu>
        </div>
        <div className="upm-main-collapse">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[]}
            openKeys={[]}
            onClick={this.handleCollapseMenu}>
            <Menu.Item>
              <Icon
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                style={{ marginRight: '0' }}
              />
            </Menu.Item>
          </Menu>
        </div>
      </div>
    );
  }
}

export default connect(({ routing, userInfo, review, global, approveList }) => {
  return {
    routing,
    userInfo: userInfo,
    subordinate: review.subordinate,
    collapsed: global.collapsed,
    approveingCount: approveList.list2.approveingCount
  };
})(MainMenu);
