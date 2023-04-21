import React, { useState, useRef } from 'react';
import {
  Button,
  Space,
  Menu,
  Dropdown,
  Row,
  message,
  Descriptions,
  Popconfirm,
  Tag,
  Form,
} from 'antd';
import _ from 'lodash';
import EasyTable from '@/components/EasyTable';
import { WorkSelect } from '@/components/WorkObligation';
import CitySelect from '@/components/CitySelect';
import DepartMentSelect from '@/components/DepartMentSelect';
import { fetchFormalList, deleteEmployeeInfo } from '@/utils/api/formal';
import { renderOptionsByMap } from '@/utils/data';
import { getResponseData } from '@/utils/api/path';
import { TRANSFER_TYPE_MAP, ACCOUNT_STATUS_MAP } from './constant';
import Edit from './component/Edit';
import PermissionModal from '@/components/PermissionModal';
import DutyModal from '@/components/DutyModal';
import { addTableParams } from '@/components/EasyTable/EasyParamStore';
import { DownOutlined } from '@ant-design/icons';
import ImportPersonModal from '@/components/ImportPersonModal';
import style from './style.less';
import { PERSON_DATA_SOURCE_TYPE } from '@/components/ImportPersonModal/constant';
import EntitySelect from '@/components/EntitySelect';
import { ModalType } from '@/utils/constant';

