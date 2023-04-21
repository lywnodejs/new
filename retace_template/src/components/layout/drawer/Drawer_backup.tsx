import React, {useState} from 'react';
// improt MD style
import clsx from 'clsx';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
// import img
import userBackground from '../../../assets/image/user-info.jpg';
import userPicture from '../../../assets/image/users/3.jpg';
// import MD components
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
// import MD icons
import MenuIcon from '@material-ui/icons/Menu';
import SettingsSystemDaydreamIcon from '@material-ui/icons/SettingsSystemDaydream';
import AssignmentIcon from '@material-ui/icons/Assignment';
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';
import StorageIcon from '@material-ui/icons/Storage';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import CastForEducationIcon from '@material-ui/icons/CastForEducation';
import FilterDramaIcon from '@material-ui/icons/FilterDrama';
import FaceIcon from '@material-ui/icons/Face';
import SwitchCameraIcon from '@material-ui/icons/SwitchCamera';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import WidgetsIcon from '@material-ui/icons/Widgets';
import SettingsIcon from '@material-ui/icons/Settings';
import EmailIcon from '@material-ui/icons/Email';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
// import Redux
import { useSelector } from '../../../redux/hooks';
import { useDispatch } from 'react-redux';
import { activeLeftDrawerItem, openItemToPageTabs } from '../../../redux/openPageTabs/slice';
import { UserSlice } from '../../../redux/userLogin/slice';
// import Router
import { useHistory } from 'react-router-dom';

