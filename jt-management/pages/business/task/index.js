import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import businessApi from '~/api/business'
import proApi from '~/api/product'
import {Table, Form, Tabs, message, Card} from 'antd'

import SearchForm from './SearchForm'
import {useCookies} from 'react-cookie'
import moment from 'moment'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

const dataType = [
  {type: '0', key: 'allStatisticsVoList'},
  {type: '1', key: 'networkStatisticsVoList'},
  {type: '2', key: 'managerStatisticsVoList'},
]

const getData = async (params = pageParams) => {
  try {
    let {
      data: {code, data},
    } = await businessApi.getTaskList(params)
    if (code == 0) {
      const item = dataType.find((v) => v.type == params.statisticsType)
      let key = item.key || ''
      data.list = data.vo[key] || []
      return data
    }
    return []
  } catch (e) {
    return []
  }
}
const getInitMouth = () => {
  const mouth = moment().format('YYYY-MM')
  return [moment(mouth), moment(mouth)]
}
const breadcrumbs = [{text: '客户经理管理'}, {text: '任务分配统计'}]

const columns0 = [
  {title: '日期', dataIndex: 'dateTime'},
  {title: '客户经理数量', dataIndex: 'managerCount'},
  {title: '分配数量', dataIndex: 'distributeCount'},
  {title: '完成数量', dataIndex: 'finishCount'},
  {title: '完成度', dataIndex: 'finishRate'},
].map((v) => {
  v.align = 'center'
  return v
})
const columns1 = [
  {title: '日期', dataIndex: 'dateTime'},
  {title: '支行代码', dataIndex: 'networkCode'},
  {title: '网点名称', dataIndex: 'networkName'},
  {title: '客户经理数量', dataIndex: 'managerCount'},
  {title: '分配数量', dataIndex: 'distributeCount'},
  {title: '完成数量', dataIndex: 'finishCount'},
  {title: '完成度', dataIndex: 'finishRate'},
].map((v) => {
  v.align = 'center'
  return v
})
const columns2 = [
  {title: '日期', dataIndex: 'dateTime'},
  {title: '客户经理', dataIndex: 'managerName'},
  {title: '工号', dataIndex: 'jobNumber'},
  {title: '所属网点', dataIndex: 'networkName'},
  {title: '分配数量', dataIndex: 'distributeCount'},
  {title: '完成数量', dataIndex: 'finishCount'},
  {title: '完成度', dataIndex: 'finishRate'},
].map((v) => {
  v.align = 'center'
  return v
})

function body(props) {
  const [data, setData] = useState(props.data)
  const [searchParams, setSearchParams] = useState({})
  const [netWorks, setNetWorks] = useState([])
  const [proList, setProList] = useState([])
  const [activeKey, setActiveKey] = useState('0')
  const [cookies] = useCookies(['name'])
  const [cookiesTenantId] = useCookies(['tenantId'])
  const [form] = Form.useForm()
  const [branch4search, setBranch4search] = useState([])

  useEffect(() => {
    fetchProList()
    getBranch4search()
  }, [])
  // 获取产品
  const fetchProList = async () => {
    try {
      const {
        data: {data, code},
      } = await proApi.getProduct4search({tenantId: cookiesTenantId.tenantId})
      if (code === 0) {
        setProList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  // 获取网点
  const getBranch4search = async () => {
    let {
      data: {code, data},
    } = await businessApi.getBranch4other()
    if (code == 0) {
      setBranch4search(data || [])
    }
  }

  const changeTab = (key) => {
    setActiveKey(key)
    initList(key)
  }

  const initList = (key) => {
    form.resetFields()
    onSearch(form.getFieldsValue(), key)
  }

  const onSearch = (params, key) => {
    let new_params =
      params == 'export'
        ? form.getFieldsValue()
        : params || form.getFieldsValue()

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
    new_params.statisticsType = key || activeKey
    delete new_params.time
    setSearchParams({...new_params})
    let all_params = {...new_params, ...pageParams}
    if (params == 'export') {
      downloadData(all_params)
    } else {
      updateList(all_params)
    }
  }

  const onChangePage = (pageNo = pageParams.pageNo) => {
    pageParams.pageNo = pageNo
    updateList({...searchParams, ...pageParams})
  }

  const updateList = async (params) => {
    let data = await getData({...params})
    console.log(data)
    setData(data)
  }

  const downloadData = async (params) => {
    let data = await businessApi.exportTaskData(params)
    if (data.data.code == 0) {
      if (data.data.data) {
        window.open(data.data.data)
      } else {
        message.warning('暂无可导出数据')
      }
    }
  }

  const paginationConfig = {
    total: data.totalSize,
    current: pageParams.pageNo,
    showSizeChanger: false,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onChangePage,
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card style={{marginBottom: 25}}>
        <Tabs activeKey={activeKey} onChange={changeTab}>
          <Tabs.TabPane tab="整体统计" key="0" />
          <Tabs.TabPane tab="网点统计" key="1" />
          <Tabs.TabPane tab="个人统计" key="2" />
        </Tabs>
        <SearchForm
          {...{
            form,
            netWorks,
            branch4search,
            proList,
            activeKey,
            onSearch,
          }}
        />
      </Card>

      {activeKey == 0 && (
        <Table
          bordered
          rowKey="id"
          pagination={paginationConfig}
          columns={columns0}
          dataSource={data.list || []}
        />
      )}
      {activeKey == 1 && (
        <Table
          bordered
          rowKey="id"
          pagination={paginationConfig}
          columns={columns1}
          dataSource={data.list || []}
        />
      )}
      {activeKey == 2 && (
        <Table
          bordered
          rowKey="id"
          pagination={paginationConfig}
          columns={columns2}
          dataSource={data.list || []}
        />
      )}
    </Layout>
  )
}

body.getInitialProps = async () => {
  // statisticsType 统计类型(0:整体统计；1:网点统计；2:个人统计)
  // reportType 报表类型(0:日报表；1:月报表；2:统计报表)
  const initParams = {
    ...pageParams,
    statisticsType: 0,
    reportType: 1,
    startTime: moment().format('YYYY-MM') + '-00',
    endTime: moment().format('YYYY-MM') + '-00',
  }
  let data = await getData(initParams)
  return {data}
}

export default body