export const Formal = () => {
  const obligationRef: any = useRef();
  const [edit, setEdit] = useState();
  const [permissionRecord, setPermissionRecord] = useState({});
  const [editType, setEditType] = useState('编辑');
  const [ldaps, setLdaps] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isOne, setIsOne] = useState(true);
  const [isEditList, setIsEditList] = useState([]);
  const [dutyVisible, setDutyVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(
    false,
  );
  const [importPersonModalVisible, setImportPersonModalVisible] = useState(
    false,
  );
  const [currentRecord, setCurrentRecord] = useState({});
  const [modalForm] = Form.useForm();
  const dutyModalRef: any = useRef();

  // 是否完成转岗下拉框
  const IsTransferSelect = props => {
    return renderOptionsByMap(
      TRANSFER_TYPE_MAP,
      'isTransfer',
      'isTransferName',
      props,
    );
  };
  // 账号状态下拉框
  const AccountStatusSelect = props => {
    return renderOptionsByMap(
      ACCOUNT_STATUS_MAP,
      'accountStatus',
      'accountStatusName',
      props,
    );
  };
  // 关闭Modal
  const closeEditModal = () => {
    setIsModalVisible(false);
    setIsPermissionModalVisible(false);
  };
  // 打开EditModal
  const openEditModal = () => {
    setIsModalVisible(true);
  };
  // 打开PermissionModal
  const openPermissionModal = record => {
    setIsPermissionModalVisible(true);
    addTableParams(
      { userName: record.ldap, powerType: '1' },
      'permission_table',
      false,
    );
  };
  // 点击批量操作
  const handleMenuClick = e => {
    let isEdit = [];
    isEditList.map(i => {
      if (i.isTransfer == '是') {
        isEdit.push(i.name);
      }
    });
    if (isEdit.length == 0) {
      setEditType(e.key);
      setLdaps(ldaps); // 批量修改人员id
      setIsOne(false);
      openEditModal();
    } else {
      message.error(
        `${_.join(isEdit, ' , ')} 的组织架构已调至橙心，无法修改部门/上级信息`,
      );
    }
  };
  // 列表+搜索 columns
  const [tableColumns] = useState([
    {
      title: '账号',
      dataIndex: 'ldap',
      search: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      search: true,
    },
    {
      title: '部门',
      dataIndex: 'splicingDeptName',
      search: {
        name: 'deptCode',
        content: <DepartMentSelect />, // 公共组件 待接入
      },
      render: (value, record) => {
        let str = '';
        if (value == '') {
          str = '-';
        } else {
          str = value;
        }
        return str;
      },
    },
    {
      title: '岗位',
      dataIndex: 'post',
    },
    {
      title: '工作职责',
      dataIndex: 'duty',
      search: {
        name: 'dutyId',
        content: <WorkSelect />, // 公共组件 待接入
      },
    },
    {
      title: '上级',
      dataIndex: 'managerLdap',
    },
    {
      title: '城市',
      dataIndex: 'city',
      search: {
        name: 'cityId',
        content: <CitySelect />,
      },
    },
    {
      title: '关联实体',
      dataIndex: 'warehouse',
      search: {
        name: 'warehouseCode',
        content: <EntitySelect orgType={''} />,
      },
    },
    {
      title: '商品品类',
      dataIndex: 'staffEmployeeGoodsTypeList',
      render: data => {
        return (
          Array.isArray(data) &&
          data.reduce((total, item, index) => {
            return [
              ...total,
              <Tag key={item.goodsTypeId} color="orange">
                {item.goodsTypeName}
              </Tag>,
              (index + 1) % 2 === 0 && <br />,
            ].filter(Boolean);
          }, [])
        );
      },
    },

    {
      title: '是否完成转岗',
      dataIndex: 'isTransfer',
      search: {
        name: 'isTransfer',
        content: <IsTransferSelect />, // TODO
      },
    },
    {
      title: '账号状态',
      dataIndex: 'accountStatus',
      search: {
        name: 'accountStatus',
        content: <AccountStatusSelect />, // TODO
      },
    },
    {
      title: '操作',
      dataIndex: 'ldap',
      fixed: 'right' as 'right',
      width: 300,
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
              type={'primary'}
              disabled={record.isTransfer == '是'}
              onClick={() => {
                openEditModal();
                setEdit(record);
                setEditType('编辑');
                setIsOne(true);
              }}
            >
              编辑
            </Button>
            <Button
              size={'small'}
              type={'primary'}
              onClick={() => {
                setDutyVisible(true);
                setCurrentRecord(record);
              }}
            >
              分配职责
            </Button>
            <Popconfirm
              title="是否确定删除？"
              onConfirm={() => {
                deleteInfo(record);
              }}
              okText="确定"
              cancelText="取消"
              disabled={record.isTransfer == '是'}
            >
              <Button
                danger
                size={'small'}
                type={'primary'}
                disabled={record.isTransfer == '是'}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ]);
  // 展开项
  const expandList = [
    {
      name: '工号',
      value: 'empId',
    },
    {
      name: '上级姓名',
      value: 'managerName',
    },
    {
      name: '原部门',
      value: 'splicingOldDeptName',
    },
    {
      name: '创建时间',
      value: 'createTime',
    },
    {
      name: '修改时间',
      value: 'updateTime',
    },
  ];
  // 下拉按钮
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="部门">修改部门</Menu.Item>
      <Menu.Item key="上级">修改上级</Menu.Item>
    </Menu>
  );
  // 批量按钮
  const middleContent = (
    <Row justify="end">
      <Space style={{ margin: 10, marginRight: 35 }}>
        <Button
          type="primary"
          onClick={() => setImportPersonModalVisible(true)}
        >
          同步账号
        </Button>
        <Dropdown disabled={ldaps.length == 0} overlay={menu}>
          <Button>
            批量修改 <DownOutlined />
          </Button>
        </Dropdown>
      </Space>
    </Row>
  );

  // 多选配置
  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      let ldaps = [];
      let isEditList = [];
      selectedRows.map(item => {
        ldaps.push(item.ldap);
        isEditList.push({ isTransfer: item.isTransfer, name: item.name });
      });
      setSelectedRowKeys(selectedRowKeys);
      setLdaps(ldaps);
      setIsEditList(isEditList);
    },
  };

  // 删除
  const deleteInfo = record => {
    deleteEmployeeInfo({ ldap: record.ldap })
      .then(res => {
        const data = getResponseData(res);
        if (data !== false) {
          message.success(`删除成功`);
          addTableParams({}, 'formal_person_table');
        }
      })
      .finally();
  };

  const fetchData = params => {
    setSelectedRowKeys([]);
    setLdaps([]); // 清空已选
    return fetchFormalList({ ...params, employType: 'empAcc' }).then(
      (res: any) => {
        return res;
      },
    );
  };

  return (
    <>
      <EasyTable
        name={'formal_person_table'}
        columns={tableColumns}
        middleContent={middleContent}
        fetchData={{
          api: fetchData,
          dataField: 'data',
          totalField: 'count',
          pageField: 'page',
          sizeField: 'size',
        }}
        customStyle={{
          EasyMainClass: style.EasyMainStyle,
          SearchCardClass: style.SearchCardStyle,
          TableCardClass: style.TableCardStyle,
        }}
        showDiyButton={true}
        tableProps={{
          rowKey: 'id',
          scroll: { x: 'max-content' },
          expandable: {
            expandedRowRender: record => (
              <Descriptions>
                {expandList.map((e, i) => (
                  <Descriptions.Item
                    style={{ paddingLeft: 20 }}
                    key={i}
                    label={e.name}
                  >
                    {e.name == '原部门' && !record[e.value]
                      ? ' - '
                      : record[e.value]}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            ),
            rowExpandable: record => !!expandList,
          },
          rowSelection,
        }}
      />
      <Edit
        isModalVisible={isModalVisible}
        closeModal={closeEditModal}
        values={edit}
        type={editType}
        ldaps={ldaps}
        isOne={isOne}
        employType={'empAcc'}
      />
      <PermissionModal
        isModalVisible={isPermissionModalVisible}
        closeModal={closeEditModal}
        record={permissionRecord}
        flag="0"
      />
      {dutyVisible && (
        <DutyModal
          visible={dutyVisible}
          type={ModalType.EMPOWER}
          form={modalForm}
          ref={dutyModalRef}
          record={currentRecord}
          closeModal={() => {
            setDutyVisible(false);
            addTableParams({}, 'formal_person_table');
          }}
        />
      )}
      <ImportPersonModal
        isModalVisible={importPersonModalVisible}
        closeModal={() => {
          setImportPersonModalVisible(false);
          addTableParams({}, 'formal_person_table');
        }}
        dataSource={PERSON_DATA_SOURCE_TYPE.FORMAL}
      />
    </>
  );
};
export default Formal;
