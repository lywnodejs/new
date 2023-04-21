import React, {useState, useEffect} from 'react';
// import MD style
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
// import MD components
import {Breadcrumbs, Divider, Typography} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';

// import MD icon
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import HomeIcon from '@material-ui/icons/Home';
import SettingsSystemDaydreamIcon from '@material-ui/icons/SettingsSystemDaydream';
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';
import SwitchCameraIcon from '@material-ui/icons/SwitchCamera';
import AssignmentIcon from '@material-ui/icons/Assignment';
import StorageIcon from '@material-ui/icons/Storage';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import CastForEducationIcon from '@material-ui/icons/CastForEducation';
import CategoryIcon from '@material-ui/icons/Category';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import FaceIcon from '@material-ui/icons/Face';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
// import Redux
import { useSelector } from '../../../redux/hooks';

// Current Page Style
const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        marginLeft: 10,
    },
    link: {
        display: 'flex',
        fontSize: 12,
        backgroundColor: theme.palette.type === 'light' ? '#d6d7d9' : '#25282f',
        borderRadius: 6,
        padding: '4px 12px'
    },
    icon: {
        marginRight: theme.spacing(0.5),
        // marginTop: theme.spacing(0.25),
        width: 16,
        height: 16,
    },
}));

export const BreadCrumbs: React.FC = () => {
    // style
    const classes = useStyles();
    // redux
    const currentOpenedTab = useSelector(state => state.openPage.currentOpenedTab);
    // state
    const [values, setValues] = useState({
        category: currentOpenedTab.category,
        title: currentOpenedTab.title,
        icon: currentOpenedTab.icon,
    });

    useEffect(()=>{
        setValues({
            ...values,
            category: currentOpenedTab.category,
            title: currentOpenedTab.title,
            icon: currentOpenedTab.icon
        });
    }, [currentOpenedTab]);

    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb" >
                <Typography color="inherit" className={classes.link}>
                    <AccountBalanceIcon className={classes.icon}/>
                    {values.category}
                </Typography>
                {
                    values.title !== '主页' &&
                    <Typography color="inherit" className={classes.link}>
                        {/* <div className={classes.icon}> */}
                        <SvgIcon className={classes.icon} >
                            {values.icon}
                        </SvgIcon>
                        {/* </div> */}
                        {values.title}
                    </Typography>
                }
            </Breadcrumbs>
            {/* <Divider style={{marginTop: 10, marginBottom: 10}}/> */}
        </div>
    );
};