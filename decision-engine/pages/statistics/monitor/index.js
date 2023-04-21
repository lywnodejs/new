import {Layout} from '~/components/Layout'
import {
  message,
  Card,
  Row,
  Col,
  Tooltip as TooltipAnt,
  Progress,
  Select,
} from 'antd'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  ResponsiveContainer,
} from 'recharts'
import {useEffect, useState} from 'react'
import api from '~/api/statistics'
const breadcrumbs = [{text: '统计分析'}, {text: '调用监控'}]

function body() {
  const [dateTabs, setDateTabs] = useState([])
  const [totalData, setTotalData] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await api.get_monitoring_info()
        if (code == 0 && data) {
          setTotalData(data)
          setDateTabs(data.map((item) => 0))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const activeTab = (index, val) => {
    if (dateTabs[index] == val) {
      return
    }
    setDateTabs((dateTabs) => {
      dateTabs[index] = val
      return [...dateTabs]
    })
  }

  return (
    <Layout isGray={true} breadcrumbs={breadcrumbs}>
      {totalData.map((item, index) => (
        <Card
          title={`${item.productName}`}
          style={{width: '100%', marginTop: '0px'}}
          bodyStyle={{padding: '24px 24px 10px'}}
          headStyle={{
            fontWeight: 'bold',
          }}
        >
          <h4
            style={{
              position: 'relative',
              marginTop: '20px',
              fontWeight: 'bold',
            }}
          >
            调用数
            <span>（次）</span>
            <p
              className="dateSwitch"
              style={{position: 'absolute', right: '43px', top: 0}}
            >
              <a
                className={dateTabs[index] == 0 ? 'active' : ''}
                onClick={() => {
                  activeTab(index, 0)
                }}
              >
                分钟
              </a>
              <a
                className={dateTabs[index] == 1 ? 'active' : ''}
                onClick={() => {
                  activeTab(index, 1)
                }}
              >
                小时
              </a>
            </p>
          </h4>
          <ResponsiveContainer height={360}>
            <ComposedChart
              data={
                dateTabs[index] == 1
                  ? item.callListForHour
                  : item.callListForMin
              }
            >
              <XAxis dataKey="statScale" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Line
                type="monotone"
                dataKey="callCountAll"
                stroke="#1890ff"
                name="总调用数"
              />
              <Line
                type="monotone"
                dataKey="failcount"
                stroke="#d9001b"
                name="调用失败数"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      ))}
    </Layout>
  )
}

export default body
