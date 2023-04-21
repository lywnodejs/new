import {message, Modal, Row, Col} from 'antd'
import {useEffect} from 'react'
import {findApiByKey} from './mapActionToApi'

function DeleteBatchedModal(props) {
  const {
    visible,
    onHide,
    variableIds,
    setVariableIds,
    pullData,
    activeKey,
    activeCategoryKey,
    activeModuleKey,
    deleteAllOnClient,
  } = props

  const onEdit = async () => {
    try {
      let postApi = findApiByKey(
        +activeCategoryKey,
        {
          ids: variableIds,
          activeKey,
          activeModuleKey,
        },
        'delete',
      )

      const {
        data: {data, code},
      } = await postApi()

      if (code == 0) {
        onHide()
        setVariableIds([])
        message.success('删除成功')
        pullData()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  return (
    <Modal
      title="删除"
      maskClosable={false}
      visible={visible}
      onOk={deleteAllOnClient || onEdit}
      onCancel={onHide}
      cancelText="取消"
      okText="确定"
      width={600}
      height={600}
    >
      <Row gutter={[0, 16]}>
        <Col span={4}>选中数量：</Col>
        <Col span={20}>
          {Array.isArray(variableIds) ? variableIds.length : 0}个
        </Col>
      </Row>
      <Row>
        <Col span={20}>你确定要删除么？</Col>
      </Row>
    </Modal>
  )
}

export default DeleteBatchedModal
