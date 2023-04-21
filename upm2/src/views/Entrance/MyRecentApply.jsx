import React from 'react';
import { routerRedux } from 'dva/router';
import { Table, Divider, Popconfirm } from 'antd';
const { Column } = Table;
import { toggleClass } from '@utils/classOp';
import { translate } from 'react-i18next';
import _ from 'lodash';

import TextButton from '../../components/TextButton';

class MyRecentApply extends React.Component {

  handleRecall = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'applyList/recall',
      payload: {
        applyId: record.id,
      },
    }).then(() => {
      dispatch({ type: 'entrance/fetchApply' });
    });
  }

  handleCopy = (record) => {
    const { dispatch, match } = this.props;
    const { id, appId } = record;

    dispatch({
      type: 'newApply/fetchApplyData',
      payload: {
        applyId: id,
        record,
      }
    });

    dispatch({
      type: 'newApply/fetchRoleList',
      payload: { appId }
    });

    // 到此处后会在model层获取copy的数据，在model层做跳转    
  }

  render() {

    const {
      apply,
      dispatch, match,
      global = {},
      t,
    } = this.props;
    const records = apply.records || [];
    if(records && records.length > 0){
      records.map(item => {
        return item.applyTypeName = t(item.applyTypeName)
      })
    }

    const { workflowenums = {} } = global.enumMap || {};
    const { applyStatus = {} } = workflowenums;

    return (
      <div className="my-recent-apply" >
        <Table
          dataSource={records}
          size="small"
          pagination={false}
          rowKey="id"
        >
          {/* <Column title={t('流程编号')} width={80} dataIndex="id" key="id" /> */}
          <Column title={t('目标系统')} width={200} dataIndex="appName" key="appName" />
          <Column title={t('申请类型')} width={80} dataIndex="applyTypeName" key="applyTypeName" />
          <Column
            title={t('权限名称')}
            dataIndex="applyRoleDtos"
            key="role"
            render={(data) => {
              return <div className="mutiRow" onClick={function(e){toggleClass(e.target, 'open')}}>
                {
                  _.uniqBy(data, 'refId').map((role) => role.refName).join(',')
                }
              </div>;
            }}
          />
          {/*<Column title="申请策略" dataIndex="strategy" key="strategy" />*/}
          <Column title={t('申请理由')} dataIndex="remark" key="remark" width={200} />
          <Column
            title={t('审批状态')}
            dataIndex="status"
            width={80}
            key="status"
            render={(data) => t(applyStatus[data])}
          />
          <Column title={t('创建时间')} width={180} dataIndex="createdAt" key="createdAt" />
          <Column
            title={t('操作')} width={160} dataIndex="operate" key="operate"
            render={(text, record, index) =>
              <div>
                <TextButton
                  onClick={() => {
                    let url = `${match.url}/apply-detail/${record.id}`;
                    dispatch(routerRedux.push(url));
                  }}
                >{t('详情')}</TextButton>
                <Divider type="vertical" />
                <TextButton
                  onClick={() => this.handleCopy(record)}
                >{t('复制')}</TextButton>
                {record.status === 1 && [
                  <Divider key="0" type="vertical" />,
                  <Popconfirm
                    key="1"
                    title={t('确定撤回此申请吗？')}
                    okText={t('确定')}
                    cancelText={t('取消')}
                    onConfirm={() => this.handleRecall(record)}
                  >
                    <TextButton>{t('撤回')}</TextButton>
                  </Popconfirm>
                ]}
              </div>
            }
          />
        </Table>
      </div>
    );
  }
}

export default translate()(MyRecentApply);
