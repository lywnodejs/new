export const getProjectList = '/dorado/project/getlist'
export const getMyProjectList = '/dorado/project/myproject'
export const createProject = '/dorado/project/create'
export const getProjectDetail = '/dorado/project/getone'
export const updateProject = '/dorado/project/update'
export const skipDesign = '/dorado/project/skip'
export const getWorkflow = '/dorado/project/workflow'
export const confirmProjectInfo = '/dorado/project/confirm'
export const closeProjectWorkflow = '/dorado/project/workflow/close'
export const getfollower = '/dorado/project/getfollower'
export const addfollower = '/dorado/project/addfollower'

//  获取指定评估项目的评论列表
export const getComments = '/dorado/comments/list'
export const sendComments = '/dorado/comments/send'

export const fecthDesignInfo = '/dorado/evaluate/design/getone'
export const createDesign = '/dorado/evaluate/design/create'
export const deleteUploadFile = '/dorado/evaluate/design/file/delete'

export const fecthDesignResult = '/dorado/evaluate/design/result'
export const deleteDesignResult = '/dorado/evaluate/design/result/delete'
export const submitDesignResult = '/dorado/evaluate/design/result/create'
export const confirmDesignResult = '/dorado/evaluate/design/result/confirm'
export const publishDesignResult = '/dorado/evaluate/design/result/publish'
export const getAttackSurfaceList = '/dorado/evaluate/design/result/getAttackSurfaceList'
export const getDistinctFunctionModule = '/dorado/evaluate/design/result/getDistinctFunctionModule'
export const getDesignResultByFunctionModule = '/dorado/evaluate/design/result/getDesignResultByFunctionModule'

export const fecthCodeWhiteEvaluation = '/dorado/evaluate/code/white/getbypid'
export const createCodeWhiteEvaluation = '/dorado/evaluate/code/white/create'
export const updateCodeWhiteEvaluation = '/dorado/evaluate/code/white/update'
export const deleteCodeWhiteEvaluationById = '/dorado/evaluate/code/white/delete'
export const getCodeWhiteEvaluationDetail = '/dorado/evaluate/code/white/getone'
export const getRepoTree = '/dorado/evaluate/code/white/getRepoTree'

export const fecthCodeBlackEvaluation = '/dorado/evaluate/code/black/getbypid'
export const createCodeBlackEvaluation = '/dorado/evaluate/code/black/create'
export const updateCodeBlackEvaluation = '/dorado/evaluate/code/black/update'
export const deleteCodeBlackEvaluationById = '/dorado/evaluate/code/black/delete'
export const getCodeBlackEvaluationDetail = '/dorado/evaluate/code/black/getone'

export const confirmCodeEvaluationInfo = '/dorado/evaluate/code/info/confirm'

export const submitVulInfo = '/dorado/vulnerability/create'
export const getCodeVulInfo = '/dorado/vulnerability/getbypid'
export const getPreInfo = '/dorado/vulnerability/info/basic'
export const getSimpleEvaluateInfo = '/dorado/vulnerability/info/evaluate'
export const confirmCodeResult = '/dorado/vulnerability/confirm'
export const publishCodeResult = '/dorado/vulnerability/publish'
export const bindCodeResult = '/dorado/vulnerability/bind'
export const deleteCodeResult = '/dorado/vulnerability/delete'

export const startWhiteScan = '/dorado/evaluate/scan/white/start'
export const getWhiteScanStatus = '/dorado/evaluate/scan/white/status'
export const startBlackScan = '/dorado/evaluate/scan/black/start'
export const getBlackScanStatus = '/dorado/evaluate/scan/black/status'
export const syncScanVulns = '/dorado/evaluate/scan/vulns/sync'

export const ssoLogout = '/sso/account/ssologout'

export const getOdinList = '/dorado/odin/list'
export const securityApprove = '/dorado/odin/approve'
export const bindOdinProject = '/dorado/odin/bindProject'
export const odinNotify = '/dorado/odin/notify'
export const odinDetail = '/dorado/odin/getone'
export const syncOdin = '/dorado/odin/syncOdin'
export const prebindOdin = '/dorado/odin/prebind'
export const getUnbindOdin = '/dorado/odin/unbind'
export const getBindOdin = '/dorado/odin/bind'
export const deleteProject = '/dorado/project/delete'

