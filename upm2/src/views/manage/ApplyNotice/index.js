import React, { Component } from 'react';
import {
  Button, Form, Input, Card,
  Modal, Table,
  Col, Row, message
} from 'antd';
import moment from 'moment';
import connect from '@utils/translateConnect';
// import SystemList from '@components/SystemList';
import AvailableApps from '@components/AvailableApps/index';
import {
  searchAllNotice,
  delNotice,
} from '@services/applyNotice';

import './index.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class ApplyNotice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      current: 1, // 当前页数
      total: 0, // 数据总数
      // defAppId: 0,  // 默认选中的目标系统 id
    };

    this.pageSize = 10; // 每页条数
  }
  getColumns = () => {
    const { t } = this.props;

    let columns = [
      {
        title: t('ID'),
        dataIndex: 'id',
        key: 'id',
        width: 60
      },
      {
        title: t('目标系统'),
        dataIndex: 'appName',
        key: 'appName',
        width: 200
      },
      {
        title: t('配置名'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('修改时间'),
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (val) => (
          <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>
        ),
      },
      {
        title: t('操作人'),
        dataIndex: 'user',
        key: 'user',
      },
      {
        title: t('默认配置'),
        dataIndex: 'default',
        key: 'default',
        render: (val) => {
          let text = val ? t('是') : t('否');
          return (
            <span>{text}</span>
          );
        }
      },
      {
        title: t('操作'),
        key: 'action',
        width: 300,
        render: (text, record) => {
          let delBtn = (
            <Button
              type="danger"
              size="small"
              className="btn"
              onClick={() => this.delConfig(record)}
            >
              {t('删除')}
            </Button>
          );

          // 默认配置无法删除
          if (record.default) {
            delBtn = null;
          }
          return (
            <span>
              <Button
                size="small"
                className="btn"
                onClick={() => this.editConfig(record)}
              >
                {t('编辑')}
              </Button>
              {delBtn}
            </span>
          );
        }
      }
    ];

    return columns;
  }
  searchConfig = (e) => {
    const { form } = this.props;
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);

        this.fetchNoticeList();

      } else {
        // alert('error');
      }
    });
  }
  // 新增配置
  addConfig = () => {
    const { history, match } = this.props;
    let thisUrl = match.url.replace(/\/notice/, '/new-notice');
    history.push(thisUrl);
  }
  // 编辑配置
  editConfig = (rowData) => {
    const { history, match } = this.props;
    // console.log('rowData', rowData);

    let thisUrl = match.url.replace(/\/notice/, '/edit-notice');
    history.push(thisUrl, {
      configData: rowData, // 通过 router 传递编辑的配置数据
    });
  }
  delConfig = (rowData) => {
    const { t, appId } = this.props;

    confirm({
      title: t('确定删除?'),
      content: t('确定删除此记录?'),
      okText: t('确定'),
      okType: 'primary',
      cancelText: t('取消'),
      onOk: () => {
        delNotice({
          appId,
          configId: rowData.id
        }).then(() => {
          message.success(t('删除成功'));
          this.fetchNoticeList();

        }).catch((err) => {
          console.log('delNotice err', err);
        });

      }
    });
  }
  fetchNoticeList = ({ page = 1 } = {}) => {
    const { appId, form } = this.props;
    // let appIdRel = this.state.defAppId || appId;
    let appIdRel = appId;

    let configName = form.getFieldValue('configName') || '';
    searchAllNotice({
      appId,
      appIdRel,
      configName,
      page,
      size: this.pageSize,
    }).then((result) => {
      const { records, total, current } = result;

      this.setState({
        dataSource: records,
        current,
        total
      });

    }).catch((err) => {
      console.log('searchAllNotice err', err);

      if (err.message) {
        message.error(err.message);
      }
    });
  }
  onPageChange = (page) => {
    this.fetchNoticeList({ page });
  }
  // onSystemChange = (appId) => {
  //   // console.log('onSystemChange', appId);

  //   this.setState({
  //     defAppId: appId
  //   });
  // }
  componentDidMount () {
    // 等待 appId 获取
    setTimeout(() => {
      // this.setState({
      //   defAppId: this.props.appId
      // });

      this.fetchNoticeList();
    }, 800);
  }
  render () {
    const { t, form } = this.props;
    const { getFieldDecorator } = form;
    const {
      dataSource,
      current,
      total,
      // defAppId,
    } = this.state;

    return (
      <div className="apply-notice-config">
        <Card title={t('申请页管理')} bordered={false}>
          <Form layout="inline" onSubmit={this.searchConfig}>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label={t('目标系统')}>
                  {/* <SystemList t={t} value={defAppId} allowClear={false} onChange={this.onSystemChange}/> */}
                  <AvailableApps />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={t('配置名称')}>
                  {getFieldDecorator('configName')(
                    <Input
                      placeholder={t('请输入关键字')}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="">
                  <Button
                    type="primary"
                    htmlType="submit">
                    {t('查询')}
                  </Button>
                  <Button
                    className="btn"
                    onClick={this.addConfig}>
                    {t('新增')}
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>

          <Row>
            <Table
              rowKey="id"
              className="config-list"
              columns={this.getColumns()}
              dataSource={dataSource}
              size="small"
              pagination={{
                current,
                pageSize: this.pageSize,
                hideOnSinglePage: true,
                total,
                onChange: this.onPageChange
              }}
            />
          </Row>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { global } = state;

  return {
    appId: global.managingApp,
  };
};

export default connect(
  mapStateToProps,
)(Form.create()(ApplyNotice));