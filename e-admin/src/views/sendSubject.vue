<template>
  <div class="container">
    <el-row style="margin-bottom: 20px;">
      <el-col :span="24" class="header">
        <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
          e智通 | 运营数据后台
        </el-col>
        <el-col :span="10">
        </el-col>
        <el-col :span="4" class="userinfo">
          <el-dropdown trigger="hover">
            <span class="el-dropdown-link userinfo-inner"><img :src="sysUserAvatar"/> {{sysUserName}}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-col>
    </el-row>

    <el-row style="padding:0 20px;">
      <el-page-header @back="goBack()" content="发布专题">
      </el-page-header>
      <el-divider></el-divider>
      <el-col :span="12" style="position: relative;">
        <el-button type="info" style="margin-bottom: 20px;">基本信息</el-button>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="文章标题：" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="来源：" prop="infoSource">
            <el-input v-model="form.infoSource" style="width: 200px;"></el-input>
          </el-form-item>
          <div class="inpUUU">*</div>
          <el-form-item label="栏目：">
            <el-select style="width: 150px;" :disabled="isEdit" v-model="lanMuA" placeholder="请选择">
              <el-option
                v-for="item in topOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-show="topOptionsB.length!=0" :disabled="isEdit" style="width: 150px;" v-model="lanMuB"
                       placeholder="请选择">
              <el-option
                v-for="item in topOptionsB"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-show="topOptionsC.length!==0" :disabled="isEdit" style="width: 150px;" v-model="lanMuC"
                       placeholder="请选择">
              <el-option
                v-for="item in topOptionsC"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="发布日期：">
            <el-date-picker
              v-model="form.updateAt"
              @focus="seteditShow(false)"
              @blur="seteditShow(true)"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="发布状态：">
            <el-switch v-model="form.publishStatus"></el-switch>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row style="padding:0 20px;">
      <el-divider></el-divider>
      <el-col :span="12">
        <el-button type="info" style="margin-bottom: 20px;">专题正文</el-button>
        <div class="editor" v-show="editpublice">
          <div ref="toolbar" class="toolbar">
          </div>
          <div ref="editor" class="text" style="width: 100%;height: 600px;">
          </div>
        </div>
      </el-col>
      <el-col :span="8" :offset="1">
        <el-upload
          class="upload-demo"
          action="/upload/uploadFile.do"
          :on-success="uploadSuccess"
          :before-upload="beforeAvatarUpload"
          :show-file-list="false">
          <el-button size="small" type="primary">上传图片 | 附件</el-button>
        </el-upload>
        <div class="listurl">
          <li v-for="(item,index) in fileListUrl"><img :src="item.url" alt=""><span>{{item.url}}</span></li>
        </div>
        <el-divider></el-divider>
        <el-button type="info" style="margin-bottom: 20px;" v-if="fileListNum.length!==0">图片点击跳转地址</el-button>
        <el-input style="margin-bottom: 10px;" :placeholder="'请输入图片'+(index+1)+'点击跳转时的完整地址'"
                  v-if="fileListNum.length!==0" :key="item" v-for="(item,index) in fileListNum"
                  v-model="fileList[index]"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 100px;margin-top: 20px;">
      <el-col :span="2" :offset="4">
        <el-button @click="goBack()">取消</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="info" @click="sendsubmitfalse()">存为草稿</el-button>
      </el-col>
      <el-col :span="2">
        <el-button @click="preview()">预览</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="sendsubmit()">提交</el-button>
      </el-col>
    </el-row>

  </div>
