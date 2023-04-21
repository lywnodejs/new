import {Layout} from '~/components/Layout'
import {useEffect, useState, useRef} from 'react'
import {Row, Col, Radio, Divider, Select} from 'antd'
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  Legend,
  CartesianGrid,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ComposedChart,
  Label,
  LabelList,
  CartesianAxis,
  ResponsiveContainer,
} from 'recharts'
import React from 'react'
import {biFetch} from '~/utils/fetch'

import style from './style.less'
const breadcrumbs = [{text: '资产监控报表'}, {text: '用户画像分析'}]
import map from './map'

const {Option} = Select

const users = [
  {label: '申请用户', value: 1},
  {label: '放款用户', value: 2},
]
const COLORS = ['#4D7CFF', '#A1E6CE', '#52CCA3', '#BFB3FF']

const Chart = ({
  tagId,
  channels,
  title,
  spaceLeft,
  spaceRight,
  children,
  color,
}) => {
  const [channel, setChannel] = useState('')
  const [userType, setUserType] = useState(1)
  const [data, setData] = useState([])

  const fetchList = async ({tagId, userType, srcCode}) => {
    const {
      data: {code, data},
    } = await biFetch('/user/profile/query', {tagId, userType, srcCode})
    // console.log(data)
    if (code !== 0) {
      return
    }
    setData(data)
  }

  useEffect(() => {
    fetchList({tagId, userType, srcCode: channel})
  }, [userType, channel])

  const onChannel = (e) => {
    setChannel(e)
  }

  const onUser = (e) => {
    setUserType(e.target.value)
  }

  return (
    <div
      className={style.chart}
      style={{marginLeft: spaceLeft, marginRight: spaceRight}}
    >
      <h2>{title}</h2>
      <Divider />
      <div className={style.title}>
        <div>
          <Select value={channel} onChange={onChannel} style={{width: 120}}>
            <Option value="">全部渠道</Option>
            {channels.map((v) => (
              <Option key={v.srcCode} value={v.srcCode}>
                {v.name}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <Radio.Group options={users} onChange={onUser} value={userType} />
        </div>
      </div>
      <div style={{height: 20}} />
      {React.cloneElement(children, {channel: 0, userType, data, color})}
    </div>
  )
}

const renderColorfulLegendText = (value, entry) => {
  return (
    <span className={style.item} dangerouslySetInnerHTML={{__html: value}} />
  )
}

const CPieChart = ({data, innerRadius}) => {
  let list = data.map((d) => ({
    name: `<span>${d.tag}</span><span>${d.percent}%</span><span>${d.num}</span>`,
    value: d.num,
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Legend
          iconType="circle"
          iconSize={15}
          height={140}
          layout="vertical"
          verticalAlign="middle"
          wrapperStyle={{
            top: 120,
            left: 450,
            lineHeight: '1em',
          }}
          formatter={renderColorfulLegendText}
        />
        <Pie
          data={list}
          cx={220}
          cy={170}
          innerRadius={innerRadius}
          outerRadius={120}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
          label={true}
          legendType="rect"
        >
          {list.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

const CBarChart = ({data, color}) => {
  // console.log(data, '------------')
  let list = data.map((d) => ({
    name: `${d.tag} ${d.percent}%`,
    value: d.num,
  }))
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={list}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 15,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar barSize={30} dataKey="value" fill={color}>
          <LabelList dataKey="value" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

const Education = ({data}) => {
  let list = data.map((d) => ({
    name: d.tag,
    value: d.num,
    percent: `${d.percent}%`,
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        layout="vertical"
        data={list}
        margin={{
          top: 0,
          right: 40,
          left: 30,
          bottom: 15,
        }}
      >
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Bar barSize={30} dataKey="value" fill="#9580FF">
          <LabelList dataKey="percent" position="right" />
          <LabelList dataKey="value" position="insideLeft" fill="#fff" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

const Area = ({data}) => {
  useEffect(() => {
    map(data)
  }, [data])
  return <div id="main" style={{width: '100%', height: 400}}></div>
}

const body = ({channels}) => {
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Chart {...{tagId: 1, channels, title: '地区'}}>
        <Area />
      </Chart>
      <div style={{height: 10}} />
      <Row>
        <Col span={12}>
          <Chart {...{tagId: 2, channels, title: '性别', spaceRight: 5}}>
            <CPieChart />
          </Chart>
        </Col>
        <Col span={12}>
          <Chart
            {...{
              tagId: 3,
              channels,
              title: '年龄',
              spaceLeft: 5,
              color: '#4D7CFF',
            }}
          >
            <CBarChart />
          </Chart>
        </Col>
      </Row>
      <div style={{height: 10}} />
      <Row>
        <Col span={12}>
          <Chart
            {...{
              tagId: 4,
              channels,
              title: '月收入',
              spaceRight: 5,
              color: '#7D8FB3',
            }}
          >
            <CBarChart />
          </Chart>
        </Col>
        <Col span={12}>
          <Chart {...{tagId: 5, channels, title: '学历', spaceLeft: 5}}>
            <CPieChart innerRadius={80} />
          </Chart>
        </Col>
      </Row>
      <div style={{height: 10}} />
      <Row>
        <Col span={12}>
          <Chart {...{tagId: 6, channels, title: '婚姻状态', spaceRight: 5}}>
            <CPieChart />
          </Chart>
        </Col>
        <Col span={12}>
          <Chart {...{tagId: 7, channels, title: '信用分', spaceLeft: 5}}>
            <Education />
          </Chart>
        </Col>
      </Row>
    </Layout>
  )
}

body.getInitialProps = async () => {
  try {
    const {
      data: {code, data: channels = []},
    } = await biFetch('/common/allChannel')

    if (code != 0) {
      return {
        channels: channels || [],
      }
    }

    return {
      channels: channels || [],
    }
  } catch (e) {
    console.log(e)
  }
  return {
    channels: [],
  }
}

export default body
