import React from 'react';
import connect from '@utils/translateConnect';
import { Row, Col, Card, Form, Table,  } from 'antd';

const FormItem = Form.Item;
const { Column } = Table;

class Monitor extends React.Component {
  constructor(props) {
    super(props);
    this.fetchIndicatorsTotal()
    this.fetchTableData(1)
  }

  fetchIndicatorsTotal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitor/fetchTotal'
    });
  }

  fetchTableData = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitor/fetechTable',
      payload: {
        size: 10,
        page
      }
    });
  }

  handleTableChange = (val) => {
    this.fetchTableData(val.current)
  }

  render () {
    const { t, total, tableData } = this.props
    const records = tableData.records
    const pagination = {
      current: tableData.current,
      total: tableData.total
    }
    return (
      <div className="my-tools">
        <div className="my-tools__tool">
        <Card title='运营指标监控'>
          <div className="content-area">
            <Row gutter={24}>
              <Col span={4} className="search-fields">
              <FormItem label={t('UPM整体指标')}></FormItem>
              </Col>
              <Col span={5} className="search-fields">
                <FormItem label={t('接入UPM系统总数')}>
                  {total.appInTotal}
                </FormItem>
              </Col>
              <Col span={5} className="search-fields">
                <FormItem label={t('本周接入UPM系统总数')}>
                  {total.appThisWeek}
                </FormItem>
              </Col>
              <Col span={5} className="search-fields">
                <FormItem label={t('上周接入UPM系统总数')}>
                  {total.appLastWeek}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4} className="search-fields">
              </Col>
              <Col span={5} className="search-fields">
                <FormItem label={t('接入UPM用户数')}>
                  {total.userInTotal}
                </FormItem>
              </Col>
              <Col span={5} className="search-fields">
                <FormItem label={t('本周接入UPM用户数')}>
                  {total.userThisWeek}
                </FormItem>
              </Col>
              <Col span={5} className="search-fields">
                <FormItem label={t('上周接入UPM用户数')}>
                  {total.userLastWeek}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4} className="search-fields">
              <FormItem label={t('每个子系统指标')}></FormItem>
              </Col>
            </Row>
            <Table className="upm-table"
              dataSource={records}
              rowKey="appId"
              pagination={pagination}
              onChange={this.handleTableChange}
              >
              <Column title={t('系统名称')} dataIndex="appName" width={300} />
              <Column title={t('该系统用户数')} dataIndex="userCount" width={300} />
              <Column title={t('该系统角色数')} dataIndex="roleCount" width={300} />
              <Column title={t('该系统菜单数')} dataIndex="featureCount" width={300} />
            </Table>
          </div>
        </Card>
        </div>
      </div>
    );
  }
}

// export default Tools;
export default connect((monitorList) => {
  return {
    total: monitorList.monitor.total,
    tableData: monitorList.monitor.tableData
  };
})(Monitor);
