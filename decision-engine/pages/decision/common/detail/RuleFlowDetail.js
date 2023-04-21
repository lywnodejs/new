import React, {useEffect, useState} from 'react'
import {Form} from 'antd'
import {withRouter} from 'next/router'
import RuleFlowTableList from './customCanvas/RuleFlowTableList'
import api from '~/api/risk'

function body({router, id, productId, category, moduleType, partialPro}) {
  // console.log(router.query.updateTime);
  const [updateTime, setUpdateTime] = useState(router.query.updateTime)
  const [list, setList] = useState(null)
  const [form] = Form.useForm()
  useEffect(() => {
    function fetchData() {
      id != 'new' && fetchList()
    }
    fetchData()
  }, [])
  const fetchList = async () => {
    let postData = {
      id: id == 'new' ? null : id,
      productId,
    }

    let postApi = partialPro
      ? api.fetch_risk_flow_pro_detail(postData)
      : api.fetch_risk_flow_detail(postData)
    try {
      const {
        data: {data, code},
      } = await postApi
      if (code === 0) {
        // console.log('data', data)
        setList(data)
        form.setFieldsValue({
          flowCode: data.flowCode,
          flowName: data.flowName,
          description: data.description,
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <RuleFlowTableList
        {...{
          list,
          activeCategoryKey: category,
          productId,
          moduleType,
          id,
          partialPro,
          form,
          updateTime,
        }}
      />
    </>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
