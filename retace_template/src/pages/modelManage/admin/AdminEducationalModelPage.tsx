import React, { useState, useEffect } from 'react';
// import MD Style & Components
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, Typography, Button, TextField } from '@material-ui/core';
// import MD icons
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import customize components
import {
    IntroduceBox, DragFlow, DialogBox,
    TextFormsErrorVerification, DataTable,
    StepperBox, SelectFormsErrorVerification, TransferListBox
} from '../../../components/common';
// import customize hook
import { useKeyPress } from '../../../hooks';
// Dropzone
import { Dropzone, FileItem, FullScreenPreview } from "dropzone-ui";
// ECharts
import ReactECharts from 'echarts-for-react';
// import Mock Data
import {
    MockEducationModelsList,
    MockFeatureVariableData,
    MockFeatureEngineerResult,
    mixLineBarOption,
    MockEducationModelsResult,
} from '../../../settings/projectMockData';
import newTableImg from '../../../assets/image/models/newTable.png';
import knowledgeGraphImg from '../../../assets/image/dataIndex/knowledgeGraph.jpg';

const useStyles = makeStyles((theme: Theme) => createStyles({
    titleText: {
        margin: '20px 0 10px 0'
    },
    newTableForm: {
        justifyContent: 'center',
        marginRight: 45,
        marginLeft: 35,
        '& > *': {
            margin: '8px 8px',
            width: '100%',
        },
    },
    detailHeaderImg: {
        // filter: 'blur(4px)',
        backgroundImage: 'url(' + knowledgeGraphImg + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        backgroundPosition: '0 50%',
        height: 100,
        padding: 35,
        color: theme.palette.common.white,
    }
}));

/**
 * ! 教育数据模型列表页面展示
 */
interface NewEducationModelState {
    modelName: string;
    modelNameAlertMsg: string;
    modelIntro: string;
    modelIntroAlertMsg: string;
    // tableImg: string;
};
interface EducationalModelsListState {
    handleOpenPage: () => void;
    handleOpenFeatureFlow: () => void;
}
const EducationalModelsList: React.FC<EducationalModelsListState> = ({
    handleOpenPage, handleOpenFeatureFlow
}) => {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);

    // handle open dialog
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // handle close dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // dialog content
    const NewEducationalModelContent: React.FC = () => {
        // enter key press hook
        const enterPressed = useKeyPress(13);
        // new feature variable table state
        const [values, setValues] = useState<NewEducationModelState>({
            modelName: '',
            modelNameAlertMsg: '',
            modelIntro: '',
            modelIntroAlertMsg: '',
        });
        // Dropzone
        const [files, setFiles] = useState([]);
        const [imageSrc, setImageSrc] = useState(undefined);
        // end dropzone

        // handle change text change
        const handleChangeTextForms = (prop: keyof NewEducationModelState) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [prop]: event.target.value });
        };

        // handle change new model title value
        const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({
                ...values,
                modelName: event.target.value
            });
        };

        // handle change new model Introduce value
        const handleChangeIntro = (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({
                ...values,
                modelIntro: event.target.value
            });
        };

        // key board event listener
        useEffect(() => {
            if (enterPressed) {
                handleOpenFeatureFlow();
            }
        });

        // Dropzone
        const updateFiles = (incommingFiles) => {
            console.log("incomming files", incommingFiles);
            setFiles(incommingFiles);
        };
        const onDelete = (id) => {
            setFiles(files.filter((x) => x['id'] !== id));
        };
        const handleSee = (imageSource) => {
            setImageSrc(imageSource);
        };

        return (
            <form className={classes.newTableForm} noValidate autoComplete="off">
                <TextFormsErrorVerification
                    label={'教育数据模型名称'}
                    value={values.modelName}
                    handleChangeText={handleChangeName}
                    isError={values.modelNameAlertMsg !== ''}
                    helperText={values.modelNameAlertMsg}
                />
                <TextFormsErrorVerification
                    label={'教育数据模型简介'}
                    value={values.modelIntro}
                    handleChangeText={handleChangeIntro}
                    isError={values.modelIntroAlertMsg !== ''}
                    helperText={values.modelIntroAlertMsg}
                />
                <div>封面图片：</div>
                <Dropzone
                    style={{ minWidth: "550px" }}
                    //view={"list"}
                    onChange={updateFiles}
                    value={files}
                    maxFiles={1}
                    //header={false}
                    // footer={false}
                    maxFileSize={2998000}
                    label="将图片拖拽至此处或点击上传"
                    //label="Suleta tus archivos aquí"
                    accept=".png,image/*"
                    // uploadingMessage={"Uploading..."}
                    // url="http://ec2-99-99-9-9.compute-1.amazonaws.com:2800/upload-my-file"
                    //of course this url doens´t work, is only to make upload button visible
                    //uploadOnDrop
                    //clickable={false}
                    fakeUploading
                //localization={"ES-es"}
                >
                    {files.map((file) => (
                        <FileItem
                            {...file}
                            onDelete={onDelete}
                            onSee={handleSee}
                            //localization={"ES-es"}
                            preview
                            info
                            hd
                        />
                    ))}
                    <FullScreenPreview
                        imgSource={imageSrc}
                        openImage={imageSrc}
                        onClose={(e) => handleSee(undefined)}
                    />
                </Dropzone>
            </form>
        );
    }

    return (
        <div>
            <Typography className={classes.titleText} variant="h5">教育数据模型管理</Typography>
            <Grid container spacing={2}>
                {/* 展示已有的特征变量表 */}
                {
                    MockEducationModelsList.map((item) => (
                        <Grid item md={3} key={item['actionKey']}>
                            <IntroduceBox
                                img={item['img']}
                                title={item['title']}
                                introduce={item['introduce']}
                                actionName={item['actionName']}
                                action={handleOpenPage}
                            />
                        </Grid>
                    ))
                }
                {/* 新建特征变量表 */}
                <Grid item md={3}>
                    <IntroduceBox
                        img={newTableImg}
                        title={'新建教育数据模型'}
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
                    title={'新建教育数据模型'}
                    content={
                        <NewEducationalModelContent />
                    }
                    action={
                        <>
                            <Button onClick={handleCloseDialog} color="secondary" autoFocus>
                                取消
                            </Button>
                            <Button onClick={handleOpenFeatureFlow} color="primary" autoFocus>
                                确认
                            </Button>
                        </>
                    }
                />
            </Grid>
        </div>
    );
};

