import React from 'react';
import connect from '@utils/translateConnect';
import moment from 'moment';
import { Divider, Table, Button } from 'antd';
import _ from 'lodash';
import TextButton from '@components/TextButton';
import { toggleClass } from '@utils/classOp';
import './index.less';

const Column = Table.Column;

class ApproveTable extends React.Component {

  state = {
    selectedRowKeys: []
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      selectedRowKeys: []
    })
  }

  createTextButton(text, handleClick, record) {
    return (
      <span key={text}>
        <Divider type="vertical" />
        <TextButton onClick={() => handleClick(record)}>{text}</TextButton>
      </span>
    );
  }

  createButton(record) {
    const { t } = this.props;
    return [
      this.createTextButton(t('通过'), this.props.onPass, record),
      this.createTextButton(t('驳回'), this.props.onReject, record)
    ];
  }

  render() {
    const { t } = this.props;
    const { records: datas, current, size: pageSize, total } = this.props.datas;
    const { selectedRowKeys } = this.state
    const rowSelection = {//CheckBox多选设置
      datas,
      getCheckboxProps: data => ({
        disabled: data.approveStatus !== 1
      }),
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({selectedRowKeys})
      },
    };

    return (
      <div>
        <div className="batch-option-area">
          <TextButton onClick={() => this.props.onBatchOption(this.state.selectedRowKeys, true)}>{t('批量通过')}</TextButton>
          <TextButton onClick={() => this.props.onBatchOption(this.state.selectedRowKeys, false)}>{t('批量驳回')}</TextButton>
        </div>
        <Table className="upm-table"
          rowKey="approveId"
          size="small"
          dataSource={datas}
          rowSelection={rowSelection} 
          pagination={{
            current,
            pageSize,
            total,
            hideOnSinglePage: true,
            onChange: this.props.onChange
          }}
        >
          {/* <Column title={t('流程编号')} dataIndex="approveId" width={80}/> */}
          <Column title={t('申请人账号')} dataIndex="applyName" width={100}/>
          <Column title={t('目标系统')} dataIndex="appName" width={150}/>
          <Column title={t('申请类型')} dataIndex="applyTypeName" width={100}/>
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
          {/*<Column title={t('申请策略')}*/}
            {/*render={(text, record) => {*/}
              {/*const { applyRoleDtos } = record;*/}
              {/*if (applyRoleDtos.length === 1) return applyRoleDtos[0].refName;*/}
              {/*return applyRoleDtos.map(rule => {*/}
                {/*return rule.refName +  ' | ';*/}
              {/*});*/}
            {/*}}/>*/}
          <Column title={t('申请理由')} dataIndex="applyRemark" width={150}/>
          {/* <Column
            title = {t('审批状态')}
            width={100}
            render={(text, record) => {
              const { workflowenums } = this.props.enumMap;
              if (workflowenums) return t(workflowenums.approveStatus[record.approveStatus]);
            }}
            /> */}
          <Column
            title={t('创建时间')}
            width={180}
            render={(text, record) => (
              <span>
                {moment(record.applyCreateAt).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )}
            />
          <Column
            title={t('操作')}
            key="action"
            width={150}
            fixed="right"
            render={(text, record) => (
              <span>
                <TextButton onClick={() => this.props.onShowDetail(record)}>{t('详情')}</TextButton>
                {record.approveStatus == 1 && this.createButton(record)}
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}

export default connect(({ global }) => {
  return {
    enumMap: global.enumMap
  };
})(ApproveTable);
