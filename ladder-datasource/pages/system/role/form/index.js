import {Layout} from '~/components/Layout'
import {useEffect, useState, useRef} from 'react'
import fetch from '~/utils/fetch'
import {
  Form,
  Input,
  Button,
  Table,
  Modal,
  Checkbox,
  Tree,
  List,
  Space,
} from 'antd'
import {
  CloseCircleOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {useForm} from 'antd/lib/form/util'
import moment from 'moment'
import Router, {useRouter} from 'next/router'
import styles from './index.less'

const breadcrumbs = [
  {text: '系统管理'},
  {text: '角色管理', path: '/system/role'},
]

const pageParams = {
  pageNo: 1,
  pageSize: 50000,
}

const fetchData = async (params = {}) => {
  return await fetch('fincloud.admin.center.facade.api.roleservice.list', [
    {...pageParams, ...params},
  ]).catch((erro) => console.error(erro))
}

const RoleForm = ({treeData, list, onSave, onDelete, form}) => {
  const [loading, setLoading] = useState(false)
  const [ids, setIds] = useState([])
  const router = useRouter()

  useEffect(() => {
    const id = router.query.id || ''
    const item = list.find((v) => v.id == id)
    // console.log(item)

    form.resetFields()

    let selectIds = []
    if (item) {
      form.setFieldsValue(item)
      selectIds = item.resourceList.join(',').split(',')
    }

    let allIds = []
    getKeys(treeData, allIds)
    if (allIds.length === selectIds.length) {
      selectIds.push('all')
    }

    setIds(selectIds)
  }, [router.query.id])

  const eachNode = (treeData) => {
    // console.log(treeData)
    return treeData.map((item) => {
      const prefix = item.path !== undefined ? 'menu:' : ''
      return (
        <Tree.TreeNode key={item.id} title={item.pageName}>
          {Array.isArray(item.children) &&
            item.children.length > 0 &&
            eachNode(item.children)}
        </Tree.TreeNode>
      )
    })
  }

  const onCheck = ({checked}, {node: {children, key}}) => {
    // console.log(checked, node)
    if (key === 'all') {
      let tempIds = []
      if (!~ids.indexOf('all')) {
        getKeys(treeData, tempIds)
        tempIds.push('all')
      }
      setIds(tempIds)
      return
    }

    let sKeys = []
    let keys = []
    if (children) {
      getChildrenKeys(children, keys)
    }

    // selected
    if (checked.length > ids.length) {
      // console.log(checked)
      let nodes = getParentNodes([], key, treeData)
      let pKeys = nodes.map((k) => k.id + '')

      var k = checked.concat(
        pKeys.filter(function (v) {
          return !(checked.indexOf(v) > -1)
        }),
      )
      // console.log(pKeys, '-------------------', k)
      sKeys = [...k, ...keys]
    } else {
      sKeys = checked.filter((v) => {
        return keys.indexOf(v) == -1
      })
      // console.log(checked, keys, k)
    }

    //handler all checked
    let allIds = []
    getKeys(treeData, allIds)

    let index = sKeys.indexOf('all')
    if (~index) {
      sKeys.splice(index, 1)
    }

    if (allIds.length === sKeys.length) {
      sKeys.push('all')
    }

    // console.log(sKeys)
    setIds(sKeys)
  }

  const getParentNodes = function (nodes, key, tree) {
    for (const item of tree) {
      const children = item.children || []
      if (item.id == key) {
        return [...nodes, item]
      } else if (children.length > 0) {
        let n = getParentNodes([...nodes, item], key, children)
        if (n) {
          return n
        }
      }
    }
  }

  const getChildrenKeys = (tree, ids) => {
    tree.forEach((item) => {
      ids.push(item.key)
      if (Array.isArray(item.children)) {
        getChildrenKeys(item.children, ids)
      }
    })
  }

  const getKeys = (tree, ids) => {
    tree.forEach((item) => {
      ids.push(item.id + '')
      if (Array.isArray(item.children) && item.children.length > 0) {
        getKeys(item.children, ids)
      }
    })
  }

  useEffect(() => {
    form.setFieldsValue({resourceList: ids})
  }, [ids])

  return (
    <div className={styles.form}>
      <div>
        <Button
          onClick={() => {
            onDelete(router.query.id)
          }}
          danger
          style={{marginRight: 20}}
        >
          删除
        </Button>
        <Button
          type="primary"
          onClick={() => {
            form.submit()
          }}
        >
          保存
        </Button>
      </div>
      <Form form={form} name="edit" onFinish={onSave}>
        <Form.Item
          label="角色名称"
          name="name"
          rules={[{required: true, message: '请输入角色名称!'}]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item */}
        {/*   label="角色描述" */}
        {/*   name="description" */}
        {/*   rules={[{required: true, message: '请输入角色描述!'}]} */}
        {/* > */}
        {/*   <Input /> */}
        {/* </Form.Item> */}

        <Form.Item noStyle name="id">
          <Input hidden />
        </Form.Item>

        <Form.Item
          label="角色权限"
          name="resourceList"
          rules={[{required: true, message: '请选择角色权限!'}]}
        >
          <Input hidden />
          <div className={styles.tree}>
            <Tree
              defaultExpandAll
              checkable
              checkStrictly
              checkedKeys={ids}
              onCheck={onCheck}
            >
              <Tree.TreeNode expandAction title="全选" id="all" key="all" />
              {eachNode(treeData)}
            </Tree>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

function RoleList({list, onSelect, ulEl, onAdd}) {
  const router = useRouter()
  const id = router.query.id || ''

  useEffect(() => {
    const index = list.findIndex((v) => v.id == id)
    // console.log('list index:', index)
    ulEl.current.scrollTop = 40 * index
  }, [])

  return (
    <div className={styles.list}>
      <div>
        <Button
          type="text"
          onClick={onAdd}
          icon={<PlusOutlined style={{fontSize: 12, color: '#3F4254'}} />}
        >
          新增角色
        </Button>
      </div>
      <ul ref={ulEl}>
        {list.map((v) => (
          <li
            key={v.id}
            onClick={() => {
              onSelect(v)
            }}
            className={id == v.id ? styles.active : null}
          >
            {v.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

function body({data, treeData}) {
  const [list, setList] = useState(data)
  const [form] = Form.useForm()
  const ulEl = useRef(null)
  const router = useRouter()
  // console.log(treeData, '---------------------------')

  const fetchList = async () => {
    const {
      data: {data, code},
    } = await fetchData()
    if (code === 0) {
      setList(data.list)
      return data.list
    }
  }

  const onDelete = async (id) => {
    if (!id) {
      Modal.warning({content: '请先择左侧角色'})
      return
    }
    const {
      data: {data, code},
    } = await fetch(
      'fincloud.admin.center.facade.api.roleservice.deleteroleverification',
      [id],
    )

    if (code !== 0) {
      return
    }

    if (Array.isArray(data) && data.length > 0) {
      return Modal.warning({
        title: '提示',
        okText: '确定',
        content: (
          <div>
            <p style={{fontSize: 12, color: '#333'}}>
              该角色正在被以下账号使用，请修改后再进行删除
            </p>
            <List
              size="small"
              bordered
              dataSource={data}
              renderItem={(row) => <List.Item>{row.accountName}</List.Item>}
            />
          </div>
        ),
      })
    }

    Modal.confirm({
      title: '删除后不可恢复，请确认是否删除该角色？',
      icon: <CloseCircleOutlined style={{color: '#ff0000'}} />,
      onOk() {
        return new Promise((resolve, reject) => {
          let index = list.findIndex((v) => v.id == id)
          const scrollTop = ulEl.current.scrollTop
          fetch('fincloud.admin.center.facade.api.roleservice.deleterole', [
            id,
          ]).then(async ({data: {code}}) => {
            if (code === 0) {
              resolve()
              const data = await fetchList()
              let id = null
              if (Array.isArray(data) && data.length > 0) {
                if (index > data.length - 1) {
                  index = data.length - 1
                }
                id = data[index].id
              }
              if (id) {
                router.replace(`/system/role/form?id=${id}`)
              } else {
                router.replace('/system/role/form', '/system/role/form', {
                  shallow: true,
                })
              }
              ulEl.current.scrollTop = scrollTop
            }
            reject()
          })
        }).catch(() => console.log('Oops errors!'))
      },
    })
  }

  const onSave = async (values) => {
    const id = values.id

    let i = values.resourceList.indexOf('all')
    if (~i) {
      values.resourceList.splice(i, 1)
    }

    const {
      data: {code},
    } = await fetch('fincloud.admin.center.facade.api.roleservice.saverole', [
      {...values, id},
    ])

    if (code === 0) {
      Router.back()
    }
  }

  const onSelect = (value) => {
    router.replace(`/system/role/form?id=${value.id}`)
  }

  const onAdd = () => {
    form.resetFields()
    router.replace('/system/role/form', '/system/role/form', {shallow: true})
  }

  return (
    <Layout
      breadcrumbs={[
        ...breadcrumbs,
        {text: `角色权限${router.query.id ? '编辑' : '添加'}`},
      ]}
    >
      <div className={styles.container}>
        <RoleList {...{list, onSelect, onAdd, ulEl}} />
        <RoleForm {...{list, treeData, form, onSave, onDelete}} />
      </div>
    </Layout>
  )
}

body.getInitialProps = async (params) => {
  const defaultData = {
    data: [],
    treeData: [],
  }
  try {
    const [
      {
        data: {data, code},
      },
      {
        data: {data: treeData, code: treeCode},
      },
    ] = await Promise.all([
      fetchData(),
      fetch('fincloud.admin.center.facade.api.roleservice.queryroleresource', [
        null,
      ]),
    ])

    if (code === 0) {
      return {
        data,
        treeData: treeCode === 0 ? treeData : [],
      }
    }

    return defaultData
  } catch (err) {
    return defaultData
  }
}

export default body
