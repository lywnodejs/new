import {
  Modal,
  Space,
  Button,
  Layout,
  Row,
  Col,
  Input,
  Form,
  Table,
  Select,
  message,
} from 'antd'
import TableTree from './tableTree'
import React, {useState, useEffect, useRef, useContext} from 'react'
const {Sider, Content} = Layout
import styles from './index.less'
import dynamic from 'next/dynamic'
import copy from 'copy-to-clipboard'
import {BaseAddContext} from '../index'
import {InfoCircleOutlined} from '@ant-design/icons'
import GroupConfig from './groupConfig'
import {TYPES, SQL_TYPES} from '../../const'
import fetch from '~/utils/fetch'

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {ssr: false})

// import 'codemirror/keymap/sublime'

export default function DataSql(props) {
  const [codeMirror, setCodeMirror] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [result, setResult] = useState(null)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [groups, setGroups] = useState([])
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const context = useContext(BaseAddContext)

  useEffect(() => {
    if (props.show) {
      setInitSql()
    }
    setShowModal(props.show)
  }, [props.show, codeMirror, props.editItem])

  useEffect(() => {
    if (props.groups) {
      setGroups(props.groups)
    }
  }, [props.groups])

  useEffect(() => {
    import('codemirror/keymap/sublime')
    import('codemirror/mode/sql/sql')
  }, [])

  const setInitSql = () => {
    if (codeMirror && props.editItem && props.editItem.extend) {
      codeMirror.setValue(props.editItem.extend)
    }
    if (props.editItem) {
      editForm.setFieldsValue(props.editItem)
    }
  }
  const changeSelect = (item) => {
    addParams(item.name)
  }

  const changeSql = (instance) => {
    if (!codeMirror) {
      setCodeMirror(instance)
      if (instance.getValue() === 'init') {
        instance.setValue('')
      }
    }
  }

  const addParams = (params, type) => {
    let code1 = ` ${type === 'params' ? ':' : ''}${params}`
    codeMirror.replaceSelection(code1)
  }

  const clickParent = (key) => {
    addParams(key)
  }

  const requestData = async (type) => {
    try {
      let editValues = await editForm.validateFields()
      let values = await form.validateFields()

      let object = {
        scriptData: codeMirror.getValue(),
        requestType: editValues.columnType,
        datasourceId:
          props.locationType == 'base_list'
            ? props.editItem.datasourceId
            : context.selectedItem.item.id,
      }

      object.params = props.sqlParams.map((v, index) => {
        return {
          key: v.id + '',
          value: values[index].value,
        }
      })

      let {
        data: {code, data},
      } = await fetch(
        'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.runsql',
        [object],
      )

      if (code == 0) {
        setResult({...data, res: '成功'})
        if (type !== 'save') {
          message.success('调试成功')
        } else {
          saveEdit()
        }
      } else {
        setResult({res: '失败'})
        message.error('调试失败')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const footer = (
    <Space>
      <Button onClick={requestData}>调试</Button>
      <Button type="primary" onClick={() => requestData('save')}>
        保存
      </Button>
    </Space>
  )

  const saveEdit = async (i) => {
    try {
      const values = await editForm.validateFields()
      console.log(values)
      const datasourceId = context.selectedItem.item.id
      const datasourceType = context.selectedItem.dataSourceType
      const groupId = groups.find((v) => v.groupName == values.groupName)
        .groupId
      // let item = list[i]
      let obj = {
        type: 'base',
        datasourceType,
        datasourceId,
        groupId,
        extend: codeMirror.getValue(),
        ...values,
      }

      let editIndex = -1

      if (props.editItem && props.editItem.id) {
        obj.id = props.editItem.id
        editIndex = props.list.findIndex((v) => v.id == props.editItem.id)
      }

      let {
        data: {code, data},
      } = await fetch(
        'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.save',
        [obj],
      )
      if (code == 0) {
        message.success('保存成功')
        if (editIndex == -1) {
          obj.id = data
          props.setList([obj, ...props.list])
        } else {
          props.list[editIndex] = {...props.list[editIndex], ...obj}
          props.setList([...props.list])
        }
        onCancel()
      }
    } catch (e) {
      console.log(e)
    }
  }

  const saveConfig = () => {
    let code = codeMirror.getValue()
    codeMirror.setValue('')
    props.close(code)
  }

  const onCancel = () => {
    codeMirror.setValue('')
    form.resetFields()
    editForm.resetFields()
    setTimeout(() => {
      props.close()
    }, 0)
  }

  const clickTable = (i) => {
    let item = props.sqlParams[i]
    let code = codeMirror.getValue()
    code += `  ${item.value}`
    codeMirror.setValue(code)
  }

  const copyText = () => {
    let text = (result && result.resData) || ''
    if (copy(text)) {
      message.success('复制成功')
    }
  }

  const selectGroup = (e, i) => {
    e.stopPropagation()
    e.preventDefault()
    setShowGroupModal(true)
  }

  const closeGroupConfig = (params) => {
    if (params) {
      editForm.setFieldsValue({
        groupName: params.groupName,
      })
      if (params.type === 'add') {
        props.getGroups()
      }
    }
    setShowGroupModal(false)
  }

  return (
    <Modal
      title={
        <h2>
          指标编辑
          <span style={{fontSize: 16, color: '#666'}}>
            &nbsp;&nbsp;{context.selectedItem.item.name}
          </span>
        </h2>
      }
      visible={showModal}
      width="80%"
      onCancel={onCancel}
      className={styles.modalTree}
      maskClosable={false}
      footer={footer}
      centered={true}
    >
      <Layout style={{backgroundColor: '#fff'}}>
        <Sider
          style={{marginRight: 15, backgroundColor: '#f2f2f2', padding: 15}}
          className={styles.jsonTree}
          width={350}
        >
          <TableTree
            data={props.data}
            simple
            //   ref={jsonTreeRef}
            readOnly={false}
            changeSelect={changeSelect}
            clickParent={clickParent}
          />
        </Sider>

        <Content>
          <Row style={{flexDirection: 'column', height: '100%'}}>
            <Col>
              <Form
                form={editForm}
                layout="vertical"
                style={{display: 'flex', flexDirection: 'row'}}
              >
                <Form.Item
                  name="name"
                  style={{marginRight: 10}}
                  rules={[{required: true, message: '请输入'}]}
                  label="指标名："
                >
                  <Input placeholder="请输入" />
                </Form.Item>

                <Form.Item
                  name="columnType"
                  style={{marginRight: 10}}
                  rules={[{required: true, message: '请输入'}]}
                  label="类型："
                >
                  <Select style={{width: 120}}>
                    {SQL_TYPES.map((v, index) => {
                      return (
                        <Select.Option value={v.columnType} key={index}>
                          {v.name}
                        </Select.Option>
                      )
                    })}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="columnDefaultValue"
                  style={{marginRight: 10}}
                  rules={[{required: true, message: '请输入'}]}
                  label="默认值："
                >
                  <Input placeholder="请输入" />
                </Form.Item>

                <Form.Item
                  name="groupName"
                  style={{marginRight: 10}}
                  rules={[{required: true, message: '请输入'}]}
                  onClick={(e) => selectGroup(e)}
                  label="分组："
                >
                  <Input placeholder="请选择" readOnly />
                </Form.Item>

                <Form.Item
                  name="nameCn"
                  rules={[{required: true, message: '请输入'}]}
                  label="指标中文名："
                >
                  <Input placeholder="请输入" />
                </Form.Item>
              </Form>
            </Col>
            <Col>
              <Row gutter="20" style={{height: '100%'}} wrap={false}>
                <Col flex="4">
                  <Row style={{flexDirection: 'column', height: '100%'}}>
                    <Col>
                      <p>SQL输入框：</p>
                      <div style={{height: '533px', maxWidth: '876px'}}>
                        <CodeMirror
                          value={'init'}
                          options={{
                            theme: 'monokai',
                            keyMap: 'sublime',
                            mode: 'sql',
                          }}
                          onChange={(v) => changeSql(v)}
                        />
                      </div>
                    </Col>

                    <Col flex="1">
                      <Row>
                        <Col span={12}>
                          结果：{result && result.res} 时间：
                          <span style={{color: '#1890ff'}}>
                            {result && result.userTime
                              ? result.userTime + 'ms'
                              : ''}
                          </span>
                        </Col>
                        <Col span={12} style={{textAlign: 'right'}}>
                          <Button type="link" onClick={copyText}>
                            复制
                          </Button>
                        </Col>
                      </Row>
                      <div className={styles.debugRes}>
                        {result && result.resData}
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col flex="1">
                  <div>
                    <p>入参表：</p>
                    <Form form={form} layout="vertical">
                      {Array.isArray(props.sqlParams)
                        ? props.sqlParams.map((v, i) => {
                            return (
                              <Form.Item
                                name={[i, 'value']}
                                label={
                                  <Button
                                    onClick={() =>
                                      addParams(v.columnName, 'params')
                                    }
                                    type="link"
                                  >
                                    {v.columnName}
                                  </Button>
                                }
                                tooltip={{
                                  title: v.columnDesc,
                                  icon: <InfoCircleOutlined />,
                                }}
                                key={i}
                              >
                                <Input placeholder="赋值" />
                              </Form.Item>
                            )
                          })
                        : null}
                      {/* <Table
                        dataSource={props.sqlParams}
                        pagination={false}
                        columns={columns}
                        rowKey="id"
                        // onRow={(record, index) => {
                        //   return {
                        //     onClick: event => {clickTable(index)}, // 点击行
                        //   };
                        // }}
                      /> */}
                    </Form>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>

      <GroupConfig
        show={showGroupModal}
        groups={groups}
        close={closeGroupConfig}
      />
    </Modal>
  )
}
