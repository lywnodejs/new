import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
import _ from 'lodash'
import { Table, Row, Col, message, Button, Tooltip, Icon, Form, Radio } from 'antd';
import DateRange from '../DateRange';
import { isDevelopment, isPreRelease } from '@/config/env';
import connect from '@utils/translateConnect';
const FormItem = Form.Item;

const now = moment().subtract('days', 1)

class ApprovePanel extends React.Component {
  defaultValue = [moment(now).subtract('days', 6), moment(now)];
  timeRange = this.defaultValue.map(date => date.format('YYYY-MM-DD'));
  state = {
    datas: [],
    time: 7
  }

  /**
   * 初始化图标
   * @param {*} option
   */
  initChart() {
    // this.approveCountChart = echarts.init(
    //   document.getElementById('approve-chart-count'),
    //   'orange'
    // );
    // this.approveCountChart.setOption(this.countOption);

    // this.approveCoverChart = echarts.init(
    //   document.getElementById('approve-chart-cover'),
    //   'orange'
    // );
    // this.approveCoverChart.setOption(this.coverOption);

    this.approveTimeChart = echarts.init(
      document.getElementById('approve-chart-time')
      // 'orange'
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
          data: [],
          areaStyle: {
            clolr: '#EA4D4F'
          }
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
        // data = data.map(item => {
        //   item.applyCompleteTime = 50;
        //   return item;
        // })
        const { category, datas } = this.formatData(data); // 处理数据

        // 更新图标
        // this.approveCountChart.setOption({
        //   xAxis: [
        //     {
        //       type: 'category',
        //       data: category
        //     }
        //   ],
        //   series: datas[0]
        // });

        // this.approveCoverChart.setOption({
        //   xAxis: [
        //     {
        //       type: 'category',
        //       data: category
        //     }
        //   ],
        //   series: datas[1]
        // });
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
    // this.approveCountChart.setOption({
    //   ...this.countOption,
    //   series: []
    // }, true);

    // this.approveCoverChart.setOption({
    //   ...this.coverOption,
    //   series: []
    // }, true);

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
    // 测试直接success,记得删掉
    success()
    return
    this.props.checkBpmApps(appId).then(data => {
      if (data) {
        success()
      } else {
        this.empty();
        message.warning(this.props.t('系统尚未接入BPM'));
      }
    })
  }

  getDate(time) {
    let startAt = null;
    const now = moment().subtract('days', 1)
    const endAt = moment(now).format('YYYY-MM-DD');
    if (time === 7) {
      startAt = moment(now).subtract('days', 6).format('YYYY-MM-DD');
    } else {
      startAt = moment(now).subtract('days', 30).format('YYYY-MM-DD');
    }

    return { startAt, endAt };
  }

  componentDidMount() {
    const { t } = this.props;

    this.countOption = {
      title: {
        text: t('审批流个数统计')
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
        data: [t('审批流个数')]
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
        text: t('近7天系统平均审批时长') + ': ' + this.props.avgApplyCompleteTime + 'h',
        subtext: t('近7天系统审批时长90分位值') + ': ' + this.props.ninetyApplyCompleteTime + 'h',
        textStyle: {
          color: '#333',
          fontSize: 16,
          fontWeight: 'normal'
        },
        subtextStyle: {
          color: '#333',
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      // legend: {
      //   data: ['平均审批完成时间']
      // },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          var result = params[0].axisValue + '<br />';
          params.forEach(function (item) {
              result += item.marker + " " + item.seriesName + " : " + item.value +"h<br />";
          });
          return result;
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}h'
        },
      },
      toolbox: {
        right: '20px',
        feature: {
          myDownload: {
            show: true,
            title: '下载数据',
            icon: 'path://M960 448c-35.376 0-64 28.656-64 64v384h-768v-384c0-35.344-28.624-64-64-64s-64 28.656-64 64v448c0 35.344 28.624 64 64 64h896c35.376 0 64-28.656 64-64v-448c0-35.344-28.624-64-64-64zM576 448v-391.818c0-31.026-28.624-56.182-64-56.182s-64 25.156-64 56.182v391.818h-192l256 256 256-256h-192z',
            iconStyle: {
              color: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'rgba(0, 0, 0, 0.5)'
            },
            onclick: () => {
              const url = `/v2/data/downloadApplyStats?startAt=${this.timeRange[0]}&endAt=${this.timeRange[1]}&appId=${this.props.appId}`

              window.location.href = isPreRelease || isDevelopment ? 'http://upm-test.xiaojukeji.com' + url  : url
            }
          },
        }
      },
    })

