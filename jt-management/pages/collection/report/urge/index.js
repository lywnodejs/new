import {Layout} from '~/components/Layout'
import {InfoCircleFilled} from '@ant-design/icons'
import React, {useEffect, useState} from 'react'
import {Space, message} from 'antd'
import {useCookies} from 'react-cookie'
import apiProduct from '~/api/product'
import api from '~/api/collection'
import SearchForm from '~/components/pages/collection/report/urge/SearchForm'
import TableList from '~/components/pages/collection/report/urge/TableList'

const breadcrumbs = [{text: '贷后管理'}, {text: '报表统计'}, {text: '入催报表'}]

const pageParams = {
  page: 1,
  pageSize: 10,
}

let values = {}
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
function body({collectionProducts, collectionLevels, userList}) {
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [list, setList] = useState([])
  const [companys, setCompanys] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await apiProduct.get_products({tenantId: cookies.tenantId})
        if (code == 0) {
          setProductList(data)
        }
        // const {
        //   data: {data: companysData, code: companyCode},
        // } = await api.fetch_all_whitelist({
        //   page: 1,
        //   pageSize: 9999,
        //   useStatus: 1,
        //   label: '3',
        // })
        // if (companyCode == 0) {
        //   setCompanys(companysData.list)
        // }

        onSearch()
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const fetchList = async (values = {}) => {
    try {
      const {time, ...params} = values
      params.beginCreateTime = (time && time[0].format('YYYY-MM-DD')) || null
      params.endCreateTime = (time && time[1].format('YYYY-MM-DD')) || null

      params.productId = values.productId || null
      params.companyId = values.companyId || null

      const {
        data: {data, code},
      } = await api.fetch_report_newOrders({
        ...pageParams,
        ...params,
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
    values = value
    pageParams.page = 1
    fetchList({...values})
  }

  const onPage = async () => {
    fetchList(values)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <SearchForm
          userList={userList}
          {...{
            onSearch,
            productList,
            companys,
          }}
        />

        <TableList
          {...{
            list,
            onPage,
            companys,
            pageParams,
            collectionLevels,
            collectionProducts,
          }}
        />
      </Space>
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
