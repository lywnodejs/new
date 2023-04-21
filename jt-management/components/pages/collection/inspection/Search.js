import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
} from 'antd'
import React, {useState} from 'react'
import {UpOutlined} from '@ant-design/icons'
import styles from '../index.less'
import {QUALIFI_TYPE, CHECK_REASON} from '~/utils/const'
const {RangePicker} = DatePicker
export default function (props) {
  const [form] = Form.useForm()

  const [collapse, setCollapse] = useState(true)

  const onSearch = () => {
    let {time, ...values} = form.getFieldsValue()

    if (time) {
      let s_time = time[0].format('YYYY-MM-DD')
      let e_time = time[1].format('YYYY-MM-DD')
      values.beginCreateTimeString = s_time
      values.endCreateTimeString = e_time
      // values.beginCreateTime = new Date(s_time)
      // values.endCreateTime = new Date(e_time)
    }

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
              creviewQualification: '',
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

            <Form.Item name="creviewQualification" label="综合资质">
              <Select style={{width: 130}}>
                <Select.Option value="">全部</Select.Option>
                {QUALIFI_TYPE.map((v, i) => (
                  <Select.Option key={i} value={v.key}>
                    {v.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="检查日期" name="time">
              <RangePicker />
            </Form.Item>
          </Form>
        </Col>
        <Col flex="200px">
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
        </Col>
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
