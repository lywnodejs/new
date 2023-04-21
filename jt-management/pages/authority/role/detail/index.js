import {Layout} from '~/components/Layout'
import React, {useEffect, useState, useRef} from 'react'
import {Card, Col, Row, Tree, message, Button} from 'antd'
import Router, {withRouter} from 'next/router'
import api from '~/api/authority'
const breadcrumbs = [{text: '权限管理'}, {text: '角色管理'}, {text: '权限配置'}]
// const fixTabs = [
//   '业务看板',
//   '产品管理',
//   '进件管理',
//   '风控管理',
//   '信审管理',
//   '贷后管理',
//   '营销管理',
//   '账务管理',
//   '协议管理',
//   '权限管理',
//   '系统设置管理',
// ]

function body(props) {
  const t = useRef()
  const [showLine, setShowLine] = useState(true)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [allBtnToPageMap, setAllBtnToPageMap] = useState([])
  const [parentIdMap, setParentIdMap] = useState([])
  const [fixTabs, setFixTabs] = useState([])
  const [resourceTypesMap, setResourceTypesMap] = useState([
    {
      type: 3,
      expandedKeys: [],
      checkedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
    },
    {
      type: 4,
      expandedKeys: [],
      checkedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
    },
  ])
  const [allList, setAllList] = useState([])
  const [leftList, setLeftList] = useState([])
  const [rightList, setRightList] = useState([])
  const [roleName, setRoleName] = useState([])

  useEffect(() => {
    function fetchData() {
      fetchRole()
      fetchList()
    }
    fetchData()
  }, [])

  const fetchRole = async () => {
    try {
      const {
        data: {data, code},
      } = await api.get_one_role(props.router.query.roleId)
      if (code === 0) {
        setRoleName(data.roleName)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const fetchList = async (values = {}) => {
    try {
      const {
        data: {data, code},
      } = await api.get_resource('get', {roleId: props.router.query.roleId})
      if (code === 0) {
        const list = [
          {
            id: 0,
            resourceType: 3,
            hasAuth: 1,
            parentResourceId: null,
            pageName: '互联网核心系统',
            children: data,
            key: '0',
            title: '互联网核心系统',
            disabled: true,
          },
        ]

        const names = data.map((v) => v.pageName)
        setFixTabs(names)

        addKeyAndTitleToChildren(list[0])
        let leftList = JSON.parse(JSON.stringify(list))

        handleAllCheckAndExpand(list)
        setAllList(list)
        delFromList(leftList)
        setResourceTypesMap([...resourceTypesMap])
        setAllBtnToPageMap([...allBtnToPageMap])
        setLeftList([...leftList])
      }
    } catch (err) {
      console.log(err)
    }
  }

  const addKeyAndTitleToChildren = (list) => {
    if (Array.isArray(list.children) && list.children.length) {
      list.children.forEach((one) => {
        one.key = String(one.id)
        one.title = one.pageName
        addKeyAndTitleToChildren(one)
      })
    }
  }
  const delFromList = (leftList) => {
    for (var i = 0; i < leftList.length; i++) {
      if (leftList[i].resourceType && leftList[i].resourceType == 4) {
        allBtnToPageMap.push({
          id: leftList[i].id,
          key: String(leftList[i].id),
          title: leftList[i].pageName,
          children: leftList[i].children,
        })
        leftList[i].splice(i, 1)
      }
      mapAttrToChildren(leftList[i], 1)
    }
  }
  const handleAllCheckAndExpand = (allLists) => {
    if (Array.isArray(allLists) && allLists.length) {
      allLists.forEach((item) => {
        handleOneCheckAndExpand(item, 0)
        mapAttrToChildren(item, 0, 1)
      })
    }
  }
  const handleOneCheckAndExpand = (list, last) => {
    // let findOne = resourceTypesMap.filter(
    //   (one) => one.type == list.resourceType,
    // )
    let findOne = [resourceTypesMap[0]]
    // console.log(findOne)
    // debugger
    list.hasAuth && findOne[0].checkedKeys.push(list.key)
    findOne[0].expandedKeys.push(list.key)
  }
  const mapAttrToChildren = (mem, del, last) => {
    const child = mem.children,
      len = child.length
    let delChild = []

    if (child && len) {
      for (let i = 0; i < len; i++) {
        // if (
        //   del &&
        //   child[i] &&
        //   child[i].resourceType &&
        //   child[i].resourceType == 4
        // ) {
        //   delChild.push(child[i])
        //   allBtnToPageMap.push({
        //     id: mem.id,
        //     key: String(mem.id),
        //     title: mem.pageName,
        //     children: delChild,
        //   })
        //   child.splice(i--, 1)
        // }

        if (!del) {
          child[i].level = last
          handleOneCheckAndExpand(child[i], child[i].level)
          mapIdToParentId(child[i])
        }

        if (child[i] && child[i].children && child[i].children.length) {
          del
            ? mapAttrToChildren(child[i], 1)
            : mapAttrToChildren(child[i], 0, ++child[i].level)
        }
      }
    }
  }
  const mapIdToParentId = (child) => {
    const {id, parentResourceId, pageName} = child
    parentIdMap.push({
      id,
      key: String(id),
      parentResourceId,
      pageName,
      title: pageName,
    })
    setParentIdMap([...parentIdMap])
  }
  const findIndexInResourceTypes = (type) => {
    return resourceTypesMap.findIndex((one) => one.type == type)
  }

  const handleKeysToState = (type, obj) => {
    const findIndex = findIndexInResourceTypes(type)
    resourceTypesMap[findIndex][obj[0]] = obj[1]
    if (obj[0] == 'expandedKeys') {
      resourceTypesMap[findIndex].autoExpandParent = false
    }
    setResourceTypesMap([...resourceTypesMap])
  }

  const onExpand = (expandedKeys, info, type) => {
    handleKeysToState(type, ['expandedKeys', expandedKeys])
  }

  const findNodeInAllListOne = (treeData, id) => {
    let findTree

    try {
      const findNodeInAllList = (treeData, id) => {
        if (treeData.id == id) {
          throw treeData
        }
        if (Array.isArray(treeData.children) && treeData.children.length) {
          for (var i = 0; i < treeData.children.length; i++) {
            if (treeData.children[i].id == id) {
              throw treeData.children[i]
            }
            findNodeInAllList(treeData.children[i], id)
          }
        }
      }
      findNodeInAllList(treeData, id)
    } catch (res) {
      findTree = res
    }
    return findTree
  }

  const onCheck = ({checked}, {node}, type) => {
    console.log('onCheck', checked)
    console.log(node)
    let keys = []
    let rightKeys = []
    node.children = findNodeInAllListOne(allList[0], node.id).children
    if (node.children) {
      getChildrenKeys(node.children, rightKeys, 1)
    }
    console.log(rightKeys)
    if (node.children) {
      getChildrenKeys(node.children, keys)
    }

    const findIndex = findIndexInResourceTypes(type)

    if (checked.length > resourceTypesMap[findIndex].checkedKeys.length) {
      let pNode = parentKeys(node.key, type)
      let pKeys = pNode.map((v) => v.id + '')
      let pLeftKeys = pNode
        .filter((v) => v.resourceType == 3)
        .map((v) => v.id + '')
      let pRightKeys = pNode
        .filter((v) => v.resourceType == 4)
        .map((v) => v.id + '')
      console.log(pKeys, 'cccc')
      var k = checked.concat(
        pKeys.filter(function (v) {
          return !(checked.indexOf(v) > -1)
        }),
      )

      if (Array.isArray(pLeftKeys) && pLeftKeys.length && type == 4) {
        var l = resourceTypesMap[0].checkedKeys.concat(
          pLeftKeys.filter(function (v) {
            return !(resourceTypesMap[0].checkedKeys.indexOf(v) > -1)
          }),
        )

        handleKeysToState(3, ['checkedKeys', [...l]])
      }
      if (Array.isArray(pRightKeys) && pRightKeys.length && type == 4) {
        var l = resourceTypesMap[0].checkedKeys.concat(
          pRightKeys.filter(function (v) {
            return !(resourceTypesMap[0].checkedKeys.indexOf(v) > -1)
          }),
        )

        handleKeysToState(4, ['checkedKeys', [...l]])
        return
      }
      if (rightKeys.length && type == 3) {
        console.log(rightKeys)
        var r = resourceTypesMap[1].checkedKeys.concat(
          rightKeys.filter(function (v) {
            return !(resourceTypesMap[1].checkedKeys.indexOf(v) > -1)
          }),
        )

        handleKeysToState(4, ['checkedKeys', [...r]])
      }
      handleKeysToState(type, ['checkedKeys', [...k, ...keys]])
    } else {
      let k = checked.filter((v) => {
        return keys.indexOf(v) == -1
      })
      if (rightKeys.length && type == 3) {
        let r = resourceTypesMap[1].checkedKeys.filter((v) => {
          return rightKeys.indexOf(v) == -1
        })

        handleKeysToState(4, ['checkedKeys', [...r]])
      }
      handleKeysToState(type, ['checkedKeys', k])
    }
  }

  const parentKeys = (key, type) => {
    let pKeys = []
    let pNode = []
    let treeData = allList
    for (let index in treeData) {
      let tree = treeData[index]
      pKeys = []
      pNode = []
      if (Array.isArray(tree.children) && tree.children.length > 0) {
        pNode.push(tree)
        getParentKeys(tree, key, pKeys, pNode)
        console.log(pKeys)
        console.log(pNode)
        if (pKeys.length === 0) {
          pNode.pop()
        }
      }
      if (pKeys.length > 0) {
        return pNode
      }
    }

    return pNode
  }
  const getParentKeys = (tree, key, pKeys, pNode) => {
    for (let index in tree.children) {
      let item = tree.children[index]

      if (item.id == key) {
        pNode.push(item)
        pKeys.push(tree.id)

        return
      } else {
        if (Array.isArray(item.children) && item.children.length > 0) {
          pNode.push(item)
          getParentKeys(item, key, pKeys, pNode)
          if (pKeys.length === 0) {
            pNode.pop()
          } else {
            return
          }
        }
      }
    }
  }
  const getChildrenKeys = (tree, ids, isFilterType) => {
    tree.forEach((item) => {
      if (isFilterType) {
        if (item.resourceType == 4) {
          ids.push(item.key)
        }
      } else {
        ids.push(item.key)
      }

      if (Array.isArray(item.children)) {
        getChildrenKeys(item.children, ids, isFilterType)
      }
    })
  }
  const onSelect = (selectedKeys, info, type) => {
    console.log('onSelect', selectedKeys)
    // if (type == 4) {
    //   return
    // }
    const findKey = allBtnToPageMap.filter((one) => one.id == selectedKeys)
    handleKeysToState(type, ['selectedKeys', selectedKeys])
    setRightList(findKey.length ? findKey[0].children : [])
  }

  const findParentById = (id) => {
    return parentIdMap.filter((one) => one.id == id)[0]
  }

  const renderTree = (
    {expandedKeys, autoExpandParent, checkedKeys, selectedKeys, type},
    treeData,
  ) => {
    return (
      <Tree
        ref={t}
        checkable
        checkStrictly={true}
        showLine={showLine}
        onExpand={(expandedKeys, info) => onExpand(expandedKeys, info, type)}
        expandedKeys={[...expandedKeys]}
        autoExpandParent={autoExpandParent}
        onCheck={(checkedKeys, info) => onCheck(checkedKeys, info, type)}
        checkedKeys={[...checkedKeys]}
        onSelect={(selectedKeys, info) => onSelect(selectedKeys, info, type)}
        selectedKeys={[...selectedKeys]}
        treeData={treeData}
      ></Tree>
    )
  }

  const onRefresh = () => {
    location.reload()
  }
  const onSubmit = async () => {
    const {checkedKeys} = resourceTypesMap[0]
    const {checkedKeys: checkedKeysFt} = resourceTypesMap[1]
    let resourceIds = [...checkedKeys, ...checkedKeysFt]

    for (var i = 0; i < resourceIds.length; i++) {
      if (resourceIds[i] == 0) {
        continue
      }
      const {parentResourceId} = findParentById(resourceIds[i])
      if (!resourceIds.some((item) => item == parentResourceId)) {
        const {pageName} = findParentById(parentResourceId)
        message.error(`请先选择父节点"${pageName}"`)
        return false
      }
    }

    resourceIds = resourceIds.join(',')

    try {
      const {
        data: {data, code},
      } = await api.put_resource({
        roleId: Number(props.router.query.roleId),
        resourceIds,
      })
      if (code == 0) {
        message.success('保存成功')
        Router.back()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  const onSwitch = (index, one) => {
    var nodes = document
      .getElementsByClassName('ant-tree-list-holder-inner')[0]
      .getElementsByClassName('ant-tree-node-content-wrapper')
    const findNode = [...nodes].find((node) => node.title === one)
    document.getElementById('primaryLayout').scrollTop =
      findNode.offsetTop + 128
    setActiveIndex(index)
  }

  return (
    <div style={{marginTop: '46px'}}>
      <Layout breadcrumbs={breadcrumbs}>
        <div className="authorTab">
          {fixTabs.map((one, index) => (
            <p
              style={{margin: '1em 15px 1em 0'}}
              className={activeIndex == index ? 'tabActive' : ''}
              onClick={() => onSwitch(index, one)}
            >
              {one}
            </p>
          ))}
          <div style={{position: 'absolute', right: '5px', top: '9px'}}>
            <Button onClick={onRefresh}>刷新</Button>
            <Button
              type="primary"
              htmlType="button"
              onClick={onSubmit}
              style={{marginLeft: '5px'}}
            >
              保存
            </Button>
          </div>
        </div>

        <Card title={`当前角色：${roleName}`}>
          <Row gutter={24}>
            <Col span={24}>
              <Card type="inner" title="页面">
                {renderTree(resourceTypesMap[0], leftList)}
              </Card>
            </Col>
            {/* <Col span={12}>
              <Card type="inner" title="操作权限">
                {rightList.length
                  ? renderTree(resourceTypesMap[1], rightList)
                  : '无操作资源'}
              </Card>
            </Col> */}
          </Row>
        </Card>
      </Layout>
    </div>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
