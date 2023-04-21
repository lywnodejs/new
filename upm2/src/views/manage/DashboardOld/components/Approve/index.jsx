import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
import _ from 'lodash'
import { Table, Row, Col, message } from 'antd';
import DateRange from '../DateRange';
import { isDevelopment, isPreRelease } from '@/config/env';
import connect from '@utils/translateConnect';

const now = moment().subtract('days', 1)

class ApprovePanel extends React.Component {
  defaultValue = [moment(now).subtract('days', 6), moment(now)];
  timeRange = this.defaultValue.map(date => date.format('YYYY-MM-DD'));
  state = {
    datas: []
  }

  /**
   * 初始化图标
   * @param {*} option
   */
  initChart() {
    this.approveCountChart = echarts.init(
      document.getElementById('approve-chart-count'),
      'orange'
    );
    this.approveCountChart.setOption(this.countOption);

    this.approveCoverChart = echarts.init(
      document.getElementById('approve-chart-cover'),
      'orange'
    );
    this.approveCoverChart.setOption(this.coverOption);

    this.approveTimeChart = echarts.init(
      document.getElementById('approve-chart-time'),
      'orange'
    );
    this.approveTimeChart.setOption(this.timeOption);
  }

  /**
   * 格式化返回数据
   * @param {*} data
   */
  formatData(data) {
    let category = [],
      datas = [
        {
          name: '审批流个数',
          type: 'line',
          _prop: 'workflowCount',
          data: []
        },
        {
          name: '审批流覆盖率',
          type: 'line',
          _prop: 'workflowCoverRatio',
          data: []
        },
        {
          name: '平均审批完成时间',
          type: 'line',
          _prop: 'applyCompleteTime',
          data: []
        }
      ];

    data.forEach(item => {
      category.push(moment(item.dateTime).format('YYYY-MM-DD'));
      datas.forEach(series => {
        series.data.push(item[series._prop]);
      });
    });

    return { category, datas };
  }

  /**
   * 刷新统计数据
   * @param {*} valueStr
   */
  refresh(valueStr, appId) {
    this.props
      .getApplyStat({
        startAt: valueStr[0],
        endAt: valueStr[1],
        appId: appId || this.props.appId
      })
      .then(data => {
        const { category, datas } = this.formatData(data); // 处理数据

        // 更新图标
        this.approveCountChart.setOption({
          xAxis: [
            {
              type: 'category',
              data: category
            }
          ],
          series: datas[0]
        });

        this.approveCoverChart.setOption({
          xAxis: [
            {
              type: 'category',
              data: category
            }
          ],
          series: datas[1]
        });

        this.approveTimeChart.setOption({
          xAxis: [
            {
              type: 'category',
              data: category
            }
          ],
          series: datas[2]
        });
      });
  }

  empty() {
    this.approveCountChart.setOption({
      ...this.countOption,
      series: []
    }, true);

    this.approveCoverChart.setOption({
      ...this.coverOption,
      series: []
    }, true);

    this.approveTimeChart.setOption({
      ...this.timeOption,
      series: []
    }, true);

    this.setState({
      datas: []
    })
  }

  /**
   * 时间变化
   * @param {*} value
   */
  handleSearch = value => {
    this.timeRange = value;
    this.refresh(value);
  };

  validateApp = (...args) => {
    let appId, success

    if (args.length === 1) {
      appId = this.props.appId
      success = args[0]
    } else {
      appId = args[0]
      success = args[1]
    }

    this.props.checkBpmApps(appId).then(data => {
      if (data) {
        success()
      } else {
        this.empty();
        message.warning(this.props.t('系统尚未接入BPM'));
      }
    })
  }

  componentDidMount() {
    this.countOption = {
      title: {
        text: '审批流个数统计'
      },
      tooltip: {
        trigger: 'axis',
        // formatter(params) {
        //   var result = params[0].axisValue + '<br />';
        //   params.forEach(function (item) {
        //       result += item.marker + " " + item.seriesName + " : " + item.value +"%<br />";
        //   });
        //   return result;
        // }
      },
      legend: {
        data: ['审批流个数']
      },
      grid: {
        left: '45px',
        right: '7%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false
      },
      yAxis: {
        type: 'value'
      },
      series: []
    };
    this.coverOption = Object.assign({}, this.countOption, {
      title: {
        text: '审批流覆盖率统计'
      },
      legend: {
        data: ['审批流覆盖率']
      },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          var result = params[0].axisValue + '<br />';
          params.forEach(function (item) {
              result += item.marker + " " + item.seriesName + " : " + item.value +"%<br />";
          });
          return result;
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        },
      },
    })
    this.timeOption = Object.assign({}, this.countOption, {
      title: {
        text: '平均审批完成时间统计'
      },
      legend: {
        data: ['平均审批完成时间']
      },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          var result = params[0].axisValue + '<br />';
          params.forEach(function (item) {
              result += item.marker + " " + item.seriesName + " : " + item.value +"min<br />";
          });
          return result;
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}min'
        },
      },
    })

    // 初始化图表
    this.initChart();

    // 校验app是否接入BPM
    this.validateApp(() => {
      this.refresh(this.timeRange);
      // 获取审批流完成时间排行
      this.props.getFlowData(this.props.appId).then(data => {
        this.setState({
          datas: data
        })
      })
    })
  }

  componentWillReceiveProps({ appId }, { appId: preAppId }) {
    if (appId != preAppId) {
      // 管理系统发生变化，刷新数据
      this.validateApp(appId, () => {
        this.refresh(this.timeRange, appId);
        // 获取审批流完成时间排行
        this.props.getFlowData(appId).then(data => {
          this.setState({
            datas: data
          })
        })
      })
    }
  }

  componentWillUnmount() {
    this.approveCountChart.dispose()
    this.approveCoverChart.dispose()
    this.approveTimeChart.dispose()
  }

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'workflowId',
        width: 150
      },
      {
        title: '审批流名称',
        dataIndex: 'workflowName',
      },
      {
        title: '平均完成审批时长（min）',
        dataIndex: 'completeTime',
        width: 200
      },
      {
        title: '总审批数',
        dataIndex: 'totalCount',
        width: 150
      }
    ];

    return (
      <div className="manage-dashboard-approve manage-dashboard__container">
        <DateRange
          defaultValue={this.defaultValue}
          onSearch={this.handleSearch}
          needCheck
        />
        <Row gutter={12}>
          <Col span={12}>
            <div
              id="approve-chart-count"
              style={{ height: '500px' }}
              className="manage-dashboard__chart"
            ></div>
          </Col>
          <Col span={12}>
            <div
              id="approve-chart-cover"
              style={{ height: '500px' }}
              className="manage-dashboard__chart"
            ></div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div
              id="approve-chart-time"
              style={{ height: '500px' }}
              className="manage-dashboard__chart"
            ></div>
          </Col>
        </Row>
        <div className="manage-dashboard__table">
          <div className="manage-dashboard__title">
            {t('审批流平均完成时长排行')}
          </div>
          <Table
            size="middle"
            rowKey="workflowId"
            columns={columns}
            dataSource={this.state.datas}
            bordered
            pagination={false}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  ({ global }) => ({
    appId: global.managingApp
  }),
  dispatch => ({
    getApplyStat(params) {
      return dispatch({
        type: 'dashboard/getApplyStat',
        payload: params
      });
    },
    getFlowData(params) {
      return dispatch({
        type: 'dashboard/getFlowData',
        payload: params
      });
    },
    checkBpmApps(params) {
      return dispatch({
        type: 'global/checkBpmApps',
        payload: params
      });
    }
  })
)(ApprovePanel)