/**
 * ! 查看已有的教育数据模型内容
 */
interface EducationalModelDetailState {
    handleClosePage: () => void;
}
const EducationalModelDetail: React.FC<EducationalModelDetailState> = ({
    handleClosePage
}) => {
    const classes = useStyles();

    return (
        <div>
            {/* title & return button */}
            <Grid
                className={classes.detailHeaderImg}
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography className={classes.titleText} variant="h5">学生课堂行为变量表</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ExitToAppIcon />}
                    onClick={handleClosePage}
                >
                    返回首页
                </Button>
            </Grid>
            {/* Content */}
            <Grid container>
                <Grid item md={12}>
                    <h2>教育数据模型名称</h2>
                    <div style={{ fontSize: 17 }}>第一中心小学-101班-学生课堂行为可视化分析</div>
                    <h2>教育数据模型简称</h2>
                    <div style={{ fontSize: 17 }}>第一中心小学101班学生课堂行为可视化分析，使用柱状图+条形图的方式，可视化呈现学生的学习行为交互次数和在线时长等数据，并添加教育数据指标：统计与概率下的3级数学思维能力标准</div>
                    <h2>模型分析结果</h2>
                    <ReactECharts option={MockEducationModelsResult} style={{ height: '500px', width: '100%' }} />

                </Grid>
            </Grid>
        </div>
    );
};

/**
 * ! 教育数据模型创建的流程控制与执行
 */
