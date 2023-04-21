import React, { useEffect, useState } from 'react';
// import MD Style & Components
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
// import MD icons
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import customize component
import {
    SelectFormsErrorVerification,
    DataTable,
    TransferListBox,
    IntroduceBox,
    DialogBox,
    TextFormsErrorVerification
} from '../../../components/common';
import TextField from '@material-ui/core/TextField';
// import mock data
import {
    MockClassifyData,
    MockClassifyDataList,
    MockClassifyDataTable
} from '../../../settings/projectMockData';
import newTableImg from '../../../assets/image/models/newTable.png';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme: Theme) => createStyles({
    pageTitle: {
        margin: '20px 0 10px 0'
    },
    textContent: {
        padding: theme.spacing(2),
        "& h3": {
            marginTop: 20,
            marginBottom: 5,
        }
    },
    formStyle: {
        // justifyContent: 'center',
        marginRight: 10,

        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
    alertMsgText: {
        textAlign: 'center',
        color: theme.palette.grey[400]
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
}))

// 查看数据分类列表
interface DataClassifyListState {
    handleOpenDetailPage: () => void;
    handleOpenProcessPage: () => void;
};
interface NewClassifyState {
    title: string;
    describe: string;
}
export const DataClassifyList: React.FC<DataClassifyListState> = ({
    handleOpenDetailPage, handleOpenProcessPage
}) => {
    const [openDialog, setOpenDialog] = useState(false);

    // 关闭新建分类规范dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // 打开新建分类规范dialog
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // dialog 内容
    const DialogContent: React.FC = () => {
        const classes = useStyles();
        const [values, setValues] = useState<NewClassifyState>({
            title: '',
            describe: '',
        });

        // 改变text值
        const handleChangeText = (prop: keyof NewClassifyState) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setValues({ ...values, [prop]: event.target.value });
            };

        return (
            <form className={classes.textForm} noValidate autoComplete="off">
                <TextFormsErrorVerification
                    label={"新建数据分类规范名称"}
                    value={values.title}
                    handleChangeText={handleChangeText('title')}
                />
                <TextFormsErrorVerification
                    label={"新建数据分类规范描述"}
                    value={values.describe}
                    handleChangeText={handleChangeText('describe')}
                />
            </form>
        );
    };

    return (
        <Grid container spacing={2}>
            {/* 展示已有的特征变量表 */}
            {
                MockClassifyDataList.map((item) => (
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
            {/* 新建数据分类规范 */}
            <Grid item md={3}>
                <IntroduceBox
                    img={newTableImg}
                    title={'新建数据分类规范'}
                    titleAlign={'center'}
                    introduce={''}
                    action={handleOpenDialog}
                />
            </Grid>
            {/* Dialog: 新建数据分类规范 */}
            <DialogBox
                boxSize={'md'}
                openDialog={openDialog}
                handleCloseDialog={handleCloseDialog}
                title={'新建数据分类规范'}
                content={<DialogContent />}
                action={
                    <>
                        <Button color="secondary" onClick={handleCloseDialog}>取消</Button>
                        <Button color="primary" autoFocus onClick={handleOpenProcessPage}>确定</Button>
                    </>
                }
            />
        </Grid>
    );
};

// 查看数据分类详细内容
interface DataClassifyDetailState {
    handleReturn: () => void;
};
export const DataClassifyDetail: React.FC<DataClassifyDetailState> = ({
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
                <Typography className={classes.pageTitle} variant="h5">学生课程行为分类规范</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ExitToAppIcon />}
                    onClick={handleReturn}
                >
                    返回首页
                </Button>
            </Grid>
            <DataTable
                header={['数据分类', '数据项', '所属分类体系']}
                data={MockClassifyData}
            />
        </>
    );
};

// 数据分类处理流程
interface DataClassifyProcessState {
    handleReturn: () => void;
};
interface ValueState {
    selectedTables: any[];
    selectedColumn: string;
    classifyStandard: string;
    classifyItem: string;
    classifyDescribe: string;
    ShowClassifyTable: boolean,
};
export const DataClassifyProcess: React.FC<DataClassifyProcessState> = ({
    handleReturn
}) => {
    const classes = useStyles();
    const fixedOptions = [];
    const [values, setValues] = useState<ValueState>({
        selectedTables: [],
        selectedColumn: '',
        classifyStandard: '',
        classifyItem: '',
        classifyDescribe: '',
        ShowClassifyTable: false,
    });

    // 修改基础数据表下拉列表选项
    // const handleChangeBasicDataTables = (event: React.ChangeEvent<{ value: unknown }>) => {
    //     setValues({
    //         ...values,
    //         basicDataTables: event.target.value as string
    //     });
    // };

    // 修改分类体系下拉列表选项
    const handleChangeClassifyStandard = (event: React.ChangeEvent<{ value: unknown }>) => {
        setValues({
            ...values,
            classifyStandard: event.target.value as string
        });
    };

    // 修改处理字段
    const handleChangeColumn = (event: React.ChangeEvent<{ value: unknown }>) => {
        setValues({
            ...values,
            selectedColumn: event.target.value as string
        });
    };

    // 修改分类项目名称下拉列表选项
    const handleChangeClassifyItem = (event: React.ChangeEvent<{ value: unknown }>) => {
        setValues({
            ...values,
            classifyItem: event.target.value as string
        });
    };

    // 修改分类描述框的内容
    const handleChangeClassifyDescribe = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            classifyDescribe: event.target.value
        });
    };

    // 输出分类数据表
    const handleShowClassifyTable = () => {
        setValues({
            ...values,
            ShowClassifyTable: true,
        });
    };

    // useEffect(()=>{
    //     const width = window.innerWidth;
    //     console.log(width);
    // });

    return (
        <>
            {/* title & return button */}
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography className={classes.pageTitle} variant="h5">学生课程行为分类规范</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ExitToAppIcon />}
                    onClick={handleReturn}
                >
                    返回首页
                </Button>
            </Grid>
            <Grid container spacing={2}>
                <Grid item lg={6}>
                    <Paper className={classes.textContent}>
                        <h3>选择需要进行分类处理的数据表</h3>
                        <div style={{ width: '96%' }}>
                            <Autocomplete
                                multiple
                                id="tags-demo"
                                value={values.selectedTables}
                                onChange={(event, newValue) => {
                                    setValues({
                                        ...values,
                                        selectedTables: [
                                            ...fixedOptions,
                                            ...newValue,
                                        ]
                                    });
                                }}
                                options={MockClassifyDataTable}
                                getOptionLabel={(option) => option.title}
                                renderTags={(tagValue, getTagProps) =>
                                    tagValue.map((option, index) => (
                                        <Chip
                                            label={option.title}
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                                // style={{ width: 500 }}
                                renderInput={(params) => (
                                    <TextField {...params} label="基础数据表" />
                                )}
                            />
                        </div>
                        <h3>选择处理字段</h3>
                        <div style={{width: '96%'}}>
                            <SelectFormsErrorVerification
                                label={"数据字段"}
                                value={values.selectedColumn}
                                items={['id', '类型', '对象']}
                                handleChangeSelect={handleChangeColumn}
                            />
                        </div>
                        <h3>选择分类数据</h3>
                        {
                            values.selectedTables.length === 0 || values.selectedColumn.length===0 ? (
                                <h2 className={classes.alertMsgText} style={{ lineHeight: '291px' }}>请先选择需要处理的数据表</h2>
                            ) : (
                                // <TransferListBox
                                //     toBeSelectedItems={['观看视频', '提出问题', '修改项目', '浏览资源', '提出质疑', '阅读', '制作作品']}
                                //     boxWidth={200}
                                //     boxHeight={245}
                                // />
                                <></>
                            )
                        }
                    </Paper>
                </Grid>
                <Grid item lg={6}>
                    <Paper className={classes.textContent}>
                        {
                            values.selectedTables.length === 0 || values.selectedColumn.length===0 ? (
                                <h2 className={classes.alertMsgText} style={{ lineHeight: '426px' }}>请先选择需要处理的数据表</h2>
                            ) : (
                                <form className={classes.formStyle} noValidate autoComplete="off">
                                    <h3>选择分类体系</h3>
                                    <SelectFormsErrorVerification
                                        label={"分类体系"}
                                        value={values.classifyStandard}
                                        items={['弗兰德斯互动分类系统', '布鲁姆-认识领域分类', '布鲁姆-情感领域分类', '布鲁姆-动作技能领域分类', '加涅-学习结果分类']}
                                        handleChangeSelect={handleChangeClassifyStandard}
                                    />
                                    <h3>分类名称</h3>
                                    <SelectFormsErrorVerification
                                        label={"分类项目名称"}
                                        value={values.classifyItem}
                                        items={['知道', '领会', '应用', '分析', '综合', '评价']}
                                        handleChangeSelect={handleChangeClassifyItem}
                                    />
                                    <h3>分类描述</h3>
                                    <TextField
                                        id="standard-multiline-flexible"
                                        label="分类描述"
                                        multiline
                                        rows={5}
                                        value={values.classifyDescribe}
                                        variant="outlined"
                                        onChange={handleChangeClassifyDescribe}
                                    />
                                    <Button
                                        variant="outlined" color="primary"
                                        onClick={handleShowClassifyTable}
                                    >
                                        确认分类
                                    </Button>
                                </form>

                            )
                        }
                    </Paper>
                </Grid>
                {
                    values.ShowClassifyTable &&
                    <Grid item md={12}>
                        <Paper className={classes.textContent}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <h2>分类数据表</h2>
                                <Button variant="outlined" color="primary" onClick={handleReturn}>
                                    确认新建分类规则
                                </Button>
                            </Grid>
                            <DataTable
                                header={['数据分类', '数据项', '所属分类体系']}
                                data={MockClassifyData}
                            />
                        </Paper>
                    </Grid>
                }
            </Grid>
        </>
    )
}

export const AdminDataClassifyPage: React.FC = () => {
    const [open, setOpen] = useState({
        detailPage: false,
        processPage: false,
    });

    // close all page
    const handleCloseAllPages = () => {
        setOpen({
            ...open,
            detailPage: false,
            processPage: false,
        });
    };

    const handleChangeOpenPage = (target) => {
        handleCloseAllPages();
        setOpen({
            ...open,
            [target]: true,
        });
    }

    if (open.detailPage) {
        return (
            <DataClassifyDetail
                handleReturn={handleCloseAllPages}
            />
        );
    } else if (open.processPage) {
        return (
            <DataClassifyProcess
                handleReturn={handleCloseAllPages}
            />
        );
    }
    return (
        <DataClassifyList
            handleOpenDetailPage={() => handleChangeOpenPage('detailPage')}
            handleOpenProcessPage={() => handleChangeOpenPage('processPage')}
        />
    );
}