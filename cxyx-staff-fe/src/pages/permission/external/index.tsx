import React, { useState } from 'react';
import { Tabs, Card, Space, Button, Tag } from 'antd';
import EasyTable from '@/components/EasyTable';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import UserListModalL from '../component/UserListModalL';
import UserListModalR from '../component/UserListModalR';
import _ from 'lodash';
// import BindPackageModal from '../component/BindPackageModal';
import AddPackageModalExternal from '../component/AddPackageModalExternal';
import { NODE_TYPE_MAP } from '@/components/NodeTypeSelect/constant';
import NodeTypeSelect from '@/components/NodeTypeSelect';
import { ObligationSelect } from '../component/allSelect';
import DepartMentSelect from '@/components/DepartMentSelect';
import { queryJobTypeAndPackageList } from '@/utils/api/permission';
import style from '../index.less';
import PermissionButton from '@/components/PermissionButton';

const PermissionExternal = () => {
  const [currentTabKey, setCurrentTabKey] = useState('right');
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isBindModalVisible, setIsBindModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [userModalData, setUserModalData] = useState('');
  const [addModalData, setAddModalData] = useState<Object>();
  const [addModalType, setAddModalType] = useState('');

  const TableColumnR = [
    {
      title: 'ID',
      dataIndex: 'jobTypeId',
    },
    {
      title: '工作职责',
      dataIndex: 'jobTypeName',
      search: true,
    },
    {
      title: '权限包名称',
      dataIndex: 'privilegePackageName',
      search: true,
    },
    {
      title: '关联实体类型',
      dataIndex: 'orgTypeName',
      search: {
        name: 'orgType',
        content: <NodeTypeSelect />,
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
      dataIndex: 'modleId',
      fixed: 'right',
      render: (data, record) => {
        return (
          <Space>
            <PermissionButton
              permissionUrl={'/employee/queryEmployeeList'}
              size={'small'}
              onClick={() => {
                setIsUserModalVisible(true);
                setUserModalData(record);
              }}
            >
              查看用户列表
            </PermissionButton>
            <PermissionButton
              permissionUrl={'/jobtype/updateJobType'}
              size={'small'}
              type={'primary'}
              onClick={() => {
                setAddModalData(record);
                setIsAddModalVisible(true);
                setAddModalType('edit');
              }}
            >
              编辑
            </PermissionButton>
          </Space>
        );
      },
    },
  ];

  const middleContent = (
    <div className={style.TableButtons}>
      <Space>
        <PermissionButton
          permissionUrl={'/jobtype/saveJobType'}
          style={{ margin: '10px 10px' }}
          type="primary"
          onClick={() => {
            setIsAddModalVisible(true);
            setAddModalType('new');
          }}
        >
          新增职责
        </PermissionButton>
      </Space>
    </div>
  );

  const fetchDataR = async params => {
    let data = await queryJobTypeAndPackageList(params);
    return data;
  };

  return (
    <Card>
      <EasyTable
        name={'partner_job_permission_tableR'}
        columns={TableColumnR}
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
          api: fetchDataR,
          dataField: 'data',
          totalField: 'count',
          pageField: 'page',
          sizeField: 'size',
        }}
      />

      {/* {isUserModalVisible ? ( */}
      <UserListModalR
        data={userModalData}
        isModalVisible={isUserModalVisible}
        closeModal={() => setIsUserModalVisible(false)}
      />
      {/* ) : null} */}
      {/* <BindPackageModal
        data={userModalData}
        isModalVisible={isBindModalVisible}
        closeModal={() => {
          setIsBindModalVisible(false);
          addTableParams({}, 'internal_job_permission_tableL');
        }}
      /> */}

      <AddPackageModalExternal
        values={addModalData}
        type={addModalType}
        visible={isAddModalVisible}
        closeModal={bool => {
          setIsAddModalVisible(false);
          if (bool) {
            addTableParams({}, 'partner_job_permission_tableR');
          }
        }}
      />
    </Card>
  );
};

export default PermissionExternal;
