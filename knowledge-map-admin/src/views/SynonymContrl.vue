<template>
  <div class="condition">
    <el-row class="titleHead" type="flex" align='middle'>
      <div style="padding:20px">
        <i class="el-icon-search" style="margin-right: 6px"></i>
        <span>同义词管理</span>
      </div>
    </el-row>
    <el-row class="panel">
      <el-col :span="5" class="listPanel listPanel-left condition_left">
        <el-col>
          <el-table
            :data="data6" :highlight-current-row="true"
            style="width: 100%;">
            <el-table-column align="center"  label="实体类别" highlight-current-row="true" >
              <template slot-scope="scope">
                <a style="cursor: pointer;" @click="getSynonym(scope.row)">{{ scope.row.name}}</a>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-col>
      <el-col :offset="1" :span="17" class="listPanel">
        <el-row style="padding: 20px 0;" v-if="this.SearchNature!=''">
          <el-col :span="10">
            <el-input prefix-icon="el-icon-search" v-model="SearchWords" placeholder="请输入要查找的同义词名称" @keyup.enter.native="searchSynonym"> </el-input>
          </el-col>
          <el-col :span="14">
            <el-button style="margin-left: 20px" type="primary" @click="searchSynonym">搜索</el-button>
            <el-button style="margin-left: 20px" type="primary" @click="addBaseName">添加基词</el-button>
            <el-button style="margin-left: 20px" type="primary" @click="tableToExcel"><i class="el-icon-printer"></i>导出</el-button>
          </el-col>
        </el-row>
        <el-row class="tablePanel" style="padding-top: 10px">
          <el-table  v-loading="loading"  :data="tableData"  border style="width: 100%;">
            <el-table-column label="实体名称（基词）" width="140">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.basic.baseName}}</span>
              </template>
            </el-table-column>

            <el-table-column label="当前同义词"  width="">
              <template slot-scope="scope">
              <span  v-for="tag in scope.row.synonyms">
                  <el-button style="margin:2px;" plain size="small" slot="reference" :key="tag.code" :type="success" @click="openOuter(tag,scope.row.basic)" v-show = "tag.synonym != scope.row.basic.baseName">
                    {{tag.synonym}}
                  </el-button>
              </span>
              </template>
            </el-table-column>
            <el-table-column v-if="this.SearchNature=='hy'" label="白名单状态" align="center"  width="140">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.verifyStatus | verifyStatusFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="this.SearchNature!='hy'" label="操作" width="200" fixed="right" resizeable="false">
              <template slot-scope="scope">
                <el-button size="small" type="primary" style="margin-left: 5px" @click="addSynonym(scope.$index, scope.row)">添加同义词</el-button>
                <el-button size="small" type="primary" style="margin-left: 5px" @click="deleteEvent(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column v-if="this.SearchNature=='hy'" label="操作" width="290" fixed="right" resizeable="false">
              <template slot-scope="scope">
                <el-button size="small" type="primary" style="margin-left: 5px" @click="addSynonym(scope.$index, scope.row)">添加同义词</el-button>
                <el-button  size="small" type="primary" style="margin-left: 5px"  v-if="scope.row.verifyStatus=='1'" @click="removeEvent(scope.$index, scope.row)">移除白名单</el-button>
                <el-button  size="small" type="primary" style="margin-left: 5px" v-if="scope.row.verifyStatus!='1'" @click="addEvent(scope.$index, scope.row)">添加白名单</el-button>
                <el-button size="small" type="primary" style="margin-left: 5px" @click="deleteEvent(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>

        <div v-if="showPage" class="el-pagination el-pagination--small"><span style="margin-left: 10px">共{{totalCount}}条</span><button type="button" @click="perPage" class="btn-prev" v-bind:class="{ disabled: disAblePerPage }"><i class="el-icon el-icon-arrow-left"></i></button><ul class="el-pager"><li class="number active">{{currentPage}}</li></ul><button type="button" @click="nextPage" class="btn-next" v-bind:class="{ disabled: !hasNextPage }"><i class="el-icon el-icon-arrow-right"></i></button></div>

        <el-dialog title="是否设为基词或删除" :visible.sync="outerVisible">
          <el-dialog
            width="30%"
            title="删除"
            :visible.sync="innerVisible"
            append-to-body>
            <div>是否确认删除，删除后不可恢复</div>
            <div slot="footer" class="dialog-footer">
              <el-button type="danger" @click="deteleSure">删除</el-button>
              <el-button type="primary" @click="outerVisible = false;innerVisible=false">取消</el-button>
            </div>
          </el-dialog>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger"@click="innerVisible = true" >删除</el-button>
            <el-button type="primary" @click="setSynonymSure">设为基词</el-button>
          </div>
        </el-dialog>
          <!--添加同义词弹窗-->
        <el-dialog title="添加同义词" :visible.sync="addSynonymVisible" :before-close="handleClose">
          <el-form>
            <el-form-item label="实体名称（基词）：" :label-width="formLabelWidth">
              <span >{{this.paramsSynonyms.baseName}}</span>
            </el-form-item>
            <el-form-item label="添加新的同义词：" :label-width="formLabelWidth">
              <el-input placeholder="请输入添加新的同义词" v-model="SynonymsName"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addSynonymVisible = false">取 消</el-button>
            <el-button type="primary" @click="SureaddSynonym">确 定</el-button>
          </div>
        </el-dialog>
        <!--添加基词弹窗-->
        <el-dialog title="添加基词" :visible.sync="addBaseVisible">
          <el-form>
            <el-form-item label="添加基词：" :label-width="formLabelWidth">
              <el-input placeholder="请输入添加新的基词" v-model="NewBaseName"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addBaseVisible = false">取 消</el-button>
            <el-button type="primary" @click="SureaddBase">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { searchService } from '../config/serviceConfig';
  export default {
    name: 'HelloWorld',
    data () {
      return {
        WhiteBlackType:{},
        formLabelWidth:'120',
        totalCount:'',
        addBaseVisible:false,//添加基词弹窗
        addSynonymVisible:false,//添加同义词弹窗
        addBaseNameType:'',//添加基词的type
        showCode:true,//是否展示键盘精灵股票码
        size:'10',//键盘精灵数量
        oldTag:{},//原基词所在对象
        paramsSynonyms:{},
        SynonymsName:'',
        NewBaseName:'',
        SearchWords_base:'',
        tag:{},//点击的同义词对象
        deleteId:'',//需要删除的id
        currentPage: 1,
        disAblePerPage:true,
        hasNextPage:true,
        outerVisible: false,
        outerVisible1: false,
        innerVisible: false,
        code:'',//基词code
        nodeData:{},
        SearchNature:'',
        SearchWords:'',
        success:'success',
        warning:'warning',
        showPage:true,
        tableData: [],
        restaurants: [],
        loading:true,
        data6:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        options4: [],
        value9: [],
        list: [],
      }
    },
    methods: {
      handleClose() {
        this.addSynonymVisible = false;
        this.SearchWords_base = ''
        this.SearchWords = ''
      },
      //打开操作基词对话框
      openOuter(tag, oldTag) {
        this.oldTag = oldTag;
        this.tag = tag;
        this.deleteId = tag.id;
        this.outerVisible = true;
        this.SearchWords_base = oldTag.baseName
      },
      //设置基词操作
      async setSynonymSure() {
        let params = {
          baseName: this.tag.synonym,
          id: this.oldTag.id,
          type: this.oldTag.type,
          displayName: this.tag.synonym,
          createAt: this.oldTag.createAt,
          updateAt: this.oldTag.updateAt
        };
        let res = await searchService.setSynonym(params);
        if (res.message.code == 0) {
          this.outerVisible = false;
          this.innerVisible = false;
          this.SearchWords = this.SearchWords_base;
          this.searchSynonym();
        } else {
          this.$message.error('设置失败');
        }
      },
      //添加同义词
      addSynonym(index, row) {
        this.addSynonymVisible = true;
        this.paramsSynonyms = row.basic;
        this.SearchWords = row.basic.baseName;
        this.SearchWords_base = this.SearchWords
      },
      //添加基词
      addBaseName() {
        this.addBaseVisible = true;
      },
      /*添加基词*/
      async SureaddBase() {
        let params = {};
        params.type = this.addBaseNameType;
        params.baseName = this.NewBaseName;
        let res = await searchService.addSynonymServer(params);
        res = JSON.parse(res);
        if (res.message.code == 0) {
          this.addBaseVisible = false;
          this.SearchWords = this.NewBaseName;
          this.SearchWords_base = this.SearchWords;
          this.searchSynonym();
          this.NewBaseName = '';
        } else {
          this.$message.error('添加失败');
        }
      },
      //添加同义词
      async SureaddSynonym() {
        let params = {};
        params.synonyms = this.SynonymsName;
        params.baseId = this.paramsSynonyms.id;
        params.type = this.paramsSynonyms.type;
        params.baseName = this.paramsSynonyms.baseName;
        let res = await searchService.addSynonymServer(params);
        res = JSON.parse(res);
        if (res.message.code == 0) {
          this.addSynonymVisible = false;
          this.SearchWords = this.SearchWords_base;
          this.searchSynonym();
          this.SynonymsName = ''
        } else {
          this.$message.error('添加失败');
        }
      },
      //删除基词
      deleteEvent(index, row) {
        this.$confirm('确定基词么？', '提示', {type: 'warning'}).then(() => {
          this.confirmDelete(row.basic.id)
        }).catch(() => {
        });
      },
      async confirmDelete(id) {
        let result = await searchService.deleteImportant({baseWordId: id});
        result = JSON.parse(result);
        if (result.message.code == 0) {
          this.SearchWords = '';
          this.getData(this.nodeData);
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
      //删除同义词
      async deteleSure() {
        let params = {
          id: this.deleteId
        };
        //kjasida
        let res = await searchService.deteleSynonym(params)
        res = JSON.parse(res);
        if (res.message.code == 0) {
          this.outerVisible = false;
          this.innerVisible = false;
          this.SearchWords = this.SearchWords_base;
          this.searchSynonym();
        } else {
          this.$message.error('删除失败');
        }
      },
      //移除白名单
      async removeEvent(index, row) {
        let params = {
          baseName: row.basic.baseName
        };
        this.loading = true;
        let res = await searchService.delWhiteList(params);
        res = JSON.parse(res);
        if (res.message.code == 0 && res.data) {
          this.getData(this.WhiteBlackType)
        } else {
          this.$message.error('移除失败');
        }
      },
      //添加白名单
      async addEvent(index, row) {
        let params = {
          baseName: row.basic.baseName
        };
        this.loading = true;
        let res = await searchService.addWhiteList(params);
        res = JSON.parse(res);
        if (res.message.code == 0 && res.data) {
          this.getData(this.WhiteBlackType)
        } else {
          this.$message.error('添加失败');
          this.loading = false;
        }
      },
      //获取左侧实体类别
      async getLeftTree() {
        let res = await searchService.getLeftList()
        if (res.message.code == 0) {
          this.data6 = res.data
          this.outerVisible = false;
          this.innerVisible = false;
          this.getData(this.nodeData);
        } else {
          this.$message.error('获取失败');
        }
      },
      //点击左侧实体类别
      getSynonym(row) {
        if (row.nature == 'hy') {
          this.WhiteBlackType = row;
        }
        this.currentPage = 1;
        this.loading = true;
        this.disAblePerPage = true;
        this.SearchNature = row.nature;
        this.addBaseNameType = row.type;
        this.SearchWords_base = '';
        this.SearchWords = '';
        this.getData(row)
      },
      //获取股票、行业产品数据
      async getData(data) {
        this.nodeData = data
        let params = {
          cp: this.currentPage,
          ps: 10,
          type: this.nodeData.type
        };
        var res = await searchService.getSearch(params);
        if (res.message.code == 0 && res.data != undefined) {
          this.loading = false;
          this.showPage = true;
          this.totalCount = res.data.totalCount;
          this.tableData = res.data.synonymvoList;
        }
      },

      //根据实体查询基词同义词
      async searchSynonym() {
        let params = {
          nature: this.SearchNature,
          words: this.SearchWords,
        };
        if (this.SearchWords == '') {
          this.$message({
            showClose: true,
            message: '请输入要查找的同义词名称',
            type: 'success'
          });
          return
        }
        this.SearchWords_base = this.SearchWords;
        var res = await searchService.searchSynonym(params)
        if (res.message.code == 0 && res.data != undefined) {
          this.loading = false;
          this.showPage = true;
          this.totalCount = res.data.synonymvoList.length;
          this.tableData = res.data.synonymvoList;
        }
      },
      //点击页码获取数据
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loading = true;
        this.getData(this.nodeData);
      },
      nextPage() {
        if (this.hasNextPage) {
          this.disAblePerPage = false;
          this.currentPage++;
          this.loading = true;
          this.getData(this.nodeData);
        }
      },
      perPage() {
        if (this.currentPage == 1) {
          return;
        } else {
          this.currentPage--;
          this.currentPage == 1 ? this.disAblePerPage = true : this.disAblePerPage = false;
          this.loading = true;
          this.getData(this.nodeData);
        }
      },

      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options4 = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options4 = [];
        }
      },
      handleEdit(index, row) {

        console.log(index);
        console.log(row);
      },
      async querySearch(queryString, cb) {
        if (!queryString) return;
        let params = {
          query: queryString,
          size: this.size
        };
        let res;
        if (this.nodeData.id == 1) {
          res = await searchService.promptStock(params)
        } else {
          res = await searchService.promptIndustryOrproduct(params)
          res.data = res.data.map(item => {
            return {code: item, label: item};
          })
        }
        // 调用 callback 返回建议列表的数据
        var restaurants = res.data;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        cb(results);


      },
      tableToExcel() {
        let jsonData = [];
        this.tableData.forEach(item => {
          let datas = {};
          let synonyms = [];
          datas.baseName = item.basic.baseName;
          for (let i = 0; i < item.synonyms.length; i++) {
            if (item.synonyms[i].synonym != datas.baseName) {
              synonyms.push(item.synonyms[i].synonym);
            }
          }
          datas.synonym = synonyms.join('  ');
          jsonData.push(datas);
        });
        //列标题，逗号隔开，每一个逗号就是隔开一个单元格
        let str = `实体名称（基词）,当前同义词\n`;
        //增加\t为了不让表格显示科学计数法或者其他格式
        for (let i = 0; i < jsonData.length; i++) {
          for (let item in jsonData[i]) {
            str += `${jsonData[i][item] + '\t'},`;
          }
          str += '\n';
        }
        //encodeURIComponent解决中文乱码
        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
        //通过创建a标签实现
        let link = document.createElement("a");
        link.href = uri;
        //对下载的文件命名
        link.download = "实体管理.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    mounted: function(){
      this.getData(this.nodeData);
    },
    created(){
        this.getLeftTree();
    },
    components: {
    },
    filters: {
      verifyStatusFilter:function (val) {
        //0 待审核  -1未加入 -2待加入 1已加入
        if(val=='0'){
          return '待加入'
        }else if(val=='-1'){
          return '未加入'
        }else if(val=='-2'){
          return '待加入'
        }else if(val=='1'){
          return '已加入'
        }
      },
    }
    //
  }
</script>
<style>
  .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
  .el-table__body tr.current-row>td {
    background-color: #DCDFE6;
  }
</style>
<style scoped>
.listPanel{
  /*height:650px;*/
  overflow-y: auto;
  color:#000;
}
  .listPanel-left{
    border:1px solid #E4E7ED;
  }
  i{
    margin-right:6px;
  }
  .el-autocomplete{
    width:240px;
    padding:20px 0;
  }
  .el-pagination{
    padding-top:10px;
    text-align:center;
  }
  .tablePanel{
    /*height:500px;*/
    overflow-y: auto;
  }

  .titleHead{
    text-align: left; font-size: 12px;background-color:#20a0ff;height:40px;color:#fff;
  }
.condition_left
{
  margin-top:10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
  border-radius: 4px;
}

.my-autocomplete li {
  line-height: normal;
  padding: 7px;
}
  .my-autocomplete .name {
  text-overflow: ellipsis;
  overflow: hidden;
}
  .my-autocomplete .addr {
  font-size: 12px;
  color: #b4b4b4;
}

.my-autocomplete highlighted .addr {
  color: #ddd;

}

</style>
