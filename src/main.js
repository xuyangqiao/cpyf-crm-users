// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import store from './store'
import App from './App'
import api from './api'

import { ToastPlugin, WechatPlugin } from 'vux'
Vue.use(ToastPlugin)
Vue.use(WechatPlugin)

// 下拉加载
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

Vue.use(require('vue-wechat-title')) // 修改标题

FastClick.attach(document.body)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  store.commit('footerSelect', to.meta.footer)
  next()
})

router.afterEach((from) => {
  Vue.prototype.wechatConfig()
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')

Vue.prototype.toast = function (text, type = 'text', position = 'middle') {
  this.$vux.toast.show({
    text: text,
    position: position,
    type: type,
    width: 'auto'
  })
}

Date.prototype.format = function () {
  let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  let s = ''
  let month = (this.getMonth() + 1) < 10 ? '0' + (this.getMonth() + 1) : this.getMonth() + 1
  let day = this.getDate() < 10 ? '0' + this.getDate() : this.getDate()
  s += this.getFullYear() + '-' + month + '-' + day
  s += ' ' + weekArr[this.getDay()]               // 获取星期几
  return (s)                       // 返回日期。
}

// 微信分享
// Vue.prototype.shareUrl = async () => {
//   const { data: { code } } = await api.get('/')
//   if (code === 200) {
//     Vue.toast('分享成功')
//   }
// }

// 微信配置
// 配置微信SDK
Vue.prototype.wechatConfig = async function () {
  const {data: {code, data}} = await api.get('/Users/Wechatconfig/WechatConfig')
  if (code === 200 && data) {
    Vue.wechat.config({
      debug: false,
      appId: data.appId, // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonceStr, // 必填，生成签名的随机串
      signature: data.signature, // 必填，签名，见附录1
      jsApiList: ['hideMenuItems', 'chooseWXPay', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseImage', 'uploadImage', 'previewImage', 'getLocalImgData', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
    Vue.wechat.hideMenuItems({
      menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp']
    })
    Vue.wechat.error(function (res) {
      console.log(res)
    })
  }
}

Vue.prototype.handUrl = (url) => {
  url = url.split('#')[1]
  return url
}

Vue.prototype.wechatShare = (share) => {
  const url = location.origin + '/?' + 'agentid=' + store.state.userDefault.agentId + '&share_url=' + share.link + '?'
  Vue.wechat.onMenuShareTimeline({
    title: share.title, // 分享标题
    link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: share.img, // 分享图标
    success: function () {
        // 用户确认分享后执行的回调函数
    },
    cancel: function () {
        // 用户取消分享后执行的回调函数
    }
  })
  Vue.wechat.onMenuShareAppMessage({
    title: share.title, // 分享标题
    desc: share.desc, // 分享描述
    link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: share.img, // 分享图标
    success: function () {
        // 用户确认分享后执行的回调函数
    },
    cancel: function () {
        // 用户取消分享后执行的回调函数
    }
  })
}
