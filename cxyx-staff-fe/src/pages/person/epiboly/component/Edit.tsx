import React, { useState, useEffect, useRef } from 'react';
import { Input, message, Modal, Descriptions } from 'antd';
import Former from '@/components/EasyTable/Form';
import _ from 'lodash';
import { updateInfo } from '@/utils/api/formal';
import DepartMentSelect from '@/components/DepartMentSelect';
import { getResponseData } from '@/utils/api/path';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import PersonSelect from '@/components/PersonSelect';

const Edit = props => {
  const { isModalVisible, values, closeModal, ldaps, type, isOne } = props;
  const formRef: any = useRef();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [managerName, setManagerName] = useState('');

  useEffect(() => {
    const form = formRef?.current?.getForm();
    form?.resetFields();
  }, [props.isModalVisible]);

  const formItems = [
    type == '编辑' || type == '部门'
      ? {
          name: 'deptCode',
          label: '部门',
          content: <DepartMentSelect style={{ width: '300px' }} />,
          rules: [{ required: true, message: '请选择部门' }],
        }
      : null,
    type == '编辑' || type == '上级'
      ? {
          name: 'managerLdap',
          label: '上级',
          content: <PersonSelect setManagerName={setManagerName} />,
          rules: [{ required: true, message: '请选择上级' }],
        }
      : null,
  ].filter(Boolean);

  const handleOk = async () => {
    const form = formRef?.current?.getForm();
    let params = await form
      ?.validateFields()
      .then((param: any) => {
        return {
          deptCode: param.deptCode,
          managerLdap: param.managerLdap,
          managerName: managerName ? managerName : values.managerName,
          employType: values.employType,
          ldaps: ldaps.length > 0 && !isOne ? ldaps : [values.ldap],
        };
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
    if (_.isEmpty(params)) {
      return;
    }
    setButtonLoading(true);
    updateInfo(params)
      .then(res => {
        const data = getResponseData(res);
        if (data !== false) {
          message.success(`保存成功`);
          closeModal();
          addTableParams({}, 'epiboly_person_table');
        }
      })
      .finally(() => setButtonLoading(false));
  };
  // 关闭Modal
  const handleCancel = () => {
    closeModal();
  };

  return (
    <Modal
      width={1000}
      title="编辑个人信息"
      visible={isModalVisible}
      onOk={handleOk}
      // footer={<Button onClick={handleCancel}>取消</Button>}
      okText="确定"
      okButtonProps={{ loading: buttonLoading }}
      onCancel={handleCancel}
      cancelText="取消"
    >
      {type == '编辑' ? (
        <Descriptions column={2}>
          <Descriptions.Item
            label={<div style={{ marginLeft: '40px' }}>当前部门</div>}
          >
            {props.values && props.values.splicingDeptName}
          </Descriptions.Item>
          <Descriptions.Item
            label={<div style={{ marginLeft: '40px' }}>当前上级</div>}
          >
            {props.values &&
              `${props.values.managerLdap}(${props.values.managerName})`}
          </Descriptions.Item>
        </Descriptions>
      ) : null}
      <Former
        labelCol={{ span: 5 }}
        colCount={2}
        formItems={formItems}
        ref={formRef}
      ></Former>
    </Modal>
  );
};

export default Edit;
