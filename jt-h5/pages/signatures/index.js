import Head from 'next/head'
import {fetch} from '~/utils/fetch'
import React, {useEffect, useState} from 'react'
import {List, Result, Icon} from 'antd-mobile'
import Empty from '../../public/image/empty.png'

function body({data}) {
  const [list, setList] = useState([])
  useEffect(() => {
    if (data) {
      if (Array.isArray(data.mySignatures) && data.mySignatures.length !== 0) {
        setList(data.mySignatures)
      }
    }
  }, [data])
  const clickitem = (item) => {
    window.open(item.targetUrl)
  }

  return (
    <div>
      <Head>
        <title>我的合同</title>
      </Head>
      {list.length !== 0 && (
        <List>
          {list.map((item, index) => {
            return (
              <List.Item
                arrow={'horizontal'}
                key={index}
                onClick={() => {
                  clickitem(item)
                }}
              >
                <div
                  style={{
                    lineHeight: '40px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.name}
                </div>
              </List.Item>
            )
          })}
        </List>
      )}

      {list.length === 0 && (
        <Result
          img={<img style={{width: '40px'}} src={Empty} />}
          title="暂无合同"
          // message=""
        />
      )}
    </div>
  )
}

body.getInitialProps = async ({
  ctx: {
    query: {sessionId},
  },
}) => {
  // console.log({ data:{sessionId, mobilePhone}})
  try {
    const {
      data: {code, data} = {code: -1, data: {}},
    } = await fetch('bank.api.read.portalreadservice.mysignatures', [
      {sessionId},
    ])
    if (code === 0) {
      return {data}
    }
    return {}
  } catch (err) {
    console.log(err)
    return {}
  }
}

export default body
