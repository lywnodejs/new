import React, {useEffect, useState} from 'react'
import {Row, Col, Button} from 'antd'
import {Layout} from '~/components/Layout'
import Router, {withRouter} from 'next/router'
import RepayList from '../RepayList'
import ContactList from '../ContactList'
import api from '~/api/order'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

const breadcrumbs = [{text: '进件管理'}, {text: '进件列表'}]

function body({operationTypes, statusList, router}) {
  const [list, setList] = useState([])

  useEffect(() => {
    async function fetchData() {
      breadcrumbs.push({
        text: router.query.tag == 'repayWater' ? '支付信息' : '通讯录',
      })
      onSearch()
    }
    fetchData()
  }, [])

  const fetchList = async () => {
    if (router.query.tag == 'repayWater') {
      try {
        const {
          data: {data, code},
        } = await api.fetch_loan_water({
          ...pageParams,
          loanApplyId: router.query.id,
        })
        if (code === 0) {
          setList(data)
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      try {
        const {
          data: {data, code},
        } = await api.fetch_address_list({
          ...pageParams,
          userId: router.query.userId,
        })
        if (code === 0) {
          setList(data)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  const onSearch = async () => {
    pageParams.pageNo = 1
    fetchList()
  }
  const onPage = async () => {
    fetchList()
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      {router.query.tag == 'repayWater' && (
        <RepayList
          {...{list, onPage, operationTypes, statusList, pageParams}}
        />
      )}
      {router.query.tag == 'contacts' && (
        <ContactList {...{list, onPage, pageParams}} />
      )}
    </Layout>
  )
}

body.getInitialProps = async () => {
  const backData = {
    operationTypes: [],
    statusList: [],
  }

  try {
    const [
      {
        data: {data, code},
      },
      {
        data: {data: statusList, code: statusCode},
      },
    ] = await Promise.all([
      api.get_data_dict('LOAN_DEDUCT_COMMOND_TYPE'),
      api.get_data_dict('LOAN_DEDUCT_COMMOND_STATUS'),
    ])

    if (code == 0) {
      return {
        operationTypes: data,
        statusList: statusCode === 0 ? statusList : [],
      }
    }
    backData.code = code
    return backData
  } catch (err) {
    console.log(err)
    return backData
  }
}

export default withRouter(body)
