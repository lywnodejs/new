import React, {useEffect} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Card, CardHeader, Divider } from '@material-ui/core';

function not(a: number[], b: number[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: number[], b: number[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

interface TransferListBoxState {
    toBeSelectedItems: any[];
    defaultSelectedItems?: any[];
    boxWidth: number | string;
    boxHeight: number | string;
    right: any[];
    setRight(item): void;
};

export const TransferListBox: React.FC<TransferListBoxState> = ({
    toBeSelectedItems, defaultSelectedItems = [], boxWidth, boxHeight,
    right, setRight
}) => {
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                margin: 'auto',
                // justifyContent: 'left !important',
            },
            paperHeader: {
                height: 40,
            },
            paper: {
                minWidth: boxWidth,
                height: boxHeight,
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                    width: 5,
                    backgroundColor: '#ffffff',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#cecdcdb8',
                    borderRadius: '2px',
                },
            },
            button: {
                margin: theme.spacing(0.5, 0),
            },
            list: {
                flex: 0.45,
            }
        }),
    );
    
    const classes = useStyles();
    const [checked, setChecked] = React.useState<number[]>([]);
    const [left, setLeft] = React.useState<any[]>(toBeSelectedItems);
    // const [right, setRight] = React.useState<any[]>(defaultSelectedItems);

    useEffect(()=>{
        setLeft(toBeSelectedItems)
    },[toBeSelectedItems])

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const customList = (title, items: number[]) => (
        <Card>
            <CardHeader className={classes.paperHeader} subheader={title} />
            <Divider />
            <List
                dense component="div" role="list" className={classes.paper}
            >
                {items.map((value: number) => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            className={classes.root}
        >
            <Grid item className={classes.list}>{customList('待选项', left)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleAllRight}
                        disabled={left.length === 0}
                        aria-label="move all right"
                    >
                        ≫
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleAllLeft}
                        disabled={right.length === 0}
                        aria-label="move all left"
                    >
                        ≪
                    </Button>
                </Grid>
            </Grid>
            <Grid item className={classes.list}>{customList('已选项', right)}</Grid>
        </Grid>
    );
}
