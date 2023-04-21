<template>
  <el-container>
    <el-header style="padding: 0px">
      <robotHeader></robotHeader>
    </el-header>
    <div class="container">
      <!--词槽列表-->
      <el-row>
        <el-row type="flex" justify="space-around" style="padding-bottom: 15px">
          <el-col align="left">
            <span style="font-size: 18px;position: relative;top: 3px">词槽管理</span>
            <el-button size="small" type="success" style="margin-left: 20px" @click="addWordSlot()">新建词槽</el-button>
          </el-col>
        </el-row>
        <el-table :data="listData" stripe v-loading="showListLoading" style="width: 100% "
                  :header-cell-style="headerStyle">
          <el-table-column align="center" width="100" label="词槽id" prop="id"></el-table-column>
          <el-table-column width="200" label="词槽名称" prop="slotName" align="left"></el-table-column>
          <el-table-column width="300" label="词槽来源" align="left" prop="slotType"></el-table-column>
          <el-table-column label="词槽描述" align="left" prop="slotDescription"></el-table-column>
          <el-table-column width="180" label="操作" align="center" resizeable="false">

            <template slot-scope="scope">
              <el-row type="flex" style="margin-left: 35px">
                <el-button class="elButtonEdit" type="primary" size="mini" @click="editWold(scope.$index, scope.row)">
                  编辑
                </el-button>
                <el-button class="elButtonDele" type="primary" size="mini" @click="deleteWold(scope.$index, scope.row)">
                  删除
                </el-button>
              </el-row>
            </template>

          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" class="zoom-pagi" style="padding-top: 30px;padding-bottom: 30px">
          <el-col type="flex" justify="center">
            <el-pagination align="center"
                           :current-page.sync="wordSoltListParams.cp"
                           :total="totalCount"
                           class="pagination"
                           layout="total, prev, pager, next, jumper"
                           @current-change="pageChange"
            >
            </el-pagination>
          </el-col>
        </el-row>
      </el-row>

      <!--新建词槽和编辑词槽弹窗-->
      <el-dialog custom-class="dialogClass" :visible.sync="dialogFormVisible" @close="close()"
                 :close-on-click-modal="false">
        <div slot="title">{{formTitle}}</div>
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
<!--          <el-form-item label="词槽名称:" prop="wordSlotName">-->
<!--            <el-input v-model="form.wordSlotName" placeholder="请输入名称"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="词槽描述:">-->
<!--            <el-input type="textarea" v-model="form.wordSlotDesc" placeholder="请输入描述"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="词槽来源:">
            <el-radio-group v-model="form.radio" @change="SlotFrom">
              <el-radio label="实体">实体</el-radio>
              <el-radio label="属性">属性</el-radio>
              <el-radio label="时间">时间</el-radio>
<!--              <el-radio label="词典">词典</el-radio>-->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="词槽选择:" prop="wordSlotChoice" v-if="form.radio!=='2'">
            <el-select v-model="form.wordSlotChoice" value-key="id" filterable placeholder="请选择" @change="ChooseSlotParent">
              <el-option
                v-for="(item,index) in wordSlotChoiceNames"
                :key="index"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
            <template>
              <el-button style="margin-left: 10px" type="text" @click="editDictionary">查看或编辑词典</el-button>
            </template>
          </el-form-item>
          <!--词槽信息-->
          <el-form-item v-if="wordSlotAttributeList.length>0&&form.radio==='实体'" class="wordSlotInfo" label="词槽信息:" v-model="form.slotContentJson" >
            <div>{{wordSlotAttributeList.toString()}}</div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmit('form')">确定</el-button>
          </span>
      </el-dialog>

    </div>
  </el-container>
</template>

