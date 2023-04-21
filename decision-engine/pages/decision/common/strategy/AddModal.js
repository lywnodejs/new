import {Form, Input, message, Modal} from 'antd'
import {useEffect} from 'react'
import {findApiByKey, findFieldByKey} from '../mapActionToApi'

function StrategyForm(props) {
  const [StrategyForm] = Form.useForm()
  const {
    selectIndex,
    visible,
    onHide,
    selectItem,
    pullData,
    activeKey,
    activeCategoryKey,
    activeModuleKey,
  } = props

  useEffect(() => {
    if (visible) {
      if (selectIndex == -1) {
        StrategyForm.resetFields()
      } else {
        StrategyForm.setFieldsValue({
          code: selectItem[findFieldByKey(+activeCategoryKey, 'code')],
          name: selectItem[findFieldByKey(+activeCategoryKey, 'name')],
          description: selectItem.description,
        })
      }
    }
  }, [visible, selectIndex])

  const onEdit = async () => {
    try {
      const values = await StrategyForm.validateFields()
      let postApi = findApiByKey(
        +activeCategoryKey,
        {
          ...values,
          activeKey,
          activeModuleKey,
          id: selectIndex === -1 ? null : selectItem.id,
        },
        selectIndex === -1 ? 'add' : 'edit',
      )

      const {data} = await postApi()

      if (data.code == 0) {
        onHide()
        message.success('保存成功')
        pullData()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  return (
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
        key={Date.now}
        form={StrategyForm}
        name="StrategyForm"
        initialValues={{}}
      >
        <Form.Item
          label="编号"
          name="code"
          rules={[
            {required: true, message: '请输入编号'},
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
          <Input placeholder="请输入" disabled={selectIndex != -1} />
        </Form.Item>

        <Form.Item
          label="名称"
          name="name"
          rules={[
            {required: true, message: '请输入名称'},
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
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item
          label="说明"
          name="description"
          rules={[
            {required: true, message: '请输入说明'},
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
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

StrategyForm.getInitialProps = async () => ({})

export default StrategyForm
