import React from 'react';
// import React-Router-DOM
import {BrowserRouter, Route, Switch} from 'react-router-dom';
// import Pages
import {
    AdminActionMonitorPage,
    AdminBasicDataPage,
    AdminEducationDataPage,
    AdminBasicModelPage,
    AdminBasicClassifyPage,
    AdminBehaviorManagePage,
    AdminBehaviorRelationPage,
    AdminDataClassifyPage,
    AdminDataIndexPage,
    AdminDataManagePage,
    AdminDecisionSpace,
    AdminDecisionSupportPage,
    AdminEducationalModelPage,
    AdminFeatureEngineeringPage,
    AdminGrowthFile,
    AdminInfoManagePage,
    AdminXmlStandardPage,
    AppsActionMonitorPage,
    AppsDataManagePage,
    AppsInfoManagePage,
    AppsXmlStandardPage,
    AreaManagerDecisionSpace,
    AreaManagerGrowthFile,
    HomePage,
    LoginPage,
    RegisterPage,
    ResearcherBasicDataPage,
    ResearcherBasicModelPage,
    ResearcherDataIndexPage,
    ResearcherDecisionSpace,
    ResearcherDecisionSupportPage,
    ResearcherFeatureEngineeringPage,
    ResearcherGrowthFile,
    SchoolManagerDecisionSpace,
    SchoolManagerGrowthFile,
    StudentDecisionSpace,
    StudentGrowthFile,
    TeacherDecisionSpace,
    TeacherGrowthFile,
    TeacherDataProcessPage,
    StudentDataProcessPage,
    DataAnalysisPage,
    TGraphManagePage,
    TReportManagePage,
    
} from './pages';
// import new model manage page
import {
    TheoryModelDetailPage,
    TheoryModelSettingPage,
    AnalysisModelSettingPage,
    ModelUsingPage,
    DataReportSettingPage,
} from './pages/modelManage/newModelManage';
// import newest page: 指标库管理，度量库管理，量规库管理， 应用行为管理，行为关联管理
import {
    IndexManage, MeasureManage, ScaleManage,
    AppBehaviorManage, BehaviorAssociateMange
} from './pages';
// import layout
import {MainLayout} from './layout';

/**
 * App manily as a Router System: test
 */
