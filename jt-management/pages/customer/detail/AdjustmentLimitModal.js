import {
  Form,
  Input,
  Button,
  Modal,
  InputNumber,
  Radio,
  DatePicker,
  message,
} from 'antd'
import {useEffect, useState, useRef} from 'react'
import moment from 'moment'
import apicustomer from '~/api/customer'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const QuotaStatus = {
  '1': '正常',
  '2': '冻结',
}
let startTime = new Date().toLocaleDateString()
function AdjustmentLimitModal(props) {
  const [adjustmentForm] = Form.useForm()
  const {
    itemList,
    classificationDoVisble,
    handleCancelDo,
    productConversion,
    disabledDate,
    onHide,
    keyId,
    fetchCustomerDetail,
  } = props
  const [returnData, setReturnData] = useState([])
  const [confirmModal, setConfirmModal] = useState(false)
  const [timeDate, setTimeDate] = useState([])
  useEffect(() => {
    adjustmentForm.setFieldsValue({
      ...itemList,
      fixedEndDate: moment(itemList.fixedEndDate),
    })
  }, [classificationDoVisble])

  const onChange = (value, dateString) => {
    setTimeDate(dateString)
  }
  const nextStep = async () => {
    const values = await adjustmentForm.validateFields()
    setReturnData(values)
    setConfirmModal(true)
  }
  const goBack = () => {
    setConfirmModal(false)
  }

  const getTargetDate = (startDate, days) => {
    let startTime = new Date(startDate).getTime()
    let diff = days * 86400 * 1000
    let endTime = startTime + diff
    let d = new Date(endTime)
    let CurrentDate = ''
    CurrentDate += d.getFullYear()
    //var year=(d.getFullYear())+"-"+(d.getMonth()+1)+"-"+(d.getDate());
    if (d.getMonth() + 1 > 9) {
      CurrentDate += '-' + (d.getMonth() + 1)
    } else {
      CurrentDate += '-0' + (d.getMonth() + 1)
    }
    if (d.getDate() > 9) {
      CurrentDate += '-' + d.getDate()
    } else {
      CurrentDate += '-0' + d.getDate()
    }
    return CurrentDate
  }

  const subMit = async () => {
    let postData = {
      id: itemList.id,
      fixedLimitAmount: returnData.fixedLimitAmount,
      fixedEndDate: moment(returnData.fixedEndDate).format('YYYY-MM-DD'),
      frozenEndType: returnData.frozenEndType,
      accountStatus: returnData.accountStatus == '正常' ? 1 : 2,
    }
    if (returnData.accountStatus == '冻结' && returnData.frozenEndType == '1') {
      postData = {
        ...postData,
        frozenEndDate: Number(returnData.frozenEndDay),
      }
    }
    try {
      const {
        data: {data, code},
      } = await apicustomer.update_user_limitAmount(postData)
      if (code == 0) {
        message.success('提交成功')
        setConfirmModal(false)
        onHide()
        fetchCustomerDetail()
      }
    } catch (err) {
      console.log(err)
      setConfirmModal(false)
      onHide()
    }
  }

  return (
    <div>
      <Modal
        title="调整额度"
        visible={classificationDoVisble}
        width={400}
        onCancel={onHide}
        footer={[
          <Button key="back" onClick={handleCancelDo}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={nextStep}>
            下一步
          </Button>,
        ]}
        getContainer={false}
      >
        <Form name="adjustmentForm" key={Date.now} form={adjustmentForm}>
          <FormItem>
            <span style={{fontWeight: 600, fontSize: 18}}>
              {itemList.userName}&nbsp;&nbsp;&nbsp;&nbsp;
              {productConversion(itemList.productId)}
            </span>
          </FormItem>
          <FormItem
            label="授信额度"
            name="fixedLimitAmount"
            rules={[
              {required: true, message: '请输入授信额度'},
              ({getFieldValue}) => ({
                validator(rule, value) {
                  if (
                    value &&
                    (Number(value) < 1 || !Number.isInteger(Number(value)))
                  ) {
                    return Promise.reject('请输入正整数')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input suffix="元" width={50} />
          </FormItem>
          <FormItem
            label="额度状态"
            name="accountStatus"
            rules={[{required: true, message: '请选择额度状态'}]}
          >
            <RadioGroup>
              <Radio value="正常">正常</Radio>
              <Radio value="冻结">冻结</Radio>
            </RadioGroup>
          </FormItem>
          <div style={{position: 'relative'}}>
            <FormItem
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.accountStatus !== currentValues.accountStatus
              }
            >
              {({getFieldValue}) => {
                if (getFieldValue('accountStatus') == '冻结') {
                  return (
                    <FormItem
                      label="冻结时长"
                      name="frozenEndType"
                      style={{marginTop: 20}}
                      rules={[{required: true, message: '请选择冻结时长类型'}]}
                    >
                      <RadioGroup>
                        <Radio value={1}>冻结</Radio>
                        <Radio value={2} style={{marginLeft: 90}}>
                          至有效期
                        </Radio>
                      </RadioGroup>
                    </FormItem>
                  )
                }
              }}
            </FormItem>
            <FormItem
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.frozenEndType !== currentValues.frozenEndType ||
                prevValues.accountStatus !== currentValues.accountStatus
              }
              style={{position: 'absolute', left: 140, top: 0}}
            >
              {({getFieldValue}) => {
                if (
                  getFieldValue('frozenEndType') == 1 &&
                  getFieldValue('accountStatus') == '冻结'
                ) {
                  return (
                    <FormItem
                      name="frozenEndDay"
                      rules={[
                        {required: true, message: '请填写冻结天数'},
                        ({getFieldValue}) => ({
                          validator(rule, value) {
                            if (value > 9999999) {
                              return Promise.reject(
                                '输入冻结天数过多，请重新输入',
                              )
                            }
                            if (
                              !Number.isInteger(Number(value)) ||
                              Number(value) < 1
                            ) {
                              return Promise.reject(
                                '冻结天数为正整数，请重新输入',
                              )
                            }
                            return Promise.resolve()
                          },
                        }),
                      ]}
                    >
                      <Input style={{width: 80}} suffix="天" />
                    </FormItem>
                  )
                }
              }}
            </FormItem>
            <FormItem
              label="额度有效期"
              name="fixedEndDate"
              rules={[{required: true, message: '请选择额度有效期'}]}
            >
              <DatePicker
                allowClear
                disabledDate={disabledDate}
                onChange={onChange}
              />
            </FormItem>
          </div>
        </Form>
      </Modal>
      <Modal
        title="操作确认"
        visible={confirmModal}
        width={400}
        onCancel={() => setConfirmModal(false)}
        footer={[
          <Button key="back" onClick={goBack}>
            返回修改
          </Button>,
          <Button key="submit" type="primary" onClick={subMit}>
            确认提交
          </Button>,
        ]}
      >
        <div style={{fontWeight: 600, fontSize: 18}}>
          {itemList.userName}&nbsp;&nbsp;&nbsp;&nbsp;
          {productConversion(itemList.productId)}
        </div>
        <div style={{marginTop: 20, fontSize: 18}}>
          授信额度：{returnData.fixedLimitAmount}
        </div>
        <div style={{marginTop: 20, fontSize: 18}}>
          额度状态：
          {returnData.accountStatus == '正常'
            ? returnData.accountStatus
            : returnData.accountStatus == '冻结' &&
              returnData.frozenEndType == 2
            ? `${returnData.accountStatus}，冻结至有效期`
            : `${returnData.accountStatus}，冻结至${getTargetDate(
                startTime,
                returnData.frozenEndDay,
              )}`}
        </div>
        <div style={{marginTop: 20, fontSize: 18}}>
          额度有效期: {moment(returnData.fixedEndDate).format('YYYY-MM-DD')}
        </div>
      </Modal>
    </div>
  )
}

AdjustmentLimitModal.getInitialProps = async () => ({})

export default AdjustmentLimitModal
