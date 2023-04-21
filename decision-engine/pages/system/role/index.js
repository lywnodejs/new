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
  message,
} from 'antd'
import {CloseCircleOutlined} from '@ant-design/icons'
import moment from 'moment'

const breadcrumbs = [{text: '系统管理'}, {text: '角色管理'}]

const pageParams = {
  pageNo: 1,
  pageSize: 50,
}

const fetchData = async (params = {}) => {
  return await fetch('fincloud.admin.center.facade.api.roleservice.list', [
    {...pageParams, ...params},
  ]).catch((erro) => console.log(erro))
}

const SearchForm = ({onSearch, onAdd, form}) => {
  return (
    <Form
      form={form}
      layout="inline"
      initialValues={{remember: true}}
      onFinish={onSearch}
    >
      <Form.Item label="角色名称" name="name">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{marginRight: 15}}>
          查询
        </Button>

        <Button type="primary" htmlType="button" onClick={onAdd}>
          新增角色
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
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      width: 200,
      render: (value, row, index) => {
        return (
          <>
            <Button type="link" onClick={() => onEdit(row)}>
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

  return (
    <Table
      rowKey="id"
      dataSource={list}
      columns={columns}
      scroll={{x: '1600px', y: 'calc(100vh - 350px)'}}
      rowClassName={(record, idx) => {
        if (idx % 2 === 0) return 'bg-row'
      }}
    />
  )
}

const RoleModal = ({treeData, list, row, visible, setVisible, onRole}) => {
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
      row !== null ? form.setFieldsValue(row) : form.resetFields()
      setIds(row !== null ? row.resourceList.join(',').split(',') : [])
    }
  }, [visible])

  const eachNode = (treeData) => {
    // console.log(treeData, '---------------------')
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
    const id = row !== null ? row.id : undefined

    const {
      data: {code},
    } = await fetch('fincloud.admin.center.facade.api.roleservice.saverole', [
      {...values, id, resourceList: ids},
    ])

    if (code === 0) {
      setVisible(false)
      message.success('提交成功')
      onRole()
    }
  }

  return (
    <Modal
      title={row !== null ? '编辑' : '新增'}
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
          <Input placeholder="请输入，最多50字符" />
        </Form.Item>

        <Form.Item label="全选" valuePropName="checked">
          <Checkbox onChange={onCheckAll} />
        </Form.Item>

        <Form.Item label="角色权限">
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
  const [row, setRow] = useState()
  const [list, setList] = useState(data)
  const [form] = Form.useForm()

  // console.log(treeData, '---------------------------')

  useEffect(() => {
    form.resetFields()
    setList(data)
  }, [data])

  const fetchList = async (values) => {
    const {
      data: {data, code},
    } = await fetchData(values)
    if (code === 0) {
      setList(data)
    }
  }

  const onSearch = (values) => {
    pageParams.pageNo = 1
    fetchList(values)
  }

  const onAdd = () => {
    setRow(null)
    setVisible(true)
  }

  const onEdit = (row) => {
    setRow(row)
    setVisible(true)
  }

  const onDelete = async (row) => {
    const {
      data: {data, code},
    } = await fetch(
      'fincloud.admin.center.facade.api.roleservice.deleteroleverification',
      [row.id],
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
          fetch('fincloud.admin.center.facade.api.roleservice.deleterole', [
            row.id,
          ]).then(({data: {code}}) => {
            if (code === 0) {
              resolve()
              fetchList(form.getFieldsValue())
              message.success('提交成功')
            }
            reject()
          })
        }).catch(() => console.log('Oops errors!'))
      },
    })
  }

  const onPage = () => {
    fetchList(form.getFieldsValue())
  }

  const onRole = () => {
    fetchList(form.getFieldsValue())
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space size="large" direction="vertical" style={{width: '100%'}}>
        <SearchForm {...{onSearch, onAdd, form}} />
        <TableList {...{list, onPage, onEdit, onDelete}} />
      </Space>
      <RoleModal {...{list, visible, setVisible, row, onRole, treeData}} />
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
        {},
      ]),
    ])
    // console.log(treeData, '++++++++++++')
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
