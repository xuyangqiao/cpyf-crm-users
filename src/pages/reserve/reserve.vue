<template>
<div class="container">
  <attentionTip v-if="attentionShow"></attentionTip>
  <div class="header">
    <tab v-model="selected">
      <tab-item @on-item-click="onItemClick(1)">在线预约</tab-item>
      <tab-item @on-item-click="onItemClick(2)">预约记录</tab-item>
    </tab>
  </div>
  <router-view></router-view>
</div>
</template>

<script>
  import { Tab, TabItem } from 'vux'
  import attentionTip from '@/components/attentionTip.vue'
  export default {
    components: {
      Tab,
      TabItem,
      attentionTip
    },
    data () {
      return {
        tabSelect: -1,
        selected: 0
      }
    },
    beforeRouteUpdate (to, from, next) {
      if (to.path === '/') {
        this.selected = 0
      } else {
        this.selected = 1
      }
      next()
    },
    created () {
      if (window.location.hash === '#/') {
        this.selected = 0
      } else {
        this.selected = 1
      }
    },
    computed: {
      selected () {
        if (window.location.hash === '#/') {
          return 0
        } else {
          return 1
        }
      },
      attentionShow () {
        if (!this.$store.state.userDefault.count) {
          return false
        }
        if (this.$route.path === '/record' && this.$store.state.userDefault.attention === 0) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      onItemClick (index) {
        if (index === this.tabSelect) {
          return
        }
        this.tabSelect = index
        if (index === 1) {
          this.$router.push('/')
        } else {
          this.$router.push('/record')
        }
      }
    }
  }
</script>

<style lang="less">
  .header{
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
