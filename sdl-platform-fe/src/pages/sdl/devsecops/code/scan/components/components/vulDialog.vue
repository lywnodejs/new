<template>
    <el-dialog id="devsecops-codeScan-vul-detail-dialog"
                title="代码详情"
                :close-on-click-modal='true'
                :close-on-press-escape='true'
                :show-close="true"
               :visible.sync="dialogFormVisible"
                width="910px">
        
        <el-collapse v-model="activeName" class="collapse">
                <el-collapse-item v-for="(item, index) in vulData.pathDetail" :key="index+1" 
                                  :name="index">
                      <template slot="title">
                        <span>{{item.file_path}}  (</span>
                        <span class="fontRed" style="color:red">line</span>:
                        <span class="fontGreen" style="color:green">{{item.line_number}}</span>）
                      </template>
                    <div v-highlight >
                        <pre class="codePre">
                          <!-- {{item.code}} -->
                            <code class="codeCss" @click="bounceUrl(item)" v-html="item.code"></code>
                        </pre>
                    </div>
                </el-collapse-item>
        </el-collapse>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button class="vulDetail-button" @click="dialogFormVisible = false">取消</el-button> -->
        <el-button class="vulDetail-btn" type="primary" @click="dialogFormVisible = false">确定</el-button>
      </span>
    </el-dialog>
</template>
<script>
  import {connect} from '@/lib'

  export default connect(() => {
    return {
    }
  }, {
  })({
    data() {
      return {
        vulData: [],
        dialogFormVisible: false,
        multipleSelection: [],
        activeName: []
      }
    },
    props: ['data', 'dialogVisible'],
    watch: {
        data(val) {
            this.vulData = val
        },
        dialogVisible(val) {
            this.dialogFormVisible = val
        },
        dialogFormVisible(val) {
            this.$emit('getDialog', this.dialogFormVisible)
        }
    },
    components: {},
    created() {
        this.fetchData()
    },
    mounted() {
    },
    methods: {
      fetchData() {
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      bounceUrl(item) {
        let git = this.vulData.git.split(':')
        let url = `https://git.xiaojukeji.com/${git[1].split('.')[0]}/blob/${this.vulData.branch}${item.file_path}#L${item.line_number}`
        window.open(url)
      }
    }
  })
</script>

<style lang="less">
#devsecops-codeScan-vul-detail-dialog{
    margin: 23px 20px;
    height: 100%;
    .table-expand {
      padding: 10px 20px;
      pre{
        white-space: pre-wrap;           /* css-3 */
        white-space: -moz-pre-wrap;      /* Mozilla, since 1999 */
        white-space: -pre-wrap;          /* Opera 4-6 */
        white-space: -o-pre-wrap;        /* Opera 7 */
        word-wrap: break-word;           /* Internet Explorer 5.5+ */
      }
      .el-form-item__label{
          color: teal;
      }
    }
    .flex-box {
      display: flex;
      .items {
        flex-grow: 1;
      }
      .items1 {
        flex-grow: 1
      }
    }
    .collapse{
            padding: 0 20px;
            .el-collapse-item__content{
                padding-bottom: 10px;
                padding-top: 5px;
            }
            .codePre {
                margin-top: -36px;
                margin-bottom: -45px;
            }
            .codeCss:hover {
                cursor: pointer;
                text-decoration: underline;
            }
            .fontRed{
              color: red;
            }
            .fontGreen{
              color: green;
            }
    }
    .vulDetail-button {
      font-size: 13px;
      height: 32px;
      width: 95px;
      padding: 0px;
    }
    .vulDetail-btn {
      background: #fc9153;
      border-radius: 4px;
      font-size: 13px;
      height: 32px;
      width: 95px;
      padding: 0px;
      border: none;
    }
}
</style>

