/*
 * @Author: GuoTeng
 * @Date: 2020-07-07 16:33:30
 * @LastEditors: GuoTeng
 * @LastEditTime: 2020-12-16 10:24:51
 */

import { fetchApproveDetail, fetchApproveWorkflow } from '../services/approve';
import { routerRedux } from 'dva/router';
import uaParser from '@utils/uaParser.js';
import { MOB } from '@routes/config';
import { MAIN } from '@/entry/mobile/routes/config';

export default {
  namespace: 'approveDetail',

  state: {
    // 申请的详情
    detail: {}
  },

  subscriptions: {
    // 黄老师需求2019-05-31: 移动端不是审批详情页的url都跳到审批列表页
    setup({ history, dispatch }) {
      history.listen(({ pathname }) => {
        // if (pathname.indexOf(`${MOB}/approve-detail`) == -1 && pathname.indexOf(MAIN) == -1) {
        //   if (uaParser.isMobile()) {
        //     window.location.href = MAIN
        //   }
        // }
        if (
          pathname.indexOf(`${MAIN}/approve-detail`) == -1 &&
          pathname !== `${MAIN}`
        ) {
          if (uaParser.isMobile()) {
            let url = MAIN;
            // 移动端打开PC端审批详情地址，跳转到移动端审批详情地址
            if (pathname.indexOf('/upm2-static/main/approve-detail') > -1) {
              const id = pathname.split('/').pop();
              url = `${MAIN}/approve-detail/${id}`;
            }
            window.location.href = url;
          }
        }
      });
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const { approveId } = payload;

      const detail = yield call(fetchApproveDetail, approveId);
      yield put({
        type: 'save',
        payload: {
          detail
        }
      });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
