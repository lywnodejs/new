import React, { useState } from 'react';
import {
  Button,
  Dropdown,
  Menu,
  message,
  Space,
  Tag,
  Upload,
  Input,
  Tooltip
} from 'antd';
import { DownOutlined, UploadOutlined } from '@ant-design/icons';
import EasyTable from '@/components/EasyTable';
import StaffAdd from '@/pages/partner/account/StaffAdd';
import StaffTypeSelect from '@/components/StaffTypeSelect';
import { API, fetchStaffList } from '@/utils/api/staff';
import JobTypeSelect from '@/components/JobTypeSelect';
import CompanySelect from '@/components/CompanySelect';
import ResetPassword from './ResetPassword';
import style from './style.less';
import tableStyle from '@/components/EasyTable/style.less';
import _ from 'lodash';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import NodeTypeSelect from '@/components/NodeTypeSelect';
import CitySelect from '@/components/CitySelect';
import { NODE_TYPE_MAP } from '@/components/NodeTypeSelect/constant';
import MultiEditModal from '@/pages/partner/account/MultiEditModal';
import { getResponseData } from '@/utils/api/path';
import StatusSelect from './components/StatusSelect';
import TooltipPermissionBtn from '@/components/TooltipPermissionBtn';
import { AUTHENTICATIONSTATUS } from './constant';
import { renderOptionsByMap } from '@/utils/data';
import PermissionModal from '@/components/PermissionModal';

