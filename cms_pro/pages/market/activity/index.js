import {Layout} from '~/components/Layout'
import {useEffect, useState, useRef} from 'react'
import fetch from '~/utils/fetch'
import {Space, message, Form, Button} from 'antd'
import TableList from './TableList'
import Router from 'next/router'
const breadcrumbs = [{text: '营销管理'}, {text: '活动管理'}]
const pageParams = {
  pageNo: 1,
  pageSize: 20,
}
let values = {}
function body(props) {
  const [list, setList] = useState([])
  const [statusList, setStatusList] = useState([])
  const [times, setTimes] = useState('time')
  const [form] = Form.useForm()
  const [total, setTotal] = useState([])
  useEffect(() => {
    getData()
  }, [])

  const getData = async (params = {...pageParams}) => {
    let {
      data: {code, data},
    } = await fetch('bank.api.activityservice.list', [params])
    if (code == 0) {
      setList(data.list)
      setTotal(data.totalSize)
    }
  }

  const onPage = async () => {
    getData(values)
  }

  const createActivity = () => {
    let url = `/market/activity/detail`
    Router.push(url)
  }

  const publishOrEnd = async (item) => {
    let postData = {
      id: item.id,
      action: item.status == '进行中' ? 3 : 1,
    }
    let {
      data: {code, data},
    } = await fetch('bank.api.activityservice.action', [postData])
    if (code == 0) {
      if (item.status == '进行中') {
        message.success('活动已结束')
        getData()
      } else {
        message.success('活动发布成功')
        getData()
      }
    }
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Button
          type="primary"
          style={{marginRight: 15}}
          onClick={createActivity}
        >
          新建活动
        </Button>

        <TableList
          {...{
            list,
            total,
            onPage,
            pageParams,
            publishOrEnd,
          }}
        />
      </Space>
    </Layout>
  )
}

export default body
