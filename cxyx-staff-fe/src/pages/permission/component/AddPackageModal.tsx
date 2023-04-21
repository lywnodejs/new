import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Input, Row, Col, message, Radio } from 'antd';
import { updateJobDuty, saveJobDuty } from '@/utils/api/permission';
import { PackClass, PackName, ObligationSelect } from './allSelect';
import DepartMentSelect from '@/components/DepartMentSelect';

import _ from 'lodash';

interface CollectionCreateFormProps {
  visible: boolean;
  closeModal: (bool) => void;
  values?: Record<string, any>;
  type?: string;
}

const AddPackageModal: React.FC<CollectionCreateFormProps> = ({
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

  const NO = '1';

  useEffect(() => {
    if (type === 'new') {
      form.setFieldsValue({
        jobDutyName: null,
        privilegePackageTypeId: null,
        privilegePackageId: null,
        status: null,
        isApply: NO,
        des: '',
        deptIds: [],
      });
    }
    setDisabled(true);
  }, [visible]);

  useEffect(() => {
    if (!_.isEmpty(values)) {
      form.setFieldsValue({
        ...values,
        privilegePackageId: null,
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
    let params = {};
    setButtonLoading(true);
    if (type === 'new') {
      params = form.getFieldsValue();

      saveJobDuty(params).then(res => {
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
        ...form.getFieldsValue(),
        jobDutyName: form.getFieldValue('jobDutyName'),
        status: form.getFieldValue('status'),
        deptIds: form.getFieldValue('deptIds'),
        privilegePackageTypeId: values?.privilegePackageTypeId
          ? ''
          : form.getFieldValue('privilegePackageTypeId'),
        privilegePackageId: values.privilegePackageId
          ? ''
          : form.getFieldValue('privilegePackageId'),
        jobDutyId: values.jobDutyId,
      };
      updateJobDuty(params).then(res => {
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
              name="jobDutyName"
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
                type === 'edit' && values?.privilegePackageTypeId
                  ? 'privilegePackageTypeName'
                  : 'privilegePackageTypeId'
              }
            >
              {type === 'edit' && values?.privilegePackageTypeId ? (
                <Input disabled={true} />
              ) : (
                <PackClass
                  disabled={type === 'edit' && values?.privilegePackageTypeId}
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
                type === 'edit' && values?.privilegePackageId
                  ? 'privilegePackageName'
                  : 'privilegePackageId'
              }
            >
              {type === 'edit' && values?.privilegePackageId ? (
                <Input disabled={true} />
              ) : (
                <PackName
                  ref={formRef}
                  // val={form.getFieldValue('jobDutyId')}
                  placeholder={'请输入'}
                  disabled={disabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item label="关联部门" name="deptIds">
              <DepartMentSelect params={{ deptLevel: 'T2' }} multiple />
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
          <Col {...colLayout}>
            <Form.Item label="职责描述" name="des">
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label="是否可申请"
              name="isApply"
              rules={[{ required: true, message: '请选择' }]}
            >
              <Radio.Group>
                <Radio value="0">是</Radio>
                <Radio value="1">否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddPackageModal;
