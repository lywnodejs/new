import {Layout} from '~/components/Layout'
import fetch from '~/utils/fetch'
import styles from './index.less'

const style = {
  background: '#fff url(/bg.png) no-repeat 0 100%',
  backgroundSize: '100%',
}

function body({indicatorsCount, sumCallCount, datasourceCount}) {
  return (
    <Layout style={style}>
      <div style={{background: '#247FFF'}}>
        <img src="/banner.png" />
      </div>
      <div className={styles.plane}>
        <div>
          <span>规则引擎调用次数</span>
          <h1>
            {sumCallCount} <i>次</i>
          </h1>
        </div>
        <div>
          <span>现有指标</span>
          <h1>
            {indicatorsCount} <i>个</i>
          </h1>
        </div>
        <div>
          <span>现有数据源</span>
          <h1>
            {datasourceCount} <i>个</i>
          </h1>
        </div>
      </div>
    </Layout>
  )
}

body.getInitialProps = async () => {
  const defaultData = {}
  try {
    const {
      data: {code, data},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsstatisticservice.getstatisticbasedatas',
    )
    if (code === 0) {
      return data
    }
    console.log(data)
    return defaultData
  } catch (e) {
    console.log(e)
    return defaultData
  }
}

export default body
