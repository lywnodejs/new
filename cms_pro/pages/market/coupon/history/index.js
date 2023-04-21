import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message} from 'antd'
import {useCookies} from 'react-cookie'
import Router, {withRouter} from 'next/router'
import api from '~/api/marketing'
import SearchForm from './SearchForm'
import TableList from './TableList'

const breadcrumbs = [{text: '营销管理'}, {text: '免息券'}, {text: '发放历史'}]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

let values = {}

function body({checkProgressList, statusList, router}) {
  const [cookies] = useCookies(['tenantId'])
  const [list, setList] = useState([])

  useEffect(() => {
    fetchList({businessType: router.query.taskName || ''})
  }, [])

  const fetchList = async (values = {}) => {
    try {
      const {time, usedTime, expirationTime} = values
      values.sendStartTime =
        (time && time[0].format('YYYY-MM-DD HH:mm:ss')) || null
      values.sendEndTime =
        (time && time[1].format('YYYY-MM-DD HH:mm:ss')) || null

      values.useStartTime =
        (usedTime && usedTime[0].format('YYYY-MM-DD HH:mm:ss')) || null
      values.useEndTime =
        (usedTime && usedTime[1].format('YYYY-MM-DD HH:mm:ss')) || null

      values.expireStartTime =
        (expirationTime && expirationTime[0].format('YYYY-MM-DD HH:mm:ss')) ||
        null
      values.expireEndTime =
        (expirationTime && expirationTime[1].format('YYYY-MM-DD HH:mm:ss')) ||
        null

      values.status = values.status || null
      const {
        data: {data, code},
      } = await api.fetch_marketing_history({
        ...pageParams,
        ...values,
      })
      if (code == 0) {
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = async (value) => {
    values = value
    pageParams.pageNo = 1
    fetchList({...values})
  }

  const onPage = async () => {
    fetchList(values)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <SearchForm
          {...{
            onSearch,
            router,
          }}
        />

        <TableList
          {...{
            list,
            onPage,
            pageParams,
          }}
        />
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