// Current Page Style
const drawerWidth = 240;
const useStyle = makeStyles((theme: Theme) => createStyles({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        // zIndex: theme.zIndex.drawer + 1,
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(7) + 1,
        },
    },
    drawerContainer: {
        overflowY: 'auto',
        overflowX: 'hidden',
        marginBottom: 55,
        // zIndex: theme.zIndex.drawer + 1,
        // background: 'green',
        '&::-webkit-scrollbar': {
            width: 5,
            backgroundColor: '#ffffff',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#cecdcdb8',
            borderRadius: '2px',
        },
    },
    hide: {
        display: 'none',
    },
    toolbar: {
        backgroundImage: `url(${userBackground})`,
        minHeight: '145px !important',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 2),
        color: '#e8e8e8',
        backgroundSize: '240px',
        // backgroundPosition: 0,
        // necessary for content to be below app bar
        // ...theme.mixins.toolbar,
    },
    menuButton: {
        marginTop: 5,
    },
    userHeader: {
        marginTop: 30,
        marginRight: 110,
        width: theme.spacing(6),
        height: theme.spacing(6),
        boxShadow: '0px 0px 20px #294761',
    },
    useNameBox: {
        background: '#00000099',
        marginTop: -35,
        color: '#ffffff',
        height: 35,
        lineHeight: '35px',
        fontSize: 15,
        paddingLeft: 25,
        letterSpacing: '2px',
    },
    menuIcon: {
        minWidth: 40
    },
    bottomNavLight: {
        overflow: 'hidden',
        borderTop: '1px solid #e2e2e2',
        borderRight: '1px solid #e2e2e2',
        position: 'fixed',
        bottom: 0,
        zIndex: theme.zIndex.drawer + 1,
        width: 240,
    },
    bottomNavDark: {
        overflow: 'hidden',
        borderTop: '1px solid #5f5f5f',
        borderRight: '1px solid #5f5f5f',
        position: 'fixed',
        bottom: 0,
        zIndex: theme.zIndex.drawer + 1,
        width: 240,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

export const LeftDrawer = () => {
    // style
    const classes = useStyle();
    // router
    const history = useHistory();
    // redux
    const dispatch = useDispatch();
    const themeMode = useSelector(state => state.theme.currentMode);
    // get drawer items
    const projectNavMenuItems = useSelector(state => state.openPage.projectNavMenu);
    const openPagesTabs = useSelector(state => state.openPage.pageTabsOpenedItems);
    // 默认为 系统管理员-0
    const projectUserAuthorizationCategories = useSelector(state => state.openPage.projectUserAuthorization)[0].menuList;
    const projectUserAuthorizationRouter = useSelector(state => state.openPage.projectUserAuthorization)[0].router;
    let category = {
        currentCategory: projectUserAuthorizationCategories[0],
        isFirst: true,
    };
    // drawer open state
    const [open, setOpen] = useState(true);
    // drawer item state
    const [itemsState, setItemsState] = useState({
        activeItem: '主页',
    });

    // open drawer
    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    // active left drawer item
    const handleItemActive = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        activeItem: string,
    ) => {
        // change item state
        setItemsState({
            ...itemsState,
            activeItem: activeItem
        });

        // dispatch action to redux store
        dispatch(activeLeftDrawerItem(activeItem));
        dispatch(openItemToPageTabs({
            openItemName: activeItem, currentOpenPagesTabs: openPagesTabs
        }));

        // router change inorder to open this page
        if (activeItem === '主页'){
            history.push('/');
        } else {
            let userRouter = projectUserAuthorizationRouter;
            let pageRouter = '';
            // find active page router
            projectNavMenuItems.map(item => {
                if (item.title === activeItem){
                    pageRouter = item.router;
                }
            });
            history.push(userRouter+pageRouter);
        }
    };

    // log out
    const handleUserLogOut = () => {
        dispatch(UserSlice.actions.logout());
        history.push('/login');
    };

    return (
        <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            classes={{
                paper: clsx({
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
            }}
        >
            <Toolbar/>
            <div className={classes.drawerContainer}>
                {/* user info */}
                <div className={classes.toolbar}>
                    <Avatar
                        alt="User Picture" src={userPicture} className={classes.userHeader}
                    />
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="end"
                        className={classes.menuButton}
                        key={'open-drawer'}
                    >
                        <MenuIcon/>
                    </IconButton>
                </div>
                <div className={clsx(classes.useNameBox, {[classes.hide]: !open})}>
                    Franz Zhao
                </div>
                {/* Project Nav Menu*/}
                <ListItem
                    button key={'home'}
                    // selected={'主页' === itemsState.activeItem}
                    onClick={(event) => handleItemActive(event, '主页')}
                >
                    <ListItemIcon className={classes.menuIcon} key={`home-list-icon`}>
                        <HomeIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary={'主页'} key={`home-list-text`}/>
                </ListItem>
                {
                    projectNavMenuItems.map((item, index) => {
                        let newCategory = item.category;
                        // 权限验证
                        if (projectUserAuthorizationCategories.includes(newCategory)){
                            if (
                                newCategory === category.currentCategory && category.isFirst
                            ){
                                category.isFirst = false;
                                return (
                                    <div key={`${item.title}-div`}>
                                        <Divider/>
                                        <List
                                            subheader={
                                                <ListSubheader className={clsx({[classes.hide]: !open})}
                                                >{item.category}</ListSubheader>
                                            }
                                            key={`${item.title}-list`}
                                        >
                                        </List>
                                        <ListItem
                                            button key={`${item.title}-list-item`}
                                            // selected={item.title === itemsState.activeItem}
                                            onClick={(event) => handleItemActive(event, item.title)}
                                        >
                                            <ListItemIcon className={classes.menuIcon} key={`${item.title}-list-icon`}>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={item.title} key={`${item.title}-list-text`}/>
                                        </ListItem>
                                    </div>
                                );
                            } else {
                                if (projectNavMenuItems.length > (index+1) && projectNavMenuItems[index+1].category !== category.currentCategory){
                                    category.currentCategory = projectNavMenuItems[index+1].category;
                                    category.isFirst = true;
                                }
                                return (
                                    <ListItem
                                        button key={`${item.title}-list-item`}
                                        // selected={item.title === itemsState.activeItem}
                                        onClick={(event) => handleItemActive(event, item.title)}
                                    >
                                        <ListItemIcon className={classes.menuIcon} key={`${item.title}-list-icon`}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.title} key={`${item.title}-list-text`}/>
                                    </ListItem>
                                );
                            }
                        }
                    })
                }
            </div>
            <BottomNavigation
                showLabels
                className={clsx({
                    [classes.bottomNavLight]: themeMode === 'light',
                    [classes.bottomNavDark]: themeMode === 'dark',
                    [classes.hide]: !open
                })}
            >
                <Tooltip title="设置" arrow>
                    <BottomNavigationAction icon={<SettingsIcon/>} style={{color: "#8c8c8c"}} key={'设置'}/>
                </Tooltip>
                <Tooltip title="联系我们" arrow>
                    <BottomNavigationAction icon={<EmailIcon/>} style={{color: "#8c8c8c"}} key={'联系我们'}/>
                </Tooltip>
                <Tooltip title="退出" arrow>
                    <BottomNavigationAction
                        icon={<ExitToAppIcon/>} style={{color: "#8c8c8c"}} key={'退出'}
                        onClick={handleUserLogOut}
                    />
                </Tooltip>
            </BottomNavigation>
        </Drawer>
    );
};