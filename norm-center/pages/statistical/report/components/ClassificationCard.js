import dynamic from 'next/dynamic'
import styles from './ClassificationCardStyle.less'
import {Card, Row, Col, Divider} from 'antd'
import {useState, useEffect} from 'react'
import numeral from 'numeral'

const Chart = dynamic(() => import('bizcharts').then((mod) => mod.Chart), {
  ssr: false,
})

const Interval = dynamic(
  () => import('bizcharts').then((mod) => mod.Interval),
  {
    ssr: false,
  },
)

const Legend = dynamic(() => import('bizcharts').then((mod) => mod.Legend), {
  ssr: false,
})

function ClassificationCard({data}) {
  const [legendData, setLegendData] = useState([])
  useEffect(() => {
    setTimeout(() => {
      const legend = data.map((item) => {
        return {
          ...item,
        }
      })
      setLegendData(legend)
    }, 1000)
  }, [])

  const getG2Instance = (chart) => {
    if (legendData[0] && legendData[0].color) return

    const geom = chart.geometries[0] // 获取所有的图形
    if (!geom) {
      return
    }
    const items = geom.dataArray || []
    if (items.length > 0 && legendData.length > 0) {
      const legendData1 = items.map((item, index) => {
        legendData[index].color = item[0].color
        return legendData[index]
      })

      setLegendData(legendData1)
    }
  }

  return (
    <Card
      style={{
        width: '100%',
        marginTop: '0px',
      }}
      title="指标分类统计"
    >
      <div className={styles.pie}>
        <div className={styles.chart}>
          <Chart
            data={data}
            forceUpdate={true}
            height={300}
            autoFit
            onGetG2Instance={getG2Instance}
          >
            <Legend visible={false} />
            <Interval
              adjust={[
                {
                  type: 'dodge',
                  marginRatio: 0,
                },
              ]}
              color="name"
              position="name*count"
            />
          </Chart>
        </div>
        <div className={styles.legend}>
          {legendData.map((item, i) => (
            <li key={item.name}>
              <span
                className={styles.dot}
                style={{
                  backgroundColor: item.color,
                }}
              />
              <span className={styles.legendTitle}>{item.name}</span>
              <Divider type="vertical" />
              <span className={styles.rate}>{`${Math.round(
                item.rate * 100,
              )}%`}</span>
              <span className={styles.count}>
                {numeral(item.count).format('0,0')}
              </span>
            </li>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default ClassificationCard
