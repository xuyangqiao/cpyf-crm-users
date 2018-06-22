<template>
  <div v-transfer-dom>
    <x-dialog v-model="windowShow" class="noclient-wrap" :hide-on-blur='true'>
      <div class="noclient">
        <div class="icon-close" @click='windowShow = !windowShow'>
          <x-icon type="ios-close-outline" size="30"></x-icon>
        </div>
        <h1 class="title">温馨提示</h1>
        <p>1、本院实行实名预约就诊制度，预约前请先绑定就诊人；</p>
        <p>2、预约后，分诊护士可能会通过电话与您确认预约信息，如影响到您的休息，请谅解；</p>
        <p>3、预约成功后，请在约定时间内，到预约的基地就诊；</p>
        <p>4、如有特殊原因不能到诊，请提前取消预约，将号源留给其他需要的人，谢谢！</p>
      </div>
      <div class="know-wrap">
        <div class="know-btn" @click='newClient'>
          <span class="know-icon"></span>
          <span class="text">添加就诊人</span>
        </div>
      </div>
    </x-dialog>
  </div>
</template>

<script>
  import { XDialog, TransferDomDirective as TransferDom } from 'vux'
  export default {
    props: ['tipShow'],
    directives: {
      TransferDom
    },
    components: {
      XDialog
    },
    data () {
      return {
        windowShow: false
      }
    },
    created () {
      setTimeout(() => {
        this.windowShow = !this.tipShow
      }, 5000)
    },
    methods: {
      newClient () {
        this.$router.push('/newclient')
      }
    }
  }
</script>

<style lang="less">
  .noclient-wrap{
    .weui-dialog{
      width: auto;
      max-width: 750px;
      border-radius: 6px;
    }
    .noclient{
      position: relative;
      width: 6.9rem;
      padding: 0.57rem 0.6rem 0;
      box-sizing: border-box;
      .icon-close {
        position: absolute;
        right: 8px;
        top: 8px;
        height: 30px;
        .vux-x-icon{
          fill: #2d2d2d;
          display: block;
        }
      }
      .title{
        color: #2d2d2d;
        font-size: 0.36rem;
        margin-bottom: 0.35rem;
      }
      p{
        text-align: left;
        color: #888888;
        font-size: 0.3rem;
        line-height: 0.5rem;
        margin-bottom: 0.1rem;
        .red{
          color: #ff0000;
        }
      }
    }
    .know-wrap{
      text-align: center;
      padding-bottom: 0.3rem;
      .know-btn{
        display: inline-block;
        height: 0.8rem;
        width: 5.64rem;
        border-radius: 6px;
        background: #09bb07;
        line-height: 0.8rem;
        color: #fff;
        font-size: 0.36rem;
      }
      .know-icon{
        display: inline-block;
        vertical-align: middle;
        width: 0.35rem;
        height: 0.35rem;
        background: url('../assets/images/icon/know-icon.png') no-repeat center center;
        background-size: contain;
      }
      .text{
        vertical-align: middle;
      }
    }
  }
</style>
