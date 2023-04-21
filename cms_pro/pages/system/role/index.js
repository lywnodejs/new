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
import {CloseCircleOutlined} from '@ant-design/icons'
import {useForm} from 'antd/lib/form/util'
import moment from 'moment'

const breadcrumbs = [{text: '角色管理'}]

const pageParams = {
  pageNo: 1,
  pageSize: 50,
}

const fetchData = async (params = {}) => {
  return await fetch('bank.api.rolemanageservice.selectrolemanagepageservice', [
    {...pageParams, ...params},
  ]).catch((erro) => console.log(erro))
}

const SearchForm = ({onSearch, onAdd}) => {
  return (
    <Form
      style={{marginBottom: 20}}
      layout="inline"
      initialValues={{remember: true}}
      onFinish={onSearch}
    >
      <Form.Item label="角色名称" name="name">
        <Input placeholder="模糊搜索" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{marginRight: 15}}>
          搜索
        </Button>

        <Button type="primary" htmlType="button" onClick={onAdd}>
          新增
        </Button>
      </Form.Item>
    </Form>
  )
}

const TableList = ({onPage, onEdit, onDelete, list}) => {
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
    },
    {
      title: '最后操作人',
      dataIndex: 'createName',
    },
    {
      title: '最后操作时间',
      dataIndex: 'updateTime',
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: '',
      render: (value, row, index) => {
        return (
          <>
            <Button type="link" onClick={() => onEdit(index)}>
              编辑
            </Button>
            <Button type="link" danger onClick={() => onDelete(row)}>
              删除
            </Button>
          </>
        )
      },
    },
  ]
  const pagination = {
    defaultCurrent: 1,
    total: list.totalSize,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    current: list.pageNo,
    showSizeChanger: false,
    showTotal: (total) => `共 ${total} 条`,
    onChange: (pageNumber) => {
      pageParams.pageNo = pageNumber
      onPage(pageNumber)
    },
  }

  return (
    <Table
      rowKey="id"
      dataSource={list.list}
      columns={columns}
      bordered
      pagination={pagination}
      scroll={{x: '100%', y: 'calc(100vh - 350px)'}}
    />
  )
}

const RoleModal = ({
  treeData,
  list: {list},
  index,
  visible,
  setVisible,
  onRole,
}) => {
  const prevVisibleRef = useRef()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [ids, setIds] = useState([])

  useEffect(() => {
    prevVisibleRef.current = visible
  }, [visible])

  const prevVisible = prevVisibleRef.current

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields()
    }

    if (visible) {
      index > -1 ? form.setFieldsValue(list[index]) : form.resetFields()
      setIds(
        index > -1 && Array.isArray(list[index].resourceList)
          ? list[index].resourceList.join(',').split(',')
          : [],
      )
    }
  }, [visible])

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

  const onCheckAll = ({target: {checked}}) => {
    if (checked) {
      let ids = []
      getKeys(treeData, ids)
      setIds(ids)
    } else {
      setIds([])
    }
  }

  const getKeys = (tree, ids) => {
    tree.forEach((item) => {
      ids.push(item.id + '')
      if (Array.isArray(item.children) && item.children.length > 0) {
        getKeys(item.children, ids)
      }
    })
  }

  const onFinish = async (values) => {
    const url =
      index > -1
        ? 'bank.api.rolemanageservice.editrole'
        : 'bank.api.rolemanageservice.insertrole'

    const id = index > -1 ? list[index].id : undefined

    const {
      data: {code},
    } = await fetch(url, [{...values, id}])

    if (code === 0) {
      setVisible(false)
      onRole()
    }
  }

  useEffect(() => {
    form.setFieldsValue({privilegeList: ids})
  }, [ids])

  return (
    <Modal
      title={index > -1 ? '编辑角色' : '新增角色'}
      visible={visible}
      onOk={() => {
        form.submit()
      }}
      onCancel={() => {
        setVisible(false)
      }}
      confirmLoading={loading}
      destroyOnClose
      forceRender
      cancelText="关闭"
      okText="保存"
    >
      <Form form={form} name="edit" onFinish={onFinish}>
        <Form.Item
          label="角色名称"
          name="name"
          rules={[{required: true, message: '请输入角色名称!'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="角色描述"
          name="description"
          rules={[{required: true, message: '请输入角色描述!'}]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="全选" valuePropName="checked" name="all">
          <Checkbox onChange={onCheckAll} />
        </Form.Item>

        <Form.Item
          label="角色权限"
          name="privilegeList"
          rules={[{required: true, message: '请选择角色权限!'}]}
        >
          <Input hidden />
          <Tree checkable checkStrictly checkedKeys={ids} onCheck={onCheck}>
            {eachNode(treeData)}
          </Tree>
        </Form.Item>
      </Form>
    </Modal>
  )
}

function body({data, treeData}) {
  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState(-1)
  const [list, setList] = useState(data)
  let values

  // console.log(treeData, '---------------------------')

  const fetchList = async (values) => {
    const {
      data: {data, code},
    } = await fetchData(values)
    if (code === 0) {
      setList(data)
    }
  }

  const onSearch = (values) => {
    values = values
    pageParams.pageNo = 1
    fetchList(values)
  }

  const onAdd = () => {
    setIndex(-1)
    setVisible(true)
  }

  const onEdit = (index) => {
    setIndex(index)
    setVisible(true)
  }

  const onDelete = async (row) => {
    const {
      data: {data, code},
    } = await fetch('bank.api.rolemanageservice.deleteroleverification', [
      {roleId: row.id},
    ])

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
              renderItem={(row) => <List.Item>{row.mobile}</List.Item>}
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
          fetch('bank.api.rolemanageservice.deleterole', [
            {roleId: row.id},
          ]).then(({data: {code}}) => {
            if (code === 0) {
              resolve()
              fetchList(values)
            }
            reject()
          })
        }).catch(() => console.log('Oops errors!'))
      },
    })
  }

  const onPage = () => {
    fetchList(values)
  }

  const onRole = () => {
    fetchList(values)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space size="large" direction="vertical" style={{width: '100%'}}>
        <SearchForm {...{onSearch, onAdd}} />
        <TableList {...{list, onPage, onEdit, onDelete}} />
      </Space>
      <RoleModal {...{list, visible, setVisible, index, onRole, treeData}} />
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
        data: {
          data: {allResources: treeData},
          code: treeCode,
        },
      },
    ] = await Promise.all([
      fetchData(),
      fetch('bank.api.privilegemanageservice.queryroleresource', [null]),
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
