import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyle = makeStyles((theme: Theme) => createStyles({
    badge: {
        whiteSpace: 'nowrap',
        display: 'inline-block',
        padding: '1px 8px',
        borderRadius: 6,
        fontSize: 14,
    },
    primaryBadge: {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
        // border: '1px solid '+theme.palette.primary.dark,
    },
    secondaryBadge: {
        background: theme.palette.secondary.main,
        color: theme.palette.common.white,
        // border: '1px solid '+theme.palette.secondary.dark,
    },
    successBadge: {
        background: theme.palette.success.light,
        color: theme.palette.common.white,
        // border: '1px solid '+theme.palette.success.dark,
    },
    errorBadge: {
        background: theme.palette.error.light,
        color: theme.palette.common.white,
        // border: '1px solid '+theme.palette.error.dark,
    },
    greyBadge: {
        background: theme.palette.grey[600],
        color: theme.palette.common.white,
        // border: '1px solid '+theme.palette.grey[800],
    },
    infoBadge: {
        background: theme.palette.info.light,
        color: theme.palette.common.white,
        // border: '1px solid '+theme.palette.info.dark,
    }
}));

interface TextBadgeState {
    text: string,
    color: 'primary' | 'secondary' | 'success' | 'error' | 'grey' | 'info'
};

export const TextBadge:React.FC<TextBadgeState> = ({
    text, color
}) => {
    const classes = useStyle();

    return (
        <span className={clsx(classes.badge, {
            [classes.primaryBadge]: color === "primary",
            [classes.secondaryBadge]: color==="secondary",
            [classes.successBadge]: color === 'success',
            [classes.errorBadge]: color === "error",
            [classes.greyBadge]: color === "grey",
            [classes.infoBadge]: color === "info",
        })}>{text}</span>
    )
}
