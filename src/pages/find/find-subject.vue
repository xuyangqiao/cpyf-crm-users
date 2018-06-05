<template>
  <div class="container">
    <div class="subject-content">
      <div class="content-wrap" v-for="(item, index) in list" :key='item.id'>
        <router-link :to='{path: "/find/topic", query: {tid: item.id}}' tag="div" class="subject-item" v-if="item.type === '2'">
          <div class="subject-title">
            <span class="title">{{item.title}}</span>
            <span class="more-icon"><span>{{item.create_time}}</span><x-icon type="ios-arrow-right" size="20"></x-icon></span>
          </div>
          <div class="subject-img">
            <span class="float-icon"></span>
            <img :src="item.img3">
          </div>
        </router-link>
        <a :href='item.url' class="subject-item" v-else>
          <div class="subject-title">
            <span class="title">{{item.title}}</span>
            <span class="more-icon"><span>{{item.create_time}}</span><x-icon type="ios-arrow-right" size="20"></x-icon></span>
          </div>
          <div class="subject-img">
            <span class="float-icon"></span>
            <img :src="item.img3">
          </div>
        </a>
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
        fetchIng: 'canLoad',
        list: []
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
    },
    methods: {
      async fetchData () {
        this.fetchIng = 'loading'
        const {data: {code, data}} = await api.get('/Users/Article/special', this.nextPage)
        if (code === 200) {
          this.page ++
          this.list = this.list.concat(data)
          if (data.length < 20) {
            this.fetchIng = 'nomore'
          } else {
            this.fetchIng = 'canLoad'
          }
        }
      },
      shareMsg () {
        this.$wechat.ready(() => {
          this.wechatShare({
            title: `${this.$store.state.userDefault.truename}推荐您预约川派医方馆疼痛专家`,
            link: '/',
            img: 'http://m.qpic.cn/psb?/V11P0IcO3nwu6m/0iy19ozUJOnxFpSC*edLkx6yh1M7jO6WQq5uscPCnfs!/b/dEEBAAAAAAAA&bo=sQCxAAAAAAADFzI!&rf=viewer_4&t=5',
            desc: '川派医方馆，专治头颈肩腰四肢关节疼痛！'
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
  .subject-content{
    background: #fff;
    padding: 0.4rem 0.3rem;
    .content-wrap{
      padding-top: 0.2rem;
      border-bottom: 1px solid #efefef;
      &:last-child{
        border: none;
      }
    }
    .subject-title{
      display: flex;
      align-items: center;
      color: #2d2d2d;
      font-size: 0.3rem;
      height: 0.3rem;
      line-height: 0.3rem;
      margin-bottom: 0.2rem;
      .title{
        width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .more-icon{
        display: flex;
        flex: 1;
        align-items: center;
        text-align: right;
        justify-content: flex-end;
      }
    }
    .subject-img{
      position: relative;
      width: 6.9rem;
      height: 3.65rem;
      overflow: hidden;
      margin-bottom: 0.2rem;
      img{
        width: 100%;
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
