import React, {useEffect, useState} from 'react'
import {Layout} from '~/components/Layout'
import {withRouter} from 'next/router'
import TestRunDetail from './TestRunDetail'
import api from '~/api/risk'
import {findNameByKey} from '../../common/mapActionToApi'

function body({router}) {
  const [breadcrumbs, setBreadcrumbs] = useState([
    {text: '决策引擎（编辑）'},
    {text: '详情'},
  ])

  useEffect(() => {
    async function fetchData() {
      const findBread = findNameByKey(+router.query.category)
      breadcrumbs.splice(2, 0, {
        text: findBread,
      })
      if (router.query.page == 'test') {
        breadcrumbs.push({
          text: '测试运行',
        })
      }
      setBreadcrumbs([...breadcrumbs])
    }
    fetchData()
  }, [])

  return (
    <Layout breadcrumbs={breadcrumbs}>
      {router.query.page == 'test' && (
        <TestRunDetail
          {...{
            category: router.query.category,
            productId: router.query.productId,
            id: router.query.id,
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
