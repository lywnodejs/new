<template>
    <div id="statistic">
       <iframe :src="value" frameborder="0" class="iframe"></iframe>
    </div>
</template>
<script>

export default {
    data() {
        return {
            value: 'http://172.24.5.221:8080/app/kibana#/dashboard/64051f30-b282-11e8-82cd-032a9f35aa53?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-7d,mode:quick,to:now))'

            // value: `http://172.24.5.221:8080/app/kibana#/dashboard/64051f30-b282-11e8-82cd-032a9f35aa53?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-7d,mode:quick,to:now))&_a=(description:'',filters:!(),fullScreenMode:!f,options:(darkTheme:!f,hidePanelTitles:!f,useMargins:!t),panels:!((embeddableConfig:(),gridData:(h:15,i:'1',w:24,x:24,y:0),id:c5a22a10-b27f-11e8-82cd-032a9f35aa53,panelIndex:'1',type:visualization,version:'6.4.0'),(embeddableConfig:(),gridData:(h:26,i:'2',w:23,x:1,y:35),id:'5c0ae060-b18a-11e8-82cd-032a9f35aa53',panelIndex:'2',type:visualization,version:'6.4.0'),(embeddableConfig:(),gridData:(h:15,i:'3',w:24,x:0,y:0),id:'21716120-b187-11e8-82cd-032a9f35aa53',panelIndex:'3',type:visualization,version:'6.4.0'),(embeddableConfig:(),gridData:(h:15,i:'4',w:23,x:1,y:61),id:d44d3320-b27f-11e8-82cd-032a9f35aa53,panelIndex:'4',type:visualization,version:'6.4.0'),(embeddableConfig:(),gridData:(h:15,i:'5',w:24,x:24,y:61),id:df5b3f50-b27f-11e8-82cd-032a9f35aa53,panelIndex:'5',type:visualization,version:'6.4.0'),(embeddableConfig:(),gridData:(h:26,i:'6',w:24,x:24,y:35),id:'4c8cd230-b282-11e8-82cd-032a9f35aa53',panelIndex:'6',type:visualization,version:'6.4.0'),(embeddableConfig:(),gridData:(h:20,i:'7',w:48,x:0,y:15),id:'727307d0-b188-11e8-82cd-032a9f35aa53',panelIndex:'7',type:visualization,version:'6.4.0'),(embeddableConfig:(),gridData:(h:15,i:'8',w:24,x:0,y:76),id:'652547e0-b7f6-11e8-9bcc-8d26fbdda765',panelIndex:'8',type:visualization,version:'6.4.0')),query:(language:lucene,query:''),timeRestore:!f,title:%E7%99%BD%E7%9B%92%E8%BF%90%E8%90%A5%E7%9C%8B%E6%9D%BF,viewMode:view)`
        }
    }
}
</script>
<style lang="less">
  #statistic {
        position: absolute;
        bottom: 23px;
        top: 0;
        right: 23px;
        left: 23px;
        // margin: auto;
        width: 100%;
        width: auto;
        // height: 100%;
        background: white;
        // margin-top: -15px;
        box-sizing: border-box;
        .iframe{
            width: 100%;
            // width: auto;
            height: 100%;
        }
    }
</style>

