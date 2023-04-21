import React, {useState, useEffect} from 'react'
import {Form, Select} from 'antd'
import api from '~/utils/api'

const DataSourceSelect = (props) => {
  const [source, setSource] = useState([])
  const [product, setProduct] = useState([])
  const [isInit, setIsInit] = useState(false)
  useEffect(() => {
    getSourceData()
  }, [])

  useEffect(() => {
    if (isInit) {
      let params = {}
      if (Array.isArray(source) && source.length > 0) {
        params.companyId = source[0].id
      }
      if (Array.isArray(product) && product.length > 0) {
        params.dataProductId = product[0].id
      }
      if (props.isAllPro) {
        params.dataProductId = null
      }
      if (props.isAllData) {
        params.companyId = null
      }
      props.init(params, isInit)
    }
  }, [isInit])

  const changeCompany = (companyId, e) => {
    getProductData(e.children)
  }

  const getSourceData = async () => {
    let data = await api.getDS4select()
    setSource(data)
    if (data.length > 0) {
      getProductData(data[0].companyName, true)
    }
  }

  const getProductData = async (companyName, isInit) => {
    if (!companyName) {
      return
    }
    let data = await api.getProduct4select(companyName)

    if (!(isInit && props.isAllData)) {
      if (props.isAllPro) {
        data = [{name: '全部', id: null}, ...data]
      }
      setProduct(data)
    }

    if (isInit) {
      setIsInit(isInit)
      if (props.isAllPro) {
        setProduct([{name: '全部', id: null}])
      }
    } else {
      props.init({dataProductId: (data && data[0] && data[0].id) || null})
      // if (Array.isArray(data) && data.length > 0 && !props.isAllPro) {
      //   props.init({dataProductId: data[0].id})
      // }
    }
  }

  return (
    <React.Fragment>
      <Form.Item label="数据源名称" name="companyId">
        <Select style={{width: 150}} onChange={changeCompany} virtual={false}>
          {props.isAllData && (
            <Select.Option value={null} key={-1}>
              全部
            </Select.Option>
          )}
          {source.map((v) => {
            return (
              <Select.Option value={v.id} key={v.id}>
                {v.companyName}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>

      <Form.Item label="数据产品名称" name="dataProductId">
        <Select style={{width: 150}} virtual={false}>
          {/* {props.isAllPro && (
            <Select.Option value={null} key={-1}>
              全部
            </Select.Option>
          )} */}
          {product.map((v) => {
            return (
              <Select.Option value={v.id} key={v.id}>
                {v.name}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>
    </React.Fragment>
  )
}

export default DataSourceSelect
