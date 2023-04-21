import styles from '../style.less'
import {Card, Row, Col, Tooltip as TooltipAnt} from 'antd'
import {ExclamationCircleOutlined} from '@ant-design/icons'
import numeral from 'numeral'

function TopIndexRow({topIndex}) {
  const {todayCallCount, sumCallCount, indicatorsCount} = topIndex
  const topIndexDatas = [
    {
      title: '今日调用数(指标)',
      tips: '今日指标调用数',
      value: todayCallCount,
    },
    {
      title: '总调用数(指标)',
      tips: '指标总调用数',
      value: sumCallCount,
    },
    {
      title: '总指标数',
      tips: '总指标数',
      value: indicatorsCount,
    },
  ]
  return (
    <Row>
      {topIndexDatas.length
        ? topIndexDatas.map((item, i) => (
            <Col span={4} key={i} style={{marginRight: '15px'}}>
              <Card bodyStyle={{padding: '12px 24px'}}>
                <span style={{color: '#b0b0b0', marginRight: '8px'}}>
                  {item.title}
                </span>
                <TooltipAnt title={item.tips}>
                  <ExclamationCircleOutlined />
                </TooltipAnt>
                <div>
                  <span style={{fontSize: '26px', fontWeight: 'bold'}}>
                    {numeral(item.value).format('0,0')}
                  </span>
                </div>
              </Card>
            </Col>
          ))
        : null}
    </Row>
  )
}

export default TopIndexRow
