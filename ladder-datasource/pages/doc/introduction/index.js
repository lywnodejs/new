import {Button} from 'antd'
import {Layout} from '~/components/Layout'
import style from '../product/style.less'
import fetch from '~/utils/fetch'
import Link from 'next/link'

const breadcrumbs = [{text: '开发文档'}, {text: '简介'}]

function body({doc}) {
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div
        className={[style.content, style.rich].join(' ')}
        /* dangerouslySetInnerHTML={{__html: doc}} */
      >
        <p>本文档是数据源平台接入说明文档。</p>

        <p>
          开始开发前请仔细阅读
          <a href="/doc/summary">接入综述</a>
          ，明确业务流程、接入流程、API接入说明等。
        </p>
      </div>
    </Layout>
  )
}

body.getInitialProps = async () => {
  try {
    const {
      data: {code, data},
    } = await fetch(
      'fincloud.admin.center.facade.api.devdocservice.getdsmdocbybizid',
      [{bizId: 100000}],
    )
    console.log(code, data)
    if (code === 0) {
      return {doc: data.content}
    }
    return {doc: ''}
  } catch (err) {
    return {doc: ''}
  }
}

export default body
