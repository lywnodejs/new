import React from 'react';
// import MD icons
import HomeIcon from '@material-ui/icons/Home';
import SettingsSystemDaydreamIcon from '@material-ui/icons/SettingsSystemDaydream';
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';
import SwitchCameraIcon from '@material-ui/icons/SwitchCamera';
import BarChartIcon from '@material-ui/icons/BarChart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import StorageIcon from '@material-ui/icons/Storage';
import ArchiveIcon from '@material-ui/icons/Archive';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import CastForEducationIcon from '@material-ui/icons/CastForEducation';
import CategoryIcon from '@material-ui/icons/Category';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import FaceIcon from '@material-ui/icons/Face';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';

import AmpStoriesIcon from '@material-ui/icons/AmpStories';
import AppsIcon from '@material-ui/icons/Apps';

export const ProjectNavMenu = [
    {
        title: '主页',
        category: '主页',
        icon: <HomeIcon fontSize="small" />,
        router: '/',
    },
    {
        title: '应用信息管理',
        category: '厂商',
        icon: <SettingsSystemDaydreamIcon fontSize="small" />,
        router: '/appsManage/infoManage',
    },
    {
        title: '数据标准与规范',
        category: '厂商',
        icon: <FilterCenterFocusIcon fontSize="small" />,
        router: '/appsManage/xmlStandard',
    },
    {
        title: '应用行为管理',
        category: '厂商',
        icon: <HomeIcon fontSize="small" />,
        router: '/appsManage/behaviorManage',
    },
    {
        title: '行为关联管理',
        category: '厂商',
        icon: <HomeIcon fontSize="small" />,
        router: '/appsManage/behaviorRelation',
    },
    {
        title: '数据采集管理',
        category: '厂商',
        icon: <SwitchCameraIcon fontSize="small" />,
        router: '/appsManage/dataManage',
    },
    {
        title: '行为日志监测',
        category: '厂商',
        icon: <BarChartIcon fontSize="small" />,
        router: '/appsManage/actionMonitor',
    },
    {
        title: '基础数据管理',
        category: '基础数据',
        icon: <StorageIcon fontSize="small" />,
        router: '/modelManage/basicData',
    },
    {
        title: '教学数据管理',
        category: '基础数据',
        icon: <AssignmentIcon fontSize="small" />,
        router: '/modelManage/educationData',
    },
    {
        title: '模型库管理',
        category: '数据、指标与模型服务',
        icon: <AssignmentIcon fontSize="small" />,
        router: '/modelManage/theoryDetail',
    },
    {
        title: '指标库管理',
        category: '数据、指标与模型服务',
        icon: <AmpStoriesIcon fontSize="small" />,
        router: '/modelManage/indexManage',
    },
    {
        title: '度量库管理',
        category: '数据、指标与模型服务',
        icon: <AppsIcon fontSize="small" />,
        router: '/modelManage/measureManage',
    },
    {
        title: '量规库管理',
        category: '数据、指标与模型服务',
        icon: <FilterCenterFocusIcon fontSize="small" />,
        router: '/modelManage/scaleMange',
    },
    {
        title: '模型应用',
        category: '数据、指标与模型服务',
        icon: <CategoryIcon fontSize="small" />,
        router: '/modelManage/modelUsing'
    },
    {
        title: '报表配置',
        category: '数据、指标与模型服务',
        icon: <AllInboxIcon fontSize="small" />,
        router: '/modelManage/dataReport'
    },

    {
        title: '理论模型配置',
        category: '数据、指标与模型服务',
        icon: <BubbleChartIcon fontSize="small" />,
        router: '/modelManage/theorySetting'
    },
    {
        title: '量化模型配置',
        category: '数据、指标与模型服务',
        icon: <CastForEducationIcon fontSize="small" />,
        router: '/modelManage/analysisModel'
    },
    {
        title: '个人空间',
        category: '用户决策支持服务',
        icon: <FaceIcon fontSize="small" />,
        router: '/userSpace/growthFile'
    },
    // {
    //     title: '模型使用',
    //     category: '数据、指标与模型服务',
    //     icon: <ArchiveIcon fontSize="small"/>,
    //     router: '/modelManage/dataClassify',
    // },
    
    // {
    //     title: '工作台样例',
    //     category: '数据、指标与模型服务',
    //     icon: <AccountTreeIcon fontSize="small"/>,
    //     router: '/modelManage/featureEngineering'
    // },
    
    // {
    //     title: '决策空间',
    //     category: '用户决策支持服务',
    //     icon: <HowToVoteIcon fontSize="small"/>,
    //     router: '/userSpace/decisionSpace'
    // },
    
];