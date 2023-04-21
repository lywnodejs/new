import React, {useState, useContext, useRef, useEffect} from 'react'
import {Row, Col, Card, Layout, Space, Button, message} from 'antd'
const {Header, Footer, Sider, Content} = Layout
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'
import styles from './index.less'

import JsonTree from '~/components/common/JsonTree'
import Edit from './edit'
import {BaseAddContext} from '../index'
import {isNumber} from 'recharts/lib/util/DataUtils'

export default function InterFace(props) {
  const context = useContext(BaseAddContext)
  const [collapsed, setCollapsed] = useState(false)
  const [json, setJson] = useState(null)
  const [editList, setEditList] = useState([])
  const [editForm, setEditForm] = useState(null)
  const [editArr, setEditArr] = useState(null)
  const jsonTreeRef = useRef()

  useEffect(() => {
    setJson(props.data)
  }, [props.data])

  const deleteItemSelected = (item) => {
    let i = editList.findIndex((v) => v.keyExp == item.keyExp)
    jsonTreeRef.current.deleteKey(item, i)
  }

  const changeSelect = (value, index, type) => {
    if (!isNaN(index) && value[index]) {
      value[index].edit = type === 'init' ? false : true
      value[index].name = value[index].name || value[index].keyName
    }
    console.log('changeSelect', value)
    setEditList([...value])
  }

  const nextStep = async () => {
    console.log(editList)
    if (!editList || (Array.isArray(editList) && editList.length === 0)) {
      return message.error('没有选择指标')
    }

    editForm.validateFields().then((values) => {
      let hasError = editArr.some((v) => v.edit)
      if (hasError) {
        message.error('存在未保存指标配置，请检查。')
      } else {
        context.nextStep()
      }
    })
  }

  const setForm = (form) => {
    setEditForm(form)
  }

  const setList = (list) => {
    // setEditArr(list)
    setEditList(list)
  }
  const changeEditList = (list) => {
    setEditArr(list)
  }

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <React.Fragment>
      <Layout>
        <Sider
          style={{
            marginRight: 15,
            backgroundColor: '#FFF',
            paddingBottom: '65px',
          }}
          className={styles.jsonTree}
          width={collapsed ? 50 : 350}
        >
          {collapsed ? (
            <Button
              type="primary"
              onClick={toggleCollapsed}
              style={{marginTop: 20}}
            >
              <MenuUnfoldOutlined />
            </Button>
          ) : (
            json && (
              <JsonTree
                dataName={context.selectedItem.item.name}
                data={json}
                ref={jsonTreeRef}
                selecteds={props.configs}
                readOnly={false}
                changeSelect={changeSelect}
                toggleCollapsed={toggleCollapsed}
              />
            )
          )}
        </Sider>
        <Content>
          <Edit
            nextStep={nextStep}
            list={editList}
            setForm={setForm}
            setList={setList}
            changeEditList={changeEditList}
            deleteItemSelected={deleteItemSelected}
            groups={props.groups}
            getGroups={props.getGroups}
          />
        </Content>
        {/* <Layout>
          
          <Footer style={{padding: '24px 0', textAlign: 'right'}}>
            <Card>
              <Space>
                <Button onClick={context.preStep}>上一步</Button>
                <Button type="primary" onClick={nextStep}>
                  下一步
                </Button>
              </Space>
            </Card>
          </Footer>
        </Layout> */}
      </Layout>
    </React.Fragment>
  )
}
