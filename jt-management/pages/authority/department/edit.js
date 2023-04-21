import {Modal, Form, Input, Radio, InputNumber, TimePicker, Select} from 'antd'
import React, {useEffect, useState} from 'react'
import apiBusiness from '~/api/business'
import api from '~/api/authority'
import moment from 'moment'
import LeftTree from './LeftTree'
import _ from 'lodash'

const {RangePicker} = TimePicker

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 15},
}

const EditModal = (props) => {
  const [show, setShow] = useState(props.show)
  const [showModal, setShowModal] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [treeData, setTreeData] = useState()
  const [parentData, setParentData] = useState()
  const [account, setAccount] = useState([])
  const [allAccount, setAllAccount] = useState([])
  const [editData, setEditData] = useState(null)

  const [form] = Form.useForm()

  // useEffect(() => {
  //   if (showModal) {
  //     let tree_data = _.cloneDeep(props.treeData)
  //     if (props.data) {
  //       // let tree_data = [...props.treeData]
  //       setDisabled(props.data.key, tree_data)
  //       setTreeData(tree_data)
  //     } else {
  //       setTreeData(tree_data)
  //     }
  //   }
  // }, [showModal])

  useEffect(() => {
    setShow(props.show)
    if (!props.show) {
      form.resetFields()
      setConfirmLoading(false)
      setEditData(null)
    } else {
      let tree_data = _.cloneDeep(props.treeData)
      setTreeData(tree_data)
      let data = props.data
      data.parentName = props.data.parent.name
      setParentData(data.parent)
      if (data && data.parent && data.id) {
        setEditData(data)
        getAccount(data.id)
      }

      form.setFieldsValue(data)
    }
  }, [props])

  const getAccount = async (id) => {
    try {
      let {
        data: {code, data},
      } = await api.getDepartmentAccount(id)
      if (code == 0) {
        setAllAccount(data)
        setAccount(data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const setDisabled = (key, tree) => {
    const setChildTree = (child) => {
      child.forEach((item) => {
        item.disabled = true
        if (Array.isArray(item.children)) {
          setChildTree(item.children)
        }
      })
    }

    const findChildTree = (_tree) => {
      _tree.some((item) => {
        if (item.key == key) {
          item.disabled = true
          if (Array.isArray(item.children)) {
            setChildTree(item.children)
          }
          return true
        } else if (Array.isArray(item.children)) {
          findChildTree(item.children)
        }
      })
    }

    findChildTree(tree)
  }

  const handleCancel = () => {
    form.resetFields()
    form.setFieldsValue(null)
    props.close()
  }

  const handleOk = () => {
    setConfirmLoading(true)
    form
      .validateFields()
      .then(async (values) => {
        let params = {...values, parentId: parentData.id}
        if (editData && editData.id) {
          params.id = editData.id
        }
        delete params.parentName
        let {
          data: {code},
        } = await api.editDepartment(params)
        setConfirmLoading(false)
        if (code == 0) {
          form.resetFields()
          form.setFieldsValue(null)
          props.close(true, true)
        }
      })
      .catch((err) => {
        setConfirmLoading(false)
      })
  }

  const handleSelectOk = () => {
    form.setFieldsValue({parentName: parentData.title})
    setShowModal(false)
  }
  const handleSelectCancel = () => {
    setParentData()
    setShowModal(false)
  }

  const onChangeSelect = (data) => {
    setParentData(data.selectedItem)
  }

  const handleSearchRole = (keyword) => {
    if (!keyword) {
      return setAccount(allAccount)
    }
    const arr = allAccount.filter((v) => v.accountName.indexOf(keyword) > -1)
    setAccount(arr)
  }

  return (
    <div>
      <Modal
        title={props.data && props.data.id ? '编辑部门' : '添加部门'}
        visible={show}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
      >
        <Form {...layout} form={form} name="basic">
          <Form.Item
            label="部门名称"
            name="name"
            rules={[{required: true, message: '部门名称不可为空'}]}
          >
            <Input maxLength={25} placeholder="请输入，最多25字符" />
          </Form.Item>

          <Form.Item label="上级部门" required>
            <Form.Item
              name="parentName"
              style={{marginBottom: 5}}
              onClick={() => setShowModal(true)}
              rules={[{required: true, message: '上级部门不可为空'}]}
            >
              <Input readOnly />
            </Form.Item>
            <p style={{marginBottom: 0}}>（点击可重新选择上级部门）</p>
          </Form.Item>

          {props.data && props.data.id && (
            <Form.Item label="部门负责人" name="managerId">
              <Select
                showSearch
                placeholder="请选择部门"
                filterOption={false}
                defaultActiveFirstOption={false}
                onSearch={handleSearchRole}
                style={{width: '200px'}}
              >
                {account.map((v) => {
                  return (
                    <Select.Option value={v.id} key={v.id}>
                      {v.accountName}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Modal
        title="选择上级部门"
        onOk={handleSelectOk}
        onCancel={handleSelectCancel}
        visible={showModal}
      >
        <LeftTree onChangeSelect={onChangeSelect} data={treeData} />
      </Modal>
    </div>
  )
}
export default EditModal
