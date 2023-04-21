import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
import connect from '@utils/translateConnect';
import DateRange from '../DateRange';
import { isDevelopment, isPreRelease } from '@/config/env';

const MAP_DESCRIPTION = {
  '整体角色权限申请冗余度': '一个角色权限超过半年未被申请，即视为申请角色冗余，整体<br />此类角色占全部角色的比例即为冗余度。列出冗余角色列表',
  '敏感角色权限申请冗余度': '敏感级为P4的角色超过半年未被申请即视为冗余，整体<br />此类角色占全部角色的比例即为敏感权限冗余度',
};
const now = moment().subtract('days', 1)

class ApplyPanel extends React.Component {
  defaultValue = [moment(now).subtract('days', 6), moment(now)];
  timeRange = this.defaultValue.map(date => date.format('YYYY-MM-DD'));

  state = {
    roles: []
  }
  /**
   * 初始化图标
   * @param {*} option
   */
  initChart(option) {
    // TODO 由于开发模式下，样式动态引入，导致布局延迟，需要一个更优雅的方式
    if (isPreRelease || isDevelopment) {
      setTimeout(() => {
        this.applyChart = echarts.init(
          document.getElementById('apply-chart'),
          'orange'
        );
        this.applyChart.setOption(option);
        this.refresh(this.timeRange);
      }, 500);
    } else {
      this.applyChart = echarts.init(
        document.getElementById('apply-chart'),
        'orange'
      );
      this.applyChart.setOption(option);
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
          name: '整体角色权限申请冗余度',
          type: 'line',
          _prop: 'appliedRoleRedundancy',
          data: []
        },
        {
          name: '敏感角色权限申请冗余度',
          type: 'line',
          _prop: 'appliedSensitiveRoleRedundancy',
          data: []
        }
      ];

    data.forEach(item => {
      category.push(moment(item.date).format('YYYY-MM-DD'));
      datas.forEach(series => {
        series.data.push(item[series._prop] ? item[series._prop].slice(0, -1) : '0.00');
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
      .getRedundancyData({
        startAt: valueStr[0],
        endAt: valueStr[1],
        appId: appId || this.props.appId
      })
      .then(data => {
        const { category, datas } = this.formatData(data); // 处理数据

        // 更新图标
        this.applyChart.setOption({
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
    this.timeRange = value;
    this.refresh(value);
  };

  componentDidMount() {
    let option = {
      title: {
        text: '权限使用统计'
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
      legend: {
        tooltip: {
          show: true,
          formatter: ({ name }) => {
            return MAP_DESCRIPTION[name];
          }
        },
        data: ['整体角色权限申请冗余度', '敏感角色权限申请冗余度']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        },
      },
      series: []
    };

    // 初始化图标
    this.initChart(option);
    // 获取敏感角色排名
    // this.props.getRedundantRoles(this.props.appId).then(data => {
    //   this.setState({
    //     roles: data
    //   })
    // })
  }

  componentWillReceiveProps({ appId }, { appId: preAppId }) {
    if (appId != preAppId) {
      // 管理系统发生变化，刷新数据
      this.refresh(this.timeRange, appId);
      // 获取敏感角色排名
      // this.props.getRedundantRoles(appId).then(data => {
      //   this.setState({
      //     roles: data
      //   })
      // })
    }
  }

  componentWillUnmount() {
    this.applyChart.dispose()
  }

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 150
      },
      {
        title: '敏感角色名称',
        dataIndex: 'name',
        width: 150
      }
    ];

    return (
      <div className="manage-dashboard-apply manage-dashboard__container">
        <DateRange
          defaultValue={this.defaultValue}
          onSearch={this.handleSearch}
        />
        <div
          id="apply-chart"
          style={{ height: '500px' }}
          className="manage-dashboard__chart"
        ></div>
        {/* <div className="manage-dashboard__table">
          <div className="manage-dashboard__title">
            {t('敏感角色冗余度排行')}
          </div>
          <Table
            size="middle"
            columns={columns}
            dataSource={this.state.roles}
            bordered
            pagination={false}
          />
        </div> */}
      </div>
    );
  }
}

export default connect(
  ({ global }) => ({
    appId: global.managingApp
  }),
  dispatch => ({
    getRedundancyData(params) {
      return dispatch({
        type: 'dashboard/getRedundancyData',
        payload: params
      });
    },
    getRedundantRoles(params) {
      return dispatch({
        type: 'dashboard/getRedundantRoles',
        payload: params
      });
    }
  })
)(ApplyPanel);
