// import React, { useState, useEffect } from 'react';
// import { Layout, Menu, Spin } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';
// import { renderRoutes, matchRoutes } from 'react-router-config';
// import routesConfig from '@utils/route/config';
// import { useHistory, Link, HashRouter, Switch } from 'react-router-dom';
// import User from '@components/User';
// import CityTree from '@components/City/CityTree';
// import { setLayoutCity } from '@reducer/actions/layout';
// import { getAuthFlagsAsync } from '@reducer/actions/authFlags';
// import _ from 'lodash';
// import routes from '@utils/route/config';
// import './index.scss';
// import { sendOmegaRouteLog } from '@utils/omega';
// import { HostSelect } from './host';
// import { env } from '@utils/api/path';
//
// const { SubMenu } = Menu;
// const { Header, Content } = Layout;
//
// const LayoutHeader = props => {
//   const dispatch = useDispatch();
//   const { cityId } = useSelector(state => state.layout);
//   const cityTree = _.get(props, 'cityTree', {});
//   cityTree['path'] = _.get(props, 'path', {}); // 为了切换路由时重新赋值
//
//   const onCityChange = cityId => {
//     dispatch(setLayoutCity(cityId));
//     localStorage.setItem('cityId', cityId);
//   };
//
//   cityTree.defaultValue =
//     _.toInteger(localStorage.getItem('cityId')) || cityTree.defaultValue || 17;
//   useEffect(() => {
//     if (cityId !== cityTree.defaultValue) {
//       dispatch(setLayoutCity(cityTree.defaultValue));
//       localStorage.setItem('cityId', cityTree.defaultValue);
//     }
//   }, []);
//
//   // 生产环境 调出host切换
//   const hostConfigHandle = () => {
//     // 生产环境 才进行host切换
//     if (!(env.isPre || env.isOnline)) {
//       let currentStatus = sessionStorage.getItem('hostShow');
//       if (currentStatus === 'true') {
//         currentStatus = 'false';
//       } else {
//         currentStatus = 'true';
//       }
//       sessionStorage.setItem('hostShow', currentStatus);
//       window.location.reload();
//     }
//   };
//
//   return (
//     <Header className={style.header}>
//       <div className={style.logoContent}>
//         <div className={style.logo} onDoubleClick={hostConfigHandle}></div>
//         <div className={style.headerText}>商城运营</div>
//       </div>
//       <div className={style.notice}>
//         <span className="notice-content">
//           通过对本页数据进行截图拍照或其他方式外发等方式泄露公司保密信息的行为，违反《滴滴诚信合规行为守则》，触犯公司《高压线政策》，若以此谋利还涉嫌违法，会被予以解除或移送司法机关。&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过对本页数据进行截图拍照或其他方式外发等方式泄露公司保密信息的行为，违反《滴滴诚信合规行为守则》，触犯公司《高压线政策》，若以此谋利还涉嫌违法，会被予以解除或移送司法机关。
//         </span>
//       </div>
//       <div className={style.user}>
//         {_.get(cityTree, 'visible', false) && (
//           <CityTree
//             {..._.omit(cityTree, ['visible'])}
//             onChange={onCityChange}
//             style={{ marginRight: '10px' }}
//           />
//         )}
//         <User />
//       </div>
//     </Header>
//   );
// };
//
// interface IPropsLayoutMenu {}
// const LayoutMenu: React.FC<IPropsLayoutMenu> = () => {
//   const history = useHistory();
//
//   const getDefaultOpenKeys = pathname => {
//     const data: Array<string> = [];
//     function findChildPath(routes) {
//       routes.map((item: any) => {
//         if (pathname.indexOf(item.path) !== -1) {
//           data.push(item.path);
//         }
//         if (item.routes) {
//           findChildPath(item.routes);
//         }
//       });
//     }
//     findChildPath(routesConfig);
//     return data;
//   };
//
//   const generateKeyByUrl = pathname => {
//     let selectKey;
//     function findSelectKey(routes) {
//       routes.map((item: any) => {
//         if (item.path === pathname) {
//           selectKey = item.selectKey || item.path;
//         } else if (item.routes) {
//           findSelectKey(item.routes);
//         }
//       });
//     }
//     findSelectKey(routesConfig);
//     return selectKey;
//   };
//
//   const renderMenu = (renderRoutes, level = 0) => {
//     return renderRoutes.map(item => {
//       if (!item.hidden) {
//         if (item.routes) {
//           return (
//             <SubMenu
//               icon={item.icon}
//               key={item.path}
//               title={item.name}
//               style={{ marginLeft: level * 7 }}
//             >
//               {renderMenu(item.routes, level + 1)}
//             </SubMenu>
//           );
//         } else {
//           return (
//             <Menu.Item
//               icon={item.icon}
//               key={item.selectKeys || item.path}
//               style={{ marginLeft: level * 7 }}
//             >
//               <Link to={item.path}>{item.name}</Link>
//             </Menu.Item>
//           );
//         }
//       }
//     });
//   };
//   const [collapsed, setCollapsed] = useState(false);
//   const [openKeys, setOpenKeys] = useState(
//     getDefaultOpenKeys(history.location.pathname),
//   );
//
//   const handelClickMenu = event => {
//     setOpenKeys(event.keys);
//   };
//
//   return (
//     <Layout.Sider
//       className={style.sider}
//       width={200}
//       collapsible
//       collapsed={collapsed}
//       onCollapse={() => setCollapsed(!collapsed)}
//     >
//       <Menu
//         className={style.menu}
//         theme="dark"
//         mode="inline"
//         defaultSelectedKeys={[generateKeyByUrl(history.location.pathname)]}
//         defaultOpenKeys={openKeys}
//         onClick={handelClickMenu}
//       >
//         {renderMenu(routesConfig)}
//       </Menu>
//     </Layout.Sider>
//   );
// };
//
// const IndexLayout: React.FC = () => {
//   const dispatch = useDispatch();
//   // 通过hashchange，找到当前路由currentRoute
//   const [currentRoute, setCurrentRoute] = useState({});
//   const hashChangeHandler = () => {
//     // URL中的 search 值需要移除后再做路由匹配
//     const branch = matchRoutes(
//       routes,
//       location.hash.replace('#', '').replace(/(\?.+)/, ''),
//     );
//     const matchedRoute = branch[branch.length - 1];
//     setCurrentRoute(matchedRoute.route);
//     sendOmegaRouteLog(location.hash.replace('#', ''), {});
//   };
//
//   useEffect(() => {
//     window.addEventListener('hashchange', hashChangeHandler);
//     hashChangeHandler();
//     // 获取权限标识位
//     dispatch(getAuthFlagsAsync());
//     return () => {
//       window.removeEventListener('hashchange', hashChangeHandler);
//     };
//   }, []);
//
//   const currentStatus = sessionStorage.getItem('hostShow');
//   if (location.pathname.indexOf('/register') !== -1) {
//     return <div>{renderRoutes(routes)}</div>;
//   }
//   return (
//     <div className={style.layoutBox}>
//       {currentStatus === 'true' && <HostSelect />}
//       <LayoutHeader {..._.pick(currentRoute, ['cityTree', 'path'])} />
//       <div className={style.layoutContent}>
//         <LayoutMenu />
//         <Content>
//           <HashRouter>
//             <Switch>
//               <React.Suspense
//                 fallback={
//                   <div style={{ textAlign: 'center' }}>
//                     <Spin />
//                   </div>
//                 }
//               >
//                 {renderRoutes(routes)}
//               </React.Suspense>
//             </Switch>
//           </HashRouter>
//           <div className={style.footer}>© 橙心优选</div>
//         </Content>
//       </div>
//     </div>
//   );
// };
//
// export default IndexLayout;
