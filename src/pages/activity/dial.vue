<template>
  <div class="dial">
    <div class="dial-title"></div>

    <div class="dial-wrap">
      <div class="dial-main" :style="god"></div>
      <div class="dial-zhen" @click="rotate"></div>
    </div>

    <div class="title">抽奖规则</div>
    <div class="text-wrap">
      <p class="text">活动仅限华为员工参与</p>
      <p class="text">奖品现场发放，后期不予发放</p>
      <p class="text">活动仅限2017年11月1号“成研健康节”活动现场</p>
    </div>

    <div class="title">中奖名单</div>
    <div class="text-wrap center">
      <swiper loop auto height="24px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false">
        <swiper-item><p class="text">恭喜  想****     抽中二等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  无****     抽中二等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  妞****     抽中一等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  E****     抽中二等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  干****     抽中三等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  J****     抽中二等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  喃****     抽中三等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  欧****     抽中三等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  √****     抽中一等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  当****     抽中三等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  g****     抽中一等奖</p></swiper-item>
      </swiper>
      <swiper loop auto height="24px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false">
        <swiper-item><p class="text">恭喜  根****     抽中二等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  L****     抽中二等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  靠****     抽中二等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  他****     抽中三等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  s****     抽中三等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  奢****     抽中三等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  网****     抽中二等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  请****     抽中二等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  Y****     抽中三等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  J****     抽中三等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  L****     抽中二等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  定****     抽中二等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  公****     抽中三等奖</p></swiper-item>
        <swiper-item><p class="text">恭喜  那****     抽中三等奖</p></swiper-item>
      </swiper>
    </div>

    <div class="mask" v-if="alertShow">
      <div class="dial-alert">
        <div class="alert-msg">{{alertMsg}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Swiper, SwiperItem } from 'vux'

  export default {
    components: {
      Swiper,
      SwiperItem
    },
    data () {
      return {
        level: 0,
        god: '',
        alertShow: false
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.commit('footerShow', true)
      next()
    },
    created () {
      let now = new Date().getTime()
      let maxTime = new Date('2017/11/1 14:00:00').getTime()
      if (now > maxTime) {
        this.$router.replace('/')
      }
      this.$store.commit('footerShow', false)
      this.init()
    },
    computed: {
      alertMsg () {
        if (this.level !== 20008) {
          return '三等奖'
        } else {
          return '二等奖'
        }
      }
    },
    methods: {
      init () {
        if (window.localStorage.getItem('level')) {
          this.level = parseInt(window.localStorage.getItem('level'))
          this.alertShow = true
        }
      },
      rotate () {
        let score = parseInt(Math.random() * 100000)
        let deg = 0
        if (score <= 12) {
          this.level = 20008
        } else {
          this.level = 1
        }
        if (this.level !== 20008) {
          deg = Math.round(Math.random() * 88 + 90 + 1) + 720
        } else {
          deg = Math.round(Math.random() * 88 + 180 + 1) + 720
        }
        window.localStorage.setItem('level', this.level)
        this.god = {
          'transform': 'rotate(' + deg + 'deg)',
          'transition': 'all ease 3s'
        }
        setTimeout(() => {
          this.alertShow = true
        }, 3500)
      }
    },
    mounted () {
      this.wechatSpecialConfig()
    }
  }
</script>

<style lang="less" scoped="true">
  .dial {
    background: url("./../../assets/images/diag-bg.png") no-repeat top;
    background-size: contain;
    width: 100%;
    min-height: 100vh;
    background-color: #e53942;
    padding-top: 0.01rem;
    box-sizing: border-box;
    padding-bottom: 0.6rem;
    .dial-title {
      position: absolute;
      top: 0.75rem;
      left: 50%;
      transform: translateX(-50%);
      width: 5.7rem;
      height: 1.8rem;
      background: url("./../../assets/images/dial-title.png") no-repeat center;
      background-size: contain;
    }
    .dial-wrap {
      position: relative;
      margin: 3.12rem auto 0;
      width: 5.65rem;
      height: 5.65rem;
    }
    .dial-main {
      width: 5.65rem;
      height: 5.65rem;
      background: url("./../../assets/images/dial.png") no-repeat center;
      background-size: contain;
    }
    .dial-zhen {
      position: absolute;
      top: 1.42rem;
      left: 50%;
      transform: translateX(-50%);
      width: 1.93rem;
      height: 2.4rem;
      background: url("./../../assets/images/diag-zhen.png") no-repeat center;
      background-size: contain;
    }
    .title {
      width: 2.78rem;
      height: 0.56rem;
      background: url("./../../assets/images/diag-title-bg.png") no-repeat center;
      background-size: contain;
      margin: 0.24rem auto;
      font-size: 0.4rem;
      color: #fff;
      text-align: center;
      line-height: 0.56rem;
    }
    .text-wrap {
      padding: 0 1.1rem;
      &.center {
        text-align: center;
      }
      .text {
        font-size: 0.24rem;
        color: #fce1af;
        line-height: 0.34rem;
      }
    }
    .mask{
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .7);
    }
    .dial-alert {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6.2rem;
      height: 7.24rem;
      background: url("./../../assets/images/dial-alert.png") no-repeat center;
      background-size: contain;
      .alert-msg {
        position: absolute;
        left: 50%;
        top: 4.64rem;
        transform: translateX(-50%);
        font-size: 1.2rem;
        color: #070002;
        white-space: nowrap;
        font-weight: bold;
      }
    }
  }
</style>
