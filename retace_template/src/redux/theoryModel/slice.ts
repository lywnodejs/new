import { createSlice } from "@reduxjs/toolkit";
import { TheoryModelDetail } from '../../pages/modelManage/newModelManage/mockData/TheoryModel';

interface TheoryModelState {
    modelList: any[];
    currentModel: null | string;
}

const initialState: TheoryModelState = {
    modelList: TheoryModelDetail,
    currentModel: null,
}

export const TheoryModelSlice = createSlice({
    name: 'theoryModel',
    initialState,
    reducers: {
        openModel: (state, action)=>{
            state.currentModel = action.payload;
        },
        clearOpenModel: (state)=>{
            state.currentModel = null;
        }
    }
});