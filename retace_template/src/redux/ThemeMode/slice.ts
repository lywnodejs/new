import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Light Mode & Dark Mode State
interface ThemeModeState {
    currentMode: 'light'|'dark';
    modeList: {name: '浅色模式'|'深色模式', code: 'light'|'dark'}[];
};

// Init State
const initialState: ThemeModeState = {
    currentMode: 'light',
    modeList: [
        {name:'浅色模式', code:'light'},
        {name:'深色模式', code:'dark'}
    ]
};

// action: tell reducer to change what to what
export const changeCurrentThemeMode = createAsyncThunk(
    'theme/changeTheme',
    (newMode: 'light'|'dark', thunkAPI) => {
        return newMode;
    }
);

// slice
export const ThemeModeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {},
    extraReducers:{
        // data sending
        // [changeCurrentThemeMode.pending.type]: (state) => {
        //     state.loading = true;
        // },
        // data send success: return token
        [changeCurrentThemeMode.fulfilled.type]: (state, action) => {
            state.currentMode = action.payload;
            // state.loading = false;
            // state.error = null;
        },
        // data send fail: return error msg from try-catch
        // [changeCurrentThemeMode.rejected.type]: (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // },
    }
});