import React from 'react';
import connect from '@utils/translateConnect';
import { Form, Card, Row, Col, Button, Table, Modal, Input, message, Popconfirm } from 'antd';
import TextButton from '../../../components/TextButton';
import { routerRedux } from 'dva/router';
import { MANAGE } from '@routes/config';

const FormItem = Form.Item;
const { Column } = Table;
const { TextArea } = Input;
const APPID = 888;

class PermissionGroupUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      modalValue: '',
      selectedRows: [],
      modalUnbindVisible: false,
      searchContent: '',
      title: ''
    };
  }

  componentWillMount = () => {
    const { dispatch } = this.props
    const groupId = this.getPermissionGroupID()
    const name = this.getGroupName(groupId)
    this.setState({
      title: name.length ? name[0].name : ''
    })

    dispatch({
      type: 'permissionGroup/fetchGroup2User',
      payload: {
        groupId,
        appId: APPID
      }
    })
  }

  getPermissionGroupID = () => {
    const query = {}
    location.search === '' ? null : location.search.split('?')[1].split('&').forEach(i => query[i.split('=')[0]] = i.split('=')[1])
    return Number(query.id)
  }

  getGroupName = (id) => {
    const { permissionGroupList } = this.props;
    const {
      records=[]
    } = permissionGroupList
    return records.filter(i => i.id === id)
  }

  onCancel = () => {
    this.setState({
      modalVisible: false,
      modalValue: '',
      modalUnbindVisible: false
    })
  }

  onOk = (bindType) => {
    const { dispatch } = this.props;
    const privilegeGroupId = this.getPermissionGroupID();
    const payload = {
      appId: APPID,
      privilegeGroupId
    }
    let type = ''
    let msg = ''

    if (bindType === 'bind') {
      if (this.state.modalValue === '') {
        message.error('请输入用户的账号')
        return
      }
      // 逗号，空格，换行均可
      payload.usernames = this.state.modalValue.trim().replace(/[,\n\s，]+/g, ',')
      type = 'permissionGroup/bindUsers'
      msg = '关联成功'
    } else {
      payload.usernames = this.state.selectedRows.map(i => i.username).join()
      type = 'permissionGroup/unBindUsers'
      msg = '取消关联成功'
    }

    dispatch({
      type,
      payload
    })
    .then(() => {
      message.info(msg)
      const { selectedRows } = this.state
      this.setState({
        modalVisible: false,
        modalValue: '',
        modalUnbindVisible: false,
        selectedRows: bindType === 'bind' ? selectedRows : []
      })
      dispatch({
        type: 'permissionGroup/fetchGroup2User',
        payload: {
          groupId: privilegeGroupId,
          appId: APPID
        }
      })
    })
  }

  search = () => {
    const { dispatch } = this.props;
    const { searchContent } = this.state
    dispatch({
      type: 'permissionGroup/search',
      payload: {
        searchContent
      }
    })
  }

  removeUser = (record) => {
    const { dispatch } = this.props
    const privilegeGroupId = this.getPermissionGroupID()
    dispatch({
      type: 'permissionGroup/unBindUsers',
      payload: {
        appId: APPID,
        privilegeGroupId,
        usernames: record.username
      }
    })
    .then(() => {
      dispatch({
        type: 'permissionGroup/fetchGroup2User',
        payload: {
          groupId: privilegeGroupId,
          appId: APPID
        }
      })
      // 把当前选中项从selectRows里面移除
      const { selectedRows } = this.state
      const index = selectedRows.findIndex(i => i.id === record.id)
      if (index > -1) {
        selectedRows.splice(index, 1)
        // 其实这一步不需要，因为state里面的数组是引用类型，为了统一逻辑，加一步setState
        this.setState({
          selectedRows
        })
      }
    })
  }

  getActions =(text, record) => {
    const { t, dispatch } = this.props
    return (
      <div>
        <Popconfirm
          placement="top"
          title={t('确定删除？')}
          onConfirm={() => this.removeUser(record)}
          okText={t('确定')}
          cancelText={t('取消')}>
          <TextButton>{t('删除')}</TextButton>
        </Popconfirm>
      </div>
    )
  }

  returnList = () => {
    const { dispatch } = this.props

    dispatch(routerRedux.push(`${MANAGE}/permissionGroup/list`))
  }

  render () {
    const { t, userList = {}, showUserList = [] } = this.props
    const records = showUserList
    const loading = userList.loading

    const { title, selectedRows: selectedRowsState } = this.state

    const userRowSelection = {
      onChange: (selected, selectedRows) => {
        this.setState({
          selectedRows
        })
      },
      selectedRowKeys: selectedRowsState && selectedRowsState.length ? selectedRowsState.map(i => i.id) : []
    };

    return (
      <div className="ManagePermissionGroupUser">
        <Card title={`人员管理(权限组：${title})`} bordered={false} extra={<Button onClick={this.returnList}>{('返回列表')}</Button>}>
          <Row gutter={24} className="search-fields">
            <Col span={7}>
              <FormItem label={t('用户名')}>
                <Input onChange={(e) => {
                  this.setState({
                    searchContent: e.target.value
                  })
                }}/>
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                <Button onClick={this.search}>{t('查询')}</Button>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={3}>
              <FormItem>
                <Button type="primary" onClick={()=>{
                  this.setState({
                    modalVisible: true
                  })
                }}>{t('添加人员')}</Button>
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                <Button type="primary"  onClick={()=>{
                  if (!this.state.selectedRows.length) {
                    message.error('请选择至少一个用户')
                    return
                  }
                  this.setState({
                    modalUnbindVisible: true
                  })
                }}>{t('批量删除')}</Button>
              </FormItem>
            </Col>
          </Row>
          <Table
            rowSelection={userRowSelection}
            dataSource={records}
            size="small"
            pagination={{
              hideOnSinglePage: true,
            }}
            className="upm-table"
            rowKey="id"
            loading={loading}
          >
            <Column title={t('账号')} dataIndex="username" key="username" />
            <Column title={t('姓名')} dataIndex="zh" key="zh" />
            <Column title={t('部门')} dataIndex="dept" key="dept" />
            <Column title={t('岗位')} dataIndex="job" key="job" />
            <Column
              title={t('操作')} dataIndex="operate" key="operate"
              render={this.getActions}/>
          </Table>
        </Card>

        <Modal
          title={t('添加人员')}
          visible={this.state.modalVisible}
          onOk={() => this.onOk('bind')}
          onCancel={this.onCancel}
          destroyOnClose={true}
          footer={[
            <Button key="back" onClick={this.onCancel}>
              {t('取消')}
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => this.onOk('bind')}
            >{t('确定')}</Button>
          ]}
        >
          <TextArea
            rows={4}
            placeholder='输入多个账号，用逗号，空格，换行分割均可'
            onChange={(e) => {
            this.setState({
              modalValue: e.target.value
            })
          }}/>
        </Modal>

        <Modal
          title={t('确认删除以下用户？')}
          visible={this.state.modalUnbindVisible}
          onClick={() => this.onOk('unBind')}
          onCancel={this.onCancel}
          destroyOnClose={true}
          footer={[
            <Button key="back" onClick={this.onCancel}>
              {t('取消')}
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => this.onOk('unBind')}
            >确定</Button>
          ]}
        >
          {this.state.selectedRows.map(i => `${i.zh}(${i.username})`).join()}
        </Modal>
      </div>
    );
  }
}

// export default PermissionGroupUser;
export default connect(({ permissionGroup }) => {
  return {
    userList: permissionGroup.userList,
    showUserList: permissionGroup.showUserList,
    permissionGroupList: permissionGroup.permissionGroupList
  };
})(PermissionGroupUser);
