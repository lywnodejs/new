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
        padding: '2px 0',
    },
    // modeNodeInputBody: {
    //     "&:first-of-child":{
    //         paddingTop: '10px !important',
    //     }
    // },
    modelNodeInputText: {
        textAlign: 'left',
        padding: '3px 0 3px 8px',
        fontSize: 13,
        color: theme.palette.grey[600],
        "&:first-of-type": {
            paddingTop: 10,
        },
        "&:last-of-type": {
            paddingBottom: 10,
        },
    },
    modelNodeOutputText: {
        textAlign: 'right',
        padding: '3px 8px 3px 0',
        fontSize: 13,
        color: theme.palette.grey[600],
        "&:first-of-type": {
            paddingTop: 10,
        },
    }
}));

interface ModelNodeState {
    data: any;
    selected: boolean;
};

export const ModelNode: React.FC<ModelNodeState> = ({ data, selected }) => {
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
                {/* input */}
                <div className={classes.modelNodeSubTitle}>输入</div>
                <div>
                    <div className={classes.modelNodeInputText}>数据集</div>
                    <div className={classes.modelNodeInputText}>标量</div>
                </div>
                <Handle
                    className={classes.customNodeHandle}
                    type="target"
                    id="targetA"
                    position={Position.Left}
                    style={{ top: '44%' }}
                />
                <Handle
                    className={classes.customNodeHandle}
                    type="target"
                    id="targetB"
                    position={Position.Left}
                    style={{ top: '56%' }}
                />
                {/* output */}
                <div className={classes.modelNodeSubTitle}>输出</div>
                <div>
                    <div className={classes.modelNodeOutputText}>指标</div>
                </div>
                <Handle
                    className={classes.customNodeHandle}
                    type="source"
                    id="sourceA"
                    position={Position.Right}
                    style={{ top: '88%', }}
                />
            </div>
        </div>
    );
}
