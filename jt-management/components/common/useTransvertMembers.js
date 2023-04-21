import React, {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import api from '~/api/collection'

const useTransvertMembers = () => {
  const [cookies] = useCookies(['sessionId'])
  const [treeData, setTreeData] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await api.getTreeMemberList({authToken: cookies.sessionId})
        if (code == 0) {
          tansvertKey(data)
          tansvertChildrenKey(data)
          setTreeData([data])
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const tansvertKey = (mem) => {
    setCommonKey(mem)
    mem.children = mem.children && mem.children.length ? mem.children : []
  }

  const setCommonKey = (one) => {
    one.title = `${one.trueName}_${one.roleName}`
    one.value = `${one.accountName}`
    one.key = String(one.accountName)
    one.token = one.authToken
  }

  const tansvertChildrenKey = (mem) => {
    if (Array.isArray(mem.children)) {
      for (let i = 0; i < mem.children.length; i++) {
        let one = mem.children[i]
        setCommonKey(one)

        if (one.children && one.children.length) {
          tansvertChildrenKey(one)
        }
      }
    }
  }

  return treeData
}

export default useTransvertMembers