    // 初始化图表
    this.initChart();
    this.refreshFlowData();
  }
  
  refreshFlowData() {
    // 校验app是否接入BPM
    this.validateApp(() => {
      this.refresh(this.timeRange);
      // 获取审批流完成时间排行
      const { startAt, endAt } = this.getDate(this.state.time);
      this.props.getFlowData({
        appId: this.props.appId,
        startAt,
        endAt
      }).then(data => {
        this.setState({
          datas: data
        })
      })
    })
  }

  componentWillReceiveProps({ appId, avgApplyCompleteTime, ninetyApplyCompleteTime, t }, { appId: preAppId }) {
    this.approveTimeChart.setOption({
      ...this.timeOption,
      title: {
        text: t('近7天系统平均审批时长') + ': ' + avgApplyCompleteTime + 'h',
        subtext: t('近7天系统审批时长90分位值') + ': ' + ninetyApplyCompleteTime + 'h',
      }
    });
    if (appId != preAppId) {
      // 管理系统发生变化，刷新数据
      this.validateApp(appId, () => {
        this.refresh(this.timeRange, appId);
        // 获取审批流完成时间排行
        this.props.getFlowData({
          appId,
          startAt: this.timeRange[0],
          endAt: this.timeRange[1],
        }).then(data => {
          this.setState({
            datas: data
          })
        })
      })
    }
  }

  componentWillUnmount() {
    // this.approveCountChart.dispose()
    // this.approveCoverChart.dispose()
    this.approveTimeChart.dispose()
  }

  showDetail(record) {
    this.props.showSlowest(record, this.state.time);
  }

  onZhouqiChange(time) {
    this.setState({time}, () => {
      this.refreshFlowData()
    })
  }

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'workflowId',
      },
      {
        title: '审批流名称',
        dataIndex: 'workflowName',
        width: 150
      },
      {
        title: '平均完成审批时长（h）',
        dataIndex: 'completeTime',
      },
      {
        title: '总审批数',
        dataIndex: 'totalCount',
      },
      {
        title: '最慢节点详情',
        dataIndex: 'oper',
        width: 120,
        render: (text, record) => {
          return (
            <Button size="small" onClick={() => this.showDetail(record)}>{t('详情')}</Button>
          );
        }
      }
    ];

    return (
      <div className="manage-dashboard-approve manage-dashboard__container">
        {/* <Row gutter={12}>
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
        </Row> */}
        <Row gutter={12}>
          <Col span={12}>
            <DateRange
              defaultValue={this.defaultValue}
              onSearch={this.handleSearch}
              needCheck
            />
            <div
              id="approve-chart-time"
              style={{ height: '500px' }}
              className="manage-dashboard__chart"
            ></div>
          </Col>
          <Col span={12}>
            <div className="manage-dashboard__table">
              <div className="manage-dashboard__title">
                {t('审批流平均审批时长TOP20')}<Tooltip title={t('一段时间内所有已经完成审批的审批流平均审批时长，未完成的审批流暂不。')}><Icon type="question-circle-o" /></Tooltip>
              </div>
              <Row gutter={12}>
                <Col span={24} className="search-fields">
                  <FormItem
                    label={t('周期')}
                  >
                    <Radio.Group
                      name="radiogroup"
                      value={this.state.time}
                      onChange={e => this.onZhouqiChange(e.target.value)}
                    >
                      <Radio value={7}>7{t('天')}</Radio>
                      <Radio value={30}>30{t('天')}</Radio>
                    </Radio.Group>
                  </FormItem>
                </Col>
              </Row>
              <Table
                size="middle"
                rowKey="workflowId"
                columns={columns}
                dataSource={this.state.datas}
                bordered
                pagination={false}
              />
            </div>
          </Col>
        </Row>
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
