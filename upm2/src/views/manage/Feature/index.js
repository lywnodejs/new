import React, { Component } from 'react';
import {
  Button,
  Form,
  Input,
  Card,
  Row,
  Col,
  Select,
  Upload,
  message,
  TreeSelect,
  Modal,
  Divider,
  Table,
  InputNumber,
  Tooltip,
  Popover,
  Spin
} from 'antd';
import connect from '@utils/translateConnect';
import AvailableApps from '@components/AvailableApps/index';
import EditableTree from '@components/EditableTree/index';
import LanguageInputList from '@components/LanguageInputList';
import { apiHost } from '@config/apiConfig';
import findTreeNodeById from '@utils/findTreeNodeById';
import _ from 'lodash';
import LimitForm from './LimitForm';
import './index.less';
import languageList from '@assets/commonData/languageList';
import { PubSub } from 'pubsub-js';
import uploadTemplate from '@assets/template/功能点-批量新增模版.xlsx';
import modifyTemplate from '@assets/template/功能点-批量修改模版.xlsx';
import CardTitle from '@components/CardTitle';
import { debug } from 'util';
import RoleChoice from '@components/RoleChoice/index';

const SHEET_TYPE =
  'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
// const apiPrefix = process.env.NODE_ENV === 'development' ? '/mock' : '';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = null;

const getColumns = t => [
  {
    title: t('被限制人'),
    dataIndex: 'userName'
  },
  {
    title: t('限制次数'),
    dataIndex: 'frequencyNum'
  }
];

let initialValue = [
  {
    lang: 'zh',
    name: '',
    placeholder: '中文'
  }
];

let isDeletedLanguage = false,
  deleteIndex;

class ManageFeature extends Component {
  state = {
    editingFeature: null,
    editingFeatureParent: {
      name: ''
    },
    name: '',
    url: '',
    isMenu: '',
    modalVisible: false,
    roleModalVisible: false,
    confirmLoading: false,
    selectedLimits: [],
    languageSelectValue: [],
    langNameList: [
      {
        lang: 'zh',
        name: '',
        placeholder: '中文'
      }
    ],
    availableRiskLevel: ['C1', 'C2', 'C3', 'C4'],
    //角色选择
    selectedRoleRows: [],
    tableData: [
      {
        key: '1',
        name: '查看',
        LV1: 'C1',
        LV2: 'C1',
        LV3: 'C1',
        LV4: 'C4'
      },
      {
        key: '2',
        name: '创建（需审核）',
        LV1: 'C2',
        LV2: 'C2',
        LV3: 'C2',
        LV4: 'C4'
      },
      {
        key: '3',
        name: '创建（直接生效）/审核',
        LV1: 'C3',
        LV2: 'C3',
        LV3: 'C3',
        LV4: 'C4'
      },
      {
        key: '4',
        name: '敏感操作（ 直接资金操作/准入相关/批量操作/导出等 ）',
        LV1: 'C4',
        LV2: 'C4',
        LV3: 'C4',
        LV4: 'C4'
      }
    ],
    tableColumns: [
      {
        title: '权限涉及数据安全级别/权限操作',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'C1',
        dataIndex: 'LV1',
        key: 'LV1'
      },
      {
        title: 'C2',
        dataIndex: 'LV2',
        key: 'LV2'
      },
      {
        title: 'C3',
        dataIndex: 'LV3',
        key: 'LV3'
      },
      {
        title: 'C4',
        dataIndex: 'LV4',
        key: 'LV4'
      }
    ]
  };

