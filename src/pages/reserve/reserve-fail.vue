<template>
  <div class="success-content">
    <div class="content">
      <div class="logo"></div>
      <h1 class="title">预约信息提交失败</h1>
      <p class="msg">{{errorMsg}}</p>
      <p class="mobile"><strong>就诊咨询电话：</strong>18113022015</p>

      <x-button action-type='button' @click.native='$router.push("/")'>再次预约</x-button>
    </div>
  </div>
</template>

<script>
  import { XButton } from 'vux'
  export default {
    components: {
      XButton
    },
    data () {
      return {
        errorMsg: ''
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.commit('footerShow', true)
      next()
    },
    created () {
      this.$store.commit('footerShow', false)
      this.errorMsg = window.sessionStorage.getItem('error')
    },
    mounted () {
      this.$wechat.ready(() => {
        this.wechatShare({
          title: `${this.$store.state.userDefault.truename}推荐您预约川派医方馆疼痛专家`,
          link: '/',
          img: 'http://qpic.cn/6oICaLv7r',
          desc: '川派医方馆，专治头颈肩腰四肢关节疼痛！'
        })
      })
    }
  }
</script>

<style lang="less" scoped>
  .footer{
    display: none;
  }
  .success-content{
    background: #fff;
    text-align: center;
    padding: 1rem 0.3rem 0;
    box-sizing: border-box;
    min-height: 100vh;
    .content{
      padding-bottom: 0.44rem;
    }
    .logo{
      margin: 0 auto 0.55rem;
      width: 2rem;
      height: 2rem;
      background: url('./../../assets/images/fail.png') no-repeat center center;
      background-size: contain;
    }
    .title{
      color: #2d2d2d;
      font-size: 0.4rem;
      margin-bottom: 0.46rem;
    }
    .msg{
      padding: 0 0.38rem;
      color: #888888;
      font-size: 0.28rem;
      line-height: 0.5rem;
    }
    .mobile{
      color: #888888;
      font-size: 0.24rem;
      margin: 0.39rem 0 0.69rem;
      strong{
        font-weight: bold;
      }
    }
    .desc{
      margin-top: 0.76rem;
      text-align: left;
      color: #888888;
      font-size: 0.2rem;
      line-height: 0.36rem;
    }
  }
</style>
