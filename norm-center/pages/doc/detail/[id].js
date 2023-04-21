import {Layout} from '~/components/Layout'
import {useEffect, useState} from 'react'
import fetch from '~/utils/fetch'
import style from './style.less'

const title = [
  '简介',
  '接入综述',
  '指标查询接口',
  '指标详情接口',
  '指标计算接口',
]

function body({content, breadcrumbs}) {
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div
        className={[style.content, style.rich].join(' ')}
        dangerouslySetInnerHTML={{
          __html: content ? content.replace('target="_blank"', '') : '',
        }}
      />
    </Layout>
  )
}

body.getInitialProps = async ({
  ctx: {
    query: {id: bizId},
  },
}) => {
  let breadcrumbs = [{text: '指标调用'}, {text: '开发文档'}]
  try {
    const {
      data: {code, data: {content}} = {code: -1, data: {}},
      data,
    } = await fetch(
      'fincloud.admin.center.facade.api.devdocservice.getdsmdocbybizid',
      [{bizId}],
    )

    if (code === 0) {
      breadcrumbs.push({text: title[bizId - 1]})
      return {content, breadcrumbs}
    }

    return {content: '', breadcrumbs}
  } catch (e) {
    return {content: '', breadcrumbs}
  }
}

export default body
