import {Col, Row} from 'antd'
import dynamic from 'next/dynamic'
import {Layout} from '~/components/Layout'
import fetch from '~/utils/fetch'
import CateTitleCard from './components/CateTitleCard'
import ClassificationCard from './components/ClassificationCard'
import GroupCard from './components/GroupCard'
import IndexInvokeTrendCard from './components/IndexInvokeTrendCard'
import TopIndexRow from './components/TopIndexRow'
import {useEffect} from 'react'

const {Line} = dynamic(() => import('@ant-design/charts'), {ssr: false})

const breadcrumbs = [{text: '统计分析'}, {text: '统计报表'}]

function body(props) {
  const {todayCallCount, sumCallCount, indicatorsCount} = props.data
  const topIndex = {
    todayCallCount,
    sumCallCount,
    indicatorsCount,
  }
  let {callDatas24Hour, callDatas7day, callDatas30day} = props.data
  callDatas24Hour = callDatas24Hour.map((e) => {
    return {...e, value: parseInt(e.value)}
  })
  callDatas7day = callDatas7day.map((e) => {
    return {...e, value: parseInt(e.value)}
  })
  callDatas30day = callDatas30day.map((e) => {
    return {...e, value: parseInt(e.value)}
  })
  const trendData = {
    title: '总指标调用趋势',
    todayData: callDatas24Hour,
    weekData: callDatas7day,
    monthData: callDatas30day,
  }

  const {
    groupIndicatorsStatisticData24Hour,
    groupIndicatorsStatisticData7Day,
    groupIndicatorsStatisticData30Day,
  } = props.data
  let groupTodayData = []
  for (let groupData of groupIndicatorsStatisticData24Hour) {
    let type = groupData.groupName
    for (let e of groupData.callDatas) {
      groupTodayData.push({...{...e, value: parseInt(e.value)}, type})
    }
  }
  let groupWeekData = []
  for (let groupData of groupIndicatorsStatisticData7Day) {
    let type = groupData.groupName
    for (let e of groupData.callDatas) {
      groupWeekData.push({...{...e, value: parseInt(e.value)}, type})
    }
  }
  let groupMonthData = []
  for (let groupData of groupIndicatorsStatisticData30Day) {
    let type = groupData.groupName
    for (let e of groupData.callDatas) {
      groupMonthData.push({...{...e, value: parseInt(e.value)}, type})
    }
  }
  const groupTrendData = {
    title: '分组指标调用趋势',
    todayData: groupTodayData,
    weekData: groupWeekData,
    monthData: groupMonthData,
  }
  const {
    typeIndicatorsStatisticData24Hour,
    typeIndicatorsStatisticData7Day,
    typeIndicatorsStatisticData30Day,
  } = props.data
  let typeTodayData = []
  for (let groupData of typeIndicatorsStatisticData24Hour) {
    let type = groupData.groupName
    for (let e of groupData.callDatas) {
      typeTodayData.push({...{...e, value: parseInt(e.value)}, type})
    }
  }
  let typeWeekData = []
  for (let groupData of typeIndicatorsStatisticData7Day) {
    let type = groupData.groupName
    for (let e of groupData.callDatas) {
      typeWeekData.push({...{...e, value: parseInt(e.value)}, type})
    }
  }
  let typeMonthData = []
  for (let groupData of typeIndicatorsStatisticData30Day) {
    let type = groupData.groupName
    for (let e of groupData.callDatas) {
      typeMonthData.push({...{...e, value: parseInt(e.value)}, type})
    }
  }
  const typeTrendData = {
    title: '分类指标调用趋势',
    todayData: typeTodayData,
    weekData: typeWeekData,
    monthData: typeMonthData,
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div>
        <TopIndexRow topIndex={topIndex} />
        <CateTitleCard title="指标调用统计" />
        <IndexInvokeTrendCard {...trendData} />
        <IndexInvokeTrendCard {...groupTrendData} />
        <IndexInvokeTrendCard {...typeTrendData} />
        <CateTitleCard title="占比统计" />
        <Row
          gutter={24}
          style={{
            marginTop: 0,
          }}
        >
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <GroupCard data={props.data.groupIndicatorsRateDatas} />
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <ClassificationCard data={props.data.typeIndicatorsRateDatas} />
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

body.getInitialProps = async () => {
  const defaultData = {
    todayCallCount: 0,
    sumCallCount: 0,
    indicatorsCount: 0,
    callDatas24Hour: [],
    callDatas7day: [],
    callDatas30day: [],
    groupIndicatorsStatisticData24Hour: [],
    groupIndicatorsStatisticData7Day: [],
    groupIndicatorsStatisticData30Day: [],
    typeIndicatorsStatisticData24Hour: [],
    typeIndicatorsStatisticData7Day: [],
    typeIndicatorsStatisticData30Day: [],
    groupIndicatorsRateDatas: [],
    typeIndicatorsRateDatas: [],
  }
  try {
    const {
      data: {data, code},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsstatisticservice.getstatisticmaindatas',
      [{}],
    )

    if (code === 0) {
      return {
        data,
      }
    }

    return {
      data: defaultData,
    }
  } catch (err) {
    return {
      data: defaultData,
    }
  }
}

export default body
