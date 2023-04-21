import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
import _ from 'lodash'
import { Table, Row, Col, message, Button, Tooltip, Icon, Form, Radio } from 'antd';
import DateRange from '../DateRange';
import { isDevelopment, isPreRelease } from '@/config/env';
import connect from '@utils/translateConnect';
import Panel from '../Panel'

const FormItem = Form.Item;

const now = moment().subtract('days', 1)

class ApprovePanel extends React.Component {
  defaultValue = [moment(now).subtract('days', 6), moment(now)];
  timeRange = this.defaultValue.map(date => date.format('YYYY-MM-DD'));
  state = {
    datas: [],
    time: 7,
    operationStat: {},
    applyList: []
  }

  /**
   * 初始化图标
   * @param {*} option
   */
  initChart() {
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
      },
      legend: {
        data: [t('审批流个数')]
      },
      grid: {
        left: '20px',
        right: '35px',
        bottom: '10px',
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
          fontSize: 14,
          fontWeight: 'normal'
        },
        subtextStyle: {
          color: '#333',
          fontSize: 14,
          fontWeight: 'normal'
        }
      },
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

  /**
   * 请求统计数据
   */
  getData = (appId, startAt, endAt) => {
    this.props.getFlowData({
      appId,
      startAt,
      endAt
    }).then(data => {
      this.setState({
        datas: data
      })
    })
    this.props.getWeeklyReport({
      appId
    }).then(data => {
      this.setState({
        operationStat: data
      })
    })
    this.props.getLazyApplies({
      appId
    }).then(data => {
      this.setState({
        applyList: data
      })
    })
  }

  refreshFlowData() {
    // 校验app是否接入BPM
    this.validateApp(() => {
      this.refresh(this.timeRange);
      const { startAt, endAt } = this.getDate(this.state.time);

      this.getData(this.props.appId, startAt, endAt)
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
        this.getData(appId, this.timeRange[0], this.timeRange[1])
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

  /**
   * 时间格式化输出
   */
  timeFormatter = (value) => {
    if (value == null) return

    const hour = 60
    const day = 24 * hour
    const { t } = this.props

    if (value < hour) {
      // 不足一小时
      return value + t('分钟')
    } else if (value >= hour && value < day) {
      // 不足一天
      const h = Math.floor(value / hour)
      const m = value % hour

      return m ? h + t('小时') + m + t('分钟') : h + t('小时')
    } else {
      // 超过一天
      const d = Math.floor(value / day)
      const m = value % day

      return <span style={{color: 'red'}}>{ m ? m < hour ? d + t('天') + m + t('分钟') : d + t('天') + Math.floor(m / hour) + t('小时') : d + t('天')}</span>
    }
  }

  /**
   * 权限类型格式化输出
   */
  typeFormatter = (result) => {
    const { t } = this.props
    const types = Object.keys(result || {})

    const typeMap = {
      "1": t('角色组'),
      '2': t('角色'),
      '4': t('地区'),
      '5': t('标识位'),
      '8': t('报表'),
      '9': t('指标'),
      '10': t('模板'),
      '11': t('Tableau工作簿')
    }

    return types.map((type, index) => {
      return <React.Fragment key={index}><span className="manage-dashboard__type">{typeMap[type]}</span><span className="manage-dashboard__count">{result[type]}</span></React.Fragment>
    })
  }

  renderDateRange(start, end) {
    if (!start || !end) return

    return <React.Fragment>
      <span>{moment(start).format('YYYY年MM月DD日')}</span><span>-</span><span>{moment(end).format('YYYY年MM月DD日H时')}</span>
    </React.Fragment>
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
            <a onClick={() => this.showDetail(record)}>{t('详情')}</a>
          );
        }
      }
    ];
    const weeklyColumns = [
      {
        title: t('申请人'),
        dataIndex: 'applyUsernameZh',
        width: 150,
        render: (text, record) => {
          return (
            <a href={`https://im.xiaojukeji.com/contact?name=${record.applyUsername}`} target="_blank">{text}</a>
          );
        }
      },
      {
        title: t('当前审批人'),
        dataIndex: 'approveUsername',
        ellipsis: true,
        render: (text) => {
          if (!text) return
          return text.map((approve) => {
            return <a style={{marginLeft: '5px'}} key={approve.name} href={`https://im.xiaojukeji.com/contact?name=${approve.name}`} target="_blank">{approve.nameZh}</a>
          })
        }
      },
      {
        title: t('详情'),
        dataIndex: 'approveDetailUrl',
        width: 80,
        render: (text) => {
          return (
            <a href={text} target="_blank">{t('详情')}</a>
          );
        }
      }
    ];
    const { operationStat, applyList } = this.state

    t('本周权限申请 {{ count }} 单，权限申请用户数 {{ user }} 人')
    t('未完成审批的申请单共 {{ count }} 单')

    return (
      <div className="manage-dashboard-approve manage-dashboard__container">

        <Row gutter={10}>
          <Col md={12}>
            <Panel title={t('平均审批时长')}>
              <DateRange
                defaultValue={this.defaultValue}
                onSearch={this.handleSearch}
                needCheck
              />
              <div
                id="approve-chart-time"
                style={{ height: '400px' }}
                className="manage-dashboard__chart"
              ></div>
            </Panel>
            <Panel title={t('审批流平均审批时长TOP10')} subTitle={<Tooltip title={t('一段时间内所有已经完成审批的审批流平均审批时长，未完成的审批流暂不。')}><Icon type="question-circle-o" /></Tooltip>}>
              <Form layout="inline">
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
              </Form>
              <Table
                className="manage-dashboard__table"
                size="small"
                rowKey="workflowId"
                columns={columns}
                dataSource={this.state.datas}
                bordered
                pagination={false}
              />
            </Panel>
          </Col>
          <Col md={12}>
            <Panel title={t('本周权限申请情况')} subTitle={this.renderDateRange(operationStat.startAt, operationStat.endAt)}>
              <div style={{marginBottom: '10px'}}>
                <div>{t('本周权限申请 {{ count }} 单，权限申请用户数 {{ user }} 人', {count: operationStat.applyCount, user: operationStat.applyUserCount})}</div>
                <div>{t('权限申请类型数量分布详情：')} {this.typeFormatter(operationStat.applyDetailCount)}</div>
                {/* <div>
                  {t('本周平均审批时长为 {{time}}', {time: this.timeFormatter(operationStat.avgCompleteTime)})}
                </div> */}
                <div>{t('未完成审批的申请单共 {{ count }} 单', {count: operationStat.unCompletedApplyCount})}</div>
              </div>
              <div style={{marginBottom: '10px', fontWeight: 'bold'}}>
                {t('最慢未审批申请单TOP10')}
              </div>
              <Table
                className="manage-dashboard__table"
                size="small"
                bordered
                dataSource={applyList}
                columns={weeklyColumns}
                pagination={false}/>
            </Panel>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  ({ global }) => ({
    appId: global.managingAvailableApp
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
    },
    getWeeklyReport(params) {
      return dispatch({
        type: 'dashboard/getWeeklyReport',
        payload: params
      });
    },
    getLazyApplies(params){
      return dispatch({
        type: 'dashboard/getLazyApplies',
        payload: params
      });
    }
  })
)(ApprovePanel)
