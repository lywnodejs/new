import React from 'react';
import { connect } from 'dva';
import { translate } from 'react-i18next';
import { Icon, Dropdown, Menu, Button, Avatar } from 'antd';
import { MAIN, MANAGE, BUSINESSMANAGE, PREFIX } from '@routes/config';
import { trackEvent } from '@utils/omega';
import { routerRedux } from 'dva/router';
import {
  MAIN_PAGE_VIEW_TAG,
  MAIN_PAGE_VIEW_MANAGE_ENTRANCE,
  MAIN_PAGE_VIEW_BUSINESS_MANAGE_ENTRANCE
} from '@config/omega';

import Logo from '../Logo';
import Switcher from '../../../i18n/Switcher';
import './index.less';
import introJs from '@/lib/intro.js';

const WHITE_LIST = [MAIN, BUSINESSMANAGE];
// const BLACK_LIST = [MAIN]

class Header extends React.Component {
  state = {
    systemValue: undefined,
    visible: false // 首次登录模态框
  };

  // componentDidMount() {
  //   const {dispatch, t} = this.props
  //   console.log(this.props);
  //   dispatch({
  //     type: 'userInfo/shouldDisplay'
  //   }).then((res) => {
  //     if(res){
  //       introJs().setOptions({
  //         doneLabel:'关闭',
  //         exitOnOverlayClick: false,
  //         showBullets: false,
  //         overlayOpacity: 0.6,
  //         disableInteraction: true,
  //         showStepNumbers: false,
  //         steps: [{
  //           element: '#intro',
  //           intro: t('系统管理员入口迁移到这里了~'),
  //           position: 'bottom'
  //         }],
  //         highlightClass:{
  //           opacity: 0.4
  //         }
  //       }).start(
  //         this.setState({
  //           visible: true
  //         })
  //       );
  //     }
  //     console.log('看看我是啥',res);
  //   })
  // }

  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      window.location.href = '/logout';
    }
  };

  getUsernameMenu() {
    const { t } = this.props;
    const { Item } = Menu;
    return (
      <Menu onClick={this.handleMenuClick}>
        <Item key="logout">
          <Icon type="logout" /> {t('注销')}
        </Item>
      </Menu>
    );
  }
  systemChangeHandle = value => {
    this.setState({
      systemValue: value
    });
  };

  getManual = () => {
    const { i18n, wikiHost } = this.props;

    const { language } = i18n;
    const langArr = {
      zhCN: '_cn',
      enUS: '_en'
    };
    if (location.pathname.indexOf(MAIN) > -1) {
      // if (language === 'zhCN') {
      return `${wikiHost}/pages/viewpage.action?pageId=230414626`;
      // } else {
      //   return `${PREFIX}/help/app${langArr[language]}`;
      // }
    } else if (
      location.pathname.indexOf(MANAGE) > -1 ||
      location.pathname.indexOf(BUSINESSMANAGE) > -1
    ) {
      // 暂时屏蔽掉中文操作手册
      // if (language === 'zhCN') {
      //   return '';
      // }
      // if (language === 'zhCN') {
      return `${wikiHost}/pages/viewpage.action?pageId=230416587`;
      // } else {
      //   return `${PREFIX}/help/ad${langArr[language]}`;
      // }
    } else {
      return '';
    }
  };
  // judgeIfHiddenSystemList = () => {
  //   let result = false
  //   WHITE_LIST.forEach(i => {
  //     const reg = new RegExp(`${i}`)
  //     result = result || reg.test(location.pathname)
  //   })
  //   // 如果现在白名单中，则遍历是否在黑名单
  //   // if (result) {
  //   //   BLACK_LIST.forEach(i => {
  //   //     if (location.pathname == i) {
  //   //       return result = false;
  //   //     }
  //   //   })
  //   // }

  //   return !result
  // }

  // 跳转系统管理员入口
  goManage = () => {
    trackEvent(MAIN_PAGE_VIEW_MANAGE_ENTRANCE, MAIN_PAGE_VIEW_TAG);
    this.props.dispatch(routerRedux.push(MANAGE + '/home/base'));
  };

  // 跳转业务线管理员
  goBusinessManage = () => {
    trackEvent(MAIN_PAGE_VIEW_BUSINESS_MANAGE_ENTRANCE, MAIN_PAGE_VIEW_TAG);
    this.props.dispatch(routerRedux.push(BUSINESSMANAGE));
  };

  // 跳转首页
  goHome = () => {
    // window.location.href = MAIN;
    this.props.dispatch(routerRedux.push(MAIN));
  };

  goIndex = () => {
    const { currentPage } = this.props;
    if (currentPage == 'main') {
      this.goHome();
    } else if (currentPage == 'manage') {
      this.goManage();
    } else if (currentPage == 'businessManage') {
      this.goBusinessManage();
    }
  };

  // ModalHandleClose = () => {
  //   this.setState({
  //     visible: false
  //   })
  // }

  render() {
    const {
      userInfo,
      t,
      needDefaultValue,
      needFootprint,
      isGlobalAppId,
      currentPage
    } = this.props;
    const { username, businessManager, avatarUrl } = userInfo;
    const headerNotice = '';
    // const hideSystemList = this.judgeIfHiddenSystemList()

    let backOldComp = (
      <a href="/index.html#/" target="_blank" className="back-old">
        {t('返回旧版')}
      </a>
    );
    if (window.location.hostname.includes('.didiglobal.com')) {
      backOldComp = null; // 海外版隐藏旧版入口
    }

    return (
      <header className="upm-main-layout__header">
        <Logo goIndex={this.goIndex} />
        {/* {
          hideSystemList ? '' : <SystemList
            ifHeader
            showAll
            value={this.state.systemValue}
            onChange={this.systemChangeHandle}
            needDefaultValue={needDefaultValue}
            needFootprint={needFootprint}
            isGlobalAppId={isGlobalAppId}
          />
        } */}
        {/* <Modal
          title="静默权限审计功能上线了~"
          visible={this.state.visible}
          onCancel={this.ModalHandleClose}
          footer={[
            <Button key='submit' type="primary" onClick={this.ModalHandleClose}>
              关闭
            </Button>,
          ]}
        >
          <p>根据权限管理要求，用户权限需要做到最小化。针对某些用户申请权限后，长时间不使用的问题，我们增加了静默权限审计功能。该功能将审核用户的权限，超过90天没有使用过的权限，将被回收。</p>
          <p>存量权限将在该功能上线之日（2020/03/30）凌晨1：00进行集中回收。后续将以天为单位，持续对静默权限进行审计与回收。</p>
          <p>权限回收记录可在【变更日志】功能，进行查看。如有其它疑问，可联系“信息安全小助手”进行咨询。</p>
        </Modal> */}
        <div className="header-nav">
          <div className="haeder-letf">
            {backOldComp}

            <div id="intro" className="header-entrance">
              {currentPage == 'main' ? (
                businessManager ? (
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key="manage" onClick={this.goManage}>
                          {t('系统管理员入口')}
                        </Menu.Item>
                        <Menu.Item
                          key="businessManage"
                          onClick={this.goBusinessManage}>
                          {t('业务线管理员入口')}
                        </Menu.Item>
                      </Menu>
                    }>
                    <Button
                      shape="round"
                      size="small"
                      type="primary"
                      className="entrance-button">
                      {t('管理员入口')}
                      <Icon type="down" />
                    </Button>
                  </Dropdown>
                ) : (
                  <Button
                    shape="round"
                    size="small"
                    type="primary"
                    className="entrance-button"
                    onClick={this.goManage}>
                    {t('管理员入口')}
                  </Button>
                )
              ) : (
                <Button
                  shape="round"
                  size="small"
                  type="primary"
                  className="entrance-button"
                  onClick={this.goHome}>
                  {t('普通用户入口')}
                </Button>
              )}
            </div>
          </div>

          <p className="header-notice">{headerNotice}</p>
          <div className="header-option-wrapper">
            <div style={{ marginRight: 8 }}>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <a
                        href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=230416587"
                        target="_blank">
                        {t('管理员使用手册')}
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=352923140"
                        target="_blank">
                        {t('管理员必知必会')}
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=120872104"
                        target="_blank">
                        {t('UPM接口文档')}
                      </a>
                    </Menu.Item>
                  </Menu>
                }>
                <span className="option" id="intro-entrance-11">
                  {t('UPM文档中心')} <Icon type="down" />
                </span>
              </Dropdown>
            </div>

            {/* {this.getManual()?<a
              href={this.getManual()}
              target="_blank"
              style={{marginRight: 8}}
            >{t('UPM操作手册')}</a>:''} */}

            <Dropdown
              overlay={
                <Menu>
                  {/* <Menu.Item><a href="https://im.xiaojukeji.com/contact?name=infosec-ssc_p" target="_blank">{t('信息安全小助手I')}</a></Menu.Item> */}
                  <Menu.Item>
                    <a
                      href="https://im.xiaojukeji.com/contact?name=infosec-ssc2_public_p"
                      target="_blank">
                      {t('信息安全小助手II')}
                    </a>
                  </Menu.Item>
                  <Menu.Item>
                    <a
                      href="https://im.xiaojukeji.com/contact?name=infosec-ssc3_public_p"
                      target="_blank">
                      {t('信息安全小助手III')}
                    </a>
                  </Menu.Item>
                </Menu>
              }>
              <span className="option" id="intro-entrance-12">
                {t('找我咨询问题')} <Icon type="down" />
              </span>
            </Dropdown>
            {/* <a href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=2s9-su4p8rqje" className="open-dingding">{t('找我咨询问题')}<Icon type="dingding-o" style={{marginLeft: 3}} /></a> */}
            <div className="i18n-switcher">
              <Switcher />
            </div>
            <div className="user-info">
              <Dropdown overlay={this.getUsernameMenu()}>
                <span className="option">
                  {username} <Icon type="down" />
                  <Avatar
                    className="avatar"
                    size="small"
                    icon="user"
                    src={avatarUrl}
                  />
                </span>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default translate()(
  connect(({ userInfo, global }) => {
    return {
      userInfo,
      global,
      wikiHost: global.wikiHost
    };
  })(Header)
);
