<template>
  <div class="check-wrap">
    <img src="./../../assets/images/partner-fail.png" class="title-img">
    <div class="main-title">抱歉！</div>
    <p class="small-desc">您提交的合作信息未通过审核！</p>

    <div class="router-wrap">
      <router-link class="reapply" to='/parnter'>继续申请</router-link>
    </div>

    <img src="../../assets/images/qrcode.png" class="qrcode-img">
    <p class="desc">欢迎关注川派医方馆</p>
  </div>
</template>

<script>
  
</script>

<style lang="less" scoped>
.check-wrap{
  height: 100vh;
  background-color: #fff;
  padding-top: 1rem;
  box-sizing: border-box;
  text-align: center;
}
.title-img{
  width: 2rem;
  height: 2rem;
  margin: 0 auto 0.55rem;
}
.main-title{
  padding: 0 1rem;
  color: #2d2d2d;
  line-height: 0.6rem;
  font-size: 0.4rem;
}
.small-desc{
  color: #888888;
  font-size: 0.28rem;
  margin-top: 0.4rem;
}
.qrcode-img{
  width: 2.15rem;
  height: 2.15rem;
  margin-top: 1.45rem;
}
.desc{
  color: #2d2d2d;
  font-size: 0.28rem;
  margin-top: 0.28rem;
}
.router-wrap{
  padding: 0.3rem;
  margin-top: 0.6rem;
  .reapply{
    display: block;
    height: 0.88rem;
    border-radius: 4px;
    background-color: #09bb07;
    color: #ffffff;
    line-height: 0.88rem;
    font-size: 0.36rem;
  }
}
</style>
