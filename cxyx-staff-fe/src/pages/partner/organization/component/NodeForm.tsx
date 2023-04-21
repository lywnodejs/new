import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Form, Input, message } from 'antd';
import NodeTypeSelect from '@/components/NodeTypeSelect';
import { OPERATE_TYPE } from '@/pages/partner/organization/constant';
import { writeOrganizationNode } from '@/utils/api/organization';
import { getResponseData } from '@/utils/api/path';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import ExternalPersonSelect from '@/components/ExternalPersonSelect';
import EntitySelect from '@/components/EntitySelect';
import _ from 'lodash';
import WarehouseSelect from '@/components/WarehouseSelect';
import { NODE_TYPE_MAP } from '@/components/NodeTypeSelect/constant';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const NodeForm = (props, ref) => {
  const [nodeType, setNodeType] = useState('');
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    getForm: () => {
      return form;
    },
  }));

  useEffect(() => {
    const orgType = _.get(props, 'nodeDetail.orgType');
    orgType && setNodeType(orgType);
  }, [props.nodeDetail]);

  useEffect(() => {
    if (form && 'function' === typeof props.onRef) {
      props.onRef(form);
    }
    form.resetFields();
  }, [form]);

  const handleSubmit = values => {
    props.handleSubmitting(true);
    const params = {
      operatorType: props.operateType,
      parentId: -1,
      ...values,
    };

    if (Array.isArray(values.orgManager)) {
      params['orgManager'] = values.orgManager.join(',');
    }

    writeOrganizationNode(params)
      .then(res => {
        const data = getResponseData(res);
        if (data !== false) {
          const msg =
            OPERATE_TYPE.INSERT === props.operateType
              ? '添加节点成功'
              : '编辑节点成功';
          message.success(msg);
          const changedParentId =
            OPERATE_TYPE.INSERT === props.operateType
              ? -1 // props.node.key
              : props.node.father;
          addTableParams({ changedParentId }, 'node_tree');
        }
      })
      .finally(() => {
        props.handleSubmitting(false);
      });
  };

  return (
    <>
      <Form form={form} {...layout} name="basic" onFinish={handleSubmit}>
        <Form.Item
          label="节点名称"
          name="orgName"
          rules={[{ required: true, message: '请输入节点名称' }]}
        >
          <Input disabled={OPERATE_TYPE.SHOW === props.operateType} />
        </Form.Item>

        {[OPERATE_TYPE.UPDATE, OPERATE_TYPE.SHOW].includes(
          props.operateType,
        ) && (
            <Form.Item
              label="节点 ID"
              name="orgId"
              rules={[{ message: '请输入节点 ID' }]}
            >
              <Input disabled={true} />
            </Form.Item>
          )}

        <Form.Item
          label="实体类型"
          name="orgType"
          rules={[{ required: true, message: '请选择节点类型' }]}
        >
          <NodeTypeSelect
            onChange={type => {
              setNodeType(type);
              form.setFieldsValue({ relEntity: undefined });
            }}
            disabled={[OPERATE_TYPE.UPDATE, OPERATE_TYPE.SHOW].includes(
              props.operateType,
            )}
          />
        </Form.Item>

        <Form.Item
          label={`实体ID`}
          name="relEntity"
          rules={[{ required: true, message: '请选择实体或填写实体ID' }]}
        >
          {/* // 只有添加仓库时使用仓库选择组件 */}
          {(OPERATE_TYPE.INSERT === props.operateType && NODE_TYPE_MAP.WAREHOUSE.key == nodeType) ?
            <WarehouseSelect
              disabled={[OPERATE_TYPE.UPDATE, OPERATE_TYPE.SHOW].includes(
                props.operateType,
              )}
            /> : <Input
              disabled={[OPERATE_TYPE.UPDATE, OPERATE_TYPE.SHOW].includes(
                props.operateType,
              )}
            />
          }
        </Form.Item>

        <Form.Item label={`管理员`} name="orgManager">
          <ExternalPersonSelect
            disabled={[OPERATE_TYPE.SHOW].includes(props.operateType)}
            mode={'multiple'}
            entity={props.nodeDetail?.relEntity}
            placeholder={'请输入管理员'}
            detailVal={props.detailVal}
          />
        </Form.Item>
      </Form>
    </>
  );
};
const NodeFormer = forwardRef(NodeForm);

export default NodeFormer;
