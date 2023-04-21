import React from 'react';
// import echarts-for-react
import ReactECharts from 'echarts-for-react';
// import customize components
import { DataTable } from '../../../components/common';
// import MD components
import Typography from '@material-ui/core/Typography';
// import MD style
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
// import Mock Data
import { appsActions, errorDataMonitor } from '../../../settings/projectMockData';

const useStyles = makeStyles((theme: Theme) => createStyles({
  titleText: {
    margin: '10px 0'
  },
}));

export const AdminActionMonitorPage: React.FC = () => {
  const classes = useStyles();
  const option1 = {
    backgroundColor: '#f3f3f3',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      data: ['已接入应用数量', '数据上传流量']
    },
    xAxis: [
      {
        type: 'category',
        data: ['交互类工具', '内容类工具', '测评类工具', '课程管理类工具'],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '应用数量',
        min: 0,
        max: 10,
        interval: 2,
        axisLabel: {
          formatter: '{value} 个'
        }
      },
      {
        type: 'value',
        name: '数据上传流量',
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: {
          formatter: '{value} MB'
        }
      }
    ],
    series: [
      {
        name: '已接入应用数量',
        type: 'bar',
        data: [2, 4, 7, 5]
      },
      {
        name: '数据上传流量',
        type: 'line',
        yAxisIndex: 1,
        data: [12.5, 8.2, 23.3, 14.5]
      }
    ]
  };

  return (
    <div style={{padding: 16}}>
      <Typography className={classes.titleText} variant="h5">操作行为日志</Typography>
      <DataTable
        header={["用户ID", "角色", "用户IP地址", "操作行为", "时间"]}
        data={appsActions}
      />
      <Typography className={classes.titleText} variant="h5">应用数据上传流量统计</Typography>
      <div style={{ display: 'flex'}}>
        <ReactECharts option={option1} style={{height: '500px', width: '50%'}}/>
        <ReactECharts option={option1} style={{height: '500px', width: '50%'}}/>
      </div>
      <Typography className={classes.titleText} variant="h5">异常数据预警</Typography>
      <DataTable
        header={["应用名称", "异常原因", "时间"]}
        data={errorDataMonitor}
      />
    </div>
  );
};