export const Staff = () => {
  const [editStaff, setEditStaff] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中条目
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [type, setType] = useState('new');
  const [permissionRecord, setPermissionRecord] = useState({});
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(
    false,
  );
  const [multiEditType, setMultiEditType] = useState(); // 批量设置字段
  const [isMultiEditModalVisible, setIsMultiEditModalVisible] = useState(false); // 批量设置弹窗
  const [dataList, setDataList] = useState([]); // 当前列表数据
  const staffType = 2;
  const TooltipText = '如需权限，请联系当前管理员进行添加，成为合作方管理员后您将可以维护当前合作方的账号职责'

  const searchColumns = [
    {
      name: 'employeeName',
      label: '姓名',
      content: <Input placeholder={'请输入'} />,
    },
    {
      name: 'nameIndidi',
      label: '账号',
      content: <Input placeholder={'请输入'} />,
    },
    {
      name: 'mobile',
      label: '手机号',
      content: <Input placeholder={'请输入'} />,
    },
    {
      name: 'companyId',
      label: '合作方',
      content: <CompanySelect />,
    },
    {
      name: 'jobModeId',
      label: '合作方员工类型',
      content: <StaffTypeSelect />,
    },
    {
      name: 'entityType',
      label: '实体类型',
      content: <NodeTypeSelect />,
    },
    {
      name: 'entityName',
      label: '实体名称',
      content: <Input placeholder={'请输入'} allowClear={true} />,
    },
    {
      name: 'jobTypeId',
      label: '职责',
      content: <JobTypeSelect />,
    },
    {
      name: 'cityCode',
      label: '城市',
      content: <CitySelect />,
    },
    {
      label: '实名认证',
      name: 'realNameStatus',
      content: () => {
        return renderOptionsByMap(AUTHENTICATIONSTATUS, 'id', 'value');
      },
    },
    {
      name: 'status',
      label: '账号状态',
      content: <StatusSelect />
    }
  ];

  const [tableColumns] = useState([
    {
      title: '合作方员工ID',
      dataIndex: 'employeeId',
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '账号',
      dataIndex: 'nameInDidi',
    },
    {
      title: '所属合作方',
      dataIndex: 'companyName',
      width: 120,
    },
    {
      title: '上级',
      dataIndex: 'leaderId',
    },
    {
      title: '合作方员工类型',
      dataIndex: 'jobModeShow',
    },
    {
      title: '实体类型',
      dataIndex: 'entityMap.clentType',
      render: (value, record) => {
        return NODE_TYPE_MAP[_.get(record, 'entityMap.clentType')];
      },
    },
    {
      title: '实体名称',
      dataIndex: 'entityMap.clientName',
    },
    {
      title: '职责',
      dataIndex: 'jobTypeShow',
    },
    {
      title: '城市',
      dataIndex: 'cityName',
    },
    {
      title: '实名认证',
      dataIndex: 'realNameStatus',
      render: (value) => {
        let text = '';
        switch (value) {
          case 'NO_REAL':
            return '未实名';
          case 'IN_REAL':
            return '实名中';
          case 'SUCCESS_REAL':
            return '实名成功';
          case 'FAIL_REAL':
            return '实名失败';
          default:
            return '-'
        }
      }
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      render: (record, index) => {
        return (
          <Space>{record == 0 ? '正常' : record == 1 ? '锁定' : '离职'}</Space>
        );
      },
    },
    {
      title: '创建方式',
      dataIndex: 'source',
      width: 100,
    },
    {
      title: '更新时间',
      tip: '最后一次更新时间，编辑不保存不算更新',
      dataIndex: 'lastUpdateTime',
    },
    {
      title: '更新人',
      tip: '最后一次更新人，编辑不保存不算更新',
      dataIndex: 'operator',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'operate',
      fixed: 'right',
      render: (id, record, index) => {
        return (
          <Space>
            <Button
              size={'small'}
              onClick={() => {
                setPermissionRecord(record);
                openPermissionModal(record);
              }}
            >
              查看权限
            </Button>
            <Button
              size={'small'}
              onClick={() => {
                openStaffModal();
                setEditStaff({
                  ...record,
                  entityType: _.get(record, 'entityMap.clentType'),
                  clientId: _.get(record, 'entityMap.clientId'),
                });
                setType('view');
              }}
            >
              查看
            </Button>
            <TooltipPermissionBtn
              disabled={record.status == 2 || !record.editflag}
              text={'编辑'}
              size={'small'}
              type={'primary'}
              onClick={() => {
                // openStaffModal();
                setEditStaff({
                  ...record,
                  entityType: _.get(record, 'entityMap.clentType'),
                  clientId: _.get(record, 'entityMap.clientId'),
                });
                setType('edit');
              }}
            />
            <Tooltip placement="bottomRight" title={TooltipText}>
              <></><ResetPassword disabled={record.status !== 0 || !record.editflag} index={index} id={record.id} record={record} />
            </Tooltip>
          </Space>
        );
      },
    },
  ]);

  const openStaffModal = () => {
    setIsModalVisible(true);
  };

  // 打开PermissionModal
  const openPermissionModal = record => {
    setIsPermissionModalVisible(true);
    addTableParams(
      { userName: record.nameInDidi, powerType: '1' },
      'permission_table',
      false,
    );
  };
  // 关闭Modal
  const closeEditModal = () => {
    setIsModalVisible(false);
    setIsPermissionModalVisible(false);
  };

  const closeEditStaffModal = () => {
    setIsModalVisible(false);
    addTableParams({}, 'partner_account_table');
  };

  // 点击批量操作
  const handleMenuClick = item => {
    setMultiEditType(item.key);
    setIsMultiEditModalVisible(true);
  };

  // 下拉按钮
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="类型">修改合作方员工类型</Menu.Item>
      <Menu.Item key="城市">修改城市</Menu.Item>
      <Menu.Item key="实体">修改合作方&实体&职责</Menu.Item>
      <Menu.Item key="上级">修改上级</Menu.Item>
      <Menu.Item key="状态">修改账号状态</Menu.Item>
    </Menu>
  );

  const handleFileChange = info => {
    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      // console.log('handleFileChange', info);
      if (_.get(info, 'file.response.errno') == 0) {
        message.success(`${info.file.name} 文件上传成功`);
        addTableParams({}, 'partner_account_table');
      } else {
        message.error(_.get(info, 'file.response.errmsg', '文件校验失败'), 10);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    getCheckboxProps: record => {
      if (record.status !== 0 || !record.editflag) {
        return { disabled: true };
      }
    },
    onChange: selectedKeys => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const middleContent = (
    <div className={style.TableButtons}>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            setType('new');
            setEditStaff(undefined);
            openStaffModal();
          }}
        >
          新增人员
        </Button>

        <Upload
          accept={
            'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
          action={API.uploadTemplate}
          withCredentials={true}
          onChange={handleFileChange}
        >
          <Button icon={<UploadOutlined />} type={'primary'}>
            批量上传
          </Button>
        </Upload>

        <Button href={'https://z.didi.cn/4dIZx'} type={'link'}>
          下载批量上传模板
        </Button>
      </Space>

      <Dropdown disabled={_.isEmpty(selectedRowKeys)} overlay={menu}>
        <Button type={'primary'}>
          批量修改 <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );

  const fetchData = params => {
    return fetchStaffList(params).then(res => {
      const data = getResponseData(res);
      if (Array.isArray(data)) {
        setDataList(res.data);
      }
      return res;
    });
  };

  return (
    <>
      <EasyTable
        name={'partner_account_table'}
        columns={tableColumns}
        middleContent={middleContent}
        showDiyButton={true}
        searchColumns={searchColumns}
        tableProps={{
          scroll: { x: 'max-content' },
          rowSelection,
          rowKey: 'employeeId',
        }}
        customStyle={{
          TableCardClass: tableStyle.NoPaddingTableCard,
          TableCardStyle: { margin: 10 },
        }}
        fetchData={{
          api: fetchData,
          dataField: 'data',
          totalField: 'count',
          pageField: 'page',
          sizeField: 'size',
        }}
      />
      <StaffAdd
        isModalVisible={isModalVisible}
        closeModal={closeEditStaffModal}
        openModal={() => openStaffModal()}
        values={editStaff}
        type={type}
      />
      <MultiEditModal
        visible={isMultiEditModalVisible}
        closeModal={() => {
          setIsMultiEditModalVisible(false);
          addTableParams({}, 'partner_account_table');
        }}
        type={multiEditType}
        dataList={dataList.filter(item =>
          selectedRowKeys.includes(item.employeeId),
        )}
      />

      <PermissionModal
        isModalVisible={isPermissionModalVisible}
        closeModal={closeEditModal}
        record={{
          name: permissionRecord.name,
          ldap: permissionRecord.nameInDidi
        }}
        flag={staffType} // 合作方类型为2  固定值
      />
    </>
  );
};

export default Staff;
