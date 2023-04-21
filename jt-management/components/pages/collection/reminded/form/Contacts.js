import {Button, Space, message} from 'antd'
import React, {useEffect} from 'react'
import Router from 'next/router'

import BaseTable from './BaseTable'
import AddContacts from './AddContacts'
import AddHistory from './AddHistory'
import Remark from '~/components/common/Remark'
import api from '~/api/collection'

export default function (props) {
  // useEffect(() => {
  //   console.log('111111:', props)
  // }, [props])

  const getRemark = (remark, successFun, failFun) => {
    console.log(remark)
    setTimeout(() => {
      successFun()
    }, 3000)
  }

  const getHistoryData = (formData, successFun, failFun) => {
    let params = {
      ...formData,
      collectionOrderId: +props.id,
      collectionMobilePhoneEncrypt: props.mobilePhoneEncrypt,
    }
    api
      .add_one_collection(params)
      .then(({data: {code}}) => {
        if (code == 0) {
          message.success('添加成功')
          successFun()
          props.reloadData()
        } else {
          failFun()
        }
      })
      .catch(() => {
        failFun()
      })
  }

  const getContactInfo = (form, successFun, failFun) => {
    console.log(form)
    setTimeout(() => {
      successFun()
    }, 3000)
  }

  const columns = [
    {
      title: '联系人关系',
      dataIndex: 'attrName',
      key: 'attrName',
      width: 150,
    },
    {
      title: '联系人姓名',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
    },
    {
      title: '联系电话',
      dataIndex: 'phoneNo',
      key: 'phoneNo',
      width: 150,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
    },
    // {
    //   title: '备注',
    //   dataIndex: 'remark',
    //   key: 'remark',
    //   width: 150,
    // },
    {
      title: '操作',
      key: 'cz',
      width: 150,
      render: (r) => {
        return (
          <Space>
            <AddHistory
              phoneNo={r.phoneNo}
              getHistoryData={getHistoryData}
              {...props}
            />
            {/* <Remark getRemark={getRemark} /> */}
          </Space>
        )
      },
    },
  ]

  const toContacts = () => {
    Router.push(
      `/collection/reminded/form/phone-list?orderId=${props.id}&uid=${props.userId}`,
    )
  }

  return (
    <>
      <Space style={{marginBottom: 20}}>
        {/* <AddContacts getContactInfo={getContactInfo} /> */}
        <Button type="primary" onClick={toContacts}>
          通讯录详情
        </Button>
      </Space>

      <BaseTable list={props.list || []} columns={columns} rowKey="contactId" />
    </>
  )
}
