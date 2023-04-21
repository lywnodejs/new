import React, { Component } from 'react';
import {
  Button,
  Form,
  Input,
  Card,
  Row,
  Col,
  Select,
  Popconfirm,
  message
} from 'antd';
import connect from '@utils/translateConnect';
import AvailableApps from '@components/AvailableApps/index';
import UserSelect from '@components/UserSelector';
import EditableTree from '../../../components/EditableTree/index';
import EditableCell from '../../../components/EditableCell/index';
import UserBindModal from './components/UserBindModal';
import { find, uniqueId, startsWith, some } from 'lodash';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

// const isFakeBusiness = businessId => startsWith(businessId, 'business-');
const VALID_LEVEL = 2;
// const SEPARATOR = ',';

class ManageArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessId: '',
      editingArea: null,
      editingAreaParent: {
        name: ''
      },
      // nameEditingStatus: '',
      availableRiskLevel: [],
      modalVisibleForModal: false
    };
    this.idToPathMap = {};
  }

  componentDidMount() {
    const { appId } = this.props;
    if (appId) {
      this.props.getBusiness(appId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.appId && this.props.appId !== nextProps.appId) {
      this.props.getBusiness(nextProps.appId);
    }

    if (this.props.appbindedbusiness !== nextProps.appbindedbusiness) {
      const item = find(nextProps.appbindedbusiness, {
        id: this.state.businessId
      });

      if (!item) {
        this.setState({
          businessId: ''
        });
        this.handleFormReset();
      }

      // const updatedItem = find(
      //   nextProps.appbindedbusiness,
      //   'originalId',
      //   this.state.businessId
      // );

      // if (updatedItem) {
      //   this.setState({
      //     businessId: updatedItem.id
      //   });
      // }
    }
  }

  // transAreaList = (list, path = []) => {
  //   return list.reduce((res, item) => {
  //     this.idToPathMap[item.id] = path;
  //     return res.concat({
  //       value: item.id,
  //       label: item.name,
  //       path: path,
  //       children: item.children
  //         ? this.transAreaList(item.children, path.concat(item.id))
  //         : []
  //     });
  //   }, []);
  // };

  fetchAppAreas = () => {
    this.idToPathMap = {};
    this.props.fetchAreas(this.state.businessId);
  };

  fetchApprover = (appId, businessId, areaId) => {
    this.props.getApprover({ appId, businessId, areaId }).then(() => {
      const {
        dataUsernames = [],
        areaUseranmes = []
      } = this.props.approverInfo;

      this.props.form.setFieldsValue({
        dataUsernames: dataUsernames.map(({ id, username }) => {
          return { key: id, label: username };
        }),
        areaUseranmes: areaUseranmes.map(({ id, username }) => {
          return { key: id, label: username };
        })
      });
    });
  };

  handleBusinessChange = value => {
    const { businessId } = this.state;

    if (businessId === value) {
      return;
    }

    // if (isFakeBusiness(businessId)) {
    //   // 从业务线里删除刚才新建的业务线
    //   this.handleDelBusiness();
    // }

    // 重置所有表单域
    this.handleFormReset([
      'areaName',
      'aid',
      'dataUsernames',
      'areaUseranmes',
      'riskLevel'
    ]);

    this.setState(
      {
        editingArea: null,
        editingAreaParent: {
          name: ''
        },
        businessId: value
        // nameEditingStatus: ''
      },
      () => {
        // if (!isFakeBusiness(value)) {
        //   this.fetchAppAreas();
        // }
        this.fetchAppAreas();
      }
    );
  };

  handleFormReset = (
    fields = ['dataUsernames', 'areaUseranmes', 'riskLevel']
  ) => {
    this.props.form.resetFields(fields);
  };

  handleClear = () => {};

  handleEdit = area => {
    if (!area) {
      this.handleFormReset();

      this.setState({
        editingArea: null,
        editingAreaParent: {
          name: ''
        }
      });

      return;
    }

    const {
      name,
      nameZh,
      parent,
      aid,
      id: areaId,
      taxiId,
      riskLevel,
      level
    } = area;

    if (level == VALID_LEVEL) {
      // 获取审批人信息
      const { appId } = this.props;
      const { businessId } = this.state;

      this.fetchApprover(appId, businessId, areaId);
    }

    this.props.form.setFieldsValue({
      areaName: name,
      aid,
      riskLevel
    });

    this.setState({
      editingArea: area,
      editingAreaParent: parent,
      availableRiskLevel: ['C1', 'C2', 'C3', 'C4']
    });
  };

  handleEditAreaSubmit = () => {
    const { form, updateApprover, appId } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const { dataUsernames = [], areaUseranmes = [], riskLevel } = fieldsValue;

      const { businessId, editingArea } = this.state;

      // let pid = 0;
      // const { editingArea, editingAreaParent } = this.state;
      // if (editingAreaParent) {
      //   pid = editingAreaParent.id;
      // }

      updateApprover({
        appId,
        businessId,
        riskLevel,
        areaId: editingArea.id,
        dataUsernames: dataUsernames.map(({ key, label }) => {
          return { id: key, username: label };
        }),
        areaUseranmes: areaUseranmes.map(({ key, label }) => {
          return { id: key, username: label };
        })
      }).then(() => {
        message.success(this.props.t('操作成功'));
        this.fetchAppAreas();
      });

      // updateArea({
      //   ...editingArea,
      //   name: areaName,
      //   aid,
      //   taxiId,
      //   pid,
      //   appId,
      //   riskLevel
      // });
    });
  };

  // handleAdd = (item, { fakeId }) => {
  //   const nodeData = {
  //     id: fakeId,
  //     name: '新增节点',
  //     path: item ? item.path.concat(fakeId) : [fakeId],
  //     isFake: true,
  //     parent: item,
  //     pid: item ? item.id : 0,
  //     level: 1,
  //     businessId: this.state.businessId,
  //     riskLevel: ''
  //   };

  //   if (item) {
  //     const { children, level } = item;

  //     nodeData.level = +level + 1;

  //     let childrenData = [];
  //     if (children) {
  //       childrenData = [nodeData, ...children];
  //     } else {
  //       childrenData.push(nodeData);
  //     }

  //     this.props.addFakeArea({
  //       ...item,
  //       children: childrenData
  //     });
  //   } else {
  //     this.props.addFakeArea(nodeData);
  //   }

  //   this.handleEdit(nodeData);
  // };

  // handleDel = item => {
  //   const { delArea, appId } = this.props;
  //   const { businessId, editingArea } = this.state;

  //   delArea({
  //     ...item,
  //     businessId,
  //     appId
  //   });

  //   if (editingArea && item.id === editingArea.id) {
  //     this.setState({
  //       editingArea: null,
  //       editingAreaParent: {
  //         name: ''
  //       }
  //     });
  //     this.handleFormReset();
  //   }
  // };

  // handleAddBusiness = () => {
  //   this.handleFormReset();

  //   const fakeId = uniqueId('business-');
  //   const fakeBusiness = {
  //     id: fakeId,
  //     name: this.props.t('请输入业务线名称')
  //   };

  //   this.setState(
  //     {
  //       businessId: fakeId,
  //       nameEditingStatus: 'editing'
  //     },
  //     () => this.props.requestAddBusiness(fakeBusiness)
  //   );
  // };

  // handleNameChange = name => {
  //   const { businessId } = this.state;
  //   const { appId, t, businessList } = this.props;

  //   if (name === '') {
  //     message.error(t('业务线名称不能为空！'));
  //     this.setState({ nameEditingStatus: 'editing' });
  //     return;
  //   }

  //   if (find(businessList, { name })) {
  //     message.error(t('此业务线名称已存在！'));
  //     this.setState({ nameEditingStatus: 'editing' });
  //     return;
  //   }

  //   this.setState({ nameEditingStatus: '' });
  //   this.props.requestNameChange({
  //     name,
  //     businessId,
  //     appId
  //   });
  // };

  handleAppChange = () => {
    const { appId } = this.props;
    const { businessId, editingArea } = this.state;

    if (businessId !== '' && editingArea && editingArea.level == VALID_LEVEL) {
      this.fetchApprover(appId, businessId, editingArea.id);
    }
  };

  // handleDelBusiness = () => {
  //   // 删除当前业务线
  //   this.props.requestDeleteBusiness(this.state.businessId, this.props.appId);
  //   this.setState({
  //     businessId: ''
  //   });
  // };

  handleCancelOnModal = () => {
    this.setState({
      modalVisibleForModal: false
    });
  };

  bindUser = () => {
    this.setState({
      modalVisibleForModal: true
    });
  };

  render() {
    const {
      appId,
      areaList,
      form,
      addFakeArea,
      businessList,
      appbindedbusiness,
      loadingAreaBindedUsers,
      areaBindedUsers,
      t
    } = this.props;

    // if (businessList.length === 0) {
    //   return null;
    // }
    const {
      businessId,
      editingAreaParent,
      editingArea,
      // nameEditingStatus,
      availableRiskLevel
    } = this.state;
    const { getFieldDecorator } = form;

    // const business = find(businessList, ['id', businessId]);

    return (
      <div className="ManageAreas">
        <Card title={t('数据区域及审批人管理')} bordered={false}>
          <Row gutter={24} className="search-fields">
            <Col span={8}>
              <FormItem label={t('目标系统：')}>
                <AvailableApps
                  changeCallBack={this.handleAppChange}
                  style={{ width: '100%' }}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={t('业务线选择：')}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  value={businessId}
                  onChange={this.handleBusinessChange}
                  style={{ width: '100%' }}>
                  {appbindedbusiness.map(bus => (
                    <Option key={bus.id} value={bus.id}>
                      {bus.commonName || bus.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            {/* <Col span={24}>
              <Button
                type="primary"
                className="new-business-btn btn"
                onClick={this.handleAddBusiness}
                disabled={some(businessList, (item) => startsWith(item.id, 'business-'))}
              >
                {t('新增业务线')}
              </Button>
            </Col> */}
            {/*<Col span={8}>*/}
            {/*<FormItem label="中文名：">*/}
            {/*<Input/>*/}
            {/*</FormItem>*/}
            {/*</Col>*/}
          </Row>
        </Card>

        <Card
          title={t('业务线地区列表')}
          bordered={false}
          className="ManageAreas-list">
          {/* {business && (
            <Row gutter={24} className="dimension-name-field">
              <Col span={24}>
                {t('业务线名称：')}
                <EditableCell
                  value={business.name}
                  onChange={this.handleNameChange}
                  className="name-input"
                  status={nameEditingStatus}
                />
              </Col>
            </Row>
          )} */}

          {/* {businessId !== '' && !startsWith(businessId, 'business-') ? ( */}
          {businessId !== '' ? (
            <Row gutter={24} className="">
              <Col span={12}>
                <EditableTree
                  data={areaList}
                  requestSelect={this.handleEdit}
                  isNeedSearch
                  isNeedAdd={false}
                  isNeedDel={false}
                />
              </Col>

              <Col span={12}>
                <div className="options">
                  <Button
                    type="primary"
                    onClick={this.bindUser}
                    disabled={!editingArea}>
                    {t('用户绑定')}
                  </Button>
                </div>
                <h4>{t('详情编辑')}</h4>
                <Form className="edit-form">
                  <FormItem {...formItemLayout} label={t('地区')}>
                    {getFieldDecorator('areaName')(<Input disabled />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="AID">
                    {getFieldDecorator('aid')(<Input disabled />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label={t('父级')}>
                    <Input
                      disabled
                      value={editingAreaParent ? editingAreaParent.name : ''}
                    />
                  </FormItem>

                  <FormItem {...formItemLayout} label={t('敏感级别')}>
                    {getFieldDecorator('riskLevel', {
                      rules: [{ required: true, message: t('请输入敏感级别') }]
                    })(
                      <Select
                        // value={riskLevel}
                        // onChange={(e) => this.handleSearchFieldChange(e, 'isMenu')}
                        // className="menu-select"
                        style={{ width: '100%' }}
                        // disabled={!editingArea}
                      >
                        <Option value="">{t('请选择')}</Option>
                        {availableRiskLevel &&
                          availableRiskLevel.map(item => (
                            <Option key={item} value={item}>
                              {item}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>

                  {editingArea && editingArea.level == VALID_LEVEL ? (
                    <React.Fragment>
                      <FormItem {...formItemLayout} label="数据接口人">
                        {getFieldDecorator('dataUsernames')(
                          <UserSelect selectType="multiple" noRepeat={true} />
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="区域负责人">
                        {getFieldDecorator('areaUseranmes')(
                          <UserSelect selectType="multiple" noRepeat={true} />
                        )}
                      </FormItem>
                    </React.Fragment>
                  ) : null}

                  <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                    <Button
                      type="primary"
                      onClick={this.handleEditAreaSubmit}
                      disabled={!editingArea}>
                      {t('保存')}
                    </Button>

                    <Button
                      type="primary"
                      className="reset-btn"
                      onClick={() => {
                        this.handleFormReset();
                      }}>
                      {t('清空')}
                    </Button>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          ) : (
            <span />
          )}
        </Card>
        <UserBindModal
          params={{
            appId,
            businessId,
            areaId: editingArea && editingArea.id
          }}
          visible={this.state.modalVisibleForModal}
          handleCancel={this.handleCancelOnModal}
          editingAreaName={editingArea && editingArea.name}
          total={this.state.totalForAreaBindedUsers}
          afterClose={this.afterCloseOnModal}
        />
      </div>
    );
  }
}

export default connect(
  ({ area, admin, global, manageApprover }) => {
    return {
      areaList: area.list,
      businessList: area.business,
      appbindedbusiness: admin.appbindedbusiness,
      appId: global.managingApp,
      approverInfo: manageApprover.approverInfo
    };
  },
  dispatch => ({
    // requestAddBusiness(business) {
    //   dispatch({
    //     type: 'area/newBusiness',
    //     payload: business
    //   });
    // },
    getBusiness(appId) {
      dispatch({
        type: 'admin/getAppBindedBusiness',
        payload: { appId }
      });
    },
    // requestNameChange(params) {
    //   dispatch({
    //     type: 'area/changeBusinessName',
    //     payload: params
    //   });
    // },
    // requestDeleteBusiness(businessId, appId) {
    //   dispatch({
    //     type: 'area/deleteBusiness',
    //     payload: {
    //       businessId,
    //       appId
    //     }
    //   });
    // },
    fetchAreas(businessId) {
      dispatch({
        type: 'area/fetch',
        payload: businessId
      });
    },
    // addFakeArea(flag) {
    //   dispatch({
    //     type: 'area/addFakeArea',
    //     payload: flag
    //   });
    // },
    // updateArea(params) {
    //   dispatch({
    //     type: 'area/updateArea',
    //     payload: params
    //   });
    // },
    // delArea(params) {
    //   dispatch({
    //     type: 'area/delArea',
    //     payload: params
    //   });
    // },
    getApprover(params) {
      return dispatch({
        type: 'manageApprover/getApprover',
        payload: params
      });
    },
    updateApprover(params) {
      return dispatch({
        type: 'manageApprover/updateApprover',
        payload: params
      });
    }
  })
)(Form.create()(ManageArea));
