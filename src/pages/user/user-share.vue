<template>
<div class="share-wrap">
  <div class="header">
    <tab v-model="selected">
      <tab-item @on-item-click="onItemClick(1)">分享海报</tab-item>
      <tab-item @on-item-click="onItemClick(2)">公众号海报</tab-item>
    </tab>
  </div>
  <router-view></router-view>
</div>
</template>

<script>
  import { Tab, TabItem } from 'vux'
  export default {
    components: {
      Tab,
      TabItem
    },
    data () {
      return {
        selected: 0
      }
    },
    beforeRouteUpdate (to, from, next) {
      if (to.path === '/poster') {
        this.selected = 0
      } else {
        this.selected = 1
      }
      next()
    },
    created () {
      if (window.location.hash === '#/poster') {
        this.selected = 0
      } else {
        this.selected = 1
      }
    },
    methods: {
      onItemClick (index) {
        this.tabSelect = index
        if (index === 1) {
          this.$router.push('/poster')
        } else {
          this.$router.push('/share')
        }
      }
    },
    mounted () {
      this.$wechat.ready(() => {
        this.wechatShare({
          title: `${this.$store.state.userDefault.name}推荐您预约川派医方馆疼痛专家`,
          link: '/',
          img: 'http://m.qpic.cn/psb?/V11P0IcO3nwu6m/0iy19ozUJOnxFpSC*edLkx6yh1M7jO6WQq5uscPCnfs!/b/dEEBAAAAAAAA&bo=sQCxAAAAAAADFzI!&rf=viewer_4&t=5',
          desc: '专家号源紧张，赶紧预约，川派疼痛医生集团，专治头颈肩腰腿痛！'
        })
      })
    }
  }
</script>

<style lang="less">
  .share-wrap{
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    // background: #fff;
    .header{
      position: fixed;
    }
  }
  .header{
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    .vux-tab{
      height: 1.06rem;
      .vux-tab-item{
        font-size: 18px;
        line-height: 1.06rem;
      }
    }
    .vux-tab-ink-bar{
      &:after{
        content: '';
        display: block;
        position: absolute;
        z-index: 2;
        top: 0px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 7px solid #09bb07;
      }
    }
  }
</style>
