import {Button} from 'antd'
import {Layout} from '~/components/Layout'
import style from '../product/style.less'
import fetch from '~/utils/fetch'

const breadcrumbs = [{text: '开发文档'}, {text: '接入综述'}]

function body({doc}) {
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div
        className={[style.content, style.rich].join(' ')}
        dangerouslySetInnerHTML={{__html: doc}}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  try {
    const {
      data: {code, data},
    } = await fetch(
      'fincloud.admin.center.facade.api.devdocservice.getdsmdocbybizid',
      [{bizId: 100001}],
    )
    if (code === 0) {
      return {doc: data.content}
    }
    return {doc: ''}
  } catch (err) {
    return {doc: ''}
  }
}

export default body