</template>
<script>
  import E from 'wangeditor'

  export default {
    name: 'sendSubject',
    data() {
      return {
        form: {
          title: '',
          infoSource: '',
          updateAt: '',
          publishStatus: ''
        },
        lanMuA: '',
        lanMuB: '',
        lanMuC: '',
        topOptions: [],
        topOptionsB: [],
        topOptionsC: [],
        editpublice: true,
        isEdit: false,
        sysUserAvatar: require('../assets/header.jpg'),
        editor: null,
        info_: null,
        imgHeadUrl: 'http://10.0.0.112/',
        fileListUrl: [],
        fileList: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        fileListNum: 0,
        htmlImgList: [],
        inpHtml: '',
        rules: {
          title: [
            {required: true, message: '请输入文章标题', trigger: 'blur'}
          ],
          infoSource: [
            {required: true, message: '请输入来源', trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      if (this.$route.query.contentId) {
        this.getInfo();
      } else {
        this.form.updateAt = new Date().getTime();
      }
      this.getmenu();
    },
    mounted() {
      this.seteditor();
      if(window.location.port=='10011'|| window.location.port=='8282' || window.location.port=='10007'){
        this.imgHeadUrl='http://10.0.0.112/';
      }else{
        this.imgHeadUrl='http://download.zq88.cn/';
      }
    },
    watch: {
      fileList(val) {
        console.log(val);
      },
      inpHtml(val) {
        var ele = $(val);
        var sendData = ele;
        var arr = [];
        for (var i = 0; i < ele.find('img').length; i++) {
          var url = ele.find('img').eq(i).attr('src');
          arr.push(url);
        }
        this.htmlImgList = arr;
        this.fileListNum = arr.length;
      },
      lanMuA(val) {
        this.$http.get('/subject/operate/hczq/info/menu?parentId=' + val).then(function (result) {
          this.topOptionsB = result.data.data;
          this.topOptionsC = [];
          if (this.topOptionsB.length != 0) {
            this.lanMuB = this.topOptionsB[0].id;
          } else {
            this.lanMuB = '';
          }
        })
      },
      lanMuB(val) {
        if (this.lanMuB == '') return;
        this.$http.get('/subject/operate/hczq/info/menu?parentId=' + val).then(function (result) {
          this.topOptionsC = result.data.data;
          if (this.topOptionsC.length != 0) {
            this.lanMuC = this.topOptionsC[0].id;
          } else {
            this.lanMuC = '';
          }
        })
      }
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      seteditShow(val) {
        this.editpublice = val;
      },
      preview() {
        var ele = $(this.inpHtml);
        var txt = ele;
        for (var i = 0; i < ele.find('img').length; i++) {
          if (this.fileList[i]) {
            txt.find('img').eq(i).wrap('<a href="' + this.fileList[i] + '">')
          }
        }
        var add = $('<div>');
        add.append(txt);
        var sendData = '<div>' + add.html() + '</div>';
        window.sessionStorage.setItem('html', sendData);
        window.open(window.location.origin + '/#/preview');
      },
      getmenu() {
        this.$http.get('/subject/operate/hczq/info/menu').then(function (result) {
          if (result && result.data.length !== 0) {
            this.topOptions = result.data.data;
          }
        })
      },
      logout: function () {
        let _this = this
        this.$confirm('确认退出吗?', '提示', {}).then(() => {
          this.$http({
            method: 'POST',
            url: 'sqdl/passport/api/logout',
            params: {appId: 'CP170000003'},
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            emulateJSON: true
          }).then(function (result) {
            console.log(result)
            sessionStorage.removeItem('account')
            sessionStorage.removeItem('islogin');
            _this.$router.push('/')
          })
        }).catch(() => {
        })
      },
      getInfo() {
        var params = {
          id: this.$route.query.contentId
        }
        this.$http.get('/subject/operate/hczq/info/details', {params}).then((res) => {
          if (res.data.message.code == 0) {
            this.form.title = res.data.data.title;
            this.form.infoSource = res.data.data.infoSource;
            this.form.updateAt = parseInt(res.data.data.publishAt);
            this.form.publishStatus = res.data.data.publishStatus == '1' ? true : false;
            this.editor.txt.html(res.data.data.details)
            this.inpHtml = res.data.data.details;
            for (var i = 0; i < res.data.data.menus.length; i++) {
              if (i == 0) {
                this.lanMuA = res.data.data.menus[0].id;
                setTimeout(function () {
                  if (res.data.data.menus.length < 2) {
                    this.lanMuB = -999999;
                  }
                }.bind(this), 1000)
              } else if (i == 1) {
                setTimeout(function () {
                  this.lanMuB = res.data.data.menus[1].id;
                }.bind(this), 1000)
                setTimeout(function () {
                  if (res.data.data.menus.length < 3) {
                    this.lanMuC = -999999;
                  }
                }.bind(this), 2000)
              } else if (i == 2) {
                setTimeout(function () {
                  this.lanMuC = res.data.data.menus[2].id;
                }.bind(this), 1000)
              }
            }
            if (this.$route.query.contentId) {
              setTimeout(function () {
                this.isEdit = true;
              }.bind(this), 3000)
            }
          } else {
            this.$message({
              type: 'info',
              message: '服务出现错误'
            });
          }
        })
      },
      beforeAvatarUpload(file) {
        const type = file.type;
        console.log(type)
        if (file.type == 'image/gif') {
          this.$message({
            type: 'info',
            message: '不支持此图片格式'
          });
          return false
        }
      },
      uploadSuccess(response, file, filelist) {
        this.fileListUrl.push({
          url: this.imgHeadUrl + response.data,
          open: ''
        });
      },
      sendsubmitfalse() {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return false;
          } else {
            if(this.lanMuA==''){
              this.$message({
                type: 'info',
                message: '请选择栏目'
              });
              return false;
            }else if(this.inpHtml==''){
              this.$message({
                type: 'info',
                message: '请填写专题正文'
              });
              return false;
            }
            var ele = $(this.inpHtml);
            var txt = ele;
            for (var i = 0; i < ele.find('img').length; i++) {
              if (this.fileList[i]) {
                txt.find('img').eq(i).wrap('<a target="_blank" href="' + this.fileList[i] + '">')
              }
            }
            var add = $('<div>');
            add.append(txt);
            var sendData = '<div>' + add.html() + '</div>';
            var typeId = '';
            if (this.lanMuA !== '') {
              if (this.lanMuB !== '') {
                typeId = this.lanMuB;
                if (this.lanMuC !== '') {
                  typeId = this.lanMuC;
                }
              }
            }
            var params = {
              title: this.form.title,
              topId: this.lanMuA,
              typeId: typeId,
              infoSource: this.form.infoSource,
              publishAt: new Date(this.form.updateAt).getTime(),
              publishStatus: 2,
              details: sendData,
              id: this.$route.query.contentId || ''
            }
            this.$http.post('/subject/operate/hczq/info/add', params, {emulateJSON: true}).then((res) => {
              if (res.data.message.code == 0) {
                this.$message({
                  type: 'success',
                  message: '已存为草稿!'
                });
                this.$router.push({
                  path: '/contentMaintain'
                })
              } else {
                this.$message({
                  type: 'info',
                  message: '提交失败'
                });
              }
            }).catch((err) => {
              this.$message({
                type: 'info',
                message: '服务器错误'
              });
            })
          }
        });
      },
      sendsubmit() {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return false;
          } else {
            if(this.lanMuA==''){
              this.$message({
                type: 'info',
                message: '请选择栏目'
              });
              return false;
            }else if(this.inpHtml==''){
              this.$message({
                type: 'info',
                message: '请填写专题正文'
              });
              return false;
            }
            var ele = $(this.inpHtml);
            var txt = ele;
            for (var i = 0; i < ele.find('img').length; i++) {
              if (this.fileList[i]) {
                txt.find('img').eq(i).wrap('<a target="_blank" href="' + this.fileList[i] + '">')
              }
            }
            var add = $('<div>');
            add.append(txt);
            var sendData = '<div>' + add.html() + '</div>';
            var typeId = '';
            if (this.lanMuA !== '') {
              if (this.lanMuB !== '') {
                typeId = this.lanMuB;
                if (this.lanMuC !== '') {
                  typeId = this.lanMuC;
                }
              }
            }
            var params = {
              title: this.form.title,
              topId: this.lanMuA,
              typeId: typeId,
              infoSource: this.form.infoSource,
              publishAt: new Date(this.form.updateAt).getTime(),
              publishStatus: this.form.publishStatus ? 1 : 2,
              details: sendData,
              id: this.$route.query.contentId || ''
            }
            this.$http.post('/subject/operate/hczq/info/add', params, {emulateJSON: true}).then((res) => {
              if (res.data.message.code == 0) {
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                this.$router.push({
                  path: '/contentMaintain'
                })
              } else {
                this.$message({
                  type: 'info',
                  message: '提交失败'
                });
              }
            }).catch((err) => {
              this.$message({
                type: 'info',
                message: '服务器错误'
              });
            })
          }
        });
      },
      seteditor() {
        var _this = this;
        this.editor = new E(this.$refs.toolbar, this.$refs.editor)
        this.editor.customConfig.uploadImgShowBase64 = false // base 64 存储图片
        this.editor.customConfig.uploadImgServer = '/upload/uploadFile.do'// 配置服务器端地址
        this.editor.customConfig.uploadImgHeaders = {}// 自定义 header
        this.editor.customConfig.uploadFileName = 'file' // 后端接受上传文件的参数名
        this.editor.customConfig.uploadImgMaxSize = 20 * 1024 * 1024 // 将图片大小限制为 2M
        this.editor.customConfig.uploadImgMaxLength = 1 // 限制一次最多上传 3 张图片
        this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

        // 配置菜单
        this.editor.customConfig.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'link', // 插入链接
          'list', // 列表
          'justify', // 对齐方式
          'quote', // 引用
          'emoticon', // 表情
          'image', // 插入图片
          'table', // 表格
          'video', // 插入视频
          'code', // 插入代码
        ]

        this.editor.customConfig.uploadImgHooks = {
          fail: (xhr, editor, result) => {
            // 插入图片失败回调
          },
          success: (xhr, editor, result) => {
            console.log(editor)
            // 图片上传成功回调

          },
          timeout: (xhr, editor) => {
            // 网络超时的回调
          },
          error: (xhr, editor) => {
            // 图片上传错误的回调
          },
          customInsert: (insertImg, result, editor) => {
            var url_ = result.data;
            _this.fileListUrl.push({
              url: _this.imgHeadUrl + result.data,
              open: ''
            });
            insertImg(_this.imgHeadUrl + url_)
          }
        }
        this.editor.customConfig.onchange = (html) => {
          _this.inpHtml = html;

        }
        // 创建富文本编辑器
        this.editor.create()
      }
    }
  }
