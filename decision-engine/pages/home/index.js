import {Layout} from '~/components/Layout'
import {useEffect, useState} from 'react'
import api from '~/api/product'
import styles from './index.less'

const style = {
  background: '#fff url(/bg.png) no-repeat 0 100%',
  backgroundSize: '100%',
}

function body() {
  const [coreIndex, setCoreIndex] = useState({})

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await api.get_index_data({})
        if (code == 0) {
          setCoreIndex(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])
  return (
    <Layout style={style}>
      <div
        style={{
          background: '#247FFF',
          color: '#fff',
          fontSize: '30px',
          padding: '30px 20px',
        }}
      >
        欢迎使用决策引擎
      </div>
      <div className={styles.plane}>
        <div>
          <span>总执行次数</span>
          <h1>
            {coreIndex.callAll} <i>次</i>
          </h1>
        </div>
        <div>
          <span>现有规则（含衍生）</span>
          <h1>
            {coreIndex.ruleCount} <i>个</i>
          </h1>
        </div>
        <div>
          <span>现有评分卡</span>
          <h1>
            {coreIndex.scoreCardCount} <i>个</i>
          </h1>
        </div>
        <div>
          <span>现有矩阵</span>
          <h1>
            {coreIndex.matrixCount} <i>个</i>
          </h1>
        </div>
        <div>
          <span>现有决策流</span>
          <h1>
            {coreIndex.flowCount} <i>个</i>
          </h1>
        </div>
      </div>
    </Layout>
  )
}

export default body
