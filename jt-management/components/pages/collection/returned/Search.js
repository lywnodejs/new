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
import styles from '../index.less'
const {RangePicker} = DatePicker
export default function (props) {
  const [form] = Form.useForm()

  const [collapse, setCollapse] = useState(true)
  const [amountIsError, setAmountIsError] = useState(false)
  const [dayIsError, setDayIsError] = useState(false)
  const [searchChildren, setSearchChildren] = useState(true)

  const onSearch = () => {
    let {
      time,
      loantime,
      needloantime,
      backloantime,
      ...values
    } = form.getFieldsValue()
    const amountIsError =
      values.maxPlanCapitalAmount < values.minPlanCapitalAmount
    const dayIsError = values.maxOverdueDays < values.minOverdueDays
    setAmountIsError(amountIsError)
    setDayIsError(dayIsError)
    if (amountIsError || dayIsError) {
      if (amountIsError) {
        form.setFieldsValue({maxPlanCapitalAmount: ''})
      }
      if (dayIsError) {
        form.setFieldsValue({maxOverdueDays: ''})
      }
      return
    }

    if (time) {
      values.beginCreateTime = time[0].format('YYYY-MM-DD')
      values.endCreateTime = time[1].format('YYYY-MM-DD')
    }

    if (loantime) {
      values.beginGrantTime = loantime[0].format('YYYY-MM-DD')
      values.endGrantTime = loantime[1].format('YYYY-MM-DD')
    }

    if (needloantime) {
      values.beginPlanRepayTime = needloantime[0].format('YYYY-MM-DD')
      values.endPlanRepayTime = needloantime[1].format('YYYY-MM-DD')
    }

    if (backloantime) {
      values.beginRealRepayTime = backloantime[0].format('YYYY-MM-DD')
      values.endRealRepayTime = backloantime[1].format('YYYY-MM-DD')
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
              collectionLevel: '',
              companyId: '',
              collectionToday: '',
            }}
            layout="inline"
          >
            <Form.Item label="手机号/借据号" name="keyword">
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item label="用户名" name="name">
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

            <Form.Item name="collectionLevel" label="催收级别">
              <Select style={{width: 130}}>
                <Select.Option value="">全部</Select.Option>
                {props.collectionLevels.map((v, i) => (
                  <Select.Option key={i} value={v.code}>
                    {v.description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="借款期数" name="loanTerms">
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item label="距离上次催记" name="noCollectionDays">
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item
              label="逾期本金"
              validateStatus={amountIsError && 'error'}
              help={amountIsError && '逾期本金输入有误，请检查。'}
            >
              <Form.Item
                name="minPlanCapitalAmount"
                style={{display: 'inline-block', marginRight: 0}}
              >
                <InputNumber
                  min={0}
                  placeholder="请输入"
                  style={{width: 150}}
                />
              </Form.Item>

              <span
                style={{
                  display: 'inline-block',
                  width: '24px',
                  lineHeight: '32px',
                  textAlign: 'center',
                }}
              >
                -
              </span>

              <Form.Item
                name="maxPlanCapitalAmount"
                style={{display: 'inline-block'}}
              >
                <InputNumber
                  min={0}
                  placeholder="请输入"
                  style={{width: 150}}
                />
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="逾期天数"
              validateStatus={dayIsError && 'error'}
              help={dayIsError && '逾期天数输入有误，请检查。'}
            >
              <Form.Item
                name="minOverdueDays"
                style={{display: 'inline-block', marginRight: 0}}
              >
                <InputNumber min={0} placeholder="请输入" />
              </Form.Item>

              <span
                style={{
                  display: 'inline-block',
                  width: '24px',
                  lineHeight: '32px',
                  textAlign: 'center',
                }}
              >
                -
              </span>

              <Form.Item
                name="maxOverdueDays"
                style={{display: 'inline-block'}}
              >
                <InputNumber min={0} placeholder="请输入" />
              </Form.Item>
            </Form.Item>

            <Form.Item label="今日已联系" name="collectionToday">
              <Select style={{width: '100px'}}>
                <Select.Option value="">不限</Select.Option>
                <Select.Option value="1">已联系</Select.Option>
                <Select.Option value="2">未联系</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="入催日期" name="time">
              <RangePicker />
            </Form.Item>

            <Form.Item label="放款日期" name="loantime">
              <RangePicker />
            </Form.Item>

            <Form.Item label="应还日期" name="needloantime">
              <RangePicker />
            </Form.Item>

            <Form.Item label="还款日期" name="backloantime">
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
