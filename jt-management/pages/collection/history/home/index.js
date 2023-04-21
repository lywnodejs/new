import React, {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import {Layout} from '~/components/Layout'
import api from '~/api/collection'
import apiProduct from '~/api/product'
import {Alert, message} from 'antd'

import Search from '~/components/pages/collection/history/index/Search'
import TableList from '~/components/pages/collection/history/index/TableList'

const breadcrumbs = [{text: '贷后管理'}, {text: '催收管理'}, {text: '催收历史'}]

const initData = {
  list: [],
  total: 0,
}

const getData = async (pageParams, searchParams = {}, tenantId) => {
  try {
    const {
      data: {data, code},
    } = await api.fetch_report_orderHistory({
      ...pageParams,
      ...searchParams,
      tenantId,
    })
    return code == 0 ? data : initData
  } catch (e) {
    console.error(e)
    return initData
  }
}

const getUserData = async () => {
  try {
    const {
      data: {data, code},
    } = await api.getNewTreeMemberList()
    return code == 0 ? data : []
  } catch (e) {
    console.error(e)
    return []
  }
}

function body(props) {
  const [productList, setProductList] = useState([])
  const [data, setData] = useState({...initData})
  const [pageParams, setPageParams] = useState({page: 1, pageSize: 10})
  const [searchParams, setSearchParams] = useState()
  const [cookies] = useCookies(['tenantId'])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  useEffect(() => {
    getProductList()
    getList(pageParams)
  }, [])

  const getList = async (
    pageParams = pageParams,
    searchParams = searchParams,
  ) => {
    let data = await getData(pageParams, searchParams, cookies.tenantId)
    setData({...data})
  }

  const getProductList = async () => {
    try {
      const {
        data: {data, code},
      } = await apiProduct.get_products({tenantId: cookies.tenantId})
      if (code == 0) {
        setProductList(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onSearch = (values) => {
    setSearchParams(values)
    pageParams.page = 1
    setPageParams({...pageParams})
    getList(pageParams, values)
  }

  const changeList = async (pageParams) => {
    setPageParams({...pageParams})
    getList(pageParams, searchParams)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Search
        search={onSearch}
        collectionLevels={props.collectionLevels}
        productList={productList}
        userList={props.userList}
      />

      {/* <Alert
        message={`已选择 4 项。   当前查询逾期总本金之和7381.29`}
        style={{marginBottom: 15}}
        type="info"
        showIcon
      /> */}

      <TableList
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        data={data}
        pageParams={pageParams}
        changeList={changeList}
        collectionProducts={props.collectionProducts}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  let userList = await getUserData()
  const backData = {
    collectionProducts: [],
    collectionLevels: [],
    userList,
  }

  try {
    const [
      {
        data: {data, code},
      },
      {
        data: {data: collectionLevels, code: levelCode},
      },
    ] = await Promise.all([
      api.get_data_dict('COLLECTION_PRODUCT'),
      api.get_data_dict('COLLECTION_LEVEL'),
    ])

    if (code == 0) {
      return {
        collectionProducts: data,
        collectionLevels: levelCode === 0 ? collectionLevels : [],
        userList,
      }
    }
    backData.code = code
    return backData
  } catch (err) {
    console.log(err)
    return backData
  }
}

export default body
