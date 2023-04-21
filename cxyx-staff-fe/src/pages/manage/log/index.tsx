import React, { useRef, useState } from 'react';
import { Button, Space } from 'antd';
import _ from 'lodash';
import EasyTable from '@/components/EasyTable';
import { searchLogList } from '@/utils/api/manageLog';
import { ModleSelect, TimeSelect } from './selectModules';
import InfoDetailsModal from '@/components/InfoDetailsModal';
import './index.less';

export const ManageLog = () => {
  const [record, setRecord] = useState([]);
  const childFef: any = useRef();

  const TableColumn = [
    {
      title: '功能模块',
      dataIndex: 'modleName',
      search: {
        name: 'modleName',
        content: <ModleSelect />,
      },
    },
    {
      title: '操作类型',
      dataIndex: 'operationFunctionType',
      search: {
        name: 'operationFunctionType',
      },
    },
    {
      title: '操作人',
      dataIndex: 'opName',
      search: {
        name: 'opName',
      },
    },
    {
      title: '被操作人',
      dataIndex: 'objectName',
      search: {
        name: 'objectName',
      },
    },
    {
      title: '日志流水号',
      dataIndex: 'runningNumber',
      search: {
        name: 'runningNumber',
      },
    },
    {
      title: '操作时间',
      dataIndex: 'gmtCreate',
      search: {
        name: 'gmtCreate',
        content: <TimeSelect className="time_select--log" />,
      },
    },
    {
      title: '操作',
      dataIndex: 'modleId',
      fixed: 'right',
      render: (data, record) => {
        return (
          <Space>
            <Button
              size={'small'}
              onClick={() => {
                InfoDate(record);
                childFef.current.setModalVisible(true);
              }}
            >
              详情
            </Button>
          </Space>
        );
      },
    },
  ];
  const timeFormat = val => {
    if (val) {
      let year = new Date(val).getFullYear(),
        moth: any = new Date(val).getMonth() + 1,
        day: any = new Date(val).getDate(),
        hours: any = new Date(val).getHours(),
        minute: any = new Date(val).getMinutes(),
        seconds: any = new Date(val).getSeconds();
      if (moth < 10) { moth = '0' + moth }
      if (day < 10) { day = '0' + day }
      if (hours < 10) { hours = '0' + hours }
      if (minute < 10) { minute = '0' + minute }
      if (seconds < 10) { seconds = '0' + seconds }
      let formattime = `${year}-${moth}-${day} ${hours}:${minute}:${seconds}`;
      return formattime
    } else {
      return ''
    }
  }

  // 开始 结束时间格式化
  const formatTime = time => {
    let timeObject = {
      gmtCreate_begin: '',
      gmtCreate_end: '',
    };
    if (time) {
      timeObject.gmtCreate_begin = timeFormat(time[0]);
      timeObject.gmtCreate_end = timeFormat(time[1]);
      return timeObject;
    }
  }

  // 时间格式化请求
  const fectchData = params => {
    let searchParams = { ...params };
    searchParams = {
      ...searchParams,
      ...formatTime(searchParams.gmtCreate),
    };
    delete searchParams.gmtCreate;
    return searchLogList(searchParams).then((res: any) => {
      return res;
    });
  };
  //详情数据整理
  const InfoDate = params => {
    let arr = [];
    try {
      if (params.opDetails && !_.isEmpty(JSON.parse(params.opDetails))) {
        console.log(JSON.parse(params.opDetails));

        Object.keys(JSON.parse(params.opDetails)).map(item => {
          arr.push({
            name: item,
            value: JSON.parse(params.opDetails)[item]
          })
        })
      }
    } catch {
      arr.push({
        name: '详情',
        value: params.opDetails
      })
    }
    arr = arr.concat([
      {
        name: 'operationFunctionType',
        value: params.operationFunctionType
      }, {
        name: 'requestParameters',
        value: params.requestParameters
      }, {
        name: 'responseParameters',
        value: params.responseParameters
      }, {
        name: 'responseTime',
        value: params.responseTime
      }, {
        name: 'runningNumber',
        value: params.runningNumber
      }
    ])

    setRecord(arr)
  }


  return (
    <>
      <EasyTable
        name={'managelog_table'}
        columns={TableColumn}
        fetchData={{
          api: fectchData,
          dataField: 'data',
          totalField: 'count',
          pageField: 'pageNum',
          sizeField: 'pageSize',
        }}
      />

      {/* 详情 */}
      <InfoDetailsModal ref={childFef} mapDataList={record} />
    </>
  );
};

export default ManageLog;
