<template>
  <div style="text-align: center">
    <div class="di"  v-loading="waiting">
      <!-- 这里设置了ref属性后，在vue组件中，就可以用this.$refs.audio来访问该dom元素 -->
      <audio ref="audio" class="dn"  v-if="this.url!==''"
             :src="url" :preload="audio.preload"
             @play="onPlay"
             @error="onError"
             @waiting="onWaiting"
             @pause="onPause"
             @timeupdate="onTimeupdate"
             @loadedmetadata="onLoadedmetadata"
      ></audio>
      <div>
        <el-button  v-if="this.url!==''" size="small" type="text" @click="startPlayOrPause">{{audio.playing | transPlayPause}}</el-button>

        <el-button  v-if="this.url!==''" size="small" type="text">{{ audio.currentTime | formatSecond}}</el-button>

        <el-slider  v-if="this.url!==''" v-model="sliderTime" :format-tooltip="formatProcessToolTip"  @change="changeCurrentTime" class="slider"></el-slider>

        <el-button  v-if="this.url!==''" size="small" type="text">{{ audio.maxTime | formatSecond }}</el-button>

        <el-button v-if="relatedData.length>0"  type="text" size="small" @click="checkBE">相关信息</el-button>
      </div>
  </div>

    <el-dialog title="相关信息"  :visible.sync="dialogVisible" width="50%" class="pt20">
      <div slot="footer" id="BeforeAfterText" style="width: 100%;height: 300px;overflow: auto;text-align: left;">
        <span v-if="showTitle" style="font-weight: bold">标题：</span>
        <div :class="Number(TestModelObj.contentIndex) ===  index ? bgcolor6 : '' " style="font-style: normal;display:block"  v-for="(item,index) in relatedData" :dataIndex="index">
          <div v-if="item.type==='TITLE'">
            <span> {{item.content}}</span>
          </div>
        </div>
        <span v-if="showContext" style="font-weight: bold">上下文：</span>
        <div :class="Number(TestModelObj.contentIndex) ===  index ? bgcolor6 : '' " style="font-style: normal;display:block"  v-for="(item,index) in relatedData" :dataIndex="index">
          <div v-if="item.type==='CONTEXT'">
            <div style="float: left;width: 70px">{{item.time}}</div>
            <div style="float: left;width: calc( 100% - 70px )">{{item.content}}</div>
            <div style="clear: both;"></div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  function realFormatSecond(second) {
    let secondType = typeof second;
    if (secondType === 'number' || secondType === 'string') {
      second = parseInt(second);
      let hours = Math.floor(second / 3600);
      second = second - hours * 3600;
      let mimute = Math.floor(second / 60);
      second = second - mimute * 60;
      return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    } else {
      return '0:00:00'
    }
  }

  export default {
    props:{
      sendObj:{
        type:Object,
        default: () => {
          return {}
        }
      }
    },
    name: 'VueAudio',
    data() {
      return {
        showTitle:false,
        showContext:false,
        bgcolor6:'bgcolor6',
        direction: 'rtl',
        drawer:false,
        dialogVisible:false,
        url: '',
        baseUrl:'https://rxhui-corpus.oss-cn-beijing.aliyuncs.com/',
        relatedData:'',
        AudioStartTime:0,//开始时间
        AudioContinueTime:0,//持续时间
        audio: {
          currentTime: 0,
          maxTime: 0,
          playing: false,
          muted: false,
          speed: 1,
          preload: 'auto'
        },
        waiting: false,
        sliderTime: 0,
      }
    },
    methods: {
      checkBE(){
        this.dialogVisible=true;
        let num=this.TestModelObj.contentIndex*21;
        $("#BeforeAfterText").animate({scrollTop: num}, 300);
      },
      //获取字符串
      getCaption(obj,state,str) {
        let index=obj.lastIndexOf(str);
        if(state==0){
          obj=obj.substring(0,index);
        }else {
          obj=obj.substring(index+1,obj.length);
        }
          return obj;
      },
      //时分秒转化为秒
      ToSecond(str){
        let arrA;
         if(str){
           arrA=str.split(":");
         }
        let arr= arrA.map(Number)
        if(arr.length===3){
          str=arr[0]*3600+arr[1]*60+arr[2]
        }
         if(arr.length===2){
           str=arr[0]*60+arr[1]
         }
        if (arr.length===1){
          str=arr[0]
        }
        return str
      },
      // 进度条toolTip
      formatProcessToolTip(index = 0) {
        index = parseInt(this.audio.maxTime / 100 * index);
        return '进度条: ' + realFormatSecond(index)
      },
      // 播放跳转
      changeCurrentTime(index) {
        if(this.$refs.audio){
          this.pausePlay();
          this.$refs.audio.currentTime = parseInt(index / 100 * this.audio.maxTime)
        }
      },
      startPlayOrPause() {
        return this.audio.playing ? this.pausePlay() : this.startPlay()
      },
      // 开始播放
      startPlay() {
        this.$refs.audio.play();
      },
      // 暂停
      pausePlay() {
        this.$refs.audio.pause()
      },
      // 当音频暂停
      onPause () {
        this.audio.playing = false
      },
      // 当发生错误, 就出现loading状态
      onError () {
        this.audio.waiting = true
      },
      // 当音频开始等待
      onWaiting (res) {

        console.log(res)
      },
      // 当音频开始播放
      onPlay (res) {
        console.log(res)
        this.audio.playing = true;
        this.audio.loading = false;
        let target = res.target
        let audios = document.getElementsByTagName('audio');

        [...audios].forEach((item) => {
          if(item !== target){
            item.pause()
          }
        })
      },
      // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
      onTimeupdate(res) {
        this.audio.currentTime = res.target.currentTime;
        this.sliderTime = parseInt(this.audio.currentTime / this.audio.maxTime * 100)
      },
      // 当加载语音流元数据完成后，会触发该事件的回调函数
      // 语音元数据主要是语音的长度之类的数据
      onLoadedmetadata(res) {
        this.audio.waiting = false;

      }
    },
    mounted(){
    },
    watch:{
      sendObj(curVal,oldVal){
        if(curVal.content && oldVal.content){
          if(curVal.content.toString()!==oldVal.content.toString()){
            this.audio= {
                currentTime: 0,
                maxTime: 0,
                playing: false,
                muted: false,
                speed: 1,
                preload: 'auto'
            };
          }
        }
        if(curVal.filePath || curVal.filePath===""){
          this.TestModelObj=curVal;
          let index = curVal.filePath.lastIndexOf(".");
          let ext = curVal.filePath.substr(index+1);
          if(ext==='wav'){
            this.url=this.baseUrl+this.TestModelObj.filePath;
          }
          this.relatedData=JSON.parse(this.TestModelObj.relatedData);
          this.relatedData.forEach((item,index)=>{
              if(item.type==="CONTEXT"){
               this.showContext=true
              }
            if(item.type==="TITLE"){
              this.showTitle=true
            }
          })
          if(curVal.time){
            let beforeTime= this.getCaption(curVal.time,0,'\-');
            let endTime= this.getCaption(curVal.time,1,'\-');
            this.AudioStartTime=this.ToSecond(beforeTime);
            this.AudioContinueTime=  this.ToSecond(endTime)- this.AudioStartTime;
          }
          if(curVal.playLength){
            this.audio.maxTime = parseInt(this.ToSecond(curVal.playLength));
            let  currentTime = parseInt((this.AudioStartTime/this.audio.maxTime)*100+0.5);
            this.changeCurrentTime(currentTime);
          }
        }else {
          this.url='';
          this.relatedData=''
        }
      },
    },
    filters: {
      formatSecond(second = 0) {
        return realFormatSecond(second)
      },
      transPlayPause(value) {
        return value ? '暂停' : '播放'
      }
    },
    created() { }
  }

</script>
<style>
  .bgcolor6{background:  #ff9566}
  .el-slider__button{
    width: 10px;
    height: 10px;
  }
  .pt20 .el-dialog__header{padding-top: 20px}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main-wrap{
    padding: 10px 15px;
  }


  .slider {
    display: inline-block;
    width: 100px;
    position: relative;
    height: 23px;
    margin-left: 15px;
  }
  .di .el-slider__runway{
    margin: 12px 0!important;
  }
  .di {
    display: inline-block;
  }

  .download {
    color: #409EFF;
    margin-left: 15px;
  }

  .dn{
    display: none;
  }

</style>
