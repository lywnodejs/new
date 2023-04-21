<template>
    <div id="default">
        <input id="inputcopy" v-model="input" type="text" style="opacity: 0;position: fixed;top: 0;left: 0;width: 10px;">
        <div class="load">
            <i v-show="url!=='--'" class="iconfont icon-wenjian"></i>
            <el-tooltip v-if="url!=='--'" class="item"  effect="light" :content="url.originName" placement="top"><span>{{url.originName}}</span></el-tooltip>
            <el-upload
                    class="upload-demo"
                    accept=".pdf,.PDF,.JPG,.jpg,.TIFF,.tiff,.tif"
                    :show-file-list="false"
                    :http-request="customUpload"
                    :on-success="uploadsuccess"
                    :on-progress="uploadProgress"
                    :on-error="uploadError"
                    action="/upload/service/dfs/fileupload/">
                <el-button class="uoloadButton" size="small" type="primary">{{url=='--'? '上传文件':'更改文件'}}</el-button>
            </el-upload>
            <div v-show="showNum">
                <el-progress :percentage="num" color="#f56c6c"></el-progress>
            </div>
        </div>
        <div class="table" v-if="topShow">
            <li>
                <span>标题</span> <span><el-tooltip class="item"  effect="light" :content="info.title" placement="top"><p>{{info.title | f_title}}</p></el-tooltip> <i class="iconfont icon-fuzhi" @click="copyText(info.title)"></i></span>
                <span>文号</span> <span><el-tooltip class="item"  effect="light" :content="info.docNumber || '--'" placement="top"><p>{{info.docNumber || '--'}}</p></el-tooltip> <i class="iconfont icon-fuzhi" @click="copyText(info.docNumber)"></i></span>
                <span></span>
            </li>
            <li>
                <span>签发人</span> <span><p>{{info.signer || '--'}}</p> <i class="iconfont icon-fuzhi" @click="copyText(info.signer)"></i></span>
                <span>发文单位</span>
                <span><el-tooltip class="item"  effect="light" :content="info.department || '--'" placement="top"><p>{{info.department || '--'}}</p></el-tooltip> <i class="iconfont icon-fuzhi" @click="copyText(info.department)"></i></span>
            </li>
            <li>
                <span>主送单位</span> <span><el-tooltip class="item"   effect="light" :content="info.sendDepartment || '--'" placement="top"><p>{{info.sendDepartment || '--'}}</p></el-tooltip> <i class="iconfont icon-fuzhi" @click="copyText(info.sendDepartment)"></i></span>
                <span>抄送单位</span> <span><el-tooltip class="item"  effect="light" :content="info.copyToDepartment || '--'" placement="top"><p>{{info.copyToDepartment || '--'}}</p></el-tooltip> <i class="iconfont icon-fuzhi" @click="copyText(info.copyToDepartment)"></i></span>
            </li>
            <li>
                <span>印发时间</span> <span><p>{{info.pubDateInfo || '--'}}</p><i class="iconfont icon-fuzhi" @click="copyText(info.pubDateInfo)"></i></span>
                <span>印发份数</span> <span><p>{{info.printedCopies || '--'}}</p><i class="iconfont icon-fuzhi" @click="copyText(info.printedCopies)"></i></span>
            </li>
            <li>
                <span>文件类型</span> <span><p>{{info.redWords || '--'}}</p><i class="iconfont icon-fuzhi" @click="copyText(info.redWords)"></i></span>
                <span>是否公开</span> <span><p>--</p><i class="iconfont icon-fuzhi" @click="copyText('')"></i></span>
            </li>
        </div>

        <div class="img" v-if="showImg">
            <div class="imgMSG" v-for="(item,index) in listUrl">
                <h4>第{{index+1}}页</h4>
                <img :src="getIMGURL(item)" alt="文件" :title="item">
