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
        boxShadow: '0 3px 20px 0px #ffb64a',
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
        background: theme.palette.secondary.main,
        padding: '5px 30px',
        textAlign: 'center',
    },
    customNodeBody: {
        backgroundColor: theme.palette.common.white,
        padding: '10px 30px',
        textAlign: 'center',
    },
    customNodeHandle: {
        width: 8,
        height: 8,
        background: '#6c81a1',
    }
}));

interface InputNodeState {
    data: any;
    selected: boolean;
};

export const InputNode: React.FC<InputNodeState> = ({ data, selected }) => {
    const classes = useStyles();

    // 选中测试
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
                <div>
                    {data.text}
                </div>
                <Tooltip title="将输入数据的输出口连接到另一模块的输入口" arrow>
                    <Handle
                        className={classes.customNodeHandle}
                        type="source"
                        position={Position.Right}
                        id="a"
                        style={{ top: '70%', }}
                    />
                </Tooltip>
            </div>
        </div>
    );
}
