<template>
  <div id="knowBox">
    <div class="rxh_public_hd01">
      <b></b><span>生态定位</span>
    </div>
    <div class="rxh_public_bd01">
      <div class="cyContent">
        <div class="rxh_public_hd02">关联产业</div>
        <div class="rxh_public_bd02">

        </div>
      </div>
      <div class="topContent">
        <div class="rxh_public_hd02">上游产业</div>
        <div class="rxh_public_bd02">

        </div>
      </div>
      <div class="bottomContent">
        <div class="rxh_public_hd02">下游产业</div>
        <div class="rxh_public_bd02">

        </div>
      </div>
      <div class="zlContent">

      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'knowList',
  props: ['knowData'],
  data () {
    return {
      txt:window.disName,
      input: this.$route.query.input || this.$route.query.disName
    }
  },
  methods: {

  },
  mounted() {

  },

  activated(){

  },

  watch: {
    knowData(val) {
      var thas =this;
      var txt = window.disName;
      if(val && val.data && val.data.relations){
        if(val.data.relations['公司产品关系_关联产业'] && val.data.relations['公司产品关系_关联产业'].length!==0){
          var arr =[];
          for(var i=0;i<val.data.relations['公司产品关系_关联产业'].length;i++){
            arr.push(val.data.relations['公司产品关系_关联产业'][i].disName);
          }
          var arr2 = arr.join('、');
          $('.cyContent .rxh_public_bd02').html('基于对'+txt+'的财报中主营业务的分析，'+txt+'的核心业务涉及到的产业生态包括：<span style="color: #3E7AFF;">' +arr2+'</span>');
        }else{
          $('.cyContent').hide(0);
        }

        if(val.data.relations['公司上游产品_上游产业'] && val.data.relations['公司上游产品_上游产业'].length!==0){
          var arr =[];
          for(var i=0;i<val.data.relations['公司上游产品_上游产业'].length;i++){
            arr.push(val.data.relations['公司上游产品_上游产业'][i].disName);
          }
          var arr2 = arr.join('、');
          $('.topContent .rxh_public_bd02').html('基于产业逻辑和大数据分析，'+txt+'核心业务所对应的上游产业为：<span style="color: #3E7AFF;">' +arr2+'</span>');
        }else{
          $('.topContent').hide(0);
        }

        if(val.data.relations['公司下游产品_下游产业'] && val.data.relations['公司下游产品_下游产业'].length!==0){
          var arr =[];
          for(var i=0;i<val.data.relations['公司下游产品_下游产业'].length;i++){
            arr.push(val.data.relations['公司下游产品_下游产业'][i].disName);
          }
          var arr2 = arr.join('、');
          $('.bottomContent .rxh_public_bd02').html('基于产业逻辑和大数据分析，'+txt+'核心业务所对应的下游产业为：<span style="color: #3E7AFF;">' +arr2+'</span>');
        }else{
          $('.bottomContent').hide(0);
        }
        $('.zlContent').html('');
        $.ajax({
          url:'/templateNode/report/template/content?id=54&symbol='+window.TXT,
          success:function (res) {
            if(res.content){
              $('.zlContent').html(res.content);
              window['onWindowLoaded'+res.sn]();
              $('#mainContent div').css({marginLeft:'0'});
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
