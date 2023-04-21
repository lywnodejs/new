import React from 'react';
import _ from 'lodash';
import connect from '@utils/translateConnect';
import { Form, Input, Button, Modal, Table, Tag} from 'antd';
import { echoMessage } from '@utils/notice';
import UserSelect from '@components/UserSelector';
const FormItem = Form.Item;

/**
 * 用户资源绑定|解绑弹窗
 * 用于角色、报表、模板、指标
 * @param {*} props
 */
class UserResourceBind extends React.Component {
  constructor(props) {
    super(props);
    const {user} = props;
    this.state = {
      list: {
        records: [],
        current: 1,
        size: 5,
        total: 0,
        loading: false
      },
      user: {},
      selectedRows: [],
      loading: false
    };
    if (_.isArray(user)) {
      this.isBatch = true;
    }
    if (!this.isBatch & !user.id) {
      this.isCreate = true;
    }
  }
  componentDidMount = () => {
    this.fetchData();
  }
  /**
  * 点击确认按钮
  */
  handleOk = () => {
    const {operateHandle, operateName, successHandle, t, user, resourceName} = this.props;
    const {selectedRows} = this.state;
    const batchText = this.isBatch? t('批量'): '';
    if (this.isCreate && !this.state.user.id) {
      echoMessage(t('请先选择新增用户！'), 'error');
      return;
    }
    if (!selectedRows.length) {
      echoMessage(t(`至少选择一项进行${batchText}${operateName}操作！`), 'error');
      return;
    }
    this.setState({
      loading: true
    });
    operateHandle({
      userIdList: this.isBatch? user.map(item => item.id): (this.isCreate? [this.state.user.id]: [user.id]),
      resourceIdList: selectedRows.map(item => item.id)
    }).then(() => {
      this.setState({
        loading: false
      });
      echoMessage(t(`${batchText}${resourceName}${operateName}成功！`), 'success');
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
    const {user, form, fetchData, appId} = this.props;
    const {current, size}= this.state.list;
    const search = _.pickBy(form.getFieldsValue());
    page = page || current;
    this.setState({
      list: {
        ...this.state.list,
        loading: true
      }
    });
    fetchData({
      userId: this.isBatch? '' : (user.id || ''),
      appId: appId,
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
  userChange = (value, option, user) => {
    this.setState({
      user: user || {}
    });
  }
  render = () => {
    const {t, form, searchConfig, tableColumns, resourceName, operateName, user, showTagName=this.showTagName} = this.props;
    const {selectedRows, list: {records, current, size, total, loading}} = this.state;
    const {getFieldDecorator} = form;
    const batchText = this.isBatch? t('批量'): '';
    const {usernameZh='', dept=''} = this.state.user;
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
        title={t(`{{userName}}-${operateName}${resourceName}`, {userName: this.isBatch? t('批量'): (this.isCreate? t('新增'):user.username)})}
        style={this.props.style}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose={true}
        width={800}
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
            {t(`${batchText}${operateName}${resourceName}`)}
            </Button>
        ]}
      >
        {this.isCreate? (<div style={{marginBottom: 5}}>
          <label>{t('绑定用户：')}</label>
          <UserSelect onChange={this.userChange} style={{width: 200}} selectType="single" />
          {usernameZh? <span style={{marginLeft: 10}}>描述：{`${usernameZh}(${dept})`}</span>: ''}
        </div>): ''}
        {this.isBatch? (<div style={{marginBottom: 5}}>
          <label>{t('绑定用户：')}</label>
          {user.map(item => item.username).join(',')}
        </div>): ''}
        <Form style={{marginBottom: 5}} layout="inline">
          {searchConfig.map(item => (
            <FormItem key={item.key} label={t(item.label)} >
              {getFieldDecorator(item.key, {
                initialValue: ''
              })(item.formItem || <Input style={{ width: 150 }} placeholder={item.placeholder || ''} />)}
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
        <Table style={{marginBottom: 5}} size="small" columns={tableColumns} rowSelection={rowSelection} loading={loading} pagination={{current, total, pageSize: size}} onChange={this.handleTableChange} dataSource={records}>
        </Table>

        <div className="selected-wrap">
           <label>{t('已选：')}</label> 
          {selectedRows.map(item => (<Tag key={item.id} closable onClose={() => {this.deleteSelectdRows(item)}}>{showTagName(item)}</Tag>))}
        </div>
      </Modal>
    );
  }
}

const UserResourceBindModal = Form.create({})(UserResourceBind);

export default connect(({global}) => {
    return {
      // appId: global.globalAppId
    };
})(UserResourceBindModal);