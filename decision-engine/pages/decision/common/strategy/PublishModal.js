import {Form, Input, message, Modal, Row, Col} from 'antd'
import {useEffect, useState} from 'react'
import {findNameByKey, findFieldByKey, findApiByKey} from '../mapActionToApi'

function PublishSubmitModal(props) {
  const [publishSubmitForm] = Form.useForm()
  const {
    activeKey,
    activeCategoryKey,
    activeModuleKey,
    variableIds,
    visible,
    onHide,
    pullData,
    list,
  } = props
  const [codes, setCodes] = useState([])

  useEffect(() => {
    if (visible) {
      publishSubmitForm.resetFields()
      let findCodes = findCodesInVariables()
      setCodes([...findCodes])
    }
  }, [visible])

  const findCodesInVariables = () => {
    const codes = []
    variableIds.forEach((one) => {
      let findItem =
        Array.isArray(list.list) && list.list.find((item) => item.id == one)
      if (findItem) {
        codes.push(findItem[findFieldByKey(+activeCategoryKey, 'code')])
      }
    })
    return codes
  }

  const onEdit = async () => {
    try {
      const values = await publishSubmitForm.validateFields()

      let postApi = findApiByKey(
        +activeCategoryKey,
        {
          bizCodes: codes,
          productId: activeKey,
          moduleType: activeModuleKey,
          submitDesc: values.submitDesc,
        },
        'publish',
      )

      const {
        data: {data, code},
      } = await postApi()

      if (code == 0) {
        onHide()
        message.success('发布成功')
        pullData()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  return (
    <Modal
      title={'发布提交'}
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
        key={Date.now}
        form={publishSubmitForm}
        name="publishSubmitForm"
        initialValues={{
          submitDesc: '',
        }}
      >
        <Row>
          <Col>类目：</Col>

          <Col>{findNameByKey(+activeCategoryKey)}</Col>
        </Row>

        <Row>
          <Col>编号：</Col>

          <Col>{codes.join('，')}</Col>
        </Row>

        <Form.Item
          label="反馈详情"
          name="submitDesc"
          rules={[
            {required: true, message: '请输入反馈详情'},
            ({getFieldValue}) => ({
              validator(rule, value) {
                if (value && value.length > 50) {
                  return Promise.reject('输入范围大于0字符，小于等于50字符')
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input.TextArea placeholder="请至少输入五个字符" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

PublishSubmitModal.getInitialProps = async () => ({})

export default PublishSubmitModal
