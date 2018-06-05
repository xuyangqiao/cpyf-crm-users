<template>
  <div class="container" v-infinite-scroll="fetchData" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
    <div class="doctor-header">
      <tab custom-bar-width='0'>
        <tab-item selected @on-item-click="onItemClick(1)">专家团队</tab-item>
      </tab>
    </div>
    <div class="doctor-wrap">
      <router-link :to='{path: "doctor", query: {yid: item.id}}' class="doctor-item" v-for="(item, index) in list" :key='item.id'>
        <div class="avatar">
          <img :src="item.avatar">
        </div>
        <div class="content">
          <p class="name">{{item.name}}</p>
          <p class="title">{{item.title_title}}</p>
        </div>
        <x-icon type="ios-arrow-forward" size="20"></x-icon>
      </router-link>
    </div>

    <div>
      <load-more v-if="isLoading" :show-loading="true" tip='正在加载' background-color="#f0f0f0"></load-more>
      <load-more v-if="!isLoading" :show-loading="false" tip='暂无更多数据' background-color="#f0f0f0"></load-more>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, LoadMore } from 'vux'
import api from '@/api'

export default {
  components: {
    Tab,
    TabItem,
    LoadMore
  },
  data () {
    return {
      busy: true,
      page: 0,
      isLoading: false,
      list: []
    }
  },
  created () {
    this.fetchData()
  },
  computed: {
    nextPage () {
      return {
        page: this.page + 1
      }
    }
  },
  methods: {
    async fetchData () {
      this.busy = true   // 禁止加载，防止重复请求
      this.isLoading = true  // 开始加载动画
      const {data: {code, data}} = await api.get('/Users/Doctor/DoctorList', this.nextPage)
      if (code === 200) {
        this.page ++
        this.list = this.list.concat(data)
        this.$wechat.ready(() => {
          this.wechatShare({
            title: '川派医方馆疼痛专家可以在线预约啦！',
            link: this.handUrl(location.hash),
            img: 'http://m.qpic.cn/psb?/V11P0IcO3nwu6m/0iy19ozUJOnxFpSC*edLkx6yh1M7jO6WQq5uscPCnfs!/b/dEEBAAAAAAAA&bo=sQCxAAAAAAADFzI!&rf=viewer_4&t=5',
            desc: '川派医方馆，专治头颈肩腰四肢关节疼痛！'
          })
        })
        if (data.length < 20) {
          this.isLoading = false
          return
        }
        this.busy = false
      }
    }
  }
  // mounted () {
  //   this.$wechat.ready(() => {
  //     this.wechatShare({
  //       title: '川派疼痛专家号源紧张，赶紧预约！',
  //       link: this.handUrl(location.hash),
  //       img: 'http://m.qpic.cn/psb?/V11P0IcO3nwu6m/0iy19ozUJOnxFpSC*edLkx6yh1M7jO6WQq5uscPCnfs!/b/dEEBAAAAAAAA&bo=sQCxAAAAAAADFzI!&rf=viewer_4&t=5',
  //       desc: '川派疼痛医生集团，专治头颈肩腰腿痛！'
  //     })
  //   })
  // }
}
</script>

<style lang="less" scoped>
  .doctor-item{
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0.2rem 0.3rem;
    border-bottom: 1px solid #e7e7e7;
    &:last-child{
      border: none;
    }
    .avatar{
      width: 0.88rem;
      height: 0.88rem;
      border-radius: 50%;
      margin-right: 0.2rem;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .content{
      flex: 1;
      .name{
        color: #393939;
        font-size: 0.32rem;
      }
      .title{
        margin-top: 0.1rem;
        color: #a3a3a3;
        font-size: 0.24rem;
      }
    }
  }
  .doctor-header{
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
        display: none;
      }
    }
  }
</style>
