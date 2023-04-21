import React, { useRef, useState, useEffect } from 'react';
import { Modal } from 'antd';
import NodeForm from './NodeForm';
import { OPERATE_TYPE } from '@/pages/partner/organization/constant';

const NodeAddModal = props => {
  const formRef: any = useRef();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleCancel = () => {
    if (typeof props.closeModal === 'function') {
      props.closeModal();
    }
  };

  const handleSubmitting = loading => {
    setConfirmLoading(loading);
    if (!loading && typeof props.closeModal === 'function') {
      props.closeModal();
    }
  };

  const handleOk = () => {
    formRef.current.getForm().submit();
  };

  useEffect(() => {
    if (props.isModalVisible && formRef.current) {
      formRef.current.getForm().resetFields();
    }
  }, [props.isModalVisible]);

  return (
    <Modal
      title={'新增节点'}
      visible={props.isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <NodeForm
        ref={formRef}
        node={props.node}
        handleSubmitting={handleSubmitting}
        operateType={OPERATE_TYPE.INSERT}
      />
    </Modal>
  );
};

export default NodeAddModal;