<script>
  import {robotConfigService} from '../../service/index';
  import {stringForArray, arrayForString} from '../../utils/commonUtil';
  import robotHeader from '../../components/robotConfig/RobotConfigHeader';
  import {SetCookie, getJoinCookie, getKnowledgeformHost} from '../../utils/commonUtil';


  export default {

    name: "WordSlotManagement",
    components: {
      robotHeader
    },
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      return {
        listData: [],//词槽列表
        wordSlotAttributeList: [],//词槽信息属性列表
        defaultValueArr:[],
        //请求词槽列表params
        wordSoltListParams: {
          userId: '',
          cp: 1,
          ps: '10',
        },
        form: {
          wordSlotName: '',//名称
          radio: '实体',//来源
          wordSlotChoice: '',//词槽选择
          wordSlotDesc: '',//描述
          id: ''
        },
        wordSlotChoiceNames: [],//实体词槽列表
        wordSlotAttributeValues: [],//参数选项中的属性值列表
        totalCount: 1,
        dialogFormVisible: false,
        formTitle: '',
        rules: {
          wordSlotName: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          radio: [
            {required: true, message: '请选择来源', trigger: 'blur'}
          ],
          wordSlotChoice: [
            {required: true, message: '请选择词槽', trigger: 'change'}
          ],

        },
        headerStyle: {
          color: '#7F8FA4',
        },
        worldInfoStyle: {
          color: '#7F8FA4',
          padding: '0',
          height: "40px",

        },
      }
    },
    methods: {
      SlotFrom(val) {
        let params = {
          cp: 1,
          ps: 100,
          type: val
        };
        this.getEntitySolitTypeList(params)
      },
      /**********请求接口的相关方法**************/
      //获取词槽列表请求
      async getWordSlotList() {
        this.showListLoading = true;
        let result = await robotConfigService.getWoldSoltList(this.wordSoltListParams);
        if (result.message.code == 0) {
          this.showListLoading = false;
          let list = result.data.list;
          this.listData = list;
          this.totalCount = result.data.totalCount;
          this.wordSoltListParams.cp = result.data.currentPage;
        }
      },
      //新增词槽请求
      async addWordSoltRequest(params) {
        this.showListLoading = true;
        let result = await robotConfigService.addWoldSolt([params]);
        this.dialogFormVisible = false
        if (result.message.code == 0) {
          this.showListLoading = false;
          let target = this;
          setTimeout(function () {
            target.getWordSlotList();
          }, 1250);
          this.$message({
            showClose: true,
            message: '创建成功',
            type: 'success'
          });
        } else {
          this.showListLoading = false;
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }
      },
      //编辑词槽请求
      async editWordRequest(params) {
        this.showListLoading = true;
        let result = await robotConfigService.editWoldSolt([params]);
        this.dialogFormVisible = false
        if (result.message.code == 0) {
          this.showListLoading = false;
          let target = this;
          setTimeout(function () {
            target.getWordSlotList();
          }, 1250);
          this.$message({
            showClose: true,
            message: '编辑成功',
            type: 'success'
          });
        } else {
          this.showListLoading = false;
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }
      },
      //删除词槽请求
      async deleWordSoltRequest(id) {
        let result = await robotConfigService.deleWoldSolt({slotId: id});
        if (result.message.code == 0) {
          let target = this;
          setTimeout(function () {
            target.getWordSlotList();
          }, 1250);
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          });
        } else {
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });

        }
      },
      //请求实体词槽类型列表用于创建词槽时选择实体词槽的列表展示
      async getEntitySolitTypeList(params) {
        let result = await robotConfigService.getDictList(params);
        if (result.message.code == 0) {
          this.wordSlotChoiceNames = result.data.list
        }
      },
      //词槽选择获取相关属性接口
      ChooseSlotParent(val){
         this.form.wordSlotName=val.name;
         this.form.wordSlotUk=val.id;
         // this.ChooseSlot(val.id)
        if(this.form.radio==='实体'){
          this.ChooseSlot(val.id)
        }

      },
      async ChooseSlot(params) {
        let data={
          entityId:params,
          cp:1,
          ps:1000
        };
        let result=await robotConfigService.getDictcolumn(data);
        if(result.message.code===0){
          let arr= result.data;
          let arrr=[]
          arr.forEach((item,index)=>{
            arrr.push(item.columnComment)
          })
        this.wordSlotAttributeList=arrr
        }

      },
      //请求实体词槽属性列表用于配置词槽参数是使用
      // async getEntitySolitAttributeList(params){
      //   let result = await robotConfigService.getEntitySlotTypeList(params);
      //   if (result.message.code==0){
      //     this.wordSlotAttributeValues = result.data
      //   }
      // },

      /**********交互方法**************/
      indexFilter(index) {
        return index + 10 * (this.wordSoltListParams.cp - 1) + 1;
      },
      //新增词槽
      addWordSlot() {
        this.dialogFormVisible = true;
        this.formTitle = '新建词槽';
        this.form.wordSlotName = '';
        this.form.wordSlotDesc = '';
        //请求实体词槽类型
        this.getEntitySolitTypeList({cp: 1, ps: 200,type:'实体'})
        //请求实体词槽属性
        // this.getEntitySolitAttributeList({type:'entityAttribute'})

      },
      //编辑词槽
      editWold(index, wordSoltData) {
        debugger
        this.dialogFormVisible = true;
        this.formTitle = '编辑词槽';
        this.wordSlotAttributeList=JSON.parse(wordSoltData.slotContentJson)
        this.form.wordSlotName = wordSoltData.slotName;
        this.form.wordSlotDesc = wordSoltData.slotDescription;
        this.form.radio = wordSoltData.slotType;
        this.form.wordSlotChoice = wordSoltData.slotName;
        this.form.id = wordSoltData.id;
        this.getEntitySolitTypeList({cp: 1, ps: 200})

      },
      //查看或编辑词典（跳转知识图谱）
      editDictionary() {
        let KnowledgeUrl = getKnowledgeformHost();
        let token = {}
        token.userName = getJoinCookie('userName')
        token.ps = getJoinCookie('passWord')
        let singleUrl = window.encodeURIComponent(JSON.stringify(token))
        singleUrl = window.btoa(singleUrl)
        // let decryStr = window.atob(singleUrl); // 解码
        // decryStr=  window.decodeURIComponent(decryStr);
        let newPageUrl = KnowledgeUrl + '?token=' + singleUrl
        window.open(newPageUrl, '_blank');
      },
      //新增属性
      addAttribute() {
        this.wordSlotAttributeList.push({name: '', value: ''})
      },
      //删除属性
      deleteAttribute(index, obj) {
        this.wordSlotAttributeList.splice(index, 1)
      },
      //删除词槽
      deleteWold(indiex, wordSoltData) {
        var text = '确认删除该词槽吗？删除后该词槽关联的策略技能也将同步删除!'
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //点击确定
          this.deleWordSoltRequest(wordSoltData.id);
        }).catch(() => {
          //点击取消
        });

      },
      //点击确定
      onSubmit(formName) {
        if (this.form.radio === '2') {
          this.rules.wordSlotName[0].required = false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = {};
            params.slotName = this.form.wordSlotName;
            params.slotType = this.form.radio;
            params.slotUk = '12';
            params.slotDescription = this.form.wordSlotDesc;
            params.userId = this.wordSoltListParams.userId;
            if (this.form.radio === '时间') {
              params.slotUk = '19fcb9eb2594059036dfede5f4ec53e8';
            } else {
              params.slotUk = this.form.wordSlotChoice.id;
              console.log(params.slotUk);
            }
            params.slotContentJson = JSON.stringify(this.wordSlotAttributeList);
            if (this.formTitle == '新建词槽') {
              this.addWordSoltRequest(params);
            } else if (this.formTitle == '编辑词槽') {
              params.id = this.form.id
              this.editWordRequest(params);
            }
          } else {
            return false;
          }
        });
      },
      //点击分页
      pageChange(page) {
        this.wordSoltListParams.cp = page;
        this.getWordSlotList();
      },
      //弹窗关闭的回调
      close() {
        //关闭是清空数据
        this.resetData()
      },
      //清空数据
      resetData() {
        this.$refs['form'].resetFields()
        this.form.wordSlotName = '' //名称
        this.form.wordSlotChoice = '' //词槽选择
        this.form.wordSlotDesc = ''//词槽描述
        this.wordSlotAttributeList = []//清空词槽属性信息数组
      }

    },//methods
    mounted: function () {
      //页面加载完成

    },
    created: function () {
      this.wordSoltListParams.userId = getJoinCookie('userId');
      //即将显示页面
      this.getWordSlotList()

    }

  }
</script>

<style scoped>

  .container {
    width: 100%;
    padding-top: 27px;
    padding-left: 30px;
    padding-right: 30px;
    box-sizing: border-box;
  }

  .elButtonEdit,
  .elButtonDele {
    padding: 4px 8px;
  }

  .elButtonDele {
    background-color: red;
    border: none;
  }

  .wordSlotInfo >>> .el-table td, .el-table th {
    padding: 0px;
  }

  .wordSlotInfo >>> .el-input__inner {
    border: none;
  }

</style>

