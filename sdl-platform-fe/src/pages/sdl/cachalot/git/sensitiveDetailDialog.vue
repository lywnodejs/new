<template>
       <el-dialog title="查看数据库字段"
            id="taskInfo-dialog1"
            :visible.sync="checkDialogVisible"
            width="440px">
       <el-form :inline="true" label-width="80px" label-position="left" >
           <el-checkbox-group v-model="checkedDatalevel">
                <el-checkbox label="C3" key="C3">C3</el-checkbox>
                <el-checkbox label="C4" key="C4">C4</el-checkbox>
            </el-checkbox-group>
        <el-tree
            class="filter-tree"
            :data="repoTree"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            ref="tree">
        </el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-button" @click="checkDialogVisible = false">返回</el-button>
        <!-- <el-button class="octopus-diaolog-btn" type="primary" @click="fetchData()">确定</el-button> -->
      </span>
    </el-dialog>
</template>

<script>

// import * as CONSTANTS from '@/commons/dorado'
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
    getGitSensitive: 'cachalot_domain/getGitSensitive'
})({
  props: ['dialogVisible', 'scopeRow'],
  data() {
    return {
      checkDialogVisible: null,
      scopeRows: this.scopeRow,
      repoTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkedDatalevel: ['C3', 'C4']
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    dialogVisible(val) {
        this.checkDialogVisible = val;
    },
    checkDialogVisible(val) {
        this.$emit('getVisible', this.checkDialogVisible)
    },
    scopeRow(val) {
        this.scopeRows = val
        this.fetchData()
    },
    checkedDatalevel(val) {
        this.$refs.tree.filter(val);
    }
  },
  methods: {
    fetchData() {
        let param = {
            git_url: this.scopeRows.git_url
        }
        this.getGitSensitive(param).then(res => {
            console.log(res)
          if (res && res.data) {
            this.repoTree = this.getTree(res.data)
          } else {
            this.repoTree = []
          }

        })
    },
    filterNode(value, data) {
        if (value.length === 2) return true;
        if (data.label.split(': ')[1] === value[0]) {
            return true
        }
        return false
    },
    getTree(data) {
        if (!data) return
        let tree = [], map = {}, id = 1
        for (let i = 0; i < data.length; i++) {
            let keys = Object.keys(data[i]);
            for (let j = 0; j < keys.length; j++) {
                let temp = keys[j].split('.')
                let fileds = []
                if (!data[i][keys[j]].fields) {
                    fileds = []
                } else {
                    for (let z = 0; z < data[i][keys[j]].fields.length; z++) {
                        fileds.push({
                            id: id++,
                            label: `${data[i][keys[j]].fields[z].field_name}: ${data[i][keys[j]].fields[z].level === 30 ? 'C3' : 'C4'}`
                        })
                    }
                }
                if (map[temp[0]]) {
                    if (map[keys[j]]) {
                        let temp1 = tree[map[temp[0]] - 1].children[map[keys[j]] - 1].children
                        for (let z = 0; z < temp1.length; z++) {
                            if (temp1[z].label === temp[1]) {
                                temp1[z].children.push(...fileds)
                            }
                        }
                    } else {
                        tree[map[temp[0]] - 1].children.push({
                            id: id++,
                            label: temp[1],
                            children: fileds
                        })
                        map[keys[j]] = tree[map[temp[0]] - 1].children.length
                    }
                } else {
                    tree.push({
                        id: id++,
                        label: temp[0],
                        children: [{
                            id: id++,
                            label: temp[1],
                            children: fileds
                        }]
                    })
                    map[temp[0]] = tree.length
                    map[keys[j]] = tree[map[temp[0]] - 1].children.length
                }

                // if (map[keys[j]]) {
                //     for (let z = 0; z < tree[map[keys[j]] - 1].children.length; z++) {
                //         if (tree[map[keys[j]] - 1].children[z].label === temp[1]) {
                //             tree[map[keys[j]] - 1].children[z].children.push(...fileds)
                //         }
                //     }
                // } else {
                //     tree.push({
                //         id: id++,
                //         label: temp[0],
                //         children: [{
                //             id: id++,
                //             label: temp[1],
                //             children: fileds
                //         }]
                //     })
                //     map[keys[j]] = tree.length
                // }
            }
        }
        return tree
    }
  }
})
</script>
<style lang="less">
#taskInfo-dialog1{
    .octopus-diaolog-button {
        width: 80px;
        height: 32px;
        padding: 7px 15px;
        line-height: 10px;
        font-size: 13px;
    }
    .dorado-sensitive{
        cursor: pointer;
        font-size: 13px;
        position: relative;
        top: 3px;
    }
    .octopus-diaolog-btn {
        background: #FC9153;
        border-radius: 4px;
        width: 80px;
        height: 32px;
        padding: 7px 15px;
        line-height: 10px;
        font-size: 13px;
        border: none;
    }
    .inputWidth{
        width: 320px;
    }
}
</style>
