import React, { Component } from 'react';
import { Button, Form, Input, Card, Row, Col, Select, Popconfirm } from 'antd';
import connect from '@utils/translateConnect';
import AvailableApps from '../../../components/AvailableApps/index';
import EditableTree from '../../../components/EditableTree/index';

import { find, startsWith } from 'lodash';
import DimensionForm from './DimensionForm';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = null;

class Dimension extends Component {
  state = {
    dimensionId: '',
    editingDimension: null,
    editingDimensionParent: {
      name: ''
    },

    modalVisible: false,
    isEditing: false,
  };

  componentDidMount () {
    if (this.props.appId) {
      this.props.fetchDimensionList(this.props.appId);
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.appId && this.props.appId !== nextProps.appId) {
      this.props.fetchDimensionList(nextProps.appId);
    }

    if (nextProps.addingStatus === '' && this.props.addingStatus === 'adding') {
      this.closeModal();
      this.setState({
        dimensionId: nextProps.dimensionList[0].id
      });
    }

    if (nextProps.addingStatus === '' && this.props.addingStatus === 'editing') {
      this.closeModal();
      this.setState({
        isEditing: false
      });
    }
  }

  handleSelectDimension = (dimensionId) => {
    if (this.state.dimensionId === dimensionId) {
      return;
    }

    this.handleFormReset();

    this.setState({
      dimensionId
    }, () => {
      if (!startsWith(dimensionId, 'dimension-')) {
        this.props.fetchDimensionDetail(this.props.appId, dimensionId);
      }
    });
  };

  newDimension = () => {
    this.handleFormReset();
    this.setState({
      modalVisible: true,
      isEditing: false
    });
  };

  handleAddDimensionNode = (item, { fakeId }) => {
    const { dimensionId } = this.state;
    const nodeData = {
      id: fakeId,
      dimeId: dimensionId,
      name: '新增节点',
      dimeNodeName: '新增节点',
      dimeNodeKey: '',
      remark: '',
      path: item ? item.path.concat(fakeId) : [fakeId],
      isFake: true,
      parent: item,
      pid: item ? item.id : 0,
      appId: this.props.appId
    };

    if (item) {
      const {
        children,
      } = item;

      let childrenData = [];
      if (children) {
        childrenData = [nodeData, ...children];
      } else {
        childrenData.push(nodeData);
      }

      this.props.addDimensionNode(dimensionId, {
        ...item,
        children: childrenData,
      });
    } else {
      this.props.addDimensionNode(dimensionId, nodeData);
    }

    this.handleEditDimensionNode(nodeData);
  };

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  handleDimensionFormSubmit = ({ dimeName, dimeKey }) => {
    if (this.state.isEditing) {
      this.props.updateDimension({
        dimeName,
        dimeKey,
        appId: this.props.appId,
        id: this.state.dimensionId
      });
    } else {
      this.props.addDimension({
        dimeName,
        dimeKey,
        appId: this.props.appId
      });
    }
  };

  closeModal = () => {
    this.setState({
      modalVisible: false
    });
  };

  handleEditDimension = () => {
    this.setState({
      modalVisible: true,
      isEditing: true
    });
  };

  handleDeleteDimension = () => {
    this.props.deleteDimension({
      appId: this.props.appId,
      id: this.state.dimensionId
    });

    this.setState({
      dimensionId: ''
    });
  };

  handleEditDimensionNode = (node) => {
    if (!node) {
      this.setState({
        editingDimension: null,
        editingDimensionParent: {
          name: ''
        }
      });

      this.handleFormReset();

      return;
    }

    const {
      dimeNodeName,
      dimeNodeKey,
      remark,
      parent,
    } = node;

    this.props.form.setFieldsValue({
      dimeNodeName,
      dimeNodeKey,
      remark
    });

    this.setState({
      editingDimension: node,
      editingDimensionParent: parent
    });
  };

  handleDelDimensionNode = (item) => {
    const {
      delDimensionNode,
    } = this.props;
    const { dimensionId, editingDimension } = this.state;

    delDimensionNode(item);

    if (editingDimension && item.id === editingDimension.id) {
      this.setState({
        editingArea: null,
        editingAreaParent: {
          name: ''
        },
      });
      this.handleFormReset();
    }
  };

