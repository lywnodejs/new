import React, { useState } from 'react';
import { Tabs, Card, Space, Button, Popconfirm, Tag } from 'antd';
import EasyTable from '@/components/EasyTable';
import { TimeSelect } from '@/pages/manage/log/selectModules';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import UserListModalL from '../component/UserListModalL';
import UserListModalR from '../component/UserListModalR';
import _ from 'lodash';
import BindPackageModal from '../component/BindPackageModal';
import AddPackageModal from '../component/AddPackageModal';
import { ObligationSelect, ApplySelect } from '../component/allSelect';
import DepartMentSelect from '@/components/DepartMentSelect';
import { queryJobDutyAndPackageList } from '@/utils/api/permission';
import style from '../index.less';

const PermissionInterior = () => {
  const [currentTabKey, setCurrentTabKey] = useState('left');
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isBindModalVisible, setIsBindModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [userModalData, setUserModalData] = useState('');
  const [addModalData, setAddModalData] = useState<Object>();
  const [addModalType, setAddModalType] = useState('');

  const TableColumnL = [
    {
      title: 'ID',
      dataIndex: 'jobDutyId',
    },
    {
      title: '工作职责',
      dataIndex: 'jobDutyName',
      search: true,
    },
    {
      title: '职责描述',
      dataIndex: 'des',
    },
    {
      title: '权限包名称',
      dataIndex: 'privilegePackageName',
      search: true,
    },
    {
      title: '关联部门',
      dataIndex: 'deptNames',
      render: data => {
        return (
          Array.isArray(data) &&
          data.reduce((total, item, index) => {
            return [
              ...total,
              <Tag key={index} color="orange">
                {item}
              </Tag>,
              (index + 1) % 2 === 0 && <br />,
            ].filter(Boolean);
          }, [])
        );
      },
      search: {
        name: 'deptCode',
        content: <DepartMentSelect />,
      },
    },
    {
      title: '职责状态',
      dataIndex: 'status',
      render: (data, record) => {
        return <Space>{record.status == '0' ? '启用' : '禁用'}</Space>;
      },
      search: {
        name: 'status',
        content: <ObligationSelect />,
      },
    },
    {
      title: '是否可申请',
      dataIndex: 'isApply',
      render: (data, record) => {
        return <Space>{record.isApply == '0' ? '是' : '否'}</Space>;
      },
      search: {
        name: 'isApply',
        content: <ApplySelect />,
      },
    },
    {
      title: '最后操作人',
      dataIndex: 'operator',
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
    },
    {
      title: '修改时间',
      dataIndex: 'gmtModified',
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'modleId',
      render: (data, record) => {
        return (
          <Space>
            <Button
              size={'small'}
              onClick={() => {
                setIsUserModalVisible(true);
                setUserModalData(record);
              }}
            >
              查看用户列表
            </Button>
            <Button
              size={'small'}
              type={'primary'}
              onClick={() => {
                setAddModalData(record);
                setIsAddModalVisible(true);
                setAddModalType('edit');
              }}
            >
              编辑
            </Button>
            {/* <Button
              size={'small'}
              type={'primary'}
              disabled={record.privilegePackageId !== ''}
              onClick={() => {
                setIsBindModalVisible(true);
                setUserModalData(record);
              }}
            >
              绑定权限包
            </Button> */}
          </Space>
        );
      },
    },
  ];

  const middleContent = (
    <div className={style.TableButtons}>
      <Space>
        <Button
          style={{ margin: '10px 10px' }}
          type="primary"
          onClick={() => {
            setIsAddModalVisible(true);
            setAddModalType('new');
          }}
        >
          新增职责
        </Button>
      </Space>
    </div>
  );

  const fetchData = async params => {
    let data = await queryJobDutyAndPackageList(params);
    return data;
  };

  return (
    <Card>
      <EasyTable
        name={'internal_job_permission_tableL'}
        columns={TableColumnL}
        middleContent={middleContent}
        showDiyButton={true}
        tableProps={{
          scroll: { x: 'max-content' },
        }}
        customStyle={{
          EasyMainClass: style.EasyMainStyle,
          TableCardClass: style.TableCardStyle,
          SearchCardClass: style.SearchCardStyle,
        }}
        fetchData={{
          api: fetchData,
          dataField: 'data',
          totalField: 'count',
          pageField: 'page',
          sizeField: 'size',
        }}
      />
      {/* {isUserModalVisible ? ( */}
      <UserListModalL
        data={userModalData}
        isModalVisible={isUserModalVisible}
        closeModal={() => setIsUserModalVisible(false)}
      />
      {/* ) : null} */}

      <BindPackageModal
        data={userModalData}
        isModalVisible={isBindModalVisible}
        closeModal={() => {
          setIsBindModalVisible(false);
          addTableParams({}, 'internal_job_permission_tableL');
        }}
      />

      <AddPackageModal
        values={addModalData}
        type={addModalType}
        visible={isAddModalVisible}
        closeModal={bool => {
          setIsAddModalVisible(false);
          if (bool) {
            addTableParams({}, 'internal_job_permission_tableL');
          }
        }}
      />
    </Card>
  );
};

export default PermissionInterior;
