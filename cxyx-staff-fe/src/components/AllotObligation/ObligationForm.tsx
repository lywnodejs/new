import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Col, Form, Input, Popover } from 'antd';
import { FormInstance } from 'antd/lib/form';
import CitySelect from '@/components/CitySelect';
import WarehouseSelect from '@/components/WarehouseSelect';
import { useImperativeHandle } from 'react';
import { WorkSelect } from '@/components/WorkObligation';
import EntitySelect from '@/components/EntitySelect';
import { NODE_TYPE_MAP } from '@/components/NodeTypeSelect/constant';
import { CommoditySelect } from './useFormItem/Allselect';
/**
 * @description 分配职责
 * @param props
 */

export interface ObligationFormChildProps<RecordType> {
  setCurrentStep: Function; //步骤操作
  setFormData?: Function; // 设置数据值
}

const ObligationFormChild = <RecordType extends object = any>(
  props: ObligationFormChildProps<RecordType>,
  ref,
) => {
  const { setCurrentStep, setFormData } = props;
  const formRef: any = React.useRef();
  const Commodity: any = React.useRef();
  const [value, setValue] = useState([]);

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };

  useImperativeHandle(ref, () => ({
    formSubmit: () => {
      return formRef.current.submit();
    },
    formReset: () => {
      Commodity?.current?.clearData();
      setValue([]);
      return formRef?.current?.setFieldsValue({
        dutyId: [],
        city: [],
        warehouses: [],
      });
      // return formRef.current.resetFields();
    },
  }));

  // 表单提交
  const formSubmit = values => {
    setFormData({ ...values, staffEmployeeGoodsTypeVOS: value });
    setCurrentStep(1);
  };

  return (
    <Form
      {...layout}
      ref={formRef}
      style={{ width: '100%' }}
      name="ObligationForm"
      onFinish={formSubmit}
    >
      <Form.Item
        label="工作职责"
        name="dutyId"
        rules={[{ required: true, message: '' }]}
      >
        <WorkSelect labelInValue />
      </Form.Item>
      <p className="ObligationForm-work__info">
        找不到想要的职责？
        <a target="_blank"
          href="https://bpm.didichuxing.com/process/form/bykey/cx_sqzzsb?tenantId=cx_sqxt&jumpType=search">
          点击这里
        </a>
        上报
      </p>

      <Form.Item label="城市" name="city">
        <CitySelect multiple="multiple" />
      </Form.Item>

      <Form.Item label="关联实体" name="warehouses">
        <EntitySelect orgType={''} mode="multiple" />
      </Form.Item>

      <Form.Item label="商品品类">
        <CommoditySelect
          mode="multiple"
          ref={Commodity}
          getValue={val => {
            setValue(val);
          }}
        />
      </Form.Item>
    </Form>
  );
};

const ObligationForm = React.forwardRef(ObligationFormChild);
export default ObligationForm;
