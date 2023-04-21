/**
 * ! 查看教育基础理论模型
 */
import React, { useState } from 'react';
// import customize components
import {
    TreeStructure,
    DialogBox,
    DataTable
} from '../../../components/common';
// import MD components & styles
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, CardContent, Button, Tooltip } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
// import mock data
import { basicMockClassifyTree } from '../../../settings/projectMockData';
import { TheoryModelDetail } from './mockData/TheoryModel';
// react flow
import ReactFlow, { Background, Controls, Elements, Position } from 'react-flow-renderer';
// import react-router
import { useHistory } from 'react-router';
// import redux
import { useDispatch } from 'react-redux';
import { TheoryModelSlice } from '../../../redux/theoryModel/slice';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(2),
    },
    titleText: {
        margin: '20px 0 10px 0'
    },
    cardContent: {
        height: 'calc(100vh - 190px)',
        overflow: 'auto',
    },
    cardTitle: {
        margin: 10,
        color: theme.palette.type === 'light' ? (theme.palette.grey[800]) : (theme.palette.grey[200])
    },
    textIntro: {
        display: 'flex',
        height: 'calc(100vh - 250px)',
        color: theme.palette.type === 'light' ? (theme.palette.grey[400]) : (theme.palette.grey[200]),
        "&>h1": {
            margin: 'auto'
        }
    },
}));

export const TheoryModelDetailPage: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    // state
    const [elements, setElements] = useState(TheoryModelDetail[0].elms);
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectModel, setSelectModel] = useState({});
    const [selectNode, setSelectNode] = useState<Elements>();
    // pageContent
    const [pageContent, setPageContent] = useState('map');
    // 模型列表显示与隐藏
    const [showList, setShowList] = useState(true);

    const handleOpenIndexInfo = () => {
        setPageContent("indexInfo");
    };

    const handleOpenMap = () => {
        setPageContent("map");
    }

    // open model introduction
    const handleOpen = (title: string) => {
        console.log(TheoryModelDetail);
        TheoryModelDetail.map(model => {
            if (model.name === title) {
                console.log(model);
                setSelectModel(model);
                setElements(model.elms);
            }
        })
        setOpen(true);
    };

    const onElementClick = (event, element) => {
        console.log('click', element);
        if (element.type !== 'input') {
            setOpenDialog(true);
            setSelectNode(element);
        }
    };

    return (
        <div className={classes.root}>
            <Typography className={classes.titleText} variant="h5">理论模型管理 - 查看教育基础理论模型</Typography>
            <Grid container spacing={2}>
                {
                    showList ? (
                        <Grid item md={3}>
                            <Card>
                                <CardContent className={classes.cardContent}>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Grid item>
                                            <h3 className={classes.cardTitle}>理论模型列表</h3>
                                        </Grid>
                                        <Grid item>
                                            <Tooltip title="隐藏模型列表">
                                                <IconButton aria-label="delete" onClick={() => {
                                                    setShowList(false)
                                                }}>
                                                    <ChevronLeftIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                    <TreeStructure
                                        data={basicMockClassifyTree}
                                        minHeight={300}
                                        handleClick={handleOpen}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ) : (
                        <Grid item>
                            <Tooltip title="显示模型列表">
                                <IconButton onClick={() => {
                                    setShowList(true)
                                }}>
                                    <ChevronRightIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    )
                }
                <Grid item md>
                    <Card>
                        <CardContent className={classes.cardContent}>
                            {
                                open ? (
                                    <div style={{ padding: '0 15px' }}>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Grid item>
                                                <h2>{selectModel['name']}</h2>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    onClick={() => {
                                                        dispatch(TheoryModelSlice.actions.openModel(selectModel['name']));
                                                        history.push('/admin/modelManage/theorySetting');
                                                    }}
                                                >修改</Button>&nbsp;
                                                {
                                                    pageContent === "map" ? (
                                                        <Button variant="contained" color="primary" size="small" onClick={handleOpenIndexInfo}>查看完整信息</Button>
                                                    ) : (
                                                        <Button variant="contained" color="primary" size="small" onClick={handleOpenMap}>返回模型</Button>
                                                    )
                                                }
                                            </Grid>
                                        </Grid>
                                        <div style={{ fontSize: 16 }}>{selectModel['intro']}</div>
                                        {
                                            pageContent === "map" &&
                                            <div style={{ height: 'calc(100vh - 350px)' }}>
                                                <div style={{ paddingTop: 10, color: 'steelblue' }}>点击节点查看详细信息</div>
                                                <ReactFlow
                                                    elements={elements}
                                                    onElementClick={onElementClick}
                                                    nodesDraggable={false}
                                                    zoomOnScroll={false}
                                                >
                                                    <Background color="#232323" gap={16} />
                                                    <Controls />
                                                </ReactFlow>
                                                {/* 点击节点出现弹框 */}
                                                {
                                                    selectNode &&
                                                    <DialogBox
                                                        boxSize={'md'}
                                                        openDialog={openDialog}
                                                        handleCloseDialog={() => { }}
                                                        title={(<div>{selectNode['data']['label']}: 节点信息</div>)}
                                                        content={(
                                                            <div style={{ lineHeight: '30px', fontSize: 16 }}>
                                                                <div><b>简介</b>: 这里是理论模型中属性n的简介</div>
                                                                <div><b>权重</b>: 0.6</div>
                                                                <div><b>测量方法</b>: 问卷调查、行为观察</div>
                                                                <DataTable
                                                                    header={['属性', '等级指标1', '等级指标2', '等级指标3', '等级指标4']}
                                                                    data={[['学期末美术基础知识笔试得分', '100-90', '90-80', '80-70', '70以下']]}
                                                                />
                                                            </div>
                                                        )}
                                                        action={(
                                                            <Button variant="text" color="primary" onClick={() => setOpenDialog(false)}>返回</Button>
                                                        )}
                                                    />
                                                }
                                            </div>
                                        }
                                        {
                                            pageContent === "indexInfo" &&
                                            <div>
                                                <DataTable
                                                    header={['属性', '等级指标1', '等级指标2', '等级指标3', '等级指标4']}
                                                    data={[
                                                        ['学期末美术基础知识笔试得分', '100-90', '90-80', '80-70', '70以下'],
                                                        ['学期末美术作品构图得分', '100-90', '90-80', '80-70', '70以下'],
                                                        ['学期末美术作品色彩得分', '100-90', '90-80', '80-70', '70以下'],
                                                        ['学期末美术作品内容得分', '100-90', '90-80', '80-70', '70以下'],
                                                        ['学期末美术作品创意得分', '100-90', '90-80', '80-70', '70以下'],
                                                        ['平时美术作品构图得分', '100-90', '90-80', '80-70', '70以下'],
                                                        ['平时美术作品色彩得分', '100-90', '90-80', '80-70', '70以下'],
                                                        ['平时美术作品内容得分', '100-90', '90-80', '80-70', '70以下'],
                                                        ['平时美术作品创意得分', '100-90', '90-80', '80-70', '70以下'],
                                                    ]}
                                                />
                                            </div>
                                        }
                                    </div>
                                ) : (
                                    <div className={classes.textIntro}>
                                        <h1>点击具体分类体系查看该分类的具体内容</h1>
                                    </div>
                                )
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
};