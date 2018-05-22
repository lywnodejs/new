<template>
	<div class="header_">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item>聆刻互动P端管理平台</el-breadcrumb-item>
		  <el-breadcrumb-item>{{msg}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-button type="primary" size="small" @click="unlogin()">退出登录</el-button>
	</div>
</template>

<script>
export default{
	data(){
		return {
			msg:""
		}
	},
	mounted(){
		this.get()
	},
	methods:{
		get(){
			this.msg=this.$router.history.current.name
		},
		unlogin(){
			this.$confirm('即将退出并回退到登录页, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
			sessionStorage.removeItem("token");
			this.$router.push({path:"/"});
			$("body,html").css({
				background:"url(http://img.zcool.cn/community/01a3f4589ea315a801219c77c63f72.jpg@1280w_1l_2o_100sh.webp) no-repeat",
				backgroundSize:"100% 100%"
			})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });
        });
		}
	},
	watch:{
		$route:"get"
	}
}
</script>

<style lang="css" scoped>
	.header_{
		width:100%;
		height: 60px;
		background: #fff;
		padding-top: 20px;
		padding-left: 20px;
		box-sizing: border-box;
		border: none;
	}
	.el-button{
		position:absolute;
		top:15px;
		right:30px;
	}
</style>