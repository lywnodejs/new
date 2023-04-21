import React, { Component } from 'react';
import { Table, Button, Popconfirm } from 'antd';

import './index.less';

const getColumns = (requestEdit, requestDel) => [{
  title: 'ID',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '标识位',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '名称',
  dataIndex: 'nameZh',
  key: 'nameZh',
}, {
  title: '操作',
  dataIndex: '',
  key: 'x',
  render: (value, record) => {
    const delBtn = (
      <Popconfirm placement="top" title="确定删除此记录？" onConfirm={() => requestDel(record)} okText="确定" cancelText="取消">
        <Button type="danger" size='small' className="delete-btn" >
          删除
        </Button>
      </Popconfirm>
    );

    return (
      <div>
        <Button type="" size='small' onClick={() => requestEdit(record)} className="edit-btn" >
          编辑
        </Button>

        {!record.children && delBtn}
      </div>
    );
  }
}];

export default class FlagsTable extends Component {
  render() {
    const { data, requestDel, requestEdit } = this.props;

    return (
      <div className="FlagsTable">
        <Table
          columns={getColumns(requestEdit, requestDel)}
          dataSource={data}
          rowKey="id"
          pagination={false}
        />
      </div>
    );
  }
}
