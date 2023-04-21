import React from 'react';
import { Divider } from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
    footerMarginTop: {
        marginTop: theme.spacing(4),
        // marginBottom: theme.spacing(1)
    },
    footer: {
        textAlign: 'center',
        height: '40px',
        lineHeight: '40px',
        fontSize: 15,
        color: '#adadad',

    }
}));

export const Footer = () => {
    const classes = useStyles();

    return (
        <div className={classes.footerMarginTop}>
            <Divider />
            <footer className={classes.footer}>Copyright © 2021 e2lab.</footer>
        </div>
    );
};