interface EducationalModelsFlowState {
    handleCloseFlow: () => void;
}
const EducationalModelsFlow: React.FC<EducationalModelsFlowState> = ({
    handleCloseFlow
}) => {
    const classes = useStyles();

    const Step1FeatureEngineer = () => {
        return (
            <Grid container>
                <Grid item md={12}>
                    <Card>
                        <CardContent>
                            <div>
                                {/* <Flow /> */}
                                <DragFlow
                                    heads={['输入数据', '数据分析模型', '输出结果']}
                                    subHeads={['选择需要处理的数据', '选择适当的分析模型', '确定输出结果']}
                                    contents={'dataAnalysis'}
                                    // handleElementClick={()=>{console.log('click')}}
                                />
                            </div>
                        </CardContent>
                    </Card>

                </Grid>
            </Grid>
        );
    }

    const Step2Data = () => {
        const [openDialog, setOpenDialog] = useState(false);
        const [values, setValues] = useState('');
        const handleCloseDialog = () => {
            setOpenDialog(false);
        };
        const handleOpenDialog = () => {
            setOpenDialog(true);
        };
        const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
            setValues(event.target.value as string);
        };

        const DialogContent = () => {
            return (
                <>
                    <h3>选择关联的评价指标体系</h3>
                    <div style={{ width: 200 }}>
                        <SelectFormsErrorVerification
                            label={'选择所属评价体系'}
                            value={values}
                            items={['数学-简易方程', '数学-平面几何', '数学-统计与概率']}
                            handleChangeSelect={handleChangeSelect}
                        />
                    </div>
                    <h3>选择关联的指标等级</h3>
                    {/* <TransferListBox
                        toBeSelectedItems={['1级-问题分析', '2级-问题分析', '3级-问题分析', '1级-数学思维', '2级-数学思维', '3级-数学思维', '4级-数学思维']}
                        boxWidth={240}
                        boxHeight={245}
                    /> */}
                </>
            );
        };
        return (
            <div>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <h2>将输出结果与教育指标的关联</h2>
                    </Grid>
                    <Grid item style={{ paddingTop: 21 }}>
                        <Button variant="outlined" color="primary" onClick={handleOpenDialog}>选择关联指标</Button>
                    </Grid>
                </Grid>
                <ReactECharts option={mixLineBarOption} style={{ height: '500px', width: '100%' }} />
                {/* Dialog: 选择关联的知识图谱 */}
                <DialogBox
                    boxSize={'md'}
                    openDialog={openDialog}
                    handleCloseDialog={handleCloseDialog}
                    title={'选择分析结果所关联的教育评价指标'}
                    content={<DialogContent />}
                    action={
                        <>
                            <Button color="secondary" onClick={handleCloseDialog}>取消</Button>
                            <Button color="primary" autoFocus onClick={handleCloseDialog}>确定</Button>
                        </>
                    }
                />
            </div>
        );
    };

    const Step3FeatureDataTable = () => {
        return (
            <div>
                <h2>输出数据分析结果</h2>
                <ReactECharts option={MockEducationModelsResult} style={{ height: '420px', width: '100%' }} />
            </div>
        );
    }

    return (
        <div>
            {/* title & return button */}
            <Grid
                className={classes.detailHeaderImg}
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography className={classes.titleText} variant="h5">学生课堂行为可视化 —— 教育数据模型处理流程</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ExitToAppIcon />}
                    onClick={handleCloseFlow}
                >
                    返回首页
                </Button>
            </Grid>
            <br />
            {/* Content */}
            <StepperBox
                stepsTitle={['建立教育数据模型分析流', '输出结果与教育指标的关联', '输出数据分析结果']}
                stepsContent={[
                    <Step1FeatureEngineer />,
                    <Step2Data />,
                    <Step3FeatureDataTable />
                ]}
                finishMsg={'已完成教育数据模型的建立！'}
                handleFinish={handleCloseFlow}
            />
        </div>
    );
};

// 教育数据模型管理主页面
export const AdminEducationalModelPage: React.FC = () => {
    // 打开教育数据模型的内容也米娜
    const [openPages, setOpenPages] = useState(false);
    // 打开新建教育数据模型的流程页面
    const [openFlow, setOpenFlow] = useState(false);

    const handleOpenPage = () => {
        setOpenPages(true);
    };

    const handelClosePage = () => {
        setOpenPages(false);
    };

    const handleOpenFlow = () => {
        setOpenFlow(true);
    };

    const handleCloseFlow = () => {
        setOpenFlow(false);
    };

    if (openPages) {
        return (
            <EducationalModelDetail
                handleClosePage={handelClosePage}
            />
        );
    } else if (openFlow) {
        return (
            <EducationalModelsFlow
                handleCloseFlow={handleCloseFlow}
            />
        );
    } else {
        return (
            <EducationalModelsList
                handleOpenPage={handleOpenPage}
                handleOpenFeatureFlow={handleOpenFlow}
            />
        );
    }
};