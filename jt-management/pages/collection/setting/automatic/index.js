import React, {useEffect, useState} from 'react'
import {Layout} from '~/components/Layout'
import {Card, Space, Steps, Radio, Empty, Button} from 'antd'
import TableList from '~/components/pages/collection/setting/automatic/TableList'
import api from '~/api/collection'

const breadcrumbs = [
  {text: '贷后管理'},
  {text: '催收管理设置'},
  {text: '催收自动分案设置'},
]

const getProData = async () => {
  let {
    data: {code, data},
  } = await api.get_data_dict('COLLECTION_PRODUCT')
  return code == 0 ? data : []
}

const getLevelDictData = async () => {
  let {
    data: {code, data},
  } = await api.get_data_dict('COLLECTION_LEVEL')
  return code == 0 ? data : []
}

const getLevelData = async (productId) => {
  let {
    data: {code, data},
  } = await api.getProdutLevelConfig(productId)
  return code == 0 ? data : []
}

function body(props) {
  const [selectItem, setSelectItem] = useState(0)
  const [levelData, setLevelData] = useState([])

  useEffect(() => {
    if (Array.isArray(props.data) && props.data.length > 0) {
      changeLevelData(props.data[0].code)
    }
  }, [])

  const changeLevelData = async (productId) => {
    let data = await getLevelData(productId)
    let res = []

    if (Array.isArray(data)) {
      data.forEach((v) => {
        let item = props.levelDictData.find(
          (dict) => dict.description == v.collectionLevel,
        )
        if (item) {
          res.push(item)
        }
      })
    }
    setLevelData(res)
  }

  const onChangePro = (e) => {
    setSelectItem(e.target.value)
    changeLevelData(props.data[e.target.value].code)
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
            title="设置自动分案"
            status="process"
            description={
              <TableList
                collectionProducts={props.data}
                levelData={levelData}
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
  let levelDictData = await getLevelDictData()
  return {data, levelDictData}
}

export default body
