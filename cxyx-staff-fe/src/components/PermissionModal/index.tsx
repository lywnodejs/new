import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Modal } from 'antd';
import EasyTable from '@/components/EasyTable';
import RiskLevelSelect from './Select/RiskLevelSelect';
import { getPowerByLdap } from '@/utils/api/formal';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';

const { TabPane } = Tabs;

const PermissionModal = props => {
  const [tabName, setTabName] = useState('1');
  const [itemTitle, setItemTitle] = useState('');
  const { isModalVisible, closeModal, record, flag } = props;

  const {
    ldap, // 账号
  } = record;

  const rowKeyValue = 'name';

  useEffect(() => {
    addTableParams({ flag }, 'permission_table');
  }, []);

  // 关闭Modal
  const handleCancel = () => {
    closeModal();
    setTabName('1');
  };

  // 切换tab
  const callback = key => {
    if (key !== tabName) {
      setTabName(key);
      addTableParams(
        { userName: ldap, powerType: key, flag, page: 1 },
        'permission_table',
      );
    }
  };

  useEffect(() => {
    let title = '';
    switch (tabName) {
      case '1':
        title = '角色名称';
        break;
      case '3':
        title = '地区名称';
        break;
      case '4':
        title = '标识位名称';
        break;
      case '2':
        title = '数据资源名称';
        break;
    }
    setItemTitle(title);
  }, [tabName]);

  const tableColumns = [
    {
      title: '系统名称',
      dataIndex: 'appName',
      search: true,
    },
    {
      title: itemTitle,
      dataIndex: 'name',
      search: {
        name: 'permissionName',
      },
    },
    {
      title: '业务线',
      dataIndex: 'businessName',
      search: true,
    },
    {
      title: '数据敏感级',
      dataIndex: 'riskLevel',
      search: {
        name: 'riskLevelList',
        content: <RiskLevelSelect mode="multiple" />,
      },
    },
    {
      title: '赋权时间',
      dataIndex: 'applyDateStr',
    },
    {
      title: '过期时间',
      dataIndex: 'expireDateStr',
    },
  ];

  const resourceTableColumns = [
    {
      title: '系统名称',
      dataIndex: 'appName',
      search: true,
    },
    {
      title: itemTitle,
      dataIndex: 'name',
      search: {
        name: 'permissionName',
      },
    },
    {
      title: '数据资源类型',
      dataIndex: 'resourceTypeName',
    },
    {
      title: '数据资源ID',
      dataIndex: 'resourceKey',
    },
    {
      title: '业务线',
      dataIndex: 'businessName',
      search: true,
    },
    {
      title: '数据敏感级',
      dataIndex: 'riskLevel',
      search: {
        name: 'riskLevelList',
        content: <RiskLevelSelect mode="multiple" />,
      },
    },
    {
      title: '赋权时间',
      dataIndex: 'applyDateStr',
    },
    {
      title: '过期时间',
      dataIndex: 'expireDateStr',
    },
  ];

  const tabsList = [
    {
      tab: '角色',
      key: '1',
    },
    {
      tab: '地区',
      key: '3',
    },
    {
      tab: '标识位',
      key: '4',
    },
    {
      tab: '数据资源',
      key: '2',
    },
  ];

  return (
    <Modal
      width={1000}
      title={`${record.name}的权限详情`}
      visible={isModalVisible && ldap}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <Tabs defaultActiveKey="role" onChange={callback}>
        {tabsList.map(e => (
          <TabPane tab={e.tab} key={e.key}></TabPane>
        ))}
      </Tabs>
      {ldap ? (
        <EasyTable
          name={'permission_table'}
          customStyle={{
            TableCardStyle: { margin: 0, borderRadius: 0 },
            SearchCardStyle: { margin: 0, borderRadius: 0 },
          }}
          columns={
            itemTitle == '数据资源名称' ? resourceTableColumns : tableColumns
          }
          fetchData={{
            api: getPowerByLdap,
            dataField: 'data',
            totalField: 'count',
            pageField: 'page',
            sizeField: 'size',
          }}
        />
      ) : null}
    </Modal>
  );
};

export default PermissionModal;
