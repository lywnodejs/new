<template>
    <!--机器人设置页面 logo 昵称  换肤 等设置-->
  <el-dialog  :visible.sync="setDialogVisible" :close-on-click-modal="false" @close="closeDialog()" custom-class="dialogClass"  >
    <div slot="title">机器人前端效果配置</div>
    <el-form :model="form" :rules="rules" ref="form" v-loading="setLoading">
      <el-form-item class="logoupload" label="机器人Logo:" :label-width="formLabelWidth">
        <el-upload
          class="avatar-uploader"
          action="robotConfig/oss/fileupload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload"
          :on-change="addLogo"
        >
          <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>只能上传jpg/png文件,且不超过500kb</span>
      </el-form-item>
      <el-form-item label="机器人名称:" :label-width="formLabelWidth">
        <el-input v-model="form.nickName"  placeholder="请输入名称"></el-input>
      </el-form-item>
      <!--<el-form-item label="机器人皮肤:" :label-width="formLabelWidth">-->
        <!--<el-row type="flex" >-->
          <!--<div-->
            <!--v-for="(item,index) in robotSkinCorlor "-->
            <!--:key="item"-->
            <!--style="width: 57px;height: 57px;margin-left:5px; border-radius: 6px;-->
<!--"-->
            <!--:class="selectIndex==index?selectClass:''"-->
          <!--&gt;-->
            <!--<el-card-->
              <!--shadow="hover"-->
              <!--style="width: 50px;height:50px;margin: 2.5px"-->
              <!--:class="item"-->
              <!--@click.native="clickColorBlock($event,index,item)"-->
            <!--&gt;-->
            <!--</el-card>-->
          <!--</div>-->

          <!--&lt;!&ndash;<el-card&ndash;&gt;-->
            <!--&lt;!&ndash;shadow="hover"&ndash;&gt;-->
            <!--&lt;!&ndash;v-for="(item,index) in robotSkinCorlor "&ndash;&gt;-->
            <!--&lt;!&ndash;:key="item"&ndash;&gt;-->
            <!--&lt;!&ndash;style="width: 50px;height: 50px;margin-left:5px"&ndash;&gt;-->
            <!--&lt;!&ndash;:class="[item,selectIndex==index?selectClass:'']"&ndash;&gt;-->
            <!--&lt;!&ndash;@click.native="clickColorBlock($event,index,item)"&ndash;&gt;-->
          <!--&lt;!&ndash;&gt;&ndash;&gt;-->
          <!--&lt;!&ndash;</el-card>&ndash;&gt;-->
        <!--</el-row>-->
      <!--</el-form-item>-->
      <el-form-item  label="机器人皮肤:" :label-width="formLabelWidth">
        <div >
          <el-col
            v-for="(item,index) in robotSkinCorlor "
            :key="item"
            style="width: 57px;height: 80px;margin-left:5px"
          >
            <div style="width: 57px;height: 57px; border-radius: 6px;"
                 :class="selectIndex==index?selectClass:''">
              <el-card
                shadow="hover"
                style="width: 50px;height:50px;margin: 2.5px"
                :class="item"
                @click.native="clickColorBlock($event,index,item)"
              >
              </el-card>
            </div>
            <div style="line-height: 25px;text-align: center;font-size: 12px">{{robotSkinTitle[index]}}</div>

          </el-col>

        </div>
      </el-form-item>
      <el-form-item class="fileload" label="免责声明:" :label-width="formLabelWidth">
        <el-upload
          action="robotConfig/oss/fileupload"
          :on-success="handlefileSuccess"
          :on-error="handlefileError"
          :before-upload="beforefileUpload"
          ref="uploadFile"
          :file-list="fileLists"
          :show-file-list ='fileLists.length>0'
          :on-change="addFile"
          :on-remove="removeFile"

        >
          <el-button  size="mini" type="primary">选择文件</el-button>
          <span style="margin-left: 10px">支持html文件</span>
        </el-upload>
        <el-checkbox v-model="form.isAutomaticPopUp">免责声明是否自动弹出</el-checkbox>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="显示选择:">
        <div style="line-height: 30px;margin-top: 5px" >
          <el-checkbox v-model="form.isShowBanner">是否显示首页轮播</el-checkbox>
          <el-checkbox v-model="form.isShowUserQa">是否显示用户问题</el-checkbox>
          <el-checkbox v-model="form.isShowZan">是否要显示赞和踩</el-checkbox>
          <el-checkbox v-model="form.isShowRecommendQa">是否显示推荐问题</el-checkbox>
        </div>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="记录选择:">
        <el-checkbox v-model="form.isShowHistoryRecord">是否记录历史问题</el-checkbox>
        <div style="font-size: 12px;line-height:0px;margin-left: 23px">说明:保存近5个问题</div>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="功能支持:">
        <el-checkbox v-model="form.isSupportPush">是否支持主动推送</el-checkbox>
        <div  style="line-height: 20px" >
          <el-checkbox v-model="form.isWebVoice">是否支持web语音录入</el-checkbox>
          <div style="font-size: 12px;margin-left: 23px">说明:只支持https协议, chrome 53+, firefox 55+, opera 40+浏览器, 不支持IE</div>
        </div>

      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="setDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {robotConfigService} from '../../service/index';

  export default {
        name: "RobotSetting",
        props: ['dialogVisible','robotData'],

        data(){
          return{
            setLoading:false,
            robotSkinCorlor:['default','blue','red','black','orange','purple','pink','gray','Inkblue'],
            robotSkinTitle:['默认','蓝色','红色','黑色','橙色','紫色','粉色','灰色','墨蓝'],
            selectIndex:0,
            setDialogVisible:this.dialogVisible,
            robotSetId:'',
            selectClass:'selectClass',
            formLabelWidth: '120px',
            fileLists:[],//已上传文件列表
            form: {
              imageUrl:'',//logoUrl
              nickName: '',//昵称
              skin:'默认',//皮肤
              isAutomaticPopUp:true,//免责声明是否自动弹出
              isShowBanner:true,//是否显示首页轮播
              isShowUserQa:true,//是否显示用户问题
              isShowZan:true,//是否显示赞,踩
              isShowRecommendQa:true,//是否显示推荐问题
              isShowHistoryRecord:true,//是否显示历史记录
              isSupportPush:false,//是否支持推送
              isWebVoice:false,//是否支持web语音

            },
            logoPath:'',//提交给后台的logo路径（先上传logo后台会返回该路径,最终提交时使用）
            filePath:'',//免责声明的路径（先上传免责声明后台会返回该路径,最终提交时使用）
            rules: {
              nickName:[{required: true, message: '请输入昵称', trigger: 'blur'}],
            },

          }

        },

        methods:{
          /*******************************接口相关方法**********************************************/
          //获取机器人配置信息
          async getRobotConfigInfo(id){
            this.setLoading = true
            let result = await robotConfigService.getRobotConfigInfo({taskId:id});
            let target = this;
            setTimeout(function () {
              target.setLoading = false
            }, 500);
            if (result.message.code == 0) {
              let robotConfig = result.data.list[0]
              if (robotConfig) {
                if (robotConfig.logo.length>0) {
                  this.form.imageUrl ='https://rxhui-corpus.oss-cn-beijing.aliyuncs.com/'+robotConfig.logo //需要拼接域名
                }
                this.robotSetId = robotConfig.id
                this.logoPath = robotConfig.logo
                this.filePath = robotConfig.disclaimer
                this.form.nickName =robotConfig.petName
                this.form.skin = robotConfig.skin
                this.selectIndex= this.indexForItem(this.robotSkinTitle,this.form.skin)
                if(robotConfig.disclaimerFileName.length>0){
                  this.fileLists.splice(0,1,{name:robotConfig.disclaimerFileName})
                }
                this.form.isAutomaticPopUp = robotConfig.disclaimerPopup === 'true'//免责声明是否自动弹出
                this.form.isShowBanner = robotConfig.showHomeCard === 'true'//是否显示首页轮播
                this.form.isShowUserQa = robotConfig.showUserQuestion === 'true'//是否显示用户问题
                this.form.isShowZan = robotConfig.showEvaluation === 'true'//是否显示赞,踩
                this.form.isShowRecommendQa = robotConfig.showRecommendQuestion === 'true'//是否显示推荐问题
                this.form.isShowHistoryRecord = robotConfig.recordHistoryQuestion === 'true'//是否显示历史记录
                this.form.isSupportPush = robotConfig.supportInitiativePush === 'true'//是否支持推送
                this.form.isWebVoice =  robotConfig.supportWebVoice === 'true'//是否支持web语音


              }
            } else {
              this.$message({
                showClose: true,
                message:'请求超时',
                type: 'error'
              });
            }
          },
          //保存
          async saveRobotConfigInfo (params){
            let result = await robotConfigService.setRobotConfigInfo([params]);
            if (result.message.code == 0) {
              this.setDialogVisible = false
              this.$message({
                showClose: true,
                message: '设置成功',
                type: 'success'
              });
            } else {
              this.$message({
                showClose: true,
                message:'请求超时',
                type: 'error'
              });
            }

          },

          /*******************************交互相关方法**********************************************/
          setDialogVisibleWithBool(isok){
            this.setDialogVisible = isok
          },

          //皮肤选择
          clickColorBlock(event,index,cssName){
            this.selectIndex = index
            // this.form.skin =cssName
            this.form.skin = this.robotSkinTitle[index]
            console.log(this.form.skin)

          },
          /*********************logo上传相关方法********************************/
          //上传logo成功
          handleAvatarSuccess(res, file) {
            this.logoPath = res.data.filePath;
            this.$message.success('上传Logo成功');
          },
          //上传logo失败的回调
          handleAvatarError(err, file, fileList){
            this.$message.error('上传Logo失败!请重新上传');
          },
          //选择logo后的回调
          addLogo(file, fileList){
            this.form.imageUrl = URL.createObjectURL(file.raw);
          },
          //上传logo之前的回调
          beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG && !isPNG) {
              this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return (isJPG||isPNG) && isLt2M;
          },
          /*********************免责声明上传相关方法********************************/
          handlefileSuccess(res,file){
            this.filePath = res.data.filePath;
            this.$message.success('免责声明上传成功');

          },
          handlefileError(err, file, fileList){
            this.$message.error('免责声明上传失败!请重新上传');
          },
          beforefileUpload(file){
            const isHTML = file.type === 'text/html';
            if (!isHTML){
              this.$message.error('免责声明只能是 HTML 格式!');
            }
            return isHTML;
          },
          addFile(file,fileList){
           this.fileLists.splice(0,1,file)

          },
          removeFile(file,fileList){
            this.filePath = ''
            this.fileLists.splice(0,1)
          },


          //点击确定
          submit(formName) {
              let params = {}
              debugger

              params.disclaimer= this.filePath//免责声明地址
              if (this.fileLists.length!==0) {
                params.disclaimerFileName = this.fileLists[0].name
              }
              if (this.robotSetId){
                params.id=this.robotSetId//配置id
              }
              params.logo=this.logoPath//logo地址
              params.petName=this.form.nickName
              params.skin=this.form.skin
              params.task=this.robotData
              params.disclaimerPopup = this.form.isAutomaticPopUp.toString()//免责声明是否自动弹出
              params.showHomeCard = this.form.isShowBanner.toString()//是否显示首页轮播
              params.showUserQuestion = this.form.isShowUserQa.toString()//是否显示用户问题
              params.showEvaluation = this.form.isShowZan.toString()//是否显示赞,踩
              params.showRecommendQuestion = this.form.isShowRecommendQa.toString()//是否显示推荐问题
              params.recordHistoryQuestion = this.form.isShowHistoryRecord.toString()//是否显示历史记录
              params.supportInitiativePush = this.form.isSupportPush.toString()//是否支持推送
              params.supportWebVoice = this.form.isWebVoice.toString()//是否支持web语音
              params.preview = 'test'
              this.saveRobotConfigInfo(params)
          },
          indexForItem(arrays,obj){
            var i = arrays.length;
            while (i--) {
              if (arrays[i] === obj) {
                return i;
              }
            }
            return -1
          },
          /**
           * 关闭
           */
          closeDialog () {
            this.form.imageUrl = ''
            this.form.nickName =''
            // this.form.skin = '默认'
            this.selectIndex = 0
            this.robotSetId = ''
            this.fileLists = []
            this.filePath = ''
            this.logoPath = ''
            this.form.isAutomaticPopUp = true//免责声明是否自动弹出
            this.form.isShowBanner = true//是否显示首页轮播
            this.form.isShowUserQa = true//是否显示用户问题
            this.form.isShowZan = true//是否显示赞,踩
            this.form.isShowRecommendQa = true//是否显示推荐问题
            this.form.isShowHistoryRecord = true//是否显示历史记录
            this.form.isSupportPush= false//是否支持推送
            this.form.isWebVoice= false//是否支持web语音
            this.$refs.uploadFile.clearFiles();
            this.$emit('closeDialog')
          }
        },//methods
        mounted:function () {
        }


    }
