<template>
  <div class="container" v-if="flag">
    <div class="header">
      <swiper :list="swiperList" :show-desc-mask="false" dots-class="swiper-dots" :auto="true" :loop="true" height="2.4rem" dots-position="center"></swiper>
    </div>
  
    <!-- <div class="nav-wrap">
        <div class="nav-item" v-for="i in 5">
          <img src="../../assets/images/icon/find-item.png" class="nav-img">
          <p class="title">活动资讯</p>
        </div>
      </div> -->
  
    <div class="article-item no-top">
      <div class="article-title">
        <span class="title">推荐</span>
        <router-link :to="{path: '/find/list'}" class="more-icon">
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </router-link>
      </div>
      <div class="article-list">
        <div v-for="(item, index) in articleList" :key="item.id" class="list-item-wrap">
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
  
    <div class="article-item">
      <div class="article-title">
        <span class="title">专题</span>
        <router-link :to="{path: '/find/subject'}" class="more-icon">
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </router-link>
      </div>
  
      <div class="article-wrap">
        <div class="article-pic" v-for="(item, index) in subjectList">
          <router-link :to='{path: "/find/topic", query: {tid: item.id}}' v-if="item.type === '2'">
            <img :src="item.img2">
          </router-link>
          <a :href="item.url" v-else>
            <img :src="item.img2">
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper } from 'vux'
import api from '@/api'
export default {
  components: {
    Swiper
  },
  data () {
    return {
      swiperList: [
        // {
        //   url: 'javascript:',
        //   img: 'https://static.vux.li/demo/1.jpg'
        // }, {
        //   url: 'javascript:',
        //   img: 'https://static.vux.li/demo/2.jpg'
        // }, {
        //   url: 'javascript:',
        //   img: 'https://static.vux.li/demo/3.jpg'
        // }
      ],
      page: 0,
      fetchIng: 'canLoad',
      articleList: [],
      flag: false,
      subjectList: []
    }
  },
  computed: {
    nextPage () {
      return {
        page: this.page + 1
      }
    }
  },
  created () {
    this.fetchData()
    this.fetchSubject()
  },
  methods: {
    async fetchData () {
      this.fetchIng = 'loading'
      const { data: { code, data } } = await api.get('/Users/Article/index', this.nextPage)
      if (code === 200) {
        this.page++
        this.swiperList = data.BannerList
        this.articleList = this.articleList.concat(data.ArticleList)
        if (data.ArticleList.length < 20) {
          this.fetchIng = 'nomore'
        } else {
          this.fetchIng = 'canLoad'
        }
        this.flag = true
      }
    },
    async fetchSubject () {
      const {data: {code, data}} = await api.get('/Users/Article/SpecialIndex')
      if (code === 200) {
        this.subjectList = data
      }
    }
  },
  mounted () {
    this.$wechat.ready(() => {
      this.wechatShare({
        title: `${this.$store.state.userDefault.truename}推荐您预约川派医方馆疼痛专家`,
        link: this.handUrl(location.hash),
        img: 'http://qpic.cn/6oICaLv7r',
        desc: '川派医方馆，专治头颈肩腰四肢关节疼痛！'
      })
    })
  }
}
</script>

<style lang="less">
.vux-slider>.vux-indicator.swiper-dots>a>.vux-icon-dot {
  width: 10px;
  height: 10px;
  border-radius: 10px;
}

.vux-slider>.vux-indicator.swiper-dots {
  bottom: -10px;
}

.nav-wrap {
  background: #fff;
  padding: 0.34rem 0 0.12rem 0;
  font-size: 0;
  .nav-item {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    width: 20%;
    margin-bottom: 0.22rem;
    .nav-img {
      height: 0.55rem;
      margin-bottom: 0.16rem;
    }
    .title {
      color: #3b3b3b;
      font-size: 0.24rem;
    }
  }
}

.more-load {
  margin-top: 1px;
  background: #fff;
  height: 0.6rem;
  line-height: 0.6rem;
  text-align: center;
  color: #3b3b3b;
  font-size: 0.24rem;
}
</style>
