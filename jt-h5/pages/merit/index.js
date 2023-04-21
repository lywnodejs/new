import style from './style.less'
import {useRouter} from 'next/router'
import {Modal} from 'antd-mobile'
import F2 from '@antv/f2'
import {useEffect, useState} from 'react'
import Head from 'next/head'
import PieLabel from '@antv/f2/lib/plugin/pie-label'
import {fetch} from '~/utils/fetch'
import {Picker} from 'antd-mobile'
import {Toast} from 'antd-mobile'

let yearParam = ''
let monthParam = ''

let filterMonths = []

for (let i = 0; i < 13; i++) {
  if (i == 0) {
    filterMonths.push({
      label: '全年',
      value: '',
    })
  } else {
    filterMonths.push({
      label: i + '月',
      value: (i + '').padStart(2, '0'),
    })
  }
}

let filterYears = []
let date = new Date()
let curYear = date.getFullYear()
for (let i = 3; i >= 0; i--) {
  let y = curYear - i
  filterYears.push({
    label: y + '年',
    value: y + '',
  })
}

const alert = Modal.alert
function body({initData}) {
  const router = useRouter()
  const [data, setData] = useState(initData)

  const onFilter = ({year, month}) => {
    yearParam = year
    monthParam = month
    getData()
  }

  const getData = async () => {
    try {
      const {
        data: {code, data, desc} = {code: -1, data: {}, desc: ''},
      } = await fetch('bank.api.read.standard.busistasreadservice.meritstas', [
        {
          sessionId: router.query.sessionId,
          searchDate:
            yearParam && monthParam ? `${yearParam}-${monthParam}` : yearParam,
        },
      ])
      if (code == 0) {
        yearParam = data.year
        monthParam = data.month == null ? '' : data.month
        setData(data)
      } else {
        Toast.info(desc)
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className={style.rootDiv}>
      <Head>
        <title>我的绩效</title>
      </Head>
      <TotalItem {...data} />
      <div className={style.statisticDiv}>
        <FilterItem {...{data, onFilter}} />
        <MeritItem {...{data}} />
        <PieItem {...{data}} />
        <AmountTrendItem {...{data}} />
      </div>
    </div>
  )
}

function TotalItem({totalIncomeAmount}) {
  return (
    <div className={style.totalDiv}>
      <h3>累计绩效收入(元)</h3>
      <span>{totalIncomeAmount}</span>
    </div>
  )
}

function FilterItem({data, onFilter}) {
  let {year, month, meritStasRule} = data

  const onShowRule = () => {
    alert(meritStasRule.title, meritStasRule.content, [
      {text: '我知道了', style: {color: '#FC8100'}},
    ])
  }
  let date = new Date()
  if (!year) {
    year = date.getFullYear() + ''
  }
  if (month == undefined || month == null) {
    month = ''
  }

  const yearAndMonth = [[...filterYears], [...filterMonths]]
  return (
    <div className={style.filterDiv}>
      <Picker
        data={yearAndMonth}
        cascade={false}
        okText="确定"
        value={[year, month]}
        dismissText="取消"
        onOk={(v) => {
          let [year, month] = v
          onFilter({year, month})
        }}
      >
        <span>{year + '年' + (month ? month + '月' : '')}</span>
      </Picker>
      <span
        onClick={onShowRule}
        className={meritStasRule ? '' : style.ruleHide}
      >
        {meritStasRule ? '延期发放规则' : ''}
      </span>
    </div>
  )
}

function MeritItem({data}) {
  let {totalShouldPayAmount, totalActualPayAmount} = data
  return (
    <div className={style.meritDiv}>
      <div>
        <h3>应发绩效(元)</h3>
        <span>{totalShouldPayAmount}</span>
      </div>
      <div>
        <h3>实发绩效(元)</h3>
        <span>{totalActualPayAmount}</span>
      </div>
    </div>
  )
}

function PieItem({data}) {
  let {meritStasShouldPaySubjs: pieData} = data
  if (pieData == null) {
    pieData = []
  }

  let total = pieData.reduce((prev, cur) => {
    return cur.totalShouldPayAmount + prev
  }, 0)

  if (total > 0) {
    pieData.forEach((item) => {
      item.ratio = item.totalShouldPayAmount / total
      item.const = 'const'
    })
  }

  useEffect(() => {
    if (total <= 0) {
      return
    }
    const chart = new F2.Chart({
      id: 'container',
      plugins: PieLabel,
      width: 360,
      height: 380 * 0.8,
      pixelRatio: window.devicePixelRatio,
    })

    chart.source(pieData)
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.6,
      radius: 0.6,
    })
    chart.axis(false)
    chart.legend(false)
    chart.tooltip(false)

    chart.pieLabel({
      sidePadding: 40,
      label1: function label1(data) {
        return {
          text: data.totalShouldPayAmount,
          fill: '#333333',
          fontWeight: 500,
          fontSize: 17,
        }
      },
      label2: function label2(data) {
        return {
          fill: '#808080',
          text: data.subject,
          fontWeight: 400,
          fontSize: 13,
        }
      },
    })
    chart
      .interval()
      .position('const*ratio')
      .color('subject', [
        '#1890FF',
        '#13C2C2',
        '#2FC25B',
        '#FACC14',
        '#F04864',
        '#8543E0',
        '#3436C7',
        '#223273',
        '#F5EA69',
        '#F4427D',
        '#F26E11',
        '#F65348',
        '#43BBD2',
      ])
      .adjust('stack')
    chart.render()

    const frontPlot = chart.get('frontPlot')
    const coord = chart.get('coord') // 获取坐标系对象
    frontPlot.addShape('sector', {
      attrs: {
        x: coord.center.x,
        y: coord.center.y,
        r: coord.circleRadius * coord.innerRadius, // 全半径
        r0: coord.circleRadius * coord.innerRadius,
        fill: '#000',
        opacity: 0.15,
      },
    })
  })

  return (
    <div>
      <div className={style.pieDiv}>
        <canvas
          id="container"
          style={{display: total > 0 ? 'block' : 'none'}}
        />
        <h1>{total > 0 ? '应发绩效' : ''}</h1>
      </div>
    </div>
  )
}

