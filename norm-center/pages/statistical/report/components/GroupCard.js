import dynamic from 'next/dynamic'
import styles from './GroupCardStyle.less'
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

const Tooltip = dynamic(() => import('bizcharts').then((mod) => mod.Tooltip), {
  ssr: false,
})
const Axis = dynamic(() => import('bizcharts').then((mod) => mod.Axis), {
  ssr: false,
})
const Coordinate = dynamic(
  () => import('bizcharts').then((mod) => mod.Coordinate),
  {
    ssr: false,
  },
)

const Legend = dynamic(() => import('bizcharts').then((mod) => mod.Legend), {
  ssr: false,
})
const View = dynamic(() => import('bizcharts').then((mod) => mod.View), {
  ssr: false,
})

const AnnotationText = dynamic(
  () => import('bizcharts').then((mod) => mod.Annotation.Text),
  {
    ssr: false,
  },
)

const Interaction = dynamic(
  () => import('bizcharts').then((mod) => mod.Interaction),
  {
    ssr: false,
  },
)

const sliceNumber = 0.01 // 自定义 other 的图形，增加两条线

const init = async (fu) => {
  const {registerShape} = await import('bizcharts').then((mod) => {
    return mod
  })

  registerShape('interval', 'sliceShape', {
    draw(cfg, container) {
      const points = cfg.points
      let path = []
      path.push(['M', points[0].x, points[0].y])
      path.push(['L', points[1].x, points[1].y - sliceNumber])
      path.push(['L', points[2].x, points[2].y - sliceNumber])
      path.push(['L', points[3].x, points[3].y])
      path.push('Z')
      path = this.parsePath(path)
      return container.addShape('path', {
        attrs: {
          fill: cfg.color,
          path: path,
        },
      })
    },
  })
  fu()
}
function GroupCard({data}) {
  const [chartData, setCharData] = useState([])
  const [legendData, setLegendData] = useState([])
  const [totalIndex, setTotalIndex] = useState(0)
  useEffect(() => {
    init(() => {
      setTimeout(() => {
        const legend = data.map((item) => {
          return {
            ...item,
          }
        })
        const total = data.reduce((pre, now) => now.count + pre, 0)
        setTotalIndex(total)
        setCharData(data)
        setLegendData(legend)
      }, 50)
    })
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
      title="指标分组统计"
    >
      <div className={styles.pie}>
        <div className={styles.chart}>
          <Chart
            forceUpdate={true}
            data={chartData}
            height={300}
            autoFit
            onGetG2Instance={getG2Instance}
          >
            <Legend visible={false} />
            <Coordinate type="theta" radius={0.8} innerRadius={0.75} />
            <Axis visible={false} />
            <Tooltip showTitle={false} />
            <Interval
              adjust="stack"
              position="count"
              color="name"
              shape="sliceShape"
            />

            <Interaction type="element-single-selected" />
            <AnnotationText
              position={['50%', '45%']}
              content="总指标数"
              style={{
                lineHeight: '24px',
                fontSize: '14',
                fill: '#0000006D',
                textAlign: 'center',
              }}
            />

            <AnnotationText
              position={['50%', '53%']}
              content={`${numeral(totalIndex).format('0,0')}个`}
              style={{
                lineHeight: '24px',
                fontSize: '20',
                fill: '#000000D8',
                textAlign: 'center',
              }}
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

export default GroupCard
