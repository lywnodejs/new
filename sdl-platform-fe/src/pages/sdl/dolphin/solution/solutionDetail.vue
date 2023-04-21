<template>
    <div class="detail">
        <!-- <h1>{{slnKnowledgeDetail.sln_knowledge_name}}</h1> -->
        <div class="detailTitle">
            {{slnKnowledgeDetail.sln_knowledge_name}}
        </div>
        <div class="summary">
            <div class="subTitle">背景</div>
            <!-- <h3>背景</h3> -->
            <div class="flex">
                <mavon-editor class="displayNone" v-model="slnKnowledgeDetail.sln_background" @change="change"></mavon-editor>
                <div class="item" v-html="slnKnowledgeDetail.sln_background"></div>
            </div>
            <div class="subTitle">方案详情</div>
            <!-- <h3>方案详情</h3> -->
            <div class="flex">
                <mavon-editor class="displayNone" v-model="slnKnowledgeDetail.sln_detail" @change="change"></mavon-editor>
                <div class="item" v-html="slnKnowledgeDetail.sln_detail"></div>
            </div>
            <div class="subTitle">方案选型</div>
            <!-- <h3>方案选型</h3> -->
            <div class="flex">
                <mavon-editor class="displayNone" v-model="slnKnowledgeDetail.sln_selection" @change="change"></mavon-editor>
                <div class="item" v-html="slnKnowledgeDetail.sln_selection"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { connect } from '@/lib'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default connect(() => {
  return {

      slnKnowledgeDetail: 'dolphin/slnKnowledgeDetail'
  }
}, {
  getSlnKnowledgeDetail: 'dolphin/getSlnKnowledgeDetail'
})({
    name: 'knowledge-detail',
    data() {
        return {
            detailData: {}
        }
    },
    created() {
        this.fetchData()
    },
    components: { mavonEditor },
    methods: {
        fetchData() {
            let that = this
            let queryParams = {
                page: 1,
                limit: 10,
                keywords: {sln_knowledge_id: that.$route.query.solutionId}
            }
          let param = {queryParam: queryParams}
            this.getSlnKnowledgeDetail(param).then(res => {
                this.slnKnowledgeDetail.sln_background = this.transform(this.slnKnowledgeDetail.sln_background)
                this.slnKnowledgeDetail.sln_detail = this.transform(this.slnKnowledgeDetail.sln_detail)
                this.slnKnowledgeDetail.sln_selection = this.transform(this.slnKnowledgeDetail.sln_selection)
            })
        },
        change(bol, str) {
        },
        transform(s) {
            let md = mavonEditor.getMarkdownIt()
            let preview = md.render(String(s))

            // console.log(mavonEditor.getMarkdownIt().use(mihe))
            return preview
        }
    }
})
</script>
<style lang="less" scoped>
.detail{
    width: 100%;
    box-sizing: border-box;
    background: white;
    -webkit-font-smoothing: antialiased;
    // margin-top: -15px;
    // padding: 20px;
    // h1{
    //     margin-top: 20px;
    // }
    .detailTitle{
        margin-top: 5px;
        font-size: 18px;
        // font-weight: 500;
    }
    .displayNone{
        display: none;
    }
    .summary{
        margin: 20px 0;
        .subTitle {
            margin-top: 30px;
            font-size: 14px;
        }
        .flex{
            display: flex;
            flex-wrap: wrap;
            margin-top: 10px;
            margin-left: 10px;
            margin-right: 10px;
            .item{
                flex: 1;
                width: 100%;
                color: #757575;
                word-wrap:break-word;
                word-break:break-all;
                font-size: 13px;
            }
        }
    }
    
}
</style>
