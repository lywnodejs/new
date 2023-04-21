import React, { useEffect, useState } from 'react';
// improt MD style
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
// import img
import userBackground from '../../../assets/image/user-info.jpg';
import userPicture from '../../../assets/image/users/3.jpg';
import logo from '../../../assets/image/logo.png';
// import customize components
import { TextBadge } from '../../../components/common';
// import MD components
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { Badge, Card, CardHeader, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
// import MD icons
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Collapse from '@material-ui/core/Collapse';
// import Redux
import { useSelector } from '../../../redux/hooks';
import { useDispatch } from 'react-redux';
import { activeLeftDrawerItem, openItemToPageTabs } from '../../../redux/openPageTabs/slice';
import { UserSlice } from '../../../redux/userLogin/slice';
import { TheoryModelSlice } from '../../../redux/theoryModel/slice';
// import Router
import { useHistory } from 'react-router-dom';
// import ThemeMode Redux Action
import { changeCurrentThemeMode } from '../../../redux/ThemeMode/slice';
// import new nav menu
import { NewProjectNavMenu, flatNavMenu } from '../../../settings/newProjectNavMenu';


// Current Page Style
const drawerWidth = 220;
const useStyle = makeStyles((theme: Theme) => createStyles({
    logo: {
        minHeight: '64px !important',
        backgroundColor: theme.palette.menu[theme.palette.type],
        color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
        fontSize: 17,
        // borderBottom: '1px solid #4a768f',
        "& > img": {
            width: 28,
            marginRight: 10,
        },
        "& > span": {
            marginLeft: 4,
            marginBottom: 20,
            width: 32,
            height: 16,
            fontSize: 10,
            padding: '0px 4px 0px 6px',
        }
    },
    userBox: {
        backgroundColor: theme.palette.menu[theme.palette.type],
        color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
        borderRadius: 0,
        boxShadow: 'none',
        height: 65,
        marginTop: -5,
        "& span:first-of-type": {
            letterSpacing: '3px',
        },
        "& span:nth-of-type(2)": {
            color: '#93a4ad',
            fontSize: 12,
        },
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        "& .MuiDrawer-paperAnchorDockedLeft": {
            borderRight: 0,
        },
        // zIndex: theme.zIndex.drawer + 1,
        '& .MuiPaper-root': {
            backgroundColor: theme.palette.menu[theme.palette.type],
        },

        zIndex: theme.zIndex.drawer,
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
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(7),
        },
    },
    drawerContainer: {
        overflowY: 'auto',
        overflowX: 'hidden',
        marginTop: 32,
        // marginBottom: 55,
        backgroundColor: theme.palette.menu[theme.palette.type],
        color: theme.palette.grey[200],
        height: '100%',
        // zIndex: theme.zIndex.drawer + 1,
        // background: 'green',
        '&::-webkit-scrollbar': {
            width: 5,
            backgroundColor: theme.palette.menu[theme.palette.type],
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#a3a3a373',
            borderRadius: '8px',
        },
        borderRight: '1px solid #e2e2e2',
        // icon style
        '& .MuiListItemIcon-root': {
            minWidth: '38px',
        }
    },
    drawerContainerWhenClose: {
        marginBottom: 0,
        height: '100vh',
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
        color: theme.palette.grey[100],
        backgroundSize: '240px',
        // backgroundPosition: 0,
        // necessary for content to be below app bar
        // ...theme.mixins.toolbar,
    },
    menuButton: {
        // marginBottom: 5,
        marginRight: 1,
        marginLeft: 2,
    },
    menuIcon: {
        minWidth: 40,
        color: theme.palette.menu.contrastText,
    },
    menuSubTitle: {
        color: '#93a4ad',
    },
    bottomNavLight: {
        backgroundColor: '#ececec',
        overflow: 'hidden',
        // borderTop: '1px solid #4a768f',
        // borderRight: '1px solid #4a768f',
        position: 'fixed',
        bottom: 0,
        zIndex: theme.zIndex.drawer + 1,
        width: drawerWidth,
        height: 55,
        // borderRight: "1px solid #e0e0e0",
    },
    bottomNavDark: {
        backgroundColor: '#1e2a38',
        overflow: 'hidden',
        // borderTop: '1px solid #5f5f5f',
        // borderRight: '1px solid #5f5f5f',
        position: 'fixed',
        bottom: 0,
        zIndex: theme.zIndex.drawer + 1,
        width: drawerWidth,
        height: 55,
        // borderRight: "1px solid #e0e0e0",
    },
    nested: {
        paddingLeft: theme.spacing(3),
    },
    bottomNavIcon: {
        color: theme.palette.type === 'light' ? '#233044' : 'ffffff'
    },
    // root: {
    //     width: '100%',
    //     maxWidth: 360,
    //     backgroundColor: theme.palette.background.paper,
    // },
}));

