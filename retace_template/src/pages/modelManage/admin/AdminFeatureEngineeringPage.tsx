import React, { useState, useEffect } from 'react';
// import MD Style & Components
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, Typography, Button, TextField } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
// import MD icons
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import customize components
import {
    IntroduceBox, DragFlow, DialogBox, Flow,
    TextFormsErrorVerification, DataTable,
    StepperBox, SelectFormsErrorVerification, TransferListBox, Workbench
} from '../../../components/common';
// import customize hook
import { useKeyPress } from '../../../hooks';
// Dropzone
import { Dropzone, FileItem, FullScreenPreview } from "dropzone-ui";
// import Mock Data
import {
    MockFeatureVariableTable,
    MockFeatureVariableData,
    MockFeatureEngineerResult,
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
    },
    detailBox: {
        height: 500,
        width: 350,
        backgroundColor: theme.palette.type==='light'?'#effaff':'#353d48',
        position: 'absolute',
        top: 325,
        right: 40,
        zIndex: 10,
    },
    loginForm: {
        justifyContent: 'center',
        padding: '0 20px',
    },
    formStyle: {
        marginRight: 15,
        width: '100%',
    },
    quantityRoot: {
        // height: 'calc(100vh - 182px)',
        // overflowY: 'scroll'
    }
}));

/**
 * ! 特征变量表列表展示
 */
