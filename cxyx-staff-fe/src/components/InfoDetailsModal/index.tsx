import React, { useState, useRef } from 'react';
import { Button, Modal, Descriptions } from 'antd';
import { useImperativeHandle } from 'react';
import './index.less';

/**
 * @description 简单详情展示
 * @param props 
 */
interface mapDataList {
  mapDataList: Array<[{ name: '', value: '' }]>
}

export interface InfoDetailsModalProps<RecordType> {
  mapDataList // 展示数据
}

const InfoDetailsModalChild = <RecordType extends object = any>(
  props: InfoDetailsModalProps<RecordType>,
  ref
) => {
  const { mapDataList } = props;
  const [modalVisible, setModalVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    setModalVisible: (bool) => {
      setModalVisible(bool)
    }
  }))

  return (
    <Modal
      title="详情"
      width={800}
      visible={modalVisible}
      onOk={() => setModalVisible(false)}
      onCancel={() => setModalVisible(false)}
      footer={[
        <Button type="primary" key="back" onClick={() => setModalVisible(false)}>
          关闭
        </Button>
      ]}
    >

      <Descriptions column={1} bordered>
        {
          mapDataList && mapDataList.map(item => {
            return (
              <Descriptions.Item key={item.name} labelStyle={{ minWidth: '120px' }} label={item.name}>
                <div className='info-detail__content'>{item.value}</div>
              </Descriptions.Item>
            )
          })
        }
      </Descriptions>
    </Modal >
  )
}
const InfoDetailsModal = React.forwardRef(InfoDetailsModalChild)

export default InfoDetailsModal