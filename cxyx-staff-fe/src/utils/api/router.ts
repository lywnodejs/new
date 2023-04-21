export const defaultRouter = [
  { exact: true, path: '/', redirect: '/welcome' },
  { exact: true, path: '/welcome', component: '@/pages/system/welcome' },
  {
    path: '/h5/register',
    component: '@/pages/register',
    menu: {
      name: '合作方员工报名',
      icon: 'apartment',
    },
    // more features view
    // https://beta-pro.ant.design/docs/advanced-menu
    // Do not show top bar
    headerRender: false,
    // Do not show footer
    footerRender: false,
    // Do not show the menu
    menuRender: false,
    // Do not show the menu top bar
    menuHeaderRender: false,
    // Permission configuration, need to be used in conjunction with plugin-access
    access: 'canRead',
    // hide child nodes
    hideChildrenInMenu: true,
    // hide yourself and child nodes
    // The child item is raised up and still displayed,
    flatMenu: true,
    layout: {
      hideNav: true,
    },
    hideInMenu: true,
  },
  {
    path: '/h5/registerEdit',
    component: '@/pages/register/edit',
    menu: {
      name: '服务商员工报名',
      icon: 'apartment',
    },
    // more features view
    // https://beta-pro.ant.design/docs/advanced-menu
    // Do not show top bar
    headerRender: false,
    // Do not show footer
    footerRender: false,
    // Do not show the menu
    menuRender: false,
    // Do not show the menu top bar
    menuHeaderRender: false,
    // Permission configuration, need to be used in conjunction with plugin-access
    access: 'canRead',
    // hide child nodes
    hideChildrenInMenu: true,
    // hide yourself and child nodes
    // The child item is raised up and still displayed,
    flatMenu: true,
    layout: {
      hideNav: true,
    },
    hideInMenu: true,
  },
  {
    path: '/h5/success',
    component: '@/pages/success',
    menu: {
      name: '报名成功',
      icon: 'apartment',
    },
    // more features view
    // https://beta-pro.ant.design/docs/advanced-menu
    // Do not show top bar
    headerRender: false,
    // Do not show footer
    footerRender: false,
    // Do not show the menu
    menuRender: false,
    // Do not show the menu top bar
    menuHeaderRender: false,
    // Permission configuration, need to be used in conjunction with plugin-access
    access: 'canRead',
    // hide child nodes
    hideChildrenInMenu: true,
    // hide yourself and child nodes
    // The child item is raised up and still displayed,
    flatMenu: true,
    layout: {
      hideNav: true,
    },
    hideInMenu: true,
  },
  { component: '@/pages/system/not-found' },
];
