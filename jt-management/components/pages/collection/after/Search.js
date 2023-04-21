import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  DatePicker,
  InputNumber,
  Checkbox,
} from 'antd'
import React, {useState} from 'react'
import {UpOutlined} from '@ant-design/icons'
import {CHECK_TYPE} from '~/utils/const'
import styles from '../index.less'
const {RangePicker} = DatePicker
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
              productId: '',
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

            <Form.Item name="productId" label="产品名">
              <Select style={{width: 130}}>
                <Select.Option value="">全部</Select.Option>
                {props.productList.map((v, i) => (
                  <Select.Option key={i} value={v.id}>
                    {v.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="reviewStatus" label="检查状态">
              <Select style={{width: 130}}>
                <Select.Option value="">全部</Select.Option>
                {CHECK_TYPE.map((v, i) => (
                  <Select.Option key={i} value={v.key}>
                    {v.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Col>
        {/*<Col flex="200px">*/}
        {/*  /!*<a onClick={() => setCollapse(!collapse)}>*!/*/}
        {/*  /!*  {collapse ? '收起' : '展开'}&nbsp;*!/*/}
        {/*  /!*  <UpOutlined*!/*/}
        {/*  /!*    className={*!/*/}
        {/*  /!*      collapse*!/*/}
        {/*  /!*        ? `${styles.collapseTag} ${styles.collapseTagUp}`*!/*/}
        {/*  /!*        : `${styles.collapseTag} ${styles.collapseTagDown}`*!/*/}
        {/*  /!*    }*!/*/}
        {/*  /!*  />*!/*/}
        {/*  /!*</a>*!/*/}
        {/*</Col>*/}
      </Row>

      <Space>
        <Button type="primary" onClick={onSearch}>
          查询
        </Button>

        <Button onClick={resetForm}>重置</Button>
      </Space>
    </Card>
  )
}