interface LeftDrawerState {
    open: boolean,
    handleDrawerOpen(open: boolean): void,
}

export const LeftDrawer: React.FC<LeftDrawerState> = ({
    open, handleDrawerOpen
}) => {
    // style
    const classes = useStyle();
    // router
    const history = useHistory();
    // redux
    const dispatch = useDispatch();
    const themeMode = useSelector(state => state.theme.currentMode);
    const currentActivateItem = useSelector(state => state.openPage.leftDrawerActivedItem);
    const userName = useSelector(state => state.user.userName);
    const role = useSelector(state => state.user.userRole);
    const userRole = role || '系统管理员'
    const navMenu = NewProjectNavMenu[userRole]
    // get drawer items
    const openPagesTabs = useSelector(state => state.openPage.pageTabsOpenedItems);
    // menuList 
    const projectUserAuthorizationRouter = useSelector(state => state.openPage.projectUserAuthorization).find(el => el.role === (userRole || '系统管理员')).router;

    // drawer item state
    const [itemsState, setItemsState] = useState({
        activeItem: '主页',
    });

    // redux store
    const currentTheme = useSelector(state => state.theme.currentMode);
    const handleChangeTheme = () => {
        // Dispatch action message to reducer
        if (currentTheme === 'light') {
            dispatch(changeCurrentThemeMode('dark'));
        } else {
            dispatch(changeCurrentThemeMode('light'));
        }
    };

    // 监听路由
    useEffect(() => {
        const pageRouter = '/' + history.location.pathname.split('/').splice(2).join('/')
        let menuItem, group;
        console.log('navMenu', navMenu)
        for(let i = 0; i < navMenu?.length; i++){
            group = navMenu[i]
            menuItem = group.items.find(item => item.router === pageRouter)
            // console.log(group,menuItem)
            if(menuItem){
                break;
            }
        }
        if(menuItem){
            setItemsState({
                activeItem: menuItem.title
            })
            setOpenItem(group.category)
        }
      }, [history.location]);


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

        // 如果是从导航栏进入理论模型配置，则清空redux
        dispatch(TheoryModelSlice.actions.clearOpenModel());

        // router change in order to open this page
        if (activeItem === '主页') {
            history.push('/');
        } else {
            let userRouter = projectUserAuthorizationRouter;

            let pageRouter = flatNavMenu[userRole]?.find(el => el.title === activeItem).router || '/'
            
            // find active page router
            // projectNavMenuItems.map(item => {
            //     if (item.title === activeItem) {
            //         pageRouter = item.router;
            //     }
            // });
            
            

            // test
            if (pageRouter === '/') {
                history.push('/');
            } else {
                history.push(userRouter + pageRouter);
            }
            // handleDrawerOpen(false)
        }
    };

    // log out
    const handleUserLogOut = () => {
        dispatch(UserSlice.actions.logout());
        history.push('/login');
    };


    const [openItem, setOpenItem] = React.useState('');

    const handleOpenItem = (newCate) => {
        if (newCate === openItem) {
            setOpenItem('');
        } else {
            setOpenItem(newCate);
        }
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
            <Toolbar />
            <div className={clsx(classes.drawerContainer, {
                [classes.drawerContainerWhenClose]: !open
            })} style={{ color: 'black' }}>
                {
                    navMenu?.map(cate => {
                        return (
                            <div>
                                <ListItem button onClick={() => handleOpenItem(cate.category)}>
                                    <ListItemIcon>
                                        {cate.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={cate.category} />
                                    {openItem === cate.category ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={openItem === cate.category} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {
                                            cate.items.map(item => {
                                                return (
                                                    <ListItem
                                                        button
                                                        className={classes.nested}
                                                        
                                                        selected={item.title === itemsState.activeItem}
                                                        onClick={(event) => handleItemActive(event, item.title)}
                                                    >
                                                        <ListItemIcon>
                                                            {item.icon}
                                                        </ListItemIcon>
                                                        <ListItemText primary={item.title} />
                                                    </ListItem>
                                                );
                                            })
                                        }
                                    </List>
                                </Collapse>
                            </div>
                        );
                    })
                }
            </div>
        </Drawer>
    );
};