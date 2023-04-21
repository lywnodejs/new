import React, {useContext, Fragment} from 'react'
import {Icon as LegacyIcon} from '@ant-design/compatible'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {Layout, Menu, Breadcrumb, Dropdown} from 'antd'
import {Context} from '~/pages/_app'
import styles from './Sider.less'
import {keepAliveDropCache} from 'react-next-keep-alive'

const {SubMenu} = Menu
const {Header, Content} = Layout

const SubMenus = (menu) => {
  if (Array.isArray(menu.children) && menu.children.length === 0) {
    return (
      <Menu.Item key={menu.pageKey} className="first-menu">
        <Fragment>
          {/* menu.icon && <LegacyIcon type={menu.icon} /> */}
          <Link href={menu.path || ''}>
            <a
              onClick={() => {
                setTimeout(() => {
                  keepAliveDropCache()
                })
              }}
            >
              {menu.pageName}
            </a>
          </Link>
        </Fragment>
      </Menu.Item>
    )
  }

  return (
    <SubMenu
      key={menu.pageKey}
      title={
        <Fragment>
          {/* menu.icon && <LegacyIcon type={menu.icon} /> */}
          <span>{menu.pageName}</span>
        </Fragment>
      }
    >
      {Array.isArray(menu.children) &&
        menu.children.map((v, i) => {
          if (Array.isArray(v.children) && v.children.length > 0) {
            return SubMenus(v)
          }
          return (
            <Menu.Item key={v.pageKey}>
              <Link href={v.path || ''} shallow>
                <a
                  onClick={() => {
                    setTimeout(() => {
                      keepAliveDropCache()
                    })
                  }}
                >
                  {v.pageName}
                </a>
              </Link>
            </Menu.Item>
          )
        })}
    </SubMenu>
  )
}
let openKey = []
const selectHandler = (menus) => {
  const router = useRouter()
  let selectedKey = []

  if (menus.length > 0) {
    openKey = [menus[0].pageKey]

    if (menus[0].path) {
      selectedKey = [menus[0].pageKey]
    }
  }
  // console.log('menus', menus)

  var each = (menus, parent = []) => {
    menus.forEach((item) => {
      item.path = item.path || ''
      let pathnameArr = router.pathname.split('/')
      pathnameArr.pop()
      if (
        (router.asPath.includes('?') &&
          router.asPath.split('?')[0] === item.path) ||
        router.asPath === item.path ||
        router.pathname === item.path ||
        (item.path &&
          item.path === pathnameArr.join('/') &&
          (router.pathname.includes('/form') ||
            router.pathname.includes('/add') ||
            router.pathname.includes('/detail')))
      ) {
        openKey = [item.pageKey]
        if (
          !item.children ||
          (Array.isArray(item.children) && item.children.length === 0)
        ) {
          selectedKey = [item.pageKey]
        }
      }

      Array.isArray(item.children) &&
        item.children.forEach((v) => {
          v.path = v.path || ''
          let pathnameArr = router.pathname.split('/')
          pathnameArr.pop()
          if (
            (router.asPath.includes('?') &&
              router.asPath.split('?')[0] === v.path) ||
            router.asPath === v.path ||
            router.pathname === v.path ||
            (v.path &&
              v.path === pathnameArr.join('/') &&
              (router.pathname.includes('/form') ||
                router.pathname.includes('/add') ||
                router.pathname.includes('/detail')))
          ) {
            // console.log(router.asPath, v.path, '--------')
            openKey = [...parent, item.pageKey]
            selectedKey = [v.pageKey]
            return
          }

          if (Array.isArray(v.children)) {
            each([v], [item.pageKey])
          }
        })
    })
  }

  each(menus)

  if (menus.length > 0 && selectedKey.length === 0) {
    if (
      Array.isArray(menus[0].children) &&
      menus[0].children[0] &&
      menus[0].children[0].pageKey
    ) {
      selectedKey.push(menus[0].children[0].pageKey)
    }
  }

  return {selectedKey, openKey}
}

const Sider = (props) => {
  const {collapsed} = props
  const {menu} = useContext(Context)
  const {selectedKey, openKey} = selectHandler(menu)
  // console.log(openKey, selectedKey)
  // console.log(menu)
  return (
    <Layout.Sider
      width={190}
      breakpoint="lg"
      trigger={null}
      /* collapsible */
      theme={'light'}
      collapsed={collapsed}
      className={styles.sider}
    >
      <div className={styles.menuContainer}>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={selectedKey}
          defaultOpenKeys={openKey}
          style={{height: '100%', borderRight: 1}}
        >
          {menu.map((v, i) => {
            return SubMenus(v)
          })}
        </Menu>
      </div>
    </Layout.Sider>
  )
}

export default Sider
