<template>
  <div id="design" class="doradoDesign">
    <div>
      <!-- <h3>设计安全评估材料</h3> -->
      <div class="designTitle">设计安全评估材料</div>
      <app-permission>
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          style="float:right;width:96px;"
          class="designFunction-btn"
          @click="editable=!editable">
          编辑
        </el-button>
      </app-permission>
    </div>
    <el-form :inline="true" label-position="left" label-width="120px" class="design-content" style="margin-top: 20px;"
             :model="design">
      <el-row>
        <el-col class="content-design">
          <el-form-item label="项目Wiki地址">
            <div v-for="(item, index) in design.wiki_link" :key="index">
              <a @click="newBlank(item.value)">
                <el-input class="design-input"
                          v-model="item.value"
                          placeholder="请输入项目Wiki地址"
                          :disabled="!editable"
                          clearable>
                </el-input>
              </a>
              <i v-if="design.wiki_link.length==index+1 && editable" class="myIcon el-icon-circle-plus-outline"
                 @click=addProperty(2)></i>
              <i v-if="design.wiki_link.length>index+1 && editable" class="myIcon el-icon-remove-outline"
                 @click=subProperty(2,index)></i>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="content-design">
          <el-form-item label="接口文档地址">
            <div v-for="(item, index) in design.interface_desc" :key="index">
              <a @click="newBlank(item.value)">
                <el-input class="design-input"
                          v-model="item.value"
                          placeholder="请输入接口文档地址"
                          :disabled="!editable"
                          clearable>
                </el-input>
              </a>
              <i v-if="design.interface_desc.length==index+1 && editable" class="myIcon el-icon-circle-plus-outline"
                 @click=addProperty(1)></i>
              <i v-if="design.interface_desc.length>index+1 && editable" class="myIcon el-icon-remove-outline"
                 @click=subProperty(1,index)></i>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="备注信息">
            <el-input class="design-input"
                      v-model="design.description"
                      placeholder="请输入备注说明信息"
                      type="textarea"
                      :disabled="!editable"
                      style="min-width: 520px">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="PRD设计文档">
            <el-upload
              :action="uploadUrl"
              :data="prdData"
              accept=".txt,.doc,.docx,.xls,.xlsx,.pdf,.zip,.tar.gz,.7z,.tar,.prd,.png,.jpg,.jpeg"
              v-show="editable"
              :before-upload="beforeUpload"
              :onSuccess="prdUploadSuccess"
              :on-remove="removePrdDocFile"
              :limit=1
              :auto-upload="true">
              <el-button class="designBtn" slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">多个文件请打包上传，文件大小不超过50Mb，大文件请上传Cooper，并附云盘链接于备注信息</div>
            </el-upload>
            <div v-show="!editable && design.prd_doc_file"><a class="uploadShow" :href="design.prd_doc_file"
                                                              target="_blank">[已上传] PRD设计文档</a></div>
            <div class="fileLoad" v-show="editable && design.prd_doc_file"><a class="uploadShow"
                                                                              :href="design.prd_doc_file"
                                                                              target="_blank">[已上传] PRD设计文档</a></div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="技术/部署架构图">
            <el-upload
              :action="uploadUrl"
              :data="arcData"
              accept=".txt,.doc,.docx,.xls,.xlsx,.pdf,.zip,.tar.gz,.7z,.tar,.prd,.png,.jpg,.jpeg"
              v-show="editable"
              :before-upload="beforeUpload"
              :onSuccess="architectureUploadSuccess"
              :on-remove="removeArchitectureFile"
              :limit=1
              :auto-upload="true">
              <el-button class="designBtn" size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">多个文件请打包上传，文件大小不超过50Mb，大文件请上传Cooper，并附云盘链接于备注信息</div>
            </el-upload>
            <div v-show="!editable && design.architecture_diagram_file" class=""><a class="uploadShow"
                                                                                    :href="design.architecture_diagram_file"
                                                                                    target="_blank">[已上传] 技术/部署架构图</a>
            </div>
            <div class="fileLoad" v-show="editable && design.architecture_diagram_file"><a class="uploadShow"
                                                                                           :href="design.architecture_diagram_file"
                                                                                           target="_blank">[已上传]
              技术/部署架构图</a></div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item v-show="editable">
            <el-button class="design-button" type="warning" @click="submitDesignInfo">提&nbsp;交</el-button>
            <el-button class="design-btn" type="warning" @click="editable=!editable">取&nbsp;消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>
  import ajax from '@/plugin/ajax'
  import * as API from '@/commons/api/dorado'

  export default {
    name: 'design',
    data() {
      return {
        uploadUrl: '/api/dorado/evaluate/design/file/upload',
        url: '/api/common/file/upload',
        prdData: {
          type: 'prd',
          sdl_project_id: this.$route.query['projectId']
        },
        arcData: {
          type: 'arc',
          sdl_project_id: this.$route.query['projectId']
        },
        prd_doc_file_list: [],
        architecture_diagram_file_list: [],
        editable: false,
        design: {
          id: 0,
          interface_desc: [{value: '', key: Math.random() * Math.random() + 1}],
          wiki_link: [{value: '', key: Math.random() * Math.random() + 1}],
          prd_doc_file: '',
          architecture_diagram_file: '',
          description: '',
          sdl_project_id: ''
        }
      }
    },
    props: ['currentStatus', 'skipDesign'],
    watch: {
      currentStatus(val) {
        this.currentStatus = val
        if (this.currentStatus < 3) {
          this.editable = true
        }
      },
      skipDesign(val) {
        this.skipDesign = val
        if (this.skipDesign && this.currentStatus >= 5 && this.currentStatus <= 6) {
          this.editable = true
        }
      }
    },
    created() {
      this.design.sdl_project_id = this.$route.query['projectId']
      if (this.currentStatus < 3) {
        this.editable = true
      }
      if (this.skipDesign && this.currentStatus >= 5 && this.currentStatus <= 6) {
        this.editable = true
      }
      this.fetchData()
    },
    methods: {
      fetchData() {
        let postJson = {
          sdl_project_id: this.design.sdl_project_id
        }
        ajax.post(API.fecthDesignInfo, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            const data = response.data
            if (data) {
              this.design = response.data
              this.design.interface_desc = this.disTransfrom(this.design.interface_desc)
              this.design.wiki_link = this.disTransfrom(this.design.wiki_link)
              if (response.data.prd_doc_file != '') {
                this.prd_doc_file_list.push({name: '[已上传] PRD设计文档', url: response.data.prd_doc_file})
              } else {
                this.prd_doc_file_list = []
              }
              if (response.data.architecture_diagram_file != '') {
                this.this.architecture_diagram_file_list.push({
                  name: '[已上传] 技术/部署架构图',
                  url: response.data.architecture_diagram_file
                })
              } else {
                this.architecture_diagram_file_list = []
              }
            }
          } else {
            this.$notify({
              title: '获取设计安全评估信息',
              message: errmsg,
              type: 'error'
            })
          }
        })
      },
      submitDesignInfo() {

        let postJson = {
          design: {
            id: this.design.id,
            interface_desc: this.transform(this.design.interface_desc),
            wiki_link: this.transform(this.design.wiki_link),
            prd_doc_file: this.design.prd_doc_file,
            architecture_diagram_file: this.design.architecture_diagram_file,
            description: this.design.description,
            sdl_project_id: this.design.sdl_project_id

          }
        }
        ajax.post(API.createDesign, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {

            // const data = response.data
            // if (data) {
            //   this.editable = false
            // } else {
            //   this.editable = true
            // }
            this.$notify({
              title: '保存设计安全评估信息',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '保存设计安全评估信息',
              message: errmsg,
              type: 'error'
            })
          }
          this.$parent.getWorkFlow()
          this.editable = false
          this.fetchData()
        })
      },
      prdUploadSuccess(response) {
        const errmsg = response.errmsg
        if (response.errno === 0) {
          this.$notify({
            title: '上传PRD设计文档',
            message: errmsg,
            type: 'success'
          })
          this.design.prd_doc_file = response.data.download_url
          this.prd_doc_file_list = [{
            name: 'PRD设计文档',
            url: response.data.download_url
          }]
        }
      },
      removePrdDocFile(file, filelist) {

        let postJson = {
          'sdl_project_id': this.design.sdl_project_id,
          'resource_key': file.url.split('/').pop(),
          'file_type': 'prd'
        }
        this.prd_doc_file_list = []
        this.deleteUploadFile(postJson)
      },
      architectureUploadSuccess(response) {
        const errmsg = response.errmsg
        this.$notify({
          title: '上传架构图',
          message: errmsg,
          type: 'success'
        })
        this.design.architecture_diagram_file = response.data.download_url
        this.architecture_diagram_file_list = [{
          name: '技术/部署架构图',
          url: ''
        }
        ]
      },
      removeArchitectureFile(file, filelist) {
        let postJson = {
          'sdl_project_id': this.design.sdl_project_id,
          'resource_key': file.url.split('/').pop(),
          'file_type': 'arc'
        }
        this.architecture_diagram_file_list = []
        this.deleteUploadFile(postJson)
      },
      deleteUploadFile(postJson) {
        ajax.post(API.deleteUploadFile, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            const data = response.data
            if (data) {
              this.editable = false
            } else {
              this.editable = true
            }
            this.$notify({
              title: '删除文件',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '删除文件',
              message: errmsg,
              type: 'error'
            })
          }
          this.fetchData()
        })
      },
      beforeUpload(file) {

        const isLt50M = file.size / 1024 / 1024 < 50

        if (!isLt50M) {
          this.$message.error('上传头像图片大小不能超过 50MB!')
        }
        return isLt50M
      },
      newBlank(url) {
        if (!this.editable && url != '') {
          window.open(url, '_blank')
        }
      },
      addProperty(type) {
        if (type === 1) {
          this.design.interface_desc.push({value: '', key: Math.random() * Math.random() + 1})
        } else if (type === 2) {
          this.design.wiki_link.push({value: '', key: Math.random() * Math.random() + 1})
        }
      },
      subProperty(type, index) {
        if (type === 1) {
          this.design.interface_desc.splice(index, 1)
        } else if (type === 2) {
          this.design.wiki_link.splice(index, 1)
        }
      },
      disTransfrom(val) {
        let valArr = val.split(',')
        let rtn = []
        for (let i = 0; i < valArr.length; i++) {
          if (valArr[i] || i === 0) {
            rtn.push({value: valArr[i], key: Math.random() * Math.random() + 1})
          }
        }
        return rtn

      },
      transform(val) {
        if (Array.isArray(val) == true) {
          let arr = []
          for (let i = 0; i < val.length; i++) {
            if (val[i].value) {
              arr.push(val[i].value)
            }

          }
          return arr.join(',')
        }
      }
    }
  }
