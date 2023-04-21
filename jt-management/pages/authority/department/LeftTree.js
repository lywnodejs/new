import React, {useEffect, useImperativeHandle, useState} from 'react'
import {Tree, Input, List} from 'antd'
import {CaretDownOutlined, ContactsFilled} from '@ant-design/icons'
import styles from './idnex.less'

export default function (props) {
  const [searchData, setSearchData] = useState([])
  const [selected, setSelected] = useState(null)
  const [treeData, setTreeData] = useState(null)

  useEffect(() => {
    setTreeData(props.data)
  }, [props.data])

  useEffect(() => {
    if (selected) {
      changeSelect(treeData)
    } else if (Array.isArray(treeData) && treeData.length > 0) {
      onSelect(undefined, {node: treeData[0]})
    }
  }, [treeData])

  const changeSelect = (data) => {
    let selectNode = null
    const findNode = (tree) => {
      tree.forEach((v) => {
        if (v.key == selected) {
          selectNode = v
        } else if (Array.isArray(v.children)) {
          findNode(v.children)
        }
      })
    }
    findNode(data)
    console.log('selectNode', {node: selectNode})
    onSelect(undefined, {node: selectNode})
  }

  const onSelect = (selectedKeys, info) => {
    // console.log('selected', selectedKeys, info);
    // const parents = parentKeys(info.node.key)
    const parents = getParentNodes(info.node.key)
    setSelected(info.node.key)
    let data = {
      parents,
      selectedItem: info.node,
    }
    // console.log('onSelect', data)
    props.onChangeSelect(data)
  }

  const findList = (key, pData = treeData, endData = []) => {
    pData.forEach((v) => {
      if (v.title.indexOf(key) > -1) {
        endData.push(v)
      }
      if (v.children && Array.isArray(v.children)) {
        findList(key, v.children, endData)
      }
    })
    return endData
  }

  let nodes = []
  function getParentNodes(id, tree = treeData) {
    _getParentNodes([], id, tree)
    return nodes
  }

  function _getParentNodes(his, targetId, tree) {
    tree.some((list) => {
      const children = list.children || []
      if (list.key === targetId) {
        nodes = his
        return true
      } else if (children.length > 0) {
        const history = [...his]
        history.push(list)
        return _getParentNodes(history, targetId, children)
      }
    })
  }

  const changeSearch = (e) => {
    e.persist()
    const value = e.target.value.trim()
    if (!value) {
      return setSearchData([])
    }
    let res = findList(value)
    let parents = []
    let res_arr = [...res]
    res.forEach((v) => {
      let p_arr = getParentNodes(v.id)
      p_arr.forEach((p_v) => {
        if (
          p_v.parentId != 0 &&
          parents.findIndex((pv) => pv.id == p_v.id) == -1
        ) {
          parents.push(p_v)
        }
      })
    })
    parents.forEach((p_v) => {
      if (res_arr.findIndex((rv) => rv.id == p_v.id) == -1) {
        res_arr.push(p_v)
      }
    })
    // console.log(res);
    // console.log('res_arr:', res_arr);
    setSearchData(res_arr)
  }

  const selectStyle = (key) => {
    return selected == key
      ? {
          backgroundColor: 'rgb(24, 144, 255, 0.75)',
          color: '#fff',
          cursor: 'pointer',
        }
      : {
          cursor: 'pointer',
        }
  }

  return (
    <div className={styles.leftBox}>
      <div
        style={{
          width: '90%',
          marginBottom: 20,
        }}
      >
        <Input placeholder="搜索" allowClear onChange={changeSearch} />
      </div>

      {searchData.length > 0 ? (
        <div
          style={{
            width: '90%',
            fontSize: 18,
          }}
        >
          <List
            header={<div>部门列表：</div>}
            footer={null}
            bordered
            dataSource={searchData}
            renderItem={(item) => (
              <List.Item
                style={selectStyle(item.key)}
                onClick={() => onSelect([], {node: item})}
              >
                <ContactsFilled style={{color: '#1890ff'}} /> {item.title}
              </List.Item>
            )}
          />
        </div>
      ) : Array.isArray(treeData) ? (
        <Tree
          style={{
            fontSize: 18,
            lineHeight: 2,
          }}
          className={styles.treeBox}
          showIcon
          switcherIcon={<CaretDownOutlined style={{fontSize: 18}} />}
          icon={<ContactsFilled style={{color: '#1890ff'}} />}
          selectedKeys={[selected]}
          defaultExpandedKeys={(treeData[0] && [treeData[0].key]) || []}
          onSelect={onSelect}
          treeData={treeData}
          titleRender={(data) => {
            return (
              <span
                style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  width: '200px',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {data.name}
              </span>
            )
          }}
        />
      ) : null}
    </div>
  )
}
