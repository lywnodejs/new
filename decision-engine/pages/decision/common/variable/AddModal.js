import {Form, message, Modal} from 'antd'
import BaseVariableForm from '../BaseVariableForm'
import {useEffect} from 'react'
import api from '~/api/risk'

function variableForm(props) {
  const [variableForm] = Form.useForm()
  const {
    selectIndex,
    visible,
    onHide,
    selectItem,
    pullData,
    activeKey,
    activeCategoryKey,
    fetchGroups,
    groups,
  } = props

  useEffect(() => {
    if (selectIndex == -1) {
      variableForm.resetFields()
    } else {
      variableForm.setFieldsValue({
        ...selectItem,
      })
    }
  }, [visible, selectIndex])

  const onEdit = async () => {
    try {
      const values = await variableForm.validateFields()
      const postData = {
        ...values,
        productId: activeKey,
        fieldType: activeCategoryKey,
        id: selectIndex == -1 ? null : selectItem.id,
      }

      const {data} = await api.update_risk_variable(postData)

      if (data.code == 0) {
        onHide()
        message.success('保存成功')
        pullData()
        fetchGroups()
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
      <BaseVariableForm
        {...{groups, activeKey, activeCategoryKey, variableForm}}
      />
    </Modal>
  )
}

variableForm.getInitialProps = async () => ({})

export default variableForm
