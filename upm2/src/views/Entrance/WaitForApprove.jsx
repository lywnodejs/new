import React from 'react';
import { Table } from 'antd';
import { routerRedux } from 'dva/router';
import TextButton from '../../components/TextButton';

const { Column } = Table;

class WaitForApprove extends React.Component {

  render() {

    const {
      approve, t,
      match, dispatch,
    } = this.props;
    const records = approve.records;

    return (
      <div className="my-recent-apply" >
        <Table dataSource={records} size="small" rowKey="approveId" pagination={false}>
          <Column title={t('ID')} dataIndex="approveId" key="approveId" />
          <Column title={t('系统')} dataIndex="appName" key="appName" />
          <Column title={t('申请人')} dataIndex="applyName" key="applyName" />
          {/* <Column title={t('申请角色')} dataIndex="role" key="role" /> */}
          {/* <Column title={t('申请策略')} dataIndex="strategy" key="strategy" /> */}
          <Column title={t('申请类型')} dataIndex="applyType" key="applyType" />
          <Column title={t('申请理由')} dataIndex="applyRemark" key="applyRemark" width={200} />
          <Column title={t('状态')} dataIndex="status" key="status" />
          <Column title={t('创建时间')} dataIndex="applyCreateAt" key="applyCreateAt" />
          <Column title={t('操作')} dataIndex="operate" key="operate"
            render={(text, record) => (
              <TextButton
                onClick={() => {
                  const url = `${match.url}/approve-detail/${record.approveId}`;
                  dispatch(routerRedux.push(url));
                }}
              >{t('详情')}</TextButton>
            )}
          />
        </Table>
      </div>
    );
  }
}

export default WaitForApprove;
