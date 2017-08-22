<template>
  <div class="detail-wrap">
    <iframe :src="content.url" frameborder="0" width="100%" height="100%" id="iFrame1"></iframe>
  </div>
</template>

<script>
  import api from '@/api'
  export default {
    data () {
      return {
        content: ''
      }
    },
    created () {
      // this.$store.commit('footerShow', false)
      this.fetchData()
    },
    beforeRouteLeave (to, from, next) {
      this.$store.commit('footerShow', true)
      next()
    },
    methods: {
      // swipe (evt) {
      //   console.log(evt)
      //   if (evt.direction === 'Left') {
      //     console.log(123123123)
      //   }
      // },
      async fetchData () {
        const {data: {code, data, msg}} = await api.get('/Users/Article/SpecialDetail', {id: this.$route.query.tid})
        if (code === 200) {
          this.content = data
          this.shareMsg()
          document.title = this.content.title
        } else {
          this.toast(msg)
        }
      },
      shareMsg () {
        this.$wechat.ready(() => {
          this.wechatShare({
            title: `${this.content.title}`,
            link: this.handUrl(location.hash),
            img: `${this.content.img1}`,
            desc: `${this.content.desc}`
          })
        })
      }
    },
    mounted () {
      this.shareMsg()
    }
  }
</script>

<style lang="less" scoped>
  .detail-wrap{
    position: absolute;
    top: 0;
    bottom: 1rem;
    width: 100%;
  }
</style>
