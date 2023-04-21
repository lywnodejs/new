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

/**
 * 厂商管理：应用信息管理，数据标准与规范，应用行为管理，行为关联管理，数据采集管理，行为日志监测
 * 数据管理：基础数据管理，教学数据管理
 * 模型库：模型库管理，指标库管理，度量库管理，量规库管理
 * 模型应用：模型应用，报表配置
 * 模型配置：理论模型配置，量化模型配置
 * 用户空间：个人空间
 */
import BusinessIcon from '@material-ui/icons/Business';
import TableChartIcon from '@material-ui/icons/TableChart';
import PermDataSettingIcon from '@material-ui/icons/PermDataSetting';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import CloudIcon from '@material-ui/icons/Cloud';
import CameraIcon from '@material-ui/icons/Camera';

import AmpStoriesIcon from '@material-ui/icons/AmpStories';
import AppsIcon from '@material-ui/icons/Apps';


const researcherNavMenu =  [
    {
        category: '厂商管理',
        icon: <BusinessIcon fontSize="small" />,
        items: [
            {
                title: '应用信息管理',
                icon: <SettingsSystemDaydreamIcon fontSize="small" />,
                router: '/appsManage/infoManage',
            },
            {
                title: '数据标准与规范',
                icon: <FilterCenterFocusIcon fontSize="small" />,
                router: '/appsManage/xmlStandard',
            },
            {
                title: '应用行为管理',
                icon: <HomeIcon fontSize="small" />,
                router: '/appsManage/behaviorManage',
            },
            {
                title: '数据采集管理',
                icon: <SwitchCameraIcon fontSize="small" />,
                router: '/appsManage/dataManage',
            },
            {
                title: '行为日志监测',
                icon: <BarChartIcon fontSize="small" />,
                router: '/appsManage/actionMonitor',
            },
        ]
    },
    {
        category: '数据管理',
        icon: <TableChartIcon fontSize="small" />,
        items: [
            {
                title: '基础数据管理',
                icon: <StorageIcon fontSize="small" />,
                router: '/dataManage/basicData',
            },
            {
                title: '教学数据管理',
                icon: <AssignmentIcon fontSize="small" />,
                router: '/dataManage/educationData',
            },
            {
                title: '行为关联管理',
                icon: <HomeIcon fontSize="small" />,
                router: '/dataManage/behaviorRelation',
            },
        ]
    },
    {
        category: '模型库',
        icon: <CameraIcon fontSize="small" />,
        items: [
            {
                title: '模型库管理',
                icon: <AssignmentIcon fontSize="small" />,
                router: '/modelManage/theoryDetail',
            },
            // {
            //     title: '指标库管理',
            //     icon: <AmpStoriesIcon fontSize="small" />,
            //     router: '/modelManage/indexManage',
            // },
            // {
            //     title: '度量库管理',
            //     icon: <AppsIcon fontSize="small" />,
            //     router: '/modelManage/measureManage',
            // },
            {
                title: '量规库管理',
                icon: <FilterCenterFocusIcon fontSize="small" />,
                router: '/modelManage/scaleMange',
            },
        ]
    },
    {
        category: '模型应用',
        icon: <DataUsageIcon fontSize="small" />,
        items: [
            {
                title: '模型应用',
                icon: <CategoryIcon fontSize="small" />,
                router: '/modelApply/modelUsing'
            },
            {
                title: '报表配置',
                icon: <AllInboxIcon fontSize="small" />,
                router: '/modelApply/dataReport'
            },
        ]
    },
    {
        category: '模型配置',
        icon: <PermDataSettingIcon fontSize="small" />,
        items: [
            {
                title: '理论模型配置',
                icon: <BubbleChartIcon fontSize="small" />,
                router: '/modelSetting/theorySetting'
            },
            {
                title: '量化模型配置',
                icon: <CastForEducationIcon fontSize="small" />,
                router: '/modelSetting/analysisModel'
            },
        ]
    },
    {
        category: '用户空间',
        icon: <CloudIcon fontSize="small" />,
        items: [
            {
                title: '个人空间',
                icon: <FaceIcon fontSize="small" />,
                router: '/userSpace/growthFile'
            },
        ]
    },
];

const teacherNavMenu = [
    {
        category: '模型库',
        icon: <CameraIcon fontSize="small" />,
        items: [
            {
                title: '模型库管理',
                icon: <AssignmentIcon fontSize="small" />,
                router: '/modelManage/theoryDetail',
            },
            {
                title: '量规库管理',
                icon: <FilterCenterFocusIcon fontSize="small" />,
                router: '/modelManage/scaleMange',
            },
        ]
    },
    {
        category: '数据分析',
        icon: <BusinessIcon fontSize="small" />,
        items: [
            {
                title: '教师数据处理',
                icon: <SettingsSystemDaydreamIcon fontSize="small" />,
                router: '/dataAnalysis/teacherDataProcess',
            },
            {
                title: '学生数据处理',
                icon: <FilterCenterFocusIcon fontSize="small" />,
                router: '/dataAnalysis/studentDataProcess',
            },
            
            {
                title: '数据分析',
                icon: <FilterCenterFocusIcon fontSize="small" />,
                router: '/dataAnalysis/dataAnalysis',
            },
        ]
    },
    {
        category: '结果管理',
        icon: <TableChartIcon fontSize="small" />,
        items: [
            {
                title: '图表管理',
                icon: <StorageIcon fontSize="small" />,
                router: '/resultManage/graphManage',
            },
            {
                title: '报表管理',
                icon: <AssignmentIcon fontSize="small" />,
                router: '/resultManage/reportManage',
            },
        ]
    },
    
    {
        category: '用户空间',
        icon: <CloudIcon fontSize="small" />,
        items: [
            {
                title: '个人空间',
                icon: <FaceIcon fontSize="small" />,
                router: '/userSpace/growthFile'
            },
        ]
    },
];

const adminNavMenu = researcherNavMenu

export const NewProjectNavMenu = {
    '系统管理员': adminNavMenu,
    '教研员': researcherNavMenu,
    '教师': teacherNavMenu,
}


const flat = (navMenu) => {
    const menuList:any[] = []
    navMenu.map(menuGroup => menuGroup.items.map(item => menuList.push(item)))
    return menuList
}

// 把多级菜单拍平好查询路由？
export const flatNavMenu = {
    '系统管理员': flat(adminNavMenu),
    '教研员': flat(researcherNavMenu),
    '教师': flat(teacherNavMenu),
}
