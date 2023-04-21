import {Layout} from '~/components/Layout'
import {useEffect, useState} from 'react'
import {Card, message} from 'antd'
import apiAssets from '~/api/assets'

const breadcrumbs = [{text: '资产保全'}, {text: '导出记录'}]
import TableList from './TableList'
const pageParams = {
  pageNum: 1,
  pageSize: 10,
}
let values = {}

function body(props) {
  const [list, setList] = useState([])
  const [totalData, setTotalData] = useState([])

  useEffect(() => {
    exportRecord()
  }, [])
  const exportRecord = async () => {
    try {
      const {
        data: {data, code},
      } = await apiAssets.fetch_record_deduction({...pageParams, type: 1})
      if (code == 0) {
        setList(data.list)
        setTotalData(data.totalSize)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onPage = async () => {
    exportRecord(values)
  }

  const downloadList = async (item) => {
    try {
      const {
        data: {data, code},
      } = await apiAssets.fetch_export_downLoad({
        fileLogId: item.id,
      })
      if (code == 0) {
        message.success('下载成功')
        window.open(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Layout isGray={true} breadcrumbs={breadcrumbs}>
      <Card>
        <TableList
          {...{
            list,
            onPage,
            pageParams,
            totalData,
            downloadList,
          }}
        />
      </Card>
    </Layout>
  )
}
body.getInitialProps = async () => {
  return {}
}

export default body
