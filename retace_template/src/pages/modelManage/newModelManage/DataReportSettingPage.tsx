/**
 * ! 数据分析结果报表配置
 */
import React, { useState, useEffect } from 'react';
// import customize components
import {
    IntroduceBox, DragFlow, DialogBox,
    TextFormsErrorVerification, DataTable,
    StepperBox, SelectFormsErrorVerification, TransferListBox,
    DragDrop
} from '../../../components/common';
// import MD style & components & Icons
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ReactECharts from 'echarts-for-react';
// import Mock Data
import {
    MockDecisionSupportList,
    MockEducationModelsResultLevel3,
    MockLineChart
} from '../../../settings/projectMockData';
import newTableImg from '../../../assets/image/models/newTable.png';
import dataReport from '../../../assets/image/models/datareport.png';
import barChartImg from '../../../assets/image/charts/bar-simple.png';
import lineChartImg from '../../../assets/image/charts/line-simple.png';
import educationalModel3 from '../../../assets/image/models/ModelExample3.jpg';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme: Theme) => createStyles({
    pageTitle: {
        margin: '20px 0 10px 0'
    },
    textForm: {
        justifyContent: 'center',
        marginRight: 20,
        // marginLeft: 35,
        '& > *': {
            margin: '8px 8px',
            width: '100%',
        },
    },
}));

// 决策支持服务列表
interface DecisionSupportListState {
    handleOpenDetailPage: () => void;
    handleOpenProcessPage: () => void;
};
interface NewDecisionSupportState {
    title: string;
    describe: string;
};
const DecisionSupportList: React.FC<DecisionSupportListState> = ({
    handleOpenDetailPage, handleOpenProcessPage
}) => {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const [reportList, setReportList] = useState(MockDecisionSupportList);

    // 打开新建决策支持服务对话框
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // 关闭新建决策支持服务对话框
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // 删除数据报表
    const handleDelete = (title: string) => {
        let newReportList: any[] = [];
        reportList.map((report, index) => {
            if (report.title !== title) {
                newReportList.push(report);
            }
        });
        setReportList(newReportList);
    };

    // dialog 内容
    const DialogContent: React.FC = () => {
        const classes = useStyles();
        const [values, setValues] = useState<NewDecisionSupportState>({
            title: '',
            describe: '',
        });

        // 改变text值
        const handleChangeText = (prop: keyof NewDecisionSupportState) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues({ ...values, [prop]: event.target.value });
            };

        return (
            <form className={classes.textForm} noValidate autoComplete="off">
                <TextFormsErrorVerification
                    label={"数据报表名称"}
                    value={values.title}
                    handleChangeText={handleChangeText('title')}
                />
                <TextFormsErrorVerification
                    label={"数据报表简介"}
                    value={values.describe}
                    handleChangeText={handleChangeText('describe')}
                />
            </form>
        );
    };

    return (
        <>
            <Typography className={classes.pageTitle} variant="h5">报表配置</Typography>
            <Grid container spacing={2}>
                {/* 展示已有的特征变量表 */}
                {
                    reportList.map((item) => (
                        <Grid item md={3} key={item['actionKey']}>
                            <IntroduceBox
                                img={item['img']}
                                title={item['title']}
                                introduce={item['introduce']}
                                actionName={'查看报表'}
                                action={handleOpenDetailPage}
                                deleteAction='删除报表'
                                handleDelete={handleDelete}
                                autoHeight
                            />
                        </Grid>
                    ))
                }
                {/* 新建特征变量表 */}
                <Grid item md={3}>
                    <IntroduceBox
                        img={newTableImg}
                        title={'新建数据报表'}
                        titleAlign={'center'}
                        introduce={''}
                        action={handleOpenDialog}
                        autoHeight
                    />
                </Grid>
                {/* Dialog: 打开新建变量表操作表单 */}
                <DialogBox
                    boxSize={'md'}
                    openDialog={openDialog}
                    handleCloseDialog={handleCloseDialog}
                    title={'新建数据报表'}
                    content={
                        <DialogContent />
                    }
                    action={
                        <>
                            <Button onClick={handleCloseDialog} color="secondary" autoFocus>
                                取消
                            </Button>
                            <Button onClick={handleOpenProcessPage} color="primary" autoFocus>
                                确认
                            </Button>
                        </>
                    }
                />
            </Grid>
        </>
    );
};

