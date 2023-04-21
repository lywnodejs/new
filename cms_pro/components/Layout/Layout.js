import Router from 'next/router'
import Link from 'next/link'
import {Layout, Menu, Dropdown, Breadcrumb, Button, Tabs} from 'antd'
import {useRouter} from 'next/router'
import Sider from './Sider'
import React, {useContext, useState, useEffect} from 'react'
import {Context} from '~/pages/_app'
import Header from './Header'
import styles from './Layout.less'
import NextNProgress from '../NextNProgress'

const {Content} = Layout

export const CommonLayout = (props) => {
  const {breadcrumbs, children} = props
  const [collapsed, setCollapsed] = useState(false)

  const onCollapseChange = (collapsed) => {
    setCollapsed(collapsed)
  }

  return (
    <Layout style={{background: '#FFFFFF'}}>
      <NextNProgress />
      <Header
        fixed={true}
        /* collapsed={collapsed} */
        onCollapseChange={onCollapseChange}
      />
      <Layout>
        <Sider collapsed={collapsed} />
        <div className={styles.wrap}>
          <div className={styles.container} id="primaryLayout">
            {React.cloneElement(children)}
          </div>
        </div>
      </Layout>
    </Layout>
  )
}

const body = (props) => {
  const {breadcrumbs, extra} = props
  const router = useRouter()

  const onBack = () => {
    router.back()
  }

  return (
    <Content className={styles.content}>
      {breadcrumbs && (
        <Breadcrumb style={{marginBottom: '17px'}}>
          {breadcrumbs.map((breadcrumb, index) => (
            <Breadcrumb.Item key={index}>
              {breadcrumb.path ? (
                <Link href={{pathname: breadcrumb.path}}>
                  <a style={{color: '#333'}}>{breadcrumb.text}</a>
                </Link>
              ) : (
                breadcrumb.text
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}
      <div className={styles.titleBar}>
        <h1>
          {Array.isArray(breadcrumbs) &&
            breadcrumbs[breadcrumbs.length - 1].text}
        </h1>
        {extra
          ? extra
          : Array.isArray(breadcrumbs) &&
            breadcrumbs.length >= 3 &&
            breadcrumbs[breadcrumbs.length - 2].path && (
              <Button onClick={onBack}>返回上一页</Button>
            )}
      </div>
      {props.children}
    </Content>
  )
}

export default body
