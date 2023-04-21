import React from 'react';
import connect from '@utils/translateConnect';
import { Form, Card, Row, Col, Button, Table, Modal, Input, message, Popconfirm } from 'antd';
import TextButton from '../../../components/TextButton';
import { routerRedux } from 'dva/router';
import { MANAGE } from '@routes/config';
import './index.less'

const FormItem = Form.Item;
const { Column } = Table;
const { TextArea } = Input;
const APPID = 888;
const pageSize = 20;

class PermissionGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      modalName: '',
      modalDesc: '',
      current: 1,
      modalRecord: ''
    }
  }

  componentWillMount = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'permissionGroup/fetchPermissionGroupList',
      payload: {
        page: 1,
        appId: APPID
      }
    })
  }

  addPermission = () => {
    const { dispatch } = this.props
    const { modalName: name, modalDesc: description, modalRecord } = this.state
    const payload = {
      name,
      description,
      appId: APPID
    }
    let type = '',  msg = ''

    if (this.state.modalName === '') {
      message.error('名称不允许为空')
      return
    }

    if (modalRecord !== '') {
      payload.groupId = modalRecord.id
      type = 'permissionGroup/modifyPermissionGroup'
      msg = '修改成功'
    } else {
      type = 'permissionGroup/addNewPermissionGroup'
      msg = '添加成功'
    }

    dispatch({
      type,
      payload
    })
    .then(() => {
      message.info(msg)
      this.onCancel(() => {
        dispatch({
          type: 'permissionGroup/fetchPermissionGroupList',
          payload: {
            page: this.state.current,
            appId: APPID
          }
        })
      })
    })
  }

  onCancel = (fn = function(){}) => {
    this.setState({
      modalVisible: false,
      modalName: '',
      modalDesc: '',
      modalRecord: ''
    }, fn)
  }

  handlePageChange = (page) => {
    const { dispatch } = this.props
    
    dispatch({
      type: 'permissionGroup/fetchPermissionGroupList',
      payload: {
        page,
        appId: APPID
      }
    })
    .then(() => {
      this.setState({
        current: page
      })
    })
  }

  removeGroup = (record) => {
    const { dispatch } = this.props
    
    dispatch({
      type: 'permissionGroup/removePermissionGroup',
      payload: {
        groupId: record.id,
        appId: APPID
      }
    })
    .then(() => {
      dispatch({
        type: 'permissionGroup/fetchPermissionGroupList',
        payload: {
          page: this.state.current,
          appId: APPID
        }
      })
    })
  }

  getActions =(text, record) => {
    const { t, dispatch } = this.props
    return (
      <div>
        <TextButton
          onClick={() => {
            dispatch(routerRedux.push(`${MANAGE}/permissionGroup/point?id=${record.id}`))
          }}
        >{t('权限管理')}</TextButton>
        <TextButton
          onClick={() => {
            dispatch(routerRedux.push(`${MANAGE}/permissionGroup/user?id=${record.id}`))
          }}
        >{t('人员管理')}</TextButton>
        <TextButton
          onClick={() => this.setState({
            modalVisible: true,
            modalName: record.name,
            modalDesc: record.description,
            modalRecord: record
          })}
        >{t('修改')}</TextButton>
        <Popconfirm
          placement="top"
          title={t('确定删除？')}
          onConfirm={() => this.removeGroup(record)}
          okText={t('确定')}
          cancelText={t('取消')}>
          <TextButton>{t('删除')}</TextButton>
        </Popconfirm>
      </div>
    )
  }

  render () {
    const { t, permissionGroupList } = this.props
    const {
      records=[], total, loading
    } = permissionGroupList
    const { current, modalName } = this.state

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    return (
      <div className="ManagePermissionGroup">
        <Card title={t('权限组管理')} bordered={false}>
          <Row gutter={24} className="search-fields">
            <Col span={3}>
              <FormItem>
                <Button type="primary" onClick={() => this.setState({modalVisible: true })}>{t('新增权限组')}</Button>
              </FormItem>
            </Col>
          </Row>
          <Table
            dataSource={records}
            size="small"
            pagination={{
              current,
              pageSize,
              hideOnSinglePage: true,
              total,
              onChange: this.handlePageChange
            }}
            rowKey="id"
            loading={loading}
          >
            <Column title={t('权限组名称')} dataIndex="name" key="name" />
            <Column title={t('权限组描述')} dataIndex="description" key="description" />
            <Column
              width={250}
              title={t('操作')} dataIndex="operate" key="operate"
              render={this.getActions}/>
          </Table>
        </Card>

        <Modal
          title={modalName ? t('修改权限组') : t('新增权限组')}
          visible={this.state.modalVisible}
          onOk={this.addPermission}
          onCancel={() => this.onCancel()}
          destroyOnClose={true}
          footer={[
            <Button key="back" onClick={() => this.onCancel()}>
              {t('取消')}
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.addPermission}
            >确定</Button>
          ]}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label={t('权限组名称')}>
              <Input
                value={this.state.modalName}
                onChange={(e) => {
                this.setState({
                  modalName: e.target.value
                })
              }}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={t('描述')}>
              <TextArea
                value={this.state.modalDesc}
                rows={4} 
                onChange={(e) => {
                this.setState({
                  modalDesc: e.target.value
                })
              }}/>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

// export default PermissionGroup;
export default connect(({ permissionGroup }) => {
  return {
    permissionGroupList: permissionGroup.permissionGroupList
  };
})(PermissionGroup);