</script>

<style scoped>
  .container .header {
    height: 60px;
    line-height: 60px;
    background: #20a0ff;
    color: #fff;
  }

  .container .header .userinfo {
    text-align: right;
    padding-right: 35px;
    float: right;
  }

  .container .header .userinfo .userinfo-inner {
    cursor: pointer;
    color: #fff;
  }

  .container .header .userinfo .userinfo-inner img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 10px 0px 10px 10px;
    float: right;
  }

  .container .header .logo {
    height: 60px;
    font-size: 18px;
    font-family: 'Hiragino Sans GB';
    padding-left: 20px;
    padding-right: 20px;
    border-color: rgba(238, 241, 146, 0.3);
    border-right-width: 1px;
    border-right-style: solid;
  }

  .container .header .logo img {
    width: 40px;
    float: left;
    margin: 10px 10px 10px 18px;
  }

  .container .header .logo .txt {
    color: #fff;
  }

  .container .header .logo-width {
    width: 230px;
  }

  .container .header .logo-collapse-width {
    width: 60px
  }

  .container .header .tools {
    padding: 0px 23px;
    width: 14px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
  }

  .container .listurl {
    list-style: none;
    line-height: 20px;
    margin-top: 63px;
  }

  .container .listurl img {
    width: 100px;
    margin-top: 10px;
  }
  .inpUUU{
    color: #F56C6C;
    width: 4px;
    position: absolute;
    left: 35px;
    top: 195px;
  }
</style>