  componentDidMount() {
    const { appId } = this.props;
    if (appId) {
      this.fetchFeatures(appId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.appId && this.props.appId !== nextProps.appId) {
      this.setState({
        editingFeature: null
      });
      this.handleFormReset();
      this.fetchFeatures(nextProps.appId);
    }

    // if (this.props.featureList !== nextProps.featureList) {
    //   if (this.state.editingFeature) {
    //     const item = findTreeNodeById(
    //       nextProps.featureList,
    //       this.state.editingFeature.id
    //     );
    //     if (!item) {
    //       this.setState({
    //         editingFeature: null
    //       });
    //       this.handleFormReset();
    //     }
    //   }
    // }
  }

  handleAdd = (item, { fakeId }) => {
    //增加节点
    const nodeData = {
      id: fakeId,
      name: '新增节点',
      isMenu: '0',
      path: item ? item.path.concat(fakeId) : [fakeId],
      isFake: true,
      parent: item,
      pid: item ? item.id : '0',
      langNameList: [
        {
          lang: 'zh',
          name: '新增节点',
          placeholder: '中文'
        }
      ],
      riskLevel: '',
      availableRiskLevel: [...this.state.availableRiskLevel]
    };

    if (item) {
      const { children, path } = item;

      let childrenData = [];

      if (children) {
        childrenData = [nodeData, ...children];
      } else {
        childrenData.push(nodeData);
      }

      this.props.addFakeFeature({
        ...item,
        children: childrenData
      });
    } else {
      this.props.addFakeFeature(nodeData);
    }

    this.handleEdit(nodeData);
  };

  handleEdit = feature => {
    if (!feature) {
      this.handleFormReset();
      this.setState({
        editingFeature: null,
        editingFeatureParent: {
          name: ''
        }
      });

      return;
    }

    const {
      name,
      url,
      isMenu,
      remark,
      parent,
      pid,
      isFake,
      id,
      langNameList,
      riskLevel,
      availableRiskLevel,
      icon,
      sortVal
    } = feature;
    const { form } = this.props;
    let initialValue = [];

    langNameList.map(item => {
      let language = languageList.find(language => language.lang === item.lang);
      let placeholder = language ? language.name : '中文';
      initialValue.push({
        lang: item.lang,
        name: item.name,
        placeholder: placeholder
      });
    });

    if (!initialValue.find(item => item.lang === 'zh')) {
      initialValue.unshift({
        lang: 'zh',
        name: name,
        placeholder: '中文'
      });
    }

    PubSub.publish('languageChange', initialValue);

    form.setFieldsValue({
      url,
      isMenu: `${isMenu}`,
      remark,
      pid: `${pid}`,
      riskLevel,
      icon,
      sortVal
    });

    let langList = [];
    langNameList.map(item => {
      if (item.lang !== 'zh') {
        langList.push(item.lang);
      }
    });
    this.setState(
      {
        editingFeature: feature,
        editingFeatureParent: parent,
        languageSelectValue: langList,
        langNameList,
        availableRiskLevel: [...availableRiskLevel]
      },
      () => {
        if (!isFake) {
          this.props.getLimitsData({
            featureId: id,
            appId: this.props.appId
          });
          this.props.fetchRolelabelListALL(this.props.appId);
        }
      }
    );
  };

  handleFormReset = () => {
    this.props.form.resetFields();
    this.emptyLanguageList();
  };

  handleSearchFieldChange = (event, fieldName) => {
    this.setState({
      [fieldName]: ~['selectedApp', 'isMenu'].indexOf(fieldName)
        ? event
        : event.target.value
    });
  };

  fetchFeatures = presetAppId => {
    const { name, url, isMenu } = this.state;

    this.props.fetchFeatures({
      appId: presetAppId ? presetAppId : this.props.appId,
      name,
      url,
      isMenu
    });
  };

  handleDel = item => {
    const { delFeature, appId } = this.props;
    const { editingFeature } = this.state;

    delFeature({
      ...item,
      appId
    });

    if (editingFeature && item.id === editingFeature.id) {
      this.setState({
        editingFlag: null,
        editingFlagParent: {
          name: ''
        }
      });
      this.handleFormReset();
    }
  };

  handleUpdateFeature = () => {
    const { form, updateFeature, appId } = this.props;
    const { editingFeature, languageSelectValue } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const {
        isMenu,
        remark,
        url,
        pid,
        languageItem_0,
        riskLevel,
        icon,
        sortVal
      } = fieldsValue;
      let langNameList = [];

      languageSelectValue.map((language, i) => {
        langNameList.push({
          lang: language,
          name: fieldsValue['languageItem_' + (i + 1)]
        });
      });
      updateFeature({
        ...editingFeature,
        name: languageItem_0,
        isMenu,
        remark,
        url,
        pid,
        appId,
        langNameList,
        riskLevel,
        icon,
        sortVal: sortVal ? String(sortVal) : 0
      }).then(res => {
        const { t } = this.props;
        if (res.success) {
          message.success(t('修改成功'), () => {
            this.fetchFeatures();
          });
        } else {
          message.error(t(res.result));
        }
      });
    });
  };

  handleExport = () => {
    let query = [`appId=${this.props.appId}`];

    'name,url,isMenu'.split(',').forEach(item => {
      if (this.state[item] !== '') {
        query.push(`${item}=${this.state[item]}`);
      }
    });

    window.open(`${apiHost}/feature/down/file?${query.join('&')}`);
  };

  alterModal = isVisible => {
    this.setState({
      modalVisible: isVisible
    });
  };

  alterRoleModal = group => {
    this.props
      .fetchBindRolesList({
        appId: this.props.appId,
        featureId: group.id
      })
      .then(() => {
        this.setState({
          roleModalVisible: true
        });
      });
  };
  handleCancel = visible => {
    this.setState({
      roleModalVisible: visible
    });
  };

  submitRole = selected => {
    const params = {
      appId: selected.appId,
      featureId: selected.featureId,
      roleIds: selected.selectedRows.map(item => item.value)
    };
    this.setState({
      confirmLoading: true
    });

    this.props.insertMutirole(params).then(() => {
      message.success('绑定成功');
      this.setState({
        roleModalVisible: false,
        confirmLoading: false
      });
    });
  };

  handleDeleteLimits = () => {
    const { selectedLimits, editingFeature } = this.state;
    const { appId, deleteLimits, t } = this.props;

    deleteLimits({
      appId,
      featureId: editingFeature.id,
      ids: selectedLimits
    }).then(() => {
      message.info(t('删除成功'));
      this.onSelectLimitChange([]);
    });
  };

  onSelectLimitChange = selectedLimits => {
    this.setState({ selectedLimits });
  };

  handleEditBindingLimit = () => {
    this.alterModal(true);
  };

  handleAddLimit = values => {
    const { frequencyNum, userName } = values;
    const { appId, addLimit, t } = this.props;
    const { editingFeature } = this.state;

    addLimit({
      frequencyNum,
      userName,
      appId,
      featureId: editingFeature.id
    }).then(() => {
      message.info(t('添加成功'));

      if (this.form) {
        this.form.resetFields();
      }
    });
  };

  changeLanguageHandle = langList => {
    //多语言设置框change事件
    const { form } = this.props;
    let langNameList = this.state.langNameList;
    let chineseName = langNameList.find(item => item.lang === 'zh');
    let list = [
      {
        lang: 'zh',
        name: chineseName ? chineseName.name : this.state.editingFeature.name,
        placeholder: '中文'
      }
    ];
    let step = 0;

    langList.map((lang, i) => {
      if (isDeletedLanguage && deleteIndex === i) {
        step++;
      }
      const temp = langNameList.find(item => item.lang == lang);
      const placeholder = languageList.find(item => item.lang == lang).name;
      list.push({
        lang: lang,
        name: temp
          ? temp.name
          : form.getFieldValue('languageItem_' + (i + 1 + step)) || '',
        placeholder: placeholder
      });
    });

    this.setState({
      languageSelectValue: langList
    });
    isDeletedLanguage = false;
    PubSub.publish('languageChange', list);
  };

  /*
   * select删除语言事件先于change事件，用来记录被删的index
   */
  onDeselect = value => {
    deleteIndex = this.state.languageSelectValue.findIndex(
      item => item === value
    );
    isDeletedLanguage = true;
  };

  emptyLanguageList = () => {
    //清空语言输入框
    this.setState({
      languageSelectValue: []
    });
    PubSub.publish('languageChange', [
      {
        lang: 'zh',
        name: '',
        placeholder: '中文'
      }
    ]);
  };

  handleChange = selectedRows => {
    this.setState({
      selectedRoleRows: selectedRows
    });
  };

  nodeFilter = (node, matched) => {
    const { name, commonName, url } = node;
    let titleString = '';
    if (name) {
      titleString += name;
    }

    if (commonName) {
      titleString += commonName;
    }

    if (url) {
      titleString += url;
    }

    return titleString.indexOf(matched) < 0;
  };

  render() {
    const {
      editingFeature,
      editingFeatureParent,
      name,
      url,
      isMenu,
      modalVisible,
      selectedLimits,
      roleModalVisible,
      availableRiskLevel
    } = this.state;
    const {
      appId,
      featureList,
      addFakeFeature,
      form,
      parents,
      t,
      limitsData,
      loadingFeatureList
    } = this.props;
    let featureLimits;

    if (editingFeature) {
      featureLimits = _.find(limitsData, { id: editingFeature.id });
    }

    const { getFieldDecorator } = form;
    const successCb = this.fetchFeatures;

    const rowSelection = {
      selectedRowKeys: selectedLimits,
      onChange: this.onSelectLimitChange
    };

    const propsForAddUpload = {
      name: 'file',
      accept: SHEET_TYPE,
      action: apiHost + '/feature/file/insert',
      headers: {},
      withCredentials: true,
      data: {
        appId
      },
      onChange(info) {
        const {
          file: { status, response }
        } = info;

        if (status === 'done') {
          if (response.code >= 200 && response.code <= 300) {
            message.success(t('批量新增成功！'));
            successCb();
          } else {
            message.error(response.msg);
          }
        } else if (status === 'error') {
          // 服务端返回 error 显示需要在 info.event 寻找
          message.error(t('批量新增失败！'));
        }
      }
    };

    const propsForUpdateUpload = {
      name: 'file',
      accept: SHEET_TYPE,
      action: apiHost + '/feature/file/update',
      headers: {},
      withCredentials: true,
      data: {
        appId
      },
      onChange(info) {
        const {
          file: { status, response }
        } = info;

        if (status === 'done') {
          if (response.code >= 200 && response.code <= 300) {
            message.success(t('批量修改成功！'));
            successCb();
          } else {
            message.error(response.msg);
          }
        } else if (status === 'error') {
          // 服务端返回 error 显示需要在 info.event 寻找
          message.error(t('批量修改失败！'));
        }
      }
    };

    const reducer = list => {
      return list.reduce((acc, item) => {
        if (editingFeature && editingFeature.id === item.id) {
          return acc;
        }

        let i = {};
        i.label = item.name;
        i.value = `${item.id}`;
        i.key = item.key;

        if (item.children) {
          i.children = reducer(item.children);
        }

        return acc.concat(i);
      }, []);
    };

    const parentsData = [
      {
        label: t('顶级节点'),
        value: '0',
        key: 0
      }
    ].concat(reducer(featureList));

    return (
      <div className="ManageFeature">
        <Card
          title={
            <CardTitle
              title={t('功能管理')}
              sub={
                <span>
                  <span>{t('(如果首次输入，建议使用批量导入功能) ')}</span>
                  <span className="upm-card-title--hint">
                    {t('注：优先录入父级菜单，再根据模板录入子菜单')}
                  </span>
                </span>
              }></CardTitle>
          }
          bordered={false}>
          <Row gutter={24} className="search-fields">
            <Col span={8}>
              <FormItem label={t('目标系统：')}>
                <AvailableApps style={{ width: '100%' }} />
              </FormItem>
            </Col>
            {/*<Col span={8}>*/}
            {/*<FormItem label={t('名称：')}>*/}
            {/*<Input*/}
            {/*value={name}*/}
            {/*onChange={(e) => this.handleSearchFieldChange(e, 'name')}*/}
            {/*/>*/}
            {/*</FormItem>*/}
            {/*</Col>*/}
            {/*<Col span={8}>*/}
            {/*<FormItem label={t('URL：')}>*/}
            {/*<Input*/}
            {/*placeholder="URL"*/}
            {/*value={url}*/}
            {/*onChange={(e) => this.handleSearchFieldChange(e, 'url')}*/}
            {/*/>*/}
            {/*</FormItem>*/}
            {/*</Col>*/}
            <Col span={8}>
              <FormItem label={t('是否菜单：')}>
                <Select
                  value={isMenu}
                  onChange={e => this.handleSearchFieldChange(e, 'isMenu')}
                  className="menu-select">
                  <Option value="">{t('全部')}</Option>
                  <Option value="1">{t('是')}</Option>
                  <Option value="0">{t('否')}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <Button
                  type="primary"
                  className="btn first-btn"
                  onClick={e => this.fetchFeatures()}>
                  {t('查询')}
                </Button>
                <Button
                  type="primary"
                  className="btn"
                  onClick={this.handleExport}>
                  {t('导出')}
                </Button>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem>
                <a href={uploadTemplate}>{t('新增模板下载')}</a>

                <Upload {...propsForAddUpload} className="add-uploader">
                  <Button disabled={!appId} type="primary" className="btn ">
                    {t('批量新增')}
                  </Button>
                </Upload>

                <a href={modifyTemplate}>{t('修改模板下载')}</a>

                <Upload {...propsForUpdateUpload} className="add-uploader">
                  <Button type="primary" className="btn" disabled={!appId}>
                    {t('批量修改')}
                  </Button>
                </Upload>
              </FormItem>
            </Col>
          </Row>
        </Card>

        <Card
          title={
            <CardTitle
              title={t('功能列表')}
              sub={t(
                '(请严格按照业务系统目录进行录入，以免造成鉴权失败)'
              )}></CardTitle>
          }
          bordered={false}
          className="feature-list">
          <Row gutter={24} className="">
            <Col span={12}>
              <Spin spinning={loadingFeatureList}>
                <EditableTree
                  data={featureList}
                  requestAdd={this.handleAdd}
                  requestDel={this.handleDel}
                  requestSelect={this.handleEdit}
                  changeLanguage={this.changeLanguageHandle}
                  languageSelectValue={this.state.languageSelectValue}
                  needLanguageSelection={true}
                  onDeselect={this.onDeselect}
                  nodeFilter={this.nodeFilter}
                  searchPlaceholder={t('请输入功能名称或者URL进行搜索')}
                  isNeedSearch
                />
              </Spin>
            </Col>
            {featureList.length > 0 ? (
              <Col span={12}>
                <h4>{t('详情编辑')}</h4>

                <Button
                  type="primary"
                  onClick={this.handleEditBindingLimit}
                  disabled={!editingFeature || editingFeature.isFake}>
                  {t('频次限制')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    this.alterRoleModal(editingFeature);
                  }}
                  disabled={!editingFeature || editingFeature.isFake}
                  style={{ marginLeft: '30px' }}>
                  {t('绑定角色')}
                </Button>

                <Form className="edit-form">
                  <LanguageInputList
                    formItemLayout={formItemLayout}
                    form={form}
                    disabled={!editingFeature}
                    value={this.state.langNameList}
                  />

                  <FormItem {...formItemLayout} label={t('对应URL')}>
                    {getFieldDecorator('url', {
                      rules: [{ required: true, message: t('请输入URL') }]
                    })(
                      <Input
                        placeholder={t('请填写功能对应的URL')}
                        disabled={!editingFeature}
                      />
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label={t('备注')}>
                    {getFieldDecorator('remark', {
                      rules: [{ required: true, message: t('请输入备注') }]
                    })(
                      <Input
                        placeholder={t('方便描述或记忆该功能的应用场景')}
                        disabled={!editingFeature}
                      />
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label={t('是否菜单')}>
                    {getFieldDecorator('isMenu', {
                      rules: [{ required: true, message: t('请选择') }]
                    })(
                      <Select
                        placeholder={t(
                          '标注该功能是业务系统的菜单还是具体功能点，例如“否”代表具体功能点'
                        )}
                        disabled={!editingFeature}>
                        <Option value="1">{t('是')}</Option>
                        <Option value="0">{t('否')}</Option>
                      </Select>
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label={t('父节点')}>
                    {/*<Input disabled value={editingFeatureParent ? editingFeatureParent.name : ''} />*/}
                    {getFieldDecorator('pid', {
                      rules: [{ required: true, message: t('请选择') }]
                    })(
                      <TreeSelect
                        placeholder={t(
                          '描述该功能是否具有上级节点，默认为顶级节点'
                        )}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={parentsData}
                        treeDefaultExpandAll={false}
                        disabled={!editingFeature}
                      />
                    )}
                  </FormItem>

                  <FormItem
                    // {...formItemLayout}
                    label={
                      <span>
                        {t('选择敏感级别：')}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                        {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                        {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                        {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {t('查看【数据分级标准】与【权限定级参考矩阵】请')}
                        {/* <Tooltip title="aaaaaaaaaaaaaaaaaaaaaa">
                          <Button type="link" style={{ margin: '0', padding: '0' }}>点击这里</Button>
                        </Tooltip> */}
                        <Popover
                          placement="topRight"
                          trigger="click"
                          content={
                            <div>
                              {/* {t('低敏感权限（C1）：公开数据只那些公司已通过正规渠道正式对外发布的数据，')}
                            <br />
                            {t('不会对公司（包括：乘客、司机、合作伙伴、员工等）的财产、形象、名誉、')}
                            <br />
                            {t('人身安全以及合法利益造成影响的数据。')}
                            <br />
                            {t('初级敏感权限（C2）：内部数据指那些不适合对外公开，但是对公司内部人员访问')}
                            <br />
                            {t('基本无限制的数据。该等级数据一旦被泄露或者公开，不会对数据主体造成直接')}
                            <br />
                            {t('损害，但是作为数据管理者，有责任对这些信息进行保护。')}
                            <br />
                            {t('敏感权限（C3）：秘密数据指那些公司专有或公司保密的，公司员工通过其与公司')}
                            <br />
                            {t('的雇佣关系或者因为其与公司的雇佣关系而知悉的任何有形或无形的且适合于部分人')}
                            <br />
                            {t('可见的数据，丢失或不当使用此类数据将显著影响部门开展业务和提供服务。')}
                            <br />
                            {t('该等级数据一旦被泄露或者公开，会对数据主体造成直接或者间接损害。')}
                            <br />
                            {t('高敏感权限（C4）：机密数据指具有最高安全属性要求，适合于极少数人可见的数据。如果该')}
                            <br />
                            {t('数据出现外泄可能导致公司法律或商业上造成重大影响或损失，则该数据就是机密数据。')}
                            <br /> */}
                              {t('【权限定级参考矩阵】')}
                              <br />
                              <Table
                                pagination={false}
                                width={620}
                                dataSource={this.state.tableData}
                                columns={this.state.tableColumns}></Table>
                              {t(
                                '一级(C1)查看级，一般信息(不涉及个人隐私和公司机密)的查看权限；'
                              )}
                              <br />
                              {t(
                                '二级(C2)创建级，不即时生效的信息录入权限,待审核的活动创建权限；'
                              )}
                              <br />
                              {t(
                                '三级(C3)审核级，可以确认某活动生效或通过的权限；'
                              )}
                              <br />
                              {t(
                                '四级(C4)敏感级，涉及公司机密，个人隐私信息、音视频等信息的查看或修改,'
                              )}
                              <br />
                              {t(
                                '直接资金操作,批量操作,黑白名单,封解禁,冻结解冻等操作的权限。'
                              )}
                              <br />
                              {t(
                                '1.凡是操作涉及数据为C4级，任何操作权限均定义为四级（敏感级）权限 '
                              )}
                              <br />
                              {t(
                                '2.凡是涉及敏感操作的，不论操作的数据级别，均定义为四级（敏感级）权限'
                              )}
                              <br />
                              {t('【数据分级标准】')}
                              <br />
                              {t(
                                '低敏感权限（C1）：公开数据只那些公司已通过正规渠道正式对外发布的数据，'
                              )}
                              <br />
                              {t(
                                '不会对公司（包括：乘客、司机、合作伙伴、员工等）的财产、形象、名誉、'
                              )}
                              <br />
                              {t('人身安全以及合法利益造成影响的数据。')}
                              <br />
                              {t(
                                '初级敏感权限（C2）：内部数据指那些不适合对外公开，但是对公司内部人'
                              )}
                              <br />
                              {t(
                                '员访问基本无限制的数据。该等级数据一旦被泄露或者公开，不会对数据主体'
                              )}
                              <br />
                              {t(
                                '造成直接损害，但是作为数据管理者，有责任对这些信息进行保护。'
                              )}
                              <br />
                              {t(
                                '敏感权限（C3）：秘密数据指那些公司专有或公司保密的，公司员工通过其与公司'
                              )}
                              <br />
                              {t(
                                '的雇佣关系或者因为其与公司的雇佣关系而知悉的任何有形或无形的且适合于部'
                              )}
                              <br />
                              {t(
                                '分人可见的数据，丢失或不当使用此类数据将显著影响部门开展业务和提供服务。'
                              )}
                              <br />
                              {t(
                                '该等级数据一旦被泄露或者公开，会对数据主体造成直接或者间接损害。'
                              )}
                              <br />
                              {t(
                                '高敏感权限（C4）：机密数据指具有最高安全属性要求，适合于极少数人可见的数据。'
                              )}
                              <br />
                              {t(
                                '如果该数据出现外泄可能导致公司法律或商业上造成重大影响或损失，则该数据就是机密数据。'
                              )}
                              <br />
                            </div>
                          }>
                          <Button
                            type="link"
                            style={{ margin: '0', padding: '0' }}>
                            点击这里
                          </Button>
                        </Popover>
                      </span>
                    }
                    colon={false}
                    // labelCol={{ span: 24 }}
                  >
                    {getFieldDecorator('riskLevel', {
                      rules: [{ required: true, message: t('请输入敏感级别') }]
                    })(
                      <Select
                        // value={riskLevel}
                        // onChange={(e) => this.handleSearchFieldChange(e, 'isMenu')}
                        className="menu-select"
                        disabled={!editingFeature}>
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

                  <FormItem {...formItemLayout} label={t('菜单样式')}>
                    {getFieldDecorator('icon', {})(
                      <Input
                        placeholder={t('菜单图标')}
                        disabled={!editingFeature}
                      />
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label={t('排序位置')}>
                    {getFieldDecorator('sortVal', {
                      rules: [
                        {
                          validator: (rule, value, callback) => {
                            const { form, t } = this.props;
                            const v = form.getFieldValue('sortVal');
                            if (v === '' || v === undefined) {
                              callback();
                              return;
                            }
                            if (isNaN(v) || v > 999999) {
                              callback(t('请输入不超过6位的数字'));
                            } else {
                              callback();
                            }
                          }
                        }
                      ],
                      initialValue: 0
                    })(
                      // <Input placeholder = {
                      //   t('排序位置')
                      // } disabled={!editingFeature}
                      // />
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder={t('排序位置')}
                        disabled={!editingFeature}
                        min={0}
                        max={999999}
                      />
                    )}
                  </FormItem>

                  <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                    <Button
                      type="primary"
                      onClick={this.handleUpdateFeature}
                      disabled={!editingFeature}>
                      {t('保存')}
                    </Button>

                    <Button
                      type="primary"
                      className="reset-btn"
                      onClick={this.handleFormReset}
                      disabled={!editingFeature}>
                      {t('清空')}
                    </Button>
                  </FormItem>
                </Form>
              </Col>
            ) : (
              <span />
            )}
          </Row>
        </Card>

        <Modal
          title={t('频次限制')}
          visible={modalVisible}
          onCancel={() => this.alterModal(false)}
          footer={false}>
          {modalVisible && (
            <LimitForm
              t={t}
              onSubmit={this.handleAddLimit}
              setForm={_form => (this.form = _form)}
            />
          )}

          <Divider />

          <Button
            type="primary"
            onClick={this.handleDeleteLimits}
            disabled={!selectedLimits.length}
            className="delete-limit-btn">
            {t('删除选中限制')}
          </Button>

          <Table
            rowSelection={rowSelection}
            columns={getColumns(t)}
            dataSource={featureLimits ? featureLimits.data : []}
            rowKey="id"
          />
        </Modal>
        {roleModalVisible && (
          <RoleChoice
            t={t}
            title={t('角色选择')}
            modalVisible={roleModalVisible}
            confirmLoading={this.state.confirmLoading}
            onCancel={() => this.handleCancel(false)}
            submit={params => this.submitRole(params)}
            handleChange={selectedRows => this.handleChange(selectedRows)}
            featureId={editingFeature && editingFeature.id}
            type="roleList"></RoleChoice>
        )}
      </div>
    );
  }
}

export default connect(
  ({ feature, global, defaultauth }) => {
    return {
      featureList: feature.list,
      parents: feature.parents,
      appId: global.managingApp,
      limitsData: feature.limits,
      loadingFeatureList: feature.loading.fetch || false
    };
  },
  dispatch => ({
    fetchFeatures(params) {
      dispatch({
        type: 'feature/fetch',
        payload: params
      });
    },
    addFakeFeature(flag) {
      dispatch({
        type: 'feature/addFakeFeature',
        payload: flag
      });
    },
    updateFeature(params) {
      return dispatch({
        type: 'feature/updateFeature',
        payload: params
      });
    },
    delFeature(params) {
      dispatch({
        type: 'feature/delFeature',
        payload: params
      });
    },
    getLimitsData(params) {
      dispatch({
        type: 'feature/getBindingLimits',
        payload: params
      });
    },
    addLimit(params) {
      return dispatch({
        type: 'feature/addLimit',
        payload: params
      });
    },
    deleteLimits(params) {
      return dispatch({
        type: 'feature/deleteLimits',
        payload: params
      });
    },
    fetchRolelabelListALL(appId) {
      dispatch({
        type: 'role/fetchRolelabelListALL',
        payload: {
          appId
        }
      });
    },
    fetchRoleList(params) {
      return dispatch({
        type: 'feature/fetchRoleList',
        payload: params
      });
    },
    insertMutirole(params) {
      return dispatch({
        type: 'feature/insertMutirole',
        payload: params
      });
    },
    fetchBindRolesList(params) {
      return dispatch({
        type: 'feature/fetchBindRolesList',
        payload: params
      });
    }
  })
)(Form.create()(ManageFeature));
