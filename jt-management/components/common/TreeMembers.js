import React from 'react'
import {TreeSelect} from 'antd'
import {useEffect, useState} from 'react'
import useTransvertMembers from './useTransvertMembers'
const {SHOW_PARENT} = TreeSelect

const TreeMembers = (props) => {
  const {
    onSetPids,
    onSetAccountIds,
    onSetAccountNames,
    onSetCompanyIds,
    isTreeCheckable,
    defaultValue,
    isCollection,
  } = props
  const [treeData, setTreeData] = useState([])
  const [value, setValue] = useState(undefined)
  let data = useTransvertMembers()

  useEffect(() => {
    async function fetchData() {
      setTreeData(data)
      if (defaultValue != undefined) {
        const accountName = findAccountNameById(data[0])
        setValue(accountName)
      }
    }
    Array.isArray(data) && data.length && fetchData()
  }, [data, defaultValue])

  const findAccountNameById = (data) => {
    let accountName
    try {
      const findAccountNameInAll = (data) => {
        if (data.id == defaultValue) {
          throw data.accountName
        }

        if (Array.isArray(data.children) && data.children.length) {
          for (var i = 0; i < data.children.length; i++) {
            if (data.children[i].id == defaultValue) {
              throw data.children[i].accountName
            }
            findAccountNameInAll(data.children[i])
          }
        }
      }
      findAccountNameInAll(data)
    } catch (res) {
      accountName = res
    }

    return accountName
  }

  const onChange = (value, label, extra) => {
    setValue(value)
    if (isTreeCheckable == false) {
      if (isCollection) {
        return onSetAccountIds(value)
      }
      if (!extra || !extra.triggerNode) {
        onSetAccountIds('')
        return
      }
      typeof onSetAccountIds === 'function' &&
        onSetAccountIds(extra.triggerNode.props.id)
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
          console.log(one)
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
      console.log(commitDatas)
      // return
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
      width: 150,
    },
    dropdownStyle: {
      // width: 'auto',
      minWidth: 320,
    },
  }

  return <TreeSelect {...tProps} />
}

export default TreeMembers
