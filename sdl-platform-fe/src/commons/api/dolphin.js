export const getVulKnowledge = '/dolphin/external/getVulKnowledge'
export const getSlnKnowledge = '/dolphin/external/getSlnKnowledge'
export const getPreInfo = '/dorado/vulnerability/info/basic'

//  威胁列表
export const getThreatList = '/dolphin/external/getThreatList'
export const updateThreatList = '/dolphin/internal/updateThreatList'
export const createThreatList = '/dolphin/internal/createThreatList'
export const disableThreatList = '/dolphin/internal/disableThreatList'
export const enableThreatList = '/dolphin/internal/enableThreatList'

//  攻击面
export const getAttackSurface = '/dolphin/external/getAttackSurface'
export const enableAttackSurface = '/dolphin/internal/enableAttackSurface'
export const disableAttackSurface = '/dolphin/internal/disableAttackSurface'
export const updateAttackSurface = '/dolphin/internal/updateAttackSurface'
export const createAttackSurface = '/dolphin/internal/createAttackSurface'

//  测试库-白盒规则
export const createWhiteRule = '/dolphin/internal/createWhiteRule'
export const getWhiteRule = '/dolphin/internal/getWhiteRule'
export const updateWhiteRule = '/dolphin/internal/updateWhiteRule'
export const disableWhiteRule = '/dolphin/internal/disableWhiteRule'
export const enableWhiteRule = '/dolphin/internal/enableWhiteRule'

//  测试库-黑盒
export const createBlackPlugin = '/dolphin/internal/createBlackPlugin'
export const updateBlackPlugin = '/dolphin/internal/updateBlackPlugin'
export const getBlackPlugin = '/dolphin/internal/getBlackPlugin'
export const disableBlackPlugin = '/dolphin/internal/disableBlackPlugin'
export const enableBlackPlugin = '/dolphin/internal/enableBlackPlugin'

//  测试库-移动端
export const createMobileRule = '/dolphin/internal/createMobileRule'
export const updateMobileRule = '/dolphin/internal/updateMobileRule'
export const getMobileRule = '/dolphin/internal/getMobileRule'
export const disableMobileRule = '/dolphin/internal/disableMobileRule'
export const enableMobileRule = '/dolphin/internal/enableMobileRule'

//  知识库-漏洞知识
export const createVulKnowledge = '/dolphin/internal/createVulKnowledge'
export const updateVulKnowledge = '/dolphin/internal/updateVulKnowledge'
export const getVulKnowledgeList = '/dolphin/internal/getVulKnowledge'
export const disableVulKnowledge = '/dolphin/internal/disableVulKnowledge'
export const enableVulKnowledge = '/dolphin/internal/enableVulKnowledge'
export const upload = '/common/file/upload'

//  知识库-安全文案
export const createSlnKnowledge = '/dolphin/internal/createSlnKnowledge'
export const updateSlnKnowledge = '/dolphin/internal/updateSlnKnowledge'
export const getSlnKnowledgeList = '/dolphin/internal/getSlnKnowledge'
export const disableSlnKnowledge = '/dolphin/internal/disableSlnKnowledge'
export const enableSlnKnowledge = '/dolphin/internal/enableSlnKnowledge'

//  关系管理
export const getVulAndSolutionIdsByThreatId = '/dolphin/management/threat/getVulAndSolutionIdsByThreatId'
export const bindVulByThreatId = '/dolphin/management/threat/bindVulByThreatId'
export const bindSolutionByThreatId = '/dolphin/management/threat/bindSolutionByThreatId'

// 测试库关系管理
export const getVulAndSolutionIdsByTestId = '/dolphin/management/test/getVulAndSolutionIdsByTestId'
export const bindVulByTestId = '/dolphin/management/test/bindVulByTestId'
export const bindSolutionByTestId = '/dolphin/management/test/bindSolutionByTestId'

// 基线管理
export const getBaselineList = '/dolphin/baseline/list'
export const createBaseline = '/dolphin/baseline/create'
export const updateBaseline = '/dolphin/baseline/update'
export const deleteBaseline = '/dolphin/baseline/delete'
export const prepareBaseline = '/dolphin/baseline/prepare'

// 基线规则管理
export const getBaselineRuleList = '/dolphin/baseline/rule/list'
export const createBaselineRule = '/dolphin/baseline/rule/create'
export const updateBaselineRule = '/dolphin/baseline/rule/update'
export const deleteBaselineRule = '/dolphin/baseline/rule/delete'
export const testBaselineRule = '/dolphin/baseline/rule/test'

// 项目等级管理
export const getProjectLevelRuleList = '/dolphin/baseline/projectLevelRule/list'
export const createProjectLevelRule = '/dolphin/baseline/projectLevelRule/create'
export const updateProjectLevelRule = '/dolphin/baseline/projectLevelRule/update'
export const deleteProjectLevelRule = '/dolphin/baseline/projectLevelRule/delete'
export const testProjectLevelRule = '/dolphin/baseline/projectLevelRule/test'

// Cobra规则
export const getCobraList = '/dolphin/cobra/list'
export const createCobraRule = '/dolphin/cobra/create'
export const updateCobraRule = '/dolphin/cobra/update'

// 基线与Cobra规则绑定
export const getTestRuleIdsByBaselineId = '/dolphin/management/baseline/getTestRuleIdsByBaselineId'
export const bindTestRuleByBaselineId = '/dolphin/management/baseline/bindTestRuleByBaselineId'

// fatbird规则
export const getFatbirdList = '/dolphin/fatbird/list'
export const createFatbirdRule = '/dolphin/fatbird/create'
export const updateFatbirdRule = '/dolphin/fatbird/update'

//  视频接口
export const getVideoList = '/dolphin/mooc/video/list'
export const getVideoPlay = '/dolphin/mooc/video/play'
export const getVideoUnfinished = '/dolphin/mooc/video/package/unfinish'
export const uploadVideoMooc = '/dolphin/mooc/video/upload'
export const finishVideoMooc = '/dolphin/mooc/video/finish'
export const importVideoMemberList = '/dolphin/mooc/member/importList'
export const createMoocTask = '/dolphin/mooc/course/package/task/create'
export const exportMemberList = '/dolphin/mooc/member/package/exportList'
export const sendVideoComment = '/dolphin/mooc/video/comment/send'
export const getVideoComment = '/dolphin/mooc/video/comment/list'
export const newQuestionnaire = '/dolphin/mooc/questionnaire/new'
export const authQuestionnaire = '/dolphin/mooc/questionnaire/auth'
export const getCourseAllList = '/dolphin/mooc/course/package/alllist'
export const getCourseList = '/dolphin/mooc/course/package/list'
