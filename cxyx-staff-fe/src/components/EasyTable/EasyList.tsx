import { Table, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';

const EasyList = (props: any) => {
  const { data, loading = false, change, autoMerge } = props;
  const [formatColumns, setFormatColumns] = useState<any>([]);
  const [rowSpanCount, setRowSpanCount] = useState<any>([]);

  useEffect(() => {
    // 为表格标题添加提示
    const columns: any = [];
    props.columns.forEach(column => {
      const item = { ...column };
      if (item.render) {
        item.renderFun = item.render;
        delete item.render;
      }
      columns.push(item);
    });
    if (Array.isArray(columns)) {
      columns.forEach((item: any, columnIndex) => {
        if (item.tip) {
          item.name = item.title;
          item.title = () => (
            <Tooltip title={item.tip} color={'#FC9153'}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>{item.name}</div>
                <QuestionCircleOutlined style={{ color: '#FC9153' }} />
              </div>
            </Tooltip>
          );
        }

        if (item.renderFun) {
          item.render = (value, record, index) => {
            const span = rowSpanCount[index]
              ? rowSpanCount[index][columnIndex]
              : 1;
            return {
              children: item.renderFun(value, record, index),
              props: { rowSpan: span },
            };
          };
        } else {
          item.render = (value, record, index) => {
            const data = _.get(record, item['dataIndex'], '-');
            const span = rowSpanCount[index]
              ? rowSpanCount[index][columnIndex]
              : 1;
            return {
              children: data,
              props: { rowSpan: span },
            };
          };
        }
      });
      setFormatColumns(columns);
    }
    // console.log('props.columns, rowSpanCount', props.columns, rowSpanCount)
  }, [props.columns, rowSpanCount]);

  useEffect(() => {
    if (autoMerge && Array.isArray(data) && data.length > 0) {
      const rowSpanArr: any = [];
      for (let i = 0; i < data.length; i++) {
        rowSpanArr[i] = [];
        for (let j = 0; j < props.columns.length; j++) {
          rowSpanArr[i][j] = 0;
        }
      }
      props.columns.forEach((column, order) => {
        let point = undefined;
        let count = 0;
        data.forEach((record, index) => {
          const value = _.get(record, column.dataIndex);
          if (point === value) {
            if (
              rowSpanArr[index][order - 1] &&
              count + 1 > rowSpanArr[index][order - 1]
            ) {
              count = 1;
            } else {
              count++;
            }
          } else {
            count = 1;
            point = value;
          }
          rowSpanArr[index][order] = count;
        });
      });
      // console.log('rowSpanArr', JSON.parse(JSON.stringify(rowSpanArr)));

      for (let j = 0; j < props.columns.length; j++) {
        let mergeCount = -1;
        let doneCount = 0;
        for (let i = data.length - 1; i >= 0; i--) {
          -1 === mergeCount && (mergeCount = rowSpanArr[i][j]);
          if (mergeCount > 1) {
            doneCount++;
            if (doneCount === mergeCount) {
              rowSpanArr[i][j] = mergeCount;
              i > 0 && (mergeCount = rowSpanArr[i - 1][j]);
              doneCount = 0;
            } else {
              rowSpanArr[i][j] = 0;
            }
          } else {
            mergeCount = -1;
            doneCount = 0;
          }
        }
      }
      // console.log('rowSpanArr', rowSpanArr);
      setRowSpanCount(rowSpanArr);
    }

    // console.log('data, props.columns', data, props.columns)
  }, [data, props.columns]);

  // console.log('EasyList');
  return (
    <Table
      dataSource={data}
      columns={formatColumns}
      rowKey="key"
      loading={loading}
      pagination={{
        showSizeChanger: true,
        showTotal: props.pageNum.total ? total => `共${total}条` : undefined,
        showQuickJumper: true,
        ...props.pageNum,
        ...props.pagination,
      }}
      onChange={change}
      {...props.tableProps}
    />
  );
};

export default EasyList;
