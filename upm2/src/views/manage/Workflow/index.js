import React, { Component } from 'react';
import { Button, Form, Input, Table, Row, Col, Select, Modal, Card, Popover } from 'antd';
import connect from '@utils/translateConnect';
import CardTitle from '@components/CardTitle';
import AvailableApps from '../../../components/AvailableApps';
import _ from 'lodash';
// import { bpmAdmin } from '@config/apiConfig';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

const STEP_ID_PREFIX = 'step-';

class Workflow extends Component {
  state = {
    current: 1,
    name: '',
    type: '',
    status: '',
    modalVisible: false,
    upmModalVisible: false,
    editingFlowId: '',
    actionType: '',
    selectedType: '',
    dataSourceForSteps: []
  };

  componentDidMount() {
    if (this.props.appId) {
      this.handleFetch(1, this.props.appId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.appId !== nextProps.appId) {
      this.handleFetch(1, nextProps.appId);
    }

    if (this.props.data.modalStatus === 'loading' && nextProps.data.modalStatus === 'ok') {
      // 验证没有错误后关闭
      this.state.modalVisible && this.closeModal();
      this.state.upmModalVisible && this.closeUPMModal();
    }
  }

  handlePageChange = (page) => {
    this.handleFetch(page);
    this.setState({
      current: page
    })
  };

  handleFetch = (page, appId) => {
    const {
      name,
      type,
      status
    } = this.state;

    this.props.fetchData({
      appId: appId ? appId : this.props.appId,
      name,
      type,
      status,
      page
    });
  };

  handleSearchFieldChange = (event, fieldName) => {
    this.setState({
      [fieldName]: fieldName !== 'name' ? event : event.target.value
    });
  };

  updateStatus = (flow) => {
    const {
      status,
      id
    } = flow;
    const { appId } = this.props;

    this.props.requestUpdate({
      appId,
      id,
      status: status === 0 ? 1 : 0
    });
  };

  handleDelete = (flow) => {
    this.props.delFlow(flow);
  };

  confirmDelete = (flow) => {
    const { t } = this.props;
    confirm({
      title: t('确定删除此记录'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => this.handleDelete(flow)
    });
  };

  confirmToggleStatus = (btnText, flow) => {
    const { t } = this.props;
    confirm({
      title: t('确定{{btnText}}?', {btnText}),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => this.updateStatus(flow)
    });
  };

  getColumns = () => {
    const {
      workflowEnums,
      t
    } = this.props;
    const {
      stepType,
      infoType,
      infoStatus
    } = workflowEnums;

    const columns = [{
      title: t('审批编号'),
      dataIndex: 'id',
      key: 'id',
      width: 80
    }, {
      title: t('审批流名称'),
      dataIndex: 'name',
      key: 'name',
    }, {
      title: t('审批流类型'),
      dataIndex: 'type',
      key: 'type',
      render: (text) => t(infoType[text]) || t('未知类型')
    }, {
      title: t('关联属性'),
      dataIndex: 'refIds',
      key: 'refIds',
      width: 200,
      render: (info) => {
        if (info && info instanceof Array) {
          return info.join(',')
        } else return null;
      }
    }, {
      title: t('使用状态'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => t(infoStatus[status]) || t('未知状态')
    },
    // {
    //   title: t('审批流详情'),
    //   dataIndex: 'stepInfo',
    //   key: 'stepInfo',
    //   width: 600,
    //   render: (info) => {
    //     return <span style={{wordBreak: 'break-all'}}>{info.map(cur => {
    //       const curValue = cur.typeValue && `(${cur.typeValue})`;
    //       return `${t(stepType[cur.type])}${curValue}`;
    //     }).join(" -> ")}</span>;
    //   }
    // }
    ];

    return columns.concat({
      title: t('操作'),
      key: 'action',
      render: (text, record) => {
        const {
          status
        } = record;
        const btnText = status === 0 ? t('启用') : t('停用');

        let content
        if (record.recordType == 'bpm') {
          content = (
            <span>
              <Button
                size="small"
                className="btn delete-btn"
                onClick={() => this.confirmToggleStatus(btnText, record)}
              >
                {btnText}
              </Button>

              <Button
                size="small"
                className="btn edit-btn"
                onClick={() => this.handleConfig(record)}
              >
                {t('编辑')}
              </Button>

              <Button
                size="small"
                className="btn edit-btn"
                onClick={() => this.handleEdit(record, 'edit')}
              >
                {t('配置')}
              </Button>

              <Button
                size="small"
                className="btn edit-btn"
                onClick={() => this.handleUnbind(record)}
              >
                {t('解绑')}
              </Button>
            </span>
          );
        } else {
          content = (
            <span>
              <Button
                type="danger"
                size="small"
                className="btn delete-btn"
                onClick={() => this.confirmDelete(record)}
              >
                {t('删除')}
              </Button>

              <Button
                size="small"
                className="btn stop-btn"
                onClick={() => this.confirmToggleStatus(btnText, record)}
              >
                {btnText}
              </Button>

              <Button
                size="small"
                className="btn edit-btn"
                onClick={() => this.handleEdit(record, 'edit')}
              >
                {t('编辑')}
              </Button>

              <Button
                size="small"
                className="btn copy-btn"
                onClick={() => this.handleEdit(record, 'copy')}
              >
                {t('复制')}
              </Button>
            </span>
          );
        }

        return (
          <Popover
            overlayStyle={{zIndex: 999}}
            content={content}
            placement="topRight"
            trigger="click">
            <Button size="small">
              {t('操作')}
            </Button>
          </Popover>
        );
      },
    });
  };

  openModal = (id='', actionType='', currFlow) => {
    this.setState({
      modalVisible: true,
      editingFlowId: id,
      actionType,
      currFlow
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
      editingFlowId: '',
      actionType: '',
      selectedType: '',
      dataSourceForSteps: []
    }, () => {
      this.props.form.resetFields();
    });
  };

  openUPMModal = (id='', actionType='', currFlow) => {
    this.setState({
      upmModalVisible: true,
      editingFlowId: id,
      actionType,
      currFlow
    });
  };

  closeUPMModal = () => {
    this.setState({
      upmModalVisible: false,
      editingFlowId: '',
      actionType: '',
      selectedType: '',
      dataSourceForSteps: []
    }, () => {
      this.props.form.resetFields();
    });
  };

  handleModalOk = () => {
    const { editingFlowId, actionType, dataSourceForSteps, currFlow, current } = this.state;
    const { form, appId, requestUpdate, requestConfig, requestNew, data } = this.props;

    const filterFakeId = (list) => {
      return list.map((step) => {
        const { type, id, typeValue } = step;
        const stepObj = {
          type,
          typeValue,
        };

        if (!_.startsWith(id, STEP_ID_PREFIX)) {
          stepObj.id = id;
        }

        return stepObj;
      });
    };

    form.validateFields(['name', 'type', 'refIds'], (err, fieldsValue) => {
      if (err) {
        return;
      }

      const { ...others } = fieldsValue;

      if (editingFlowId === '') {
        // 新建flow
        requestNew({
          ...others,
          stepInfo: filterFakeId(dataSourceForSteps),
          appId
        });
      } else {
        if (actionType === 'edit') {
          // 编辑flow
          // requestUpdate({
          //   appId,
          //   id: editingFlowId,
          //   ...others,
          //   stepInfo: filterFakeId(dataSourceForSteps),
          // });
          requestConfig({
            bpmKey: currFlow.bpmKey,
            appId,
            id: editingFlowId,
            ...others,
            type: parseInt(others.type),
          }).then(() => {
            this.handleFetch(current)
          });
        } else if (actionType === 'copy') {
          // 复制flow
          requestNew({
            ...others,
            stepInfo: filterFakeId(dataSourceForSteps),
            appId
          });
        }
      }
    });
  };

  handleUPMModalOk = () => {
    const { editingFlowId, actionType, dataSourceForSteps, current } = this.state;
    const { form, appId, requestUpdate, requestNew, data } = this.props;

    const filterFakeId = (list) => {
      return list.map((step) => {
        const { type, id, typeValue } = step;
        const stepObj = {
          type,
          typeValue,
        };

        if (!_.startsWith(id, STEP_ID_PREFIX)) {
          stepObj.id = id;
        }

        return stepObj;
      });
    };

    form.validateFields(['name', 'type', 'refIds', 'stepInfo'], (err, fieldsValue) => {
      if (err) {
        return;
      }

      const { refIds, ...others } = fieldsValue;

      if (editingFlowId === '') {
        // 新建flow
        requestNew({
          refIds: _.isArray(refIds) ? refIds : [refIds],
          ...others,
          stepInfo: filterFakeId(dataSourceForSteps),
          appId
        });
      } else {
        if (actionType === 'edit') {
          // 编辑flow
          requestUpdate({
            appId,
            id: editingFlowId,
            refIds: _.isArray(refIds) ? refIds : [refIds],
            ...others,
            stepInfo: filterFakeId(dataSourceForSteps),
          }).then(() => {
            this.handleFetch(current)
          });
        } else if (actionType === 'copy') {
          // 复制flow
          requestNew({
            refIds: _.isArray(refIds) ? refIds : [refIds],
            ...others,
            stepInfo: filterFakeId(dataSourceForSteps),
            appId
          });
        }
      }
    });
  };

  // 编辑
  handleConfig = (record) => {
    window.open(`${this.props.bpmAdmin}/activiti/editor/index.html#/editor/${record.bpmModelId}`);
  };

  getRefOptions = () => {
    const { selectedType } = this.state;
    const { appId, data } = this.props;
    const { options } = data;
    if (!options[appId] || !options[appId][selectedType]) {
      return null;
    }

    return options[appId][selectedType].map((option) => (
      <Option key={option.id} value={option.id}>
        {option.id}-{option.nameZh}{option.name && `(${option.name})`}
      </Option>
    ));
  };

  // 解绑
  handleUnbind = (record) => {
    const { id } = record;
    const { unbindFlow, appId } = this.props;
    unbindFlow({
      appId,
      id
    });
  };

  handleTypeChange = (type, reset) => {
    this.setState({
      selectedType: type
    }, () => {
      if (reset !== true) {
        this.props.form.setFieldsValue({
          refId: []
        });
      }

      this.props.fetchOptions({
        appId: this.props.appId,
        type: `${type}`
      });
    });
  };

  handleCreate = () => {
    const { appId, availableApps, bpmAdmin } = this.props
    const app = _.find(availableApps, ['id', appId])

    if (app) {
      if (app.isOld) {
        // UPM
        this.openUPMModal()
      } else {
        // BPM
        window.open(`${bpmAdmin}/business/flow`)
      }
    }
  }

  handleEdit = (flow, actionType) => {
    // actionType 区分 copy 还是 edit
    const {
      id,
      name,
      type,
      refIds,
      // status,
      stepInfo,
    } = flow;

    this.handleTypeChange(type);
    this.setState({
      dataSourceForSteps: _.cloneDeep(stepInfo)
    });

    this.props.form.setFieldsValue({
      name,
      type: `${type}`,
      refIds,
      stepInfo: _.cloneDeep(stepInfo)
    });

    flow.recordType == 'bpm' ? this.openModal(id, actionType, flow) : this.openUPMModal(id, actionType, flow);
  };

  getRefOptions = () => {
    const { selectedType } = this.state;
    const { appId, data } = this.props;
    const { options } = data;

    if (!options[appId] || !options[appId][selectedType]) {
      return null;
    }

    return options[appId][selectedType].map((option) => (
      <Option key={option.id} value={option.id}>
        {option.id}-{option.nameZh}{option.name && `(${option.name})`}
      </Option>
    ));
  };

  handleTypeChange = (type) => {
    this.setState({
      selectedType: type
    }, () => {
      // this.props.form.setFieldsValue({
      //   refId: ''
      // });

      this.props.fetchOptions({
        appId: this.props.appId,
        type: `${type}`
      });
    });
  };

  getStepTableColumns = () => {
    const {
      workflowEnums,
      t
    } = this.props;
    const {
      stepType
    } = workflowEnums;

    return [
      {
        title: t('配置'),
        key: 'config',
        render: (text, record) => {
          const select = (
            <Select
              onChange={(value) => this.handleStepTypeChange(value, record.id)}
              defaultValue={`${record.type}`}
              getPopupContainer={() => document.getElementById('step-table')}
            >
              {Object.keys(stepType).map((key) => (
                <Option key={key} value={key}>
                  {t(stepType[key])}
                </Option>
              ))}
            </Select>
          );

          let input = null;
          if ([2, '2', 3, '3', 6, '6', 8, '8'].indexOf(record.type) >= 0) {
            input = (
              <Input
                key={`${record.id}-input`}
                className="stepinfo-table-input"
                value={record.typeValue}
                placeholder={t('用户名，多用户用逗号分隔')}
                onChange={(event) => this.handleStepTypeValueChange(event, record.id)}
              />
            );
          } else if (record.type === '7') {
            // TODO 先选部门再选人；还需要支持多选
          }

          return (
            <div className="stepinfo-table-input-wrapper">
              {select}

              {input}
            </div>
          );
        },
      }, {
        title: t('操作'),
        key: 'action',
        render: (text, record, index) => {
          return (
            <div>
              <Button
                type="danger"
                size="small"
                onClick={(event) => this.handleDeleteStep(event, record.id)}
              >
                {t('删除')}
              </Button>

              <Button
                size="small"
                className="btn"
                onClick={(event) => this.handleInsertStep(index)}
              >
                {t('添加节点')}
              </Button>
            </div>
          );
        },
      }
    ];
  };

  handleStepTypeChange = (value, id) => {
    // 在 state 里处理 dataSourceForSteps 的更新
    const {
      dataSourceForSteps,
    } = this.state;

    const item = _.find(dataSourceForSteps, ['id', id]);
    item.type = value;

    this.setState({
      dataSourceForSteps: [...dataSourceForSteps]
    });
  };

  handleStepTypeValueChange = (event, id) => {
    const {
      dataSourceForSteps,
    } = this.state;

    const item = _.find(dataSourceForSteps, ['id', id]);
    item.typeValue = event.target.value;

    this.setState({
      dataSourceForSteps: [...dataSourceForSteps]
    });
  };

  handleDeleteStep = (event, id) => {
    const {
      dataSourceForSteps,
    } = this.state;

    const newData = dataSourceForSteps.filter((item) => item.id !== id);
    this.setState({
      dataSourceForSteps: [...newData]
    }, () => this.setStepInfoForForm([...newData]));
  };

  handleAddStep = () => {
    const {
      dataSourceForSteps,
    } = this.state;

    const fakeItem = {
      id: _.uniqueId(STEP_ID_PREFIX),
      type: '1',
      typeValue: '',
    };

    const newData = [fakeItem, ...dataSourceForSteps];
    this.setStepInfoForState(newData);
  };

  handleInsertStep = (index) => {
    const {
      dataSourceForSteps,
    } = this.state;

    const fakeItem = {
      id: _.uniqueId(STEP_ID_PREFIX),
      type: '1',
      typeValue: '',
    };

    dataSourceForSteps.splice(index+1, 0, fakeItem);
    this.setStepInfoForState([...dataSourceForSteps]);
  };

  setStepInfoForState = (data) => {
    this.setState({
      dataSourceForSteps: data
    }, () => this.setStepInfoForForm(data));
  };

  setStepInfoForForm = (stepInfo) => {
    this.props.form.setFieldsValue({
      stepInfo
    });
  };

  render () {
    const {
      name,
      type,
      status,
      modalVisible,
      upmModalVisible,
      current,
      dataSourceForSteps
    } = this.state;

    const {
      appId,
      data,
      form,
      workflowEnums,
      t,
      bpmAdmin,
      wikihost
    } = this.props;

    if (!workflowEnums) {
      return null;
    }

    const { infoType, infoStatus } = workflowEnums;
    const allOption = <Option value="">{t('全部')}</Option>;
    const typeOptions = _.map(infoType, (typeName, typeValue) => (
      <Option key={typeValue} value={typeValue}>{t(typeName)}</Option>
    ));

    const {
      // current,
      pages,
      size,
      total,
      records
    } = data;

    const { getFieldDecorator } = form;

    return (
      <div className="workflow-page">
        < Card title = { < CardTitle title = {t('审批流管理')} sub={<span className="upm-card-title--hint">{t('(用户申请默认执行：物理上级->子系统管理员的流程。如果无法满足业务需求，可自定义审批流程)')}<a target="_blank" className="upm-card-title--link" href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=190547982">{t('操作手册')}</a></span>}> </CardTitle>}  bordered={false}>
          <Row gutter={24} className="search-fields">
          <Col span={8}>
            <FormItem label={t('目标系统：')}>
              <AvailableApps
                style={{width: '100%'}}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('审批流名称：')}>
              <Input
                placeholder={t('请输入关键字进行模糊搜索')}
                value={name}
                onChange={(e) => this.handleSearchFieldChange(e, 'name')}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('审批流类型：')}>
              <Select
                placeholder={t('请选择')}
                value={type}
                onChange={(e) => this.handleSearchFieldChange(e, 'type')}
                className="menu-select"
              >
                {allOption}

                {typeOptions}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('使用状态：')}>
              <Select
                placeholder={t('请选择')}
                value={status}
                onChange={(e) => this.handleSearchFieldChange(e, 'status')}
                className="menu-select"
              >
                {allOption}

                {_.map(infoStatus, (statusName, status) => (
                  <Option key={status} value={status}>{t(statusName)}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={16}>
            <FormItem label="">
              <Button
                type="primary"
                onClick={() => this.handleFetch()}>
                {t('查询')}
              </Button>
              <Button
                className="btn"
                disabled={appId === ''}
                onClick={this.handleCreate}
                // onClick={() => this.openModal()}
              >
                {t('新增审批流')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        </Card>

        <Card title={t('审批流列表')} bordered={false} className="workflow-list">
          <Table
            rowKey="id"
            className="upm-table"
            columns={this.getColumns()}
            dataSource={records}
            pagination={{
              current,
              pageSize: size,
              hideOnSinglePage: true,
              total,
              onChange: this.handlePageChange
            }}
          />
        </Card>

        <Modal
          title={t('审批流配置')}
          visible={modalVisible}
          onOk={this.handleModalOk}
          onCancel={this.closeModal}
          confirmLoading={data.modalStatus==='loading'}
          cancelText={t('取消')}
          okText={t('确认绑定')}
          // width="60%"
        >
          <Form className="edit-form">
            <FormItem
              {...formItemLayout}
              label={t('审批流名称')}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: t('请输入审批流名称') }],
              })(
                <Input
                  disabled={true}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={t('类型选择')}
            >
              {getFieldDecorator('type', {
                rules: [{ required: true, message: t('请选择类型') }],
              })(
                <Select
                  placeholder="请选择"
                  onChange={this.handleTypeChange}
                >
                  {typeOptions}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={t('关联属性')}
            >
              {getFieldDecorator('refIds', {
                rules: [{ required: true, message: t('请选择关联属性') }],
              })(
                <Select
                  placeholder={t('请选择')}
                  mode="multiple"
                  optionFilterProp="children"
                >
                  {this.getRefOptions()}
                </Select>
              )}
            </FormItem>
            {/* <FormItem
              {...formItemLayout}
              label={t('审批节点')}
            >
              {getFieldDecorator('stepInfo', {
                rules: [{ required: true, message: t('请添加审批节点') }],
              })(
                <Button onClick={this.handleAddStep}>
                  {t('添加')}
                </Button>
              )}
            </FormItem>

            <div id="step-table">
              <Table
                bordered
                dataSource={dataSourceForSteps}
                columns={this.getStepTableColumns()}
                rowKey="id"
                pagination={false}
              />
            </div> */}
          </Form>
        </Modal>

        <Modal
          title={t('审批流')}
          visible={upmModalVisible}
          onOk={this.handleUPMModalOk}
          onCancel={this.closeUPMModal}
          confirmLoading={data.modalStatus==='loading'}
          cancelText={t('取消')}
          okText={t('确定')}
          width="60%"
        >
          <Form className="edit-form">
            <FormItem
              label={t('名称')}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: t('请输入名称') }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label={t('类型')}
            >
              {getFieldDecorator('type', {
                rules: [{ required: true, message: t('请选择类型') }],
              })(
                <Select
                  placeholder="请选择"
                  onChange={this.handleTypeChange}
                >
                  {typeOptions}
                </Select>
              )}
            </FormItem>
            <FormItem
              label={t('关联属性')}
            >
              {getFieldDecorator('refIds', {
                rules: [{ required: true, message: t('请选择关联属性') }],
              })(
                <Select
                  placeholder={t('请选择')}
                >
                  {this.getRefOptions()}
                </Select>
              )}
            </FormItem>
            <FormItem
              label={t('审批节点')}
            >
              {getFieldDecorator('stepInfo', {
                rules: [{ required: true, message: t('请添加审批节点') }],
              })(
                <Button onClick={this.handleAddStep}>
                  {t('添加')}
                </Button>
              )}
            </FormItem>

            <div id="step-table">
              <Table
                bordered
                dataSource={dataSourceForSteps}
                columns={this.getStepTableColumns()}
                rowKey="id"
                pagination={false}
              />
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect(({ workflow, global }) => {
  const {
    workflowenums,
    // defaultgrantenums
  } = global.enumMap;

  return {
    data: workflow,
    workflowEnums: workflowenums,
    appId: global.managingApp,
    availableApps: global.availableApps,
    bpmAdmin: global.bpmAdmin,
    wikihost: global.wikihost
    // defaultGrantEnums: defaultgrantenums
  };
}, (dispatch) => ({
  fetchData(params) {
    dispatch({
      type: 'workflow/fetchOld',
      payload: params
    });
  },
  requestUpdate(params) {
    return dispatch({
      type: 'workflow/updateFlow',
      payload: params
    });
  },
  requestConfig(params) {
    return dispatch({
      type: 'workflow/configFlow',
      payload: params
    });
  },
  requestNew(params) {
    dispatch({
      type: 'workflow/newFlow',
      payload: params
    });
  },
  unbindFlow(params) {
    dispatch({
      type: 'workflow/unbindFlow',
      payload: params
    });
  },
  delFlow(params) {
    dispatch({
      type: 'workflow/delFlow',
      payload: params
    });
  },
  fetchOptions(params) {
    dispatch({
      type: 'workflow/fetchOptions',
      payload: params
    });
  },
}))(Form.create()(Workflow));
