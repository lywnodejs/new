import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Space, message } from 'antd';
import NodeForm from './NodeForm';
import { OPERATE_TYPE } from '@/pages/partner/organization/constant';
import EasyTable from '@/components/EasyTable';
import {
  newEmployeeAnchor,
  queryEmployeeListForAnchor,
} from '@/utils/api/organization';
import style from '@/pages/partner/organization/style.less';
import _ from 'lodash';
import { getResponseData } from '@/utils/api/path';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';

const StaffBindModal = props => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [bindingId, setBindingId] = useState();

  // 批量添加
  // const handleSubmitting = loading => {
  //   setConfirmLoading(loading);
  //   if (!loading && typeof props.closeModal === 'function') {
  //     props.closeModal();
  //   }
  // };

  const handleOk = () => {
    if (typeof props.closeModal === 'function') {
      props.closeModal();
    }
  };

  const handleCancel = () => {
    if (typeof props.closeModal === 'function') {
      props.closeModal();
    }
  };

  const tableColumns = [
    {
      title: '合作方员工ID',
      dataIndex: 'employeeId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      search: true,
    },
    {
      title: '账号',
      dataIndex: 'nameInDidi',
      search: {
        name: 'nameIndidi',
      },
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      search: true,
    },
    {
      title: '合作方员工类型',
      dataIndex: 'jobModeShow',
    },
    {
      title: '岗位',
      dataIndex: 'jobTypeShow',
    },
    {
      title: '录入来源',
      dataIndex: 'source',
      // width: 100,
    },
    {
      title: '操作',
      dataIndex: 'employeeId',
      fixed: 'right',
      render: (id, record) => {
        return (
          <Space>
            <Button
              loading={bindingId === id}
              disabled={bindingId && bindingId !== id}
              size={'small'}
              type={'primary'}
              onClick={() => handleBindStaff(id)}
            >
              添加
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleBindStaff = id => {
    setBindingId(id);
    const params = {
      orgId: _.get(props, 'node.key'),
      employeeAnchorQueryList: [
        {
          jobTypeId: _.get(props, 'job.value'),
          employeeIdList: [id],
        },
      ],
    };
    newEmployeeAnchor(params)
      .then(res => {
        const data = getResponseData(res);
        if (data !== false) {
          message.success('岗位挂靠成功');
          addTableParams({}, 'staff_bind_table');
        }
      })
      .finally(() => {
        setBindingId(undefined);
      });
  };

  return (
    <Modal
      title={`${props.job?.label}绑定`}
      visible={props.isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      width={800}
      destroyOnClose
      forceRender
    >
      <EasyTable
        name={'staff_bind_table'}
        searchColCount={3}
        customStyle={{
          EasyMainClass: style.EasyMainContentTableBind,
          TableCardClass: style.TableCardStyleTableBind,
        }}
        tableProps={{
          scroll: { x: 'max-content' },
        }}
        columns={tableColumns}
        fetchData={{
          api: val => {
            if (val.jobTypeId) {
              return queryEmployeeListForAnchor(val);
            }
            return null;
          },
          dataField: 'data',
          totalField: 'count',
        }}
      />
    </Modal>
  );
};

export default StaffBindModal;
