import {Tabs} from 'antd'
import {withRouter} from 'next/router'
import {Layout} from '~/components/Layout'
import DetailQueryPane from './components/DetailQueryPane'
import UserQueryPane from './components/UserQueryPane'
import styles from './style.less'

const {TabPane} = Tabs

const breadcrumbs = [{text: '统计分析'}, {text: '调用查询'}]

function body() {
  function onTabChange(key) {}

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className={styles.searchForm} style={{marginBottom: '10px'}}>
        {/* <Tabs defaultActiveKey="1" onChange={onTabChange}>
          <TabPane tab="用户指标调用" key="1">
            <UserQueryPane />
          </TabPane>
          <TabPane tab="指标调用详情" key="2">
            <DetailQueryPane />
          </TabPane>
        </Tabs> */}
        <UserQueryPane />
      </div>
    </Layout>
  )
}

export default withRouter(body)
