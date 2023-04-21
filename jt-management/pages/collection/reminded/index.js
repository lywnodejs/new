import React, {useEffect, useState, useContext} from 'react'
import {useCookies} from 'react-cookie'
import {Layout} from '~/components/Layout'
import api from '~/api/collection'
import apiProduct from '~/api/product'
import {Alert, message, Button} from 'antd'

import Search from '~/components/pages/collection/reminded/Search'
import TableList from '~/components/pages/collection/reminded/TableList'
// import AssignModal from '~/components/common/AssignModal'
import AssignModal from '~/components/common/collection/AssignModal'
import MemoForm from '~/components/common/memoForm'
import Router from 'next/router'
import {withKeepAlive} from 'react-next-keep-alive'

const breadcrumbs = [{text: '贷后管理'}, {text: '催收管理'}, {text: '待催列表'}]

const initData = {
  list: [],
  totalSize: 0,
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
    } = await api.fetch_orderManage_undoList({
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
  const [pageParams, setPageParams] = useState({page: 1, pageSize: 10})
  const [searchParams, setSearchParams] = useState({searchChildren: 1})
  const [orderBys, setOrderBys] = useState()
  const [visible, setVisible] = useState(false)
  const [cookies] = useCookies(['tenantId'])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [memoVisible, setMemoVisible] = useState(false)
  const [selectItem, setSelectItem] = useState({})

  useEffect(() => {
    getProductList()
    getList(pageParams, searchParams)
  }, [])

  const getList = async (
    pageParams = pageParams,
    searchParams = searchParams,
    orderBys = orderBys,
  ) => {
    let postData = {}
    if (props.keyword) {
      postData = {
        ...pageParams,
        tenantId: '108',
        orderBys: orderBys,
        keyword: props.keyword,
      }
    } else {
      postData = {
        ...pageParams,
        ...searchParams,
        orderBys: orderBys,
        tenantId: '108',
      }
    }
    let data = await getData(postData)
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

  const changeList = async (pageParams, orderBys) => {
    setPageParams({...pageParams})
    setOrderBys(orderBys)
    getList(pageParams, searchParams, orderBys)
  }

  const changeVisible = () => {
    if (!selectedRowKeys.length) {
      return message.error('请先选择要分配的订单')
    }
    console.log(selectedRowKeys)
    setVisible(true)
  }

  const onEditMemo = (item) => {
    setMemoVisible(true)
    setSelectItem(item)
  }

  const onAddRemark = async (memoForm, selectItem) => {
    try {
      const values = await memoForm.validateFields()
      const {data} = await api.save_memo_collection({
        remark: values.note,
        id: selectItem.id,
      })

      if (data.code == 0) {
        setMemoVisible(false)
        message.success('保存成功')
        getList(pageParams, searchParams, orderBys)
      }
    } catch (errorInfo) {
      console.error('Failed:', errorInfo)
    }
  }

  const onAssign = ({...params}, onError) => {
    params.collectionOrderIdList = selectedRowKeys
    params.tenantId = cookies.tenantId
    commitAssign(params, onError)
  }

  const commitAssign = (params, onError) => {
    api
      .edit_overdueAlloc_allselect(params)
      .then(({data: {code}}) => {
        if (code == 0) {
          message.success('分配成功')
          getList(pageParams, searchParams)
          setVisible(false)
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
        let amount = (item && item.planCapitalAmount) || 0
        return amount + prev
      }, total)
      total = total.toFixed(2)
    }
    return `已选择 ${selectedRowKeys.length} 项。   当前查询逾期总本金之和${total}`
  }

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      extra={
        props.keyword ? (
          <Button onClick={() => Router.back()}>返回上一页</Button>
        ) : null
      }
    >
      <Search
        search={onSearch}
        changeVisible={changeVisible}
        collectionLevels={props.collectionLevels}
        productList={productList}
        userList={props.userList}
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
        onEditMemo={onEditMemo}
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

      <MemoForm
        visible={memoVisible}
        onHide={() => setMemoVisible(false)}
        selectItem={selectItem}
        onSubmit={onAddRemark}
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

export default withKeepAlive(body, 'collection-reminded')
