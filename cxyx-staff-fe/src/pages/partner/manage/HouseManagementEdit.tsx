import React, { useEffect, useState } from 'react';
import { Modal, Space, Button, Form, message, Select, Popconfirm, Tooltip } from 'antd';
import EasyTable from '@/components/EasyTable';
import { queryOrganizationManagerListByType, addOrganizationManager, delOrganizationManager } from '@/utils/api/company';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import { QuestionCircleOutlined } from '@ant-design/icons';
import EmployeePesonSelect from './components/EmployeePesonSelect';
import PersonSelect from './components/PesonSelect';
import TooltipPermissionBtn from '@/components/TooltipPermissionBtn';
import _ from 'lodash';
import { getUserName } from '@/utils/auth';
import style from './style.less';

const HouseManagementEdit = props => {
  const [form] = Form.useForm();
  const [searchButtonLoad, setSearchButtonLoad] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
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
            {
              props.type === 0 ?
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
                :
                isEdit ?
                  <Popconfirm
                    title="是否确定删除管理员"
                    onConfirm={() => deleteLdap(record)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      type={'link'}
                    >
                      删除
                  </Button>
                  </Popconfirm>
                  :
                  <Button
                    type={'link'}
                    disabled={true}
                  > 删除
                </Button>
            }

          </>
        );
      },
    },
  ];


  useEffect(() => {
    if (props.isModalVisible) {
      form.resetFields();
      setVal({});
      addTableParams(
        {
          page: 1,
          ldap: null,
          name: null,
          companyId: props.values.companyId || '',
          orgId: props.houseManagementId,
          type: props.type
        }, 'HouseManagementEdit_table');

      if (props.type === 1) { // 0 内部  1 外部  同 props.type 为外部是  需要验证按钮权限
        queryOrganizationManagerListByType({
          page: 1,
          size: 200,
          companyId: props.values.companyId || '',
          orgId: props.houseManagementId,
          type: 0
        }).then(res => {
          let userName = getUserName(); //获取当前登录用户名称
          let userNames = _.get(res, 'data', []).map(item => { // 获取内部人员名单账号集合
            return item.ldap
          });
          if (!userNames.includes(userName) && !props?.values?.editflag) {
            setIsEdit(false);
          }
        })
      } else {
        setIsEdit(true);
      }
    }
  }, [props.isModalVisible]);

  const fetchData = params => {
    return queryOrganizationManagerListByType({ ...params }).then(
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

    addTableParams({ ...params, page: 1 }, 'HouseManagementEdit_table');
  }

  const handleAdd = () => {
    setAddButtonLoad(true);
    let params = {
      ldap: null,
      // name: null,
      orgId: props.houseManagementId || '',
      companyId: props.values.companyId || ''
    }
    if (!_.isEmpty(val)) {
      params.ldap = val.value
      // params.name = val.label.split('-')[1]
    }
    addOrganizationManager({ ...params }).then(res => {
      if (res.errno === 0) {
        message.success('添加管理员成功')
      } else {
        message.error(res.errmsg);
      }
      form.resetFields();
      setVal({});
      addTableParams({ page: 1, ldap: null, name: null }, 'HouseManagementEdit_table');
      setAddButtonLoad(false);
    })

  }

  const deleteLdap = (record) => {
    let params = {
      ldap: record.ldap,
      orgId: props.houseManagementId || '',
      companyId: props.values.companyId || ''
    }
    delOrganizationManager(params).then(res => {
      if (res.errno === 0) {
        message.success('删除管理员成功')
      } else {
        message.error(res.errmsg);
      }
      form.resetFields();
      setVal({});
      addTableParams({ page: 1, ldap: null, name: null }, 'HouseManagementEdit_table');
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
            {
              props.type === 0 ?
                <PersonSelect
                  setVal={val => setVal(val)}
                />
                :
                <EmployeePesonSelect
                  companyId={props.values?.companyId}
                  setVal={val => setVal(val)}
                />
            }

          </Form.Item>
          <Button
            onClick={handleSearch}
          >
            查询
          </Button>
          {
            props.type === 0 ?
              <TooltipPermissionBtn
                type={'primary'}
                onClick={handleAdd}
                text={'添加'}
                loading={addButtonLoad}
                disabled={!props?.values?.editflag || _.isEmpty(val)}
              />
              :
              isEdit ?
                <TooltipPermissionBtn
                  type={'primary'}
                  onClick={handleAdd}
                  text={'添加'}
                  loading={addButtonLoad}
                  disabled={_.isEmpty(val)}
                />
                :
                <TooltipPermissionBtn
                  type={'primary'}
                  text={'添加'}
                  disabled={true}
                />
          }


          <Tooltip title={TooltipText}>
            <QuestionCircleOutlined style={{ fontSize: '20px', color: '#FC9153' }} />
          </Tooltip>
        </Space>
      </Form>
      <EasyTable
        name={'HouseManagementEdit_table'}
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

export default HouseManagementEdit;
