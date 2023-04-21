import {
  Form,
  Input,
  message,
  Select,
  Modal,
  InputNumber,
  TreeSelect,
  Row,
  Col,
  Result,
  Button,
} from 'antd'
import {useEffect, useState, useRef} from 'react'
import SucessModal from './SucessModal'
import api from '~/api/product'

const repaymentTypes = [
  {name: '等额本息', value: '1'},
  {name: '等额本金', value: '2'},
  {name: '先息后本', value: '3'},
]
function UpdateForm(props) {
  const [updateForm] = Form.useForm()
  const {
    selectIndex,
    visible,
    onHide,
    selectItem,
    pullData,
    setVisible,
    initProductId,
  } = props
  const [successVisible, setSuccessVisible] = useState(false)

  useEffect(() => {
    if (selectIndex == -1) {
      updateForm.resetFields()
    } else {
      let types = selectItem.repaymentType.split('、')
      let newTypes = types.map((v) => {
        let findItem = repaymentTypes.find((one) => one.name == v)
        if (findItem) {
          return findItem.value
        }
      })
      updateForm.setFieldsValue({
        ...selectItem,
        repaymentType: newTypes,
      })
    }
  }, [visible, selectIndex])

  const onEdit = async () => {
    try {
      const values = await updateForm.validateFields()
      if (selectIndex == -1) {
        const {data} = await api.add_product({
          ...values,
          repaymentType: values.repaymentType.join('、'),
        })
        if (data.code == 0) {
          pullData()
          setSuccessVisible(true)
          setVisible(false)
        }
      } else {
        const {data} = await api.edit_product({
          ...values,
          id: selectItem.id,
          repaymentType: values.repaymentType.join('、'),
        })
        if (data.code == 0) {
          pullData()
          setSuccessVisible(true)
          setVisible(false)
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const changeRepaymentTypes = (val) => {
    updateForm.setFieldsValue('repaymentType', val)
  }
  const onCancel = () => {
    setSuccessVisible(false)
    onHide()
  }
  const configure = () => {
    location.href = `/decision/edit?productId=${initProductId}`
  }
  return (
    <>
      <Modal
        title={selectIndex === -1 ? '新增' : '编辑'}
        maskClosable={false}
        visible={visible}
        destroyOnClose
        forceRender
        onOk={onEdit}
        onCancel={onHide}
        cancelText="取消"
        okText="确定"
      >
        <Form
          form={updateForm}
          name="updateForm"
          initialValues={{
            productName: '',
          }}
        >
          <Form.Item
            label="产品名称"
            name="productName"
            rules={[
              {required: true, message: '请输入产品名称'},
              ({getFieldValue}) => ({
                validator(rule, value) {
                  if (value && (value.length < 1 || value.length > 10)) {
                    return Promise.reject('输入范围大于1字符，小于等于10字符')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input placeholder="支持中英文、数字和下划线" />
          </Form.Item>
          <Form.Item
            label="还款方式"
            name="repaymentType"
            rules={[{required: true, message: '请选择还款方式'}]}
          >
            <Select
              onChange={(val) => changeRepaymentTypes(val)}
              mode="multiple"
              placeholder="请选择还款方式"
              optionFilterProp="children"
              allowClear
              showArrow
            >
              <Select.Option value="1">等额本息</Select.Option>
              <Select.Option value="2">等额本金</Select.Option>
              <Select.Option value="3">先息后本</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="loanDays"
            label="贷款期限"
            rules={[
              {required: true, message: '请输入贷款期限'},
              ({getFieldValue}) => ({
                validator(rule, value) {
                  if (!/^[0-9,]+$/.test(value)) {
                    return Promise.reject('贷款期限只能输入整数')
                  } else {
                    return Promise.resolve()
                  }
                },
              }),
            ]}
          >
            <Input placeholder="请输入整数，多个请用“ , ”隔开" suffix="期" />
          </Form.Item>

          <div style={{position: 'relative'}}>
            <Form.Item
              name="limitMin"
              label="额度范围"
              rules={[
                {required: true, message: '请输入额度范围'},
                ({getFieldValue}) => ({
                  validator(rule, value) {
                    if (value > 1000000) {
                      return Promise.reject('输入范围大于0小于1000000')
                    }

                    if (!Number.isInteger(Number(value)) || Number(value) < 1) {
                      return Promise.reject('请输入正整数')
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <InputNumber
                placeholder="请输入"
                min={0}
                style={{width: '48%'}}
              />
            </Form.Item>
            <div style={{position: 'absolute', top: 5, left: '59%'}}>-</div>
            <Form.Item
              name="limitMax"
              style={{position: 'absolute', top: 0, right: 0}}
              rules={[
                {required: true, message: '请输入额度范围'},
                ({getFieldValue}) => ({
                  validator(rule, value) {
                    if (value > 1000000) {
                      return Promise.reject('输入范围大于0小于1000000')
                    }
                    if (!Number.isInteger(Number(value)) || Number(value) < 1) {
                      return Promise.reject('请输入正整数')
                    }
                    if (value < getFieldValue('limitMin')) {
                      return Promise.reject('输入范围错误，请重新输入')
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <InputNumber
                placeholder="请输入"
                // min={0}
                style={{width: 180}}
              />
            </Form.Item>
            {/* </Form.Item> */}
          </div>

          <Form.Item label="上游产品ID" name="produceId">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="支持中英文、数字和下划线" />
          </Form.Item>
        </Form>
        {/* <SucessModal
        {...{
          successVisible,
          // onHide: () => {
          //   Router.back()
          // },
        }}
      /> */}
      </Modal>
      <Modal
        title=""
        maskClosable={false}
        visible={successVisible}
        // onOk={onEdit}
        onCancel={onCancel}
        footer={null}
      >
        <Result
          status="success"
          title="产品配置成功"
          extra={[
            <Button type="primary" key="console" onClick={configure}>
              继续，决策配置
            </Button>,
            <Button key="buy" onClick={onCancel}>
              关闭
            </Button>,
          ]}
        />
      </Modal>
    </>
  )
}

export default UpdateForm
