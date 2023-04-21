export default [
  { exact: true, path: '/', redirect: '/welcome' },
  { exact: true, path: '/welcome', component: '@/pages/system/guide' },
  {
    path: '/person',
    menu: {
      name: '集团人员管理',
      icon: 'user',
    },
    routes: [
      {
        path: '/person/formal',
        component: '@/pages/person/formal',
        menu: {
          name: '正式/实习生账号',
        },
      },
      {
        path: '/person/epiboly',
        component: '@/pages/person/epiboly',
        menu: {
          name: '外包账号',
        },
      },
      {
        path: '/person/internals',
        component: '@/pages/person/internals',
        menu: {
          name: '内部组织架构',
        },
      },
    ],
  },
  {
    path: '/partner',
    component: '@/pages/partner',
    menu: {
      name: '合作方管理',
      icon: 'trademark',
    },
    routes: [
      {
        path: '/partner/manage',
        component: '@/pages/partner/manage',
        menu: {
          name: '合作方信息管理',
        },
      },
      {
        path: '/partner/organization',
        component: '@/pages/partner/organization',
        menu: {
          name: '合作方组织架构',
        },
      },
      {
        path: '/partner/account',
        component: '@/pages/partner/account',
        menu: {
          name: '合作方账号管理',
        },
      },
    ],
  },
  {
    path: '/permission',
    component: '@/pages/permission',
    menu: {
      name: '岗位权限管理',
      icon: 'CodeSandbox',
    },
    routes: [
      {
        path: '/permission/interior',
        component: '@/pages/permission/interior',
        menu: {
          name: '集团职责管理',
        },
      },
      {
        path: '/permission/external',
        component: '@/pages/permission/external',
        menu: {
          name: '合作方集团职责管理',
        },
      },
    ],
  },
  {
    path: '/manage',
    component: '@/pages/manage',
    menu: {
      name: '系统管理',
      icon: 'apartment',
    },
    routes: [
      {
        path: '/manage/log',
        component: '@/pages/manage/log',
        menu: {
          name: '日志管理',
        },
      },
      {
        path: '/manage/empower',
        component: '@/pages/manage/empower',
        menu: {
          name: '赋权策略配置',
        },
      }
    ],
  },
  {
    path: '/h5/register',
    component: '@/pages/register',
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
