import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import EasyTable from '@/components/EasyTable';
import { setTableParams } from '@/components/EasyTable/EasyParamStore';
import { jobdutyQueryUserList } from '@/utils/api/permission';
import { StatusSelect } from './allSelect';
import style from '../index.less';

const UserListModalL = props => {
  useEffect(() => {
    if (props.isModalVisible) {
      form?.current?.getForm()?.resetFields();
      setTableParams({ jobDutyId: props.data.jobDutyId }, 'user_list_tableL');
    }
  }, [props.isModalVisible]);

  const [form, setForm] = useState();

  const handleCancel = () => {
    if (typeof props.closeModal === 'function') {
      props.closeModal();
    }
  };

  const handleOk = () => {
    handleCancel();
  };

  const TableColumn = [
    {
      title: '姓名',
      dataIndex: 'name',
      search: true,
    },
    {
      title: '账号',
      dataIndex: 'nameInDidi',
      search: true,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      search: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      search: {
        content: <StatusSelect />,
      },
    },
  ];

  const fetchData = params => {
    // params.jobDutyId = props.data.jobDutyId;
    return jobdutyQueryUserList(params).then(res => {
      return res;
    });
  };

  return (
    <Modal
      width={800}
      title={`【${props.data.jobDutyName}】岗位职责用户列表`}
      visible={props.isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <EasyTable
        name={'user_list_tableL'}
        needFirstRequest={false}
        columns={TableColumn}
        onFormRef={ref => { setForm(ref) }}
        customStyle={{
          EasyMainClass: style.EasyMainStyle,
          SearchCardClass: style.SearchCardStyle,
          TableCardClass: style.TableCardStyle,
        }}
        fetchData={{
          api: fetchData,
          dataField: 'data',
          totalField: 'count',
          pageField: 'page',
          sizeField: 'size',
        }}
      />
    </Modal>
  );
};

export default UserListModalL;