</script>

<style lang='less'>

  #design {
    padding-top: 40px;
    -webkit-font-smoothing: antialiased;
    .designTitle {
      color: #333333;
      font-size: 14px;
      display: inline-block;
      line-height: 28px;
    }
    .designBtn {
      background: white;
      color: #fc9153;
      border: 1px solid #fc9153;
      width: 90px;
      height: 30px;
      padding: 0;
      // font-weight: 100;
      // -webkit-font-smoothing: antialiased;
      span {
        font-size: 12px;
      }
    }
    .design-btn {
      background: white;
      color: #fc9153;
      border: 1px solid #fc9153;
      // width: 110px;
      width: 100px;
      height: 32px;
      // line-height: 20px;
      padding-top: 8px;
      // font-weight: 100;
      margin-left: 16px;
      span {
        -webkit-font-smoothing: antialiased;
        font-size: 12px;
      }
    }
    .design-btn:hover {
      background: #fff7f2 !important;
      color: #fc9153 !important;
    }
    .design-button {
      height: 32px;
      // width: 110px;
      width: 100px;
      padding-top: 8px;
      text-align: center;
      background: #fc9153;
      border-radius: 4px;
      border: none;
      // font-weight: 100;
      -webkit-font-smoothing: antialiased;
      // margin-left: -10px;
      span {
        font-size: 12px;
      }
    }
    .design-button:hover {
      background-color: #fc9153 !important;
    }
    .design-content {
      // margin-left: 10px;
    }
    .content-design {
      .el-input.is-disabled .el-input__inner:hover {
        color: #666666;
        cursor: pointer;
      }
      .el-textarea.is-disabled .el-textarea__inner {
        background-color: #f5f7fa;
        border-color: #e4e7ed;
        color: #999;
        cursor: not-allowed;
      }
    }
    .el-upload__tip {
      margin-top: 0;
      color: #999;
      // font-weight: 200;
    }
    .design-input {
      width: 520px;
      border: none !important;
      background: white !important;
      .el-textarea__inner {
        width: 520px;
      }
    }
    .designFunction-btn {
      background: white !important;
      color: #fc9153 !important;
      position: relative;
      // top: -20px;
    }
    .designFunction-btn:hover {
      background: #fff7f2 !important;
      color: #fc9153;
    }
    .el-input.is-disabled .el-input__inner {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #999;
    }
    .uploadShow {
      text-decoration: underline;
    }
    .fileLoad {
      font-size: 13px;
      -webkit-font-smoothing: antialiased;
      position: absolute;
      top: -0px;
      left: 130px;
    }
    .myIcon {
      color: #FC9153;
      font-size: 16px;
      cursor: pointer;
      position: relative;
      top: 0px;
      left: 10px;
    }
    .myIcon:hover {
      top: 1.5px;
    }
  }

</style>
