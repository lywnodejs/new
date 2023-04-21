import {
    fetchPermissionGroup,
    addPermissionGroup,
    removePermissionGroup,
    modifyPermissionGroup,
    fetchGroup2User,
    bindUsers,
    unBindUsers,
    fetchBindPermissionSystem,
    fetchPermissionSystemAndPoint,
    fetchAllPermissionPoint,
    managePermissionPoint
  } from '../services/permissionGroup';
  
  const SIZE = 10;
  const APPID = 888;
  
  export default {
    namespace: 'permissionGroup',
  
    state: {
      permissionGroupList: {
        records: [],
        loading: false,
        total: 0
      },
      // 所有的数据
      userList: {
        users: [],
        loading: false
      },
      // 展示的数据，前端过滤
      showUserList: [],
      // 选择的子系统，id的Array
      selectSubsystem: [],
      // 子系统所有的权限点，通过check表示是否绑定
      subsystemPoint: {},
      // 选择的权限点
      selectPoint: []
    },
  
    subscriptions: {},
  
    effects: {
      *fetchPermissionGroupList ({ payload }, { call, put }) {
        yield put({
          type: 'save',
          payload: {
            permissionGroupList: {
              loading: true
            }
          }
        });
  
        const {
          size=SIZE
        }  = payload;
        const data = yield call(fetchPermissionGroup, {...payload, size})
        return yield put({
          type: 'save',
          payload: {
            permissionGroupList: {
              ...data,
              loading: false
            }
          }
        });
      },
      *addNewPermissionGroup ({ payload }, {call}) {
        return yield call(addPermissionGroup, {...payload})
      },
      *removePermissionGroup ({ payload }, { call }) {
        return yield call(removePermissionGroup, {...payload})
      },
      *modifyPermissionGroup ({ payload }, { call }) {
        return yield call(modifyPermissionGroup, {...payload})
      },
      *fetchGroup2User ({ payload }, { call, put }) {
        yield put({
          type: 'save',
          payload: {
            userList: {
              loading: true
            }
          }
        });
        const data = yield call(fetchGroup2User, {...payload})
        yield put({
          type: 'save',
          payload: {
            userList: {
              ...data,
              loading: false
            }
          }
        });
        return yield put({
          type: 'save',
          payload: {
            showUserList: data.users
          }
        })
      },
      *bindUsers ({ payload }, { call }) {
        return yield call(bindUsers, {...payload})
      },
      *unBindUsers ({ payload }, { call }) {
        return yield call(unBindUsers, {...payload})
      },
      *search ({ payload }, { put, select }) {
        const searchContent = payload.searchContent
        const userList = yield select(state => state.permissionGroup.userList)
        const result = userList.users.filter(i => {
          return i.username.indexOf(searchContent) > -1 || i.zh.indexOf(searchContent) > -1
        })
        return yield put({
          type: 'save',
          payload: {
            showUserList: result
          }
        })
      },
      // 保存已经选择的子系统，同时获取它们权限点
      *saveSelectSubsystem ({ payload }, { put, select, call }) {
        const subsystemPoint = yield select(state => state.permissionGroup.subsystemPoint)
  
        for (let i = 0; i < payload.data.length; i++) {
          const appIdRel = Number(payload.data[i])
          // 如果是新选中的子系统，那么就请求对应的权限点
          if (!subsystemPoint[appIdRel]) {
            const params = {
              groupId: payload.groupId,
              appId: payload.appId,
              appIdRel
            }
            const data = yield call(fetchAllPermissionPoint, params)
            subsystemPoint[appIdRel] = data
          }
        }
        console.log('m', subsystemPoint)
  
        yield put({
          type: 'save',
          payload: {
            subsystemPoint,
            selectSubsystem: payload.data
          }
        })
      },
      // 获取【已选择】的子系统和其对应的【所有】权限点
      *fetchPermissionSystemAndPoint ({ payload }, { put, call }) {
        const data = yield call(fetchPermissionSystemAndPoint, payload)
        const subsystemPoint = {}
        const selectPoint = []
  
        // 构造每个子系统的权限点的结构
        for (let i = 0; i < data.points.length; i++) {
          const p = data.points[i]
          const appIdRel = p.id
          subsystemPoint[appIdRel] = p
  
          // 构造选择的权限点
          for (let j = 0; j < p.role.length; j++) {
            const node = p.role[j]
            node.checked ? selectPoint.push(`${node.id.toString()}r`) : null
          }
          for (let k = 0; k < p.rolegroup.length; k++) {
            const node = p.rolegroup[k]
            node.checked ? selectPoint.push(`${node.id.toString()}g`) : null
          }
        }
  
        return yield put ({
          type: 'save',
          payload: {
            selectPoint,
            subsystemPoint,
            selectSubsystem: data.apps.map(i => Number(i.id)),
          }
        })
      },
      *saveSelectPoint ({ payload }, { put }) {
        return yield put ({
          type: 'save',
          payload: {
            selectPoint: payload.selectPoint
          }
        })
      },
      *managePermissionPoint ({ payload }, { call }) {
        return yield call(managePermissionPoint, payload)
      }
    },
  
    reducers: {
      save(state, { payload }) {
        return { ...state, ...payload };
      },
    }
  }
  