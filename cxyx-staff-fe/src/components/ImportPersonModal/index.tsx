import React, { useEffect, useState } from 'react';
import { Modal, Space, Button, Form, message, Select } from 'antd';
import EasyTable from '@/components/EasyTable';
import style from './style.less';
import {
  getStaffInfoByLdap,
  synchronousStaffInfo,
} from '@/utils/api/internals';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import { getResponseData } from '@/utils/api/path';
import _ from 'lodash';

const ImportPersonModal = props => {
  const [form] = Form.useForm();
  const [loadingId, setLoadingId] = useState<any>();
  const [dataList, setDataList] = useState<any>(); // 列表数据
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中条目
  const columns = [
    {
      title: '账号',
      dataIndex: 'ldap',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '部门',
      dataIndex: 'deptName',
    },
    {
      title: '物理上级',
      dataIndex: 'managerName',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (value, record) => {
        return (
          <>
            {record.isSync ? (
              <Button disabled>已同步</Button>
            ) : (
              <Button
                type={'primary'}
                loading={loadingId === record.ldap}
                disabled={loadingId && loadingId !== record.ldap}
                onClick={() => {
                  setLoadingId(record.ldap);
                  importPersonList([record]);
                }}
              >
                同步
              </Button>
            )}
          </>
        );
      },
    },
  ];

  const importPersonList = data => {
    synchronousStaffInfo(data)
      .then(res => {
        const data = getResponseData(res);
        if (data !== false) {
          message.success(`同步成功`);
          addTableParams({}, 'import_person_table');
        }
      })
      .finally(() => {
        setLoadingId(undefined);
      });
  };

  const handleSubmit = values => {
    const params = {
      ldaps: values.ldaps.join(','),
    };
    addTableParams(params, 'import_person_table');
  };

  useEffect(() => {
    addTableParams({ ldaps: '' }, 'import_person_table', false);
  }, []);

  const selectProps = {
    style: { width: '100%' },
    tokenSeparators: [','],
    placeholder: '输入账号名称，支持多个，可用英文逗号隔开',
    allowClear: true,
  };

  const fetchData = params => {
    return getStaffInfoByLdap({ ...params, dataSource: props.dataSource }).then(
      res => {
        setDataList(_.get(res, 'data'));
        return res;
      },
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedKeys => {
      setSelectedRowKeys(selectedKeys);
    },
    getCheckboxProps: record => {
      if (record.isSync) {
        return { disabled: true };
      }
    },
  };

  // 批量同步
  const handleOk = () => {
    if (selectedRowKeys.length === 0) {
      message.info('请先选中需要同步的人员');
      return;
    }
    const personList = dataList.filter(item =>
      selectedRowKeys.includes(item.ldap),
    );
    setLoadingId(-1);
    importPersonList(personList);
  };

  return (
    <Modal
      className={style.ImportModal}
      title={'同步账号'}
      width={800}
      visible={props.isModalVisible}
      okText={'批量同步'}
      onOk={handleOk}
      confirmLoading={loadingId !== undefined}
      onCancel={props.closeModal}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Space className={style.SpaceRow}>
          <Form.Item name={'ldaps'}>
            <Select mode="tags" {...selectProps}></Select>
          </Form.Item>
          <Button type={'primary'} htmlType={'submit'}>
            查询
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              addTableParams({ ldaps: '' }, 'import_person_table');
            }}
          >
            重置
          </Button>
        </Space>
      </Form>
      <EasyTable
        name={'import_person_table'}
        columns={columns}
        customStyle={{
          EasyMainClass: style.EasyMainStyle,
          TableCardClass: style.TableCardStyle,
        }}
        tableProps={{
          rowSelection,
          rowKey: 'ldap',
        }}
        showForm={false}
        needFirstRequest={false}
        fetchData={{
          api: fetchData,
          dataField: 'data',
          totalField: 'count',
        }}
      />
    </Modal>
  );
};

export default ImportPersonModal;
