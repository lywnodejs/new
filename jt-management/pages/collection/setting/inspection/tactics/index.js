import React, {useEffect, useState} from 'react'
import {Layout} from '~/components/Layout'
import {Card, Space, Steps, Radio, Empty, message} from 'antd'
import SettingForm from '~/components/pages/collection/setting/inspection/tactics/SettingForm'
import api from '~/api/collection'

const breadcrumbs = [
  {text: '风险预警管理'},
  {text: '人工检查配置'},
  {text: '人工检查策略配置'},
]

const getData = async () => {
  let {
    data: {code, data},
  } = await api.getLoanAfterConfig()
  return code == 0 ? data : {}
}

function body(props) {
  const [selectItem, setSelectItem] = useState(0)
  const [isNull, setIsNull] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    if (Array.isArray(props.data) && props.data.length > 0) {
      setData(props.data)
      setSelectItem(0)
    } else {
      setIsNull(true)
    }
  }, [])

  const onChangePro = (e) => {
    setSelectItem(e.target.value)
  }

  const saveSetting = (params) => {
    let r_params = {
      ...data[selectItem],
      ...params,
    }
    api.updateLoanAfterConfig(r_params).then(({data: {code}}) => {
      if (code == 0) {
        message.success('修改成功')
        let n_data = [...data]
        n_data[selectItem] = r_params
        setData(n_data)
      }
    })
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card>
        {isNull ? (
          <Empty
            style={{
              margin: '50px 0',
            }}
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 60,
            }}
            description={'未配置信贷产品'}
          >
            {/* <Button type="primary">去配置</Button> */}
          </Empty>
        ) : (
          <Steps direction="vertical">
            <Steps.Step
              title="选择贷款产品"
              status="process"
              description={
                <Space
                  align="center"
                  style={{
                    margin: '30px 0',
                  }}
                >
                  <span>信贷产品：</span>

                  <Radio.Group value={selectItem} onChange={onChangePro}>
                    {data.map((v, i) => {
                      return (
                        <Radio.Button value={i} key={i}>
                          {v.productName}
                        </Radio.Button>
                      )
                    })}
                  </Radio.Group>
                </Space>
              }
            />
            <Steps.Step
              title="配置产品检查策略"
              status="process"
              description={
                <SettingForm
                  data={data[selectItem]}
                  saveSetting={saveSetting}
                />
              }
            />
          </Steps>
        )}
      </Card>
    </Layout>
  )
}

body.getInitialProps = async () => {
  let data = await getData()
  return {data}
}

export default body
