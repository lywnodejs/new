import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'

import api from '~/api/collection'
import apiProduct from '~/api/product'

import BaseTable from '~/components/pages/collection/reminded/form/BaseTable'
import AddContacts from '~/components/pages/collection/reminded/form/AddContacts'
import {Button, Space, message} from 'antd'
import AddHistory from '../../../../components/pages/collection/reminded/form/AddHistory'

const breadcrumbs = [
  {text: '催收管理'},
  {text: '待催列表'},
  {text: '通讯录详情'},
]

function body(props) {
  const [pageParams, setPageParams] = useState({pageNo: 1, pageSize: 10})
  const [list, setList] = useState([])

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    const {
      data: {code, data},
    } = await api.getContactlist(props.userId)
    if (code == 0) {
      setList(data || [])
    }
  }

  const getHistoryData = (formData, successFun, failFun) => {
    let params = {
      ...formData,
      collectionOrderId: +props.orderId,
      collectionMobilePhoneEncrypt: props.mobilePhoneEncrypt,
    }
    api
      .add_one_collection(params)
      .then(({data: {code}}) => {
        if (code == 0) {
          message.success('添加成功')
          successFun()
        } else {
          failFun()
        }
      })
      .catch(() => {
        failFun()
      })
  }

  const columns = [
    {title: '姓名', dataIndex: 'bookName'},
    {title: '联系号码', dataIndex: 'phoneNo'},
    {
      title: '操作',
      key: 'cz',
      width: 150,
      render: (r) => {
        return (
          <Space>
            <AddHistory
              {...props}
              phoneNo={r.phoneNo}
              getHistoryData={getHistoryData}
            />
          </Space>
        )
      },
    },
  ]

  const changePage = (pageNo, pageSize) => {
    console.log(pageNo, pageSize)
    setPageParams({
      pageNo,
      pageSize,
    })
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <BaseTable
        list={list}
        // pageParams={pageParams}
        // changePage={changePage}
        columns={columns}
      />
    </Layout>
  )
}

body.getInitialProps = async (context) => {
  const backData = {
    collectionProducts: [],
    collectionLevels: [],
    urgeMethods: [],
    urgeObjects: [],
    urgeResults: [],
    urgeResultUnknows: [],
    urgeResultHighs: [],
    urgeResultLows: [],
    urgeIsConnects: [],
    urgeReasonTypes: [],
    urgeRepayDesires: [],
    connectResults: [],
    unConnectResults: [],
    orderId: context.ctx.query.orderId,
    userId: context.ctx.query.uid,
  }

  try {
    const [
      {
        data: {data, code},
      },
      {
        data: {data: collectionLevels, code: levelCode},
      },
      {
        data: {data: urgeMethods, code: levelCode01},
      },
      {
        data: {data: urgeObjects, code: levelCode02},
      },
      {
        data: {data: urgeResults, code: levelCode03},
      },
      {
        data: {data: urgeResultUnknows, code: levelCode04},
      },
      {
        data: {data: urgeResultHighs, code: levelCode05},
      },
      {
        data: {data: urgeResultLows, code: levelCode06},
      },
      {
        data: {data: urgeIsConnects, code: levelCode07},
      },
      {
        data: {data: urgeReasonTypes, code: levelCode08},
      },
      {
        data: {data: urgeRepayDesires, code: levelCode09},
      },
    ] = await Promise.all([
      api.get_data_dict('COLLECTION_PRODUCT'),
      api.get_data_dict('COLLECTION_LEVEL'),
      api.get_data_dict('URGE_METHOD'),
      api.get_data_dict('URGE_OBJECT'),
      api.get_data_dict('URGE_RESULT'),
      api.get_data_dict('URGE_RESULT_UNKNOWN'),
      api.get_data_dict('URGE_RESULT_HIGH'),
      api.get_data_dict('URGE_RESULT_LOW'),
      api.get_data_dict('URGE_IS_CONNECT'),
      api.get_data_dict('URGE_REASON_TYPE'),
      api.get_data_dict('URGE_REPAY_DESIRE'),
    ])
    if (code == 0) {
      return {
        collectionProducts: data,
        collectionLevels: levelCode === 0 ? collectionLevels : [],
        urgeMethods: levelCode01 === 0 ? urgeMethods : [],
        urgeObjects: levelCode02 === 0 ? urgeObjects : [],
        urgeResults: levelCode03 === 0 ? urgeResults : [],
        urgeResultUnknows: levelCode04 === 0 ? urgeResultUnknows : [],
        urgeResultHighs: levelCode05 === 0 ? urgeResultHighs : [],
        urgeResultLows: levelCode06 === 0 ? urgeResultLows : [],
        urgeIsConnects: levelCode07 === 0 ? urgeIsConnects : [],
        urgeReasonTypes: levelCode08 === 0 ? urgeReasonTypes : [],
        urgeRepayDesires: levelCode09 === 0 ? urgeRepayDesires : [],
        orderId: context.ctx.query.orderId,
        userId: context.ctx.query.uid,
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
