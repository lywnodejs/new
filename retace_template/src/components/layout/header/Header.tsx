import React, {useState} from 'react';
// import img
import logo from '../../../assets/image/logo.png';
// import MD style
import {alpha, createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// import MD components
import {AppBar, Avatar, Badge, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography} from '@material-ui/core';
// import MD icons
import NotificationsIcon from '@material-ui/icons/Notifications';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import MenuIcon from '@material-ui/icons/Menu';
// import Redux
import {useSelector} from '../../../redux/hooks';
import {useDispatch} from "react-redux";
import { UserSlice } from '../../../redux/userLogin/slice';
// import Router
import { useHistory } from 'react-router-dom';
// import ThemeMode Redux Action
import {changeCurrentThemeMode} from '../../../redux/ThemeMode/slice';
// import avatar
import userPicture from '../../../assets/image/users/3.jpg';
// import drawer
import {LeftDrawer, BreadCrumbs} from '../'

// Current Page Style
const useStyle = makeStyles((theme: Theme) => createStyles({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        // boxShadow: 'none',
        boxShadow: '0 0 8px 0 rgb(0 0 0 / 10%)'
    },
    logo: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        // color: theme.palette.common.white,
    },
    leftBar: {
        marginRight: theme.spacing(1),
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
    topMenu: {
        marginTop: 40,
    },
    smallAvatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    subHeader: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.menu.light: theme.palette.menu.main
    },
    header: {
        backgroundColor: theme.palette.menu.dark,
    },
    menuButton: {
        margin: 'auto 5px'
    }
}));

export const Header = () => {
    // style
    const classes = useStyle();
    const matches = useMediaQuery('(min-width:440px)');
    // redux store
    const currentTheme = useSelector(state => state.theme.currentMode);
    const userName = useSelector(state => state.user.userName) || '张老师'
    // redux dispatch
    const dispatch = useDispatch();
    // router
    const history = useHistory();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState(true);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleUserLogOut = () => {
        dispatch(UserSlice.actions.logout());
        history.push('/login');
    };


    const handleChangeTheme = () => {
        // Dispatch action message to reducer
        if (currentTheme === 'light') {
            dispatch(changeCurrentThemeMode('dark'));
        } else {
            dispatch(changeCurrentThemeMode('light'));
        }
    };
    
    const handleDrawerOpen = (open) => {
        setOpen(open);
    };

    return (
        <>
            <AppBar
                position="fixed"
                className={classes.appBar}
            >
                <Toolbar variant="dense" className={classes.header} >
                    {/* <Avatar alt="Logo" src={logo} className={classes.logo}/> */}
                    <Typography variant="h6" className={classes.title}>
                        {matches && 'e2Lab | 教育数据治理平台'}
                    </Typography>
                    <Tooltip title='查看消息通知' arrow>
                        <IconButton
                            aria-controls="simple-menu" aria-haspopup="true" 
                            aria-label="show 17 new notifications" color="inherit"
                            className={classes.leftBar}
                        >
                            <Badge badgeContent={17} color="secondary">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {
                        currentTheme === 'light' ? (
                            <Tooltip title='切换为深色模式' arrow>
                                <IconButton
                                    aria-controls="simple-menu" aria-haspopup="true"
                                    onClick={handleChangeTheme}
                                    aria-label="show 17 new notifications" color="inherit"
                                    className={classes.leftBar}
                                >
                                    <Brightness4Icon/>
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip title='切换为浅色模式' arrow>
                                <IconButton
                                    aria-controls="simple-menu" aria-haspopup="true"
                                    onClick={handleChangeTheme}
                                    aria-label="show 17 new notifications" color="inherit"
                                    className={classes.leftBar}
                                >
                                    <BrightnessHighIcon/>
                                </IconButton>
                            </Tooltip>
                        )
                    }
                    <Tooltip title={userName} arrow >
                        <IconButton
                            color="inherit"
                            onClick={handleClick}
                            style={{padding: 0}}
                        >
                            <Avatar src={userPicture} className={classes.smallAvatar}  />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        className={classes.topMenu}
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>我的空间</MenuItem>
                        <MenuItem onClick={handleUserLogOut}>退出登录</MenuItem>
                    </Menu>
                </Toolbar>
                <Toolbar variant="dense" className={classes.subHeader} disableGutters >
                    <IconButton
                        color="default"
                        aria-label="open drawer"
                        onClick={()=>handleDrawerOpen(!open)}
                        edge="end"
                        className={classes.menuButton}
                        key={'open-drawer'}
                    >
                        <MenuIcon />
                    </IconButton>
                    
                    <BreadCrumbs />
                </Toolbar>
            </AppBar>
            <LeftDrawer open={open} handleDrawerOpen={handleDrawerOpen}/>
        </>
    );
};