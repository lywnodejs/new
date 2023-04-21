import {Layout} from '~/components/Layout'
import React, {useEffect, useState, useContext} from 'react'
import {Space, message} from 'antd'
import apicustomer from '~/api/customer'
import SearchForm from './SearchForm'
import TableList from './TableList'
import {withKeepAlive} from 'react-next-keep-alive'

const breadcrumbs = [{text: '客户管理'}, {text: '客户列表'}]
const pageParams = {
  pageNum: 1,
  pageSize: 10,
}
let values = {}
function body(props) {
  const [totalData, setTotalData] = useState([])
  const [list, setList] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        onSearch()
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const fetchList = async (values = {}) => {
    try {
      values.fiveLevelType = values.fiveLevelType || null
      const {
        data: {data, code},
      } = await apicustomer.get_customer_list({...pageParams, ...values})
      if (code === 0 && data) {
        setTotalData(data)
        setList(data.list)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = async (value) => {
    values = value
    pageParams.pageNum = 1
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
            fetchList,
          }}
        />

        <TableList
          {...{
            list,
            onPage,
            pageParams,
            totalData,
          }}
        />
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withKeepAlive(body, 'customer-list')
