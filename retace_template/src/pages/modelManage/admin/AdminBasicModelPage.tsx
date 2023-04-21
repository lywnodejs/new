import React, { useState } from 'react';
// import MD style & components
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
// import customize components
import { TreeStructure } from '../../../components/common';
// import Mock Data
import { analysisModels } from '../../../settings/projectMockData';
import mockPicture from '../../../assets/image/models/decisionTreeExample.jpg';


const useStyle = makeStyles((theme: Theme) => createStyles({
    pageTitle: {
        margin: '20px 0 10px 0'
    },
    textTitle: {
        margin: 10,
        color: theme.palette.type === 'light' ? (theme.palette.grey[800]) : (theme.palette.grey[200])
    },
    textContent: {
        "&>*": {
            margin: 10,
            color: theme.palette.type === 'light' ? (theme.palette.grey[800]) : (theme.palette.grey[200])
        },
    },
    textIntro: {
        textAlign: 'center',
        margin: '20px 0px',
        color: theme.palette.type === 'light' ? (theme.palette.grey[500]) : (theme.palette.grey[200])
    }
}));

export const AdminBasicModelPage: React.FC = () => {
    const classes = useStyle();
    // state
    const [open, setOpen] = useState(false);

    // open model introduction
    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <>
            <Typography className={classes.pageTitle} variant="h5">基础模型管理</Typography>
            <Grid container spacing={2}>
                {/* data list */}
                <Grid item md={3} sm={12}>
                    <Card>
                        <CardContent>
                            <h3 className={classes.textTitle}>模型列表</h3>
                            <TreeStructure
                                data={analysisModels}
                                minHeight={300}
                                handleClick={handleOpen}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                {/* data content */}
                <Grid item md={9} sm={12}>
                    <Card>
                        {
                            open ? (
                                <CardContent className={classes.textContent}>
                                    <h2>监督学习模型：决策树</h2>
                                    <h3>模型简介</h3>
                                    <p>
                                        决策树(Decision Tree）是在已知各种情况发生概率的基础上，通过构成决策树来求取净现值的期望值大于等于零的概率，评价项目风险，判断其可行性的决策分析方法，是直观运用概率分析的一种图解法。由于这种决策分支画成图形很像一棵树的枝干，故称决策树。在机器学习中，决策树是一个预测模型，他代表的是对象属性与对象值之间的一种映射关系。
                                    </p>
                                    <h3>模型适用场景</h3>
                                    <p>
                                        分类树（决策树）是一种十分常用的分类方法。它是一种监督学习，所谓监督学习就是给定一堆样本，每个样本都有一组属性和一个类别，这些类别是事先确定的，那么通过学习得到一个分类器，这个分类器能够对新出现的对象给出正确的分类。这样的机器学习就被称之为监督学习。
                                    </p>
                                    <h3>模式应用案例</h3>
                                    <p><img src={mockPicture} alt="决策树案例" style={{ width: 450 }} /></p>
                                    <h3>模型数据输入</h3>
                                    <p>
                                        各种不同的、期望用于对分析对象/因变量进行分类（如学习风格分类、成就等级、学习策略等因变量）的自变量（如性别、年纪、习惯、使用策略、时长、点击次数等）。
                                    </p>
                                    <h3>模型可控参数</h3>
                                    <p>
                                        决策树的复杂度（CP）、是否剪枝
                                    </p>
                                    <h3>模型输出结果</h3>
                                    <p>
                                        因变量的分类概率（如依据自变量进行划分，可以将学生的学习策略划分为哪个类别，其预测概率为多少等）
                                    </p>
                                </CardContent>
                            ) : (
                                <CardContent className={classes.textIntro}>
                                    <h2>点击模型查看该分类体系的具体信息介绍</h2>
                                </CardContent>
                            )
                        }
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};