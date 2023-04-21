import React, {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import {Layout} from '~/components/Layout'
import api from '~/api/collection'
import apiProduct from '~/api/product'
import {Alert, message} from 'antd'

import Search from '~/components/pages/collection/history/reminder/Search'
import TableList from '~/components/pages/collection/history/reminder/TableList'

const breadcrumbs = [{text: '贷后管理'}, {text: '催收管理'}, {text: '催记历史'}]

const initData = {
  list: [],
  total: 0,
}

const getData = async (pageParams, searchParams = {}, tenantId) => {
  try {
    const {
      data: {data, code},
    } = await api.fetch_report_recordHistory({
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
    console.log(props)
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
        urgeMethods={props.urgeMethods}
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
        urgeMethods={props.urgeMethods}
        urgeObjects={props.urgeObjects}
        urgeResultUnknows={props.urgeResultUnknows}
        urgeResultHighs={props.urgeResultHighs}
        urgeResultLows={props.urgeResultLows}
        urgeReasonTypes={props.urgeReasonTypes}
        urgeRepayDesires={props.urgeRepayDesires}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  let userList = await getUserData()
  const backData = {
    collectionProducts: [],
    collectionLevels: [],
    urgeMethods: [],
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
      {
        data: {data: urgeMethods, code: levelCode01},
      },
      {
        data: {data: urgeObjects, code: levelCode02},
      },
      {
        data: {data: urgeResultUnknows, code: levelCode03},
      },
      {
        data: {data: urgeResultHighs, code: levelCode04},
      },
      {
        data: {data: urgeResultLows, code: levelCode05},
      },
      {
        data: {data: urgeReasonTypes, code: levelCode06},
      },
      {
        data: {data: urgeRepayDesires, code: levelCode07},
      },
    ] = await Promise.all([
      api.get_data_dict('COLLECTION_PRODUCT'),
      api.get_data_dict('COLLECTION_LEVEL'),
      api.get_data_dict('URGE_METHOD'),
      api.get_data_dict('URGE_OBJECT'),
      api.get_data_dict('URGE_RESULT_UNKNOWN'),
      api.get_data_dict('URGE_RESULT_HIGH'),
      api.get_data_dict('URGE_RESULT_LOW'),
      api.get_data_dict('URGE_REASON_TYPE'),
      api.get_data_dict('URGE_REPAY_DESIRE'),
    ])

    if (code == 0) {
      return {
        collectionProducts: data,
        collectionLevels: levelCode === 0 ? collectionLevels : [],
        urgeMethods: levelCode01 === 0 ? urgeMethods : [],
        urgeObjects: levelCode02 === 0 ? urgeObjects : [],
        urgeResultUnknows: levelCode03 === 0 ? urgeResultUnknows : [],
        urgeResultHighs: levelCode04 === 0 ? urgeResultHighs : [],
        urgeResultLows: levelCode05 === 0 ? urgeResultLows : [],
        urgeReasonTypes: levelCode06 === 0 ? urgeReasonTypes : [],
        urgeRepayDesires: levelCode07 === 0 ? urgeRepayDesires : [],
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