<!--                <el-image-->
<!--                        style="width: 100%;"-->
<!--                        :src="getIMGURL(item)"-->
<!--                        :preview-src-list="listUrl">-->
<!--                </el-image>-->
            </div>
        </div>
        <div v-if="showImg" class="content" v-show="showRight" v-html="info.content">

        </div>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
    import axios from 'axios';
    export default {
        name: 'default',
        data(){
            return {
                url:this.getURL(),
                loading:{},
                listUrl:[],
                showRight:false,
                input:'',
                topShow:false,
                info:{},
                num:0,
                showNum:false,
                showImg:false
            }
        },
        methods:{
            ...mapGetters({
                getURL:'getURL'
            }),
            ...mapActions({
                setUrl: 'setUploadUrl',
            }),
            getIMGURL(url){
                return url
                // var url = url.split('http://10.0.0.112')[1];
                // return 'http://download.jinhui365.cn' + url;
            },
            customUpload(file){
                this.uploadProgress();
                var FormDatas = new FormData();
                FormDatas.append('file', file.file);
                axios({
                    url: '/upload/service/dfs/fileupload/',
                    method: 'post',
                    data: FormDatas,
                    //上传进度
                    onUploadProgress: (progressEvent) => {
                        var num = progressEvent.loaded / progressEvent.total * 100 | 0;  //百分比
                        this.num=num;
                    }
                }).then((res)=>{
                    this.uploadsuccess(res.data)
                })
            },
            copyText(text){
                var thas = this;
                if(!text){return}
                this.input=text;
                try {
                    var inp = document.getElementById("inputcopy");
                    setTimeout(function () {
                        inp.select(); // 选中文本
                        document.execCommand("copy"); // 执行浏览器复制命令
                        thas.$message({
                            message: '复制成功',
                            type: 'success',
                            center: true
                        });
                    },200)
                }catch(e){

                }
            },
            uploadsuccess(f){
                this.setUrl(f.data);
                this.url=this.getURL();
                this.loading = this.$loading({
                    lock: true,
                    text: '获取文件信息中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(f, f, f, 0.7)'
                });
                this.getimg();
            },
            uploadProgress(){
                this.showNum=true;
                // this.loading = this.$loading({
                //     lock: true,
                //     text: '上传中',
                //     spinner: 'el-icon-loading',
                //     background: 'rgba(f, f, f, 0.7)'
                // });
            },
            uploadError(){
                // this.loading.close();
                this.$message.error('上传遇到了问题，请重新上传');
                this.setUrl('--');
                this.showRight=false;
                this.topShow=false;
            },
            getimg(){
                axios.get('/image/service/transfer/picture',{
                    params:{
                        fileUrl:this.url.filePath
                    }
                }).then((res)=>{
                    this.loading.close();
                    this.num=0;
                    this.showNum=false;
                    var thas = this;
                    thas.listUrl=[];
                    if(res.data.data && res.data.data.length !== 0){
                        res.data.data.sort(this.sortNumber)
                        res.data.data.forEach((item)=>{
                            thas.listUrl.push(item.httpFilePath);
                        })
                        this.discernFile()
                    }else{
                        this.$message.error('识别遇到了问题，请重新识别');
                        this.setUrl('--');
                        this.num=0;
                        this.showNum=false;
                        this.showRight=false;
                        this.topShow=false;
                    }
                }).catch((err)=>{
                    this.loading.close();
                    this.num=0;
                    this.showNum=false;
                    this.$message.error('识别遇到了问题，请重新识别');
                    this.setUrl('--');
                    this.showRight=false;
                    this.topShow=false;
                })
            },
            sortNumber(a,b){
                return parseInt(a.originName) - parseInt(b.originName);
            },
            discernFile(){
                var thas = this;
                this.loading = this.$loading({
                    lock: true,
                    text: '识别中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(f, f, f, 0.7)'
                });
                axios.get('/image/service/ocr/local/general',{// 云桌面image/service/ocr/local/general 、、 生产：image/service/shannon/official
                    params:{
                        imageUrl:this.listUrl.join(',')
                    }
                }).then((res)=>{
                    if(res.data.data){
                        setTimeout(function () {
                            thas.loading.close();
                            thas.topShow=true;
                            thas.showImg=true;
                            thas.info=res.data.data;
                        if(thas.info.content){
                            thas.showRight=true;
                            thas.info.content = thas.info.content.replace(/,/g,"，");
                            thas.info.content = thas.info.content.replace(/\n/g,'<br>');
                        }
                        },4000)
                    }else{
                        this.loading.close();
                        this.$message.error('识别遇到了问题，请重新识别');
                        this.setUrl('--');
                        this.showRight=false;
                        this.topShow=false;
                    }
                }).catch((err)=>{
                    this.loading.close();
                    this.$message.error('识别遇到了问题，请重新识别');
                    this.setUrl('--');
                    this.showRight=false;
                    this.topShow=false;
                })
            }
        },
        mounted(){
            if(this.url!=='--'){
                this.loading = this.$loading({
                    lock: true,
                    text: '获取文件信息中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(f, f, f, 0.7)'
                });
                this.getimg();
            }
        },
        filter:{
            f_title(val){
                if(val){
                    var title = val.replace(/,/g,"，");
                        title = title.replace(/\n/g,'<br>');
                        return title;
                }else{
                    return '--';
                }
            },
        }
    }
</script>
