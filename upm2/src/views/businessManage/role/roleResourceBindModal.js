import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Form, Input, Button, Modal, Table, Tag} from 'antd';
import { echoMessage } from '@utils/notice';
const FormItem = Form.Item;

/**
 * 角色资源绑定|解绑弹窗
 * 用于报表、模板、指标
 * @param {*} props
 */
class RoleResourceBind extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: {
        records: [],
        current: 1,
        size: 5,
        total: 0,
        loading: false
      },
      selectedRows: [],
      loading: false
    }
  }
  componentDidMount = () => {
    this.fetchData();
  }
  /**
  * 点击确认按钮
  */
  handleOk = () => {
    const {operateHandle, operateName, successHandle, t, role, resourceName} = this.props;
    const {selectedRows} = this.state;
    if (!selectedRows.length) {
      echoMessage(t(`至少选择一项进行${operateName}操作！`), 'error');
      return;
    }
    this.setState({
      loading: true
    });
    operateHandle({
      appId: role.appId,
      roleIdList: [role.id],
      resourceIdList: selectedRows.map(item => item.id)
    }).then(() => {
      this.setState({
        loading: false
      });
      echoMessage(t(`${resourceName}${operateName}成功！`), 'success');
      successHandle();
    }, () => {
      this.setState({
        loading: false
      });
    })
  };

  /**
   * 点击关闭按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
  }

  deleteSelectdRows = (item) => {
    let {selectedRows} = this.state;
    if (_.isArray(item)) {
      item.forEach(item => {
        _.remove(selectedRows, (i) => item.id === i.id);
      });
    } else {
      _.remove(selectedRows, (i) => item.id === i.id);
    }
    this.setState({
      selectedRows: [
        ...selectedRows
      ]
    });
  }

  fetchData = (page) => {
    const {role, form, fetchData} = this.props;
    const {current, size}= this.state.list;
    const search = form.getFieldsValue();
    page = page || current;
    this.setState({
      list: {
        ...this.state.list,
        loading: true
      }
    });
    fetchData({
      businessId: role.businessId,
      targetId: role.id,
      appId: role.appId,
      page,
      size,
      ...search
    }).then((data) => {
      this.setState({
        list: {
          ...this.state.list,
          loading: false,
          records: data.records,
          current: page,
          total: data.total
        }
      })
    }, () => {
      this.setState({
        list: {
          ...this.state.list,
          loading: false
        }
      });
    });
  }

  handleTableChange = (pagination) => {
    this.fetchData(pagination.current);
  }

  showTagName(item) {
    return item.resourceName;
  }

  render = () => {
    const {t, form, searchConfig, tableColumns, resourceName, operateName, role, showTagName = this.showTagName} = this.props;
    const {selectedRows, list: {records, current, size, total, loading}} = this.state;
    const {getFieldDecorator} = form;
    const rowSelection = {
      selectedRowKeys: selectedRows.map((item) => _.findIndex(records, function(o) { return o.id === item.id; })),
      onChange: (selectedRowKeys, selectedRows) => { 
        if (selectedRows.length) {
          let validSelectedRows =  _.filter(selectedRows, (item) => {
            return _.findIndex(this.state.selectedRows, i => i.id === item.id) === -1; 
          });
          this.setState({
            selectedRows: [
              ...this.state.selectedRows,
              ...validSelectedRows
            ]
          })
        } else {
          this.deleteSelectdRows(records);
        }
      },
      onSelect: (record, selected, selectedRows) => {
        if (!selected) {
          this.deleteSelectdRows(record);
        }
      }
    };
    return (
      <Modal
        title={t(`{{roleName}}-${operateName}${resourceName}`, {roleName: role.nameZh})}
        style={this.props.style}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose={true}
        width={650}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {t('取消')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.state.loading}
            onClick={this.handleOk}
          >
            {t(`${operateName}${resourceName}`)}
            </Button>
        ]}
      >
        <Form layout="inline">
          {searchConfig.map(item => (
            <FormItem key={item.key} label={t(item.label)}>
              {getFieldDecorator(item.key, {
                initialValue: ''
              })(item.formItem || <Input placeholder={item.placeholder || ''} />)}
            </FormItem>
          ))}
          <FormItem>
              <Button
                  type="primary"
                  icon="search"
                  onClick={() => {this.fetchData()}}
              >
                  {t('搜索')}
              </Button>
          </FormItem>
        </Form>
        <Table size="small" columns={tableColumns} rowSelection={rowSelection} loading={loading} pagination={{current, total, pageSize: size}} onChange={this.handleTableChange} dataSource={records}>
        </Table>

        <div className="selected-wrap">
           <label>{t('已选：')}</label> 
          {selectedRows.map(item => (<Tag key={item.id} closable onClose={() => {this.deleteSelectdRows(item)}}>{showTagName(item)}</Tag>))}
        </div>
      </Modal>
    );
  }
}

const RoleResourceBindModal = Form.create({})(RoleResourceBind);

export default connect((global) => {
  return {
  };
})(RoleResourceBindModal);