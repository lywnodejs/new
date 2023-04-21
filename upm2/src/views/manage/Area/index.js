import React, { Component } from 'react';
import { Button, Form, Input, Card, Row, Col, Select, Popconfirm, message, Modal, Upload, TreeSelect } from 'antd';
import connect from '@utils/translateConnect';
import EditableTree from '../../../components/EditableTree/index';
import EditableCell from '../../../components/EditableCell/index';
import SystemManagement from './SystemManagement';
import { find, uniqueId, startsWith, some } from 'lodash';
import { apiHost } from '@config/apiConfig';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const isFakeBusiness = (businessId) => startsWith(businessId, 'business-');

class ManageArea extends Component {
  state = {
    businessId: '',
    editingArea: null,
    editingAreaParent: {
      name: ''
    },
    nameEditingStatus: '',
    availableRiskLevel: [],
    systemVisible: false,
    importDataModal: false,//弹窗显示
    importDataModalText: '',//业务线名称
    uploadStatus: false,//文件上传中状态
    fileList: [],//文件上传列表 始终控制为一个文件
    isShowBtn: false
  };

  componentWillReceiveProps (nextProps) {
    if (nextProps.appId && this.props.appId !== nextProps.appId) {
      this.props.getBusiness();
    }

    if (this.props.businessList !== nextProps.businessList) {
      const item = find(nextProps.businessList, { id: this.state.businessId });

      if (!item) {
        this.setState({
          businessId: ''
        });
        this.handleFormReset();
      }

      const updatedItem = find(nextProps.businessList, 'originalId', this.state.businessId);

      if (updatedItem) {
        this.setState({
          businessId: updatedItem.id
        });
      }
    }
  }

  idToPathMap = {};

  transAreaList = (list, path = []) => {
    return list.reduce((res, item) => {
      this.idToPathMap[item.id] = path;
      return res.concat({
        value: item.id,
        label: item.name,
        path: path,
        children: item.children ? this.transAreaList(item.children, path.concat(item.id)) : []
      });
    }, []);
  };

  fetchAppAreas = () => {
    this.idToPathMap = {};
    this.props.fetchAreas(this.state.businessId);
  };

  handleBusinessChange = (value) => {
    const { businessId } = this.state;

    if (businessId === value) {
      return;
    }

    if (isFakeBusiness(businessId)) {
      // 从业务线里删除刚才新建的业务线
      this.handleDelBusiness();
    }

    this.handleFormReset();

    this.setState({
      businessId: value,
      nameEditingStatus: ''
    }, () => {
      if (!isFakeBusiness(value)) {
        const { appId, userId } = this.props
        this.fetchAppAreas();
        this.props.isAllManager({
          appId,
          userId
        }).then(res => {
          this.setState({
            isShowBtn: res
          })
        })
      }
    });
  };

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  handleEdit = (area) => {
    if (!area) {
      this.handleFormReset();

      this.setState({
        editingArea: null,
        editingAreaParent: {
          name: ''
        },
      });

      return;
    }

    const {
      name,
      nameZh,
      aliases,
      parent,
      aid,
      taxiId,
      availableRiskLevel,
      riskLevel,
      pid
    } = area;

    this.props.form.setFieldsValue({
      areaName: name,
      aliases: aliases || '',
      aid,
      taxiId,
      riskLevel,
      pid
      // areaNameZh: nameZh,
    });

    this.setState({
      editingArea: area,
      editingAreaParent: parent,
      availableRiskLevel: availableRiskLevel || ['C1', 'C2', 'C3', 'C4']
    });
  };

