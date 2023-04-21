import {Card, Space, Button} from 'antd'
import {CheckCircleFilled} from '@ant-design/icons'
import {useContext, useEffect, useState} from 'react'
import {BaseAddContext} from '../index'
import Router from 'next/router'
import fetch from '~/utils/fetch'

export default function Step3() {
  const context = useContext(BaseAddContext)
  const [json, setJson] = useState({})
  useEffect(() => {
    const datasourceId = context.selectedItem.item.id
    const datasourceType = context.selectedItem.dataSourceType
    getData({datasourceType, datasourceId})
  }, [])

  const getData = async (params) => {
    let {
      data: {code, data},
    } = await fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.geteditsuccessresult',
      [params],
    )
    if (code == 0) {
      setJson(data)
    }
  }

  return (
    <Card style={{textAlign: 'center'}}>
      <CheckCircleFilled style={{fontSize: 50, color: '#52c41a'}} />
      <h3 style={{fontWeight: 'bold', margin: '15px auto'}}>操作成功</h3>
      <p>
        本次完成 <span style={{fontWeight: 'bold'}}>{json.indicatorCount}</span>{' '}
        个指标加工
      </p>
      <ul
        style={{
          width: '60%',
          margin: '15px auto',
          backgroundColor: '#fbfbfb',
          height: '350px',
          overflow: 'auto',
          borderRadius: '5px',
          listStyle: 'none',
          lineHeight: 2,
          padding: '20px 0',
        }}
      >
        {json.groupNameAndCounts &&
          json.groupNameAndCounts.map((v) => {
            return (
              <li style={{height: '45px', lineHeight: '45px'}}>
                {v.key}：{v.value} 个
              </li>
            )
          })}
      </ul>
      <Space size={30}>
        <Button
          type="primary"
          onClick={() => {
            location.replace('/norm/base')
          }}
        >
          返回
        </Button>
        <Button
          onClick={() => {
            location.replace('/norm/derivative')
          }}
        >
          继续，指标衍生
        </Button>
      </Space>
    </Card>
  )
}
