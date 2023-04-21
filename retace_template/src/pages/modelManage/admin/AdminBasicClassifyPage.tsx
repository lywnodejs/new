import React, { useState } from 'react';
// import MD style & components
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
// import customize components
import { TreeStructure, ClassifyCard } from '../../../components/common';
// import mock data
import { basicMockClassifyTree } from '../../../settings/projectMockData';
import { classifyTree } from '../../../settings/projectMockClassifyTreeData';
// echarts
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { TreeChart } from 'echarts/charts';
import { SVGRenderer } from 'echarts/renderers';

// Register the required components
echarts.use(
    [TreeChart, SVGRenderer]
);

const options = {
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
    },
    series: [
        {
            type: 'tree',
            data: [classifyTree],
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',
            symbolSize: 7,
            label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 9
            },
            leaves: {
                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                }
            },
            emphasis: {
                focus: 'descendant'
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
        }
    ]
};

const useStyle = makeStyles((theme: Theme) => createStyles({
    pageTitle: {
        margin: '10px 0'
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

export const AdminBasicClassifyPage: React.FC = () => {
    const classes = useStyle();
    // state
    const [open, setOpen] = useState(false);

    // open model introduction
    const handleOpen = () => {
        setOpen(true);
    };

    const list = [{
        caption: '分类名1',
        description: '描述',
        itemList: [
            '类1', '类2', '类3', '类4'
        ]
    },{
        caption: '分类名2',
        description: '描述',
        itemList: [
            '类1', '类2', '类3', '类4'
        ]
    },{
        caption: '分类名3',
        description: '描述',
        itemList: [
            '类1', '类2', '类3', '类4'
        ]
    },]

    return (
        <div style={{padding: 16}}>
            <Typography className={classes.pageTitle} variant="h5">分类体系管理</Typography>
            <Grid container spacing={2}>
                {
                    list.map((el, idx) => {
                        return (
                            <Grid item>
                                <ClassifyCard {...el}/>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </div>
    );
}
