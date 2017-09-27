<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title" img-set="/themes/home/Users/Users/static/favicon.ico"></router-view>
    <footer-nav></footer-nav>
    <transition name="fade" mode="out-in">
      <loading v-if="loading"></loading>
    </transition>
  </div>
</template>

<script>
import footerNav from '@/components/footer'
import loading from '@/components/loading'
import api from '@/api'

export default {
  name: 'app',
  components: {
    footerNav,
    loading
  },
  computed: {
    loading () {
      return this.$store.state.loading
    }
  },
  async created () {
    const { data: { code, data } } = await api.get('/Users/Wechatconfig/MyUserInfo')
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
.fade-enter-active{
  transition: opacity 0s;
}
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.router-slid-enter-active,
.router-slid-leave-active {
  transition: all .4s;
}

.router-slid-enter,
.router-slid-leave-active {
  transform: translate3d(3rem, 0, 0);
  opacity: 0;
}
</style>
