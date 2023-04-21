import React, {PureComponent, Fragment, useState, useEffect} from 'react'
import {Menu, Layout, Avatar, Popover, Badge, List} from 'antd'
import {Icon as LegacyIcon} from '@ant-design/compatible'
import {ImportOutlined} from '@ant-design/icons'
import styles from './Header.less'
import config from '~/utils/config'
import {useCookies} from 'react-cookie'
import fetch from '~/utils/fetch'

const {SubMenu} = Menu

function Header(props) {
  const {collapsed, onCollapseChange, fixed} = props
  const [cookies, setCookies, removeCookies] = useCookies(['name', 'sessionId'])
  const [name, setName] = useState('')

  const onExit = () => {
    removeCookies('sessionId')
    removeCookies('name')
    fetch('fincloud.admin.center.facade.api.authservice.loginout').then(
      (res) => {
        location.href = '/login'
      },
    )
  }

  useEffect(() => {
    setName(cookies.name)
  })

  const rightContent = (
    <>
      <img src="/avatar.png" />
      <h2>{name}</h2>
      <span style={{marginRight: 4, cursor: 'pointer'}} onClick={onExit}>
        <ImportOutlined
          style={{
            transform: 'rotate(180deg)',
            color: '#B3B3B3',
            fontSize: 20,
          }}
        />
      </span>
    </>
  )

  return (
    <Layout.Header className={styles.header}>
      <div className={styles.title}>
        <img alt="logo" src="/logo-500.png" style={{width: 126}} />
        <h1>统一数据源管理平台</h1>
      </div>
      <div className={styles.rightContainer}>{rightContent}</div>
    </Layout.Header>
  )
}

export default Header