// 决策支持服务内容页面
interface DecisionSupportDetailState {
    handleReturn: () => void;
};
const DecisionSupportDetail: React.FC<DecisionSupportDetailState> = ({
    handleReturn
}) => {
    const classes = useStyles();

    return (
        <>
            {/* title & return button */}
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography className={classes.pageTitle} variant="h5">1年级教师教案分析结果</Typography>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ExitToAppIcon />}
                        onClick={handleReturn}
                    >
                        返回首页
                    </Button>
                </div>
            </Grid>
            <div style={{ textAlign: 'center', padding: '0px 100px' }}>
                <h2>1年级全体教师教案评价分析报告</h2>
                <div style={{ textAlign: 'left', fontSize: '16px', textIndent: '2em' }}>
                    4月份对1年教师的教案进行评价分析后，每位教师的教案在评价指标上的6个维度中各自的得分情况如下图所示：
                </div>
                <ReactECharts option={MockEducationModelsResultLevel3} style={{ height: '500px', width: '100%' }} />
                <div style={{ textAlign: 'left', fontSize: '16px', textIndent: '2em', marginTop: 10 }}>
                    基于上述分析结果可知，XXX老师的教案未达到标准水平。同时，1年级教师的教案在学习活动方式设计以及教学目标处理上存在一定的问题。而教学内容与学习活动任务设计则表现较好，但总体情况较差，需要引起教研员与各位教师的关注。
                </div>
                <div style={{ textAlign: 'left', fontSize: '16px', textIndent: '2em', marginTop: 10 }}>
                    对比历史数据可知，新学期开始后（3-4月），1年级教师的教案撰写水平有较为明显的下降趋势，需要引起各位老师的注意！
                </div>
                {/* MockLineChart */}
                <ReactECharts option={MockLineChart} style={{ height: '500px', width: '100%' }} />

            </div>
            {/* <img src={dataReport} alt="" style={{ width: '80%', display: 'flex', margin: 'auto' }} /> */}
        </>
    );
};

// 决策支持服务配置流程页面
interface DecisionSupportProcessState {
    handleReturn: () => void;
};
const DecisionSupportProcess: React.FC<DecisionSupportProcessState> = ({
    handleReturn
}) => {
    const classes = useStyles();

    const handleNewList = () => {
        MockDecisionSupportList.push(
            {
                title: '新数据报表1',
                img: educationalModel3,
                introduce: '对学生美育指标下的美术课程、音乐课程、校内艺术活动和校外艺术活动进行统计分析',
                actionName: '查看数据模型',
                actionKey: '新数据报表1',
            },
        );
        handleReturn();
    };

    return (
        <>
            {/* title & return button */}
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography className={classes.pageTitle} variant="h5">三年级语文学科教案数据分析报告 | 配置</Typography>
                <div style={{ marginRight: 10 }}>
                    <Button variant="contained" color="secondary" onClick={handleNewList}>
                        保存
                    </Button>&nbsp;&nbsp;
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ExitToAppIcon />}
                        onClick={handleReturn}
                    >
                        返回首页
                    </Button>
                </div>
            </Grid>
            <DragDrop />

        </>
    );
};

// 决策支持服务管理主页
export const DataReportSettingPage = () => {
    //open page state
    const [openPage, setOpenPage] = useState({
        openDetailPage: false,
        openProcessPage: false
    });

    // 关闭所有页面, 返回主页
    const handleClosePage = () => {
        setOpenPage({
            ...openPage,
            openDetailPage: false,
            openProcessPage: false,
        });
    }

    // 打开内部页面
    const handleOpenPage = (target) => {
        handleClosePage();
        setOpenPage({
            ...openPage,
            [target]: true
        });
    };

    if (openPage.openDetailPage) {
        return (
            <div style={{ paddingLeft: 20 }}>
                <DecisionSupportDetail
                    handleReturn={handleClosePage}
                />
            </div>
        );
    } else if (openPage.openProcessPage) {
        return (
            <div style={{ paddingLeft: 20 }}>
                <DecisionSupportProcess
                    handleReturn={handleClosePage}
                />
            </div>
        );
    }
    return (
        <div style={{ paddingLeft: 20 }}>
            <DecisionSupportList
                handleOpenDetailPage={() => handleOpenPage('openDetailPage')}
                handleOpenProcessPage={() => handleOpenPage('openProcessPage')}
            />
        </div>
    );
};