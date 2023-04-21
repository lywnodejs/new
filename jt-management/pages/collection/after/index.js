import React, {useEffect, useState, useContext} from 'react'
import {useCookies} from 'react-cookie'
import {Layout} from '~/components/Layout'
import api from '~/api/collection'
import apiProduct from '~/api/product'
import {Alert, message, Button} from 'antd'
import Router, {withRouter} from 'next/router'
import Search from '~/components/pages/collection/after/Search'
import TableList from '~/components/pages/collection/after/TableList'

const breadcrumbs = [
  {text: '风险预警管理'},
  {text: '人工检查管理'},
  {text: '检查清单'},
]

const initData = {
  list: [],
  total: 0,
}

const getData = async (pageParams, searchParams = {}, tenantId) => {
  try {
    const {
      data: {data, code},
    } = await api.getLoanAfterList({
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

  const getList = async (
    pageParams = pageParams,
    searchParams = searchParams,
  ) => {
    let postData = {}
    if (props.keyword) {
      postData = {
        ...pageParams,
        keyword: props.keyword,
      }
    } else {
      postData = {
        ...pageParams,
        ...searchParams,
        tenantId: '108',
      }
    }
    let data = await getData(postData)
    console.log(data)
    let result = {...data}
    result.list = result.list.map((v, i) => {
      return {
        ...v,
        key: pageParams.page * pageParams.pageSize + i,
      }
    })

    setData(result)
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
    <Layout
      isGray={true}
      breadcrumbs={breadcrumbs}
      extra={
        props.keyword ? (
          <Button onClick={() => Router.back()}>返回上一页</Button>
        ) : null
      }
    >
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

body.getInitialProps = async (params) => {
  const backData = {
    collectionProducts: [],
    collectionLevels: [],
  }
  const keyword = params.ctx.query.mobilePhone

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
    return backData, keyword
  } catch (err) {
    console.log(err)
    return backData
  }
}

export default withRouter(body)
