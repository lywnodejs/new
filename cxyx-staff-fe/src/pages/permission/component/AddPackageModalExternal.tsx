import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Input, Row, Col, message } from 'antd';
import { updateJobType, saveJobType } from '@/utils/api/permission';
import { ExternalPackClass, PackName, ObligationSelect } from './allSelect';
import NodeTypeSelect from '@/components/NodeTypeSelect';

import _ from 'lodash';

interface CollectionCreateFormProps {
  visible: boolean;
  closeModal: (bool) => void;
  values?: any;
  type?: string;
}

const AddPackageModalExternal: React.FC<CollectionCreateFormProps> = ({
  visible,
  closeModal,
  values,
  type,
}) => {
  const formRef: any = useRef();
  const [form] = Form.useForm();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedOrgType, setSelectOrgType] = useState();
  const [title, setTitle] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (type === 'new') {
      form.setFieldsValue({
        jobTypeName: null,
        privilegeTypePackageId: null,
        privilegePackage: { label: null, value: null },
        status: null,
        orgType: null,
      });
    }
    setDisabled(true);
  }, [visible]);

  useEffect(() => {
    if (!_.isEmpty(values)) {
      form.setFieldsValue({
        jobTypeName: values.jobTypeName,
        privilegeTypePackageId: values.privilegeTypePackageId,
        privilegeTypePackageName: values.privilegeTypePackageName,
        privilegePackageName: values.privilegePackageName,
        privilegePackage: {
          value: values.privilegePackageId || null,
          label: values.privilegePackageName || null,
        },
        status: values.status,
        orgType: values.orgType,
      });
    }
  }, [values]);

  useEffect(() => {
    if (type === 'new') {
      setTitle('新增职责');
    } else {
      setTitle('编辑职责');
    }
  }, [type]);

  const colLayout = {
    span: 12,
  };
  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
  };

  const handleChange = val => {
    if (val) {
      formRef.current.getList(val);
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const handleOk = () => {
    form.submit();
  };

  const formSubmit = () => {
    let params: any = {};
    setButtonLoading(true);
    if (type === 'new') {
      params = form.getFieldsValue();
      params.privilegePackageName = params.privilegePackage.label;
      params.privilegePackageId = params.privilegePackage.value;
      delete params.privilegePackage;

      saveJobType(params).then(res => {
        if (res.errno == 0) {
          message.success('新增成功');
        } else {
          message.error(res.errmsg);
        }
        setButtonLoading(false);
        closeModal(true);
      });
    } else {
      params = {
        jobTypeName: form.getFieldValue('jobTypeName'),
        status: form.getFieldValue('status'),
        orgType: form.getFieldValue('orgType'),
        privilegeTypePackageId:
          type === 'edit' && values.privilegeTypePackageId
            ? ''
            : form.getFieldValue('privilegeTypePackageId'),
        privilegePackageId:
          type === 'edit' && values.privilegePackageId
            ? ''
            : form.getFieldValue('privilegePackage').value,
        privilegePackageName:
          type === 'edit' && values.privilegePackageId
            ? ''
            : form.getFieldValue('privilegePackage').label,
        jobTypeId: values.jobTypeId,
      };
      updateJobType(params).then(res => {
        if (res.errno == 0) {
          message.success('编辑成功');
        } else {
          message.error(res.errmsg);
        }
        setButtonLoading(false);
        closeModal(true);
      });
    }
  };

  return (
    <Modal
      width={800}
      visible={visible}
      title={title}
      // footer={
      //   type === 'edit' ? <Button onClick={onCancel}>返回</Button> : undefined
      // }
      onCancel={() => closeModal(false)}
      cancelText="返回"
      okText="保存"
      onOk={handleOk}
      okButtonProps={{ loading: buttonLoading }}
    >
      <Form
        form={form}
        name="form_in_modal"
        {...layout}
        scrollToFirstError
        onFinish={formSubmit}
      >
        <Row>
          <Col {...colLayout}>
            <Form.Item
              name="jobTypeName"
              label="工作职责名称"
              rules={[{ required: true, message: '请输入工作职责名称!' }]}
            >
              <Input placeholder={'请输入'} />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label="权限包分类"
              name={
                type === 'edit' && values?.privilegeTypePackageId
                  ? 'privilegeTypePackageName'
                  : 'privilegeTypePackageId'
              }
            >
              {type === 'edit' && values?.privilegeTypePackageId ? (
                <Input disabled={true} />
              ) : (
                  <ExternalPackClass
                    disabled={type === 'edit' && values?.privilegeTypePackageId}
                    onChange={handleChange}
                    placeholder={'请输入'}
                  />
                )}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label="权限包名称"
              name={
                type === 'edit' && values.privilegePackageId
                  ? 'privilegePackageName'
                  : 'privilegePackage'
              }
            >
              {type === 'edit' && values?.privilegePackageId ? (
                <Input disabled={true} />
              ) : (
                  <PackName
                    ref={formRef}
                    // val={form.getFieldValue('privilegePackageId')}
                    placeholder={'请输入'}
                    disabled={disabled}
                    labelInValue
                  />
                )}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item label="关联实体类型" name="orgType">
              <NodeTypeSelect />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label="职责状态"
              name="status"
              rules={[{ required: true, message: '请选择职责状态' }]}
            >
              <ObligationSelect />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddPackageModalExternal;