// 新建特征变量表的属性接口定义
interface NewFeatureVariableState {
    tableName: string;
    tableNameAlertMsg: string;
    tableIntro: string;
    tableIntroAlertMsg: string;
    // tableImg: string;
};
// 教育特征变量列表状态接口定义
interface FeatureVariableTableListState {
    handleOpenPage: () => void;
    handleOpenFeatureQuantity: () => void;
    handleOpenFeatureQuality: () => void;
}
const FeatureVariableTableList: React.FC<FeatureVariableTableListState> = ({
    handleOpenPage, handleOpenFeatureQuantity, handleOpenFeatureQuality
}) => {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const [featureType, setFeatureType] = useState('quantity');

    // handle open dialog
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // handle close dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // dialog content
    const NewFeatureVariableTableContent: React.FC = () => {
        // enter key press hook
        const enterPressed = useKeyPress(13);
        // new feature variable table state
        const [values, setValues] = useState<NewFeatureVariableState>({
            tableName: '',
            tableNameAlertMsg: '',
            tableIntro: '',
            tableIntroAlertMsg: '',
        });
        // Dropzone
        const [files, setFiles] = useState([]);
        const [imageSrc, setImageSrc] = useState(undefined);
        // end dropzone

        // handle change feature engineer type: quantity定量
        const handleFeatureType = (event: React.ChangeEvent<HTMLInputElement>) => {
            setFeatureType((event.target as HTMLInputElement).value);
        };

        // handle change text change
        const handleChangeTextForms = (prop: keyof NewFeatureVariableState) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [prop]: event.target.value });
        };

        // handle change new table title value
        const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({
                ...values,
                tableName: event.target.value
            });
        };

        // handle change new table Introduce value
        const handleChangeIntro = (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({
                ...values,
                tableIntro: event.target.value
            });
        };

        // key board event listener
        useEffect(() => {
            if (enterPressed) {
                if (featureType === 'quantity') {
                    handleOpenFeatureQuantity();
                } else {
                    handleOpenFeatureQuality();
                }
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
                    label={'特征变量表名'}
                    value={values.tableName}
                    handleChangeText={handleChangeName}
                    isError={values.tableNameAlertMsg !== ''}
                    helperText={values.tableNameAlertMsg}
                />
                <TextFormsErrorVerification
                    label={'特征变量表简介'}
                    value={values.tableIntro}
                    handleChangeText={handleChangeIntro}
                    isError={values.tableIntroAlertMsg !== ''}
                    helperText={values.tableIntroAlertMsg}
                />
                <FormControl component="fieldset">
                    <FormLabel component="legend">特征工程类别选择</FormLabel>
                    <RadioGroup
                        row aria-label="position" name="position" defaultValue="top"
                        value={featureType}
                        onChange={handleFeatureType}
                    >
                        <FormControlLabel value="quantity" control={<Radio color="primary" />} label="定量特征工程" />
                        <FormControlLabel value="quality" control={<Radio color="primary" />} label="定性特征工程" />
                    </RadioGroup>
                </FormControl>
                <div>封面图片：</div>
                <Dropzone
                    style={{ minWidth: "550px", minHeight: "200px" }}
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
            <Typography className={classes.titleText} variant="h5">教育特征变量表</Typography>
            <Grid container spacing={2}>
                {/* 展示已有的特征变量表 */}
                {
                    MockFeatureVariableTable.map((item) => (
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
                        title={'新建特征变量表'}
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
                    title={'新建特征变量表'}
                    content={
                        <NewFeatureVariableTableContent />
                    }
                    action={
                        <>
                            <Button onClick={handleCloseDialog} color="secondary" autoFocus>
                                取消
                            </Button>
                            <Button onClick={featureType === 'quantity' ? handleOpenFeatureQuantity : handleOpenFeatureQuality} color="primary" autoFocus>
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
 * ! 查看已有的特征变量表
 */
interface FeatureVariableDetailState {
    handleClosePage: () => void;
}
const FeatureVariableDetail: React.FC<FeatureVariableDetailState> = ({
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
                    <h2>特征变量表名称</h2>
                    <div style={{ fontSize: 17 }}>第一中心小学-101班-学生课堂行为变量表</div>
                    <h2>特征变量表简介</h2>
                    <div style={{ fontSize: 17 }}>第一中心小学101班学生课堂行为的特征变量表，主要抽取出五类关键特征行为：听讲、阅读与练习、发言、讨论、无关行为（每隔10秒采集一次）</div>
                    <h2>特征变量表</h2>
                    <DataTable
                        header={['学生id', '听讲行为频率', '阅读与练习频率', '发言频率', '讨论频率', '无关行为频率', '所属图谱', '所属知识点']}
                        data={MockFeatureVariableData}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

/**
 * ! 特征工程流程控制与执行: 定量
 */
interface FeatureEngineerQuantityState {
    handleCloseFeatureQuantity: () => void;
}
const FeatureEngineerQuantity: React.FC<FeatureEngineerQuantityState> = ({
    handleCloseFeatureQuantity
}) => {
    const classes = useStyles();

    const Step1FeatureEngineer = () => {
        // 点击可拖拽的按钮
        const [clickElementValue, setClickElementValue] = useState('');
        // 输入数据
        const [inputDataState, setInputDataState] = useState('');
        // 特征模型: 因子分析
        const [textValue, setTextValue] = useState('');

        const handleElementClick = (event, element) => {
            setClickElementValue(element.data.label);
        };

        const handleInputDataState = (event: React.ChangeEvent<{ value: unknown }>) => {
            setInputDataState(event.target.value as string);
        };

        const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setTextValue(event.target.value);
        }

        return (
            <div>
                {/* 特征工程流程图操作 */}
                {/* <DragFlow
                    heads={['输入数据', '特征模型', '输出结果']}
                    subHeads={['选择需要处理的数据', '选择适当的特征模型', '确定输出结果']}
                    contents={'featureEngineer'}
                    // handleElementClick={handleElementClick}
                /> */}
                {/* <Flow /> */}
                <Workbench />
            </div>
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
                    <h3>选择关联的知识图谱</h3>
                    <div style={{ width: 200 }}>
                        <SelectFormsErrorVerification
                            label={'选择所属知识图谱'}
                            value={values}
                            items={['数学-简易方程', '数学-平面几何', '数学-统计与概率']}
                            handleChangeSelect={handleChangeSelect}
                        />
                    </div>
                    <h3>选择关联的知识点</h3>
                    {/* <TransferListBox
                        toBeSelectedItems={['知识点1', '知识点2', '知识点3', '知识点4', '知识点5']}
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
                        <h2>将输出结果与知识图谱建立关联</h2>
                    </Grid>
                    <Grid item style={{ paddingTop: 21 }}>
                        <Button variant="outlined" color="primary" onClick={handleOpenDialog}>选择关联图谱</Button>
                    </Grid>
                </Grid>
                <DataTable
                    header={['学生id', '听讲行为频率', '阅读与练习频率', '发言频率', '讨论频率', '无关行为频率']}
                    data={MockFeatureEngineerResult}
                />
                {/* Dialog: 选择关联的知识图谱 */}
                <DialogBox
                    boxSize={'md'}
                    openDialog={openDialog}
                    handleCloseDialog={handleCloseDialog}
                    title={'选择特征变量所关联的知识图谱与知识点'}
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
                <h2>输出特征变量表</h2>
                <DataTable
                    header={['学生id', '听讲行为频率', '阅读与练习频率', '发言频率', '讨论频率', '无关行为频率', '所属图谱', '所属知识点']}
                    data={MockFeatureVariableData}
                />
            </div>
        );
    }

    return (
        <div className={classes.quantityRoot}>
            {/* title & return button */}
            {/* <Grid
                className={classes.detailHeaderImg}
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography className={classes.titleText} variant="h5">学生课堂行为变量表 —— 定量特征工程</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ExitToAppIcon />}
                    onClick={handleCloseFeatureQuantity}
                >
                    返回首页
                </Button>
            </Grid>
            <br /> */}
            {/* Content */}
            <StepperBox
                stepsTitle={['特征工程处理流程设计', '输出结果与图谱关联建立', '输出特征变量表']}
                stepsContent={[
                    <Step1FeatureEngineer />,
                    <Step2Data />,
                    <Step3FeatureDataTable />
                ]}
                finishMsg={'已完成变量的特征工程处理！'}
                handleFinish={handleCloseFeatureQuantity}
            />
        </div>
    );
};

/**
 * ! 特征工程流程控制与执行: 定性
 */
interface FeatureEngineerQualityState {
    handleCloseFeatureQuality: () => void;
}
const FeatureEngineerQuality: React.FC<FeatureEngineerQualityState> = ({
    handleCloseFeatureQuality
}) => {
    const classes = useStyles();

    return (
        <>
            {/* title & return button */}
            <Grid
                className={classes.detailHeaderImg}
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography className={classes.titleText} variant="h5">学生项目学习表现 —— 定性特征工程</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ExitToAppIcon />}
                    onClick={handleCloseFeatureQuality}
                >
                    返回首页
                </Button>
            </Grid>
            <br />
            {/* Content */}
        </>
    );
};

// 教育特征数据处理主页面
export const AdminFeatureEngineeringPage: React.FC = () => {
    // 打开特征变量表细节页面
    const [openPages, setOpenPages] = useState(false);
    // 打开新建特征工程流程页面: 定量
    const [openFeatureQuantity, setOpenFeatureQuantity] = useState(false);
    // 打开新建特征工程流程页面: 定性
    const [openFeatureQuality, setOpenFeatureQuality] = useState(false);

    const handleOpenPage = () => {
        setOpenPages(true);
    };

    const handelClosePage = () => {
        setOpenPages(false);
    };

    const handleOpenFeatureQuantity = () => {
        setOpenFeatureQuantity(true);
    };

    const handleCloseFeatureQuantity = () => {
        setOpenFeatureQuantity(false);
    };

    const handleOpenFeatureQuality = () => {
        setOpenFeatureQuality(true);
    };

    const handleCloseFeatureQuality = () => {
        setOpenFeatureQuality(false);
    };

    if (openPages) {
        return (
            <FeatureVariableDetail
                handleClosePage={handelClosePage}
            />
        );
    } else if (openFeatureQuantity) {
        return (
            <FeatureEngineerQuantity
                handleCloseFeatureQuantity={handleCloseFeatureQuantity}
            />
        );
    } else if (openFeatureQuality) {
        return (
            <FeatureEngineerQuality
                handleCloseFeatureQuality={handleCloseFeatureQuality}
            />
        );
    } else {
        return (
            <FeatureVariableTableList
                handleOpenPage={handleOpenPage}
                handleOpenFeatureQuantity={handleOpenFeatureQuantity}
                handleOpenFeatureQuality={handleOpenFeatureQuality}
            />
        );
    }
};