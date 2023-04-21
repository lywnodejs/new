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
// import Mock Data
import {
    MockDecisionSupportList,
} from '../../../settings/projectMockData';
import newTableImg from '../../../assets/image/models/newTable.png';
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

    // 打开新建决策支持服务对话框
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // 关闭新建决策支持服务对话框
    const handleCloseDialog = () => {
        setOpenDialog(false);
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
                    label={"新建决策支持服务名称"}
                    value={values.title}
                    handleChangeText={handleChangeText('title')}
                />
                <TextFormsErrorVerification
                    label={"新建决策支持服务描述"}
                    value={values.describe}
                    handleChangeText={handleChangeText('describe')}
                />
            </form>
        );
    };

    return (
        <>
            <Typography className={classes.pageTitle} variant="h5">决策支持服务管理</Typography>
            <Grid container spacing={2}>
                {/* 展示已有的特征变量表 */}
                {
                    MockDecisionSupportList.map((item) => (
                        <Grid item md={3} key={item['actionKey']}>
                            <IntroduceBox
                                img={item['img']}
                                title={item['title']}
                                introduce={item['introduce']}
                                actionName={item['actionName']}
                                action={handleOpenDetailPage}
                            />
                        </Grid>
                    ))
                }
                {/* 新建特征变量表 */}
                <Grid item md={3}>
                    <IntroduceBox
                        img={newTableImg}
                        title={'新建决策支持服务'}
                        titleAlign={'center'}
                        introduce={''}
                        action={handleOpenDialog}
                    />
                </Grid>
                {/* Dialog: 打开新建变量表操作表单 */}
                <DialogBox
                    boxSize={'md'}
                    openDialog={openDialog}
                    handleCloseDialog={handleCloseDialog}
                    title={'新建决策支持服务内容'}
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
                <Typography className={classes.pageTitle} variant="h5">学生课堂行为与成绩预测</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ExitToAppIcon />}
                    onClick={handleReturn}
                >
                    返回首页
                </Button>
            </Grid>
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

    return (
        <>
            {/* title & return button */}
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography className={classes.pageTitle} variant="h5">学生课堂行为与成绩预测 | 配置</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ExitToAppIcon />}
                    onClick={handleReturn}
                >
                    返回首页
                </Button>
            </Grid>
            <DragDrop />
            
        </>
    );
};

// 决策支持服务管理主页
export const AdminDecisionSupportPage = () => {
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
            <DecisionSupportDetail
                handleReturn={handleClosePage}
            />
        );
    } else if (openPage.openProcessPage) {
        return (
            <DecisionSupportProcess
                handleReturn={handleClosePage}
            />
        );
    }
    return (
        <DecisionSupportList
            handleOpenDetailPage={() => handleOpenPage('openDetailPage')}
            handleOpenProcessPage={() => handleOpenPage('openProcessPage')}
        />
    );
};