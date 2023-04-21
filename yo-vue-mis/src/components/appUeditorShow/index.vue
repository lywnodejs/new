<template>
  <div class="app-ueditor-show" v-html="content">
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less">
  .app-ueditor-show {
    table.sortEnabled tr.firstRow th,table.sortEnabled tr.firstRow td{padding-right:20px;background-repeat: no-repeat;background-position: center right;}
    .selectTdClass{background-color:#edf5fa !important}table.noBorderTable td,table.noBorderTable th,table.noBorderTable caption{border:1px dashed #ddd !important}table{margin-bottom:10px;border-collapse:collapse;display:table;}td,th{padding: 5px 10px;border: 1px solid #DDD;}caption{border:1px dashed #DDD;border-bottom:0;padding:3px;text-align:center;}th{border-top:1px solid #BBB;background-color:#F7F7F7;}table tr.firstRow th{border-top-width:2px;}.ue-table-interlace-color-single{ background-color: #fcfcfc; } .ue-table-interlace-color-double{ background-color: #f7faff; }td p{margin:0;padding:0;}
    ol,ul{margin:0;pading:0;width:95%}li{clear:both;}li.list-cn-1-0{background-image:url(http://bs.baidu.com/listicon/list-cn-1-0.gif)}
    li.list-cn-1-1{background-image:url(http://bs.baidu.com/listicon/list-cn-1-1.gif)}
    li.list-cn-1-2{background-image:url(http://bs.baidu.com/listicon/list-cn-1-2.gif)}
    li.list-cn-1-3{background-image:url(http://bs.baidu.com/listicon/list-cn-1-3.gif)}
    li.list-cn-1-4{background-image:url(http://bs.baidu.com/listicon/list-cn-1-4.gif)}
    li.list-cn-1-5{background-image:url(http://bs.baidu.com/listicon/list-cn-1-5.gif)}
    li.list-cn-1-6{background-image:url(http://bs.baidu.com/listicon/list-cn-1-6.gif)}
    li.list-cn-1-7{background-image:url(http://bs.baidu.com/listicon/list-cn-1-7.gif)}
    li.list-cn-1-8{background-image:url(http://bs.baidu.com/listicon/list-cn-1-8.gif)}
    li.list-cn-1-9{background-image:url(http://bs.baidu.com/listicon/list-cn-1-9.gif)}
    li.list-cn-1-10{background-image:url(http://bs.baidu.com/listicon/list-cn-1-10.gif)}
    li.list-cn-1-11{background-image:url(http://bs.baidu.com/listicon/list-cn-1-11.gif)}
    li.list-cn-1-12{background-image:url(http://bs.baidu.com/listicon/list-cn-1-12.gif)}
    li.list-cn-1-13{background-image:url(http://bs.baidu.com/listicon/list-cn-1-13.gif)}
    li.list-cn-1-14{background-image:url(http://bs.baidu.com/listicon/list-cn-1-14.gif)}
    li.list-cn-1-15{background-image:url(http://bs.baidu.com/listicon/list-cn-1-15.gif)}
    li.list-cn-1-16{background-image:url(http://bs.baidu.com/listicon/list-cn-1-16.gif)}
    li.list-cn-1-17{background-image:url(http://bs.baidu.com/listicon/list-cn-1-17.gif)}
    li.list-cn-1-18{background-image:url(http://bs.baidu.com/listicon/list-cn-1-18.gif)}
    li.list-cn-1-19{background-image:url(http://bs.baidu.com/listicon/list-cn-1-19.gif)}
    li.list-cn-1-20{background-image:url(http://bs.baidu.com/listicon/list-cn-1-20.gif)}
    li.list-cn-1-21{background-image:url(http://bs.baidu.com/listicon/list-cn-1-21.gif)}
    .pagebreak{display:block;clear:both !important;cursor:default !important;width: 100% !important;margin:0;}
  }
</style>
