import React, { useEffect } from 'react';
import { queryOrganizationsByName } from '@/utils/api/organization';
import EasyTable from '@/components/EasyTable';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import style from '@/components/EasyTable/style.less';

const TableItemName = props => {
  const { record, onClick } = props;
  const clickTableItem = () => {
    onClick(record);
  };
  return <a onClick={clickTableItem}>{record.orgName}</a>;
};

const TreeTable = props => {
  const { txt, onClick, orgType } = props;


  const getQueryOrganizations = val => {

    let params = {
      ...val,
      orgType: orgType || '',
    }
    return queryOrganizationsByName(params).then(res => {
      if (res) {
        return res
      }
    })
  }
  useEffect(() => {
    addTableParams({ orgName: txt }, 'organization_tree_table');
  }, [txt]);
  const tableColumns = [
    {
      title: '节点名称',
      dataIndex: 'orgName',
      render: (text, record) => {
        return <TableItemName record={record} onClick={onClick} />;
      },
    },
    {
      title: '关联实体ID',
      dataIndex: 'relEntity',
    },
  ];

  return (
    <EasyTable
      name={'organization_tree_table'}
      columns={tableColumns}
      showForm={false}
      needFirstRequest={false}
      customStyle={{
        TableCardClass: style.NoPaddingTableCard,
      }}
      pagination={{
        showSizeChanger: false,
        showQuickJumper: false,
        size: 'small',
        showTotal: null,
      }}
      fetchData={{
        api: getQueryOrganizations,
        dataField: 'data',
        totalField: 'count',
        pageField: 'page',
        sizeField: 'size',
      }}
    />
  );
};

export default TreeTable;
