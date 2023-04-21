/**
 * * Provide a Customize Data Table
 * ! if want to add Button, just use 'actionName' & 'action'
 * ! if don't want to add Button, just want to show data content, then don't use 'actionName' & 'action'
 */

import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) => createStyles({
    tablePaper: {
        boxShadow: 'none',
        margin: '10px 0',
    },
    head: {
        backgroundColor: theme.palette.primary.dark,
        "&>*": {
            color: theme.palette.primary.contrastText,
        },
    },
    body: {
        '&>*': {
            fontSize: 15,
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
            cursor: 'pointer',
        },
    },
    actionButton: {
        marginRight: 5
    },
    overflowEllipsis: {
        maxWidth: 300,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    }
}));

interface DataTableState {
    header: string[],
    data: string[][],
    actionName?: string[],
    action?: any[],
    headMinWidth?: number | string,
    overflowEllipsis?: boolean,
}

export const DataTable: React.FC<DataTableState> = ({
    header, data, actionName, action, headMinWidth, overflowEllipsis=false
}) => {
    const classes = useStyles();

    return (
        <>
            <TableContainer component={Paper} className={classes.tablePaper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow className={classes.head} >
                            <TableCell>#</TableCell>
                            {
                                header.map((item) => (
                                    <TableCell key={item} style={{minWidth: headMinWidth}}>{item}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.map((row, index) => {
                                return (
                                    <TableRow key={index} className={classes.body}>
                                        {/* Table Number */}
                                        <TableCell component="th" scope="row">{index + 1}</TableCell>
                                        {/* Table Col Content */}
                                        {
                                            row.map((item, itemIndex) => (
                                                <TableCell 
                                                    key={`${itemIndex}_${index}`} 
                                                    className={overflowEllipsis ? classes.overflowEllipsis : ''}
                                                >
                                                    {item}
                                                </TableCell>
                                            ))
                                        }
                                        {/* Action Button */}
                                        {
                                            actionName && action && (
                                                <TableCell>
                                                    {
                                                        actionName.map((item, index) => (
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                size="small"
                                                                className={classes.actionButton}
                                                                onClick={() => action[index]()}
                                                            >
                                                                {item}
                                                            </Button>
                                                        ))
                                                    }
                                                </TableCell>
                                            )
                                        }
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer >
        </>
    );
};