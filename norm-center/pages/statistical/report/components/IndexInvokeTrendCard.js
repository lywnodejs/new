import dynamic from 'next/dynamic'
import styles from '../style.less'
import {Card, Row, Col} from 'antd'
import {useState} from 'react'
const Line = dynamic(
  () => import('@ant-design/charts').then((mod) => mod.Line),
  {
    ssr: false,
  },
)

function IndexInvokeTrendCard({title, todayData, weekData, monthData}) {
  const [currentDate, setCurrentDate] = useState('month')
  const [data, setData] = useState(monthData)
  const [type, setType] = useState('month')

  const isActive = (type) => {
    if (!type) {
      return ''
    }

    if (currentDate === type) {
      return styles.currentDate
    } else {
      return ''
    }
  }

  const selectDate = (type) => {
    setCurrentDate(type)
    if (type === 'today') {
      setData(todayData)
    } else if (type === 'week') {
      setData(weekData)
    } else if (type === 'month') {
      setData(monthData)
    }
    setType(type)
  }

  const config = {
    padding: 'auto',
    forceFit: true,
    data,
    xField: 'key',
    yField: 'value',
    yAxis: {
      label: {
        formatter: (v) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    legend: {
      position: 'bottom-left',
    },
    seriesField: 'type',
    responsive: true,
  }

  let isTotal = title.indexOf('总指标') != -1
  let bottomPos = isTotal ? '35px' : '55px'
  let unitStyle = {
    bottom: bottomPos,
  }

  return (
    <Card
      style={{
        width: '100%',
        marginTop: '0px',
        paddingTop: '15px',
        position: 'relative',
      }}
      bodyStyle={{padding: '10px 24px'}}
    >
      <Row>
        <Col span={8}>
          <div>
            <span style={{fontSize: '14px', fontWeight: 'bold'}}>{title}</span>
            <span
              style={{
                fontSize: '12px',
                marginLeft: '10px',
              }}
            >
              (次)
            </span>
          </div>
        </Col>
        <Col span={4} offset={12}>
          <div className={styles.dateSelcet}>
            <a
              className={isActive('today')}
              onClick={() => selectDate('today')}
            >
              今天
            </a>
            <a className={isActive('week')} onClick={() => selectDate('week')}>
              7天
            </a>
            <a
              className={isActive('month')}
              onClick={() => selectDate('month')}
            >
              30天
            </a>
          </div>
        </Col>
      </Row>
      <Line {...config} />
      <div className={styles.unitDiv} style={unitStyle}>
        {type === 'today' ? '(小时)' : ''}
      </div>
    </Card>
  )
}

export default IndexInvokeTrendCard
