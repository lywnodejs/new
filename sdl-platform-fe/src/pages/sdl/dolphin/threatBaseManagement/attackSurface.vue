<template>
    <div class="accack">
        <div class="el-main">
            <el-form class="searchForm" label-position="left"  :inline='true'>
                <div class="displayFlex">
                    <el-form-item label="攻击面名称:" label-width="80px" prop="name">
                        <el-input class="searchInput"
                        clearable
                        v-model="inputVal"
                        placeholder="请输入攻击面名称"
                        auto-complete="off">
                        </el-input>
                    </el-form-item>
                </div>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item align="center">
                            <button type="button" class='accack-button' @click="fetchData(inputVal)"><span>搜&nbsp;&nbsp;索</span></button>
                            <button type="button" class='accack-btn' @click="openDialog('add')"><span>新增攻击面</span></button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div class="cutLine"></div>


            <el-table :data="attackSurface" v-loading>
                <el-table-column prop="attack_surface_id" label="攻击面ID" align="center" width="100"></el-table-column>
                <el-table-column prop="attack_surface_name" label="攻击面名称" align="center"></el-table-column>
                <el-table-column  prop="is_disable" label="操作" width="180px" align="center">
                    <template slot-scope="scope" prop="is_disable">
                        <el-button class="button" type="text" size="mini" @click="openDialog('look',scope.row)" >查看</el-button>
                        <el-button class="button" type="text" size="mini" @click="openDialog('edit',scope.row)">编辑</el-button>
                        <el-button class="button" type="text" size="mini" v-show="scope.row.is_disable==1" @click="enableAttack(scope.row.attack_surface_id)">启用</el-button>
                        <el-button class="button" type="text" size="mini" v-show="scope.row.is_disable==0" @click="disableAttack(scope.row.attack_surface_id)">禁用</el-button>
                    </template>
                </el-table-column>
                </el-table>
                <div align="right" style="margin-top: 10px;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryParam.page"
                    :page-sizes="[10,20,30, 50]"
                    :page-size="queryParam.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="num">
                </el-pagination>
                </div>
        </div>
        <!-- 编辑查看威胁 -->
        <el-dialog :title="action==3 ? '查看攻击面':'编辑攻击面'" :visible.sync="dialogFormVisible" width="460px">
            <el-form :inline="true"   label-width="100px" label-position="left">
              <!-- <el-col> -->
                <el-form-item label="攻击面ID" >
                    <el-input class="inputWidth" v-model="attackSurfaceDetail.attack_surface_id" placeholder="请数据测试环境地址" clearable :disabled="true"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="攻击面名称" >
                    <el-input class="inputWidth" v-model="attackSurfaceDetail.attack_surface_name" placeholder="请输入威胁名称" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="创建时间" >
                    <el-input class="inputWidth" v-model="attackSurfaceDetail.create_time" placeholder="" clearable :disabled="true"></el-input>
                </el-form-item>
              <!-- </el-col>
              <el-col> -->
                <el-form-item label="更新时间" >
                    <el-input class="inputWidth" v-model="attackSurfaceDetail.update_time" placeholder="" clearable :disabled="true"></el-input>
                </el-form-item>
              <!-- </el-col> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="accackEvalu-button" @click="dialogFormVisible = false">取消</el-button>
                <el-button class="accackEvalu-btn" type="warning" round @click="updateAttack(attackSurfaceDetail.attack_surface_id, attackSurfaceDetail.attack_surface_name)">确定</el-button>
            </div>
        </el-dialog>
        <!-- 新增威胁 -->
        <el-dialog title="新增攻击面" :visible.sync="newDialogFormVisible" width="460px">
            <el-form :inline="true"  style="margin-top: 10px;" label-width="100px" label-position="left">
              
              <!-- <el-col> -->
                <el-form-item label="攻击面名称" >
                    <el-input class="inputWidth" v-model="attackSurfaceDetail.attack_surface_name" placeholder="请输入攻击面名称" clearable :disabled="!editable"></el-input>
                </el-form-item>
              <!-- </el-col> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="accackEvalu-button" @click="newDialogFormVisible = false">取消</el-button>
                <el-button class="accackEvalu-btn" type="warning" round @click="createAttack(attackSurfaceDetail.attack_surface_name)">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { connect } from '@/lib'

