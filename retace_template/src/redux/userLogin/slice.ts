import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import API
import API from "../../settings/projectAPI.json";

// User Login Slice Interface
interface UserLoginState {
  loading: boolean;
  error: string | null;
  token: string | null;
  userName: string | null;
  userRole: string;
}

// Default State
const initialState: UserLoginState = {
  loading: false,
  error: null,
  token: null,
  userName: null,
  userRole: '',
};

// action
export const signIn = createAsyncThunk(
  //action name space
  "user/signIn",
  // async-await action func
  // async (params: {role: string, idCard: string, password: string}, thunkAPI) => {
  //     // using axios to get/post/delete... data
  //     console.log(params)
  //     const {data} = await axios({
  //         method: 'post',
  //         url: API.userAPI.loginAPI,
  //         data: {
  //             user_role: params.role,
  //             user_account: params.idCard,
  //             password: params.password
  //         }
  //     });
  //     console.log(data);
  //     return {...data, userRole: params.role};
  // }

  // 用假数据登录
  async (params: { role: string; idCard: string; password: string }) => {
    const testAwait = ({ role }) => {
      return new Promise((resolve, reject) => {
        // 目前角色：系统管理员+教研员+教师
        if (['系统管理员', '教研员', '教师'].indexOf(role) !== -1) {
          // 目前按照之前后端返回的数据结构
          resolve({
            access_token:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYzNjYyNDUxMiwianRpIjoiOTc4ZmVkMTgtZTMwZS00YzlmLWJlNjItZDMwNjZlZjE3NjQ4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJpZCI6NDU1MDk0NzY0Njg2MDE2MDAwMCwidXNlcm5hbWUiOiJcdTZkNTlcdTZjNWZcdTU5MjdcdTUzNGVcdTYyODBcdTY3MmZcdTgwYTFcdTRlZmRcdTY3MDlcdTk2NTBcdTUxNmNcdTUzZjgifSwibmJmIjoxNjM2NjI0NTEyLCJleHAiOjE2MzY2MjU0MTJ9.taY1L4H9Wv-M5pYrSQbYg4VXB22sgZYcx62-cAuzD3E",
            data: {
              username: role === '教研员' ? '王教研员': '李老师'
            }
          });
        } else {
          reject();
        }
      });
    };
    const data = await testAwait(params) as Object;
    return { ...data, userRole: params.role };
  }
);

// slice: combine of Reducer & Action
// structure of action:
// - type -> msg(tell action to do want)
// - payload -> data(what action shuold change)
export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // customize reduer
    // user logout: clear jwt
    logout: (state) => {
      state.loading = false;
      state.token = null;
      state.error = null;
      state.userName = null;
      state.userRole = '';
    },
  },
  extraReducers: {
    // data sending
    // [signIn.pending.type]: (state) => {
    //     state.loading = true;
    // },
    // data send success: return token
    [signIn.fulfilled.type]: (state, { payload }) => {
      console.log("accept", payload);
      state.token = payload.access_token;
      state.userName = payload.data.username;
      state.userRole = payload.userRole;
      state.loading = false;
      state.error = null;
    },
    // data send fail: return error msg from try-catch
    [signIn.rejected.type]: (state, action) => {
      console.log("reject");
      state.loading = false;
      state.error = action.payload;
    },
  },
});
