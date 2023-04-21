import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import Project Setting
import { ProjectNavMenu } from '../../settings/projectNavMenu';
import { ProjectUserAuthorization } from '../../settings/projectUserAuthorization';


// Project Nav Menu State
interface UserLoginState {
    projectNavMenu: any;
    leftDrawerActivedItem: any;
    pageTabsOpenedItems: any;
    currentOpenedTab: any;
    projectUserAuthorization: any;
}

// Default State
const initialState: UserLoginState = {
    projectNavMenu: ProjectNavMenu,
    leftDrawerActivedItem: ProjectNavMenu[0],
    pageTabsOpenedItems: [ ProjectNavMenu[0] ],
    currentOpenedTab: ProjectNavMenu[0],
    projectUserAuthorization: ProjectUserAuthorization,
};

// action: Active Left Drawer Item
export const activeLeftDrawerItem = createAsyncThunk(
    //action name space
    'openPage/activeLeftDrawerItem',
    // action func
    (activeItemName: string) => {
        let newActiveItem;
        ProjectNavMenu.map(item => {
            if (item.title === activeItemName){
                newActiveItem = item;
            }
        });
        return newActiveItem;
    }
);

// action: Open Item To PageTabs
export const openItemToPageTabs = createAsyncThunk(
    'openPage/openItemToPageTabs',
    (params: {openItemName: string, currentOpenPagesTabs: any}) => {
        let newOpenItem;            // new open item Object with full info
        let hadItem = false;        // only write new item into, if alearly had? return the old tabs
        ProjectNavMenu.map(item => {
            // find the active item
            if (item.title === params.openItemName){
                newOpenItem = item;
                // never include in currentOpenPagesTabs
                params.currentOpenPagesTabs.map(tab => {
                    if(tab.title === params.openItemName){
                        hadItem = true;
                    }
                });
            }
        });
        if (!hadItem){
            // open new item? add into action.payload in order to change staet
            return {
                pageTabsOpenedItems: [...params.currentOpenPagesTabs, newOpenItem],
                currentOpenedTab: newOpenItem,
                leftDrawerActivedItem: newOpenItem,
            };
        } else {
            // alearly open the item? just return the old array, but active the current click tab
            return {
                pageTabsOpenedItems: params.currentOpenPagesTabs,
                currentOpenedTab: newOpenItem,
                leftDrawerActivedItem: newOpenItem,
            };
        }
    }
);

// action: Close already opened Item In PageTabs
export const closeItemInPageTabs = createAsyncThunk(
    'openPage/closeItemInPageTabs',
    (params:{
        closeItemName: string,
        currentOpenPagesTabs: any,
        currentOpenedTab: any
    }, thunkAPI) => {
        let newOpenPagesTabs:any = [];
        let newCurrentOpenedTab:any;
        // if only have one page, then don't close this page
        if (params.currentOpenPagesTabs.length === 1){
            newOpenPagesTabs = [ProjectNavMenu[0]];
            newCurrentOpenedTab = ProjectNavMenu[0];
            // alert('only have one page! Do not close me pls :(');
        } else{
            let indexCnt = -1;
            let closeIndex = 0;
            let isCloseTabHadOpened = false;
            params.currentOpenPagesTabs.map(tab=>{
                indexCnt += 1;
                if (params.closeItemName === tab.title){
                    closeIndex = indexCnt;
                    // judge if close tab already opened
                    if ( tab.title === params.currentOpenedTab.title ){
                        isCloseTabHadOpened = true;
                    }
                } else {
                    newOpenPagesTabs = [...newOpenPagesTabs, tab];
                }
            });
            if (isCloseTabHadOpened){
                // close tab already opened, then we should change the new open tab
                if (closeIndex === 0){
                    newCurrentOpenedTab = newOpenPagesTabs[closeIndex];
                } else {
                    newCurrentOpenedTab = newOpenPagesTabs[closeIndex-1];
                }
            } else {
                // if close tab do not opened, then we do not need to change open tab
                newCurrentOpenedTab = params.currentOpenedTab;
            }
        }
        // return to action payload
        return {
            pageTabsOpenedItems: newOpenPagesTabs,
            currentOpenedTab: newCurrentOpenedTab,
            leftDrawerActivedItem: newCurrentOpenedTab,
        };
    }
);

// slice: combine of Reducer & Action
// structure of action:
// - type -> msg(tell action to do want)
// - payload -> data(what action should change)
export const OpenPageSlice = createSlice({
    name: 'openPage',
    initialState,
    reducers:{},
    extraReducers:{
        // left drawer menu item click to active
        [activeLeftDrawerItem.fulfilled.type]: (state, action) => {
            state.leftDrawerActivedItem = action.payload;
        },
        // open menu item to pageTabs
        [openItemToPageTabs.fulfilled.type]: (state, action) => {
            state.pageTabsOpenedItems = action.payload.pageTabsOpenedItems;
            state.currentOpenedTab = action.payload.currentOpenedTab;
            state.leftDrawerActivedItem = action.payload.leftDrawerActivedItem;
        },
        // close tabs in pageTabs
        [closeItemInPageTabs.fulfilled.type]: (state, action) => {
            state.pageTabsOpenedItems = action.payload.pageTabsOpenedItems;
            state.currentOpenedTab = action.payload.currentOpenedTab;
            state.leftDrawerActivedItem = action.payload.leftDrawerActivedItem;
        },
    }
});