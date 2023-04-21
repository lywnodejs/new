<template>
  <el-select
    v-model="selectedItems"
    clearable
    filterable
    remote
    default-first-option
    value-key="dictId"
    loading-text="查询中..."
    no-match-text="无匹配"
    no-data-text="无"
    placeholder="名称/代码"
    style="width: 100%;"
    :loading="isSearching"
    :remote-method="searchStock"
    @change="stockChange">
    <el-option
      v-for="item in stockTable"
      :key="item.dictId"
      :label="item.disName"
      :value="item">
    </el-option>
  </el-select>
</template>

<script>
    export default {
      name: "KeyboardSprite",
      data () {
        return {
          selectedItems: this.multiple ? [] : {}, // 选中的股票
          stockTable: [], // 股票搜索结果
          isSearching: false, // 是否正在搜索股票。。。
        }
      },
      methods:{
        stockChange(val){
          this.$emit('getstock',val);
        },
        searchStock(queryString){
          if(!queryString) return ;
            this.isSearching = true
            let params = {
              query: queryString,
              type:11,
              count: 20
            }
            this.$http.get('/reportUrl/general/key/wizard',{params}).then((result)=>{
              this.isSearching = false
              if (result && result.data.data) {
                this.stockTable = result.data.data
              } else {
                this.stockTable = []
              }
            })
            // console.log(result)

        }
      }
    }
</script>

<style scoped>

</style>
