<template>
  <div class="panel">
    <div class="topPanel condition">
      <el-row class="titleHead" type="flex" align='middle'>
        <div style="padding:20px">
          <i class="el-icon-search" style="margin-right: 6px"></i>
          <span>实体库</span>
        </div>
      </el-row>
      <el-row>
        <el-col :span="5" class="listPanel listPanel-left condition_left">
          <el-col style="text-align: center;padding:10px;background:#ebeef5;"><i class="el-icon-edit"></i><span style="font-size:12px">实体类别</span></el-col>
          <el-col>
            <el-tree
              :data="data6"
              node-key="id"
              accordion
              highlight-current
            >
            </el-tree>
          </el-col>

        </el-col>
        <el-col :offset="1" :span="18" class="listPanel" style="height:260px">
          <el-select
            v-model="value9"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入要查找的实体名称"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in options4"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div>
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              :disable-transitions="false"
            >
              {{tag}}
            </el-tag>
          </div>

        </el-col>
      </el-row>
    </div>

    <div class="bottomPanel condition">
      <el-row class="titleHead" type="flex" align='middle'>
        <div style="padding:20px">
          <i class="el-icon-search" style="margin-right: 6px"></i>
          <span>关系库</span>
        </div>
      </el-row>
      <el-row>
        <el-col :span="4" class="listPanel listPanel-left condition_left">
          <el-col style="text-align: center;padding:10px;background:#ebeef5;"><i class="el-icon-edit"></i><span style="font-size:12px">实体类别</span></el-col>
          <el-col>
            <el-tree
              :data="data6"
              node-key="id"
              accordion
              highlight-current
            >
            </el-tree>
          </el-col>
        </el-col>
        <el-col :span="1" >
            <el-row class="listPanel condition_left"  type="flex" justify="center" align="middle">
              <i class="fa fa-2x fa-chain"></i>
            </el-row>
        </el-col>
        <el-col :span="4" class="listPanel listPanel-left condition_left">
          <el-col style="text-align: center;padding:10px;background:#ebeef5;"><i class="el-icon-edit"></i><span style="font-size:12px">实体类别</span></el-col>
          <el-col>
            <el-tree
              :data="data6_2"
              node-key="id"
              accordion
              highlight-current
            >
            </el-tree>
          </el-col>
        </el-col>
        <el-col :offset="1" :span="14" class="listPanel" style="height:260px">
          <el-col><span class="el-input" style="margin: 10px 0 5px 10px;color:#c0c4cc">当前关系：</span></el-col>
          <div>
            <el-tag
              type="success"
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </div>

        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'EntityContrl',
    data () {
      return {

          //topPanel
        dynamicTags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: '',
        //topPanel end

        success:'success',
        warning:'warning',
        tableData: [{
          date: '2016-05-02',
          names: [{ name: '标签一', type: ''},
            { name: '标签二', type: 'success'},
            { name: '标签三', type: 'info'},
            { name: '标签四', type: 'warning' },
            { name: '标签五', type: 'danger' }],
          names1: [{ name: '标签一', type: ''},
            { name: '标签二', type: 'success'},
            { name: '标签三', type: 'info'},
            { name: '标签四', type: 'warning' },
            { name: '标签五', type: 'danger' }],
          address: '上海市普陀区金沙江路 1518 弄',
          visible2: false
        }, {
          date: '2016-05-04',
          names: [{ name: '标签一', type: '' },
            { name: '标签二', type: 'success' },
            { name: '标签三', type: 'info' },
            { name: '标签四', type: 'warning' },
            { name: '标签五', type: 'danger' }],
          names1: [{ name: '标签一', type: ''},
            { name: '标签二', type: 'success'},
            { name: '标签三', type: 'info'},
            { name: '标签四', type: 'warning' },
            { name: '标签五', type: 'danger' }],
          address: '上海市普陀区金沙江路 1517 弄',
          visible2: false
        }, {
          date: '2016-05-01',
          names: [{ name: '标签一', type: '' },
            { name: '标签二', type: 'success' },
            { name: '标签三', type: 'info' },
            { name: '标签四', type: 'warning' },
            { name: '标签五', type: 'danger' }],
          names1: [{ name: '标签一', type: ''},
            { name: '标签二', type: 'success'},
            { name: '标签三', type: 'info'},
            { name: '标签四', type: 'warning' },
            { name: '标签五', type: 'danger' }],
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          names: [{ name: '标签一', type: '' },
            { name: '标签二', type: 'success' },
            { name: '标签三', type: 'info' },
            { name: '标签四', type: 'warning' },
            { name: '标签五', type: 'danger' }],
          names1: [{ name: '标签一', type: ''},
            { name: '标签二', type: 'success'},
            { name: '标签三', type: 'info'},
            { name: '标签四', type: 'warning' },
            { name: '标签五', type: 'danger' }],
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        data6:[{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {id: 3, label: '一级 3', children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2',
          children: [{
            id: 11,
            label: '三级 3-2-1'
          }, {
            id: 12,
            label: '三级 3-2-2'
          }, {
            id: 13,
            label: '三级 3-2-3'
          }]
        }]
        }],
        data6_2:[{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {id: 3, label: '一级 3', children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2',
          children: [{
            id: 11,
            label: '三级 3-2-1'
          }, {
            id: 12,
            label: '三级 3-2-2'
          }, {
            id: 13,
            label: '三级 3-2-3'
          }]
        }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        options4: [],
        value9: [],
        list: [],
        loading: false,
        states: ["Alabama", "Alaska", "Arizona",
          "Arkansas", "California", "Colorado",
          "Connecticut", "Delaware", "Florida",
          "Georgia", "Hawaii", "Idaho", "Illinois",
          "Indiana", "Iowa", "Kansas", "Kentucky",
          "Louisiana", "Maine", "Maryland",
          "Massachusetts", "Michigan", "Minnesota",
          "Mississippi", "Missouri", "Montana",
          "Nebraska", "Nevada", "New Hampshire",
          "New Jersey", "New Mexico", "New York",
          "North Carolina", "North Dakota", "Ohio",
          "Oklahoma", "Oregon", "Pennsylvania",
          "Rhode Island", "South Carolina",
          "South Dakota", "Tennessee", "Texas",
          "Utah", "Vermont", "Virginia",
          "Washington", "West Virginia", "Wisconsin",
          "Wyoming"]
      }
    },
    methods: {
        //topTitle
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      //topTitle end



      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options4 = this.list.filter(item => {
              return item.label.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options4 = [];
        }
      },
      handleEdit(index,row){

        console.log(index);
        console.log(row);
      },
    },
    mounted: function(){
      this.list = this.states.map(item => {
        return { value: item, label: item };
      });
    },
    created(){
    },
    components: {
//      appHeader
    },
    filters: {

    }
  }
</script>

<style scoped>

  .topPanel,.bottomPanel{
    height:310px;
    color:#000;
    border:1px solid #E4E7ED;
  }
  .listPanel-left{
    height:100%;
    border:1px solid #E4E7ED;
  }
  i{
    margin-right:6px;
  }
  .el-select{
    width:240px;
    padding:20px 0;
  }
  .el-pagination{
    padding-top:10px;
    text-align:center;
  }
  .listPanel{
    height:270px;
    overflow-y: scroll;
  }
  .titleHead{
    text-align: left; font-size: 12px;background-color:#20a0ff;height:40px;color:#fff;
  }
   .el-tag {
    margin-left: 10px;
    margin-top:5px;
  }
  .button-new-tag {
    margin-left: 10px;
    margin-top:5px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .bottomPanel{
    margin:18px 0 0 0;
  }
  .condition_left
  {
    margin:10px 0;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    border-radius: 4px;
  }

</style>
