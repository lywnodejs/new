import React, { useRef, useState } from 'react';
import { Button, Space, Input, Popconfirm, Tag, message } from 'antd';
import _ from 'lodash';
import EasyTable from '@/components/EasyTable';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import { strategyQueryList, deleteList } from '@/utils/api/manageLog';
import { ModleSelect } from './selectModules/index';
import './index.less';
import EditModal from './components/EditModal';
import StatusBtnFun from './components/StatusButton';


const STRATEGY_TYPE = 2; // 策略类型

export const ManageEmpower = () => {
  const [record, setRecord] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [type, setType] = useState('');
  // const childFef: any = useRef();

  const searchColumns = [
    {
      name: 'name',
      label: '策略名称',
      content: <Input placeholder="请输入" allowClear />,
    },
    {
      name: 'packageNames',
      label: '权限包名称',
      content: <Input placeholder="请输入" allowClear />,
    },
    {
      name: 'onstatus',
      label: '当前状态',
      content: <ModleSelect />,
    },
    {
      name: 'operator',
      label: '操作人',
      content: <Input placeholder="请输入" allowClear />,
    },
  ];

  const TableColumn = [
    {
      title: '策略 ID',
      dataIndex: 'strategyId',
    },
    {
      title: '策略名称',
      dataIndex: 'name',
    },
    {
      title: '策略描述',
      dataIndex: 'strategyDesc',
    },
    {
      title: '关联权限包',
      dataIndex: 'packages',
      render: record => {
        return getPackageNamesText(record);
      },
    },
    {
      title: '策略命中人数',
      dataIndex: 'hitCount',
    },
    {
      title: '当前状态',
      dataIndex: 'onstatus',
      render: (record) => {
        return getStatusText(record);
      },
    },
    {
      title: '操作人',
      dataIndex: 'operator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
    },
    {
      title: '执行时间',
      dataIndex: 'excuteTime',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      fixed: 'right',
      render: (data, record) => {
        return (
          <Space>
            <Button
              size={'small'}
              onClick={() => {
                setRecord(record)
                setType('check');
                setIsVisible(true);
              }}
            >
              查看
            </Button>
            <Button
              size={'small'}
              type={'primary'}
              disabled={record.onstatus !== 0}
              onClick={() => {
                setRecord(record)
                setType('edit');
                setIsVisible(true);
              }}
            >
              编辑
            </Button>
            {
              <StatusBtnFun record={record} />
            }

            <Button
              size={'small'}
              onClick={() => {
                setRecord(record)
                setType('Copy');
                setIsVisible(true);
              }}
            >
              复制
            </Button>
            {record.onstatus === 0 ? (
              <Popconfirm
                title="是否确定删除策略"
                onConfirm={() => {
                  usedelete(record);
                }}
                onCancel={() => { }}
                okText="确定"
                cancelText="取消"
              >
                <Button size={'small'} type={'primary'} danger>
                  删除
                </Button>
              </Popconfirm>
            ) : (
              <></>
            )}
          </Space>
        );
      },
    },
  ];

  const getPackageNamesText = data => {
    if (!_.isEmpty(data)) {
      if (data[0].typeId !== 0) { return '-' }
      return data.map((item, index) => {
        return (
          <>
            <Tag color="orange">{item.name}</Tag>
            {(index + 1) % 2 === 0 && <br />}
          </>
        );
      });
    } else {
      return '-';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 0:
        return <Tag color="orange">未启用</Tag>;
        break;
      case 1:
        return <Tag color="green">启用</Tag>;
        break;
      default:
        return <Tag color="red">停用</Tag>;
    }
  };

  const usedelete = data => {
    let params = {
      strategyId: data.strategyId,
      status: 1,
    };
    deleteList(params).then(res => {
      if (res && res.errno === 0) {
        message.success('删除成功');
      } else {
        message.error(res?.errmsg);
      }
      addTableParams({}, 'manage_empower_table');
    });
  };

  const middleContent = (
    <div style={{ marginBottom: 10 }}>
      <Button
        type="primary"
        onClick={() => {
          setType('New');
          setIsVisible(true);
        }}
      >
        新增策略
      </Button>
    </div>
  );

  const fectchData = params => {
    let packageNames = params.packageNames && [params.packageNames.replace(/\s+/g, '')];
    let query = {
      ...params,
      packageNames: packageNames || null
    };
    return strategyQueryList(query).then((res: any) => {
      return res;
    });
  };

  return (
    <>
      <EasyTable
        name={'manage_empower_table'}
        columns={TableColumn}
        searchColumns={searchColumns}
        middleContent={middleContent}
        showDiyButton={true}
        tableProps={{
          scroll: { x: 'max-content' },
          rowKey: 'strategId',
        }}
        customStyle={{
          TableCardStyle: { margin: 10 },
        }}
        fetchData={{
          api: fectchData,
          dataField: 'data',
          totalField: 'count',
          pageField: 'page',
          sizeField: 'size',
        }}
      />

      {/* {isVisible && ( */}
      <EditModal
        visible={isVisible}
        setIsVisible={val => {
          setIsVisible(val);
        }}
        type={type} //编辑，新增，复制，查看的值
        record={record} //查看时候的当前行数据  通过id查接口获取详情
      />
      {/* )} */}
    </>
  );
};

export default ManageEmpower;
