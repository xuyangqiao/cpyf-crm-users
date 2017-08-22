<template>
  <div class="container">
    <div class="header-nav">
      <div class="nav-item" @click="checkList()" :class="{active: categoryId === ''}">推荐</div>
      <div class="nav-item" v-for="(item, index) in categoryList" @click="checkList(item.id)" :class="{active: categoryId === item.id}">{{item.title}}</div>
    </div>

    <div class="list-content">
      <div class="subject" v-if="SpecialList">
        <router-link :to='{path: "/find/topic", query: {tid: SpecialList.id}}' v-if="SpecialList.type === '2'">
          <span class="float-icon"></span>
          <img :src="SpecialList.img3">
        </router-link>
        <a :href="SpecialList.url" v-else>
          <span class="float-icon"></span>
          <img :src="SpecialList.img3">
        </a>
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
    <div class="more-load" v-if="fetchIng === 'canLoad'" @click='fetchData'>点击加载更多</div>
    <div class="more-load" v-else-if="fetchIng === 'loading'">正在加载</div>
    <div class="more-load" v-else>没有更多了</div> 
  </div>
</template>

<script>
  import api from '@/api'

  export default {
    data () {
      return {
        page: 0,
        categoryId: '',
        categoryList: [],
        articleList: [],
        fetchIng: 'canLoad',
        SpecialList: ''
      }
    },
    computed: {
      nextPage () {
        return {
          page: this.page + 1
        }
      }
    },
    async created () {
      if (this.$route.query.cid) {
        this.categoryId = this.$route.query.cid
      }
      const {data: {code, data}} = await api.get('/Users/Article/CategoryList')
      if (code === 200) {
        this.categoryList = data
      }
      this.fetchData()
    },
    methods: {
      async fetchData () {
        this.fetchIng = 'loading'
        const option = Object.assign({category_id: this.categoryId}, this.nextPage)
        const {data: {code, data, SpecialList}} = await api.get('/Users/Article/ArticleList', option)
        if (code === 200) {
          this.page ++
          this.SpecialList = SpecialList
          this.articleList = this.articleList.concat(data)
          if (data.length < 20) {
            this.fetchIng = 'nomore'
          } else {
            this.fetchIng = 'canLoad'
          }
        }
      },
      checkList (id = '') {
        if (id === this.categoryId) {
          return
        }
        this.categoryId = id
        this.page = 0
        this.fetchIng = 'canLoad'
        this.articleList = []
        this.SpecialList = ''
        this.fetchData()
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

<style lang="less" scoped>
  .header-nav{
    height: 0.8rem;
    line-height: 0.8rem;
    padding: 0 0.3rem;
    overflow-x: auto;
    background: #fff;
    font-size: 0;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    .nav-item{
      position: relative;
      display: inline-block;
      vertical-align: middle;
      color: #3b3b3b;
      font-size: 0.3rem;
      padding: 0 0.25rem;
      &.active:after{
        content: "";
        position: absolute;
        width: 60%;
        height: 2px;
        background: #3b3b3b;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .list-content{
    margin-top: 0.16rem;
    padding: 0.3rem;
    background: #fff;
    .subject{
      position: relative;
      width: 6.9rem;
      height: 3.65rem;
      overflow: hidden;
      margin-bottom: 0.2rem;
      img{
        width: 100%;
        height: 100%;
      }
      .float-icon{
        position: absolute;
        right: 0;
        height: 1.2rem;
        width: 1.2rem;
        background: url('../../assets/images/icon/big-subject.png') no-repeat center center;
        background-size: contain;
      }
    }
  }
  .more-load{
    margin-top: 1px;
    background: #fff;
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
    color: #3b3b3b;
    font-size: 0.24rem;
  }
</style>
