<template>
<div>
  <el-table
    :data="tableData"
    border
    style="width:100%"
    >
    <el-table-column
      fixed
      prop="index"
      label="序号"
      width="50">
    </el-table-column>
    <el-table-column
      prop="userId"
      label="用户id"
      width="65">
    </el-table-column>
    <el-table-column
      prop="userName"
      label="用户昵称"
      width="90">
    </el-table-column>
    <el-table-column
      prop="plone"
      label="手机号"
      width="120">
    </el-table-column>
    <el-table-column
      prop="pass"
      label="密码(加密)"
      width="300">
    </el-table-column>
    <el-table-column
      prop="iframe"
      label="设备信息"
      width="120">
    </el-table-column>
    <el-table-column
      prop="clearTime"
      label="创建时间"
      width="200">
    </el-table-column>
    <el-table-column
      prop="undataTime"
      label="更新时间"
      width="200">
    </el-table-column>
    <el-table-column
      prop="diliiframe"
      label="地理信息"
      width="120">
    </el-table-column>
    <el-table-column
      prop="wx"
      label="微信等标识"
      width="180">
    </el-table-column>
    <el-table-column
      prop="dlff"
      label="登录方式"
      width="200">
    </el-table-column>
    <el-table-column
      prop="dj"
      label="等级"
      width="60">
    </el-table-column>
    <el-table-column
      prop="jb"
      label="金币"
      width="60">
    </el-table-column>
    <el-table-column
      prop="jf"
      label="积分"
      width="60">
    </el-table-column>
    <el-table-column
      prop="sybb"
      label="使用版本"
      width="80">
    </el-table-column>
    <el-table-column
      prop="zcly"
      label="注册来源"
      width="120">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        <el-button type="text" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
  export default {
    mounted(){
      this.getData()
    },
    methods: {
      handleClick(row) {
        console.log(row);
      },
      getData(){
          this.$http.post("http://love.lingkehudong.com:9097/platform/user/list",{
              data:{},
              token:sessionStorage.getItem("token"),
              pageNum:1,
              pageSize:10
          },{
              emulateJSON:false
          }).then(function(msg){
              console.log(msg.data)
              if(msg.data.success){
                var this_=this
                msg.data.data.forEach(function(item,index) {
                  var unixTimestamp = new Date( item.createtime );
                  var commonTime = unixTimestamp.toLocaleString();
                  var unixTimestamp2 = new Date( item.updatedTime );
                  var commonTime2 = unixTimestamp.toLocaleString();
                  this_.tableData.push({
                    "index":index+1,
                    "userId":item.id,
                    "userName":item.userName,
                    "plone":item.phone,
                     "pass":item.password,
                     "iframe":item.userDeviceInfo,
                     "clearTime":commonTime,
                     "undataTime":commonTime2,
                     "diliiframe":item.lat+","+item.lng+","+item.city,
                     "wx":item.loginUuid,
                     "dlff":item.description,
                     "dj":item.grade,
                     "jb":item.gold,
                     "jf":item.integral,
                     "sybb":item.version,
                     "zcly":item.registerSource
                  })
                })
              }
          })
      }
    },

    data() {
      return {
        tableData: []
      }
    }
  }
</script>
