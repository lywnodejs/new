import {useEffect, useState} from 'react'
import {withRouter} from 'next/router'
import {
  Button,
  Row,
  Col,
  Table,
  Tabs,
  Card,
  Radio,
  List,
  Popconfirm,
} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import moment from 'moment'
import Router from 'next/router'

import api from '~/api/collection'

function OrderDetail(props) {
  const [detail, setDetail] = useState({})

  const pullData = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_all_list(props.id)
      if (code == 0) {
        setDetail(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    async function fetchData() {
      pullData()
    }
    fetchData()
  }, [])

  return <></>
}

export default OrderDetail
