import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import Router, {withRouter} from 'next/router'
import {
  Space,
  message,
  Form,
  Button,
  Input,
  Select,
  Tabs,
  DatePicker,
} from 'antd'
import {useCookies} from 'react-cookie'
import api from '~/api/data'

import DataSourceContainer from '~/components/common/datasource/Container'

const breadcrumbs = [{text: '数据源管理'}]

function body(props) {
  const [cookies] = useCookies(['tenantId'])
  const [activeKey, setActiveKey] = useState('1')

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <DataSourceContainer />
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