const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                {/* Login & Register Route */}
                <Route path="/login" component={LoginPage} exact/>
                <Route path="/register" component={RegisterPage} exact/>
                {/* Main Layout Contains Different Route */}
                <MainLayout>
                    {/* Admin Route */}
                    <Route path="/" component={HomePage} exact/>
                    {/* Admin-厂商管理 */}
                    <Route path="/admin/appsManage/infoManage" component={AdminInfoManagePage} />
                    <Route path="/admin/appsManage/xmlStandard" component={AdminXmlStandardPage} />
                    <Route path="/admin/appsManage/behaviorManage" component={AdminBehaviorManagePage} />
                    <Route path="/admin/appsManage/dataManage" component={AdminDataManagePage} />
                    <Route path="/admin/appsManage/actionMonitor" component={AdminActionMonitorPage} />
                    {/* Admin-数据管理 */}
                    <Route path="/admin/dataManage/basicData" component={AdminBasicDataPage} />
                    <Route path="/admin/dataManage/educationData" component={AdminEducationDataPage} />
                    <Route path="/admin/dataManage/behaviorRelation" component={AdminBehaviorRelationPage} />
                    {/* Admin-模型库 */}
                    <Route path="/admin/modelManage/theoryDetail" component={TheoryModelDetailPage} />
                    <Route path="/admin/modelManage/scaleMange" component={ScaleManage} />
                    {/* Admin-模型应用 */}
                    <Route path="/admin/modelApply/modelUsing" component={ModelUsingPage} />
                    <Route path="/admin/modelApply/dataReport" component={DataReportSettingPage} />
                    {/* Admin-模型配置 */}
                    <Route path="/admin/modelSetting/theorySetting" component={TheoryModelSettingPage} />
                    <Route path="/admin/modelSetting/analysisModel" component={AnalysisModelSettingPage} />
                    {/* Admin-用户空间 */}   
                    <Route path="/admin/userSpace/growthFile" component={AdminGrowthFile} />

                    {/* Admin-旧页面 */}
                    <Route path="/admin/modelManage/dataReport" component={DataReportSettingPage} />
                    <Route path="/admin/modelManage/basicModel" component={AdminBasicModelPage} />
                    <Route path="/admin/modelManage/dataIndex" component={AdminDataIndexPage} />
                    <Route path="/admin/modelManage/dataClassify" component={AdminDataClassifyPage} />
                    <Route path="/admin/modelManage/featureEngineering" component={AdminFeatureEngineeringPage} />
                    <Route path="/admin/modelManage/educationalModel" component={AdminEducationalModelPage} />
                    <Route path="/admin/modelManage/decisionSupport" component={AdminDecisionSupportPage} />
                    <Route path="/admin/userSpace/decisionSpace" component={AdminDecisionSpace} />
                    {/* Newest Page - 指标库管理，度量库管理*/}
                    <Route path="/admin/modelManage/indexManage" component={IndexManage} />
                    <Route path="/admin/modelManage/measureManage" component={MeasureManage} />

                    {/* Apps Route */}
                    <Route path="/apps/appsManage/infoManage" component={AppsInfoManagePage}/>
                    <Route path="/apps/appsManage/xmlStandard" component={AppsXmlStandardPage}/>
                    <Route path="/apps/appsManage/dataManage" component={AppsDataManagePage}/>
                    <Route path="/apps/appsManage/actionMonitor" component={AppsActionMonitorPage}/>


                    {/* Researcher Route */}
                    {/* Researcher-厂商管理 */}
                    <Route path="/researcher/appsManage/infoManage" component={AdminInfoManagePage} />
                    <Route path="/researcher/appsManage/xmlStandard" component={AdminXmlStandardPage} />
                    <Route path="/researcher/appsManage/behaviorManage" component={AdminBehaviorManagePage} />
                    <Route path="/researcher/appsManage/dataManage" component={AdminDataManagePage} />
                    <Route path="/researcher/appsManage/actionMonitor" component={AdminActionMonitorPage} />
                    {/* Researcher-数据管理 */}
                    <Route path="/researcher/dataManage/basicData" component={AdminBasicDataPage} />
                    <Route path="/researcher/dataManage/educationData" component={AdminEducationDataPage} />
                    <Route path="/researcher/dataManage/behaviorRelation" component={AdminBehaviorRelationPage} />
                    {/* Researcher-模型库 */}
                    <Route path="/researcher/modelManage/theoryDetail" component={TheoryModelDetailPage} />
                    <Route path="/researcher/modelManage/scaleMange" component={ScaleManage} />
                    {/* Researcher-模型应用 */}
                    <Route path="/researcher/modelApply/modelUsing" component={ModelUsingPage} />
                    <Route path="/researcher/modelApply/dataReport" component={DataReportSettingPage} />
                    {/* Researcher-模型配置 */}
                    <Route path="/researcher/modelSetting/theorySetting" component={TheoryModelSettingPage} />
                    <Route path="/researcher/modelSetting/analysisModel" component={AnalysisModelSettingPage} />
                    {/* Researcher-用户空间 */}   
                    <Route path="/researcher/userSpace/growthFile" component={AdminGrowthFile} />
                    {/* Researcher-旧页面 */}
                    <Route path="/researcher/modelManage/basicData" component={ResearcherBasicDataPage}/>
                    <Route path="/researcher/modelManage/basicModel" component={ResearcherBasicModelPage}/>
                    <Route path="/researcher/modelManage/dataIndex" component={ResearcherDataIndexPage}/>
                    <Route path="/researcher/modelManage/featureEngineering"
                           component={ResearcherFeatureEngineeringPage}/>
                    <Route path="/researcher/modelManage/educationalModel"
                           component={ResearcherFeatureEngineeringPage}/>
                    <Route path="/researcher/modelManage/decisionSupport" component={ResearcherDecisionSupportPage}/>
                    {/* <Route path="/researcher/userSpace/growthFile" component={ResearcherGrowthFile}/> */}
                    <Route path="/researcher/userSpace/decisionSpace" component={ResearcherDecisionSpace}/>

                    
                    {/* Area Manager Router */}
                    <Route path="/areaManager/userSpace/growthFile" component={AreaManagerGrowthFile}/>
                    <Route path="/areaManager/userSpace/decisionSpace" component={AreaManagerDecisionSpace}/>
                    {/* School Manager Router */}
                    <Route path="/schoolManager/userSpace/growthFile" component={SchoolManagerGrowthFile}/>
                    <Route path="/schoolManager/userSpace/decisionSpace" component={SchoolManagerDecisionSpace}/>
                    {/* Teacher Router */}
                    {/* Teacher-模型库 */}
                    <Route path="/teacher/modelManage/theoryDetail" component={TheoryModelDetailPage} />
                    <Route path="/teacher/modelManage/scaleMange" component={ScaleManage} />
                    {/* Teacher-数据分析 */}
                    <Route path="/teacher/dataAnalysis/teacherDataProcess" component={TeacherDataProcessPage}/>
                    <Route path="/teacher/dataAnalysis/studentDataProcess" component={StudentDataProcessPage}/>
                    <Route path="/teacher/dataAnalysis/dataAnalysis" component={DataAnalysisPage}/>
                    {/* Teacher-结果管理 */}
                    <Route path="/teacher/resultManage/graphManage" component={TGraphManagePage}/>
                    <Route path="/teacher/resultManage/reportManage" component={DataReportSettingPage}/>
                    {/* Teacher-用户空间 */}
                    <Route path="/teacher/userSpace/growthFile" component={AdminGrowthFile}/>
                    {/* Student Router */}
                    <Route path="/student/userSpace/growthFile" component={StudentGrowthFile}/>
                    <Route path="/student/userSpace/decisionSpace" component={StudentDecisionSpace}/>
                    {/* Wrong Route: 404 */}
                    {/*<Route render={() => (<h1>404 NOT FOUND!</h1>)} exact/>*/}
                </MainLayout>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
