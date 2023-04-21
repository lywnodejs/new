import Task from 'app/sdl/Task.vue'
import Project from 'app/sdl/Project.vue'
import VulnerList from 'app/sdl/VulnerList.vue'
import Vulner from 'app/sdl/Vulner.vue'
import SdlRule from 'app/sdl/Rule.vue'
import RptList from 'app/report/RptList.vue'
import AlarmEvent from 'app/alarm/event.vue'
import AlarmJudge from 'app/alarm/judge.vue'
import RptEdit from 'app/report/RptEdit.vue'
import ManageEvent from 'app/alarm/manageEventLists.vue'
import ManageEventDetail from 'app/alarm/eventDetail.vue'
import ManageEventEdit from 'app/alarm/manageEventEdit.vue'
import NotifyConfig from 'app/alarm/notify/notifyConfig.vue'
import InStats from 'app/inStats/secevent.vue'
import irftEvent from 'app/inStats/irftEvent.vue'
import platformIndicator from 'app/inStats/platformIndicator.vue'
import summaryIndicator from 'app/inStats/summaryIndicator.vue'
import deptInterfacer from 'app/deptInterfacer/index.vue'
import EvaluationAdmin from 'app/compliance/evaluation/index_admin.vue'
import EvaluationUser from 'app/compliance/evaluation/index_user.vue'


import EvaluationDetail from 'app/compliance/evaluation/detail/index.vue'

import EvaluationAssessmentDetail from 'app/compliance/evaluation/bp/assessment/index.vue'
import EvaluationAssessmentEvaChk from 'app/compliance/evaluation/bp/assessment/index_admin_evachk.vue'

import EvaluationCreate from 'app/compliance/evaluation/bp/create/index.vue'
import EvaluationEdit from 'app/compliance/evaluation/bp/edit/index.vue'
import EvaluationConfirm from 'app/compliance/evaluation/bp/confirm/index.vue'
import EvaluationCheckList from 'app/compliance/evaluation/checklist/index.vue'
import EvaluationActivate from 'app/compliance/evaluation/bp/activate/index.vue'
import EvaluationFeedback from 'app/compliance/evaluation/user/feedback/index.vue'
import EvaluationFeedbackEdit from 'app/compliance/evaluation/user/feedback/feedback.vue'
import EvaluationFeedbackView from 'app/compliance/evaluation/user/feedback/feedbackDetail.vue'

// 自评估整改
import EvaluationSelfEva from 'app/compliance/evaluation/bp/assessment/index_user_eva.vue'
import EvaluationRepair from 'app/compliance/evaluation/bp/assessment/index_user_repair.vue'
import EvaluationFeedbackUser from 'app/compliance/evaluation/bp/assessment/index_user_feedback.vue'

// 评估 检查 自评估 整改详情页
import EvaluationObjectCheck from 'app/compliance/evaluation/bp/evaobj/check.vue'
import EvaluationObjectEval from 'app/compliance/evaluation/bp/evaobj/eval.vue'
import EvaluationSelfEvaDetail from 'app/compliance/evaluation/bp/evaobj/selfeval.vue'
import EvaluationRepairDetail from 'app/compliance/evaluation/bp/evaobj/repair.vue'

import EvaluationObjectView from 'app/compliance/evaluation/bp/evaobj/view.vue'
import EvaluationContentView from 'app/compliance/evaluation/bp/evaobj/viewContent.vue'




