import {Layout} from '~/components/Layout'
import {InfoCircleFilled} from '@ant-design/icons'
import React, {useEffect, useState} from 'react'
import {Space, message, Alert, Tabs} from 'antd'
import {useCookies} from 'react-cookie'
import moment from 'moment'
import api from '~/api/finance'
import apiProduct from '~/api/product'
import SearchForm from './SearchForm'
import TableList from './TableList'
const {TabPane} = Tabs
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

let values = {
  startSettTime: moment(
    new Date(new Date() - 15 * 24 * 60 * 60 * 1000),
    'YYYY-MM-DD',
  ).format('YYYY-MM-DD'),
  endSettTime: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
}
const breadcrumbs = [{text: '账务管理'}, {text: '放款资金对账'}]

function body({applySources}) {
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [activeKey, setActiveKey] = useState('-1')
  const [list, setList] = useState([])
  const [startSettTime, setStartSettTime] = useState('')
  const [endSettTime, setEndSettTime] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await apiProduct.get_products({tenantId: cookies.tenantId})
        if (code == 0) {
          setProductList(data)
          data && data.length && setActiveKey(String(data[0].id))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    function fetchData() {
      if (activeKey != -1) {
        onSearch()
      }
    }
    fetchData()
  }, [activeKey])

  const fetchList = async (values = {}) => {
    try {
      const {time} = values
      values.startSettTime =
        (time && time[0].format('YYYY-MM-DD')) ||
        moment(
          new Date(new Date() - 15 * 24 * 60 * 60 * 1000),
          'YYYY-MM-DD',
        ).format('YYYY-MM-DD')
      values.endSettTime =
        (time && time[1].format('YYYY-MM-DD')) ||
        moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')

      values.sourcePltfm = values.sourcePltfm || null
      values.blncCheckFlag = values.blncCheckFlag || null

      const {
        data: {data, code},
      } = await api.fetch_check_bills({
        ...pageParams,
        ...values,
        productId: activeKey,
        orderType: 0,
      })
      if (code == 0) {
        setList(data)
        setStartSettTime(values.startSettTime)
        setEndSettTime(values.endSettTime)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = async (value) => {
    console.log(value)
    pageParams.pageNo = 1
    fetchList({...value})
  }

  const onPage = async () => {
    fetchList(values)
  }
  const changeTab = async (key) => {
    setActiveKey(key)
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="searchForm" style={{marginBottom: '10px'}}>
        <Tabs activeKey={activeKey} onTabClick={(key) => changeTab(key, false)}>
          {productList && productList.length
            ? productList.map((item) => (
                <TabPane
                  tab={item.name}
                  key={item.id}
                  forceRender={true}
                ></TabPane>
              ))
            : null}
        </Tabs>
        <SearchForm
          {...{
            onSearch,
            applySources,
          }}
        />
      </div>

      <div
        style={{
          backgroundColor: '#e6f7ff',
          border: '1px solid #91d5ff',
          padding: '10px 0 10px 10px',
        }}
      >
        <InfoCircleFilled style={{color: '#1890ff'}} />
        <span style={{paddingLeft: '5px'}}>
          {startSettTime || ''} 至{endSettTime || ''} &nbsp;&nbsp; 总计: 支出
          {list.totalAmt || 0}元
        </span>
      </div>

      <TableList
        {...{
          list,
          onPage,
          pageParams,
        }}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  const backData = {
    applySources: [],
  }

  try {
    const [
      {
        data: {data, code},
      },
    ] = await Promise.all([api.get_data_dict('LOAN_APPLY_SOURCE')])

    if (code == 0) {
      return {
        applySources: data,
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
