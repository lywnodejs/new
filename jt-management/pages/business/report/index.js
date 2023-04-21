import {Layout} from '~/components/Layout'
import {InfoCircleFilled} from '@ant-design/icons'
import React, {useEffect, useState} from 'react'
import {Space, message, Alert, Tabs} from 'antd'
import Router, {withRouter} from 'next/router'
import api from '~/api/business'
import proApi from '~/api/product'
import SearchForm from './SearchForm'
import TableList from './TableList'
import moment from 'moment'
import {useCookies} from 'react-cookie'

const {TabPane} = Tabs

const breadcrumbs = [{text: '业务管理'}, {text: '业绩统计'}]

function body(props) {
  const [data, setData] = useState({})
  const [searchParams, setSearchParams] = useState({})
  const [netWorks, setNetWorks] = useState([])
  const [proList, setProList] = useState([])
  const [pageParams, setPageParams] = useState({pageNo: 1, pageSize: 10})
  let [activeKey, setActiveKey] = useState('0')
  const [cookies] = useCookies(['tenantId'])

  useEffect(() => {
    fetchProList()
    fetchNetwork()
    const init_params = {
      type: 0,
      reportType: 0,
    }
  }, [])

  const fetchList = async (values) => {
    try {
      let postApi =
        activeKey == 0
          ? api.getAchievementByNetwork
          : api.getAchievementByManager

      const {
        data: {data, code},
      } = await postApi(values)
      if (code == 0) {
        console.log(data)
        setData(data)
      } else {
        // setData({
        //   total: 5,
        //   list: [
        //     {id:values.pageNo + 1},
        //     {id:values.pageNo +2},
        //     {id:values.pageNo +3},
        //     {id:values.pageNo +4},
        //     {id:values.pageNo +5},
        //   ]
        // })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchNetwork = async () => {
    try {
      const {
        data: {data, code},
      } = await api.getNetwork4report()
      if (code === 0) {
        setNetWorks(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchProList = async () => {
    try {
      const {
        data: {data, code},
      } = await api.getProduct4report({tenantId: cookies.tenantId})
      if (code === 0) {
        setProList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = async (value, isExport) => {
    let new_params = {
      ...value,
      type: activeKey,
    }
    pageParams.pageNo = 1
    if (Array.isArray(new_params.time)) {
      const format = new_params.reportType == 1 ? 'YYYY-MM' : 'YYYY-MM-DD'
      new_params.startTime = moment(new_params.time[0]).format(format)
      new_params.endTime = moment(new_params.time[1]).format(format)

      if (new_params.reportType == 1) {
        new_params.startTime += '-00'
        new_params.endTime += '-00'
      }
    }
    delete new_params.time
    setSearchParams({...new_params})
    let all_params = {...new_params, ...pageParams}
    if (isExport) {
      downloadData(all_params)
    } else {
      console.log('get_list', all_params)
      fetchList(all_params)
    }
  }

  const downloadData = async (params) => {
    console.log('downloadData', params)
    let data = await api.exportReportData(params)
    if (data.data.code == 0) {
      if (data.data.data) {
        window.open(data.data.data)
      } else {
        message.warning('暂无可导出数据')
      }
    }
  }

  const changePageParams = (page) => {
    let pParams = {...page}
    let params = {...searchParams, ...pParams}
    setPageParams(pParams)
    fetchList(params)
  }

  const changeTab = (key) => {
    activeKey = key
    setActiveKey(key)
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="searchForm" style={{marginBottom: '15px'}}>
        <Tabs activeKey={activeKey} onTabClick={(key) => changeTab(key)}>
          <TabPane tab="网点业绩" key="0" forceRender={true} />
          <TabPane tab="个人业绩" key="1" forceRender={true} />
        </Tabs>
        <SearchForm
          {...{
            onSearch,
            netWorks,
            activeKey,
            proList,
          }}
        />
      </div>

      <TableList
        {...{
          data,
          activeKey,
          pageParams,
          changePageParams,
        }}
      />
    </Layout>
  )
}

body.getInitialProps = async () => ({})

export default withRouter(body)
