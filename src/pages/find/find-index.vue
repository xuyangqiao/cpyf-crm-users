<template>
  <div class="container" v-if="flag">
    <div class="header">
      <swiper :list="swiperList" :show-desc-mask="false" dots-class="swiper-dots" :auto="true" :loop="true" height="2.4rem" dots-position="center"></swiper>
    </div>
  
    <div class="nav-wrap">
      <router-link :to="{path: '/find/list', query: {cid: item.id}}" class="nav-item" tag="div" v-for="(item, index) in ArticleCategory" :key="item.id">
        <img :src="item.img" class="nav-img">
        <p class="title">{{item.title}}</p>
      </router-link>
    </div>
  
    <div class="article-item">
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

    <div class="article-item" v-for="(item, index) in ArticleCategory" v-if="item.category_article.length > 0" :key="item.id">
      <div class="article-title">
        <span class="title">{{item.title}}</span>
        <router-link :to="{path: '/find/list', query: {cid: item.id}}" class="more-icon">
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </router-link>
      </div>
      <div class="article-list">
        <div v-for="(article, index) in item.category_article" :key="article.id" class="list-item-wrap">
          <router-link :to="{path: '/find/list/article', query: {id: article.id}}" class="list-item" v-if="!article.url">
            <div class="item-pic">
              <img :src="article.img">
            </div>
            <div class="item-content">
              <h2 class="title">{{article.title}}</h2>
              <p class="msg">
                <span class="time">{{article.create_time}}</span>
                <span class="worker">{{article.author}}</span>
              </p>
            </div>
          </router-link>
          <a :href="article.url" class="list-item" :key="article.id" v-else>
            <div class="item-pic">
              <img :src="article.img">
            </div>
            <div class="item-content">
              <h2 class="title">{{article.title}}</h2>
              <p class="msg">
                <span class="time">{{article.create_time}}</span>
                <span class="worker">{{article.author}}</span>
              </p>
            </div>
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
      ArticleCategory: [],
      flag: false,
      subjectList: []
    }
  },
  created () {
    this.fetchData()
    this.fetchSubject()
  },
  methods: {
    async fetchData () {
      this.fetchIng = 'loading'
      const { data: { code, data } } = await api.get('/Users/Article/index')
      if (code === 200) {
        this.swiperList = data.BannerList
        this.articleList = this.articleList.concat(data.ArticleList)
        this.ArticleCategory = data.ArticleCategory
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
        title: '川派医方馆精彩内容推荐！',
        link: this.handUrl(location.hash),
        img: 'http://b385.photo.store.qq.com/psb?/V11P0IcO3nwu6m/UEt*RxnRmtsQIMYLCds4YdTeGWa58xXbRYb6vWz0fiA!/b/dIEBAAAAAAAA&bo=ZABkAAAAAAADACU!&rf=viewer_4&t=5',
        desc: '川派活动、川派风采、疼痛科普、川派中医……'
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
      height: 0.7rem;
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
