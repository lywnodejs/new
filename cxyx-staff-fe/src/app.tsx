import React from 'react';
import {
  BasicLayoutProps,
  Settings as LayoutSettings,
} from '@ant-design/pro-layout';
import { ConfigProvider, Popover } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import Header from '@/pages/system/layout/Header';
import { getUserName } from '@/utils/auth';
import { sendOmegaRouteLog } from '@/utils/omega';
import { getRouterConfig } from '@/utils/api/common';
import { defaultRouter } from '@/utils/api/router';
import * as allIcons from '@ant-design/icons';
import { QrcodeOutlined } from '@ant-design/icons';
import { history } from 'umi';
import GuideText from '@/pages/system/guide/GuideText';
import ReactGPToolContainer from '@didi/gptool-core-react';

let menus = [
  '/',
  '/welcome',
  '/h5/register',
  '/h5/success',
  '/not-found',
  '/h5/registerEdit',
]; // 菜单权限
let RouterConfig = null;
const HelpText = [
  {
    url:
      'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=514986439',
    text: '孙权系统-产品使用手册（物理上级版）',
  },
  {
    url:
      'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=514986490',
    text: '孙权系统-产品使用手册（合作方管理版）',
  },
  {
    url:
      'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=514985865',
    text: '孙权系统-产品使用手册（完整版）',
  },
];
const setHelpText = () => {
  let pathname = history?.location.pathname;
  let htmlData = null;
  switch (pathname) {
    case '/person/formal':
    case '/person/epiboly':
    case '/person/internals':
      htmlData = HelpText[0];
      break;
    case '/partner/manage':
    case '/partner/organization':
    case '/partner/account':
      htmlData = HelpText[1];
      break;
    default:
      htmlData = HelpText[2];
  }

  return (
    <div className="ding-qrcode">
      <a
        target="blank"
        href={htmlData.url}
      >{`更多操作指引请看：${htmlData.text}`}</a>
    </div>
  );
};

function getWaterMark() {
  const element = document.createElement('script');
  element.src = '//sec-aegisfe.didistatic.com/static/aegisfe/water-mark1.0.js';
  document.body.appendChild(element);
  element.onload = e => {
    (window as any).waterMark({
      //系统ID，接入UPM里面的系统ID,就是appId
      systemId: '2100168',
      //SSO里面的账号
      userId: getUserName() || 'cxyx_staff_sys',
      textStyle: 'rgba(0,0,0,0.06)',
    });
  };
}

export function onRouteChange({ location }) {
  if (!menus.includes(location.pathname) && RouterConfig !== null) {
    history.push('/not-found');
    return false;
  }

  // console.log('onRouteChange', location.pathname, location, getUrlQueryParams(location.href));
  // !getUserName() && loginSSO();
  sendOmegaRouteLog(location.pathname, { params: location.query });
}

export function rootContainer(container) {
  return React.createElement(
    ConfigProvider,
    null,
    <ConfigProvider locale={zhCN}>{container}</ConfigProvider>,
  );
}

export async function getInitialState() {
  getWaterMark();
  // 获取路由配置
  // let { data } = await getRouterConfig();
  let data = [];
  await getRouterConfig().then(res => {
    if (res && res.errno === 0) {
      if (Array.isArray(res.data)) {
        data = res.data || [];
      }
    }
  });

  // let data = [];
  RouterConfig = data; //全局保存

  const dataMap = route => {
    route.sort((a, b) => {
      if (a.sortVal === b.sortVal) {
        return b.sortVal - a.sortVal;
      } else {
        return a.sortVal - b.sortVal;
      }
    });
    route.map(item => {
      item.path = item.url;
      menus.push(item.path);
      if (item.icon !== '') {
        item.icon = React.createElement(allIcons[item.icon]);
      }
      if (item.children && item.children.length !== 0) {
        dataMap(item.children);
      }
    });
  };
  dataMap(data);
  let router = [...defaultRouter, ...data];

  return {
    menuData: router,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: {
    settings?: LayoutSettings;
    currentUser?;
    menuData: [];
  };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <Header />,
    footerRender: () => {
      if (window.location.hash.indexOf('h5') > -1) {
        return null;
      }
      return (
        <>
          <Popover
            className="home-relation"
            placement="leftBottom"
            trigger="hover"
            content={() => {
              return (
                <div className="ding-qrcode">
                  <h4>用户咨询群</h4>
                  <img src={require('./assets/img/relotion.png')} />
                </div>
              );
            }}
          >
            <QrcodeOutlined />
          </Popover>
          <Popover
            className="home-relation__help"
            placement="leftBottom"
            arrowPointAtCenter
            trigger="hover"
            content={
              <>
                <GuideText style={{ width: 500, paddingBottom: 10 }} />
                {setHelpText()}
              </>
            }
          >
            <p className="home-relation__help__text">使用手册</p>
          </Popover>
          <ReactGPToolContainer
            componentKey="4b24e027a4c6eb7e475b1b22fd03df6e" // 工具市场申请得到，在回声系统内可以看到
            componentName="回声"
            env="prd"
            feedbackStyle="none"
          />

          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            © 橙心优选
          </div>
        </>
      );
    },
    menuDataRender: () => {
      return initialState?.menuData;
    },
    menuHeaderRender: () => (
      <>
        <img
          className={'project-title__icon__chengxing'}
          src="https://s3-gz01.didistatic.com/default/marketing-fe/static/media/logo_full.521d5fc3.521d5fc3.png"
        />
        <img
          className={'project-title__icon__sunquan'}
          src={require('./assets/img/icon.png')}
          alt="孙权管理"
        />
      </>
    ),
    ...initialState?.settings,
  };
};
