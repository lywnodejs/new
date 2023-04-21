import {
  getSubordinate,
  fetchPermissionCount,
  fetchPermissionList,
  permissionClose,
  fetchReviewList,
  fetchReviewUserList,
  fetchReviewUserPermissionCount,
  fetchReviewUserPermissionList,
  reviewClose,
  reviewOpen,
  reviewConfirm,
  reviewOpenConfirm,
  reviewCloseCount,
  reviewOpenCount,
  reviewSubmit,
  getAppPermissionReviewList,
  fetchMyApproveList,
  fetchApproveUserList,
  fetchApproveUserPermissionCount,
  fetchApproveUserPermissionList,
  closeApproveConfirmList,
  closeApproveCount,
  openApproveConfirmList,
  openApproveCount,
  approveSubmit,
  fetchPermissionNum,
  reviewUserAreaTree,
  reviewUserSubmitAreaTree
} from '../services/review';
import { getReviewDetail } from '../services/manageReview';

const PAGE_SIZE = 20;

export default {
  namespace: 'review',

  state: {
    subordinate: [],
    permission: {},
    loading: false,
    permissionData: [],
    reviewList: [],
    reviewUserList: [],
    reviewUserPermissionCount: {},
    reviewUserPermissionList: [],
    reviewConfirmList: [],
    reviewOpenConfirmList: [],
    useApps: [],
    closeCount: {
      AREA: 0,
      ROLE: 0,
      FLAG: 0
    },
    openCount: {
      AREA: 0,
      ROLE: 0,
      FLAG: 0
    },
    approveList: [],
    approveUserList: [],
    approveUserPermissionCount: {},
    approveUserPermissionList: [],
    closeApproveConfirmList: [],
    closeApproveCount: {
      AREA: 0,
      ROLE: 0,
      FLAG: 0
    },
    openApproveConfirmList: [],
    openApproveCount: {
      AREA: 0,
      ROLE: 0,
      FLAG: 0
    },
    permissionNumList: [], // 将保留和删除权限的数量列表
    loadings: {}
  },

  effects: {
    *fetchUseApps({ payload }, { call, put }) {
      const useApps = yield call(getAppPermissionReviewList, payload);
      yield put({
        type: 'save',
        payload: {
          useApps
        }
      });
    },
    *fetchSubordinate({}, { call, put, select }) {
      const subordinate = yield call(getSubordinate, { appId: 888 });

      yield put({
        type: 'save',
        payload: {
          subordinate
        }
      });
    },

    *fetchPermission({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });

      const { appId, username } = payload;
      const permission = yield call(fetchPermissionCount, {
        appId: appId || 888,
        username
      });

      yield put({
        type: 'save',
        payload: {
          permission,
          loading: false
        }
      });
    },

    *fetchPermissionList({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });

      const data = yield call(fetchPermissionList, {
        ...payload
        // size: PAGE_SIZE
      });

      yield put({
        type: 'save',
        payload: {
          permissionData: data,
          loading: false
        }
      });
    },

    *permissionClose({ payload }, { call }) {
      return yield call(permissionClose, payload);
    },

    *reviewClose({ payload }, { call }) {
      return yield call(reviewClose, payload);
    },

    *reviewOpen({ payload }, { call }) {
      return yield call(reviewOpen, payload);
    },

    *fetchReviewList({ payload }, { call, put }) {
      yield put({
        type: 'saveLoading',
        payload: {
          fetchReviewList: true
        }
      });
      try {
        const reviewList = yield call(fetchReviewList, payload);

        yield put({
          type: 'save',
          payload: {
            reviewList
          }
        });
      } catch (error) {
      } finally {
        yield put({
          type: 'saveLoading',
          payload: {
            fetchReviewList: false
          }
        });
      }
    },

    *fetchReviewUserList({ payload }, { call, put }) {
      try {
        const reviewUserList = yield call(fetchReviewUserList, payload);

        yield put({
          type: 'save',
          payload: {
            reviewUserList
          }
        });
        return {
          success: true,
          reviewUserList
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },
    *fetchReviewUserPermissionCount({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });

      const reviewUserPermissionCount = yield call(
        fetchReviewUserPermissionCount,
        payload
      );

      yield put({
        type: 'save',
        payload: {
          reviewUserPermissionCount,
          loading: false
        }
      });
    },

    *fetchReviewUserPermissionList({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });

      const data = yield call(fetchReviewUserPermissionList, {
        ...payload
        // size: PAGE_SIZE
      });
      yield put({
        type: 'save',
        payload: {
          reviewUserPermissionList: data,
          loading: false
        }
      });
      return data;
    },

    // 获取review详情
    *fetchReviewDetail({ payload }, { call, put }) {
      try {
        const reviewDetail = yield call(getReviewDetail, payload);
        return {
          success: true,
          result: reviewDetail
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    *fetchReviewConfirmList({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });

      const data = yield call(reviewConfirm, {
        ...payload
      });

      yield put({
        type: 'save',
        payload: {
          reviewConfirmList: data,
          loading: false
        }
      });
    },

    *fetchReviewCloseCount({ payload }, { call, put }) {
      const data = yield call(reviewCloseCount, payload);

      yield put({
        type: 'save',
        payload: {
          closeCount: data
        }
      });
    },

    *fetchReviewOpenConfirmList({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });

      const data = yield call(reviewOpenConfirm, {
        ...payload
      });

      yield put({
        type: 'save',
        payload: {
          reviewOpenConfirmList: data,
          loading: false
        }
      });
    },

    *fetchReviewOpenCount({ payload }, { call, put }) {
      const data = yield call(reviewOpenCount, payload);

      yield put({
        type: 'save',
        payload: {
          openCount: data
        }
      });
    },

    *reviewSubmit({ payload }, { call }) {
      try {
        const result = yield call(reviewSubmit, payload);
        return {
          success: true,
          result
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    *reviewSubmitAreaTree({ payload }, { call }) {
      try {
        const result = yield call(reviewUserSubmitAreaTree, payload);
        return {
          success: true,
          result
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    *getReviewUserAreaTree({ payload }, { call }) {
      try {
        const result = yield call(reviewUserAreaTree, payload);
        return {
          success: true,
          result
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    // 我的权限审核
    *fetchMyApproveList({ payload }, { call, put }) {
      yield put({
        type: 'saveLoading',
        payload: {
          fetchMyApproveList: true
        }
      });
      try {
        const approveList = yield call(fetchMyApproveList, payload);

        yield put({
          type: 'save',
          payload: {
            approveList
          }
        });
      } catch (error) {
      } finally {
        yield put({
          type: 'saveLoading',
          payload: {
            fetchMyApproveList: false
          }
        });
      }
    },
    *fetchApproveUserList({ payload }, { call, put }) {
      try {
        const approveUserList = yield call(fetchApproveUserList, payload);

        yield put({
          type: 'save',
          payload: {
            approveUserList
          }
        });
        return {
          success: true,
          approveUserList
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    *fetchApproveUserPermissionCount({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });

      const approveUserPermissionCount = yield call(
        fetchApproveUserPermissionCount,
        payload
      );

      yield put({
        type: 'save',
        payload: {
          approveUserPermissionCount,
          loading: false
        }
      });
    },

    *fetchApproveUserPermissionList({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });

      const data = yield call(fetchApproveUserPermissionList, {
        ...payload
      });
      yield put({
        type: 'save',
        payload: {
          approveUserPermissionList: data,
          loading: false
        }
      });
      return data;
    },
    *fetchCloseApproveConfirmList({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });

      const data = yield call(closeApproveConfirmList, {
        ...payload
      });

      yield put({
        type: 'save',
        payload: {
          closeApproveConfirmList: data,
          loading: false
        }
      });
    },

    *fetchCloseApproveCount({ payload }, { call, put }) {
      const data = yield call(closeApproveCount, payload);

      yield put({
        type: 'save',
        payload: {
          closeApproveCount: data
        }
      });
    },

    *fetchOpenApproveConfirmList({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });

      const data = yield call(openApproveConfirmList, {
        ...payload
      });

      yield put({
        type: 'save',
        payload: {
          openApproveConfirmList: data,
          loading: false
        }
      });
    },

    *fetchOpenApproveCount({ payload }, { call, put }) {
      const data = yield call(openApproveCount, payload);

      yield put({
        type: 'save',
        payload: {
          openApproveCount: data
        }
      });
    },

    *approveSubmit({ payload }, { call }) {
      try {
        const result = yield call(approveSubmit, payload);
        return {
          success: true,
          result
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    *fetchPermissionNum({ payload }, { call, put }) {
      const data = yield call(fetchPermissionNum, payload);

      yield put({
        type: 'save',
        payload: {
          permissionNumList: data
        }
      });

      return data;
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveLoading(state, action) {
      return {
        ...state,
        loadings: {
          ...state.loadings,
          ...action.payload
        }
      };
    }
  }
};
