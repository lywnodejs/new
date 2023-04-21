<template>
  <footer class="footer">
    <!-- <p> 滴滴出行安全产品与技术部开发并维护</p> -->
    <div class="footer-container">
        <div class="footer-item" style="width: 50%;">
            <p class="footer-item--title">{{$t("buttons['安全管理平台']")}}</p>
            <p class="footer-item--desc">{{$t('buttons["我们专注"]')}}</p>
            <p class="footer-item--desc">{{$t('buttons["反馈邮箱"]')}}： soc@didichuxing.com</p>
        </div>
        <div style="width: 40%;">
            <p class="footer-item--desc">{{$t('buttons["扫码加入D-Chat反馈群"]')}}</p>
            <img width="100" height="100" src="/project/portals/i/code.png"/>
        </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
};
</script>
