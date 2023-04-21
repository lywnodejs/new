export const getHistoryTask = '/ratel/task/list'

export const getVulInfo = '/ratel/vulnerability/getVulInfo'
export const getUnauditedVul = '/ratel/vulnerability/unaudited'
export const setOmissionStatus = '/ratel/vulnerability/status/set'

export const getWOInfo = '/ratel/workorder/getWOInfo'

export const getPoC = '/ratel/poc/list'
export const addPoC = '/ratel/poc/add'
export const updatePoC = '/ratel/poc/update'

export const getAssets = '/ratel/assets/list'
export const addAssets = '/ratel/assets/add'
export const updateAssets = '/ratel/assets/update'

export const uploadAPK = '/ratel/onetime/app/upload'
export const getTaskList = '/ratel/onetime/task/list'
export const createTask = '/ratel/onetime/task/create'
export const getResultByTaskId = '/ratel/onetime/result/getByTaskId'

export const getFpList = '/ratel/fp/list'
export const deleteFpById = '/ratel/fp/deleteById'

export const getRatelProjectList = '/ratel/project/list'
export const getRatelProjectDetail = '/ratel/project/detail'
export const getRatelFollower = '/ratel/project/getfollower'
export const addRatelFollower = '/ratel/project/addfollower'
export const changeRatelAppOwner = '/ratel/project/changeAppOwner'

export const getRatelTaskList = '/ratel/task/list'
export const getRatelTaskDetail = '/ratel/task/detail'
export const getListByTaskId = '/ratel/result/getListByTaskId'
export const getResultSDLMark = '/ratel/result/sdlMark'
export const getRatelCommit = '/ratel/result/commit'

export const getRatelVulList = '/ratel/vul/list'
export const getListByProjectId = '/ratel/vul/getListByProjectId'
export const getTaskListByTaskId = '/ratel/task/getListByProjectId'
export const taskClaim = '/ratel/task/claim'

export const updateVul = '/ratel/vul/update'
export const asyncVul = '/ratel/vul/sync'
export const getOneTimeByPackageName = 'ratel/onetime/result/getOnetimeByPackageName'

//  SDK资产
export const getAssetSDKList = '/ratel/asset/sdk/search'
export const createAssetSDK = '/ratel/asset/sdk/create'
export const deleteAssetSDK = '/ratel/asset/sdk/del'
export const updateAssetSDK = '/ratel/asset/sdk/update'

// export const getAssetSDKList = '/ratel/asset/sdk/list'
// export const createAssetSDK = '/ratel/asset/sdk/create'
// export const deleteAssetSDK = '/ratel/asset/sdk/delete'
// export const updateAssetSDK = '/ratel/asset/sdk/update'

export const getTaskSDK = '/ratel/task/sdk'
export const createTaskSDK = '/ratel/task/sdk/create'
export const delTaskSDK = '/ratel/task/sdk/del'
export const updateTaskSDK = '/ratel/task/sdk/update'
export const getTaskDynamic = '/ratel/task/dynamic'

//  权限列表
export const uploadExcelPermission = '/ratel/asset/permission/uploadExcel'
export const getTaskPermission = '/ratel/task/permission'
export const createTaskPermission = '/ratel/task/permission/create'
export const delTaskPermission = '/ratel/task/permission/del'
export const updateTaskPermission = '/ratel/task/permission/update'

export const getAssetPermissionList = '/ratel/asset/permission/search'
export const createAssetPermission = '/ratel/asset/permission/create'
export const deleteAssetPermission = '/ratel/asset/permission/delete'
export const updateAssetPermission = '/ratel/asset/permission/update'
