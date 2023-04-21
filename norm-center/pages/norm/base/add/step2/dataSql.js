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
  message,
} from 'antd'
import TableTree from './tableTree'
import React, {useState, useEffect, useRef, useContext} from 'react'
const {Sider, Content} = Layout
import styles from './index.less'
import dynamic from 'next/dynamic'
import copy from 'copy-to-clipboard'
import {BaseAddContext} from '../index'
import fetch from '~/utils/fetch'

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {ssr: false})

// import 'codemirror/keymap/sublime'

export default function DataSql(props) {
  const [codeMirror, setCodeMirror] = useState(null)
  const [result, setResult] = useState(null)
  const [form] = Form.useForm()
  const context = useContext(BaseAddContext)

  useEffect(() => {
    if (props.show) {
      form.resetFields()
      setInitSql()
    }
  }, [props.show])

  useEffect(() => {
    setInitSql()
  }, [codeMirror, props.editItem])

  const setInitSql = () => {
    if (codeMirror && props.editItem && props.editItem.extend) {
      codeMirror.setValue(props.editItem.extend)
    }
  }
  const changeSelect = (item) => {
    // console.log('changeSelect:', item)
    // let keys = item.keyExpSuccess.split('.'),
    //   length = keys.length
    // let statement = ''
    // if (length === 3) {
    //   statement = `select ${keys[2]} from ${keys[1]}`
    // } else {
    //   statement = keys[length - 1]
    // }
    // codeMirror.setValue(statement)
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
    // let code = codeMirror.getValue()
    // code += `  ${type === 'params' ? ':' : ''}${params}`
    // codeMirror.setValue(code)
    let code1 = ` ${type === 'params' ? ':' : ''}${params}`
    // codeMirror.setValue(code)
    codeMirror.replaceSelection(code1)
  }

  const clickParent = (key) => {
    addParams(key)
    // let code = codeMirror.getValue()
    // code += `  ${key}`
    // codeMirror.setValue(code)
  }

  const requestData = async (type) => {
    try {
      let values = await form.validateFields()

      let object = {
        scriptData: codeMirror.getValue(),
        // requestType: props.editItem.columnType,
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
        // codeMirror.setValue(data.resData)
        if (type === 'save') {
          saveConfig()
        }
      } else {
        setResult({res: '失败'})
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
    props.close()
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

  const footer = (
    <Space>
      <Button onClick={requestData}>调试</Button>
      <Button type="primary" onClick={() => requestData('save')}>
        保存
      </Button>
    </Space>
  )

  useEffect(() => {
    import('codemirror/keymap/sublime')
    import('codemirror/mode/sql/sql')
  }, [])

  const columns = [
    {title: '名称', dataIndex: 'columnDesc', width: '33.3%'},
    {
      title: '参数名',
      dataIndex: 'columnName',
      width: '33.3%',
      render: (v, r, i) => {
        return (
          <Button type="link" onClick={() => addParams(v, 'params')}>
            {v}
          </Button>
        )
      },
    },
    {
      width: '33.3%',
      render: (v, r, i) => {
        return (
          <Form.Item
            name={[i, 'value']}
            // rules={[{required: true, message: '该项不能为空'}]}
            style={{width: 150, margin: '0 auto'}}
          >
            <Input placeholder="赋值" />
          </Form.Item>
        )
      },
    },
  ]

  return (
    <Modal
      title="SQL逻辑"
      visible={props.show}
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

        <Content className={styles.modalContent}>
          <div className={styles.f2}>
            <p>入参表：</p>
            <Form form={form}>
              <Table
                dataSource={props.sqlParams}
                pagination={false}
                columns={columns}
                rowKey="id"
                // onRow={(record, index) => {
                //   return {
                //     onClick: event => {clickTable(index)}, // 点击行
                //   };
                // }}
              />
            </Form>
          </div>

          <div className={styles.f1}>
            <p>SQL输入框：</p>
            <div style={{height: '267px', width: '100%'}}>
              <CodeMirror
                style={{width: '100%'}}
                value={'init'}
                options={{
                  theme: 'monokai',
                  keyMap: 'sublime',
                  mode: 'sql',
                }}
                onChange={(v) => changeSql(v)}
              />
            </div>
          </div>

          <div className={styles.f1}>
            <Row>
              <Col span={12}>
                结果：{result && result.res} 时间：
                <span style={{color: '#1890ff'}}>
                  {result && result.userTime ? result.userTime + 'ms' : ''}
                </span>
              </Col>
              <Col span={12} style={{textAlign: 'right'}}>
                <Button type="link" onClick={copyText}>
                  复制
                </Button>
              </Col>
            </Row>
            <div className={styles.debugRes}>{result && result.resData}</div>
          </div>
        </Content>
      </Layout>
    </Modal>
  )
}