</script>


<style scoped>
  .logoupload >>> .el-form-item__content{
    line-height: 20px;
    position: relative;
    font-size: 10px;

  }
   .fileload >>> .el-form-item__content{
     line-height: 40px;
     position: relative;
     font-size: 10px;
  }


  .fileload >>> .el-form-item {
    margin-bottom: 0px;
  }
  .fileload >>> .el-upload-list__item:first-child {
     margin-top: 0px;
  }
  .fileload{
    margin-top: 20px;
    margin-bottom: 10px;

  }
  .customDialog >div:nth-child(2){
    padding: 0px 30px;
  }
  .avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader >>> .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .avatar {
    width: 60px;
    height: 60px;
    display: block;
  }
  .default{
    background-color: #E5E5E5;
  }
  .blue{
    background-color:#5C7DEE ;
  }
  .red{
    background-color: #CF524D;
  }
  .black{
    background-color:#313B53;
  }
  .orange{
    background-color:#F09E54;
  }
  .purple{
    background-color:#722ED1;

  }
  .pink{
    background-color: #DA7F94;
  }
  .gray{
    background-color: #7C8083;
  }
  .Inkblue{
    background-color: #081858  ;
  }


  /*.white:hover,.black:hover,.yellow:hover,.burlywood:hover,.deeppink:hover{*/
    /*border: 1.5px solid #d9d9d9;*/
  /*}*/
  .selectClass{
    border: 1.5px solid #409EFF;
  }


</style>
