import React, { useState } from 'react';
// import MD Style & Components
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ButtonGroup from '@material-ui/core/ButtonGroup';
// import MD Icon
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import GetAppIcon from '@material-ui/icons/GetApp';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// import customize components
import { DataTable, IntroduceBox, DialogBox } from '../../../components/common/';
// import Mock Data
import {
    standardListMockData,
    actionStandardMockData,
    dataStandardMockData,
    knowledgeMapMockData,
    dataAPIMockData,
} from '../../../settings/projectMockData';
import pdf from '../../../assets/standardDocumentExample.pdf';
// import React-PDF
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';
// Dropzone
import { Dropzone, FileItem, FullScreenPreview } from "dropzone-ui";

const useStyles = makeStyles((theme: Theme) => createStyles({
    titleText: {
        margin: '10px 0'
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
    standardDocumentList: {
        '&>*': {
            paddingBottom: 10,
        },
    },
    pdfBox: {
        padding: 30
    },
    pdfDocument: {
        border: '1px solid #737373',
        paddingLeft: 170,
    },
    pdfDownloadBtn: {
        width: '100%',
        margin: '20px 0px',
    }
}));

// XML Standard List Page
interface XMLStandardState {
    openStandardChange: (page: string) => void;
};
const XMLStandardList: React.FC<XMLStandardState> = ({
    openStandardChange
}) => {
    const classes = useStyles();

    // search checked box: 行为采集标准、知识图谱规范、数据格式标准、数据操作标准、数据接口标准、信息分类标准、元数据标准
    const [state, setState] = React.useState({
        actionStandard: true,
        knowledgeMap: true,
        dataStandard: true,
        dataManipulate: true,
        dataAPI: true,
        infoClassify: true,
        metaData: true,
    });

    const handleChangeCheckBoxes = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    return (
        <>
            <Typography className={classes.titleText} variant="h5">数据标准规范文档</Typography>
            <Grid container spacing={3}>
                <Grid item md={3}>
                    <Card>
                        <CardContent>
                            <h3 className={classes.searchTitle}>标准文档筛选</h3>
                            <FormControl component="fieldset" className={classes.formControl}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox color="primary" checked={state.actionStandard} onChange={handleChangeCheckBoxes} name="actionStandard" />}
                                        label="行为采集标准"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" checked={state.knowledgeMap} onChange={handleChangeCheckBoxes} name="knowledgeMap" />}
                                        label="知识图谱规范"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" checked={state.dataStandard} onChange={handleChangeCheckBoxes} name="dataStandard" />}
                                        label="数据格式标准"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" checked={state.dataManipulate} onChange={handleChangeCheckBoxes} name="dataManipulate" />}
                                        label="数据操作标准"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" checked={state.dataAPI} onChange={handleChangeCheckBoxes} name="dataAPI" />}
                                        label="数据接口标准"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" checked={state.infoClassify} onChange={handleChangeCheckBoxes} name="infoClassify" />}
                                        label="信息分类标准"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" checked={state.metaData} onChange={handleChangeCheckBoxes} name="metaData" />}
                                        label="元数据标准"
                                    />
                                    <Button className={classes.searchBtn} variant="outlined" color="primary" endIcon={<FindReplaceIcon />}>
                                        筛选文档
                                    </Button>
                                </FormGroup>
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={9} className={classes.standardDocumentList}>
                    <Grid container spacing={2}>
                        {
                            standardListMockData.map((item) => (
                                <Grid item md={6} key={item['actionKey']}>
                                    <IntroduceBox
                                        img={item['img']}
                                        title={item['title']}
                                        introduce={item['introduce']}
                                        actionName={item['actionName']}
                                        action={() => openStandardChange(item['actionKey'])}
                                    />
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

// XML Standard Detail Page
interface XMLStandardDetailState {
    text: string;
    data: any;
    setAllFalse: () => void;
};
const XMLStandardDetail: React.FC<XMLStandardDetailState> = ({
    text, data, setAllFalse
}) => {
    const classes = useStyles();
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [openDocument, setOpenDocument] = useState(false);

    // Dropzone
    const [files, setFiles] = useState([]);
    const [imageSrc, setImageSrc] = useState(undefined);
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
    // end dropzone

    // loading pdf document
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    // go to previous page
    const handlePreviousPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    // go to next page
    const handleNextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    // open document dialog
    const handleOpenDocument = () => {
        setOpenDocument(true);
    };

    // close document dialog
    const handleCloseDocument = () => {
        setOpenDocument(false);
    };

    // download document
    const handleDownloadDocument = () => {
        const link = document.createElement('a');
        link.setAttribute('download', '');
        link.href = pdf;
        link.click();
    };

    const PDFDocumentDialogContent = () => {
        return (
            <Grid container spacing={3}>
                <Grid item md={8}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid item>
                            <ButtonGroup color="primary" size="small" variant="text">
                                <Button
                                    startIcon={<NavigateBeforeIcon />}
                                    onClick={handlePreviousPage}
                                >
                                    上一页
                                </Button>
                                <Button
                                    endIcon={<NavigateNextIcon />}
                                    onClick={handleNextPage}
                                >
                                    下一页
                                </Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item>
                            <p>第 {pageNumber} 页 / 共 {numPages} 页</p>
                        </Grid>
                    </Grid>
                    <Document
                        className={classes.pdfDocument}
                        file={pdf}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <Page pageNumber={pageNumber} width={400} />
                    </Document>
                </Grid>
                <Grid item md={4}>
                    <h3>文档名称：</h3>
                    <p>板书行为数据采集标准XML文档-2021年版</p>
                    <h3>标准类型：</h3>
                    <p>行为采集、XML标准</p>
                    <h3>标准发布者：</h3>
                    <p>e2lab</p>
                    <h3>发布时间：</h3>
                    <p>2021年6月20日</p>
                    <h3>标准简介：</h3>
                    <p>本标准详细界定了教师常态化教学中最为常见的教学行为：板书行为的内容、形式、属性与语义。通过分区块的方式实现对教师板书的数字化采集，并结合背后的学科知识图谱实现板书的教学语义化分析。</p>
                    <Button
                        color="primary" variant="outlined"
                        className={classes.pdfDownloadBtn}
                        endIcon={<GetAppIcon />}
                        onClick={handleDownloadDocument}
                    >
                        标准文档下载
                    </Button>
                </Grid>
            </Grid>

        );
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
                <Typography className={classes.titleText} variant="h5">{text}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ExitToAppIcon />}
                    onClick={setAllFalse}
                >
                    返回标准列表
                </Button>
            </Grid>
            {/* standard documents table */}
            <Grid>
                <Grid item md={12}>
                    <DataTable
                        header={["标准文档", "标准类型", "发布者", "发布时间", "操作"]}
                        data={data}
                        actionName={['查看文档']}
                        action={[handleOpenDocument]}
                    />
                </Grid>
            </Grid>
            <DialogBox
                boxSize={'lg'}
                openDialog={openDocument}
                handleCloseDialog={handleCloseDocument}
                title={'教师板书行为数据采集标准'}
                content={<PDFDocumentDialogContent />}
                action={
                    <Button onClick={handleCloseDocument} color="primary" autoFocus>
                        确认
                    </Button>
                }
            />
        </>
    );
};

// Main Component Interface
interface OpenStandardState {
    actionStandard: boolean
    dataStandard: boolean
    dataAPI: boolean
    knowledgeMap: boolean
};

// Main Component
export const AdminXmlStandardPage: React.FC = () => {
    // Standard Documents Open State
    const [openStandard, setOpenStandard] = useState<OpenStandardState>({
        actionStandard: false,
        dataStandard: false,
        knowledgeMap: false,
        dataAPI: false,
    });

    // close Standard Page to Standard List Page
    const setAllFalse = () => {
        setOpenStandard({
            ...openStandard,
            actionStandard: false,
            dataStandard: false,
            knowledgeMap: false,
            dataAPI: false,
        })
    }

    // Open Standard Page
    const handleOpenStandard = (page: string) => {
        setAllFalse();
        setOpenStandard({
            ...openStandard, [page]: true
        });
    };

    return (
        <div style={{padding: 16}}>
            {
                !openStandard.actionStandard &&
                !openStandard.dataStandard &&
                !openStandard.dataAPI &&
                !openStandard.knowledgeMap &&
                <XMLStandardList
                    openStandardChange={handleOpenStandard}
                />
            }
            {
                openStandard.actionStandard &&
                <XMLStandardDetail
                    text={'教师板书行为数据采集标准'}
                    data={actionStandardMockData}
                    setAllFalse={setAllFalse}
                />
            }
            {
                openStandard.dataStandard &&
                <XMLStandardDetail
                    text={'学生行为数据XML格式规范'}
                    data={dataStandardMockData}
                    setAllFalse={setAllFalse}
                />
            }
            {
                openStandard.knowledgeMap &&
                <XMLStandardDetail
                    text={'数学学科知识图谱规范'}
                    data={knowledgeMapMockData}
                    setAllFalse={setAllFalse}
                />
            }
            {
                openStandard.dataAPI &&
                <XMLStandardDetail
                    text={'数据传输接口规范'}
                    data={dataAPIMockData}
                    setAllFalse={setAllFalse}
                />
            }

        </div>
    );
}