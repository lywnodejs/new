import React, {useEffect, useState} from 'react'
import {Row, Col, Button} from 'antd'
import Router, {withRouter} from 'next/router'
import {Layout} from '~/components/Layout'
import RuleSetDetail from './RuleSetDetail'
import RuleCardDetail from './RuleCardDetail'
import RuleMatrixDetail from './RuleMatrixDetail'
import RuleFlowDetail from './RuleFlowDetail'
import RuleDeriveDetail from './RuleDeriveDetail'
import {findNameByKey} from '../mapActionToApi'

function body({router}) {
  const [breadcrumbs, setBreadcrumbs] = useState([
    {text: '决策引擎（编辑）'},
    {text: router.query.id == 'new' ? '新增' : '详情'},
  ])

  useEffect(() => {
    async function fetchData() {
      const findBread = findNameByKey(+router.query.category)
      breadcrumbs.splice(2, 0, {
        text: findBread,
      })
      setBreadcrumbs([...breadcrumbs])
    }
    fetchData()
  }, [])

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      extra={<Button onClick={router.back}>返回上一页</Button>}
    >
      {router.query.category == 4 && (
        <RuleSetDetail
          {...{
            category: router.query.category,
            productId: router.query.productId,
            id: router.query.id,
            moduleType: router.query.moduleType,
            partialPro: router.query.partialPro,
          }}
        />
      )}
      {router.query.category == 5 && (
        <RuleCardDetail
          {...{
            category: router.query.category,
            productId: router.query.productId,
            id: router.query.id,
            moduleType: router.query.moduleType,
            partialPro: router.query.partialPro,
          }}
        />
      )}
      {router.query.category == 6 && (
        <RuleMatrixDetail
          {...{
            category: router.query.category,
            productId: router.query.productId,
            id: router.query.id,
            moduleType: router.query.moduleType,
            partialPro: router.query.partialPro,
          }}
        />
      )}
      {router.query.category == 7 && (
        <RuleDeriveDetail
          {...{
            category: router.query.category,
            productId: router.query.productId,
            id: router.query.id,
            moduleType: router.query.moduleType,
            partialPro: router.query.partialPro,
          }}
        />
      )}
      {router.query.category == 8 && (
        <RuleFlowDetail
          {...{
            category: router.query.category,
            productId: router.query.productId,
            id: router.query.id,
            moduleType: router.query.moduleType,
            partialPro: router.query.partialPro,
          }}
        />
      )}
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
