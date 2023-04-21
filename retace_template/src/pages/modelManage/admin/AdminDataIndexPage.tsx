import React, { useState } from 'react';
// import MD Style & Components
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import MD icons
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import customize components
import {
    IntroduceBox, TreeStructure, DataTable, KnowledgeGraph
} from '../../../components/common/';
// import Mock Data
import { dataIndexIntroduction, EducationIndexTree, KnowledgeGraphTree } from '../../../settings/projectMockData';
import Button from '@material-ui/core/Button';

const useStyle = makeStyles((theme: Theme) => createStyles({
    textTitle: {
        margin: 10,
        color: theme.palette.type === 'light' ? (theme.palette.grey[800]) : (theme.palette.grey[200])
    },
    pageTitle: {
        margin: '20px 0 10px 0'
    },
    pageContent: {
        padding: '20px 30px'
    },
    indexIntoText: {
        textAlign: 'center',
        margin: '100px 0',
        color: theme.palette.grey[400]
    }
}));

/**
 * ! 学科知识图库页面
 */
const KnowledgeGraphPage = ({
    handleClosePage
}) => {
    const classes = useStyle();
    // knowledge graph open state
    const [open, setOpen] = useState(false);

    const handleOpenKnowledgeGraph = () => {
        setOpen(true);
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
                <Typography className={classes.pageTitle} variant="h5">学科知识图谱</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ExitToAppIcon />}
                    onClick={handleClosePage}
                >
                    返回指标库首页
                </Button>
            </Grid>
            {/* content */}
            <Grid container spacing={2}>
                <Grid item md={3} sm={12}>
                    <Card>
                        <CardContent>
                            <h3 className={classes.textTitle}>知识图谱列表</h3>
                            <TreeStructure
                                data={EducationIndexTree}
                                minHeight={240}
                                handleClick={handleOpenKnowledgeGraph}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={9} sm={12}>
                    <Card>
                        <CardContent>
                            {
                                open ? (
                                    <KnowledgeGraph />
                                ) : (
                                    <div className={classes.indexIntoText}>
                                        <h2>点击对应项目即可查看知识图谱</h2>
                                    </div>
                                )
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

/**
 * ! 教育评价指标库页面
 */
const EducationIndexPage = ({
    handleClosePage
}) => {
    const classes = useStyle();
    const [open, setOpen] = useState(false);

    // open index detail page
    const handleOpenIndexContent = () => {
        setOpen(true);
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
                <Typography className={classes.pageTitle} variant="h5">教育评价指标库</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ExitToAppIcon />}
                    onClick={handleClosePage}
                >
                    返回指标库首页
                </Button>
            </Grid>
            {/* content */}
            <Grid container spacing={2}>
                <Grid item md={3} sm={12}>
                    <Card>
                        <CardContent>
                            <h3 className={classes.textTitle}>指标项列表</h3>
                            <TreeStructure
                                data={EducationIndexTree}
                                minHeight={240}
                                handleClick={handleOpenIndexContent}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={9} sm={12}>
                    <Card>
                        {
                            open ? (
                                <CardContent className={classes.pageContent}>
                                    <h2>核心素养-自主发展-学会学习：等级指标体系</h2>
                                    <h3>一级水平: 计划、评价学习和行为，努力改善自学与自做</h3>
                                    <DataTable
                                        header={['维度', '表现']}
                                        data={[
                                            ['明确目标', '与自己认为合适的人一起制定目标，确保制定的目标是自己所期望的'],
                                            ['执行计划', '依据行动要点，及时完成任务，寻求别人的帮助，采取不同的学习方法参与实际的活动']
                                        ]}
                                    />
                                    <h3>二级水平: 计划和评价学习，进一步改山行为，评价自己的进步</h3>
                                    <DataTable
                                        header={['维度', '表现']}
                                        data={[
                                            ['有帮助地制定目标', '提供准备的信息，以便制定几周内能达到的实际的目标，举例说明自己希望达到的目标'],
                                            ['实施计划', '利用行动要点帮助安排好时间，需要时即使调整计划，选用不同的学习方法，拜托依附式的指导'],
                                            ['评价进步和成绩', '了解已经学习了什么、是如何学习地，提供成功与否地信息']
                                        ]}
                                    />
                                    <h3>三级水平: 认定目标，事实计划，寻求别人的反馈和帮助，并未自己的成绩提供确定的证明</h3>
                                    <DataTable
                                        header={['维度', '表现']}
                                        data={[
                                            ['认定目标', '利用各种信息识别自己期望的目标的途径，预先估计可能出现的问题，明确其他的行动方案'],
                                            ['实施计划', '为达成目标，知道需要优先采取一些什么样的行动，克服一切困难，随情况的变化而调整实施计划'],
                                            ['评价进步和成绩', '了解自己的学习和行动的质量，包括内容、方法等方面，概述影响自己学习结果的因素，认识已经实现的目标']
                                        ]}
                                    />
                                </CardContent>
                            ) : (
                                <div className={classes.indexIntoText}>
                                    <h2>点击对应指标项，查看具体的指标等级体系</h2>
                                </div>
                            )
                        }
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};


/**
 * ! 教育数据指标库主页面内容
 */
export const AdminDataIndexPage: React.FC = () => {
    // style
    const classes = useStyle();
    // state
    const [open, setOpen] = useState({
        knowledgeGraphPage: false,
        educationIndexPage: false,
    });
    // data index introduce array
    const item1 = dataIndexIntroduction[0];
    const item2 = dataIndexIntroduction[1];

    // set all page to false: close page
    const handleClosePage = () => {
        setOpen({
            ...open,
            knowledgeGraphPage: false,
            educationIndexPage: false,
        });
    };

    // open index page
    const handleOpenPage = (page: string) => {
        handleClosePage();
        setOpen({
            ...open,
            [page]: true,
        });
    };

    if (open.knowledgeGraphPage) {
        return (
            <KnowledgeGraphPage
                handleClosePage={handleClosePage}
            />
        );
    } else if (open.educationIndexPage) {
        return (
            <EducationIndexPage
                handleClosePage={handleClosePage}
            />
        );
    }
    return (
        <div>
            <Typography className={classes.pageTitle} variant="h5">教育数据指标库</Typography>
            <Grid container spacing={2}>
                <Grid item md={6} sm={12}>
                    <IntroduceBox
                        img={item1['img']}
                        title={item1['title']}
                        introduce={item1['introduce']}
                        actionName={item1['actionName']}
                        action={() => handleOpenPage(item1['actionKey'])}
                    />
                </Grid>
                <Grid item md={6} sm={12}>
                    <IntroduceBox
                        img={item2['img']}
                        title={item2['title']}
                        introduce={item2['introduce']}
                        actionName={item2['actionName']}
                        action={() => handleOpenPage(item2['actionKey'])}
                    />
                </Grid>
            </Grid>
        </div>
    );
};