export const ROUTES = [{
    path: '/',
    redirect: '/secEvent/event'
}, {
    path: '/sdl-index',
    component: Task
}, {
    path: '/sdl-task/:project_id',
    name: 'SdlProject',
    component: Task
}, {
    path: '/sdl-proj',
    component: Project
}, {
    path: '/sdl-vul/:project_id/:task_id',
    name: 'SdlVulner',
    component: VulnerList
}, {
    path: '/sdl-hist/:project_id',
    name: 'SdlHist',
    component: VulnerList
}, {
    path: '/sdl-audit/:task_id/:readonly',
    name: 'SdlAudit',
    component: Vulner
}, {
    path: '/sdl-rule',
    name: 'SdlRule',
    component: SdlRule
}, {
    path: '/alarm/event',
    name: 'AlarmEvent',
    component: AlarmEvent
}, {
    path: '/secEvent/event',
    name: 'ManageEvent',
    component: ManageEvent
}, {
    path: '/secEvent/detail',
    name: 'ManageEventDetail',
    component: ManageEventDetail
}, {
    path: '/secEvent/edit',
    name: 'ManageEventEdit',
    component: ManageEventEdit
}, {
    path: '/secEvent/config',
    name: 'NotifyConfig',
    component: NotifyConfig
}, {
    path: '/alarm/judge/:alarm_id',
    name: 'AlarmJudge',
    component: AlarmJudge
}, {
    path: '/report/list',
    name: 'RptList',
    component: RptList
}, {
    path: '/report/edit',
    name: 'RptEdit',
    component: RptEdit
}, {
    path: '/secevent',
    name: 'secevent',
    component: InStats
}, {
    path: '/irftEvent',
    name: 'irftEvent',
    component: irftEvent
}, {
    path: '/platform',
    name: 'platform',
    component: platformIndicator
}, {
    path: '/secplate',
    name: 'secplate',
    component: summaryIndicator
}, {
    path: '/dept-interfacer',
    name: 'deptInterfacer',
    component: deptInterfacer
}, {
    path: '/compliance/evaluation',
    name: 'EvaluationAdmin',
    component: EvaluationAdmin
}, {
    path: '/compliance/evaluation/common',
    name: 'EvaluationUser',
    component: EvaluationUser
}, {
    path: '/compliance/evaluation/detail',
    name: 'EvaluationDetail',
    component: EvaluationDetail
}, {
    path: '/compliance/evaluation/assessment/detail',
    name: 'EvaluationAssessmentDetail',
    component: EvaluationAssessmentDetail
}, {
    path: '/compliance/evaluation/assessment/evachk',
    name: 'EvaluationAssessmentEvaChk',
    component: EvaluationAssessmentEvaChk

}, {
    path: '/compliance/evaluation/bp/create',
    name: 'EvaluationCreate',
    component: EvaluationCreate
}, {
    path: '/compliance/evaluation/bp/edit',
    name: 'EvaluationEdit',
    component: EvaluationEdit
}, {
    path: '/compliance/evaluation/bp/confirm',
    name: 'EvaluationConfirm',
    component: EvaluationConfirm
}, {
    path: '/compliance/evaluation/bp/selfeva',
    name: 'EvaluationSelfEva',
    component: EvaluationSelfEva
}, {
    path: '/compliance/evaluation/bp/selfeva/detail',
    name: 'EvaluationSelfEvaDetail',
    component: EvaluationSelfEvaDetail
}, {
    path: '/compliance/evaluation/bp/repair/detail',
    name: 'EvaluationRepairDetail',
    component: EvaluationRepairDetail
}, {
    path: '/compliance/evaluation/bp/repair',
    name: 'EvaluationRepair',
    component: EvaluationRepair
}, {
    path: '/compliance/evaluation/bp/feedback',
    name: 'EvaluationFeedbackUser',
    component: EvaluationFeedbackUser
}, {
    path: '/compliance/evaluation/checklist',
    name: 'EvaluationCheckList',
    component: EvaluationCheckList
}, {
    path: '/compliance/evaluation/bp/activate',
    name: 'EvaluationActivate',
    component: EvaluationActivate
}, {
    path: '/compliance/evaluation/user/feedback',
    name: 'EvaluationFeedback',
    component: EvaluationFeedback
}, {
    path: '/compliance/evaluation/user/feedback/edit',
    name: 'EvaluationFeedbackEdit',
    component: EvaluationFeedbackEdit
}, {
    path: '/compliance/evaluation/user/feedback/view',
    name: 'EvaluationFeedbackView',
    component: EvaluationFeedbackView
}, {
    path: '/compliance/evaluation/bp/evaobj/view',
    name: 'EvaluationObjectView',
    component: EvaluationObjectView
}, {
    path: '/compliance/evaluation/bp/evacontent/view',
    name: 'EvaluationContentView',
    component: EvaluationContentView
}, {
    path: '/compliance/evaluation/bp/evaobj/check',
    name: 'EvaluationObjectCheck',
    component: EvaluationObjectCheck
}, {
    path: '/compliance/evaluation/bp/evaobj/eval',
    name: 'EvaluationObjectEval',
    component: EvaluationObjectEval
}, {
    path: '*',
    beforeEnter(req, rsp, next) {
        //console.log(req.path, rsp.path)
        //req.replace(rsp.path)
        location.href = '/project/portals/pages/404.html'
        //history.replaceState(rsp.path, '404', '/project/portals/pages/404.html')
    }
}]
