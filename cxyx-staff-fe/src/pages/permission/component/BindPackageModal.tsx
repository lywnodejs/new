import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, message, Modal } from 'antd';
import { PackClass, PackName } from './allSelect';
import { bindJobDutyAndPrivilegePackage } from '@/utils/api/permission';
// import { getResponseData } from "../../utils/api/path";
// import { addTableParams } from "../../components/EasyTable/EasyParamStore";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const BindPackageModal = props => {
  const formRef: any = useRef();
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const handleCancel = () => {
    if (typeof props.closeModal === 'function') {
      props.closeModal();
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      jobDutyId: null,
      privilegePackageId: null
    })
    setDisabled(true)
  }, [props.isModalVisible])

  const handleSubmit = values => {
    setConfirmLoading(true);
    const params = {
      jobDutyId: props.data.jobDutyId,
      privilegePackageId: values.privilegePackageId
    };
    bindJobDutyAndPrivilegePackage(params).then(res => {
      setConfirmLoading(false);
      props.closeModal()
      if (res.errno === 0) {
        message.success('绑定成功')
      } else {
        message.error(res.errmsg || '')
      }
    })
  };

  const handleOk = () => {
    form.submit();
  };
  const handleChange = (val) => {
    if (val) {
      formRef.current.getList(val);
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }

  return (
    <Modal
      title={'新增节点'}
      visible={props.isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form form={form} {...layout} name="basic" onFinish={handleSubmit}>
        <Form.Item
          label="权限包分类"
          name="jobDutyId"
          rules={[{ message: '请选择权限包分类' }]}
        >
          <PackClass
            onChange={handleChange}
          />
        </Form.Item>
        {
          form.getFieldValue('orgId') !== '' ?
            <Form.Item
              label="权限包名称"
              name="privilegePackageId"
              rules={[{ required: true, message: '请选择权限包名称' }]}
            >
              <PackName
                ref={formRef}
                val={form.getFieldValue('jobDutyId')}
                disabled={disabled} />
            </Form.Item>
            :
            null
        }


      </Form>
    </Modal>
  );
};

export default BindPackageModal;
