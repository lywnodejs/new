import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'

import api from '~/api/authority'
import {
  Button,
  Table,
  Space,
  Form,
  Input,
  Modal,
  message,
  Breadcrumb,
  Row,
  Col,
} from 'antd'
import Router from 'next/router'
import {SearchOutlined, ClusterOutlined} from '@ant-design/icons'
import EditModal from './edit'
import LeftTree from './LeftTree'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

const initTree = (data) => {
  data.forEach((item) => {
    item.key = item.id
    item.title = item.name
    if (Array.isArray(item.children)) {
      initTree(item.children)
    }
  })
}

const getTreeData = async (params = {}) => {
  try {
    let {
      data: {code, data},
    } = await api.getDepartmentList(params)
    if (code == 0) {
      // let tree = data;
      initTree(data)
      return data
    }
    return []
  } catch (e) {
    return []
  }
}

const breadcrumbs = [{text: '权限管理'}, {text: '组织架构管理'}]

function body(props) {
  const [showModal, setModal] = useState(false)
  const [treeData, setTreeData] = useState(props.data)
  const [showModalData, setModalData] = useState(null)
  const [searchParams, setSearchParams] = useState({})
  const [r_data, setRData] = useState({
    parents: [],
    selectedItem: props.data[0],
  })
  const [selectData, setSelectData] = useState(props.data[0] || {})

  const onChangeData = async () => {
    let data = await getTreeData()
    setTreeData(data)
  }

  const deleteItem = (i) => {
    Modal.confirm({
      content: '确定删除此部门？',
      onOk: async () => {
        let item = selectData.children[i]
        const {data} = await api.deleteDepartment(item.id)
        if (data.code == 0) {
          message.success('删除成功')
          onChangeData()
        }
      },
    })
  }

  const columns = [
    {title: '部门名称', dataIndex: 'title'},
    {title: '部门负责人', dataIndex: 'managerName'},
    {
      title: '操作',
      render: (v, r, i) => {
        return (
          <Space>
            <Button type="link" onClick={() => showAddModal(i)}>
              编辑
            </Button>
            <Button type="link" danger onClick={() => deleteItem(i)}>
              删除
            </Button>
          </Space>
        )
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

  const showAddModal = (i) => {
    let editData = null
    console.log(i)
    if (i > -1) {
      editData = selectData.children[i]
    } else {
      editData = {
        parent: selectData,
      }
    }
    setModalData(editData)
    setModal(true)
  }

  const closeModal = (isSuccess, isUpdateList) => {
    setModal(false)
    if (isUpdateList) {
      onChangeData()
    }
    if (isSuccess) {
      message.success('编辑成功')
    }
  }

  // const paginationConfig = {
  //   total: data.totalSize,
  //   current: pageParams.pageNo,
  //   showSizeChanger: false,
  //   showQuickJumper: true,
  //   defaultPageSize: pageParams.pageSize,
  //   showTotal: (total) => `共 ${total} 条`,
  //   onChange: onChangePage,
  // }

  const onChangeSelect = (data) => {
    console.log('change')
    setRData(data)
    setSelectData(data.selectedItem)
  }

  const onClickItem = (data) => {
    console.log(data)
    setSelectData({...data})
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      {Array.isArray(treeData) && treeData.length > 0 ? (
        <Row
          style={{
            width: '100%',
            minHeight: 350,
            padding: 20,
            backgroundColor: '#fff',
          }}
          align="start"
        >
          <Col flex="0 0 350px">
            {/*<Search search={onSearch} showAddModal={() => showAddModal(-1)} />*/}
            <LeftTree data={treeData} onChangeSelect={onChangeSelect} />
          </Col>

          <Col flex={1}>
            {!r_data ? null : (
              <React.Fragment>
                <Breadcrumb separator=">" style={{marginBottom: 25}}>
                  {r_data.parents.map((item) => {
                    return (
                      <Breadcrumb.Item key={item.key}>
                        <a
                          style={{color: '#1890ff'}}
                          onClick={() => onClickItem(item)}
                        >
                          {item.title}
                        </a>
                      </Breadcrumb.Item>
                    )
                  })}
                  <Breadcrumb.Item>
                    <a onClick={() => onClickItem(r_data.selectedItem)}>
                      {r_data.selectedItem && r_data.selectedItem.title}
                    </a>
                  </Breadcrumb.Item>
                </Breadcrumb>
                <Space style={{marginBottom: 25}}>
                  <ClusterOutlined style={{fontSize: 25}} />
                  <span
                    style={{
                      fontSize: 18,
                      color: '#333',
                      marginRight: 15,
                    }}
                  >
                    {selectData && selectData.title}下级部门
                  </span>
                  <Button
                    type="primary"
                    onClick={() => showAddModal(-1)}
                    size="small"
                  >
                    添加子部门
                  </Button>
                </Space>
                <Table
                  bordered
                  expandable={{childrenColumnName: 'testChild'}}
                  rowKey="key"
                  pagination={false}
                  columns={columns}
                  dataSource={selectData.children || []}
                />
              </React.Fragment>
            )}
          </Col>
        </Row>
      ) : (
        '暂无部门'
      )}

      <EditModal
        show={showModal}
        data={showModalData}
        treeData={treeData}
        selectData={selectData}
        close={closeModal}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  // let data = await getData()
  let data = await getTreeData()
  return {data}
}

export default body
