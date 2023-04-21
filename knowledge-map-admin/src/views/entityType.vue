<template>
  <div id="entityBox" style="background: #f2f2f2;padding:10px;">
    <div class="clearfix" style="height: 40px;background: #fff;padding:0 10px;margin-bottom:10px;">
      <span class="fl" style="line-height:40px;font-size:15px;">类型管理</span>
    </div>
    <el-row style="background: #ffffff;">
      <el-col :span="5" style=";box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);">
        <p style="background: #ffffff;font-size: 14px;padding-left: 10px;position: relative;"><span>词典类型</span> <el-button style="position: absolute;top: -10px;right: 10px;" icon="el-icon-plus" type="text" @click="addBtn">新建类型</el-button></p>
        <el-tree
          style="font-size: 14px;"
          :data="tableData5"
          :expand-on-click-node="false"
          @node-click="clickitem"
          :props="shuProp"
          default-expand-all
          highlight-current
          node-key="id">
          <span class="custom-tree-node" slot-scope="{ node, data,i }">
            <span>{{ data.dictType.name }}</span>
            <span style="font-size: 10px;position: absolute;right: 8px;padding-top: 4px">
              <i @click="append(data)" class="el-icon-plus"></i>
              <el-popover
                placement="top"
                v-model="data.show"
                width="60">
                <div style="text-align: center; margin: 0">
                  <el-button @click="data.show= false" size="mini" type="text">删除</el-button>
                  <el-button @click="editSureBtn(data)" size="mini" type="text">编辑</el-button>
                </div>
                <i class="el-icon-more" slot="reference"></i>
              </el-popover>

            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="19">
        <el-row>
          <el-col :span="20" :offset="2" v-if="staticShow">
            <p>定义知识类型时，您必须明确构建此次知识图谱的知识类型及对应的属性。<br/>
              示例：在证券领域，类目可以定义为股票、基金、理财等，常用属性为股票名称、股票代码、股票价格等
              知识定义与图谱构建及紧密关系，请不要频繁修改，一旦修改需要重新进行知识图谱构建。
            </p>
            <el-divider></el-divider>
            <el-table
              :data="staticTableData"
              border
              style="width: 100%">
              <el-table-column
                prop="name"
                label="属性名称"
                width="180">
              </el-table-column>
              <el-table-column
                prop="ci"
                label="同义词"
                width="180">
              </el-table-column>
              <el-table-column
                prop="datatype"
                label="数据类型">
              </el-table-column>
              <el-table-column
                prop="danzhi"
                label="单值/多值">
              </el-table-column>
              <el-table-column
                prop="title"
                label="描述">
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="22" :offset="1" v-else="!staticShow">
            <h4>{{rightinfo.dictType.name}}</h4>
            <h5 style="border-left: 5px solid #1890ff;padding-left: 5px;">基本信息</h5>
            <el-row>
              <el-col :span="8">实体数量：{{rightinfo.number}}</el-col>
              <el-col :span="8">实体词性：{{rightinfo.dictType.label}}</el-col>
              <el-col :span="8">知识唯一验证：{{rightinfo.dictType.duplicate ==1 ? '是':'否'}}</el-col>
            </el-row>
            <el-row>
              <h5 style="border-left: 5px solid #1890ff;padding-left: 5px;margin-top: 30px;">类型属性</h5>
              <el-form :inline="true" :rules="rules">
                <el-col :span="24">
                  <el-form-item label="属性名称：" prop="name">
                    <el-input placeholder="请输入1-10字属性名称" v-model="formData.name"></el-input>
                  </el-form-item>
                  <el-form-item label="属性同义词：" style="margin-left: 90px;">
                    <el-input placeholder="属性同义词，多个请用,隔开"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="数据类型：" prop="dataClass">
                    <el-input placeholder="数据类型" v-model="dataClass"></el-input>
                  </el-form-item>
                  <el-form-item label="属性描述：" style="margin-left: 104px;">
                    <el-input placeholder="属性描述" type="textarea" :rows="3" v-model="formData.info"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" :offset="20">
                    <el-button type="primary">添加属性</el-button>
                </el-col>
              </el-form>
            </el-row>
            <el-row style="margin-top: 20px;">
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  prop="name"
                  label="属性名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="同义词"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="dataType"
                  label="数据类型">
                </el-table-column>
                <el-table-column
                  prop="attributeDescription"
                  label="描述">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 添加 -->
    <el-dialog :visible.sync="dialogFormVisible" style="width: 100%;margin: auto;" title="添加">
      <div>
        <el-form :model="addForm">

          <el-form-item :label-width='formLabelWidth' label="词典类型">
            <el-select @change="editTypeCdNameChange" placeholder="请选择" size="small" style="width:250px;"
                       v-model="editTypeCdName">
              <el-option
                :key="item"
                :label="item"
                :value="item"
                style="width:250px;"
                v-for="item in editTypeCdNameoptions">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label-width='formLabelWidth' label="父级类型名称">
            <el-select @change="changeSlectParent" clearable filterable placeholder="请选择" size="small" style="width:250px;"
                       v-model="editTypeVal">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                style="width:250px;"
                v-for="item in allTypeList">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label-width='formLabelWidth' label="当前类型名称">
            <el-input @change="dictAddCxReplateWay" placeholder="请输入(1-10字)" size="small" style="width:250px;"
                      v-model="editTypeName"></el-input>
          </el-form-item>

          <el-form-item :label-width='formLabelWidth' label="知识唯一">
            <el-select :disabled="ifCheckedOnlyFlag" placeholder="请选择" size="small" style="width:250px;"
                       v-model="knowlegeIfOnlyVal">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                style="width:250px;"
                v-for="item in knowlegeIfOnlyList">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label-width='formLabelWidth' label="词性">
            <el-input @change="dictAddCxReplateWayLabel" placeholder="请输入(2-10字母)" size="small" style="width:250px;"
                      v-model="editTypeCx"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button @click="saveSureBtn" size="small" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog :visible.sync="dialogEditFormVisible" style="width:100%;margin: auto;" title="添加">
      <el-form :model="addForm">

        <el-form-item :label-width='formLabelWidth' label="父级类型名称">
          <el-select @change="changeEntityType" clearable filterable placeholder="请选择" size="small"
                     style="width:250px;" v-model="editTypeVal">
            <el-option
              :key="item.id"
              :label="item.name"
              :value="item.id"
              style="width:250px;"
              v-for="item in allTypeList">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label-width='formLabelWidth' label="当前类型名称">
          <el-input placeholder="请输入(1-10字)" size="small" style="width:250px;" v-model="editTypeName"></el-input>
        </el-form-item>

        <el-form-item :label-width='formLabelWidth' label="知识唯一表单数据">
          <el-select placeholder="请选择" v-model="knowlegeIfOnlyVal">
            <el-option
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-for="item in knowlegeIfOnlyList">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label-width='formLabelWidth' label="词性">
          <el-input placeholder="请输入(2-10字母)" size="small" style="width:250px;" v-model="editTypeCx"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogEditFormVisible = false" size="small">取 消</el-button>
        <el-button @click="editSureBtn" size="small" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {entityAddService,structrudService} from "../config/serviceConfig";
  import {formatDate} from "../../utils/commonUtil";
  import relationSearch from "../components/RelationSearch";

  export default {
    name: "HelloWorld",
    data() {
      return {
        shuProp: {
          children: 'child'
        },
        formData:{
          name:'',
          info:'',
          dataClass:''
        },
        rules:{
          name:[
            {required:true,message:'请输入属性名称'}
          ],
          dataClass:[
            {required:true,message:'请输入数据类型'}
          ]
        },
        tableData:[],
        staticTableData:[{'name':'名称','ci':'name','datatype':'文本','danzhi':'单值','title':'知识的描述'}],
        staticShow:true,
        rightinfo:{},
        visible: true,
        formLabelWidth: '100px',
        editType: '', //
        loading: true,
        options4: [],
        editTypeName: '',
        editTypeVal: '',
        editTypeCx: '',
        tableData5: [],
        addForm: {},
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        editSelfId: '',
        editParentId: '',
        allTypeList: [],
        editTypeCdNameoptions: ['实体', '属性', '关键词'],
        editTypeCdName: '',
        addApiFlag: 0,
        nowNameFlag: false,
        nowLabelFlag: false,
        allTypeListAdd: '',
        knowlegeIfOnlyVal: '1',
        knowlegeIfOnlyList: [{label: '是', value: '1'}, {label: '否', value: '0'}],
        ifCheckedOnlyFlag: false,
      };
    },
    mounted: function () {
      this.getEntityList();
      this.allEntityType();
    },
    methods: {
      changeSlectParent(e) {
        console.log(e)
        if (!e) {
          this.ifCheckedOnlyFlag = false;
          this.knowlegeIfOnlyVal = '1';
          return;
        } else {
          this.ifCheckedOnlyFlag = true;
        }
        for (let i = 0; i < this.allTypeList.length; i++) {
          if (this.allTypeList[i].id === e) {
            let obj = this.allTypeList[i];
            this.knowlegeIfOnlyVal = obj.duplicate
          }
        }
      },
      clickitem(val){
        this.staticShow=false;
        this.rightinfo = val;
        this.getSchema(val);
      },
      append(data) {
        this.editTypeVal = data.dictType.id;
        this.dialogFormVisible = true;
        this.editTypeCdName = '';
        this.editTypeName = '';
        this.editTypeCx = '';
        this.editSelfId = '';
        this.knowlegeIfOnlyVal = '1';
        this.ifCheckedOnlyFlag = false;
        this.dialogFormVisible = true;
      },
      async getSchema(val){//获取自有属性
        let data = {
          cp:1,
          ps:100,
          typeId:val.dictType.id
        }
        let result = await structrudService.getSchema(data);
        if(result.message.code==0){
          this.tableData=result.data.list;
        }else{
          this.tableData=[];
        }

      },
      //全部实体类型
      async allEntityType() {
        let result = await entityAddService.allEntityType();
        this.allTypeList = result.data || [];
      },
      //列表渲染
      async getEntityList() {
        let result = await entityAddService.getEntityTypeList();
        this.tableData5 = result.data || [];
      },
      setClassName({row, index}) {
        // 通过自己的逻辑返回一个class或者空
        return row.expand ? "expand" : "";
      },
      //添加
      addBtn() {
        this.dialogFormVisible = true;
        this.editTypeCdName = '';
        this.editTypeVal = '';
        this.editTypeName = '';
        this.editTypeCx = '';
        this.editSelfId = '';
        this.knowlegeIfOnlyVal = '1';
        this.ifCheckedOnlyFlag = false;
      },
      remoteMethod() {
      },
      //新增实体类型
      async saveSureBtn() {
        if (this.editTypeVal === '') {
          this.editTypeVal = '0';
        }
        if (!this.editTypeCdName) {
          this.$message({
            message: '词典类型不能为空！',
            type: 'warning',
          });
          return;
        }
        if (!this.editTypeVal) {
          this.$message({
            message: '父级类型名称不能为空！',
            type: 'warning',
          });
          return;
        }
        if (this.nowNameFlag) {
          this.$message({
            message: '当前类型名称已存在！',
            type: 'warning',
          });
          return;
        }
        if (this.nowLabelFlag) {
          this.$message({
            message: '当前词性已存在！',
            type: 'warning',
          });
          return;
        }
        if (!this.editTypeName) {
          this.$message({
            message: '当前类型名称不能为空！',
            type: 'warning',
          });
          return;
        }
        if (!this.editTypeCx) {
          this.$message({
            message: '词性不能为空！',
            type: 'warning',
          });
          return;
        }
        let params = {
          type: this.editTypeCdName, //词典类型
          parentId: this.editTypeVal,//父级类型名称
          name: this.editTypeName,//当前类型名称
          label: this.editTypeCx, //词性
          duplicate: this.knowlegeIfOnlyVal //是否唯一
        }
        if (this.editSelfId) {
          params.id = this.editSelfId;
        }
        // if (this.editParentId) {
        //   params.parentId = this.editParentId;
        // }
        this.addApiFlag++
        if (this.addApiFlag > 1) {
          return;
        }
        let result = await entityAddService.addEntityType(params);
        let res = JSON.parse(result)
        if (res.message.status === 200) {
          this.$message({
            message: '处理成功！',
            type: 'success',
            onClose: () => {
              this.addApiFlag = 0;
            }
          });
          this.dialogFormVisible = false;
          this.getEntityList();
          this.allEntityType();//更新类型
        }
      },
      //编辑
      async editSureBtn(row) {
        row.show = false;
        this.dialogFormVisible = true;
        this.editTypeCdName = row.dictType.type || '';//词典类型
        this.editTypeVal = row.dictType.parentId || '';//父级类型名称
        this.editTypeName = row.dictType.name || '';//当前类型名称
        this.editTypeCx = row.dictType.label || '';//词性
        this.knowlegeIfOnlyVal = row.dictType.duplicate || '';//是否唯一

        this.editSelfId = row.dictType.id;//自身id
        if (row.dictType.parentId !== 0) {
          this.ifCheckedOnlyFlag = true;
        } else {
          this.ifCheckedOnlyFlag = false;
        }
        //this.editParentId = row.dictType && row.dictType.parentId || '0';//父级id
      },
      changeEntityType(e) {
        // console.log(e)
        // if (e) {
        //   this.editParentId = '1'
        // } else {
        //   this.editParentId = '0';
        // }
      },
      async dictAddCxReplateWay(e) {
        console.log(e)
        let params = {
          field: 'name',
          value: this.editTypeName
        }
        let result = await entityAddService.getdictAddCxReplate(params);
        let res = JSON.parse(result);
        let data = res.data || ''
        if (data) {
          this.nowNameFlag = true;
          this.$message({
            message: '当前类型名称已存在！',
            type: 'warning',
          });
        } else {
          this.nowNameFlag = false;
        }
      },
      async dictAddCxReplateWayLabel(e) {
        console.log(e)
        let params = {
          field: 'label',
          value: this.editTypeCx
        }
        let result = await entityAddService.getdictAddCxReplate(params);
        let res = JSON.parse(result);
        let data = res.data || ''
        if (data) {
          this.nowLabelFlag = true;
          this.$message({
            message: '当前词性已存在！',
            type: 'warning',
          });
        } else {
          this.nowLabelFlag = false;
        }
      },
      async editTypeCdNameChange(e) {
        let params = {
          type: this.editTypeCdName
        }
        let result = await entityAddService.allEntityType(params);
        this.allTypeListAdd = result.data || [];
      }
    },
    created() {
      this.showDate = true;
    },
    components: {
      relationSearch
    },
    filters: {}
  };
</script>

<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .el-pagination {
    padding-top: 10px;
    text-align: center;
  }

  .el-pagination button.disabled {
    color: #c0c4cc;
    background-color: #fff;
    cursor: not-allowed;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-table {
    width: 99.9% !important;
  }

  .clearfix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .clearfix {
    clear: both;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .el-tree-node__content {
    position: relative;
  }
</style>
