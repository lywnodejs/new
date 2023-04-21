import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, Button} from 'antd'
import TableList from './TableList'
import apiMechanism from '~/api/mechanism'
import Router, {withRouter} from 'next/router'

const breadcrumbs = [{text: '合作机构'}, {text: '合作机构列表'}]

let values = {}
function body(props) {
  const [list, setList] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await apiMechanism.get_mechanism_list({...values})
        if (code == 0) {
          setList(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <TableList
          {...{
            list,
          }}
        />
      </Space>
    </Layout>
  )
}

export default withRouter(body)
