import {Layout} from '~/components/Layout'
import {InfoCircleFilled} from '@ant-design/icons'
import React, {useEffect, useState, useContext} from 'react'
import {Space, message, Alert, Modal, Button} from 'antd'
import {useCookies} from 'react-cookie'
import api from '~/api/business'
import SearchForm from './SearchForm'
import TableList from './TableList'
import AssignModal from '~/components/common/AssignBusinessModal'
import {withKeepAlive} from 'react-next-keep-alive'
import Router from 'next/router'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

let values = {}
const breadcrumbs = [{text: '客户经理管理'}, {text: '业务总列表'}]

function body(props) {
  const [cookies] = useCookies(['tenantId'])
  const [list, setList] = useState({})
  const [visible, setVisible] = useState(false)
  const [orderIds, setOrderIds] = useState([])
  const [alloctOrderIds, setAlloctOrderIds] = useState([])

  const orderNewNO = props.orderNo
  useEffect(() => {
    onSearch({orderStatus: 2})
  }, [])
  const fetchList = async (values = {}) => {
    try {
      const {time, times} = values
      values.IssueStartTime =
        (time && time[0].format('YYYY-MM-DD HH:mm:ss')) || null
      values.IssueEndTime =
        (time && time[1].format('YYYY-MM-DD HH:mm:ss')) || null
      values.distributionTimeStart =
        (times && times[0].format('YYYY-MM-DD HH:mm:ss')) || null
      values.distributionTimeEnd =
        (times && times[1].format('YYYY-MM-DD HH:mm:ss')) || null
      delete values.time
      delete values.times
      const postData = orderNewNO ? {orderNo: orderNewNO} : {...values}
      const {
        data: {data, code},
      } = await api.getOrders({
        ...pageParams,
        ...postData,
      })
      if (code == 0) {
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = (value) => {
    values = value
    pageParams.pageNo = 1
    fetchList({...values})
  }

  const onPage = (pageNo, pageSize) => {
    pageParams.pageNo = pageNo
    pageParams.pageSize = pageSize
    fetchList(values)
  }

  const appendToOrderIds = (ids) => {
    setOrderIds(ids)
  }

  const onPartialAssign = (ids) => {
    let orderIdArr = ids || orderIds
    setAlloctOrderIds(orderIdArr)
    if (Array.isArray(orderIdArr) && !orderIdArr.length) {
      return message.error('请先选择要分配的订单')
    }

    let hasStatus1 = orderIdArr.some((id) => {
      let itemData = list.list.find((item) => item.id == id)
      return itemData.orderStatus == 1
    })
    if (hasStatus1) {
      Modal.confirm({
        content: '确定将已补充状态的订单重新分配客户经理？',
        onOk: () => {
          setVisible(true)
        },
      })
    } else {
      setVisible(true)
    }
  }

  const checkDetail = (record) => {
    // /credit/examine/detail?creditId=${record.creditId}&orderId=${record.orderId}`

    if (record.type == 1) {
      // /accounting/iou/detail?orderNum=${record.orderNum}
      return Router.push(`/accounting/iou/detail?orderNum=${record.orderNo}`)
      // return context.push(<AccountingDetail orderNum={record.orderNo} />)
    }
    if (record.type == 0) {
      // context.push(<FeedDetail id={record.loanApplyId} />)
      // url = `/credit/examine/detail?creditId=${record.creditid}&orderId=${record.orderNo}`
      Router.push(`/feed/order/detail?id=${record.loanApplyId}`)
    }
  }

  // 单个分配
  const allocat = (data) => {
    let ids = [data.id]
    // setOrderIds(ids)
    onPartialAssign(ids)
  }

  const onHide = () => {
    // setOrderIds([])
    setVisible(false)
  }

  const onAssignSubmit = async ({orderIds, giveAccountManagerId}) => {
    try {
      const {
        data: {data, code},
      } = await api.updateAssign({
        orderIds,
        giveAccountManagerId,
      })
      if (code == 0) {
        message.success(`选择分配成功`)
        setVisible(false)
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Layout
      breadcrumbs={breadcrumbs}
      extra={
        orderNewNO ? <Button onClick={context.pop}>返回上一页</Button> : null
      }
    >
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <SearchForm
          {...{
            onSearch,
            onPartialAssign,
          }}
        />

        <TableList
          {...{
            list,
            onPage,
            pageParams,
            appendToOrderIds,
            allocat,
            checkDetail,
          }}
        />
      </Space>
      <AssignModal
        orderIds={alloctOrderIds}
        visible={visible}
        onHide={onHide}
        pullData={onPage}
        tenantId={cookies.tenantId}
        onAssignSubmit={onAssignSubmit}
      />
    </Layout>
  )
}

export default withKeepAlive(body, 'business-list')
