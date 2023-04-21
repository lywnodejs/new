import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import EasyTable from '@/components/EasyTable';
import { queryUserList } from '@/utils/api/permission';
import { setTableParams } from '@/components/EasyTable/EasyParamStore';
import { StatusSelect } from './allSelect';
import style from '../index.less';

const UserListModal = props => {
  useEffect(() => {
    if (props.isModalVisible) {
      form?.current?.getForm()?.resetFields();
      setTableParams({ jobTypeId: props.data.jobTypeId }, 'user_list_tableR');
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
    // params.jobTypeId = props.data.jobTypeId;
    return queryUserList(params).then(res => {
      return res;
    });
  };

  return (
    <Modal
      width={800}
      title={`【${props.data.jobTypeName}】岗位职责用户列表`}
      visible={props.isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <EasyTable
        name={'user_list_tableR'}
        columns={TableColumn}
        onFormRef={ref => { setForm(ref) }}
        needFirstRequest={false}
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

export default UserListModal;
