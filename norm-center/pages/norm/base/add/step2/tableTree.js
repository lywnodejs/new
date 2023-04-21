import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
} from 'react'
import {Tree, Input} from 'antd'
import {CarryOutOutlined, FormOutlined} from '@ant-design/icons'

import styles from './index.less'
function TableTree(props, ref) {
  let [tabels, setTabels] = useState([])
  let [selectedKeys, setSelectedKeys] = useState([])
  let [selectKeys] = useState([])
  let [defaultKey, setDefaultKey] = useState([])
  let [searchValue, setSearchValue] = useState('')
  useEffect(() => {
    if (props.data) {
      let selectedConfig = props.selecteds || []
      let obj = {
        title: props.data.dbname,
        children: props.data.tables,
        key: props.data.dbname,
        keyName: props.data.dbname,
      }
      let result = [obj]

      setDefaultKey([obj.key])
      obj.children.forEach((item, index) => {
        item.keyName = obj.key + '.' + item.tableName
        item.children = Array.isArray(item.columns) ? item.columns : []
        item.key = obj.key + '.' + item.tableName
        item.title = item.tableName

        if (Array.isArray(item.columns)) {
          item.children.forEach((table) => {
            table.title = table.columnName
            table.keyName = item.keyName + '.' + table.columnName
            table.key = item.key + '.' + table.columnName

            let column = selectedConfig.find((v) => v.columnPath == table.key)
            if (column) {
              setSelectedKeys([...selectedKeys, table.key])
              setDefaultKey([...defaultKey, item.key])
            }
          })
        }
      })
      if (props.initSelectData) {
        props.initSelectData()
      }

      setTabels(result)
    }
  }, [props.data, props.selecteds])

  useEffect(() => {}, [props.selecteds])
  useImperativeHandle(ref, () => {
    let methods = {
      deleteAll: () => {},
      deleteKey: (item, index) => {
        const i = selectedKeys.findIndex((v) => v == item.keyExp)
        selectedKeys.splice(i, 1)
        setSelectedKeys([...selectedKeys])
      },
    }
    return methods
  })

  const onSelect = (selectedKey, info) => {
    let values = [...selectedKey]
    let {key, remark, children} = info.node

    const index = values.indexOf(key)
    if (!Array.isArray(children)) {
      if (index === -1) {
        values.push(key)
      } else {
        // console.log(info.node.columnName)
        changeSelect({
          keyExp: key,
          keyExpSuccess: key,
          remark,
          name: info.node.columnName,
        })
      }
    } else {
      if (props.clickParent) {
        let arr = info.node.key.split('.')
        props.clickParent(arr[arr.length - 1])
      }
      console.log(info)
      values.splice(index, 1)
    }
    if (props.simple) {
      setSelectedKeys([key])
    } else {
      setSelectedKeys(values)
    }
  }

  const changeSelect = (item) => {
    if (typeof props.changeSelect === 'function') {
      props.changeSelect(item)
    }
  }

  const onSearch = (value) => {
    setSearchValue(value)
  }

  const loop = (data) =>
    data.map((item) => {
      const index = item.title.indexOf(searchValue)
      const title = (
        <span
          className={
            index > -1 && searchValue ? styles.siteTreeSearchValue : ''
          }
        >
          {item.title}
        </span>
      )

      if (item.children) {
        return {title, key: item.key, children: loop(item.children)}
      }

      return {
        ...item,
        title,
      }
    })

  return (
    <React.Fragment>
      <Input.Search
        style={{marginBottom: 8, width: '95%'}}
        enterButton="搜索"
        onSearch={onSearch}
      />
      {Array.isArray(tabels) && tabels.length > 0 && (
        <Tree
          multiple
          showLine={true}
          showIcon={true}
          autoExpandParent
          defaultExpandedKeys={defaultKey}
          selectedKeys={selectedKeys}
          onSelect={onSelect}
          treeData={loop(tabels)}
        />
      )}
    </React.Fragment>
  )
}

export default React.forwardRef(TableTree)