  handleEditNodeSubmit = () => {
    const { form, updateDimensionNode, appId } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const {
        dimeNodeName,
        dimeNodeKey,
        remark
      } = fieldsValue;

      let pid = '';
      const { editingDimension, editingDimensionParent } = this.state;
      if (editingDimensionParent) {
        pid = editingDimensionParent.id;
      }

      updateDimensionNode({
        ...editingDimension,
        dimeNodeName,
        dimeNodeKey,
        remark,
        appId
      });
    });
  };

  render () {
    const {
      dimensionList,
      dimensionDetail,
      form,
      appId,
      addingStatus,
      t
    } = this.props;

    const {
      dimensionId,
      editingDimension,
      editingDimensionParent,
      modalVisible,
      isEditing
    } = this.state;
    const { getFieldDecorator } = form;

    const dimension = find(dimensionList, ['id', dimensionId]);

    return (
      <div className="Dimension">
        <Card title={t('维度管理')} bordered={false}>
          <Row gutter={24} className="search-fields">
            <Col span={8}>
              <FormItem label={t('系统选择：')}>
                <AvailableApps
                  style={{ width: '100%' }}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={t('维度选择：')}>
                <Select
                  className="dimension-select"
                  value={dimensionId}
                  placeholder={(t('请选择已经创建的维度'))}
                  onChange={this.handleSelectDimension}
                >
                  {dimensionList.map(dimension => (
                    <Option
                      key={dimension.id}
                      value={dimension.id}
                    >
                      {dimension.dimeName}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Popconfirm
                title={t('确定删除此维度？删除后不可恢复！')}
                okText={t('确定')}
                cancelText={t('取消')}
                onConfirm={this.handleDeleteDimension}
              >
                <Button
                  type="primary"
                  className="delete-btn"
                  disabled={dimensionId === ''}
                >
                  {t('删除选中维度')}
                </Button>
              </Popconfirm>

              <Button
                type="primary"
                className="add-btn"
                disabled={appId === ''}
                onClick={this.newDimension}>
                {t('新增维度')}
              </Button>
            </Col>
          </Row>
        </Card>

        <DimensionForm
          onSubmit={this.handleDimensionFormSubmit}
          visible={modalVisible}
          onClose={this.closeModal}
          confirmLoading={addingStatus === 'adding' || addingStatus === 'editing'}
          presetData={isEditing && dimension}
          t={t}
        />

        <Card title={t('维度编辑')} bordered={false} className="dimension-detail">
          {dimension && (
            <Row gutter={24} className="dimension-name-field">
              <Col span={6}>
                {t('维度名称：')}
                <b className="content">
                  {dimension.dimeName}
                </b>
              </Col>
              <Col span={6}>
                {t('维度标识：')}
                <b className="content">
                  {dimension.dimeKey}
                </b>
              </Col>
              <Col span={6}>
                {t('维度ID：')}
                <b className="content">
                  {dimension.id}
                </b>
              </Col>
              <Col span={6}>
                <Button
                  className="edit-btn"
                  type="primary"
                  onClick={this.handleEditDimension}>
                  {t('编辑')}
                </Button>
              </Col>
            </Row>
          )}

          {dimensionId !== '' && !startsWith(dimensionId, 'dimension-') ? (
            <Row gutter={24} className="">
              <Col span={12}>
                <EditableTree
                  data={dimensionDetail}
                  requestAdd={this.handleAddDimensionNode}
                  requestDel={this.handleDelDimensionNode}
                  requestSelect={this.handleEditDimensionNode}
                  isNeedSearch={true}
                />
              </Col>

              <Col span={12} className="form-area">
                <h4>{t('详情编辑')}</h4>
                <Form className="edit-form">
                  <FormItem
                    {...formItemLayout}
                    label={t('名称')}
                  >
                    {getFieldDecorator('dimeNodeName', {
                      rules: [{ required: true, message: t('请输入名称') }],
                    })(
                      <Input />
                    )}
                  </FormItem>

                  <FormItem
                    {...formItemLayout}
                    label={t('标识')}
                  >
                    {getFieldDecorator('dimeNodeKey', {
                      rules: [{ required: true, message: t('请输入标识') }],
                    })(
                      <Input />
                    )}
                  </FormItem>

                  <FormItem
                    {...formItemLayout}
                    label={t('描述')}
                  >
                    {getFieldDecorator('remark', {
                      rules: [{ message: t('请输入描述') }],
                    })(
                      <Input />
                    )}
                  </FormItem>

                  <FormItem
                    {...formItemLayout}
                    label={t('父级')}
                  >
                    <Input disabled value={editingDimensionParent ? editingDimensionParent.name : ''} />
                  </FormItem>

                  <FormItem
                    wrapperCol={{ span: 12, offset: 6 }}
                  >
                    <Button
                      type="primary"
                      onClick={this.handleEditNodeSubmit}
                      disabled={!editingDimension}
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
}

export default connect(({ dimension, global }) => {
  return {
    dimensionDetail: dimension.list,
    dimensionList: dimension.dimension,
    appId: global.managingApp,
    addingStatus: dimension.addingStatus
  };
}, (dispatch) => ({
  fetchDimensionDetail (appId, dimensionId) {
    dispatch({
      type: 'dimension/fetchDimensionDetail',
      payload: {
        appId,
        dimensionId
      }
    });
  },
  fetchDimensionList (appId) {
    dispatch({
      type: 'dimension/fetchList',
      payload: appId
    });
  },
  addDimension (info) {
    dispatch({
      type: 'dimension/newDimension',
      payload: info
    });
  },
  deleteDimension (info) {
    dispatch({
      type: 'dimension/deleteDimension',
      payload: info
    });
  },
  updateDimension (info) {
    dispatch({
      type: 'dimension/updateDimension',
      payload: info
    });
  },
  addDimensionNode (dimensionId, node) {
    dispatch({
      type: 'dimension/addDimensionNode',
      payload: {
        dimensionId,
        node
      }
    });
  },
  delDimensionNode (node) {
    dispatch({
      type: 'dimension/delDimensionNode',
      payload: node
    });
  },
  updateDimensionNode (node) {
    dispatch({
      type: 'dimension/updateDimensionNode',
      payload: node
    });
  },
}))(Form.create()(Dimension));
