import {Layout} from '~/components/Layout'
import React, {useState, useCallback, useRef, useEffect} from 'react'
import fetch from '~/utils/fetch'
import AttrsTit from '~/components/pages/operation/product/AttrsTit'
import {Card, message} from 'antd'
import api from '~/utils/api'
import EditAttr from '~/components/pages/operation/product/EditAttr'
import Router from 'next/router'
const breadcrumbs = [{text: '运营配置'}, {text: '产品管理'}, {text: '添加属性'}]

const getAttrs = async (productId) => {
  let {
    data: {code, data},
  } = await api.getAttrsCategory({productId: -1, productType: null})
  if (code == 0) {
    return data
  }
  return []
}
function body(props) {
  const EditEl = useRef(null)

  const onAdd = () => {
    EditEl.current.changeVisible(true)
  }

  const setAttrData = async (attrData) => {
    let params = {
      ...attrData,
      productId: props.productId,
    }

    let {
      data: {code, data},
    } = await api.changeAttr(params)
    if (code == 0) {
      message.success('添加成功')
      EditEl.current.cancelModal(false)
      Router.replace(
        `/operation/product/attrs-list?productId=${params.productId}`,
      )
    } else {
      EditEl.current.changeLoading(false)
    }
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card>
        <AttrsTit page="add" productId={props.productId} onAdd={onAdd} />
      </Card>

      <EditAttr
        attrs={props.attrs}
        setAttrData={setAttrData}
        data={null}
        ref={EditEl}
        linkageAttrs={props.linkageAttrs}
      />
    </Layout>
  )
}

body.getInitialProps = async (params) => {
  const productId = params.ctx.query.productId
  const attrs = await getAttrs(productId)
  let initData = {
    data: null,
    linkageAttrs: null,
    productId,
    attrs,
  }
  if (productId) {
    let {
      data: {code, data},
    } = await api.getLinkageByProId(productId)
    if (code == 0) {
      initData.linkageAttrs = data || []
    }
  }

  return initData
}

export default body
