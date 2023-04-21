import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, Form, Button, Card} from 'antd'
import Router from 'next/router'
import {useCookies} from 'react-cookie'
import api from '~/api/product'

import TableList from './TableList'

const breadcrumbs = [{text: '产品管理'}, {text: '信贷产品'}]

function body(props) {
  const [cookies] = useCookies(['tenantId'])

  const [list, setList] = useState([])

  useEffect(() => {
    async function fetchData() {
      fetchList()
    }
    fetchData()
  }, [])

  const fetchList = async () => {
    try {
      const {
        data: {data, code},
      } = await api.get_products({tenantId: cookies.tenantId})
      if (code === 0) {
        data.forEach((item) => {
          item.status = 1
        })
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onAdd = () => {
    let url = `/product/information/detail?id=new`
    Router.push(url)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card style={{marginBottom: 30}}>
        <Form>
          <Button type="primary" onClick={onAdd}>
            新增
          </Button>
        </Form>
      </Card>

      <TableList
        {...{
          list,
          setList,
        }}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
