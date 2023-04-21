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
import styles from '../../index.less'
const {RangePicker} = DatePicker
export default function (props) {
  const [form] = Form.useForm()
  const [collapse, setCollapse] = useState(true)
  const [searchChildren, setSearchChildren] = useState(true)
  const onSearch = () => {
    let {time, ...values} = form.getFieldsValue()

    if (time) {
      values.beginCreateTime = time[0].format('YYYY-MM-DD')
      values.endCreateTime = time[1].format('YYYY-MM-DD')
    }

    console.log(searchChildren)

    props.search({
      ...values,
      searchChildren: searchChildren ? 1 : 0,
    })
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
              collectionMethod: '',
              companyId: '',
              collectionToday: '',
            }}
            layout="inline"
          >
            <Form.Item label="手机号/借据号" name="keyword">
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item name="collectionMethod" label="催收方式">
              <Select style={{width: '130px'}}>
                <Select.Option value="">全部</Select.Option>
                {props.urgeMethods.map((v, i) => (
                  <Select.Option key={i} value={v.code}>
                    {v.description}
                  </Select.Option>
                ))}
              </Select>
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

            <Form.Item label="入催日期" name="time">
              <RangePicker />
            </Form.Item>

            <Form.Item label="催收员" style={{width: '525px'}}>
              <Form.Item name="accountId" noStyle>
                <Select style={{width: 200}}>
                  <Select.Option value="">全部</Select.Option>
                  {props.userList.map((v, i) => {
                    return (
                      <Select.Option value={v.id} key={i}>
                        {v.accountName}_{v.roleName}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
              <Checkbox
                checked={searchChildren}
                onChange={(e) => {
                  setSearchChildren(!searchChildren)
                }}
                style={{marginLeft: '10px'}}
              >
                查询子账号
              </Checkbox>
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
