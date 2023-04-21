<template>
    <div id="index">
        <div class="banner">
            <div class="bannermsg">
                <el-upload
                        class="upload-demo"
                        drag
                        accept=".pdf,.PDF,.JPG,.jpg,.TIFF,.tiff,.tif"
                        :show-file-list="false"
                        :limit="1"
                        :on-success="uploadsuccess"
                        :on-progress="uploadProgress"
                        :on-error="uploadError"
                        :http-request="customUpload"
                        action="void">
                    <i class="el-icon-upload"></i>
                    <div class="textalert">点击选择文件，或将其拖入框中识别<br>支持PDF、JPG、TIFF格式</div>
                </el-upload>
                <div v-show="showNum">
                    <el-progress :percentage="num" color="#f56c6c"></el-progress>
                </div>
            </div>
        </div>
        <div class="list">
            <dl>
                <img src="../../static/images/ocr_12.jpg" alt="">
                <dt>多种类型公文识别</dt>
                <dd>支持决议、决定、命令、公报、公告、通告、意见、通知、通报、报告、请示、批复、议案、函、纪要，共15类公文识别</dd>
            </dl>
            <dl style="padding-left: 100px">
                <img src="../../static/images/ocr2_12.jpg" alt="">
                <dt>多种公文元素识别</dt>
                <dd>支持识别并抽取 标题、文号、签发人、发文单位、主送单位、抄送单位、印发时间、印发份数、文件类型等多种公文元素</dd>
            </dl>
            <dl>
                <img src="../../static/images/ocr3_24.jpg" alt="">
                <dt>多种文件格式支持</dt>
                <dd>支持识别PDF/JPG/TIFF格式的公文</dd>
            </dl>
            <dl style="padding-left: 100px">
                <img src="../../static/images/ocr4_24.jpg" alt="">
                <dt>多场景使用支持</dt>
                <dd>支持在线内容选择复制、TXT文档导出、抽取内容机器自动回填等多场景应用</dd>
            </dl>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import axios from 'axios';
    export default {
        name: 'index',
        data(){
            return {
                loading:[],
                num:0,
                showNum:false
            }
        },
        created(){
            this.setUrl('--');
        },
        methods:{
            ...mapActions({
                setUrl: 'setUploadUrl',
            }),
            customUpload(file){
                this.uploadProgress();
                let FormDatas = new FormData();
                FormDatas.append('file', file.file);
                axios({
                    url: '/upload/service/dfs/fileupload/',
                    method: 'post',
                    data: FormDatas,
                    //上传进度
                    onUploadProgress: (progressEvent) => {
                        let num = progressEvent.loaded / progressEvent.total * 100 | 0;  //百分比
                        this.num=num;
                    }
                }).then((res)=>{
                    this.uploadsuccess(res.data.data)
                })
            },
            uploadsuccess(f){
                this.setUrl(f);
                // this.loading.close();
                this.$router.push({
                    path:'/default',
                })
            },
            uploadProgress(){
                this.showNum = true;
                // this.loading = this.$loading({
                //     lock: true,
                //     text: this.num,
                //     spinner: 'el-icon-loading',
                //     background: 'rgba(f, f, f, 0.7)'
                // });
            },
            uploadError(){
                // this.loading.close();
                this.$message.error('上传遇到了问题，请重新上传');
            }
        }
    }
</script>
<style>
    .el-upload-dragger{background: none;width:500px;height:240px;}
    .el-upload-list__item-name{color: #fff;}
    .el-upload-list__item-name [class^=el-icon]{color:#fff;}
</style>

