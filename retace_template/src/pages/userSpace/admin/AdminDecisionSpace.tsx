import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ReactECharts from 'echarts-for-react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { IntroduceBox, TabPanel } from '../../../components/common/';
// icon
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FaceIcon from '@material-ui/icons/Face';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import AccountTreeOutlinedIcon from '@material-ui/icons/AccountTreeOutlined';
// import Mock Data
import {
    decisionListMockData,
    decisionListItem, 
    //echarts data
    gaugeOption, 
    radarOption, 
    mixLineBarOption, 
    scatterOption, 
    heatmapOption 
} from '../../../settings/projectMockData';

const useStyles = makeStyles((theme: Theme) => createStyles({
    titleText: {
        margin: '20px 0 10px 0'
    },
    descText: {
        color: '#999'
    },
    detailSubTitle: {
        color: '#999',
        fontWeight: 'bold',
        fontSize: '18px',
    },
    redButton: {
        color: '#ff4d4f',
        borderColor: '#ff4d4f'
    },
    tabsRoot: {
        flexGrow: 1,
        display: 'flex',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        color: '#1e88e5',
        minWidth: '160px',
    },
    searchTitle: {
        marginTop: 10,
        marginBottom: 0,
    },
    formControl: {
        margin: theme.spacing(1),
    },
    searchBtn: {
        marginTop: 20,
    },
    decisionList: {
        '&>*': {
            paddingBottom: 10,
        },
    },

}));



//Main component
export const AdminDecisionSpace = () => {
    const classes = useStyles();
    //whether in detail page
    const [inDetail, setInDetail] = useState(false);
    //tabs value : which tab is selected
    const [tabValue, setTabValue] = useState(0);
    //selected decision
    const [decision, setDecision] = useState('');
    // selected decision category; search checked box: 基于教学场景、基于学科或班级
    const [searchState, setSearchState] = useState({
        teachSceneBased: true,
        subjectOrClassBased: true,
    });


    //checkbox event in search decision box
    const handleChangeCheckBoxes = (event) => {
        setSearchState({ ...searchState, [event.target.name]: event.target.checked });
    };

    // open decision detail
    const handleOpenDetailPage = (decision: string) => {
        setInDetail(true)
        setDecision(decision)
    }

    //浏览决策方案 搜索框+对应卡片列表
    const renderDecisionSpace = () => (
        <Grid>
            <Grid>
                <Typography className={classes.titleText} variant="h5">系统管理员 - 决策空间</Typography>
                {/* <Typography className={classes.descText} variant="body1"> 以数据应用工具集为中间媒介，结合具体需求，通过统一的开放应用权限与数据管理标准，对应用池与数据中台的信息进行挖掘、筛选、建模、分析、可视化处理，可以刻画个性化用户画像，完成诊断归因，进行预测预警，实现精准推荐。</Typography> */}
            </Grid>
            <Grid container spacing={3}>
                {/* LEFT: search desicion */}
                <Grid item md={3}>
                    <Card>
                        <CardContent>
                            <h3 className={classes.searchTitle}>决策方案筛选</h3>
                            <FormControl component="fieldset" className={classes.formControl}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox color="primary" checked={searchState.teachSceneBased} onChange={handleChangeCheckBoxes} name="teachSceneBased" />}
                                        label="针对教学场景的决策分析"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" checked={searchState.subjectOrClassBased} onChange={handleChangeCheckBoxes} name="subjectOrClassBased" />}
                                        label="针对学科或班级的决策分析"
                                    />
                                </FormGroup>
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>
                {/* RIGHT: dicision List */}
                <Grid item md={9} className={classes.decisionList}>
                    <Grid container spacing={2}>
                        {
                            decisionListMockData.map((item:decisionListItem) => (
                            <>
                            {
                                searchState[item.category] && (
                                    <Grid item md={6} key={item['actionKey']}>
                                        <IntroduceBox
                                            img={item['img']}
                                            title={item['title']}
                                            introduce={item['introduce']}
                                            actionName={item['actionName']}
                                            action={() => handleOpenDetailPage(item['actionKey'])}
                                        />
                                    </Grid>)
                            }
                            </>
                            ))
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )

    //决策方案对应的详细分析页面
    const renderDecisionDetail = () => {
        const handleTabChange = (event, newValue) => {
            setTabValue(newValue);
        };
        return (
            <Grid container spacing={3}>
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography className={classes.titleText} variant="h5">教学场景决策分析 | 教学行为分析</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => setInDetail(false)}
                    >
                        返回决策空间
                    </Button>
                </Grid>
                <div className={classes.tabsRoot}>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="Vertical tabs example"
                        className={classes.tabs}
                    >
                        <Tab label={<div><FaceIcon style={{ verticalAlign: 'middle' }} />用户画像</div>} />
                        <Tab label={<div><ShowChartIcon style={{ verticalAlign: 'middle' }} />可视化分析</div>} />
                        <Tab label={<div><ErrorOutlineIcon style={{ verticalAlign: 'middle' }} />预测预警</div>} />
                        <Tab label={<div><AccountTreeOutlinedIcon style={{ verticalAlign: 'middle' }} />归因诊断</div>} />
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        <Typography className={classes.detailSubTitle} variant="subtitle1">用户画像</Typography>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-around"
                            alignItems="center"
                        >
                            <ReactECharts option={gaugeOption} style={{ height: '400px', width: '400px' }} />
                            <ReactECharts option={radarOption} style={{ height: '500px', width: '500px' }} />
                        </Grid>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <Typography className={classes.detailSubTitle} variant="subtitle1">可视化分析</Typography>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-around"
                            alignItems="center"
                        >
                            <ReactECharts option={mixLineBarOption} style={{ height: '400px', width: '400px' }} />
                            <ReactECharts option={scatterOption} style={{ height: '400px', width: '400px' }} />
                        </Grid>
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <Typography className={classes.detailSubTitle} variant="subtitle1">预测预警</Typography>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-around"
                            alignItems="center"
                        >
                            <ReactECharts option={heatmapOption} style={{ height: '600px', width: '800px' }} />
                        </Grid>
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                        归因诊断
                    </TabPanel>
                </div>
            </Grid>
        )
    }

    return (
        <>
            {inDetail ? (
                renderDecisionDetail()
            ) : (
                renderDecisionSpace()
            )}
        </>

    );
};