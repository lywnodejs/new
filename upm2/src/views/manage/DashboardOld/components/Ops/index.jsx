import React from 'react';
import echarts from 'echarts';
import connect from '@utils/translateConnect';
import DateRange from '../DateRange';
import moment from 'moment';
import { isDevelopment, isPreRelease } from '@/config/env';

const MAP_DESCRIPTION = {
  角色总数: '该子系统的角色总数',
  敏感角色总数: '敏感级为P4的角色总数量',
  权限点总数: '该子系统的权限点总数',
  权限总人数: '该子系统拥有权限点的总人数',
  敏感权限点总数: '敏感级为P4的权限点总数量',
  敏感权限总人数: '敏感级为P4的权限点涉及的总用户数量'
};
const now = moment().subtract('days', 1)

class OpsPanel extends React.Component {
  defaultValue = [moment(now).subtract('days', 6), moment(now)];
  timeRange = this.defaultValue.map(date => date.format('YYYY-MM-DD'));

  /**
   * 初始化图标
   * @param {*} option
   */
  initChart(option) {

    // TODO 由于开发模式下，样式动态引入，导致布局延迟，需要一个更优雅的方式
    if (isPreRelease || isDevelopment) {
      setTimeout(() => {
        this.opsChart = echarts.init(
          document.getElementById('ops-chart'),
          'orange'
        );
        this.opsChart.setOption(option);
        this.refresh(this.timeRange);
      }, 500);
    } else {
      this.opsChart = echarts.init(
        document.getElementById('ops-chart'),
        'orange'
      );
      this.opsChart.setOption(option);
      this.refresh(this.timeRange);
    }
  }

  /**
   * 格式化返回数据
   * @param {*} data
   */
  formatData(data) {
    let category = [],
      datas = [
        {
          name: '角色总数',
          type: 'bar',
          stack: 'role',
          _prop: 'roleCount',
          data: []
        },
        {
          name: '敏感角色总数',
          type: 'bar',
          stack: 'role',
          _prop: 'sensitiveRoleCount',
          data: []
        },
        {
          name: '权限点总数',
          type: 'bar',
          stack: 'auth',
          _prop: 'featureCount',
          data: []
        },
        {
          name: '敏感权限点总数',
          type: 'bar',
          stack: 'auth',
          _prop: 'sensitiveFeatureCount',
          data: []
        },
        {
          name: '权限总人数',
          type: 'bar',
          stack: 'people',
          _prop: 'featureUserCount',
          data: []
        },
        {
          name: '敏感权限总人数',
          type: 'bar',
          stack: 'people',
          _prop: 'sensitiveUserCount',
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
   * @param {*} appId
   */
  refresh(valueStr, appId) {
    this.props
      .getOpsData({
        startAt: valueStr[0],
        endAt: valueStr[1],
        appId: appId || this.props.appId
      })
      .then(data => {
        const { category, datas } = this.formatData(data); // 处理数据

        // 更新图标
        this.opsChart.setOption({
          xAxis: [
            {
              type: 'category',
              data: category
            }
          ],
          series: datas
        });
      });
  }

  /**
   * 时间变化
   * @param {*} value
   */
  handleSearch = value => {
    this.timeRange = value
    this.refresh(value);
  };

  componentDidMount() {
    let option = {
      title: {
        text: '权限分布统计'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
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
              const url = `/v2/data/downloadOpsStats?startAt=${this.timeRange[0]}&endAt=${this.timeRange[1]}&appId=${this.props.appId}`

              window.location.href = isPreRelease || isDevelopment ? 'http://upm-test.xiaojukeji.com' + url  : url
            }
          },
        }
      },
      legend: {
        tooltip: {
          show: true,
          formatter: ({ name }) => {
            return MAP_DESCRIPTION[name];
          }
        },
        data: [
          '角色总数',
          '敏感角色总数',
          '权限总人数',
          '敏感权限总人数',
          '权限点总数',
          '敏感权限点总数'
        ]
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category'
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: []
    };

    this.initChart(option);
  }

  componentWillReceiveProps({ appId }, { appId: preAppId }) {
    if (appId != preAppId) {

      // 管理系统发生变化，刷新数据
      this.refresh(this.timeRange, appId);
    }
  }

  componentWillUnmount() {
    this.opsChart.dispose()
  }

  render() {
    return (
      <div className="manage-dashboard-ops manage-dashboard__container">
        <DateRange
          defaultValue={this.defaultValue}
          onSearch={this.handleSearch}
        />
        <div className="manage-dashboard-ops manage-dashboard__container">
          <div
            id="ops-chart"
            style={{ height: '500px' }}
            className="manage-dashboard__chart"
          >
          </div>
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
    getOpsData(params) {
      return dispatch({
        type: 'dashboard/getOpsData',
        payload: params
      });
    },
    downloadOpsStats(params) {
      return dispatch({
        type: 'dashboard/downloadOpsStats',
        payload: params
      });
    }
  })
)(OpsPanel);
