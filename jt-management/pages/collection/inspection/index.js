import React, {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import {Layout} from '~/components/Layout'
import api from '~/api/collection'
import apiProduct from '~/api/product'
import {Alert, message} from 'antd'

import Search from '~/components/pages/collection/inspection/Search'
import TableList from '~/components/pages/collection/inspection/TableList'

const breadcrumbs = [
  {text: '风险预警管理'},
  {text: '人工检查管理'},
  {text: '检查结果记录'},
]

const initData = {
  list: [],
  totalSize: 0,
}

const getData = async (pageParams, searchParams = {}, tenantId) => {
  try {
    const {
      data: {data, code},
    } = await api.getCheckCaseList({
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

  const getList = async (pageParams, searchParams = searchParams) => {
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
      />

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
  const backData = {
    collectionProducts: [],
    collectionLevels: [],
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
