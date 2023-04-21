import React, { useState, useEffect } from 'react';
import { Button, Space, Tag, Tooltip, Popover, Col, Row } from 'antd';
import EasyTable from '@/components/EasyTable';
import { queryCompanyList } from '@/utils/api/company';
import Edit from './Edit';
import NodeTypeSelect from '@/components/NodeTypeSelect';
import PartnerTypeSelect from '@/components/PartnerTypeSelect';
import style from '@/components/EasyTable/style.less';
import _ from 'lodash';
import { NODE_TYPE_MAP } from '@/components/NodeTypeSelect/constant';
import { PARTNER_STATUS, COMPANYTYPE } from '@/pages/partner/manage/constant';
import { renderOptionsByMap } from '@/utils/data';
import PermissionButton from '@/components/PermissionButton';
import { QrcodeOutlined } from '@ant-design/icons';
import ManagementEdit from './ManagementEdit';
import HouseManagementEdit from './HouseManagementEdit';
import EditPersonForm from './EditPersonForm';
import TooltipPermissionBtn from '@/components/TooltipPermissionBtn';
import QRCode from 'qrcode.react';
import './style.less';
import { getCompanyCategoryType } from '@/utils/api/company'
import { httpParse } from '@/utils/http'

export const Company = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [management, setManagement] = useState(false);
  const [editPerson, setEditPerson] = useState(false);
  const [editPersonVal, setEditPersonVal] = useState(false);
  const [values, setValues] = useState({});
  const [manageId, setManageId] = useState({});
  const [type, setType] = useState('new');
  const [managementType, setManagementType] = useState(0);
  const [houseManagementVisible, setHouseManagementVisible] = useState(false);
  const [houseManagementId, setHouseManagementId] = useState(false);
  const [companyCategory, setCompanyCategory] = useState([])
  const COMPANY_TYPE = 'GW'; // 网格仓
  const TooltipText =
    '如需权限，请联系当前管理员进行添加，成为合作方管理员后您将可以维护当前合作方的账号职责';
  const TableColumn = [
    {
      title: '合作方 ID',
      dataIndex: 'companyId',
      search: {
        name: 'companyId',
      },
    },
    {
      title: '合作方名称',
      dataIndex: 'companyName',
      search: true,
    },
    {
      title: '合作方类型',
      dataIndex: 'companyCategory',
      render: data => {
        const index = Array.isArray(companyCategory) && companyCategory.findIndex(item => item.code === data)
        return companyCategory[index]?.desc;
      },
      search: {
        name: 'companyCategory',
        content: <PartnerTypeSelect companyCategory={companyCategory}/>,
      },
    },
    {
      title: '负责人姓名',
      dataIndex: 'legalPerson',
    },
    {
      title: '联系账号',
      dataIndex: 'nameInDidi',
      search: {
        name: 'nameIndidi',
      },
    },
    {
      title: '实体类型',
      dataIndex: 'entityMap.clentType',
      render: (value, record) => {
        return NODE_TYPE_MAP[_.get(record, 'staffOrganizations[0].orgType')];
      },
      search: {
        name: 'orgType',
        content: <NodeTypeSelect />,
      },
    },
    {
      title: '实体名称',
      dataIndex: 'staffOrganizations',
      render: data => {
        return (
          Array.isArray(data) &&
          data.reduce((total, item, index) => {
            return [
              ...total,
              <Tag key={item.relEntity} color="orange">
                {item.orgName}
              </Tag>,
              (index + 1) % 2 === 0 && <br />,
            ].filter(Boolean);
          }, [])
        );
      },
      search: {
        name: 'entityName',
      },
    },
    {
      title: '招募邀请码',
      dataIndex: 'inviteCode',
      render: (value, record) => {
        return (
          <Popover content={renderImg(record)}>
            <QrcodeOutlined /> {value}
          </Popover>
        );
      },
    },
    {
      title: '合作方状态',
      dataIndex: 'status',
      render: value => {
        return PARTNER_STATUS[value];
      },
      search: {
        name: 'status',
        content: () => {
          return renderOptionsByMap(PARTNER_STATUS, 'key', 'name');
        },
      },
    },
    {
      title: '合作方加盟税号',
      dataIndex: 'taxNo',
      search: true,
    },
    {
      title: '最后更新时间',
      dataIndex: 'lastUpdateTime',
    },
    {
      title: '最后更新人',
      dataIndex: 'operator',
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'company',
      render: (data, record) => {
        return (
          <Space>
            {data && data.id}
            <Button
              size={'small'}
              onClick={() => {
                setModalVisible(true);
                setValues({
                  ...record,
                  orgType: _.get(record, 'staffOrganizations[0].orgType'),
                  serviceEntityList: (record.staffOrganizations || []).map(
                    item => item.relEntity,
                  ),
                });
                setType('view');
              }}
            >
              查看
            </Button>
            <Button
              size={'small'}
              onClick={() => {
                setManageId(record);
                setManagement(true);
              }}
            >
              管理员配置
            </Button>

            <TooltipPermissionBtn
              size={'small'}
              text={'编辑'}
              type={'primary'}
              disabled={!record.editflag}
              onClick={() => {
                setModalVisible(true);
                setValues({
                  ...record,
                  orgType: _.get(record, 'staffOrganizations[0].orgType'),
                  serviceEntityList: (record.staffOrganizations || []).map(
                    item => item.relEntity,
                  ),
                });
                setType('edit');
              }}
            />

            <TooltipPermissionBtn
              placement={'topRight'}
              size={'small'}
              text={'修改联系人'}
              type={'primary'}
              disabled={!record.editflag}
              onClick={() => {
                setEditPerson(true);
                setEditPersonVal(record.companyId);
              }}
            />
          </Space>
        );
      },
    },
  ];

  const renderImg = record => {
    const url =
      window.location.origin + `/#/h5/register?inviteCode=${record.inviteCode}`;
    return (
      <>
        <p style={{ textAlign: 'center', marginBottom: '0px' }}>
          <QRCode
            renderAs={'canvas'} // 生成为canvas  还是svg
            value={url} // 生成二维码的内容
            size={100} // 二维码的大小
            fgColor="#000000" // 二维码的颜色
            imageSettings={{
              // 中间有图片logo
              src: require('@/assets/img/weiweimaicon.png'),
              height: 17,
              width: 17,
              excavate: true,
            }}
          />
        </p>
        <p style={{ textAlign: 'center', marginBottom: '0px' }}>
          {record.companyName}
        </p>
      </>
    );
  };

  const middleContent = (
    <div style={{ margin: 10 }}>
      <Tooltip title={TooltipText}>
        <PermissionButton
          permissionUrl={'/company/newCompany'}
          type="primary"
          onClick={() => {
            setModalVisible(true);
            setType('new');
            setValues(undefined);
          }}
        >
          新增合作方
        </PermissionButton>
      </Tooltip>
    </div>
  );

  useEffect(() => {
    getCompanyCategoryType().then(res => {
      httpParse(res, (data) => {
        const {companyCategory = []} = data;
        setCompanyCategory(companyCategory);
      })
    })
  }, [])
  return (
    <>
      <EasyTable
        name={'partner_manage_table'}
        columns={TableColumn}
        middleContent={middleContent}
        showDiyButton={true}
        tableProps={{
          scroll: { x: 'max-content' },
          rowKey: 'companyId',
          expandable: {
            expandedRowRender: record =>
              Array.isArray(_.get(record, 'staffOrganizations')) &&
              _.get(record, 'staffOrganizations').length !== 0 ? (
                <>
                  <p style={{ marginLeft: '50px' }}>仓库管理员配置</p>
                  {_.get(record, 'staffOrganizations').map(item => {
                    return (
                      <Row
                        style={{ marginBottom: '10px', paddingLeft: '50px' }}
                      >
                        <Col span={3}>
                          <Tag key={item.relEntity} color="orange">
                            {item.orgName}
                          </Tag>
                        </Col>
                        <Col offset={1}>
                          <Button
                            size={'small'}
                            onClick={() => {
                              setManagementType(0);
                              setManageId(record);
                              setHouseManagementId(item.orgId);
                              setHouseManagementVisible(true);
                            }}
                          >
                            仓库管理员（内部）
                          </Button>
                        </Col>
                        <Col offset={1}>
                          <Button
                            size={'small'}
                            onClick={() => {
                              setManagementType(1);
                              setManageId(record);
                              setHouseManagementId(item.orgId);
                              setHouseManagementVisible(true);
                            }}
                          >
                            仓库管理员（外部）
                          </Button>
                        </Col>
                      </Row>
                    );
                  })}
                </>
              ) : (
                '-'
              ),
            rowExpandable: record => {
              return _.get(record, 'companyCategory') === COMPANY_TYPE;
            },
          },
        }}
        customStyle={{
          TableCardClass: style.NoPaddingTableCard,
          TableCardStyle: { margin: 10 },
        }}
        fetchData={{
          api: queryCompanyList,
          dataField: 'data',
          totalField: 'count',
          pageField: 'page',
          sizeField: 'size',
        }}
      />
      <Edit
        visible={modalVisible}
        values={values}
        type={type}
        companyCategory={companyCategory}
        closeModal={() => {
          setModalVisible(false);
          setValues({});
        }}
        onCancel={() => {
          setModalVisible(false);
          setValues({});
        }}
      />

      <ManagementEdit
        isModalVisible={management}
        values={manageId}
        closeModal={() => {
          setManagement(false);
          setManageId({});
        }}
        onCancel={() => {
          setManagement(false);
          setManageId({});
          // setValues({});
        }}
      />
      <HouseManagementEdit
        isModalVisible={houseManagementVisible}
        type={managementType}
        houseManagementId={houseManagementId}
        values={manageId}
        closeModal={() => {
          setHouseManagementVisible(false);
        }}
        onCancel={() => {
          setHouseManagementVisible(false);
        }}
      />
      <EditPersonForm
        visible={editPerson}
        companyId={editPersonVal}
        closeModal={() => {
          setEditPerson(false);
        }}
        onCancel={() => {
          setEditPerson(false);
        }}
      />
    </>
  );
};

export default Company;