export default connect(() => {
  return {

      attackSurface: 'dolphin_threat/attackSurface',
      num: 'dolphin_threat/attackSurfaceLength',
      attackSurfaceStatus: 'dolphin_threat/attackSurfaceStatus'
  }
}, {
  getAttackSurface: 'dolphin_threat/getAttackSurface',
  enableAttackSurface: 'dolphin_threat/enableAttackSurface',
  disableAttackSurface: 'dolphin_threat/disableAttackSurface',
  updateAttackSurface: 'dolphin_threat/updateAttackSurface',
  createAttackSurface: 'dolphin_threat/createAttackSurface'
})({
    name: 'accack',
    data() {
      return {
        inputVal: '',
        editable: false,
        dialogFormVisible: false,
        action: 0,
        newDialogFormVisible: false,
        deleteDialogVisible: false,
        attackSurfaceDetail: {
            attack_surface_id: 0,
            attack_surface_name: '',
            create_time: '',
            update_time: ''
        },
        queryParam: {
          page: 1,
          limit: 10,
          keywords: {attack_surface_name: ''}
        }
      }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData(name) {
            this.queryParam.keywords.attack_surface_name = name
            let queryParam = {queryParam: this.queryParam}
            this.getAttackSurface(queryParam).then(res => {
            })
        },
        openDialog(action = 'look', text) {
            if (action === 'edit') {
                this.action = 1
                this.editable = true
                this.attackSurfaceDetail.attack_surface_id = text.attack_surface_id
                this.attackSurfaceDetail.attack_surface_name = text.attack_surface_name
                this.attackSurfaceDetail.create_time = text.create_time
                this.attackSurfaceDetail.update_time = text.update_time
                this.dialogFormVisible = true
            } else if (action === 'add') {
                this.action = 2
                this.editable = true
                this.newDialogFormVisible = true
            } else {
                this.action = 3
                this.attackSurfaceDetail = text
                this.editable = false
                this.dialogFormVisible = true
            }
        },
        updateAttack(id, name) {
            let obj = {id: id, name: name}
            this.updateAttackSurface(obj)
            this.fetchData()
            this.dialogFormVisible = false
        },
        createAttack(name) {
            this.createAttackSurface(name)
            this.fetchData()
            this.newDialogFormVisible = false
        },
        enableAttack(id) {
            this.enableAttackSurface(id).then(res => {})
            this.fetchData()
        },
        disableAttack(id) {
            this.disableAttackSurface(id).then(res => {})
            this.fetchData()
        },
        handleSizeChange(val) {
        this.queryParam.limit = val
        this.fetchData()
        },
        handleCurrentChange(val) {
            this.queryParam.page = val
            this.fetchData()
        }
    }
})
</script>
<style lang="less" scoped>
.accack-btn{
  border: 1px solid #FC9153;
  border-radius: 4px;
  width: 95px;
  height: 32px;
  color: #FC9153;
  background: white;
  margin-left: 25px;
  cursor: pointer;
  font-size: 13px;
  -webkit-font-smoothing: antialiased;
  // line-height: 33px;
  span{
    font-family: Avenir,Helvetica,Arial,sans-serif;
    // font-weight: 100;
  }
}
.accack-button{
  background: #FC9153;
  border-radius: 4px;
  width: 95px;
  height: 32px;
  border: none;
  color: white;
  margin-top: 5px;
  margin-left: 80px;
  font-size: 13px;
  -webkit-font-smoothing: antialiased;
  cursor: pointer;
  span {
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }
}
.accack-btn:hover{
    background-color: #fff3e8;
}

.accackEvalu-button{
  width: 90px;
  // font-weight: 100;
  font-size: 13px;
  height: 32px;
  padding: 0;
  
}
.accackEvalu-btn{
  font-size: 13px;
  background: #FC9153;
  border-radius: 4px;
  height:32px;
  width: 90px;
  padding: 0;
  border: none;
  // font-weight: 100;
  // margin-right: 13px;
}
  .accack{
    width: 100%;
    background: white;
    // margin-top: -15px;
    // padding-left: 5px;
    .el-main{
    width: 100%;
    box-sizing: border-box;
    // margin-top: -15px;
    // padding: 20px;
    // margin-left: -5px;
    .displayFlex{
      display: flex;
    }
    .searchForm{
      .searchInput{
        width: 230px;
      }
    }
  }
}
.el-button--text{
    // font-weight: 400;
}
.inputWidth{
    width: 320px;
}
.cutLine {
  // border: 1px solid
  margin-top: 5px;
  margin-bottom: 17px;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.10);
  // background: rgba(0, 0, 0, 0.10);
  // border-radius: 4px;
}
</style>
