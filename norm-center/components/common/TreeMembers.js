import React from 'react'
import {TreeSelect} from 'antd'
import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import api from '~/api/collection'
const {SHOW_PARENT} = TreeSelect

const TreeMembers = (props) => {
  const {
    onSetPids,
    onSetAccountIds,
    onSetAccountNames,
    onSetCompanyIds,
    isTreeCheckable,
  } = props
  const [cookies] = useCookies(['sessionId'])
  const [treeData, setTreeData] = useState([])
  const [value, setValue] = useState(undefined)

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

  const onChange = (value, label, extra) => {
    setValue(value)
    if (isTreeCheckable == false) {
      typeof onSetAccountIds === 'function' && onSetAccountIds(value)
      return
    }
    const allCheckedNodes = extra.allCheckedNodes
    if (allCheckedNodes.length) {
      const commitDatas = {
        pids: [],
        accountNames: [],
        trueNames: [],
        companyIds: [],
      }

      function tranverseAllCheckedNodes(nodes) {
        nodes.forEach((one) => {
          const {children} = one.props
          for (let key in commitDatas) {
            commitDatas[key].push(one.props[key.slice(0, key.length - 1)])
          }
          if (children.length) {
            tranverseAllCheckedNodes(children)
          }
        })
      }

      tranverseAllCheckedNodes(allCheckedNodes)

      const {pids, accountNames, trueNames, companyIds} = commitDatas
      typeof onSetPids === 'function' && onSetPids(pids)
      typeof onSetAccountIds === 'function' && onSetAccountIds(accountNames)
      typeof onSetAccountNames === 'function' && onSetAccountNames(trueNames)
      typeof onSetCompanyIds === 'function' && onSetCompanyIds(companyIds)
    }
  }

  const tProps = {
    treeData,
    allowClear: true,
    value: value,
    onChange: onChange,
    treeCheckable: isTreeCheckable != undefined ? isTreeCheckable : true,
    treeCheckStrictly: isTreeCheckable != undefined ? isTreeCheckable : true,
    treeDefaultExpandAll: true,
    showArrow: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: '请选择',
    style: {
      width: '320px',
    },
  }

  return <TreeSelect {...tProps} />
}

export default TreeMembers
