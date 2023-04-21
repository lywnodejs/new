import {Row, Col, message, Modal} from 'antd'
import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import api from '~/api/collection'
import TreeMembers from './TreeMembers'

function AssignModal(props) {
  const {visible, onHide, orderIds, pullData, tenantId} = props
  const [pids, setPids] = useState([])
  const [accountIds, setAccountIds] = useState([])
  const [accountNames, setAccountNames] = useState([])
  const [companyIds, setCompanyIds] = useState([])

  useEffect(() => {
    async function fetchData() {}
    visible && fetchData()
  }, [visible])

  const onEdit = async () => {
    console.log(pids)
    try {
      if (pids.length) {
        const pidSource = Math.max.apply(null, pids)
        const pidTarget = Math.min.apply(null, pids)
        if (pidSource !== pidTarget) {
          return message.error('分配对象需同一岗位级别')
        }
      }
      if (!accountIds.length) {
        return message.error('请选择要分配的催收员')
      }
      if (orderIds.length < accountIds.length) {
        return message.error('催收单数量不能小于催收员数量')
      }

      const {
        data: {data, code},
      } = await api.edit_overdueAlloc_allselect({
        type: 1,
        collectionOrderIdList: orderIds,
        accountIdList: accountIds,
        accountNameList: accountNames,
        companyIdList: companyIds,
        tenantId,
      })
      if (code == 0) {
        onHide()
        message.success('选择分配成功')
        pullData()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
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
    >
      <Row gutter={[0, 16]}>
        <Col span={4}>选中数量：</Col>
        <Col span={20}>{orderIds.length}个，请选择分配对象</Col>
      </Row>
      <Row gutter={[0, 260]}>
        <Col span={2}>人员：</Col>
        <Col span={22}>
          <TreeMembers
            onSetPids={(payload) => setPids(payload)}
            onSetAccountIds={(payload) => setAccountIds(payload)}
            onSetAccountNames={(payload) => setAccountNames(payload)}
            onSetCompanyIds={(payload) => setCompanyIds(payload)}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default AssignModal
