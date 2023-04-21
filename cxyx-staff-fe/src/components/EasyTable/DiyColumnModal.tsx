import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';
import { setHiddenColumn } from './EasyParamStore';
const columns = [
  {
    title: '列名',
    dataIndex: 'title',
    render: (title, record) => {
      return record.label || (typeof title === 'function' ? title() : title);
    },
  },
  // {
  //   title: '字段',
  //   dataIndex: 'dataIndex',
  // },
];

const DiyColumnModal = props => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  useEffect(() => {
    const selected: any = [];
    Array.isArray(props.diyColumns) &&
      props.diyColumns.forEach((item, index) => {
        if (!item.hidden) {
          selected.push(item['dataIndex']);
        }
        item.key = index;
      });
    setSelectedRowKeys(selected);
  }, [props.diyColumns]);

  const onSelectChange = selectedKeys => {
    setSelectedRowKeys(selectedKeys);
  };

  const handleCancel = () => {
    if (typeof props.closeModal === 'function') {
      props.closeModal();
    }
  };

  const handleOk = () => {
    const hiddenColumns: any = [];
    props.diyColumns.forEach(item => {
      if (selectedRowKeys.includes(item['dataIndex'])) {
        item.hidden = false;
      } else {
        item.hidden = true;
        hiddenColumns.push(item['dataIndex']);
      }
    });
    setHiddenColumn(hiddenColumns, props.tableName);
    typeof props.columnChange === 'function' &&
      props.columnChange(props.diyColumns);
    if (typeof props.closeModal === 'function') {
      props.closeModal();
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
  };

  return (
    <Modal
      title={'自定义展示列'}
      visible={props.isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={props.diyColumns}
        rowKey={'dataIndex'}
        pagination={{
          pageSize: 100,
          hideOnSinglePage: true,
          showSizeChanger: false,
          showTotal: props.diyColumns.length
            ? total => `共${total}条`
            : undefined,
        }}
      />
    </Modal>
  );
};

export default DiyColumnModal;
