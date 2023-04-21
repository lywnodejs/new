<template>
  <div class="evaluation-selfeva">
    <h6 class="evaluation-selfeva__title">安全评估项目-详细信息</h6>
    <!-- 评估内容 -->
    <el-form label-suffix=": ">
      <el-row>
        <el-col :span="8">
          <el-form-item label="评估对象">
            {{evaObjInfo.object_name}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="评估接口人">
            <user-link v-for="f in (evaObjInfo.users||[])" :key="f.user_id" :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="自评估列表" class="eval-list-container">
            <p>
              <el-form v-model="form" class="demo-form-inline" label-suffix=": " :label-width="'100px'">
                <el-row type="flex" class="row-bg" justify="end">
                  <el-col :span="5">
                    <el-form-item label="评估分类">
                      <el-select clearable v-model="form.evaKind" placeholder="选择分类">
                        <el-option v-for="o in dictEvaContents" :key="o.id" :label="o.dName" :value="o.type"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="评估结果">
                      <el-select v-model="form.assessmentResult" clearable placeholder="评估结果">
                        <el-option v-for="o in dictAssessment" :key="o.id" :label="o.dName" :value="o.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item>
                      <el-button type="primary" @click="onSearch">查询</el-button>
                      <el-button type="primary" @click="importData">导入数据</el-button>
                      <el-button type="primary" @click="showAddEval">添加</el-button>
                      <el-button type="danger" @click="doBatchDelete">批量删除</el-button>
                    </el-form-item>
                  </el-col>

                </el-row>
              </el-form>
            </p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <sdl-table v-loading="tableLoading" :url="url" :query-params="vulListParams" ref="evalTable" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="scope_name" label="评估内容" width="180">
            </el-table-column>
            <el-table-column prop="check_item" min-width="240" label="检查项/问题描述">
              <template slot-scope="scope">
                <div class="check_item_content" v-html="scope.row.check_content"></div>
              </template>
            </el-table-column>
            <el-table-column prop="assessment_self_ret_name" width="150" label="自评结果">
            </el-table-column>
            <el-table-column width="160" label="整改负责人">
              <template slot-scope="scope">
                <user-link v-for="f in (scope.row.repair_user||[])" :email="f.user_email" :key="f.user_id">{{f.user_name}}&nbsp;&nbsp;</user-link>
              </template>
            </el-table-column>
            <el-table-column width="120" label="自评操作人">
              <template slot-scope="scope">
                <user-link :email="scope.row.assessment_self_user_email" :key="scope.row.assessment_self_user_id">{{scope.row.assessment_self_user_name}}&nbsp;&nbsp;</user-link>
              </template>
            </el-table-column>
            <el-table-column prop="assessment_ret_name" width="110" label="评估结果">
            </el-table-column>
            <el-table-column prop="assessment_user_name" width="100" label="评估操作人">
              <template slot-scope="scope">
                <user-link :email="scope.row.assessment_user_email" :key="scope.row.assessment_user_id">{{scope.row.assessment_user_name}}&nbsp;&nbsp;</user-link>
              </template>
            </el-table-column>

            <el-table-column prop="action" width="220" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="()=>showDetail(scope.row)">查看</el-button>
                <el-button size="mini" type="primary" @click="()=>showEditEval(scope.row)">评估</el-button>
                <el-button size="mini" type="danger" @click="()=>doDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </sdl-table>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-col :span="24" class="text-center">
          <el-button type="primary" @click="save()">提交</el-button>
          <el-button @click="back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 添加评估结果 -->
    <el-dialog title="添加安全评估结果" :visible.sync="addFromVisible" width="70%">
      <el-form :model="addFrom" label-suffix="：">
        <el-row>
          <el-col :span="12">
            <el-form-item label="评估分类" :label-width="formLabelWidth" required>
              <el-select clearable v-model="addFrom.scope_type" placeholder="选择分类">
                <el-option v-for="o in dictEvaContents" :key="o.id" :label="o.dName" :value="o.type"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划完成时间" required>
              <el-date-picker v-model="addFrom.plan_time" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改负责人" :label-width="formLabelWidth">
              <el-select v-model="addFrom.repair_user" remote reserve-keyword :remote-method="empSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
                <el-option v-for="item in empOptions" :key="item.user_id" :label="item.user_name" :value="item.user_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="评估结果" :label-width="formLabelWidth" required>
              <el-select clearable v-model="addFrom.assessment_ret" placeholder="选择结果" @change="addAssessmentRetChg">
                <el-option v-for="o in dictAssessment" :key="o.id" :label="o.dName" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险等级" :label-width="formLabelWidth" required v-if="addFieldShow">
              <el-select clearable v-model="addFrom.risk_level" placeholder="请选择">
                <el-option v-for="o in dictRiskLevel" :key="o.id" :label="o.dName" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" v-if="addFieldShow">
            <el-form-item label="问题描述" :label-width="formLabelWidth">
              <el-input type="textarea" :autosize="{minRows:4}" placeholder="请输入内容" v-model="addFrom.question"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" v-if="addFieldShow">
            <el-form-item label="整改建议" :label-width="formLabelWidth">
              <el-input type="textarea" :autosize="{minRows:4}" placeholder="请输入内容" v-model="addFrom.proposal"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-center">
            <el-button @click="closeAddEval()">关 闭</el-button>
            <el-button type="primary" @click="saveAddEal()">保 存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 数据导入 -->
    <el-dialog title="导入评估结果" :visible.sync="uploadVisible" width="30%" :before-close="handleClose">
      <el-form label-suffix="：" label-width="130px">
        <el-form-item label="文件模板下载" prop="file" label-width="120px">
          <el-upload class="upload-demo" ref="upload" action="/sa/project/object/scope/assessment/upload" :file-list="fileList" :multiple="false" :data="uploadDataParams" :on-success="doneFileUpload" name="file" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="文件模板下载" label-width="120px">
          <a href="http://img-ys011.didistatic.com/static/architectureimg/%E5%AE%89%E5%85%A8%E8%AF%84%E4%BC%B0%E7%BB%93%E6%9E%9C%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx" target="_blank" download="安全评估结果导入模板.xlsx">评估结果数据模板.xls</a>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doUpload()">上 传</el-button>
        <el-button @click="closeUpload()">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 查看详情 -->
    <el-dialog title="安全合规评估 - 安全评估详细信息" @closed="onCloseDlg" width="65%" :visible.sync="dialogDetailV">
      <el-form :model="vulDetail" label-suffix="：" label-width="130px">
        <el-form-item label="评估分类" prop="scope_name" :label-width="formLabelWidth">
          {{vulDetail.scope_name}}
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查项" :label-width="formLabelWidth">
              <p v-if="vulDetail.check_content" class="check_item_content" v-html="vulDetail.check_content"></p>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 分隔符 -->
        <el-row>
          <el-col :span="24">
            <hr />
          </el-col>
        </el-row>
        <!-- 自评结果 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="自评结果" prop="assessment_self_ret_name" :label-width="formLabelWidth">
              {{vulDetail.assessment_self_ret_name?vulDetail.assessment_self_ret_name:'-'}}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自评完成时间" prop="assessment_self_time" :label-width="formLabelWidth">
              {{vulDetail.assessment_self_time?vulDetail.assessment_self_time:'-'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="整改负责人" prop="repair_user" :label-width="formLabelWidth">
              <user-link v-for="f in (vulDetail.repair_user||[])" :key="f.user_id" :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自评操作人" :label-width="formLabelWidth">
              <user-link v-if="vulDetail.assessment_self_user_email" :email="vulDetail.assessment_self_user_email">{{vulDetail.assessment_self_user_name}}&nbsp;&nbsp;</user-link>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划完成时间" prop="plan_time" :label-width="formLabelWidth">
              {{vulDetail.plan_time?vulDetail.plan_time:'-'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改计划" :label-width="formLabelWidth">
              <p v-if="vulDetail.revision_plan" class="check_item_content" v-html="vulDetail.revision_plan"></p>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 分隔符 -->
        <el-row>
          <el-col :span="24">
            <hr />
          </el-col>
        </el-row>
        <!-- 评估结果 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="评估结果" prop="assessment_ret_name" :label-width="formLabelWidth">
              {{vulDetail.assessment_ret_name?vulDetail.assessment_ret_name:'-'}}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="风险等级" prop="risk_level_name" :label-width="formLabelWidth">
              {{vulDetail.risk_level_name?vulDetail.risk_level_name:'-'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="评估人" prop="assessment_user_name" :label-width="formLabelWidth">
              <user-link v-if="vulDetail.assessment_user_email" :email="vulDetail.assessment_user_email">{{vulDetail.assessment_user_name}}&nbsp;&nbsp;</user-link>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="评估完成时间" prop="assessment_time" :label-width="formLabelWidth">
              {{vulDetail.assessment_time?vulDetail.assessment_time:'-'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述" :label-width="formLabelWidth">
              <p v-if="vulDetail.question" class="check_item_content" v-html="vulDetail.question"></p>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改建议" :label-width="formLabelWidth">
              <p v-if="vulDetail.proposal" class="check_item_content" v-html="vulDetail.proposal"></p>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 分隔符 -->
        <el-row>
          <el-col :span="24">
            <hr />
          </el-col>
        </el-row>
        <!-- 整改 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="整改操作人" prop="repair_user_name" :label-width="formLabelWidth">
              <user-link v-if="vulDetail.repair_user_email" :email="vulDetail.repair_user_email">{{vulDetail.repair_user_name}}&nbsp;&nbsp;</user-link>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="整改完成时间" prop="repair_time" :label-width="formLabelWidth">
              {{vulDetail.repair_time?vulDetail.repair_time:'-'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改备注" :label-width="formLabelWidth">
              <p v-if="vulDetail.repair_description" class="check_item_content" v-html="vulDetail.repair_description"></p>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 整改 -->
    <el-dialog title="安全合规评估 - 安全评估" width="70%" @closed="onCloseDlg" :visible.sync="dialogSelfEvaV">
      <el-form :model="vulDetail" label-suffix="：" label-width="130px">
        <el-form-item label="评估分类" prop="scope_name" :label-width="formLabelWidth">
          {{vulDetail.scope_name}}
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查项" :label-width="formLabelWidth">
              {{vulDetail.check_content}}
              <p v-if="vulDetail.check_content" class="check_item_content" v-html="vulDetail.check_content"></p>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <hr />
          </el-col>
        </el-row>
        <!-- 自评结果 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="自评结果" prop="assessment_self_ret_name" :label-width="formLabelWidth">
              {{vulDetail.assessment_self_ret_name}}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自评完成时间" prop="assessment_self_time" :label-width="formLabelWidth">
              {{vulDetail.assessment_self_time}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="整改负责人" prop="repair_user" :label-width="formLabelWidth">
              <user-link v-for="f in (vulDetail.repair_user||[])" :key="f.user_id" :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自评操作人" :label-width="formLabelWidth">
              <user-link :email="vulDetail.assessment_self_user_email">{{vulDetail.assessment_self_user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划完成时间" prop="plan_time" :label-width="formLabelWidth">
              {{vulDetail.plan_time}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改计划" :label-width="formLabelWidth">
              <p class="check_item_content" v-html="vulDetail.revision_plan"></p>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 分隔符 -->
        <el-row>
          <el-col :span="24">
            <hr />
          </el-col>
        </el-row>
        <!-- 评估结果 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="评估结果" prop="assessment_ret_name" :label-width="formLabelWidth">
              {{vulDetail.assessment_ret_name}}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="风险等级" prop="risk_level_name" :label-width="formLabelWidth">
              {{vulDetail.risk_level_name}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="评估人" prop="assessment_user_name" :label-width="formLabelWidth">
              <user-link :email="vulDetail.assessment_user_email">{{vulDetail.assessment_user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="评估完成时间" prop="assessment_time" :label-width="formLabelWidth">
              {{vulDetail.assessment_time}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述" :label-width="formLabelWidth">
              <p class="check_item_content" v-html="vulDetail.question"></p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改建议" :label-width="formLabelWidth">
              <p class="check_item_content" v-html="vulDetail.proposal"></p>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 分隔符 -->
        <el-row>
          <el-col :span="24">
            <hr />
          </el-col>
        </el-row>
        <!-- 整改 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="整改结果" prop="repair_ret" :label-width="formLabelWidth">
              <el-select v-model="vulDetail.repair_ret" clearable placeholder="选择结果">
                <el-option v-for="o in dictSelfEvaRs" :key="o.id" :label="o.dName" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="整改完成时间" prop="repair_time" :label-width="formLabelWidth">
              <el-date-picker v-model="vulDetail.repair_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改备注" prop="repair_description" :label-width="formLabelWidth">
              <el-input type="textarea" :rows="5" resize="none" placeholder="请输入内容" v-model="vulDetail.repair_description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="primary" @click="saveEvaItem">保 存</el-button>
            <el-button @click="closeDlg">关闭</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 评估 -->
    <el-dialog title="安全合规评估 - 安全评估" width="70%" :visible.sync="dialogEval">
      <el-form :model="vulDetail" label-suffix="：" label-width="130px">
        <el-form-item label="评估分类" prop="scope_name" :label-width="formLabelWidth">
          {{vulDetail.scope_name}}
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查项" :label-width="formLabelWidth">
              <p v-if="vulDetail.check_content" class="check_item_content" v-html="vulDetail.check_content"></p>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <hr />
          </el-col>
        </el-row>
        <!-- 自评结果 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="自评结果" prop="assessment_self_ret_name" :label-width="formLabelWidth">
              {{vulDetail.assessment_self_ret_name}}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自评完成时间" prop="assessment_self_time" :label-width="formLabelWidth">
              {{vulDetail.assessment_self_time}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="计划完成时间" prop="plan_time" :label-width="formLabelWidth">
              <el-date-picker v-model="vulDetail.plan_time" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自评操作人" :label-width="formLabelWidth">
              <user-link :email="vulDetail.assessment_self_user_email">{{vulDetail.assessment_self_user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="整改负责人" prop="revision_mgrs" :label-width="formLabelWidth">
              <el-select v-model="repair_user" remote reserve-keyword :remote-method="empSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
                <el-option v-for="item in empOptions" :key="item.user_id" :label="item.user_name" :value="item.user_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改计划" :label-width="formLabelWidth">
              <p v-if="vulDetail.revision_plan" class="check_item_content" v-html="vulDetail.revision_plan"></p>
              <p v-else>-</p>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 分隔符 -->
        <el-row>
          <el-col :span="24">
            <hr />
          </el-col>
        </el-row>
        <!-- 评估结果 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="评估结果" prop="assessment_ret_id" :label-width="formLabelWidth" class="is-required">
              <el-select clearable v-model="vulDetail.assessment_ret" placeholder="选择结果" @change="evalAssessmentRetChg">
                <el-option v-for="o in dictAssessment" :key="o.id" :label="o.dName" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-if="evaFieldShow">
            <el-form-item label="风险等级" prop="risk_level_name" :label-width="formLabelWidth" class="is-required">
              <el-select clearable v-model="vulDetail.risk_level" placeholder="请选择">
                <el-option v-for="o in dictRiskLevel" :key="o.id" :label="o.dName" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="evaFieldShow">
          <el-col :span="24" v-if="evaFieldShow">
            <el-form-item label="问题描述" :label-width="formLabelWidth">
              <el-input type="textarea" :autosize="{minRows:4}" placeholder="请输入描述" v-model="vulDetail.question"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="evaFieldShow">
          <el-col :span="24">
            <el-form-item label="整改建议" :label-width="formLabelWidth">
              <el-input type="textarea" :autosize="{minRows:4}" placeholder="请输入建议" v-model="vulDetail.proposal"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-center">
            <el-button type="primary" @click="saveEvaItem">保 存</el-button>
            <el-button @click="closeEvaDlg">关闭</el-button>
          </el-col>
        </el-row>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>

import dataMixin from '../../mixins/data'
import moment from 'moment'
export default {

  mixins: [dataMixin],
  data() {
    return {
      url: '/sa/vulnerability/list', //安全隐患列表查询
      form: {
        evaKind: '', //评估分类
        selfAssessmentResult: '', //自评结果
        assessmentResult: '',// 评估结果
        reapirResult: '',// 整改结果
        checkResult: '',// 检查结果
      },

      addFromVisible: false,
      formLabelWidth: '130px',
      addFrom: {
        risk_level: '',
        scope_type: '',
        plan_time: '',
        assessment_ret: '',
        question: '',
        proposal: ''
      },
      uploadVisible: false,
      uploadDataParams: {
        id: ''
      },
      evaObjInfo: {},

      dictEvaContents: [], // 评估分类
      dictSelfEvaRs: [], // 自评
      dictAssessment: [], // 评估结果
      dictAssessmentState: [], //评估状态
      dictReapir: [], // 整改
      dictCheck: [], // 检查
      dictRiskLevel: [], //风险等级

      dialogDetailV: false,
      dialogSelfEvaV: false,
      formLabelWidth: '118px',
      //   安全隐患数据详情
      vulDetail: {
        assessment_ret_id: ''
      },
      revision_mgrs: [],
      repair_user: [],
      //编辑评估对话框
      dialogEval: false,
      fileList: [],
      multipleSelection: [],
      addFieldShow: false,
      evaFieldShow: false,
      tableLoading: false
    }
  },
  computed: {
    queryParams: function () {
      let paramStr = ''
      for (let [key, value] of Object.entries(this.vulListParams())) {
        paramStr += key + '=' + value + '&'
      }
      return paramStr.substring(0, paramStr.length - 1)
    },
    showMore() {
      if (this.vulDetail.assessment_self_ret && (this.vulDetail.assessment_self_ret == 1743 || this.vulDetail.assessment_self_ret == 1742)) {
        return true
      }
      return false
    }
  },
  methods: {
    evalAssessmentRetChg(val) {
      if (val == 1722 || val == 1723 || val == 1726) {
        this.evaFieldShow = true
      } else {
        this.evaFieldShow = false
      }
    },
    addAssessmentRetChg(val) {
      // 1722 1723 1726
      if (val == 1722 || val == 1723 || val == 1726) {
        this.addFieldShow = true
      } else {
        this.addFieldShow = false
      }
    },
    doUpload() {
      this.$refs.upload.submit();
      //   uploadVisible = false
    },
    doneFileUpload(body, file, fileList) {

      if (body.errno == 0) {
        this.$message({
          message: '上传成功',
          type: 'success'
        });
        this.closeUpload()
        this.onSearch(true)
      } else {
        this.$message({
          message: '错误：' + body.errmsg,
          type: 'error'
        });
      }
    },
    closeUpload() {
      this.$refs.upload.clearFiles()
      this.uploadVisible = false
    },
    save() {
      this.$http.post('/sa/project/object/assessment', { id: this.id })
        .then(({ body }) => {
          if (body.errno == 0) {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            this.back()
          } else {
            this.$message({
              message: '错误：' + body.errmsg,
              type: 'error'
            });
          }
        })
    },
    importData() {
      this.uploadVisible = true
    },
    handleClose() {
      this.uploadVisible = false
      this.fileList = []
    },
    //   保存评估检查项
    saveEvaItem() {
      let { id, assessment_ret } = this.vulDetail
      if (assessment_ret == '' || assessment_ret == null) {
        this.$message({
          message: '请选评估结果',
          type: 'warning'
        });
        return false
      }

      if (assessment_ret == 1722 || assessment_ret == 1723) {
        if (!this.vulDetail.plan_time) {
          this.$message({
            message: '请选择计划时间',
            type: 'warning'
          });
          return false
        }
        if (!this.repair_user || this.repair_user.length == 0) {
          this.$message({
            message: '请选择整改负责人',
            type: 'warning'
          });
          return false
        }
      }

      if ((assessment_ret == 1722 || assessment_ret == 1723 || assessment_ret == 1726) && !this.vulDetail.risk_level) {
        this.$message({
          type: 'warning',
          message: '请选择风险等级'
        });
        return false;
      }

      let params = {}
      params['id'] = id;
      params['assessment_ret'] = assessment_ret
      if (this.vulDetail.risk_level) {
        params['risk_level'] = this.vulDetail.risk_level
      }
      if (this.vulDetail.question) {
        params['question'] = this.vulDetail.question
      }
      if (this.vulDetail.proposal) {
        params['proposal'] = this.vulDetail.proposal
      }
      if (this.vulDetail.plan_time) {
        params['plan_time'] = this.vulDetail.plan_time
      }
      if (this.repair_user) {
        params['repair_user'] = this.repair_user.map((item) => ({ user_id: item }))
      }
      this.tableLoading = true
      this.$http.post('/sa/project/object/scope/assessment', params)
        .then(({ body }) => {
          if (body.errno != 0) {
            this.$message({
              type: 'error',
              message: '错误' + body.errmsg
            });
          } else {
            this.$message({
              type: 'success',
              message: '保存成功'
            });
            this.closeDlg()
          }
        })
        .finally(() => {
          this.tableLoading = false
          this.onSearch(false)
        })
    },
    vulListParams() {
      let params = {
        page_type: 3 // 安全评估页面
      }
      params['project_id'] = this.project_id
      params['business_id'] = this.business_id
      params['object_id'] = this.object_id
      params['source'] = this.source
      //   scope_type 评估分类 
      // assessment_self_ret 自评结果
      if (this.form.evaKind) {
        params['scope_type'] = this.form.evaKind
      }
      if (this.form.repairResult) {
        params['repair_ret'] = this.form.repairResult
      }
      if (this.form.assessmentResult) {
        params['assessment_ret'] = this.form.assessmentResult
      }
      if (this.form.checkResult) {
        params['check_ret'] = this.form.checkResult
      }
      if (this.form.selfAssessmentResult) {
        params['assessment_self_ret'] = this.form.selfAssessmentResult
      }
      return this.dealElement(params)
    },
    dealElement(obj) {
      var param = {}
      if (obj === null || obj === undefined || obj === "") return param;
      for (var key in obj) {
        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
          param[key] = obj[key]
        }
      }
      return param
    },
    back() {
      this.$router.push({
        path: `/compliance/evaluation/assessment/evachk?source=${this.source}&id=${this.project_id}`
      })
    },
    // 获取评估分类（评估内容）
    getDictEvaContent() {
      const { project_id, source } = this;
      this.$http.get('sa/assessment/list', { params: { project_id, source, stat: 0 } }).then(({ body }) => {
        if (body.errno == 0) {
          this.dictEvaContents = (body.data || []).map((item) => {
            item.dName = item.name;
            return item
          })
        }
      })


    },
    // 获取自评估结果
    getDictSelfEvaRs() {
      this.$http.get('/dictionary/listByDataAuth/1950').then(({ body }) => {
        if (body.errno == 0) {
          this.dictSelfEvaRs = body.data
        }
      })
    },
    // 评估状态
    getDictAssessment() {
      this.$http.get('/dictionary/listByDataAuth/1820').then(({ body }) => {
        if (body.errno == 0) {
          this.dictAssessmentState = body.data
        }
      })
    },
    // 评估结果
    getDictAssessment() {
      this.$http.get('/dictionary/listByDataAuth/1720').then(({ body }) => {
        if (body.errno == 0) {
          this.dictAssessment = body.data
        }
      })
    },
    // 整改
    getDictReapir() {
      this.$http.get('/dictionary/listByDataAuth/1830').then(({ body }) => {
        if (body.errno == 0) {
          this.dictReapir = body.data
        }
      })
    },
    // 检查
    getDictCheck() {
      this.$http.get('/dictionary/listByDataAuth/1840').then(({ body }) => {
        if (body.errno == 0) {
          this.dictCheck = body.data
        }
      })
    },
    //风险等级
    getDictRiskLevel() {
      this.$http.get('/dictionary/listByDataAuth/1710').then(({ body }) => {
        if (body.errno == 0) {
          this.dictRiskLevel = body.data
        }
      })
    },
    // 获取评估对象详情
    getEvaObjectDetail(id) {
      this.$http.get('sa/project/object/info', { params: { id } }).then(({ body }) => {
        if (body.errno == 0) {
          const data = body.data
          this.evaObjInfo = data
        } else {
          this.$message({
            type: 'error',
            message: '错误' + body.errmsg
          });
        }

      })
    },
    // 安全隐患列表查询 自评估的
    _initPage() {
      const { id, project_id, business_id, object_id, source } = this.$route.query
      this.id = id * 1;
      this.project_id = project_id * 1
      this.business_id = business_id * 1;
      this.object_id = object_id * 1;
      this.source = source * 1
      this.uploadDataParams.id = this.id  // 是

      this.getEvaObjectDetail(id)
      this.getDictEvaContent()
      this.getDictSelfEvaRs()
      this.getDictAssessment()
      this.getDictReapir()
      this.getDictCheck()
      this.getDictRiskLevel()
      this.getDictDataStartState()
    },
    // show detail
    showDetail(row) {
      const { id } = row
      this.getVulDetail(id)
        .then((data) => {
          this.vulDetail = data
          this.dialogDetailV = true
        })
    },
    showSelfEva(row) {
      const { id } = row
      this.getVulDetail(id)
        .then((data) => {
          this.vulDetail = data;
          this.dialogSelfEvaV = true

        })
    },
    // show 评估
    showAddEval(row) {
      const { id } = row
      this.addFrom = {}
      this.addFromVisible = true
    },
    saveAddEal() {
      const id = this.id
      const { scope_type, assessment_ret } = this.addFrom
      if (!scope_type) {
        this.$message({
          type: 'warning',
          message: '请选择评估分类'
        });
        return false
      }
      if (!assessment_ret) {
        this.$message({
          type: 'warning',
          message: '请选择评估结果'
        });
        return false
      }
      if ((assessment_ret == 1722 || assessment_ret == 1723 || assessment_ret == 1726) && !this.addFrom.risk_level) {
        this.$message({
          type: 'warning',
          message: '请选择风险等级'
        });
        return false;
      }
      let params = { id, assessment_ret, scope_type }
      if (this.addFrom.risk_level) {
        params['risk_level'] = this.addFrom.risk_level
      }
      if (this.addFrom.question) {
        params['question'] = this.addFrom.question
      }
      if (this.addFrom.proposal) {
        params['proposal'] = this.addFrom.proposal
      }
      if (this.addFrom.plan_time) {
        params['plan_time'] = this.addFrom.plan_time
      }
      if (this.addFrom.repair_user && this.addFrom.repair_user.length > 0) {
        params['repair_user'] = this.addFrom.repair_user.map((item) => ({ user_id: item }))
      }
      //   post add
      this.$http.post('/sa/project/object/scope/assessment/add', params)
        .then(({ body }) => {
          if (body.errno == 0) {
            this.onSearch(true)
            this.closeAddEval()
          }
        })
    },
    closeAddEval() {
      this.addFieldShow = false
      this.addFromVisible = false
    },
    // 评估编辑
    showEditEval(row) {
      const { id } = row
      this.getVulDetail(id)
        .then((data) => {
          if (!data.revision_mgrs) {
            data.revision_mgrs = []
          }
          if (!data.repair_user) {
            data.repair_user = []
          } else {
            this.repair_user = data.repair_user.map((item) => item.user_id)
            this.empOptions = data.repair_user.map(({ user_id, user_name, user_email }) => ({ user_id, user_email, user_name }))
          }
          if (data.plan_time) {
            data.plan_time = moment(data.plan_time).format('YYYY-MM-DD')
          }
          if (data.risk_level < 1710) {
            data.risk_level = ''
          }
          //   console.log(data.scope_name)
          //   console.log(data.check_content)
          this.vulDetail = data;
          if (this.vulDetail.risk_level == 0) {
            this.vulDetail.risk_level = ''
          }
          this.dialogEval = true
        })
    },
    closeEvaDlg() {
      this.repair_user = []
      this.empOptions = []
      this.vulDetail = {}
      this.evaFieldShow = false
      this.dialogEval = false
    },
    // handleSelectionChange
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 批量删除
    doBatchDelete() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        });
        return false
      }
      let ids = this.multipleSelection.map((item) => item.id)
      this.$confirm('此操作将永久选择项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$nextTick(() => {
          this.tableLoading = true;
          this.$http.get('/sa/project/object/scope/assessment/deleteList?ids=' + ids)
            .then(({ body: data }) => {
              if (data.errno == 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              } else {
                this.$message({
                  type: 'warning',
                  message: '错误' + data.errmsg
                });
              }
            })
            .finally(() => {
              this.tableLoading = false
              this.onSearch(true)
            })
        })
      })
    },
    // 删除评估项
    doDelete(row) {
      const { id } = row
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$nextTick(() => {
          this.tableLoading = true
          //   console.log(1)
          this.$http.get('/sa/project/object/scope/assessment/delete?id=' + id)
            .then(({ body: data }) => {
              if (data.errno == 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                // console.log(2)
              } else {
                this.$message({
                  type: 'warning',
                  message: '错误' + data.errmsg
                });
              }
            })
            .finally(() => {
              this.tableLoading = false
              this.onSearch(true)
            })
        })

      })
    },
    onSearch(st = false) {
      //   console.log(3)
      this.$refs.evalTable.reload2(st)
    },

    closeDlg() {
      this.dialogEval = false
      this.dialogDetailV = false
      this.dialogSelfEvaV = false
      this.vulDetail = {}
      this.revision_mgrs = []
      this.repair_user = []
      this.empOptions = []
    },
    onCloseDlg() {
      // 关闭对话框
      this.closeDlg()
    },
    getVulDetail(id) {
      return this.$http.get('/sa/vulnerability/info', { params: { id, source: this.source } }).then(({ body }) => {
        if (body.errno == 0) {
          const data = body.data
          return data;
        } else {
          this.$message({
            type: 'error',
            message: '错误' + body.errmsg
          });
        }
      })
    }
  },

  activated() {
    this._initPage()
  },
  created() {
    this._initPage()
  }
}
</script>

<style lang="less">
.evaluation-selfeva {
  &__title {
    margin-bottom: 20px;
  }

  .check_item_content {
    white-space: normal;
    text-align: left;
    word-break: break-all;
  }
  .el-select--small {
    width: 85%;
  }
}
</style>
