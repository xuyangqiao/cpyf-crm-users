<template>
  <div class="success-content">
    <div class="content vux-1px-b">
      <div class="logo"></div>
      <h1 class="title">预约信息提交成功</h1>
      <p class="msg">川派医方馆会尽快处理您的预约请求，预约成功后会通过微信公众号或短信通知您</p>
      <p class="mobile"><strong>就诊咨询电话：</strong>{{phone}}</p>

      <x-button action-type='button' @click.native='$router.push("/record")'>查看预约信息</x-button>

      <p class="desc"><span class="red">注：</span>为保证您顺利就诊，分诊护士会通过电话对您进行回访，如有打扰，请谅解。</p>
    </div>

    <div class="success-foot">
      <div class="qrcode">
        <img src="./../../assets/images/qrcode.png" class="code-pic">
      </div>
      <div class="foot-msg">
        <p>扫码关注川派医方馆公众号</p>
        <p>咨询 / 预约 / 随访</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { XButton } from 'vux'
  export default {
    components: {
      XButton
    },
    beforeRouteLeave (to, from, next) {
      this.$store.commit('footerShow', true)
      next()
    },
    created () {
      this.$store.commit('footerShow', false)
    },
    computed: {
      phone () {
        return this.$store.state.userDefault.contact
      }
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
  .success-content{
    background: #fff;
    text-align: center;
    padding: 1rem 0.3rem 1.5rem;
    .content{
      padding-bottom: 0.44rem;
    }
    .logo{
      margin: 0 auto 0.55rem;
      width: 2rem;
      height: 2rem;
      background: url('./../../assets/images/success-logo.png') no-repeat center center;
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
    .success-foot{
      padding-top: 0.44rem;
      text-align: center;
      .qrcode{
        width: 2.2rem;
        height: 2.2rem;
        margin: 0 auto;
        text-align: center;
        .code-pic{
          width: 100%;
          height: 100%;
        }
      }
      .foot-msg{
        margin-top: 0.15rem;
        color: #888;
        font-size: 0.24rem;
        line-height: 0.48rem;
      }
    }
  }
</style>
