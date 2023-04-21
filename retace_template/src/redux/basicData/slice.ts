import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// 保存筛选项选项以保证能够在基础数据页面和教学数据页面进行跳转

interface areaOptionProps{
    province: string,
    city: string,
    area: string,
    school: string,
}

interface filterOptionProps{
    filterType: string;
    filterValue: string[] | string;
}

interface BasicDataFilterProps {
    areaOption: areaOptionProps,
    filterOption: filterOptionProps[],
}

// Default State
const initialState: BasicDataFilterProps = {   
    areaOption: {
        province: '',
        city: '',
        area: '',
        school: '',
    },
    filterOption: [],
};

// 省市区学校选项保存
export const setAreaOptions = createAsyncThunk(
    //action name space
    'basicData/setAreaOptions',
    // action func
    (areaOption:areaOptionProps) => {
        return areaOption
    }
);

// 年级班级等筛选项保存
export const setFilterOptions = createAsyncThunk(
    //action name space
    'basicData/setFilterOptions',
    // action func
    (filterOption: filterOptionProps[]) => {
        return filterOption
    }
);

// slice: combine of Reducer & Action
// structure of action:
// - type -> msg(tell action to do want)
// - payload -> data(what action should change)
export const BasicDataSlice = createSlice({
    name: 'basicData',
    initialState,
    reducers:{},
    extraReducers:{
        // set area option
        [setAreaOptions.fulfilled.type]: (state, action) => {
            state.areaOption = action.payload;
        },
        // set filter option
        [setFilterOptions.fulfilled.type]: (state, action) => {
            state.filterOption = action.payload
        },
    }
});