import {Modal, Form, Input} from 'antd'
import {useEffect, useState} from 'react'
import api from '~/utils/api'

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 15},
}

const getData = async (companyId) => {
  let {
    data: {code, data},
  } = await api.getDSConfig({companyId})
  if (code == 0) {
    return data
  }
  return []
}

const EditModal = (props) => {
  const [show, setShow] = useState(props.show)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [itemData, setItemData] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    setShow(props.show)
    if (!props.show) {
      form.resetFields()
      setConfirmLoading(false)
    } else {
      async function fetchData() {
        const paramList = await getData(props.data.id)
        const newData = {...props.data, paramList}
        setItemData(newData)
        form.setFieldsValue(newData)
      }
      fetchData()
    }
  }, [props])

  const handleCancel = () => {
    props.close('config')
  }

  const handleOk = () => {
    setConfirmLoading(true)
    form
      .validateFields()
      .then(async (values) => {
        const params = {
          companyId: props.data.id,
          paramList: values.paramList,
        }
        let {
          data: {code},
        } = await api.editDSConfig(params)
        setConfirmLoading(false)
        if (code == 0) {
          props.close('config', true)
        }
      })
      .catch((err) => {
        setConfirmLoading(false)
      })
  }

  return (
    <Modal
      title={
        <div>
          <span>账号配置</span>
          <span style={{color: '#999', marginLeft: 5, fontSize: 12}}>
            （此账号配置后，将应用于该数据源下所有数据产品）
          </span>
        </div>
      }
      visible={show}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form {...layout} form={form} name="basic">
        <Form.Item label="数据源名称" name="companyName">
          <Input disabled />
        </Form.Item>

        <Form.List name="paramList">
          {(fields) => {
            return (
              <div>
                {fields.map((field) => {
                  const v = itemData.paramList[field.fieldKey]
                  return (
                    <Form.Item
                      {...field}
                      label={v.name}
                      name={[field.name, 'value']}
                      rules={[
                        {
                          required: true,
                          message: `${v.name}不可为空`,
                        },
                      ]}
                    >
                      <Input.TextArea rows={3} />
                    </Form.Item>
                  )
                })}
              </div>
            )
          }}
        </Form.List>
      </Form>
    </Modal>
  )
}
export default EditModal
