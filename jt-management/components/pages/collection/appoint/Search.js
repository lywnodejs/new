import {Button, Card, Col, Form, Input, Row, Select, Space} from 'antd'
import React, {useState} from 'react'
import {UpOutlined} from '@ant-design/icons'
import styles from '../index.less'
import {DELEGATE_TYPE, CHECK_REASON} from '~/utils/const'

export default function (props) {
  const [form] = Form.useForm()

  const [collapse, setCollapse] = useState(true)

  const onSearch = () => {
    let {...values} = form.getFieldsValue()

    props.search(values)
  }

  const resetForm = () => {
    form.resetFields()
    onSearch()
  }

  return (
    <Card style={{marginBottom: 30}}>
      <Row>
        <Col
          flex="1 1 0"
          className={[
            styles.searchBoxHeight,
            collapse ? styles.searchBoxForAll : styles.searchBoxForSome,
          ]}
        >
          <Form
            form={form}
            name="search"
            initialValues={{
              productName: '',
              reviewType: '',
              reviewStatus: '',
            }}
            layout="inline"
          >
            <Form.Item label="手机号/借据号" name="keyword">
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item label="用户名" name="realName">
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item name="productName" label="产品名">
              <Select style={{width: 130}}>
                <Select.Option value="">全部</Select.Option>
                {props.productList.map((v, i) => (
                  <Select.Option key={i} value={v.name}>
                    {v.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="reviewType" label="检查原因">
              <Select style={{width: 130}}>
                <Select.Option value="">全部</Select.Option>
                {CHECK_REASON.map((v, i) => (
                  <Select.Option key={i} value={v.key}>
                    {v.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="reviewStatus" label="是否委派">
              <Select style={{width: 130}}>
                <Select.Option value="">全部</Select.Option>
                {DELEGATE_TYPE.map((v, i) => (
                  <Select.Option key={i} value={v.key}>
                    {v.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Col>
        {/* <Col flex="200px">
          <a onClick={() => setCollapse(!collapse)}>
            {collapse ? '收起' : '展开'}&nbsp;
            <UpOutlined
              className={
                collapse
                  ? `${styles.collapseTag} ${styles.collapseTagUp}`
                  : `${styles.collapseTag} ${styles.collapseTagDown}`
              }
            />
          </a>
        </Col> */}
      </Row>

      <Space>
        <Button type="primary" onClick={onSearch}>
          查询
        </Button>

        <Button onClick={resetForm}>重置</Button>

        {/* <Button type="primary" onClick={props.changeVisible}>
          选择分配
        </Button>

        <Button type="primary" onClick={() => props.setBatchedVisible(true)}>
          按量分配
        </Button> */}
      </Space>
    </Card>
  )
}
