import React from 'react';
// import Pages Components
import { Header, LeftDrawer, BreadCrumbs, PageTabs, Footer } from '../../components/layout';
// import MD components
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {Toolbar} from '@material-ui/core';


// Current Page Style
const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        // padding: theme.spacing(3),
        // marginTop: 72,
        marginTop: 96,
        paddingBottom: 0,
    },
    mainContain: {
        // backgroundColor: '#eef5f9',
        backgroundColor: theme.palette.background.default,
        width: '100%',
        height: 'calc(100vh - 96px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        // padding: theme.spacing(2)
    },
}));


export const MainLayout = ({children}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {/* Page Header */}
            <Header />
            {/* Left Drawer Nav */}
            {/* <LeftDrawer /> */}
            {/* Main Content */}
            <main className={classes.content}>
                {/* <Toolbar /> */}
                {/* 面包屑导航 */}
                {/* <BreadCrumbs /> */}
                {/* 页面主体内容 */}
                <div className={classes.mainContain}>
                    {children}
                </div>
                {/* Page Footer */}
                {/* <Footer /> */}
            </main>
        </div>
    );
}
