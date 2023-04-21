import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Button, message } from 'antd';
import _ from 'lodash';
import { updateContacts } from '@/utils/api/company';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';

interface CollectionCreateFormProps {
  visible: boolean;
  closeModal: () => void;
  onCancel: () => void;
  companyId?: any;
  type?: string;
}

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 },
};

const EditPersonForm: React.FC<CollectionCreateFormProps> = ({
  visible,
  closeModal,
  onCancel,
  companyId,
  type,
}) => {
  const [form] = Form.useForm();
  const [buttonLoading, setButtonLoading] = useState(false);



  useEffect(() => {
    if (visible === false) {
      form.resetFields();
    }
  }, [visible]);

  const colLayout = {
    span: 12,
  };


  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        setButtonLoading(true);
        let params = {
          ...values,
          companyId: companyId
        }
        updateContacts(params).then(res => {
          if (res.errno === 0) {
            closeModal();
            addTableParams({}, 'partner_manage_table');
            message.success('修改联系人成功');
          } else {
            message.error(res.errmsg);
          }
        }).finally(() => {
          setButtonLoading(false);
        });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      })
  };
  return (
    <Modal
      width={800}
      visible={visible}
      title='修改联系人'
      footer={
        type === 'view' ? <Button onClick={onCancel}>返回</Button> : undefined
      }
      onCancel={onCancel}
      cancelText="返回"
      okText="保存"
      onOk={handleOk}
      okButtonProps={{ loading: buttonLoading }}
    >
      <Form form={form} name="form_in_modal" {...layout} scrollToFirstError>
        <Row>

          <Col {...colLayout}>
            <Form.Item
              name="name"
              label="联系人姓名"
              rules={[
                { required: true, message: '请输入联系人姓名!' },
                {
                  pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]*$/,
                  message: '姓名包含特殊字符',
                },
              ]}
            >
              <Input
                placeholder={'请输入'}
              />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              name="mobile"
              label="联系电话"
              rules={[
                { required: true, message: '请输入联系电话!' },
                {
                  pattern: /^(1[3-9]\d{9}$)/,
                  message: '手机号码格式不正确',
                },
              ]
              }
            >
              <Input
                placeholder={'请输入'}
              />
            </Form.Item>
          </Col>

          <Col {...colLayout}>
            <Form.Item
              name="idCard"
              label="身份证号"
              rules={[
                { required: true, message: '请输入身份证号' },
                {
                  pattern: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([\d|x|X]{1})$/,
                  message: '身份证号格式不正确',
                },
              ]}
            >
              <Input
                placeholder={'请输入'}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditPersonForm;
