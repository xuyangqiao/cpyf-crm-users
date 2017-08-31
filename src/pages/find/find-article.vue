<template>
  <div class="article">
    <div class="article-wrap">
      <div class="article-title">{{content.title}}</div>
      <div class="article-msg">
        <span class="msg">{{content.create_time}}</span>
        <span class="msg">{{content.author}}</span>
        <span class="author" @click="qrcodeShow = true">川派医方馆</span>
      </div>
      <div class="main" v-html="content.content"></div>
      <div class="article-tip">
        <span class="read">阅读 {{content.readnum}}</span>
        <span class="good" v-if="!zanFlag">
          <vue-star animate="animated bounceIn" color="rgb(240, 86, 84)">
            <a slot="icon" class="fa fa-thumbs-up" @click="ClickZan"></a>
          </vue-star>
          <span class="text">{{zanMsg}} {{content.zan}}</span>
        </span>
        <span class="good" :class="{active: content.article_zan}" v-else>
          <i class="fa fa-thumbs-up"></i>
          <span class="text">{{zanMsg}} {{content.zan}}</span>
        </span>
      </div>
      <div class="share-wrap">
        <div class="share-title">
          <span class="title">分享给朋友</span>
        </div>
        <div class="share-item">
          <div class="share" @click="shareFriend">
            <img src="../../assets/images/icon/share-friend.png">
            <p class="title">微信</p>
          </div>
          <div class="share" @click="shareFriend">
            <img src="../../assets/images/icon/share-circle.png">
            <p class="title">朋友圈</p>
          </div>
        </div>
      </div>
      <share-bg v-show="shareShow" @closeShare="shareShow = false"></share-bg>
    </div>

    <div class="article-item">
      <div class="article-title">
        <span class="title">猜你还想看</span>
        <router-link :to="{path: '/find/list'}" class="more-icon"><x-icon type="ios-arrow-right" size="20"></x-icon></router-link>
      </div>
      <div class="article-list">
        <div v-for="(item, index) in list" :key="item.id" class="list-item-wrap">
          <router-link :to="{path: '/find/list/article', query: {id: item.id}}" class="list-item" v-if="!item.url">
            <div class="item-pic">
              <img :src="item.img">
            </div>
            <div class="item-content">
              <h2 class="title">{{item.title}}</h2>
              <p class="msg">
                <span class="time">{{item.create_time}}</span>
                <span class="worker">{{item.author}}</span>
              </p>
            </div>
          </router-link>
          <a :href="item.url" class="list-item" :key="item.id" v-else>
            <div class="item-pic">
              <img :src="item.img">
            </div>
            <div class="item-content">
              <h2 class="title">{{item.title}}</h2>
              <p class="msg">
                <span class="time">{{item.create_time}}</span>
                <span class="worker">{{item.author}}</span>
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>

    <div class="article-foot">
      <div class="nav">
        <router-link :to='{path: "/"}' class="nav-item">在线预约</router-link>
        <a href="https://www.sobot.com/chat/pc/index.html?sysNum=7db545cf781543878d3f132c844fc6a8" class="nav-item">就诊咨询</a>
        <a href="http://www.chuanpaiyifang.com/about/" class="nav-item">关于我们</a>
      </div>
      <div class="company">
        <div class="item">电话：028-89994799</div>
        <a href="http://f.amap.com/2jGW9_05F2lIn" class="item">地址：成都市锦江区一环路东四段75号 <span class="address-icon"></span></a>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div class="float-menu" @click="footerCheck" v-show="!footer"></div>
    </transition>

    <transition name="fade" mode="out-in">
      <div class="mask" v-show="qrcodeShow">
        <div class="mask-content">
          <img src="../../assets/images/article-qrcode.png" class="qrcode">
          <p class="mask-title">长按关注微信公众号</p>
          <p class="mask-title">或搜索<strong>“川派医方馆”</strong>关注公众号</p>
          <div class="line"></div>
          <div class="close-mask" @click="qrcodeShow = false">
            <x-icon type="ios-close-empty" size="40"></x-icon>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import shareBg from '@/components/share-tip.vue'
  import vueStar from 'vue-star'
  import api from '@/api'
  export default {
    components: {
      shareBg,
      vueStar
    },
    data () {
      return {
        shareShow: false,
        footer: false,
        qrcodeShow: false,
        content: '',
        list: [],
        zanFlag: false
      }
    },
    watch: {
      '$route': 'fetchData'
    },
    computed: {
      zanMsg () {
        if (this.content.article_zan) {
          return '已赞'
        } else {
          return '赞'
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.commit('footerShow', true)
      document.removeEventListener('scroll', this.footerScroll)
      next()
    },
    created () {
      this.$store.commit('footerShow', this.footer)
      this.fetchData()
    },
    methods: {
      async fetchData () {
        document.body.scrollTop = 0
        const {data: {code, data, RandList}} = await api.get('/Users/Article/article', {id: this.$route.query.id})
        if (code === 200) {
          this.content = data
          this.list = RandList
          document.title = this.content.title
          if (data.article_zan) {
            this.zanFlag = true
          }
          this.shareMsg()
        }
      },
      async ClickZan () {
        if (this.content.article_zan === 1) {
          return
        }
        const {data: {code}} = await api.get('/Users/Article/ClickZan', {id: this.$route.query.id})
        if (code === 200) {
          this.content.zan = parseInt(this.content.zan) + 1
          this.content.article_zan = 1
          setTimeout(() => {
            this.zanFlag = true
          }, 1000)
          this.toast('点赞成功')
        }
      },
      shareFriend () {
        this.shareShow = true
      },
      footerCheck () {
        this.footer = !this.footer
        this.$store.commit('footerShow', this.footer)
      },
      footerScroll () {
        var a = document.body.scrollTop === 0 ? document.body.clientHeight : document.documentElement.clientHeight
        var b = document.body.scrollTop === 0 ? document.body.scrollTop : document.documentElement.scrollTop
        var c = document.body.scrollTop === 0 ? document.body.scrollHeight : document.documentElement.scrollHeight
        if (a + b === c) {
          this.footer = true
          this.$store.commit('footerShow', this.footer)
          return
        }
        if (this.footer) {
          this.footer = false
          this.$store.commit('footerShow', this.footer)
        }
      },
      shareMsg () {
        this.$wechat.ready(() => {
          const id = this.$route.query.id
          const url = location.origin + '/?' + 'agentid=' + this.$store.state.userDefault.agentId + '&share_url=' + this.handUrl(location.hash) + '?'
          this.$wechat.onMenuShareTimeline({
            title: `${this.content.title}`, // 分享标题
            link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: `${this.content.img}`, // 分享图标
            success: async function () {
              await api.get('/Users/Article/ArticleShare', {id: id})
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
          })
          this.$wechat.onMenuShareAppMessage({
            title: `${this.content.title}`, // 分享标题
            link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: `${this.content.img}`, // 分享图标
            desc: `${this.content.desc}`, // 分享描述
            success: async function () {
              await api.get('/Users/Article/ArticleShare', {id: id})
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
          })
        })
      }
    },
    mounted () {
      this.$nextTick(() => {
        document.addEventListener('scroll', this.footerScroll)
      })
    }
  }
</script>

<style lang="less">
.article-wrap{
  background: #fff;
  padding: 0.5rem 0.3rem;
  .article-title{
    font-size: 0.48rem;
    color: #2d2d2d;
    line-height: 0.6rem;
  }
  .article-msg{
    display: flex;
    margin-top: 0.32rem;
    font-size: 0.3rem;
    .msg{
      color: #888888;
      margin-right: 0.3rem;
    }
    .author{
      color: #38a9ee;
    }
  }
  .main{
    margin-top: 0.48rem;
    p{
      font-size: 0.32rem;
      line-height: 0.44rem;
    }
    img, video{
      max-width: 100% !important;
    }
    strong{
      font-weight: bold;
    }
    h1,h2,h3,h4,h5,h6{
      font-weight: bold;
    }
  }
  .article-tip{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.8rem;
    color: #2d2d2d;
    font-size: 0.3rem;
    margin-bottom: 0.6rem;
    .read{
      justify-content: flex-start;
    }
    .good{
      color: #ccc;
      .fa-thumbs-up{
        font-size: 0.36rem;
        vertical-align: middle;
      }
      &.active{
        color: rgb(240, 86, 84);
      }
      .VueStar{
        position: relative;
        display: inline-block;
        vertical-align: middle;
        .VueStar__ground{
          width: 100px;
          height: 20px;
          margin-right: -41px;
          img{
            width: 20px;
          }
        }
        .VueStar__decoration{
          left: 0;
          top: -35px;
          width: 80px;
          height: 80px;
        }
      }
      .text{
        vertical-align: middle;
        color: #2d2d2d;
      }
    }
  }
}
.share-wrap{
  background: #fff;
  padding: 0 0.3rem 0.6rem;
  .share-title{
    position: relative;
    color: #323232;
    font-size: 0.26rem;
    text-align: center;
    &:after{
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      background: #e7e7e7;
      left: 0;
      top: 0.29rem;
    }
    .title{
      position: relative;
      padding: 0 0.2rem;
      z-index: 2;
      height: 0.6rem;
      line-height: 0.6rem;
      background: #fff;
    }
  }
  .share-item{
    margin-top: 0.4rem;
    text-align: center;
    .share{
      display: inline-block;
      padding: 0 0.3rem;
      img{
        height: 0.63rem;
        margin-bottom: 0.18rem;
      }
      .title{
        color: #323232;
        font-size: 0.26rem;
      }
    }
  }
}
.article-list{
  .list-item-wrap{
    border-bottom: 1px solid #efefef;
    &:last-child{
      border: none;
      padding-bottom: 0;
    }
  }
  .list-item{
    display: flex;
    padding: 0.2rem 0;
    .item-pic{
      width: 1.8rem;
      height: 1.2rem;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .item-content{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      margin-left: 0.28rem;
      .title{
        color: #2d2d2d;
        font-size: 0.3rem;
        line-height: 0.4rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .msg{
        color: #888888;
        font-size: 0.24rem;
        .time{
          margin-right: 0.3rem;
        }
      }
    }
  }
}
.article-foot{
  background: #fff;
  padding: 0.44rem 0.3rem 0.54rem;
  margin-top: 0.16rem;
  .nav{
    color: #2d2d2d;
    font-size: 0;
    text-align: center;
    margin-bottom: 0.56rem;
    .nav-item{
      color: #2d2d2d;
      padding: 0 0.35rem;
      font-size: 0.3rem;
      display: inline-block;
      border-right: 1px solid #2d2d2d;
      &:last-child{
        border: none;
      }
    }
  }
  .company{
    text-align: center;
    color: #888888;
    font-size: 0.26rem;
    .item{
      margin-bottom: 0.16rem;
      .address-icon{
        display: inline-block;
        width: 0.17rem;
        height: 0.27rem;
        vertical-align: middle;
        background: url('../../assets/images/icon/address-icon.png') no-repeat center center;
        background-size: contain;
      }
    }
  }
}
.float-menu{
  position: fixed;
  bottom: 0.1rem;
  right: 0.2rem;
  width: 1rem;
  height: 1rem;
  background: url('../../assets/images/icon/float-menu.png') no-repeat center center;
  background-size: contain;
}
.mask{
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .5);
  .mask-content{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    background-color: #ffffff;
    padding: 0.65rem 0.8rem 0.85rem;
    text-align: center;
    .qrcode{
      width: 3.7rem;
      height: 3.7rem;
    }
    .mask-title{
      color: #2d2d2d;
      font-size: 0.26rem;
      margin-bottom: 0.2rem;
      strong{
        font-weight: 700;
      }
    }
    .line{
      position: absolute;
      bottom: -1rem;
      left: 50%;
      width: 1px;
      height: 1rem;
      background: #fff;
    }
    .close-mask{
      position: absolute;
      bottom: -1.75rem;
      left: 50%;
      transform: translateX(-50%);
      width: 0.75rem;
      height: 0.75rem;
      background: #fff;
      border-radius: 50%;
      text-align: center;
      line-height: 0.75rem;
    }
  }
}
</style>
