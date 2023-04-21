import Router from 'next/router'
import Link from 'next/link'
import {Layout, Menu, Dropdown, Breadcrumb, Button, Tabs} from 'antd'
import {useRouter} from 'next/router'
import Sider from './Sider'
import React, {useContext, useState, useEffect, useRef} from 'react'
import {Context} from '~/pages/_app'
import Header from './Header'
import styles from './Layout.less'
import NextNProgress from '../NextNProgress'
import {HomeOutlined} from '@ant-design/icons'

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
        <div className={styles.wrap}>{React.cloneElement(children)}</div>
      </Layout>
    </Layout>
  )
}

const body = (props) => {
  const {breadcrumbs, extra} = props
  const router = useRouter()
  const containerRef = useRef(null)

  const onBack = () => {
    router.back()
  }

  useEffect(() => {
    containerRef && containerRef.current.scrollTo({top: 0})
  }, [])

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.breadcrumbBar}>
        <div className={styles.breadcrumbContainer}>
          <h1>
            {Array.isArray(breadcrumbs) &&
              breadcrumbs[breadcrumbs.length - 1].text}
          </h1>
          <span />
          {breadcrumbs && (
            <Breadcrumb>
              <Breadcrumb.Item>
                <HomeOutlined />
              </Breadcrumb.Item>
              {breadcrumbs.map((breadcrumb, index) => (
                <Breadcrumb.Item key={index}>
                  {breadcrumb.path ? (
                    <Link href={{pathname: breadcrumb.path}}>
                      <a style={{color: '#1677FF'}}>{breadcrumb.text}</a>
                    </Link>
                  ) : (
                    breadcrumb.text
                  )}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          )}
        </div>
        <div className={styles.backContainer}>
          {extra
            ? extra
            : Array.isArray(breadcrumbs) &&
              breadcrumbs.length >= 2 &&
              breadcrumbs[breadcrumbs.length - 1].path && (
                <Button onClick={onBack}>返回上一页</Button>
              )}
        </div>
      </div>
      <div className={props.className || styles.content}>{props.children}</div>
    </div>
  )
}

export default body
