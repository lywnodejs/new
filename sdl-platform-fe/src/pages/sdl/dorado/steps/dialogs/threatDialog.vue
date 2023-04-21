<template>
  <div>
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <el-tree class="tree"
             @check='getCurrentPath'
             ref="threat"
             v-model="rtn"
             node-key="idd"
             :data="attack_surface"
             :props="defaultProps"
             :check-on-click-node='false'
             show-checkbox
             :filter-node-method="filterNode">
    </el-tree>
    <el-button class="confirm" @click="confirmDialog">确定</el-button>
    <el-button class="cancel" @click="determine">取消</el-button>
  </div>
</template>
<script>
  import ajax from '@/plugin/ajax'
  import * as API from '@/commons/api/dorado'
  import bus from '@/routes/eventBus'

  export default {
    name: 'threat-dialog',
    props: {
      value: Object
    },
    data: function() {
      return {
        rtn: this.value.threatData,
        filterText: '',
        setKey: [],
        attack_surface: [],
        checkNodes: [],
        currentPath: [],
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        num: 1
      }
    },
    created() {
      this.getAttackSurfaceList()

      // console.log(this.value)

      //  父组件传递的数据
    },
    watch: {
      filterText(val) {
        this.$refs.threat.filter(val);
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      determine() {
        this.$emit('close')
      },
      confirmDialog() {

        // console.log(this.$refs.threat.getCheckedKeys())
        // console.log(this.$refs.threat)
        // console.log(this.$refs.threat.getCheckedNodes())
        bus.$emit('checkNodes', this.checkNodes)

        this.$emit('close')

        // this.$emit('confirm', 'sss')
      },
      getAttackSurfaceList() {
        ajax.post(API.getAttackSurfaceList, {}).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.attack_surface = response.data
            this.handleAttackSurface(this.attack_surface)
            this.setAttackSurface(this.value.threat, this.attack_surface)
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
        })
      },
      handleAttackSurface(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {

            // let num = arr[i].children.id
            this.handleAttackSurface(arr[i].children)
          }
          arr[i].idd = this.num++
        }

        // this.setAttackSurface(this.value.threat, this.attack_surface)
      },
      setAttackSurface(arr, attackSurface) {
        for (let i = 0; i < arr.length; i++) {
          let surface = this.searchAttackSurface(arr[i].attack_surface, attackSurface)
          let attacker = arr[i].attacker.split(',')
          for (let j = 0; j < attacker.length; j++) {
            this.searchIdd(attacker[j], surface)
          }
          this.searchIdd(arr[i].threat, surface)
          this.$refs.threat.setCheckedKeys(this.setKey)
        }
      },
      searchIdd(name, attackSurface) {
        for (let i = 0; i < attackSurface.length; i++) {
          if (name == attackSurface[i].name) {
            this.setKey.push(attackSurface[i].idd)
          }
          if (attackSurface[i].children && attackSurface[i].children.length != 0) {
            this.searchIdd(name, attackSurface[i].children)
          }
        }
      },
      searchAttackSurface(name, attackSurface) {
        for (let i = 0; i < attackSurface.length; i++) {
          if (attackSurface[i].name == name) {
            return attackSurface[i].children
          }
        }
      },
      getCurrentPath(data, checked) {
        let that = this

        // alert(JSON.stringify(node))
        // console.log(data)
        // console.log(JSON.stringify(checked))
        this.checkNodes = []

        for (let i = 0; i < checked.checkedKeys.length; i++) {
          let node = this.$refs.threat.getNode(checked.checkedKeys[i])
          if (node && node.data && node.data.name && node.childNodes.length == 0) {
            let nodeParent = node.parent
            let json = {name: node.data.name, id: node.data.id, idd: node.data.idd, children: []}
            this.currentPath = json
            while (nodeParent && nodeParent.data && nodeParent.data.name && typeof nodeParent.data === 'object') {
              let arr = this.objDeepCopy(this.checkNodes)
              let returnData = this.judgeIdd(arr, nodeParent.data.idd, this.currentPath)
              if (returnData) {
                this.checkNodes = returnData
                this.currentPath = ''
                break
              } else {
                let json = {
                  name: nodeParent.data.name,
                  id: nodeParent.data.id,
                  idd: nodeParent.data.idd,
                  children: [that.currentPath]
                }

                // this.currentPath.unshift(nodeParent.data.idd)
                this.currentPath = json
                nodeParent = nodeParent.parent
              }
            }
            if (this.currentPath) this.checkNodes.push(this.currentPath)
          }
        }

        // console.log(this.checkNodes)
      },
      judgeIdd(arr, idd, data) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].idd == idd) {
            arr[i].children.push(data)
            return arr
          } else if (arr[i].children.length != 0) {
            this.judgeIdd(arr[i].children, idd, data)
          }
        }
        return false
      },
      objDeepCopy(source) {
        let sourceCopy = source instanceof Array ? [] : {}
        for (let item in source) {
          if (Object.prototype.hasOwnProperty.call(source, item)) {
            sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item]
          }
        }
        return sourceCopy;
      }
    }
  }
</script>
<style scoped lang='less'>
  div {
    text-align: center;
  }
  .tree {
    font-size: 13px;
    -webkit-font-smoothing: antialiased;
    margin-top: 20px;
    margin-bottom: 10px;
    .el-tree-node__label {
      font-size: 13px;
    }
  }
  .confirm {
    height: 32px;
    width: 90px;
    margin-bottom: 0;
    background: #fc9153;
    color: white;
    border-radius: 4px;
    margin-top: 14px;
    padding: 0px;
    border: none;
    // font-weight: 100;
  }
  .cancel {
    height: 32px;
    width: 90px;
    padding: 0px;
    // font-weight: 100;
  }
</style>
