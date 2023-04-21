/**
 * Customize Middle
 */
import {Middleware} from "redux";

export const actionLog: Middleware = (store) => (next) => (action) => {
    console.log("更新前的state: ", store.getState());
    console.log("执行的action: ", action);
    // action分发, next就是dispatch分发函数
    next(action);
    console.log("更新后的state: ", store.getState());
}