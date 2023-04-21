<template>
    <div>
        <el-button @click="setShow()">筛选查询</el-button>

            <el-collapse-transition>
                <div v-show="show3">
                    <el-form :model="form" label-width="120px" :inline="true">
                      <el-row>
<el-form-item label="标题：">
                            <el-input v-model="title" placeholder="标题关键字"></el-input>
                        </el-form-item>
                        <el-form-item label="栏目：">
                            <el-select style="width: 180px;" v-model="lanMuA" placeholder="请选择">
                                <el-option
                                        v-for="item in topOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-show="topOptionsB.length!==0" style="width: 180px;" v-model="lanMuB" placeholder="请选择">
                                <el-option
                                        v-for="item in topOptionsB"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-show="topOptionsC.length!==0" style="width: 180px;" v-model="lanMuC" placeholder="请选择">
                                <el-option
                                        v-for="item in topOptionsC"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                      </el-row>
                        <el-row>
                        <el-form-item label="置顶状态：">
                            <el-select style="width: 180px;" v-model="topFlag_" placeholder="请选择">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已置顶" value="2"></el-option>
                                <el-option label="未置顶" value="1"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="删除状态：">
                            <el-select style="width: 180px;" v-model="delFlag_" placeholder="请选择">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已删除" value="2"></el-option>
                                <el-option label="未删除" value="1"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="getList(true)">查询结果</el-button>
                        </el-form-item>
                        </el-row>
                    </el-form>
                </div>
            </el-collapse-transition>
        <el-divider></el-divider>
      数据列表
        <el-button style="margin-left: 10px;" type="primary" @click="newAdd()" v-if="menuList.indexOf('eoperation:hczqinfo:add')==-1?false:true">发布文章</el-button>
        <el-table
                ref="multipleTable"
                v-loading="loading"
                style="width: 100%;margin-top:20px;"
                border
                :show-overflow-tooltip="true"
                :data="tableData"
                tooltip-effect="dark">
            <el-table-column
                    width="150"
                    label="发布时间">
                <template slot-scope="scope">{{ scope.row.publishAt | timeDateChange }}</template>
            </el-table-column>
            <el-table-column
                    label="一级栏目">
                <template slot-scope="scope">{{scope.row.menus[0]? scope.row.menus[0].name : '--'}}</template>
            </el-table-column>
            <el-table-column
                    label="二级栏目">
                <template slot-scope="scope">{{scope.row.menus[1]? scope.row.menus[1].name :'--'}}</template>
            </el-table-column>
            <el-table-column
                    label="三级栏目">
                <template slot-scope="scope">{{scope.row.menus[2]? scope.row.menus[2].name :'--'}}</template>
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="标题">
            </el-table-column>
            <el-table-column
                    label="发布状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.delFlag==1">{{scope.row.publishStatus=="1"? "已发布":"未发布"}}</span>
                    <span v-if="scope.row.delFlag==2">--</span>
                  </template>
            </el-table-column>
            <el-table-column
                    label="置顶状态">
                <template  slot-scope="scope">
                  <span v-if="scope.row.delFlag==1">{{ scope.row.topFlag ==1? '--':'已置顶' }}</span>
                  <span v-if="scope.row.delFlag==2">--</span>
                  </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="280">
                <template slot-scope="scope">
                    <el-button
                            @click.native.prevent="toLook(scope.row)"
                            type="text"
                            size="small">
                        查看
                    </el-button>
                    <el-button
                            v-if="menuList.indexOf('eoperation:hczqinfo:edit')!=-1 && scope.row.delFlag==1"
                            @click.native.prevent="toEdit(scope.row.id)"
                            type="text"
                            size="small">
                        编辑
                    </el-button>
                    <el-button
                            v-if="menuList.indexOf('eoperation:hczqinfo:publish')!=-1 && scope.row.publishStatus=='2' && scope.row.delFlag==1"
                            @click.native.prevent="publish(scope.row)"
                            type="text"
                            size="small">
                        发布
                    </el-button>
                    <el-button
                            v-if="menuList.indexOf('eoperation:hczqinfo:top')!=-1 && scope.row.delFlag==1"
                            @click.native.prevent="topEdit(scope.row, tableData)"
                            type="text"
                            size="small">
                        {{scope.row.topFlag==2? '取消置顶' : '置顶'}}
                    </el-button>
                    <el-button
                            v-if="menuList.indexOf('eoperation:hczqinfo:del')!=-1"
                            @click.native.prevent="delContent(scope.row, tableData)"
                            type="text"
                            size="small">
                        {{scope.row.delFlag==1? '删除' : '已删除'}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-col :offset="10" :span="10">
            <el-button type="text" v-show="cp!==1" @click="prePage()">上一页</el-button>
            <el-button type="text">当前页：{{cp}}</el-button>
            <el-button type="text" v-show="hasNextPage" @click="nePage()">下一页</el-button>
        </el-col>

    </div>
</template>

<script>
  export default {
    name: 'contentMaintain',
    data(){
      return {
        show3:false,
        hasNextPage:false,
        title:'',
        cp:1,
        lanMuA:'',
        lanMuB:'',
        lanMuC:'',
        tableData:[],
        loading:false,
        menuList:'',
        topOptions:[],
        topOptionsB:[],
        topOptionsC:[],
        topFlag_:'',
        delFlag_:''
      }
    },
    created(){
      this.getmenu();
      this.getList();
      this.menuList = window.localStorage.getItem('menuList');
    },
    watch:{
      lanMuA(val){
        if(val==-999999){
          this.topOptionsB=[];
          this.topOptionsC=[];
          this.lanMuB='';
          this.lanMuC='';
          return ;
        }
        this.$http.get('/subject/operate/hczq/info/menu?parentId='+val).then(function (result) {
            this.topOptionsB = result.data.data;
            this.topOptionsC=[];
            this.topOptionsB.unshift({
              id:-999999,
              name:'全部'
            })
            this.lanMuB=-999999;
        })
      },
      lanMuB(val){
        if(val==-999999){
          this.topOptionsC=[];
          this.lanMuC='';
          return ;
        }
        if(this.lanMuB=='') return ;
        this.$http.get('/subject/operate/hczq/info/menu?parentId='+val).then(function (result) {
            this.topOptionsC = result.data.data;
            this.topOptionsC.unshift({
              id:-999999,
              name:'全部'
            })
            this.lanMuC=-999999;
        })
      }
    },
    methods:{
      setShow(){
        this.show3= !this.show3;
      },
      toLook(obj){
        if(window.location.port=='10011'|| window.location.port=='8282'){
          window.open('http://10.0.0.22:9093/hczq/getInfoDetail.do?hczqInfoId='+obj.id);
        }else if(window.location.port=='10007'){
          window.open('http://10.0.0.105:9093/hczq/getInfoDetail.do?hczqInfoId='+obj.id);
        }else{
          window.open('http://www.hczq.com/hczq/getInfoDetail.do?hczqInfoId='+obj.id);
        }
      },
      prePage(){
        this.cp--;
        this.getList();
      },
      nePage(){
        this.cp++;
        this.getList();
      },
      toEdit(val){
        if(this.menuList.indexOf('eoperation:hczqinfo:edit')==-1){return};
        this.$router.push({
          path:'/sendSubject',
          query:{
            contentId:val
          }
        })
      },
      newAdd(){
        this.$router.push({
          path:'/sendSubject',
        })
      },
      publish(obj){//发布操作
        if(this.menuList.indexOf('eoperation:hczqinfo:publish')==-1){return};
        this.$confirm('确认【发布】此条信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var id = obj.id;
          this.$http.post('/subject/operate/hczq/info/quickPublish',{id:id},{emulateJSON:true}).then((res)=>{
            if(res.data.message.code==-1){
              this.$message({
                type: 'info',
                message: '服务出现错误'
              });
            }else{
              this.$message({
                type: 'success',
                message: '已发布'
              });
            }
            this.getList(true);
          }).catch(() => {
          this.$message({
            type: 'info',
            message: '服务错误'
          });
        });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      topEdit(obj){//置顶、、取消置顶
      if(this.menuList.indexOf('eoperation:hczqinfo:top')==-1){return};
      var status ='';
      var txt ='';
      if(obj.topFlag==1){
        status = 2;
        txt = '置顶'
      }else{
        status = 1;
        txt = '取消置顶'
      }
        this.$confirm('确认【'+txt+'】此条信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var id = obj.id;
          var topFlag = obj.topFlag==1? 2: 1;
          this.$http.post('/subject/operate/hczq/info/top',{id:id,topFlag:status},{emulateJSON:true}).then((res)=>{
            if(res.data.message.code==-100){
              this.$message({
                type: 'info',
                message: '此类型的置顶个数不能超过三个'
              });
              return
            }
            if(res.data.message.code==-1){
              this.$message({
                type: 'info',
                message: '服务出现错误'
              });
            }else{
              this.$message({
                type: 'success',
                message: '已'+txt
              });
            }
            this.getList(true);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      delContent(obj){//删除文章
      if(this.menuList.indexOf('eoperation:hczqinfo:del')==-1){return};
        if(obj.delFlag==2) return;
        this.$confirm('确认【删除】此条信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var id = obj.id;
          var params={
            id
          }
          this.$http.post('/subject/operate/hczq/info/del',params,{emulateJSON:true}).then((res)=>{
            if(res.data.message.code==-1){
              this.$message({
                type: 'info',
                message: '服务出现错误'
              });
            }else{
              this.$message({
                type: 'success',
                message: '已删除'
              });
            }
            this.getList(true);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      getmenu(){
        this.$http.get('/subject/operate/hczq/info/menu').then(function (result) {
          if(result && result.data.length!==0){
            this.topOptions = result.data.data;
            this.topOptions.unshift({
              id:-999999,
              name:'全部'
            })
          }
        })
      },
      getList(bool){
        if(bool){this.cp=1};
        this.loading=true;
        var params = {
          cp:this.cp,
          ps:10,
          title:this.title,
          topFlag:this.topFlag_,
          delFlag:this.delFlag_
        }
        var arr ='?menuIds='+this.lanMuA+'&menuIds='+this.lanMuB+'&menuIds='+this.lanMuC;
        if(this.lanMuA==''){
          arr='';
        }
        this.$http.get('/subject/operate/hczq/info/list'+arr,{params}).then(function (result) {
          if(result && result.data.length!==0){
            this.tableData=result.data.data.infos;
            this.hasNextPage = result.data.data.hasNextPage;
          }
          this.loading=false;
        })
      },
    },
    mounted(){

    }

  }
</script>

<style scoped>

</style>
