<template>
  <div>

  </div>

</template>

<script>
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import { parseTime } from '../../util'
export default {
  directives: { elDragDialog },
  data() {
    return {
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
      value1: '',
      value3: '',
      value: '',
      dialogVisible: false,
      formData: [],
      form: {
        date1: '',
        name: ''
      }
    }
  },
  methods: {
    // v-el-drag-dialog onDrag callback function
    // handleDrag() {
    //   this.$refs.select.blur()
    // },
    open() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    time(str) {
      console.log(str)
      console.log(str + 8 * 3600 * 1000)
      var date = new Date(str + 8 * 3600 * 1000); // 增加8小时

      console.log(date.toJSON().substr(0, 19).replace('T', ' '))
    },
    openDialog() {
      for(var p in this.form) {
        this.form[p] = ''
      }
      this.dialogVisible=true
      console.log(this.form)
    },
    onSubmit() {
      this.formData.unshift(this.form)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>


