import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {message, Form, Button, Tabs, Row, List, Input, Select} from 'antd'
import {useCookies} from 'react-cookie'
import apiProduct from '~/api/product'
import api from '~/api/risk'

const {TabPane} = Tabs
const breadcrumbs = [{text: '决策分流配置'}]

function body(props) {
  const [cookies] = useCookies(['tenantId'])
  const [activeKey, setActiveKey] = useState('-1')
  const [productList, setProductList] = useState([])
  const [list, setList] = useState([])
  const [flowList, setFlowList] = useState([])

  useEffect(() => {
    function fetchData() {
      fetchProductList()
      fetchFlowList()
    }
    fetchData()
  }, [])

  useEffect(() => {
    function fetchData() {
      if (activeKey != -1) {
        fetchFlowList()
        fetchDeploylist()
      }
    }
    fetchData()
  }, [activeKey])

  const fetchProductList = async () => {
    try {
      const {
        data: {data, code},
      } = await apiProduct.get_products()
      if (code == 0) {
        setProductList(data)
        data && data.length && setActiveKey(String(data[0].produceId))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchFlowList = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_risk_flowlist({
        pageNo: 1,
        pageSize: 1000,
        keyword: '',
        useStatus: null,
        productId: activeKey,
      })
      if (code === 0) {
        // console.log(data);
        setFlowList(data.list)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchDeploylist = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_risk_deploylist({
        productId: activeKey,
      })
      if (code == 0) {
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < 5; j++) {
            if (!data[i].data[j]) {
              data[i].data[j] = {
                flowGroup: null,
                flowId: null,
                flowName: null,
                flowVersion: null,
                id: null,
                rate: null,
              }
            }
          }
        }
        let deployList = [
          {
            flowTypeDesc: '序号',
            data: [1, 2, 3, 4, 5],
          },
          {
            flowTypeDesc: '分流比例',
            data: data[0].data,
          },
          ...data,
          {
            flowTypeDesc: '',
            data: [1, 2, 3, 4, 5],
          },
        ]

        setList(deployList)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onClear = (rIndex) => {
    list.forEach((item, index) => {
      if (index != 0 && index != 4) {
        item.data[rIndex] = {
          flowGroup: null,
          flowId: null,
          flowName: null,
          flowVersion: null,
          id: null,
          rate: null,
        }
      }
    })
    setList([...list])
  }

  const changeTab = async (key) => {
    setActiveKey(key)
  }

  const validateInAllList = (cb, total) => {
    for (let i = 2; i < list.length; i++) {
      if (Array.isArray(list[i].data) && list[i].data.length) {
        for (let j = 0; j < list[i].data.length; j++) {
          if (list[i].data[j].rate) {
            if (typeof cb === 'function') {
              total = cb(i, total, list[i].data[j].rate)
              continue
            }
            if (list[i].data[j].flowId == null) {
              return false
            }
          }
        }
      }
    }
    return total
  }
  const computeTotal = (i, total, rate) => {
    if (i == 2) {
      total = total + parseFloat(rate)
    }
    return total
  }
  const onSubmit = async () => {
    try {
      let total = 0
      total = validateInAllList(computeTotal, total)

      if (total != 100) {
        message.error('分流比例综合需=100%，请修改')
        return
      }

      if (!validateInAllList(null, true)) {
        message.error('请检查有未填项')
        return
      }
      let deepCopyList = JSON.parse(JSON.stringify(list))
      const postData = deepCopyList.slice(2, list.length)

      let postdata1 = postData.slice(0, postData.length - 1)
      let postdata2 = postdata1.map((it) => ({
        ...it,
        data: it.data.filter((item) => item.flowId && item.rate),
      }))
      const {
        data: {data, code},
      } = await api.save_risk_deploylist(postdata2)

      if (code == 0) {
        message.success('保存成功')
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const changeRate = (e, kindex) => {
    for (let i = 1; i < list.length - 1; i++) {
      if (Array.isArray(list[i].data) && list[i].data.length) {
        list[i].data[kindex].rate = e.target.value
      }
    }
    setList([...list])
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="searchForm" style={{marginBottom: '10px'}}>
        <Tabs activeKey={activeKey} onTabClick={(key) => changeTab(key, false)}>
          {productList && productList.length
            ? productList.map((item) => (
                <TabPane
                  tab={item.productName}
                  key={item.produceId}
                  forceRender={true}
                ></TabPane>
              ))
            : null}
        </Tabs>
        <List
          dataSource={list}
          renderItem={(item, index) => (
            <List.Item
              key={item.flowTypeDesc}
              style={{
                background: index == 0 ? '#f0f0f0' : '#fff',
                paddingLeft: '5px',
              }}
            >
              <div style={{width: '10%'}}>{item.flowTypeDesc}</div>
              {index == 0 &&
                item.data.map((one) => (
                  <div style={{width: '17%', marginRight: '1%'}}>{one}</div>
                ))}
              {index == 1 &&
                item.data.map((one, kindex) => (
                  <div style={{width: '17%', marginRight: '1%'}}>
                    <Input
                      value={one.rate}
                      style={{width: '90%', marginRight: '5px'}}
                      onChange={(e) => changeRate(e, kindex)}
                    />
                    %
                  </div>
                ))}
              {(index == 2 || index == 3) &&
                item.data.map((one) => (
                  <div style={{width: '17%', marginRight: '1%'}}>
                    <Select
                      style={{width: '90%', marginRight: '5px'}}
                      value={one.flowId}
                      onChange={(val) => {
                        one.flowId = val
                        setList([...list])
                      }}
                      allowClear
                    >
                      {flowList.map((v, i) => (
                        <Select.Option key={i.id} value={v.id}>
                          {v.flowName}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                ))}
              {index == 4 &&
                item.data.map((one, rIndex) => (
                  <div style={{width: '17%', marginRight: '1%'}}>
                    <Button onClick={() => onClear(rIndex)}>清除</Button>
                  </div>
                ))}
            </List.Item>
          )}
        ></List>
        <Row style={{marginTop: '10px'}}>
          <Button
            type="primary"
            htmlType="button"
            onClick={onSubmit}
            style={{marginLeft: '5px'}}
          >
            确定
          </Button>
        </Row>
      </div>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
