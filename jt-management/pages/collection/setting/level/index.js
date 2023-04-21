import React, {useEffect, useState} from 'react'
import {Layout} from '~/components/Layout'
import {Card, Space, Steps, Radio, Empty} from 'antd'
import TableList from '~/components/pages/collection/setting/level/TableList'
import api from '~/api/collection'

const breadcrumbs = [
  {text: '贷后管理'},
  {text: '催收管理设置'},
  {text: '催收级别设置'},
]

const getProData = async () => {
  let {
    data: {code, data},
  } = await api.get_data_dict('COLLECTION_PRODUCT')
  return code == 0 ? data : []
}

const getLevelData = async () => {
  let {
    data: {code, data},
  } = await api.get_data_dict('COLLECTION_LEVEL')
  return code == 0 ? data : []
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
                          {v.description}
                        </Radio.Button>
                      )
                    })}
                  </Radio.Group>
                </Space>
              }
            />
            <Steps.Step
              title="设置催收级别"
              status="process"
              description={
                <TableList
                  collectionProducts={data}
                  levelData={props.levelData}
                  productId={(data.length > 0 && data[selectItem].code) || ''}
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
  let data = await getProData()
  let levelData = await getLevelData()
  return {data, levelData}
}

export default body
