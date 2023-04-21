import React, {PureComponent, Fragment, useState, useEffect} from 'react'
import {Menu, Layout, Avatar, Popover, Badge, List} from 'antd'
import {Icon as LegacyIcon} from '@ant-design/compatible'
import {ImportOutlined} from '@ant-design/icons'
import classnames from 'classnames'
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
    fetch('fincloud.admin.center.facade.api.authservice.loginout').then(() => {
      location.href = '/login'
    })
  }

  useEffect(() => {
    setName(cookies.name)
  })

  const rightContent = (
    <>
      <span style={{color: '#FFFFFF', marginRight: 4}}>Hi,</span>
      <span style={{color: '#FFFFFF', marginRight: 4}}>{name}</span>
      <span
        style={{
          width: '1px',
          height: '24px',
          background: 'rgba(0,41,101,1)',
          display: 'inline-block',
          margin: '0 17px 0 8px',
        }}
      ></span>
      <span
        style={{color: '#FFFFFF', marginRight: 4, cursor: 'pointer'}}
        onClick={onExit}
      >
        <ImportOutlined
          style={{transform: 'rotate(180deg)', paddingRight: '2px'}}
        />
        退出
      </span>
    </>
  )

  return (
    <Layout.Header className={classnames(styles.header)}>
      <div className={styles.brand}>
        <img alt="logo" src="/logo-500.png" style={{height: '32px'}} />
        <span className={styles.split} style={{background: '#fff'}} />
        <span>智能营销运营平台</span>
        <span
          className={styles.split}
          style={{background: '#002965', marginLeft: 13, marginRight: 11}}
        />
        <span>管理控制台</span>
      </div>

      <div className={styles.rightContainer}>{rightContent}</div>
    </Layout.Header>
  )
}

export default Header
