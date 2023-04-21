import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message} from 'antd'
import {useCookies} from 'react-cookie'
import api from '~/api/order'
import apiProduct from '~/api/product'
import SearchForm from './SearchForm'
import TableList from './TableList'
import {withKeepAlive} from 'react-next-keep-alive'

const breadcrumbs = [{text: '进件管理'}, {text: '授信申请列表'}]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

let values = {}

function body({checkProgressList, statusList, applyStatusList}) {
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [list, setList] = useState([])

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    try {
      const {
        data: {data, code},
      } = await apiProduct.get_products({tenantId: cookies.tenantId})
      if (code == 0) {
        setProductList(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchList = async (values = {}) => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_all_order({
        ...pageParams,
        ...values,
        tenantId: cookies.tenantId,
      })
      if (code === 0) {
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = async (value) => {
    console.log(value)
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
            applyStatusList,
            productList,
            statusList,
            checkProgressList,
          }}
        />

        <TableList
          {...{
            list,
            onPage,
            productList,
            statusList,
            applyStatusList,
            checkProgressList,
            pageParams,
          }}
        />
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  const backData = {
    checkProgressList: [],
    statusList: [],
    applyStatusList: [],
  }

  try {
    const [
      {
        data: {data, code},
      },
      {
        data: {data: statusList, code: statusCode},
      },
      {
        data: {data: applyStatusList, code: applyStatusCode},
      },
    ] = await Promise.all([
      api.get_data_dict('LOAN_CHECK_PROGRESS'),
      api.get_data_dict('LOAN_ORDER_STATUS'),
      api.get_data_dict('LOAN_APPLY_STATUS'),
    ])

    if (code == 0) {
      return {
        checkProgressList: data,
        statusList: statusCode === 0 ? statusList : [],
        applyStatusList: applyStatusCode === 0 ? applyStatusList : [],
      }
    }
    backData.code = code
    return backData
  } catch (err) {
    console.log(err)
    return backData
  }
}

export default withKeepAlive(body, 'feed-order')
