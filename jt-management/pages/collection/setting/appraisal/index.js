import React, {useEffect, useState} from 'react'
import {Layout} from '~/components/Layout'
import {Card, Space, Steps, Radio, Empty, Button} from 'antd'
import SettingForm from '~/components/pages/collection/setting/appraisal/SettingForm'
import api from '~/api/collection'

const breadcrumbs = [
  {text: '贷后管理'},
  {text: '催收管理设置'},
  {text: '催收绩效考核设置'},
]

const getProData = async () => {
  let {
    data: {code, data},
  } = await api.get_data_dict('COLLECTION_PRODUCT')
  return code == 0 ? data : []
}

function body(props) {
  const [selectItem, setSelectItem] = useState(0)
  const [data] = useState(props.data)

  const onChangePro = (e) => {
    setSelectItem(e.target.value)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card>
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
                  {props.data.map((v, i) => {
                    return (
                      <Radio.Button value={i} key={i}>
                        {v.description}
                      </Radio.Button>
                    )
                  })}
                </Radio.Group>
              </Space>
            }
          />
          <Steps.Step
            title="绩效考核设置"
            status="process"
            description={
              <SettingForm
                productId={
                  (props.data.length > 0 && props.data[selectItem].code) || ''
                }
              />
            }
          />
        </Steps>
      </Card>
    </Layout>
  )
}

body.getInitialProps = async () => {
  let data = await getProData()
  return {data}
}

export default body
