import React, { useEffect } from 'react';
// react flow
import {
    // custom node
    Handle, Position,
} from 'react-flow-renderer';
// MD
import clsx from 'clsx';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import Tooltip from '@material-ui/core/Tooltip';

// component style
const useStyles = makeStyles((theme: Theme) => createStyles({
    customNode: {
        boxShadow: '0 3px 8px 0px #8b8b8b',
    },
    customNodeSelected: {
        boxShadow: '0 3px 20px 0px #81c784',
    },
    customNodeClose: {
        fontSize: 12,
        position: 'absolute',
        right: 8,
        color: theme.palette.common.white,
        cursor: 'pointer',
        "&:hover": {
            color: theme.palette.grey[200],
        }
    },
    customNodeTitle: {
        background: theme.palette.success.light,
        padding: '5px 30px',
        textAlign: 'center',
    },
    customNodeBody: {
        backgroundColor: theme.palette.common.white,
        padding: '10px 0px',
        textAlign: 'center',
        minWidth: 150,
    },
    customNodeHandle: {
        width: 8,
        height: 8,
        background: '#6c81a1',
    },
    modelNodeSubTitle: {
        background: theme.palette.grey[200],
        width: '100%',
        padding: '2px 10px',
        marginBottom: 2,
    },
    // modeNodeInputBody: {
    //     "&:first-of-child":{
    //         paddingTop: '10px !important',
    //     }
    // },
    modelNodeText: {
        textAlign: 'center',
        padding: '3px 0 3px 8px',
        fontSize: 13,
        color: theme.palette.grey[600],
        "&:first-of-type": {
            paddingTop: 5,
        },
        "&:last-of-type": {
            paddingBottom: 5,
        },
    },
}));

interface ComputingNodeState {
    data: any;
    selected: boolean;
};

export const ComputingNode: React.FC<ComputingNodeState> = ({ data, selected }) => {
    const classes = useStyles();

    useEffect(() => {
        if (selected) {
            console.log('selected => ', data);
        }
    }, [selected]);

    return (
        <div className={clsx({
            [classes.customNode]: !selected,
            [classes.customNodeSelected]: selected,
        })}>
            <div className={classes.customNodeTitle}>
                {data.label}
                <Tooltip title="选定后按下Delete键即可删除模块" arrow>
                    <CancelIcon className={classes.customNodeClose} />
                </Tooltip>
            </div>
            <div className={classes.customNodeBody}>
                <div className={classes.modelNodeText}>点击模型以配置信息</div>
                <Tooltip title="数据输入口" arrow>
                    <Handle
                        className={classes.customNodeHandle}
                        type="target"
                        id="a"
                        position={Position.Left}
                        style={{ top: '70%' }}
                    />
                </Tooltip>
                <Tooltip title="数据输出口" arrow>
                    <Handle
                        className={classes.customNodeHandle}
                        type="source"
                        id="b"
                        position={Position.Right}
                        style={{ top: '70%' }}
                    />
                </Tooltip>
            </div>
        </div>
    );
}