function AmountTrendItem({data}) {
  let {year, month, meritStasPays: trendData = []} = data
  if (trendData == null) {
    trendData = [
      {
        stasDate: month ? year + '.' + month : year,
        totalShouldPayAmount: 0,
      },
    ]
  }

  useEffect(() => {
    const chart = new F2.Chart({
      id: 'container1',
      pixelRatio: window.devicePixelRatio,
    })

    chart.source(trendData, {
      totalShouldPayAmount: {
        tickCount: 5,
        min: 0,
      },
      stasDate: {
        range: [0, 1],
        tickCount: trendData.length > 10 ? 6 : 12,
      },
    })
    chart.tooltip({
      showCrosshairs: true,
      showItemMarker: false,
      onShow: function onShow(ev) {
        const items = ev.items
        items[0].name = items[0].title
        items[0].value = '¥ ' + items[0].value
      },
    })

    chart.axis('stasDate', {
      label: function label(text, index, total) {
        const textCfg = {text: Number(text.substring(5))+'月'}
        if (index === 0) {
          textCfg.textAlign = 'left'
        } else if (index === total - 1) {
          textCfg.textAlign = 'right'
        }
        return textCfg
      },
    })
    chart.line().position('stasDate*totalShouldPayAmount')
    chart.point().position('stasDate*totalShouldPayAmount').style({
      stroke: '#fff',
      lineWidth: 1,
    })

    chart.render()
  })
  return (
    <div className={style.amountTrendDiv}>
      <h3>{month ? '近6个月' : year + '年'}应发绩效统计</h3>
      <div>
        <canvas id="container1" />
      </div>
    </div>
  )
}

body.getInitialProps = async ({
  ctx: {
    query: {sessionId},
  },
}) => {
  try {
    const {
      data: {code, data} = {code: -1, data: {}},
    } = await fetch('bank.api.read.standard.busistasreadservice.meritstas', [
      {sessionId, searchDate: ''},
    ])

    console.log('我的绩效', data)

    if (code === 0) {
      return {initData: data}
    }
    return {initData: {}}
  } catch (err) {
    console.log(err)
    return {initData: {}}
  }
}

export default body
