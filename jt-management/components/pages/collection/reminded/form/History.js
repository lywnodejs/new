import {Button, Divider, message} from 'antd'
import React, {useEffect, useState} from 'react'
import AddHistory from './AddHistory'
import BaseTable from './BaseTable'
import Router from 'next/router'
import api from '~/api/collection'
export default function (props) {
  const [showMore, setShowMore] = useState(false)
  const [list, setList] = useState([])

  useEffect(() => {
    if (Array.isArray(props.list)) {
      setList(props.list)
      // if(props.list.length > 5) {
      //   setList(props.list.splice(0, 5))
      //   setShowMore(true)
      // } else {
      //   setList(props.list)
      // }
    }

    console.log(props)
  }, [props])
  const columns = [
    {title: '催收期数', dataIndex: 'currentTerm'},
    {
      title: '催收方式',
      dataIndex: 'collectionMethod',
      render: (text, record, index) => {
        let findOne = props.urgeMethods.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {
      title: '催收对象',
      dataIndex: 'collectionObject',
      render: (text, record, index) => {
        let findOne = props.urgeObjects.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {
      title: '联系号码',
      dataIndex: 'collectionMobilePhone',
      render: (text, record, index) => {
        return text ? text.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : text
      },
    },
    {
      title: '联络结果',
      dataIndex: 'collectionResult',
      render: (text, record, index) => {
        if (record.repayDesire == '1') {
          let findOne = props.urgeResultUnknows.find((one) => one.code == text)
          return findOne ? findOne.description : ''
        } else if (record.repayDesire == '2') {
          let findOne = props.urgeResultHighs.find((one) => one.code == text)
          return findOne ? findOne.description : ''
        } else if (record.repayDesire == '3') {
          let findOne = props.urgeResultLows.find((one) => one.code == text)
          return findOne ? findOne.description : ''
        }
      },
    },
    {
      title: '逾期原因',
      dataIndex: 'reasonType',
      render: (text, record, index) => {
        let findOne = props.urgeReasonTypes.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {
      title: '还款意愿',
      dataIndex: 'repayDesire',
      render: (text, record, index) => {
        let findOne = props.urgeRepayDesires.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {title: '承诺还款日期', dataIndex: 'promiseRepayTime'},
    {title: '备注', dataIndex: 'remark'},
    {title: '催收员', dataIndex: 'createUser'},
    {title: '催收日期', dataIndex: 'createTime'},
  ]

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
          props.reloadData('history')
        } else {
          failFun()
        }
      })
      .catch(() => {
        failFun()
      })
  }

  const toDetail = () => {
    Router.push(`/collection/reminded/form/history?id=${props.id}`)
  }

  return (
    <>
      <div style={{marginBottom: 20}}>
        <AddHistory
          btnType="primary"
          getHistoryData={getHistoryData}
          {...props}
        />
      </div>

      <BaseTable list={list} columns={columns} />
      {showMore && (
        <>
          <div
            style={{
              marginTop: 30,
              textAlign: 'center',
            }}
          >
            <Button type="link" onClick={toDetail}>
              查看详情
            </Button>
          </div>
          <Divider />
        </>
      )}
    </>
  )
}
