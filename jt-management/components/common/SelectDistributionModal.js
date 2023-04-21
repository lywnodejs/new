import {Row, Col, message, Modal, Select} from 'antd'
import {values} from 'lodash'
import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import apiReview from '~/api/review'

function SelectDistributionModal(props) {
  const {
    visible,
    onHide,
    orderIds,
    selectData,
    assignType,
    verifyStatus,
  } = props
  const [selectValue, setSelectValue] = useState([])
  useEffect(() => {
    async function fetchData() {}
    visible && fetchData()
  }, [visible])

  const handleChange = (value) => {
    setSelectValue(value)
  }

  const onEdit = async () => {
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_assign_update({
        assignType: assignType,
        verifyStatus: verifyStatus,
        checkedOrder: orderIds,
        checkedUser: selectValue,
      })
      if (code == 0) {
        message.success('选择分配成功')
        onHide()
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Modal
      title="选择分配"
      maskClosable={false}
      visible={visible}
      onOk={onEdit}
      onCancel={onHide}
      cancelText="取消"
      okText="确定"
      width={600}
      height={600}
      destroyOnClose
    >
      <Row gutter={[0, 16]}>
        <Col span={4}>选中数量：</Col>
        <Col span={20}>
          {Array.isArray(orderIds) ? orderIds.length : 0}个，请选择分配对象
        </Col>
      </Row>
      <Row gutter={[0, 260]}>
        <Col span={2}>人员：</Col>
        <Col span={22}>
          <Select style={{width: 500}} mode="multiple" onChange={handleChange}>
            {selectData.map((v, i) => (
              <Select.Option key={i} value={v.id}>
                {v.accountName}_{v.roleName}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Modal>
  )
}

export default SelectDistributionModal
