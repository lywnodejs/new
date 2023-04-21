import React, { Component } from 'react';
import { Popconfirm, Popover, Button, Form, Input, Table, Row, Col, Select, Modal, Card, Tooltip, DatePicker, message, Icon} from 'antd';
import connect from '@utils/translateConnect';
import CardTitle from '@components/CardTitle';
import moment from 'moment';
import { Resizable } from 'react-resizable';

import './index.less';
import EditModal from './EditModal'; // 权限review编辑编辑页面
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
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


const TableStyle = {
  buttonSize: 'small'
};
const transferOptions = (data) => {
  const options = [];
  data.forEach((option) => {
    const newOption = {};
    newOption.key = `${option.id}`,
      newOption.value = `${option.id}`,
      newOption.label = option.name,
      newOption.children = option.children ? transferOptions(option.children) : null;
    options.push(newOption);
  });
  return options;
};

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

class Review extends Component {

  state = {
    current: 1,
    name: '',
    op: '',
    startTime: moment().subtract(1, 'month'),
    endTime: moment(),
    nowReviewModel: {},
    visibleCopy: false,
    modalVisible: false,
    visibleStart: false,
    editingId: '',
    selectedType: '',
    treeData: [],
    reviewDays: 0,
    appId: 888,
    reviewAppList: [],
    radioRole: 0,
    radioArea: 0,
    radioBu: 0,
    radioFlag: 0,
    disableCustom: false,
    permissionRiskLevelList: [],
    reviewTargetType: 0,
    isEdit: false,
    editId: 0,
    initAppId: [],
    columns: [{
      title: this.props.t('ID'),
      dataIndex: 'id',
      key: 'id',
      width: 50
    }, {
      title: this.props.t('权限审核名称'),
      dataIndex: 'name',
      key: 'name',
      width: 150
    }, {
      title: this.props.t('目标系统'),
      dataIndex: 'appNames',
      key: 'appNames',
      width: 100
    }, {
      title: this.props.t('权限类型'),
      dataIndex: '',
      key: '',
      width: 70,
      render: (text) => {
        return this.findPermissionTypeStr(text.permissionTypeList)
      }
    }, {
      title: this.props.t('权限敏感级'),
      dataIndex: 'riskLevelList',
      key: 'riskLevelList',
      width: 50,
      render: (text) => {
        return this.getRiskLevelByStr(text);
      }
    }, {
      title: this.props.t('实际权限审核点个数'),
      dataIndex: 'totalPermissions',
      key: 'totalPermissions',
      width: 60,
      render: (text, record) => {
        if (record.opStatus === 0) {
          return <Tooltip title={this.props.t('计算需要一些时间，刷新页面获取最新的计算结果')}>
            <span>{this.props.t('计算中...')}</span>
            <Icon type="exclamation-circle" />
          </Tooltip>
        } else {
          return text;
        }
      }
    }, {
      title: this.props.t('权限审核范围'),
      dataIndex: 'reviewTarget',
      key: 'reviewTarget',
      ellipsis: true
    }, {
      title: this.props.t('权限审核目的'),
      dataIndex: 'purpose',
      key: 'purpose',
      ellipsis: true,
    }, {
      title: this.props.t('实际审核用户数'),
      dataIndex: 'totalUsers',
      key: 'totalUsers',
      width: 60,
      render: (text, record) => {
        if (record.opStatus === 0) {
          return <Tooltip title={this.props.t('计算需要一些时间，刷新页面获取最新的计算结果')}>
            {this.props.t('计算中...')}
            <Icon type="exclamation-circle" />
          </Tooltip>
        } else {
          return text;
        }
      }

    }, {
      title: this.props.t('权限默认'),
      dataIndex: 'defaultPermissionStatus',
      key: 'defaultPermissionStatus',
      width: 60,
      render: (text) => {
        if (text === 0) {
          return this.props.t('保留');
        } else if (text === 1) {
          return this.props.t('删除')
        } else {
          return ''
        }
      }
    }, {
      title: this.props.t('权限审核人账号'),
      dataIndex: 'approveUser',
      key: 'approveUser',
      width: 100
    }, {
      title: this.props.t('配置时间'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (text) => {
        return moment(text).format('YYYY-MM-DD HH:mm')
      }
    }, {
      title: this.props.t('是否启动'),
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text) => {
        if (text === 0) {
          return this.props.t('已结束');
        } else if (text === 1) {
          return this.props.t('未启动')
        } else if (text === 2) {
          return this.props.t('已启动')
        } else if (text === 3) {
          return this.props.t('已启动')
        } else {
          return ''
        }
      }
    }, {
      title: this.props.t('操作'),
      key: 'action',
      render: (text, record) => {
        const content = (
          <span>
            <Button className="upm-popover__button" size={TableStyle.buttonSize} onClick={() => this.showDetail(record)}>{this.props.t('详情')}</Button>
            <Button className="upm-popover__button" style={record.status !== 1 ? { display: 'none' } : {}} size={TableStyle.buttonSize} onClick={() => this.handleRefresh(record)}>{this.props.t('刷新')}</Button>
            <Button className="upm-popover__button" size={TableStyle.buttonSize} onClick={() => this.copyReviewPage(record)}>{this.props.t('复制')}</Button>
            <Button className="upm-popover__button" style={record.status !== 1 ? { display: 'none' } : {}} size={TableStyle.buttonSize} onClick={() => this.showEdit(record)}>{this.props.t('编辑')}</Button>
            <Button className="upm-popover__button" style={record.status !== 1 ? { display: 'none' } : {}} type="danger" size={TableStyle.buttonSize} onClick={() => this.confirmDelete(record)}>{this.props.t('删除')}</Button>
            <Button size={TableStyle.buttonSize} style={record.status !== 1 ? { display: 'none' } : {}} onClick={() => this.confirmStart(record)}>{this.props.t('启动')}</Button>
          </span>
        );
        return (
          <Popover overlayClassName='upm-popover' overlayStyle={{ zIndex: 999 }} content={content} placement="topRight" trigger="click">
            <Button size={TableStyle.buttonSize}>{this.props.t('操作')}</Button>
          </Popover>
        )
      }
    }]
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  copyReviewTxt = ''
  findPermissionTypeStr(permissionType) {
    const { t } = this.props;
    var permissionTypeMap = {
      0: t('全部'),
      2: t('角色'),
      1: t('地区'),
      7: t('标识位'),
      100: t('数据资源')
    };
    let txt = ''
    for (let index in permissionType) {
      txt += permissionTypeMap[permissionType[index]] + ','
    }
    return txt.length > 1 ? txt.substring(0, txt.length - 1) : ''
  }
  componentDidMount() {
    const { fetchReviewAppList } = this.props;
    fetchReviewAppList().then(res => {
      if (res.success && res.result && res.result.length) {
        this.setState({
          reviewAppList: res.result,
          appId: res.result[0].id
        }, () => {
          this.handleFetch(1);
        })
      }
    });
  }


  handlePageChange = (page = 1) => {
    this.handleFetch(page);
    this.setState({
      current: page
    })
  }

  handleRefresh = (record) => {
    const { t } = this.props;
    this.props.refreshReview({ reviewId: record.id }).then(({ success, result }) => {
      if (!success) {
        message.error(result, 5);
      } else {
        this.setState({
          visibleStart: false,
          hovered: true
        })
        message.success(t('成功'), 2, () => { });
        this.handlePageChange(this.state.current)
      }
    })
  }
  handleFetch = (page) => {
    const {
      name,
      op,
      startTime,
      endTime,
      appId
    } = this.state;
    const { t } = this.props
    if (!startTime) {
      message.error(t('请选择时间'), 5);
      return;
    }
    this.props.fetchData({
      name,
      op,
      startTime,
      endTime,
      page,
      appId: 888,
      reviewAppId: appId
    });
  };

  handleSearchFieldChange = (event, fieldName) => {
    this.setState({
      [fieldName]: event.target.value
    });
  };

  onChangeState = (state) => {
    this.setState(state, () => {
    });
  };

  handleDelete = (flow) => {
    this.props.delReview({ reviewId: flow.id }).then(({ success, result }) => {
      if (!success) {
        message.error(result, 5);
      } else {
        this.handlePageChange()
      }
    })
  };
  handleStart = (flow) => {
    this.props.startReview({ reviewId: flow.id }).then(({ success, result }) => {
      if (!success) {
        message.error(result, 5);
      } else {
        this.setState({
          visibleStart: false
        });
        this.handlePageChange()
      }
    })
    return true
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
  confirmStart = (flow) => {
    const { t } = this.props;
    this.setState({
      visibleStart: true,
      nowReviewModel: flow
    });

  };
  getRiskLevelByStr = (text) => {
    var realTxt = ''
    const { t } = this.props
    if (text && text.length == 1 && text[0] === 0) {
      return t('全部');
    }
    for (let tmp in text) {
      realTxt += 'C' + text[tmp] + ',';
    }
    return realTxt.substring(0, realTxt.length - 1);
  }
  // getColumns = () => {
  //   const {
  //     t
  //   } = this.props;

  //   const columns = [{
  //     title: t('ID'),
  //     dataIndex: 'id',
  //     key: 'id',
  //     width: 60
  //   }, {
  //     title: t('review名称'),
  //     dataIndex: 'name',
  //     key: 'name',
  //   }, {
  //     title: t('目标系统'),
  //     dataIndex: 'appNames',
  //     key: 'appNames'
  //   }, {
  //     title: t('review权限类型'),
  //     dataIndex: '',
  //     key: '',
  //     render: (text) => {
  //       return this.findPermissionTypeStr(text.permissionTypeList)
  //     }
  //   }, {
  //     title: t('权限敏感级限制'),
  //     dataIndex: 'riskLevelList',
  //     key: 'riskLevelList',
  //     render: (text) => {
  //       return this.getRiskLevelByStr(text);
  //     }
  //   }, {
  //     title: t('实际review权限点个数'),
  //     dataIndex: 'totalPermissions',
  //     key: 'totalPermissions',
  //     render: (text, record) => {
  //       if (record.opStatus === 0) {
  //         return t('计算中...');
  //       } else {
  //         return text;
  //       }
  //     }
  //   }, {
  //     title: t('review范围'),
  //     dataIndex: 'reviewTarget',
  //     key: 'reviewTarget',
  //     ellipsis: true
  //   }, {
  //     title: t('review目的'),
  //     dataIndex: 'purpose',
  //     key: 'purpose',
  //     width: 200,
  //     ellipsis: true,
  //     render: (text) => {
  //       if (text.length > 10) {
  //         return <Tooltip title={text}>
  //                 <span className="table__coloumn--ellipsis">{text}</span>
  //               </Tooltip>
  //       } else {
  //         return <span>{text}</span>
  //       }
  //     }
  //   }, {
  //     title: t('实际review用户数'),
  //     dataIndex: 'totalUsers',
  //     key: 'totalUsers',
  //     render: (text, record) => {
  //       if (record.opStatus === 0) {
  //         return t('计算中...');
  //       } else {
  //         return text;
  //       }
  //     }
  //   // }, {
  //   //   title: t('配置人'),
  //   //   dataIndex: 'byUser',
  //   //   key: 'byUser',
  //   }, {
  //     title: t('权限默认'),
  //     dataIndex: 'defaultPermissionStatus',
  //     key: 'defaultPermissionStatus',
  //     render: (text) => {
  //       if (text === 0) {
  //         return t('保留');
  //       } else if (text === 1) {
  //         return t('删除')
  //       } else {
  //         return ''
  //       }
  //     }
  //   }, {
  //     title: t('权限审核人'),
  //     dataIndex: 'approveUser',
  //     key: 'approveUser',
  //   }, {
  //     title: t('配置时间'),
  //     dataIndex: 'createdAt',
  //     key: 'createdAt',
  //     render: (text) => {
  //       return moment(text).format('YYYY-MM-DD HH:mm')
  //     }
  //   }, {
  //     title: t('是否启动'),
  //     dataIndex: 'status',
  //     key: 'status',
  //     render: (text) => {
  //       if (text === 0) {
  //         return t('已结束');
  //       } else if (text === 1) {
  //         return t('未启动')
  //       } else if (text === 2) {
  //         return t('已启动')
  //       } else if (text === 3) {
  //         return t('已启动')
  //       } else {
  //         return ''
  //       }
  //     }
  //   }, {
  //     title: t('操作'),
  //     key: 'action',
  //     render: (text, record) => {
  //       const content = (
  //         <span>
  //           <Button className="upm-popover__button" size={TableStyle.buttonSize} onClick={() => this.showDetail(record)}>{t('详情')}</Button>
  //           <Button className="upm-popover__button" style={record.status !== 1 ? { display: 'none' } : {}} size={TableStyle.buttonSize} onClick={() => this.handleRefresh(record)}>{t('刷新')}</Button>
  //           <Button className="upm-popover__button" size={TableStyle.buttonSize} onClick={() => this.copyReviewPage(record)}>{t('复制')}</Button>
  //           <Button className="upm-popover__button" style={record.status !== 1 ? { display: 'none' } : {}} size={TableStyle.buttonSize} onClick={() => this.showEdit(record)}>{t('编辑')}</Button>
  //           <Button className="upm-popover__button" style={record.status !== 1 ? { display: 'none' } : {}} type="danger" size={TableStyle.buttonSize} onClick={() => this.confirmDelete(record)}>{t('删除')}</Button>
  //           <Button size={TableStyle.buttonSize} style={record.status !== 1 ? { display: 'none' } : {}} onClick={() => this.confirmStart(record)}>{t('启动')}</Button>
  //         </span>
  //       );
  //       return (
  //         <Popover overlayClassName='upm-popover' overlayStyle={{ zIndex: 999 }} content={content} placement="topRight" trigger="click">
  //           <Button size={TableStyle.buttonSize}>{t('操作')}</Button>
  //         </Popover>
  //       )
  //     }
  //   }];

  //   return columns;
  // };

  openModal = (id = '') => {
    this.setState({
      modalVisible: true,
      editingId: id,
      isEdit: false,
      editId: 0
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
      editingId: '',
      selectedType: '',
    });
  };



  handleOk = () => {
    confirm({
      title: t('是否开启'),
      content: '',
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => this.handleStart(this.state.nowReviewModel)
    });
  }

  showDetail = (obj) => {
    this.setState({
      editingId: obj.id,
      modalVisible: true
    });
    this.showEdit(obj);
  }
  showEdit = (obj) => {
    const { getPermissionReviewShow, getAppBindedBusiness, getAppBindedBusinessAll, mergeDept } = this.props;
    getPermissionReviewShow({ id: obj.id }).then(res => {
      this.props.showEdit(res);
      if (res.businessId > 0) {
        // getAppBindedBusiness({ appId: res.appIdList[0] });
        getAppBindedBusinessAll({ appId: res.appIdList[0] });
      }
      if (res.deptList && res.deptList.length > 0) {
        mergeDept(res.deptList)
      }
      this.setState({
        modalVisible: true
      });
    });

  }



  changePermissionType = (type) => {
    if (type.length > 1) {
      let realType = [];
      if (type[type.length - 1] == 0) {
        realType.push(0);
      } else {
        for (let index in type) {
          if (type[index] > 0) {
            realType.push(type[index]);
          }
        }
      }
      return realType;
    } else {
      return type;
    }
  }
  typeChange = (type) => {
    const { getAppBindedBusiness, form } = this.props;
    if (type.length > 1) {
      let realType = [];
      for (let index in type) {
        if (type[index] > 0) {
          realType.push(type[index]);
        }
      }
      this.props.form.setFieldsValue({
        permissionType: realType
      });
    }

    for (let index in type) {
      // 地区
      if (type[index] === 1 && !this.state.disableCustom) {
        getAppBindedBusiness({ appId: form.getFieldValue('appId') })
      }
    }

  }
  copyReviewPage = (record) => {
    this.setState({
      visibleCopy: true,
      nowReviewModel: record
    })

  }
  copyReview = () => {
    const { nowReviewModel } = this.state
    const { t } = this.props
    this.props.copyReview({ reviewId: nowReviewModel.id, reviewName: this.copyReviewTxt }).then(({ success, result }) => {
      if (!success) {
        message.error(result, 5);
      } else {
        this.setState({
          visibleCopy: false
        })

        this.copyReviewTxt = ''
        message.success(t('成功'), 2, () => { });
        this.handlePageChange(1)
      }
    })
  }


  renderStart() {
    const { t } = this.props
    const { nowReviewModel } = this.state
    if (nowReviewModel.totalPermissions === 0 || nowReviewModel.totalUsers === 0) {
      return (<Button type="primary" disabled={nowReviewModel.totalPermissions === 0 || nowReviewModel.totalUsers === 0 ? true : false} >{t('继续发起')} </Button>
      )
    } else {
      return (
        <Popconfirm key="submit" placement="top" title={t('是否启动')} onConfirm={() => this.handleStart(this.state.nowReviewModel)} okText="Yes" cancelText="No">
          <Button type="primary"  >{t('继续发起')} </Button>
        </Popconfirm>)
    }
  }
  render() {
    const {
      name,
      op,
      modalVisible,
      visibleStart,
      current,
      startTime, endTime,
      editingId,
      appId,
      nowReviewModel,
      reviewAppList,
      visibleCopy
    } = this.state;

    const {
      data,
      form,
      t,
      availableApps
    } = this.props;
    let addAllSystem = [];
    let upmAdmin = false
    availableApps.forEach(item => {
      if (item.id === 888) {
        upmAdmin = true
      }
    })
    if (upmAdmin) {
      addAllSystem.push({ id: 0, name: t('全部') });
    }
    for (let index in availableApps) {
      addAllSystem.push(availableApps[index])
    }

    const {
      // current,
      pages,
      size,
      total,
      records
    } = data;

    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    return (
      <div className="workflow-page">
        <Card title={< CardTitle title={t('权限审核历史查询')} > </CardTitle>} bordered={false}>
          <Row gutter={24} className="search-fields">
            <Col span={8}>
              <FormItem label={t('目标系统')}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  value={appId}
                  style={{ width: '100%' }}
                  onChange={(appId) => this.onChangeState({ appId })}
                >
                  {reviewAppList.map((bus) => (
                    <Option
                      key={bus.id}
                      value={bus.id}
                    >
                      {bus.id ? bus.name : t('全部')}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={t('权限审核名称')}>
                <Input
                  placeholder={t('请输入关键字进行模糊搜索')}
                  value={name}
                  onChange={(e) => this.handleSearchFieldChange(e, 'name')}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={t('发起人')}>
                <Input
                  placeholder={t('请输入关键字进行模糊搜索')}
                  value={op}
                  onChange={(e) => this.handleSearchFieldChange(e, 'op')}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={t('配置时间') + '：'} {...formItemLayout}>
                <RangePicker
                  value={[startTime, endTime]}
                  onChange={(date) => this.onChangeState({ startTime: date[0], endTime: date[1] })}
                />
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem label="">
                <Button
                  type="primary"
                  onClick={() => this.handlePageChange()}>
                  {t('查询')}
                </Button>
                <Button
                  className="btn"
                  onClick={() => this.openModal()}
                >
                  {t('配置权限审核')}
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Card>

        <Card title={t('权限审核列表')} bordered={false} className="workflow-list">
          <Table
            rowKey="id"
            className="upm-table"
            bordered
            components={this.components}
            columns={columns}
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
          visible={visibleCopy}
          onOk={() => this.copyReview()}
          onCancel={() => this.setState({ visibleCopy: false })}
          title={t('修改权限审核名称')}
        >
          <Input onChange={(event) => this.copyReviewTxt = event.target.value} />
        </Modal>

        <Modal
          visible={visibleStart}
          onCancel={() => this.setState({ visibleStart: false })}
          title={t('是否发起本次权限审核?')}
          footer={[
            <Button key="back" onClick={() => this.handleRefresh(this.state.nowReviewModel)}>{t('刷新')}
            </Button>,
            this.renderStart()
          ]}
        >
          <div>
            <p>{t('权限审核目标系统')}: &nbsp;&nbsp;{nowReviewModel.appNames}</p>
            <p>{t('权限审核权限类型')}: &nbsp;&nbsp;{this.findPermissionTypeStr(nowReviewModel.permissionTypeList)}</p>
            <p>{t('权限敏感级')}: &nbsp;&nbsp;{this.getRiskLevelByStr(nowReviewModel.riskLevelList)}</p>
            <p>{t('权限审核范围')}: &nbsp;&nbsp;{nowReviewModel.reviewTarget}</p>
            <p style={nowReviewModel.totalPermissions == 0 ? { color: 'red' } : {}}>{t('实际权限审核权限')}: &nbsp;&nbsp;{nowReviewModel.totalPermissions}{('个')}</p>
            <p style={nowReviewModel.totalUsers == 0 ? { color: 'red' } : {}}>{t('实际权限审核账户')}: &nbsp;&nbsp;{nowReviewModel.totalUsers}{('个')}</p>
            <p>{t('权限获得天数')}: &nbsp;&nbsp;{nowReviewModel.threshold}{t('天')}</p>
            <p>{t('物理上级审核天数')}: &nbsp;&nbsp;{nowReviewModel.reviewDays}{t('天')}</p>
            <p>{t('权限审核目的')}: &nbsp;&nbsp;{nowReviewModel.purpose}</p>
          </div>
          <p>{t('注意：本条权限审核刷新时间为')}{moment(nowReviewModel.refreshAt).format('YYYY-MM-DD HH:mm')}{t('，若距离发起时间超过3天，请刷新后再发送')}</p>
        </Modal>

        <EditModal
          closeModal={this.closeModal}
          editingId={this.state.editingId}
          handleOk={this.handleFetch}
          modalVisible={modalVisible}
          resourceList={this.props.resourceList}
        ></EditModal>
      </div>
    );
  }
}

export default connect(({ manageReview, global }) => {
  return {
    data: manageReview.list,
    departments: manageReview.departments,
    availableApps: global.availableApps,
    appbindedbusiness: manageReview.appbindedbusiness,
    resourceList: manageReview.resourceList
  };
}, (dispatch) => ({
  dispatch(params) {
    return dispatch(params);
  },
  fetchData(params) {
    dispatch({
      type: 'manageReview/fetch',
      payload: params
    });
  },
  showEdit(params) {
    dispatch({
      type: 'manageReview/showEdit',
      payload: params
    });
  },
  fetchDept(params) {
    dispatch({
      type: 'manageReview/fetchDept',
      payload: params
    })
  },
  mergeDept(params) {
    dispatch({
      type: 'manageReview/mergeDept',
      payload: params
    });
  },
  saveDept(params) {
    dispatch({
      type: 'manageReview/saveDept',
      payload: params
    })
  },
  permissionReviewEdit(params) {
    return dispatch({
      type: 'manageReview/editPermissionReview',
      payload: params
    })
  },
  getPermissionReviewShow(params) {
    return dispatch({
      type: 'manageReview/getPermissionReviewShow',
      payload: params
    })
  },
  getAppBindedBusiness(params) {
    dispatch({
      type: 'manageReview/getAppBindedBusiness',
      payload: params
    })
  },
  getAppBindedBusinessAll(params) {
    dispatch({
      type: 'manageReview/getAppBindedBusinessAll',
      payload: params
    })
  },
  delReview(params) {
    return dispatch({
      type: 'manageReview/deleteReview',
      payload: params
    })
  },
  addReview(params) {
    return dispatch({
      type: 'manageReview/addReview',
      payload: params
    });
  },
  startReview(params) {
    return dispatch({
      type: 'manageReview/startReview',
      payload: params
    })
  },
  refreshReview(params) {
    return dispatch({
      type: 'manageReview/refreshReview',
      payload: params
    })
  },
  fetchReviewDetail(params) {
    return dispatch({
      type: 'manageReview/fetchReviewDetail',
      payload: params
    })
  },
  upateModel(params) {
    dispatch({
      type: 'manageReview/save',
      payload: params
    })
  },
  copyReview(params) {
    return dispatch({
      type: 'manageReview/copyReview',
      payload: params
    })
  },
  fetchReviewAppList(params) {
    return dispatch({
      type: 'manageReview/fetchReviewAppList',
      payload: params
    })
  }
}))(Form.create()(Review));
