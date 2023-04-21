import React, {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import {Layout} from '~/components/Layout'
import api from '~/api/collection'
import apiProduct from '~/api/product'
import {Alert, message} from 'antd'

import Search from '~/components/pages/collection/distribution/Search'
import TableList from '~/components/pages/collection/distribution/TableList'
// import BatchedAssignModal from '~/components/common/BatchedAssignModal'
// import AssignModal from '~/components/common/AssignModal'
import AssignModal from '~/components/common/collection/AssignModal'
import BatchedAssignModal from '~/components/common/collection/BatchedAssignModal'

const breadcrumbs = [{text: '贷后管理'}, {text: '催收管理'}, {text: '分配列表'}]

const initData = {
  list: [],
  total: 0,
}

const getData = async (
  pageParams,
  searchParams = {},
  orderBys = null,
  tenantId,
) => {
  try {
    const {
      data: {data, code},
    } = await api.fetch_overdueAlloc_list({
      ...pageParams,
      ...searchParams,
      orderBys,
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
  const [pageParams, setPageParams] = useState({page: 1, pageSize: 20})
  const [searchParams, setSearchParams] = useState()
  const [orderBys, setOrderBys] = useState()
  const [visible, setVisible] = useState(false)
  const [batchedVisible, setBatchedVisible] = useState(false)
  const [total, setTotal] = useState(0)
  const [cookies] = useCookies(['tenantId'])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  useEffect(() => {
    getProductList()
    getList(pageParams)
    console.log(props)
  }, [])

  const getList = async (
    pageParams,
    searchParams = searchParams,
    orderBys = orderBys,
  ) => {
    let data = await getData(
      pageParams,
      searchParams,
      orderBys,
      cookies.tenantId,
    )
    setSelectedRowKeys([])
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
    getList(pageParams, values, orderBys)
  }

  const onSearchTotal = async (values) => {
    try {
      values.beginCreateTime = null
      values.endCreateTime = null

      values.beginGrantTime = null
      values.endGrantTime = null

      const {
        data: {data, code},
      } = await api.fetch_overdueAlloc_list({
        ...values,
        page: 1,
        pageSize: 10000,
        orderBys: null,
        tenantId: cookies.tenantId,
      })
      if (code === 0) {
        setTotal(data.total)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const changeList = async (pageParams, orderBys) => {
    setPageParams({...pageParams})
    setOrderBys(orderBys)
    getList(pageParams, searchParams, orderBys)
  }

  const changeVisible = () => {
    if (!selectedRowKeys.length) {
      return message.error('请先选择要分配的订单')
    }
    setVisible(true)
  }

  const onAssign = ({...params}, onError) => {
    params.collectionOrderIdList = selectedRowKeys
    params.tenantId = cookies.tenantId
    commitAssign(params, setVisible, onError)
  }

  const onBatchedAssign = ({...params}, onError) => {
    params.tenantId = cookies.tenantId
    commitAssign(params, setBatchedVisible, onError)
  }

  const commitAssign = (params, onSuccess, onError) => {
    api
      .edit_overdueAlloc_allselect(params)
      .then(({data: {code}}) => {
        if (code == 0) {
          message.success('分配成功')
          getList(pageParams)
          setTotal(0)
          onSuccess(false)
        } else {
          onError()
        }
      })
      .catch((err) => {
        onError()
      })
  }

  const getShowTips = () => {
    let total = 0
    if (selectedRowKeys.length > 0) {
      total = selectedRowKeys.reduce((prev, next) => {
        let item = data.list.find((v) => v.id == next)
        let amount = (item && item.totalCapitalAmount) || 0
        return amount + prev
      }, total)
      total = total.toFixed(2)
    }
    return `已选择 ${selectedRowKeys.length} 项。   当前查询逾期总本金之和${total}`
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Search
        search={onSearch}
        setBatchedVisible={setBatchedVisible}
        changeVisible={changeVisible}
        collectionLevels={props.collectionLevels}
        productList={productList}
      />

      <Alert
        message={getShowTips()}
        style={{marginBottom: 15}}
        type="info"
        showIcon
      />

      <TableList
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        data={data}
        pageParams={pageParams}
        changeList={changeList}
        collectionProducts={props.collectionProducts}
      />

      <AssignModal
        showNumber={selectedRowKeys.length}
        visible={visible}
        onHide={() => setVisible(false)}
        onOk={onAssign}
        showList={props.userList}
      />

      <BatchedAssignModal
        onSearch={onSearchTotal}
        total={total}
        visible={batchedVisible}
        onHide={() => setBatchedVisible(false)}
        productList={productList}
        collectionLevels={props.collectionLevels}
        showList={props.userList}
        onOk={onBatchedAssign}
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