export const getUserStatistics = '/dorado/presentation/user/statistics'
export const getProjectStatistics = '/dorado/presentation/project/statistics'
export const getProjectRecentStatistics = '/dorado/presentation/project/recent/statistics'
export const getProjectLevelStatistics = '/dorado/presentation/project/level/statistics'
export const getProjectStatusStatistics = '/dorado/presentation/project/status/statistics'
export const getTopTenStatistics = '/dorado/presentation/top/ten/statistics'
export const getVulLanguagePercentageStatistics = '/dorado/presentation/vulLanguage/percentage/statistics'
export const getProjectPercentageStatistics = '/dorado/presentation/project/percentage/statistics'
export const getDepartmentDistributionStatistics = '/dorado/presentation/department/distribution/statistics'
export const getProjectClosedLoopRateStatistics = '/dorado/presentation/closedLoop/rate/statistics'

// 基线流程 基本信息
export const regenerateBaseline = '/dorado/baseline/output/regenerate'
export const immediatelyScanBaseline = '/dorado/baseline/output/immediatelyScan'

// 基线流程 基线要求
export const getBaselineReqList = '/dorado/baseline/output/list'
export const confirmBaselineReqList = '/dorado/baseline/output/confirm'
export const remarkBaseline = '/dorado/baseline/output/remark'

// 基线流程 设计安全评估材料
export const getBaselineDesignInfo = '/dorado/baseline/material/getDesignInfo'
export const deleteBaselineUploadFile = '/dorado/baseline/material/deleteFile'
export const submitBaselineMaterial = '/dorado/baseline/material/submit'

// 基线流程 人工审计结果 & 问题列表
export const getBaselineAuditResultList = '/dorado/baseline/scan/result/list'
export const createProblem = '/dorado/baseline/scan/issue/create'
export const updateIssueStatus = '/dorado/baseline/scan/issue/update_issue_status'  // RD
export const updateRuleResult = '/dorado/baseline/scan/issue/update_false_positive'  // SDL工程师
export const updateBaselineStatus = '/dorado/baseline/output/update'
export const getBaselineRdResultList = '/dorado/baseline/scan/result/rd/list'
export const calculateScan = '/dorado/baseline/scan/calculate'
export const retestBaseline = '/dorado/baseline/output/retest'
export const getBaselineTestTaskInfo = '/dorado/baseline/scan/test_task_info'
export const scanException = '/dorado/baseline/scan/exception_scan'
export const rdmarkIssue = '/dorado/baseline/scan/issue/rd_remark'
export const ignoreException = '/dorado/baseline/scan/ignore_exception'
export const editTaskScan = '/dorado/baseline/scan/task/edit'
export const getOutputSensitive = '/dorado/baseline/output/sensitive'
export const getOutputTaskId = '/dorado/baseline/output/taskId'

// 基线流程 CodeBlackEvaluation
export const fecthBaselineCodeBlackEvaluation = '/dorado/baseline/material/black/getAll'
export const createBaselineCodeBlackEvaluation = '/dorado/baseline/material/black/create'
export const updateBaselineCodeBlackEvaluation = '/dorado/baseline/material/black/update'
export const deleteBaselineCodeBlackEvaluationById = '/dorado/baseline/material/black/delete'
export const getBaselineCodeBlackEvaluationDetail = '/dorado/baseline/material/black/getById'

// 基线流程 CodeWhiteEvaluation
export const fecthBaselineCodeWhiteEvaluation = '/dorado/baseline/material/white/getAll'
export const createBaselineCodeWhiteEvaluation = '/dorado/baseline/material/white/create'
export const updateBaselineCodeWhiteEvaluation = '/dorado/baseline/material/white/update'
export const deleteBaselineCodeWhiteEvaluationById = '/dorado/baseline/material/white/delete'
export const getBaselineCodeWhiteEvaluationDetail = '/dorado/baseline/material/white/getById'

// 添加删除基线
export const addOutputBaseline = '/dorado/baseline/output/add'
export const deleteOutputBaseline = '/dorado/baseline/output/delete'
export const listAllBaseline = '/dolphin/baseline/listAll'

//  记录点击量
export const baselineNewCTR = '/ocean/intra/baseline/NewCTR'

export const queryNewUser = '/common/user/queryNew'
export const questionnaireAuth = '/common/questionnaire/auth'
export const questionnaireNew = '/common/questionnaire/new'
