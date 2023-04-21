<template>
    <div id="otter">
        <div class="forward">此功能暂未对全员开放，敬请期待</div>
        <div class="need">申请服务请联系: wangyilaniris@didiglobal.com</div>
    </div>
</template>
<script>

export default {
    data() {
        return {
            value: ''
        }
    }
}
</script>
<style lang="less">
  #otter {
        margin: auto;
        width: 100%;
        height: 100%;
        background: white;
        margin-top: -15px;
        box-sizing: border-box;
        .forward{
            padding-top: 30px;
            margin-top: 30px;
            text-align: center;
            font-size: 20px;
            margin: 0 auto;
        }
        .need{
            text-align: center;
            font-size: 15px;
            padding-top: 10px;
        }
    }
</style>

