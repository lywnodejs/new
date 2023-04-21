import {Layout} from '~/components/Layout'
const breadcrumbs = [{text: '进件管理'}, {text: '人工跟单'}, {text: '跟进记录'}]

function body(props) {
  return <Layout breadcrumbs={breadcrumbs}></Layout>
}

export default body
