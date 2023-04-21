import React from 'react';
import { Card, Table, Modal } from 'antd';
import connect from '@utils/translateConnect';
import DataRescourceSearchForm from './components/searchForm';

import './style.less';

class DataModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchForm: {
        page: 0,
        size: 10
      },
      resourceApps: [], // 有资源数据的系统
      businessList: [], //业务线列表
      queryList: [], // 查询资源列表
      dataType: [], // 数据类型
      attrValues: [], // 项目列表
      columns: [
        // 表头信息
        {
          title: '数据资源ID',
          dataIndex: 'dataID'
        },
        {
          title: '数据资源名称',
          dataIndex: 'dataName'
        },
        {
          title: '数据类型',
          dataIndex: 'dataType'
        },
        {
          title: '数据敏感级',
          dataIndex: 'riskLevel'
        },
        {
          title: '业务线',
          dataIndex: 'businessName'
        }
      ],
      dataSource: [
        // 表格内容
      ],
      total: '', // 页码总数
      selectedRowKeys: [], // 选中的数组
      nowAppReady: '',
      nowApp: '',
      nowAppId: '',
      pagination: {},
      current: '', // 当前页码
      confirmLoading: false, // 提交modal加载
      addResourceIdList: [], // 绑定的资源id列表
      removeResourceIdList: [], // 解绑的资源id列表
      selectedList: [], // 已选列表
      oldSelectedRowKeys: [] // 老的已绑定的数组，用于比较
    };
  }

  componentDidMount() {
    this.reset();
    let form = this.state.searchForm;
    form.appId = this.props.appId;
    form.userId = this.props.userId;
    this.setState({
      searchForm: form,
      nowAppId: this.props.appId
    });

    this.props
      .dispatch({
        type: 'dataResource/getQueryList',
        payload: { appId: this.props.appId, userId: this.props.userId }
      })
      .then(res => {
        console.log('获取已选列表', res);
        this.setState({
          selectedList: res
        });
      });

    this.props
      .dispatch({
        type: 'dataResource/getQueryList',
        payload: { ...this.state.searchForm }
      })
      .then(res => {
        this.setState({
          queryList: res,
          dataSource: this.getDataSource(res.records),
          total: res.total
        });
      });
    this.props
      .dispatch({
        type: 'dataResource/getDataType',
        payload: { appId: this.props.appId }
      })
      .then(res => {
        this.setState({
          dataType: res
        });
      });

    // 资源数据系统
    this.props
      .dispatch({
        type: 'dataResource/getBusiness'
      })
      .then(res => {
        this.setState({
          businessList: res
        });
      });

    this.getBindSelect(this.props.userId, this.props.appId);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.reset();

    let form = this.state.searchForm;
    form.appId = nextProps.appId;
    form.userId = nextProps.userId;
    this.setState({
      searchForm: form,
      nowAppId: nextProps.appId
    });

    this.props
      .dispatch({
        type: 'dataResource/getQueryList',
        payload: { ...this.state.searchForm }
      })
      .then(res => {
        this.setState({
          queryList: res,
          dataSource: this.getDataSource(res.records),
          total: res.total
        });
      });

    this.props
      .dispatch({
        type: 'dataResource/getDataType',
        payload: { appId: nextProps.appId }
      })
      .then(res => {
        this.setState({
          dataType: res
        });
      });

    // 资源数据系统
    this.props
      .dispatch({
        type: 'dataResource/getBusiness'
      })
      .then(res => {
        this.setState({
          businessList: res
        });
      });
    this.getBindSelect(nextProps.userId, nextProps.appId);
  }

  getDataSource = data => {
    let dataSource = data.map((item, index) => {
      return {
        key: item.id,
        appName: item.properties.map(item => {
          // 项目
          return item.attrName == 'projectName' ? item.attrValue : '';
        }),
        system: this.state.nowApp, // 系统
        dataID: item.resourceKey, // 数据资源ID
        dataName: item.resourceName, // 数据资源名称
        dataType: item.resourceTypeName, // 数据类型
        riskLevel: item.properties.map(item => {
          // 数据敏感级
          return item.attrName == 'riskLevel'
            ? item.attrValue
              ? `C${item.attrValue}`
              : ''
            : '';
        }),
        dataOwner: item.properties.map(item => {
          // 数据所有人
          return item.attrName == 'creator' ? item.attrValue : '';
        }),
        businessName: item.businessName, // 业务线
        remark: '', // 备注
        handle: '' // 操作
      };
    });
    console.log(dataSource);
    return dataSource;
  };

  getQueryList = formData => {
    this.props
      .dispatch({
        type: 'dataResource/getQueryList',
        payload: { ...formData }
      })
      .then(res => {
        this.setState({
          queryList: res,
          dataSource: this.getDataSource(res.records),
          total: res.total,
          current: res.current
        });
      });
  };

  // 选择敏感级
  leaveChange = value => {
    let form = this.state.searchForm;
    form.riskLevelList = value;
    this.setState({
      searchForm: form
    });
    console.log(this.state.searchForm);
  };

  // 选择已绑定未绑定
  bindChange = value => {
    console.log('已选1，未选0', value);
    // 当前系统
    if (value == '1') {
      let form = this.state.searchForm;
      form.selected = true;
      this.setState({
        searchForm: form
      });
    } else if (value == '0') {
      let form = this.state.searchForm;
      form.selected = false;
      this.setState({
        searchForm: form
      });
    }
  };

  // 选择项目
  attrValuesChange = value => {
    let form = this.state.searchForm;
    form.projectNameList = value;
    this.setState({
      searchForm: form
    });
  };

  // 选择数据类型
  dataTypeChange = value => {
    let form = this.state.searchForm;
    form.resourceTypeIdList = value;
    this.setState({
      searchForm: form
    });
    // console.log('数据类型的value',value);
  };

  // 选择业务线
  businessChange = value => {
    let form = this.state.searchForm;
    form.businessIdList = value;
    this.setState({
      searchForm: form
    });
  };

  // 搜索框
  searchChange = e => {
    let form = this.state.searchForm;
    form.fuzzySearch = e.target.value;
    this.setState({
      searchForm: form
    });
  };

  // 页码变化时
  onShowSizeChange = (current, size) => {
    // current 当前所在页
    // size 每页多少
    let form = this.state.searchForm;
    form.size = size;
    form.page = current;
    if (!form.appId) {
      form.appId = this.state.nowAppId;
    }
    this.setState({
      searchForm: form
    });
    this.getQueryList(this.state.searchForm);
  };

  // 翻页
  paginationChange = (page, pageSize) => {
    let form = this.state.searchForm;
    form.size = pageSize;
    form.page = page;
    this.setState({
      searchForm: form
    });
    this.getQueryList(this.state.searchForm);
  };

  // 查询逻辑
  search = () => {
    // 查询系统
    if (this.props.appId) {
      console.log(this.props.appId);
      console.log(this.state.searchForm.appId);
      let form = this.state.searchForm;
      form.size = form.size || 10;
      form.page = 0;
      form.appId = this.props.appId;
      this.setState({
        nowApp: this.state.nowAppReady,
        searchForm: form
      });
      this.getQueryList(this.state.searchForm);
    } else {
      let form = this.state.searchForm;
      form.appId = this.state.nowAppId;
      this.setState({
        searchForm: form
      });
      this.getQueryList(this.state.searchForm);
      form.appId = '';
      this.setState({
        searchForm: form
      });
    }
    this.getBindSelect(this.props.userId, this.props.appId);
    this.emptySelected();
  };

  // 清空form
  handleReset = () => {
    this.refs.child.resetFields();
    let form = this.state.searchForm;
    form.riskLevelList = '';
    form.projectNameList = '';
    form.resourceTypeIdList = '';
    form.businessIdList = '';
    form.fuzzySearch = '';
    form.selected = '';
    this.setState({
      searchForm: form
    });
  };

  // 清空选项
  emptySelected = () => {
    this.setState({
      selectedRowKeys: []
    });
  };

  // Modal确定时的毁回调
  handleModalOk = () => {
    const { appId, userName } = this.props;
    const { removeResourceIdList, addResourceIdList } = this.state;
    this.setState({
      confirmLoading: true
    });
    // 请求后的回调
    // console.log(userName);
    if (removeResourceIdList.length !== 0 || addResourceIdList.length !== 0) {
      this.props
        .dispatch({
          type: 'dataResource/relation',
          payload: {
            appId,
            userNames: userName,
            addResourceIdList,
            removeResourceIdList
          }
        })
        .then(res => {
          this.props.handleOk();
          this.setState({
            confirmLoading: false
          });
          this.reset();
          this.handleReset();
        });
    } else {
      this.props.handleOk();
      this.setState({
        confirmLoading: false
      });
      this.reset();
      this.handleReset();
    }
  };

  // Modal取消时的毁回调
  handleModalCancel = () => {
    // console.log(this.props.visible);
    // this.props.visible = false
    this.props.handleCancel();
    this.reset();
    this.handleReset();
  };

  // 获取当前角色已绑定项
  getBindSelect = (userId, appId) => {
    this.props
      .dispatch({
        type: 'dataResource/getUserResource',
        payload: { userId, appId }
      })
      .then(res => {
        if (res) {
          let mapList = this.state.selectedRowKeys;
          res.map(item => {
            mapList.push(item.id);
          });
          this.setState({
            selectedRowKeys: mapList,
            oldSelectedRowKeys: mapList
          });
        }
      });
  };

  // 清空已绑解绑，rowkey，old等
  reset = () => {
    let form = this.state.searchForm;
    form.page = 0;
    form.size = 10;
    this.setState({
      oldSelectedRowKeys: [],
      addResourceIdList: [], // 绑定的资源id列表
      removeResourceIdList: [], // 解绑的资源id列表
      selectedRowKeys: [],
      searchForm: form,
      current: ''
    });
  };

  render() {
    const { t, visible, style } = this.props;
    const {
      selectedRowKeys,
      current,
      total,
      searchForm,
      confirmLoading,
      oldSelectedRowKeys,
      addResourceIdList,
      removeResourceIdList
    } = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          'selectedRows: ',
          selectedRows
        );
        this.setState({
          selectedRowKeys
        });
      },
      getCheckboxProps: record => ({
        name: record.name
      }),
      selectedRowKeys,
      onSelect: (record, selected, selectedRows) => {
        // 单选，选中反选的回调
        console.log(
          '这些是record',
          record,
          'true选中,false反选',
          selected,
          selectedRows
        );
        if (selected) {
          // 单选选中的逻辑
          let index = oldSelectedRowKeys.indexOf(record.key);
          if (index !== -1) {
            removeResourceIdList.splice(
              removeResourceIdList.indexOf(record.key),
              1
            );
          } else {
            addResourceIdList.push(record.key);
          }
        } else {
          // 单选反选的逻辑
          let index = oldSelectedRowKeys.indexOf(record.key);
          if (index !== -1) {
            removeResourceIdList.push(record.key);
          } else {
            addResourceIdList.splice(addResourceIdList.indexOf(record.key), 1);
          }
        }
        console.log(
          '新选中的',
          addResourceIdList,
          '新反选的',
          removeResourceIdList
        );
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        // 全选、全反选时的回调
        console.log(
          '全选和反选时的回调',
          selected,
          'selectedRows',
          selectedRows,
          'changeRows',
          changeRows
        );
        if (selected) {
          changeRows.map(item => {
            let index = oldSelectedRowKeys.indexOf(item.key);
            if (index !== -1) {
              removeResourceIdList.splice(
                removeResourceIdList.indexOf(item.key),
                1
              );
            } else {
              addResourceIdList.push(item.key);
            }
          });
        } else {
          changeRows.map(item => {
            let index = oldSelectedRowKeys.indexOf(item.key);
            if (index !== -1) {
              removeResourceIdList.push(item.key);
            } else {
              addResourceIdList.splice(addResourceIdList.indexOf(item.key), 1);
            }
          });
        }
        console.log(
          '新选中的',
          addResourceIdList,
          '新反选的',
          removeResourceIdList
        );
      },
      onSelectInvert: selectedRows => {
        // 手动反选
        console.log('手动反选', selectedRows);
      }
    };
    // console.log(this.props);
    return (
      <Modal
        title="数据资源"
        visible={visible}
        destroyOnClose={true}
        afterClose={() => {
          console.log('完全关闭');
        }}
        style={{
          top: '40px',
          ...style
        }}
        onOk={this.handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleModalCancel}
        width="960px">
        <DataRescourceSearchForm
          t={t}
          data={this.state}
          leaveChange={this.leaveChange}
          bindChange={this.bindChange}
          attrValuesChange={this.attrValuesChange}
          dataTypeChange={this.dataTypeChange}
          businessChange={this.businessChange}
          searchChange={this.searchChange}
          search={this.search}
          handleReset={this.handleReset}
          ref="child"
        />

        <Table
          pagination={{
            current: current,
            defaultCurrent: 1,
            total: total,
            showTotal: total => `共${total}条`,
            pageSize: searchForm.size,
            pageSizeOptions: ['10', '20', '30', '50', '100'],
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: this.paginationChange,
            onShowSizeChange: this.onShowSizeChange
          }}
          rowSelection={rowSelection}
          columns={this.state.columns}
          dataSource={this.state.dataSource}
          onChange={this.tabChange}
        />
      </Modal>
    );
  }
}

export default connect(({ dataResource, account, global }) => {
  return {
    dataResource: dataResource,
    account: account.account,
    appId: global.managingApp
  };
})(DataModal);
