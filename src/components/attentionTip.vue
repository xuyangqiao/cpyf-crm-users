<template>
  <div class="tipWrap">
    <div class="tip-box">
      <div class="tip-content">
        <h1 class="title">川派医方馆公众号</h1>
        <p class="desc">关注「川派医方馆」公众号即可获得</p>
        <p class="desc">门诊信息、预约通知、就诊咨询等服务。</p>
      </div>
      <div class="tip-qrcode">
        <img src="./../assets/images/qrcode.png">
      </div>
    </div>
    <transition name='fade'>
      <div class="tip-mask" v-show="maskShow" @click='maskShow = false'>
        <div class="mask-content">
          长按二维码，即可扫码关注
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        maskShow: true
      }
    }
  }
</script>

<style lang="less" scoped>
.tip-mask{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .3);
  z-index: 5000;
  .mask-content{
    position: absolute;
    top: 2.3rem;
    right: 0.3rem;
    font-size: 0.3rem;
    color: #000;
    background: #fff;
    padding: 0.15rem;
    border-radius: 4px;
    &:before{
      content: '';
      position: absolute;
      top: -0.1rem;
      right: 1rem;
      width: 0;
      height: 0;
      border-left: 0.1rem solid transparent;
      border-right: 0.1rem solid transparent;
      border-bottom: 0.15rem solid #fff;
    }
  }
}
.tip-box{
  padding: 0.4rem 0.3rem;
  box-sizing: border-box;
  background: url('../assets/images/attentionTip.png') no-repeat center center;
  background-size: cover;
  height: 2.5rem;
  width: 100%;
  display: flex;
  justify-content: space-around;
  position: relative;
  .tip-content{
    padding-top: 0.22rem;
    .title{
      font-size: 0.3rem;
      color: #000;
      margin-bottom: 0.26rem;
    }
    .desc{
      font-size: 0.24rem;
      color: #6e6e6e;
      margin-bottom: 0.26rem;
    }
  }
  .tip-qrcode{
    width: 1.74rem;
    height: 1.74rem;
    background: #fff; 
    img{
      width: 1.74rem;
      height: 1.74rem;
    }
  }
}
</style>
