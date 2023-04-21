import {Space, Button, Modal, message} from 'antd'
import EditAttr from './EditAttr'
import {useState, useRef, useEffect} from 'react'
import api from '~/utils/api'
import Router from 'next/router'

export default function (props) {
  const EditEl = useRef(null)

  const [proInfo, setProInfo] = useState(null)
  const [proType, setProTypeDict] = useState(null)

  useEffect(() => {
    if (props.productId) {
      getProInfo()
      getProTypeDict()
    }
  }, [props.productId])

  const getProInfo = async () => {
    let {
      data: {code, data},
    } = await api.getProductDetail(props.productId)
    if (code == 0) {
      setProInfo(data)
    }
  }

  const getProTypeDict = async () => {
    let {
      data: {code, data},
    } = await api.getDictMap('PRODUCT_TYPE')
    if (code == 0) {
      setProTypeDict(data)
    }
  }

  const exportTemp = () => {
    if (proInfo.onlineStatus == 1) {
      return message.error('产品处于在线状态时不可编辑属性，请先做下线操作')
    }
    let item = proType.find((v) => v.value == proInfo.productType)

    if (item) {
      Modal.confirm({
        content: `请确认是否导入【${item.valueName}】的属性模板？若已添加产品属性，将被清空。`,
        onOk() {
          api.importTemplate4pro(props.productId).then(({data: {code}}) => {
            if (code == 0) {
              message.success('导入成功')
              if (props.page == 'add') {
                Router.replace(
                  `/operation/product/attrs-list?productId=${props.productId}`,
                )
              } else {
                props.reloadData()
              }
            }
          })
        },
      })
    } else {
      message.warning('系统异常')
    }
  }

  return (
    <>
      <Space>
        <Button type="primary" onClick={exportTemp}>
          导入模板
        </Button>
        <Button type="primary" onClick={props.onAdd}>
          新增属性
        </Button>
      </Space>
    </>
  )
}
