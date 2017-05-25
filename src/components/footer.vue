<template>
<div class="footer" v-show="footerShow">
  <tabbar v-model="footerSelect">
    <tabbar-item link="/">
      <img class="default" slot="icon" src="../assets/images/icon/footer-reserve.png">
      <img class="active" slot="icon" src="../assets/images/icon/footer-reserve-active.png">
      <span slot="label">预约</span>
    </tabbar-item>
    <tabbar-item link="/doctorlist">
      <img class="default" slot="icon" src="../assets/images/icon/footer-doctor.png">
      <img class="active" slot="icon" src="../assets/images/icon/footer-doctor-active.png">
      <span slot="label">专家</span>
    </tabbar-item>
    <tabbar-item link="/user">
      <img class="default" slot="icon" src="../assets/images/icon/footer-user.png">
      <img class="active" slot="icon" src="../assets/images/icon/footer-user-active.png">
      <span slot="label">我的</span>
    </tabbar-item>
  </tabbar>
</div>
</template>

<script>
  import { Tabbar, TabbarItem, Group, Cell } from 'vux'
  export default {
    components: {
      Tabbar,
      TabbarItem,
      Group,
      Cell
    },
    computed: {
      footerSelect () {
        return this.$store.state.footerSelect
      },
      footerShow () {
        return this.$store.state.footerShow
      }
    }
  }
</script>

<style lang="less">
.weui-tabbar{
  height: 1rem;
  position: fixed !important;
  left: 0;
  .weui-tabbar__item{
    padding-top: 0.15rem;
    img.active{
      display: none;
    }
    &.weui-bar__item_on{
      img.default{
        display: none;
      }
      img.active{
        display: block;
      }
    }
    .weui-tabbar__icon{
      width: 0.4rem;
      height: 0.4rem;
    }
    .weui-tabbar__label{
      color: #2d2d2d;
      font-size: 0.26rem;
    }
  }
}
</style>
