<template>
  <!--新建词槽和编辑词槽弹窗-->
  <el-dialog custom-class="dialogClass" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="close()" >
    <div slot="title">{{formTitle}}</div>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
<!--      <el-form-item  label="词槽名称:"   prop="wordSlotName">-->
<!--        <el-input v-model="form.wordSlotName" placeholder="请输入名称"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="词槽描述:"   prop="wordSlotDesc">-->
<!--        <el-input  type="textarea" v-model="form.wordSlotDesc" placeholder="请输入描述"></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="词槽来源:"   prop="radio">
        <el-radio-group v-model="form.radio" @change="SlotFrom">
          <el-radio label="实体">实体</el-radio>
          <el-radio label="属性">属性</el-radio>
          <el-radio label="时间">时间</el-radio>
<!--          <el-radio label="词典">词典</el-radio>-->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="词槽选择:" prop="wordSlotChoice">
        <el-select v-model="form.wordSlotChoice" value-key="id"  filterable placeholder="请选择" @change="ChooseSlotParent">
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
      <el-form-item class="wordSlotInfo" label="词槽信息:" v-model="form.slotContentJson" v-if="wordSlotAttributeList.length>0 && form.radio==='实体'">
        <div>{{wordSlotAttributeList.toString()}}</div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
              <el-button @click="close">取 消</el-button>
              <el-button type="primary" @click="onSubmit('form')">确定</el-button>
          </span>
  </el-dialog>
</template>

<script>
  import {robotConfigService} from '../../service/index';
  import {SetCookie,getJoinCookie,getKnowledgeformHost} from '../../utils/commonUtil';

  export default {
        name: "WordSoltDialog",
        props: ['dialogVisible','formTitle'],

        computed:{
          dialogFormVisible:{
            get: function () {
              return this.dialogVisible
            },
            // setter
            set: function () {
            }
          },
        },
        data(){
          return{
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
            wordSlotChoiceNames:[],
            wordSlotAttributeList:[],//词槽信息属性列表
            form:{
              wordSlotName:'',//名称
              radio:'实体',//来源
              wordSlotChoice:'',//词槽选择
              wordSlotDesc:'',//描述
            },
            worldInfoStyle:{
              color: '#7F8FA4',
              padding: '0',
              height:"40px",

            },
           }
        },
        methods:{
          /**************************接口相关的方法***************************************/
          SlotFrom(val) {
            this.form.wordSlotChoice = ''
            this.wordSlotAttributeList = []
            let params = {
              cp: 1,
              ps: 100,
              type: val
            };
            this.getEntitySolitTypeList(params)
          },
          //请求实体词槽类型列表用于创建词槽时选择实体词槽的列表展示
          async getEntitySolitTypeList(params){
            params={
              cp:1,
              ps:100,
              type:this.form.radio
            }
            this.wordSlotChoiceNames=[];
            let result = await robotConfigService.getDictList(params);
            if (result.message.code==0){
              this.wordSlotChoiceNames = result.data.list
            }

          },
          //新增词槽请求
          async addWordSoltRequest(params){
            let result = await robotConfigService.addWoldSolt([params]);
            this.close()
            if (result.message.code == 0) {
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success'
              });
            }else {
              this.$message({
                showClose: true,
                message: result.message.message,
                type: 'error'
              });
            }
          },
          //词槽选择获取相关属性接口
          ChooseSlotParent(val){
            this.form.wordSlotName=val.name;
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
          /**************************交互相关的方法***************************************************/
          //查看或编辑词典
          editDictionary(){
            let newPageUrl =  getKnowledgeformHost();
            window.open(newPageUrl, '_blank');
          },
          //新增属性
          addAttribute(){
            this.wordSlotAttributeList.push({name:'',value:''})
          },
          //删除属性
          deleteAttribute(index,obj){
            this.wordSlotAttributeList.splice(index,1)
          },
          //点击确定
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
                params.slotDescription = this.form.wordSlotDesc;
                params.userId = getJoinCookie('userId');
                if (this.form.radio === '时间') {
                  params.slotUk = '19fcb9eb2594059036dfede5f4ec53e8';
                } else {
                  params.slotUk = this.form.wordSlotChoice.id;
                }
                params.slotContentJson = JSON.stringify(this.wordSlotAttributeList)

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
     /*     onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                var params = {};
                params.slotName = this.form.wordSlotName
                params.slotSource = this.form.radio
                params.slotDescription = this.form.wordSlotDesc
                params.userId = getJoinCookie('userId');
                // params.slotContent = stringForArray(this.form.wordSlotChoice,',')
                let wordSlotJsonObj = {}
                if (this.form.radio==='0'){
                  wordSlotJsonObj.entityTypes = this.form.wordSlotChoice
                  let attributesObj = {}
                  for (let index in this.wordSlotAttributeList ) {
                    let keys= this.wordSlotAttributeList[index].name
                    attributesObj[keys]= this.wordSlotAttributeList[index].value
                  }
                  wordSlotJsonObj.attributes = attributesObj
                }
                params.slotContentJson = JSON.stringify(wordSlotJsonObj)
                  //新增词槽请求
                  this.addWordSoltRequest(params);
              } else {
                return false;
              }
            });
          },*/
          //关闭
          close() {
            this.$refs['form'].resetFields()
            this.form.wordSlotName=''//名称
            this.form.wordSlotChoice=''//词槽选择
            this.form.wordSlotDesc=''//词槽描述
            this.wordSlotAttributeList=[]//清空词槽属性信息数组
            this.$emit('closeDialog')
          }

        },
    }
</script>

<style scoped>
  .wordSlotInfo >>> .el-table td, .el-table th{
    padding: 0px;
  }
  .wordSlotInfo  >>> .el-input__inner{
    border:none;
  }
  .elButtonEdit,
  .elButtonDele
  {
    padding: 4px 8px;
  }
  .elButtonDele{
    background-color: red;
    border: none;
  }

</style>