  handleEditAreaSubmit = () => {
    const { form, updateArea, appId, t } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const {
        areaName,
        aliases,
        aid,
        taxiId,
        riskLevel,
        pid
      } = fieldsValue;

      const { editingArea } = this.state;

      updateArea({
        ...editingArea,
        name: areaName,
        aliases,
        aid,
        taxiId,
        pid,
        appId,
        riskLevel
      }).then(() => {
        message.success(t('保存成功'))
        this.fetchAppAreas();
      });
    });
  };

  handleAdd = (item, { fakeId }) => {
    const nodeData = {
      id: fakeId,
      name: '新增节点',
      path: item ? item.path.concat(fakeId) : [fakeId],
      isFake: true,
      parent: item,
      pid: item ? item.id : 0,
      level: 1,
      businessId: this.state.businessId,
      riskLevel: ''
    };

    if (item) {
      const {
        children,
        level
      } = item;

      nodeData.level = + level + 1;

      let childrenData = [];
      if (children) {
        childrenData = [nodeData, ...children];
      } else {
        childrenData.push(nodeData);
      }

      this.props.addFakeArea({
        ...item,
        children: childrenData,
      });
    } else {
      this.props.addFakeArea(nodeData);
    }

    this.handleEdit(nodeData);
  };

  handleDel = (item) => {
    const {
      delArea,
      appId
    } = this.props;
    const { businessId, editingArea } = this.state;

    delArea({
      ...item,
      businessId,
      appId
    });

    if (editingArea && item.id === editingArea.id) {
      this.setState({
        editingArea: null,
        editingAreaParent: {
          name: ''
        },
      });
      this.handleFormReset();
    }
  };

  handleAddBusiness = () => {
    this.handleFormReset();

    const fakeId = uniqueId('business-');
    const fakeBusiness = {
      id: fakeId,
      name: this.props.t('请输入业务线名称')
    };

    this.setState({
      businessId: fakeId,
      nameEditingStatus: 'editing'
    }, () => this.props.requestAddBusiness(fakeBusiness));
  };

  handleNameChange = (name) => {
    const { businessId } = this.state;
    const { appId, t, businessList } = this.props;

    if (name === '') {
      message.error(t('业务线名称不能为空！'));
      this.setState({ nameEditingStatus: 'editing' });
      return;
    }

    if (find(businessList, { name })) {
      message.error(t('此业务线名称已存在！'));
      this.setState({ nameEditingStatus: 'editing' });
      return;
    }

    this.setState({ nameEditingStatus: '' });
    this.props.requestNameChange({
      name,
      businessId,
      appId
    });
  };

  handleDelBusiness = () => {
    // 删除当前业务线
    this.props.requestDeleteBusiness(this.state.businessId, this.props.appId);
    this.setState({
      businessId: ''
    });
  };

  importData = () => {
    const { businessList } = this.props;
    let text = '';
    businessList.map((item) => {
      if (item.id === this.state.businessId) {
        text = item.name;
      }
    })
    this.setState({
      importDataModalText: text,
      importDataModal: true,
    })
  }
  closeImportModal = (bool) => {
    this.setState({
      importDataModal: false,
      fileList: []
    }, () => {
      bool ? document.getElementsByClassName('test')[0].click() : '';
    })
  }
  uploadFile = (file) => {
    let status = file.file.status;
    if (status === 'uploading') {
      this.setState({
        uploadStatus: true
      })
    }
  }

  complate = (res) => {
    const { t } = this.props;
    this.setState({
      uploadStatus: false
    })
    if (res.code === 200) {
      this.fetchAppAreas();
      message.success(t('操作成功'));
    } else {
      message.error(t(res.msg));
    }
  }
  //模版下载
  uploadTemplate = () => {
    let appId = this.props.appId;
    window.open(`${apiHost}/v2/area/template/download?appId=${appId}`);
  }
  //导出模版
  exportTemplate = () => {
    let businessId = this.state.businessId;
    let appId = this.props.appId;
    window.open(`${apiHost}/v2/area/export?businessId=${businessId}&appId=${appId}`);
  }
  //返回data数据
  returnUploadData = file => {
    let businessId = this.state.businessId,
      fileName = file.name ? file.name.split('.')[0] : '',
      appId = this.props.appId;
    return {
      appId,
      businessId,
      fileName
    }
  }
  //打开系统管理
  openSystem = () => {
    const { businessList } = this.props;
    let text = '';
    businessList.map((item) => {
      if (item.id === this.state.businessId) {
        text = item.name;
      }
    })
    this.setState({
      importDataModalText: text,
      systemVisible: true,
    })
  }
  //关闭系统管理
  closeSystem = () => {
    // this.$refs.SystemManagement.getVal('')
    this.setState({
      systemVisible: false
    })
  }
  _clear = (c) => {
    c.setState({
      appId: ''
    })
  }

  // 选择父节点的回调，更新level
  onParentChange = (value) => {
    const { areaList } = this.props
    const { editingArea } = this.state
    const findLevel = (list) => {
      list.map(item => {
        if (item.id == value) {
          this.setState({
            editingArea: {
              ...editingArea,
              level: item.level + 1
            }
          })
        } else if (item.children) {
          findLevel(item.children)
        }
      })
    }
    if (value == 0) {
      this.setState({
        editingArea: {
          ...editingArea,
          level: 1
        }
      })
      return
    }
    findLevel(areaList)
  }

  render () {
    const {
      areaList,
      form,
      addFakeArea,
      businessList,
      t
    } = this.props;

    // if (businessList.length === 0) {
    //   return null;
    // }
    const { businessId, editingAreaParent, editingArea, nameEditingStatus, availableRiskLevel, importDataModal, importDataModalText, uploadStatus, fileList, isShowBtn } = this.state;
    const { getFieldDecorator } = form;

    const business = find(businessList, ['id', businessId]);

    const reducer = (list) => {
      return list.reduce((acc, item) => {
        if (editingArea && editingArea.id === item.id) {
          return acc;
        }

        let i = {};
        i.title = item.name;
        i.value = `${item.id}`;
        i.key = item.id;

        if (item.children) {
          i.children = reducer(item.children);
        }

        return acc.concat(i);
      }, []);
    };
    const parentsData = [{
      title: t('顶级节点'),
      value: '0',
      key: 0,
    }].concat(reducer(areaList));

    return (
      <div className="ManageAreas">
        <Card title={t('地区管理')} bordered={false}>
          <Row gutter={24} className="search-fields">
            <Col span={8}>
              <FormItem label={t('业务线选择：')}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  value={businessId}
                  onChange={this.handleBusinessChange}
                  style={{ width: '100%' }}
                >
                  {businessList.map((bus) => (
                    <Option
                      key={bus.id}
                      value={bus.id}
                    >
                      {bus.commonName || bus.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            {/*<Col span={8}>*/}
            {/*<FormItem>*/}
            {/*<Button*/}
            {/*type="primary"*/}
            {/*className="btn"*/}
            {/*onClick={this.fetchAppAreas}>*/}
            {/*查询*/}
            {/*</Button>*/}
            {/*</FormItem>*/}
            {/*</Col>*/}
            <Col span={16}>
              <Button
                type="primary"
                className="new-business-btn btn"
                onClick={this.handleAddBusiness}
                disabled={some(businessList, (item) => startsWith(item.id, 'business-'))}
              >
                {t('新增业务线')}
              </Button>

              <Popconfirm
                title={t('确定删除此业务线？删除后不可恢复！')}
                okText={t('确定')}
                cancelText={t('取消')}
                onConfirm={this.handleDelBusiness}
              >
                <Button
                  type="primary"
                  className="new-business-btn"
                  disabled={businessId === ''}
                >
                  {t('删除选中业务线')}
                </Button>
              </Popconfirm>
            </Col>
            {/*<Col span={8}>*/}
            {/*<FormItem label="中文名：">*/}
            {/*<Input/>*/}
            {/*</FormItem>*/}
            {/*</Col>*/}
          </Row>
          <Row style={{ display: businessId ? 'block' : 'none' }}>
            <Button
              type="primary"
              className="data-export-but"
              onClick={this.exportTemplate}
            >
              {t('导出')}
            </Button>
            <Button
              type="primary"
              loading={uploadStatus}
              style={{ marginLeft: '15px', display: isShowBtn ? 'inline' : 'none' }}
              onClick={this.importData}
            >
              {t('导入')}
            </Button>
            <Button
              type="link"
              style={{ display: isShowBtn ? 'inline' : 'none' }}
              onClick={this.uploadTemplate}
            >
              {t('下载导入模版')}
            </Button>
            <Modal
              centered
              width={500}
              visible={importDataModal}
              onOk={() => this.closeImportModal(true)}
              onCancel={() => this.closeImportModal(false)}
            >
              <div className="ManageAreas_infoImport">
                <i className={'iconfont iconzhuyishixiang_f'}></i>
                <h4>
                  {t('注意')}
                </h4>
                <p>
                  {t('是否确定新增')}
                  <a href="javascript:;"> {importDataModalText} </a>
                  {t('业务线的地区数据？')}
                </p>
              </div>
            </Modal>
            <Col className={'ManageAreas_Uploadbox'}>
              <Upload
                showUploadList={false}
                withCredentials={true}
                onChange={this.uploadFile}
                onSuccess={this.complate}
                fileList={fileList}
                action={`${apiHost}/v2/area/import`}
                accept={'.xlsx'}
                data={this.returnUploadData}
              >
                <Button className={'test'}></Button>
              </Upload>
            </Col>
          </Row>
        </Card>

        <Card title={t('业务线地区列表')} bordered={false} className="ManageAreas-list">
          {business && (
            <Row gutter={24} className="dimension-name-field">
              <div style={{padding:'0 12px'}}>
                <span>{`${t('业务线ID：')}${business.id}`}</span>
              </div>
              <Col span={24}>
                {t('业务线名称：')}
                <EditableCell
                  value={business.name}
                  onChange={this.handleNameChange}
                  className="name-input"
                  status={nameEditingStatus}
                />
                <Button className="SystemManagement" type="primary" onClick={this.openSystem}>{t('系统管理')}</Button>
                
                <Modal
                  title={importDataModalText + '-' + t('系统管理')}
                  centered={true}
                  width="800px"
                  visible={this.state.systemVisible}
                  onOk={this.closeSystem}
                  onCancel={this.closeSystem}
                >
                  <SystemManagement
                    onRef={c => this._clear(c)}
                    t={t}
                    id={businessId}
                  />
                </Modal>
              </Col>
            </Row>
          )}

          {businessId !== '' && !startsWith(businessId, 'business-') ? (
            <Row gutter={24} className="">
              <Col span={12}>
                <EditableTree
                  data={areaList}
                  requestAdd={this.handleAdd}
                  requestDel={this.handleDel}
                  requestSelect={this.handleEdit}
                  isNeedSearch
                />
              </Col>

              <Col span={12} style={{ display: editingArea ? '' : 'none' }}>
                <h4>{t('详情编辑')}</h4>
                <Form className="edit-form">
                  <FormItem
                    {...formItemLayout}
                    label={t('地区')}
                  >
                    {getFieldDecorator('areaName', {
                      rules: [{ required: true, message: t('请输入地区') }],
                    })(
                      <Input />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={t('地区别名')}
                  >
                    {getFieldDecorator('aliases', {
                      // rules: [{ required: true, message: t('请输入地区') }],
                    })(
                      <Input placeholder={t('可输入多个，请用英文逗号分隔开')} />
                    )}
                  </FormItem>

                  <FormItem
                    {...formItemLayout}
                    label="AID"
                  >
                    {getFieldDecorator('aid', {
                      rules: [{ required: true, message: t('请输入 aid') }],
                    })(
                      <Input />
                    )}
                  </FormItem>

                  <FormItem
                    {...formItemLayout}
                    label="Taxi Id"
                  >
                    {getFieldDecorator('taxiId', {
                      rules: [{ required: true, message: t('请输入 taxiId') }],
                    })(
                      <Input />
                    )}
                  </FormItem>

                  <FormItem
                    {...formItemLayout}
                    label={t('父级')}
                  >
                    {getFieldDecorator('pid')(
                      <TreeSelect
                        placeholder={t('描述该功能是否具有上级节点，默认为顶级节点')}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={parentsData}
                        treeDefaultExpandAll={false}
                        disabled={!isShowBtn}
                        onChange={this.onParentChange}
                      />
                    )}
                    {/* <Input disabled={!isShowBtn} value={editingAreaParent ? editingAreaParent.name : ''} /> */}
                  </FormItem>

                  <FormItem
                    {...formItemLayout}
                    label={t('敏感级别')}
                  >
                    {getFieldDecorator('riskLevel', {
                      rules: [{ required: true, message: t('请输入敏感级别') }],
                    })(
                      <Select
                        // value={riskLevel}
                        // onChange={(e) => this.handleSearchFieldChange(e, 'isMenu')}
                        // className="menu-select"
                        style={{ width: '100%' }}
                      // disabled={!editingArea}
                      >
                        <Option value="">{t('请选择')}</Option>
                        {availableRiskLevel && availableRiskLevel.map(item => <Option key={item} value={item}>{item}</Option>)}
                      </Select>
                    )}
                  </FormItem>

                  <FormItem
                    wrapperCol={{ span: 12, offset: 6 }}
                  >
                    <Button
                      type="primary"
                      onClick={this.handleEditAreaSubmit}
                      disabled={!editingArea}
                    >
                      {t('保存')}
                    </Button>

                    <Button
                      type="primary"
                      className="reset-btn"
                      onClick={this.handleFormReset}
                    >
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
      </div>
    );
  }

  componentDidMount () {
    this.props.getBusiness();
  }
}

export default connect(({ area, global, userInfo }) => {
  return {
    areaList: area.list,
    businessList: area.business,
    // appId: global.managingApp,
    appId: 888,
    userId: userInfo.id
  };
}, (dispatch) => ({
  requestAddBusiness (business) {
    dispatch({
      type: 'area/newBusiness',
      payload: business
    });
  },
  getBusiness () {
    dispatch({
      type: 'area/getBusiness'
    });
  },
  requestNameChange (params) {
    dispatch({
      type: 'area/changeBusinessName',
      payload: params
    });
  },
  requestDeleteBusiness (businessId, appId) {
    dispatch({
      type: 'area/deleteBusiness',
      payload: {
        businessId,
        appId
      }
    });
  },
  fetchAreas (businessId) {
    dispatch({
      type: 'area/fetch',
      payload: businessId
    });
  },
  addFakeArea (flag) {
    dispatch({
      type: 'area/addFakeArea',
      payload: flag
    });
  },
  updateArea (params) {
    return dispatch({
      type: 'area/updateArea',
      payload: params
    });
  },
  delArea (params) {
    dispatch({
      type: 'area/delArea',
      payload: params
    });
  },
  isAllManager (params) {
    return dispatch({
      type: 'area/getAppManager',
      payload: params
    })
  }
}))(Form.create()(ManageArea));
