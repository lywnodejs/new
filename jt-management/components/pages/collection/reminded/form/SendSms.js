import {
  Button,
  Input,
  Modal,
  Space,
  List,
  Radio,
  Card,
  Row,
  Col,
  message,
} from 'antd'
import React, {useEffect, useState} from 'react'
import api from '~/api/collection'

export default function SendSms(props) {
  const [visible, setVisible] = useState(false)
  const [value, setValue] = React.useState(null)
  const [keyword, setKeyword] = React.useState(null)
  const [loading, setLoading] = useState(false)
  const [tempList, setTempList] = useState([])
  const [num, setNum] = useState(0)

  useEffect(() => {
    if (visible) {
      setValue(null)
      setKeyword(null)
      getTempList()
    }
  }, [visible])

  const getTempList = async (params = {}) => {
    const {
      data: {data, code},
    } = await api.fetch_sms_list({
      ...params,
      phoneEncrypt: props.mobilePhoneEncrypt,
      outOdernNum: props.outOrderNum,
    })
    if (code == 0) {
      let result = []
      if (Array.isArray(data.smsList)) {
        result = data.smsList.map((v, i) => {
          let keys = Object.keys(v)
          return {
            title: v[keys[0]],
            id: keys[0],
          }
        })
      }
      setTempList(result)
      setNum(data.num || 0)
    }
  }

  const onClickItem = (item) => {
    let val = item.id == value ? null : item.id
    setValue(val)
  }

  const handleOk = () => {
    if (!value) {
      return message.error('请先选择一个模板')
    }
    setLoading(true)
    api
      .add_sms_one({
        phoneEncrypt: props.mobilePhoneEncrypt,
        outOdernNum: props.outOrderNum,
        templateId: value,
      })
      .then(({data: {code}}) => {
        if (code == 0) {
          message.success('发送成功')
          setVisible(false)
          if (props.sendSuccess) {
            props.sendSuccess()
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onReset = () => {
    setKeyword(null)
    getTempList()
  }

  return (
    <React.Fragment>
      <a onClick={() => setVisible(true)}>发送短信</a>
      <Modal
        title="发送短信"
        width={750}
        visible={visible}
        confirmLoading={loading}
        onCancel={() => setVisible(false)}
        footer={
          <Row align="middle" justify="space-between">
            <Col>注*当前订单今日可发送数量{num}条。</Col>
            <Col>
              <Space>
                <Button onClick={() => setVisible(false)}>取消</Button>
                <Button type="primary" onClick={handleOk}>
                  发送
                </Button>
              </Space>
            </Col>
          </Row>
        }
      >
        <Space style={{marginBottom: 30}}>
          <span>关键字：</span>
          <Input
            placeholder="请输入"
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            style={{marginRight: 30}}
          />
          <Button type="primary" onClick={() => getTempList({keyword})}>
            查询
          </Button>
          <Button onClick={onReset}>重置</Button>
        </Space>

        <Card title="短信模板">
          <Radio.Group
            style={{
              width: '100%',
            }}
            value={value}
          >
            <List
              itemLayout="horizontal"
              dataSource={tempList}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  onClick={() => onClickItem(item)}
                  actions={[<Radio readonly value={item.id} />]}
                >
                  <span>{item.id}&emsp;</span>
                  <span style={{color: '#999'}}>{item.title}</span>
                </List.Item>
              )}
            />
          </Radio.Group>
        </Card>
      </Modal>
    </React.Fragment>
  )
}
