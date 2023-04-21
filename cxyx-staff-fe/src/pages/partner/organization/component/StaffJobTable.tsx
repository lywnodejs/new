import React, { useState } from 'react';
import {
  queryAnchoredEmployeeList,
  unbindEmployee,
} from '@/utils/api/organization';
import EasyTable from '@/components/EasyTable';
import { Button, message, Space } from 'antd';
import { getResponseData } from '@/utils/api/path';
import {
  addTableParams,
  getTableParams,
  setTableParams,
} from '@/components/EasyTable/EasyParamStore';
import style from '../style.less';
const StaffJobTable = () => {
  const [unBindingId, setUnBindingId] = useState();
  const tableColumns = [
    {
      title: '合作方员工ID',
      dataIndex: 'employeeId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
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
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'employeeId',
      render: id => {
        return (
          <Space>
            <Button
              loading={unBindingId === id}
              disabled={unBindingId && unBindingId !== id}
              size={'small'}
              type={'primary'}
              onClick={() => handleUnBindStaff(id)}
            >
              解绑
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleUnBindStaff = id => {
    setUnBindingId(id);
    const tableParams = getTableParams('staff_bind_table');
    const params = {
      employeeIdList: [id],
      orgId: tableParams.orgId,
    };
    unbindEmployee(params)
      .then(res => {
        const data = getResponseData(res);
        if (data !== false) {
          message.success('岗位解绑成功');
          addTableParams({}, 'staff_job_table');
        }
      })
      .finally(() => {
        setUnBindingId(undefined);
      });
  };

  return (
    <EasyTable
      customStyle={{
        EasyMainClass: style.EasyMainContentTableJob,
        SearchCardClass: style.SearchCardStyleTableJob,
      }}
      needFirstRequest={true}
      name={'staff_job_table'}
      columns={tableColumns}
      pagination={{
        pageSizeOptions: ['5', '10', '20', '50', '100'],
      }}
      fetchData={{
        api: queryAnchoredEmployeeList,
        dataField: 'data',
        totalField: 'count',
        pageField: 'page',
        sizeField: 'size',
      }}
    />
  );
};

export default StaffJobTable;
