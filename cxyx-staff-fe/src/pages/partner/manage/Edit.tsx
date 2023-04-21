import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Button, message, Select } from 'antd';
import { newCompany, editCompany } from '@/utils/api/company';
import { getResponseData } from '@/utils/api/path';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import NodeTypeSelect from '@/components/NodeTypeSelect';
import EntitySelect from '@/components/EntitySelect';
import PartnerTypeSelect from '@/components/PartnerTypeSelect';
import _ from 'lodash';
import { renderOptionsByMap } from '@/utils/data';
import { PARTNER_STATUS } from '@/pages/partner/manage/constant';

interface Values {
  title: string;
  description: string;
  modifier: string;
  companyId?: string;
}

interface CollectionCreateFormProps {
  visible: boolean;
  closeModal: object;
  onCancel: () => void;
  values?: object;
  type?: string;
  companyCategory?: object
}

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 },
};

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  visible,
  closeModal,
  onCancel,
  values,
  type,
  companyCategory
}) => {
  const [form] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedOrgType, setSelectOrgType] = useState();

  useEffect(() => {
    if (!_.isEmpty(values)) {
      form.setFieldsValue(values);
      if (values['orgType']) {
        setSelectOrgType(values['orgType']);
      }
    }
  }, [values]);

  useEffect(() => {
    if (visible === false) {
      form.resetFields();
      setSelectOrgType(undefined);
    }
  }, [visible]);

  useEffect(() => {
    let title = '';
    switch (type) {
      case 'new':
        title = '新增合作方';
        break;
      case 'edit':
        title = '编辑合作方';
        break;
      case 'view':
        title = '查看合作方';
        break;
    }
    setModalTitle(title);
  }, [type]);

  const colLayout = {
    span: 12,
  };
  const getDisableStatus = name => {
    if (type === 'view') {
      return true;
    }
    switch (name) {
      case 'legalPerson':
      case 'legalPersonMobile':
      case 'inviteCode':
      case 'idCardNo':
        return type === 'edit';
      default:
        return false;
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        setButtonLoading(true);
        if (type === 'edit') {
          delete values.legalPersonMobile; // 联系电话仅作为加密展示
        }
        const postMethod = type === 'edit' ? editCompany : newCompany;
        postMethod({
          ...values,
          companyType: 'OUTSOURCING',
        })
          .then(res => {
            const data = getResponseData(res);
            if (data !== false) {
              message.success(`${modalTitle}成功`);
              if (typeof closeModal === 'function') {
                closeModal();
              }
              addTableParams({}, 'partner_manage_table');
            }
          })
          .finally(() => setButtonLoading(false));
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };
  return (
    <Modal
      width={800}
      visible={visible}
      title={modalTitle}
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
              name="companyName"
              label="合作方名称"
              rules={[{ required: true, message: '请输入合作方名称!' }]}
            >
              <Input
                placeholder={'请输入'}
                disabled={getDisableStatus('companyName')}
              />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              name="legalPerson"
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
                disabled={getDisableStatus('legalPerson')}
              />
            </Form.Item>
          </Col>
          {type === 'new' && (
            <Col {...colLayout}>
              <Form.Item
                name="idCardNo"
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
                  disabled={getDisableStatus('idCardNo')}
                />
              </Form.Item>
            </Col>
          )}
          <Col {...colLayout}>
            <Form.Item
              name="legalPersonMobile"
              label="联系电话"
              rules={
                type === 'edit'
                  ? []
                  : [
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
                disabled={getDisableStatus('legalPersonMobile')}
              />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item name="orgType" label="关联实体类型">
              <NodeTypeSelect
                disabled={getDisableStatus('orgType')}
                onChange={value => {
                  setSelectOrgType(value);
                  form.resetFields(['serviceEntityList']);
                }}
              />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item name="serviceEntityList" label="关联实体">
              <EntitySelect
                orgType={selectedOrgType}
                disabled={
                  _.isEmpty(selectedOrgType) ||
                  getDisableStatus('serviceEntityList')
                }
                mode="multiple"
                showArrow={true}
              />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item name="inviteCode" label="招募邀请码">
              <Input placeholder={'无需填写，后台自动生成'} disabled={true} />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item name="status" label="合作方状态">
              {renderOptionsByMap(PARTNER_STATUS, 'key', 'name', {
                disabled: getDisableStatus('status'),
              })}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              name="companyCategory"
              label="合作方类型"
              rules={[
                { required: true, message: '请选择合作方类型' },
              ]}
            >
              <PartnerTypeSelect
                disabled={getDisableStatus('companyCategory')}
                companyCategory={companyCategory}
              />
            </Form.Item>
          </Col>

          <Col {...colLayout}>
            <Form.Item name="taxNo" label="合作方加盟税号">
              <Input
                placeholder='请输入'
                disabled={type === 'new' ? false : true}
              ></Input>
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item hidden name="companyId" label="companyId">
              <Input disabled={getDisableStatus('companyId')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CollectionCreateForm;
