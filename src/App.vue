<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title" img-set="/themes/home/Users/Users/static/favicon.ico"></router-view>
    <footer-nav></footer-nav>
  </div>
</template>

<script>
import footerNav from '@/components/footer'
import api from '@/api'

export default {
  name: 'app',
  components: {
    footerNav
  },
  async created () {
    const {data: {code, data}} = await api.get('/Users/Wechatconfig/MyUserInfo')
    if (code === 200) {
      this.$store.commit('userDefault', data)
    }
  }
}
</script>

<style lang="less">
@import './assets/css/reset.less';
@import './assets/css/index.less';
@import '~vux/src/styles/1px.less';
</style>
