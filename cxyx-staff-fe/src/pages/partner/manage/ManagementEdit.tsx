import React, { useEffect, useState } from 'react';
import { Modal, Space, Button, Form, message, Select, Popconfirm, Tooltip } from 'antd';
import EasyTable from '@/components/EasyTable';
import { queryCompanyManagerList, insertCompanyManager, deleteCompanyManager } from '@/utils/api/company';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import { QuestionCircleOutlined } from '@ant-design/icons';
import PersonSelect from './components/PesonSelect';
import TooltipPermissionBtn from '@/components/TooltipPermissionBtn';
import _ from 'lodash';
import style from './style.less';

const ManagementEdit = props => {
  const [form] = Form.useForm();
  const [searchButtonLoad, setSearchButtonLoad] = useState(false);
  const [addButtonLoad, setAddButtonLoad] = useState(false);
  const [val, setVal] = useState();
  const TooltipText = '如需权限，请联系当前管理员进行添加，成为合作方管理员后您将可以维护当前合作方的账号职责'
  const columns = [
    {
      title: '账号',
      dataIndex: 'ldap',
    },
    {
      title: '姓名',
      dataIndex: 'ldapName',
    },
    {
      title: '操作',
      width: 120,
      align: 'center',
      fixed: 'right',
      dataIndex: 'operate',
      render: (value, record) => {
        return (
          <>
            <Popconfirm
              title="是否确定删除管理员"
              onConfirm={() => deleteLdap(record)}
              okText="确定"
              cancelText="取消"
              disabled={!props?.values?.editflag}
            >
              <Button
                type={'link'}
                disabled={!props?.values?.editflag}
              >
                删除
            </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];


  useEffect(() => {
    if (props.isModalVisible) {
      form.resetFields();
      setVal({});
      addTableParams({ page: 1, ldap: null, name: null, companyId: props.values.companyId || '' }, 'ManagementEdit_table');
    }
  }, [props.isModalVisible]);

  const fetchData = params => {
    return queryCompanyManagerList({ ...params }).then(
      res => {
        return res;
      },
    );
  };

  const handleSearch = () => {
    let params = {
      ldap: null,
      name: null
    }
    if (!_.isEmpty(val)) {
      params.ldap = val.value
      params.name = val.label.split('-')[1]
    }

    addTableParams({ ...params, page: 1 }, 'ManagementEdit_table');
  }

  const handleAdd = () => {
    setAddButtonLoad(true);
    let params = {
      ldap: null,
      name: null,
      companyId: props.values.companyId || ''
    }
    if (!_.isEmpty(val)) {
      params.ldap = val.value
      params.name = val.label.split('-')[1]
    }
    insertCompanyManager({ ...params }).then(res => {
      if (res.errno === 0) {
        message.success('添加管理员成功')
      } else {
        message.error(res.errmsg);
      }
      form.resetFields();
      setVal({});
      addTableParams({ page: 1, ldap: null, name: null }, 'ManagementEdit_table');
      setAddButtonLoad(false);
    })

  }

  const deleteLdap = (record) => {
    console.log(record);
    let params = {
      id: record.id,
      companyId: props.values.companyId || ''
    }
    deleteCompanyManager(params).then(res => {
      if (res.errno === 0) {
        message.success('删除管理员成功')
      } else {
        message.error(res.errmsg);
      }
      form.resetFields();
      setVal({});
      addTableParams({ page: 1, ldap: null, name: null }, 'ManagementEdit_table');
    })
  }



  return (
    <Modal
      title={'管理员配置'}
      width={730}
      visible={props.isModalVisible}
      onCancel={props.closeModal}
      footer={
        <Button onClick={props.closeModal}>关闭</Button>
      }
    >

      <Form form={form}>
        <Space>

          {/* <Select defaultValue="集团账号" style={{ width: 120 }} bordered={false}>
            <Select.Option value="0">集团账号</Select.Option>
            <Select.Option value="1">合作方账号</Select.Option>
          </Select> */}

          <Form.Item
            name={'ldaps'}
            label={'账号'}
            style={{ margin: 0 }}>
            <PersonSelect setVal={val => setVal(val)}
            />
          </Form.Item>
          <Button
            onClick={handleSearch}
          >
            查询
          </Button>

          <TooltipPermissionBtn
            type={'primary'}
            onClick={handleAdd}
            text={'添加'}
            loading={addButtonLoad}
            disabled={!props?.values?.editflag || _.isEmpty(val)}
          />

          <Tooltip title={TooltipText}>
            <QuestionCircleOutlined style={{ fontSize: '20px', color: '#FC9153' }} />
          </Tooltip>
        </Space>
      </Form>
      <EasyTable
        name={'ManagementEdit_table'}
        columns={columns}
        showForm={false}
        needFirstRequest={false}
        customStyle={{
          EasyMainClass: style.EasyMainStyle,
          TableCardClass: style.TableCardStyle,
        }}
        tableProps={{
          rowKey: 'id',
        }}
        fetchData={{
          api: fetchData,
          dataField: 'data',
          totalField: 'count',
        }}
      />
    </Modal>
  );
};

export default ManagementEdit;
