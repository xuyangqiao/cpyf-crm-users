<template>
  <div class="container" v-infinite-scroll="fetchData" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
    <div class="top-bar">
      <div class="top-left">
        <span class="title-item">好友：{{friendCount}}人</span>
        <span class="title-item">推荐：{{shareCount}}人</span>
      </div>
      <div class="top-right" @click='checkType'>{{friendMsg}} <x-icon type="ios-arrow-down" size="20"></x-icon></div>
    </div>
    <div class="friend-list">
      <div class="friend-item" v-for="(item, index) in list" :key='item.id'>
        <div class="avatar">
          <img :src="item.avatar || item.edit_avatar">
        </div>
        <div class="friend-content">
          <div class="name-line">
            <span class="name">{{item.truename || item.wechat_name}}</span>
            <span class="up">推荐{{item.shareid_count}}人</span>
          </div>
          <div class="time-line">{{item.create_time}}</div>
        </div>
        <div class="friend-btn">
          <div class="attention" v-if="item.concern === 0" @click='concern(item.id, index)'>+ 关注</div>
          <div class="attention active" v-else @click='cancel(item.id, index)'>已关注</div>
        </div>
      </div>
    </div>
    <div v-if="list.length > 0">
      <load-more v-if="isLoading" :show-loading="true" tip='正在加载' background-color="#e7e7e7"></load-more>
      <load-more v-if="!isLoading" :show-loading="false" tip='暂无更多数据' background-color="#e7e7e7"></load-more>
    </div>
    <div class="no-friend" v-if="list.length <= 0">
      <img src="../../assets/images/no-friend.png">
      <p class="title">{{nofriendMsg}}</p>
    </div>
  </div>
</template>

<script>
import { LoadMore } from 'vux'
import api from '@/api'

export default {
  components: {
    LoadMore
  },
  data () {
    return {
      friendType: true,
      busy: true,
      page: 0,
      isLoading: false,
      list: [],
      friendCount: '',
      shareCount: ''
    }
  },
  computed: {
    nextPage () {
      return {
        page: this.page + 1
      }
    },
    friendMsg () {
      if (this.friendType) {
        return '全部好友'
      } else {
        return '关注好友'
      }
    },
    nofriendMsg () {
      if (this.friendType) {
        return '您暂时还没有关联好友哦~'
      } else {
        return '您暂时还没有已关注好友哦~'
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.busy = true   // 禁止加载，防止重复请求
      this.isLoading = true  // 开始加载动画
      let option = this.nextPage
      if (!this.friendType) {
        option = Object.assign(this.nextPage, {concern: 1})
      }
      const {data: {code, data}} = await api.get('/Index/Sharelist/lists', option)
      if (code === 200) {
        this.page ++
        this.friendCount = data.friend_count
        this.shareCount = data.share_count_all
        this.list = this.list.concat(data.list)
        if (data.list.length < 20) {
          this.isLoading = false
          return
        }
        this.busy = false
      }
    },
    checkType () {
      this.friendType = !this.friendType
      this.busy = false
      this.list = []
      this.page = 0
      this.fetchData()
    },
    async concern (id, index) {
      const {data: {code}} = await api.get('/Index/Sharelist/concern', {id: id})
      if (code === 200) {
        this.list[index].concern = 1
        this.toast('关注成功')
      }
    },
    async cancel (id, index) {
      const {data: {code}} = await api.get('/Index/Sharelist/ConcernDel', {id: id})
      if (code === 200) {
        this.list[index].concern = 0
        this.toast('取消关注成功')
      }
    }
  }
}
</script>

<style lang="less">
  .top-bar{
    display: flex;
    height: 0.72rem;
    background: #fff;
    line-height: 0.72rem;
    font-size: 0.22rem;
    color: #393939;
    padding: 0 0.3rem;
    border-bottom: 1px solid #e5e5e5;
    .top-left{
      flex: 1;
    }
    .top-right{
      font-size: 0.26rem;
      display: flex;
      align-items: center;
    }
    .title-item{
      margin-right: 0.4rem;
    }
  }
  .friend-list{
    background: #fff;
    .friend-item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.2rem 0.3rem;
      border-bottom: 1px solid #e5e5e5;
      .avatar{
        width: 0.88rem;
        height: 0.88rem;
        border-radius: 50%;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .friend-content{
        flex: 1;
        margin-left: 0.2rem;
        font-size: 0.32rem;
        color: #393939;
        .name-line{
          margin-bottom: 0.14rem;
          .name{
            display: inline-block;
            min-width: 5em;
          }
        }
        .time-line{
          color: #a3a3a3;
          font-size: 0.2rem;
        }
        .up{
          font-size: 0.26rem;
          margin-left: 0.6rem;
        }
      }
    }
    .friend-btn{
      .attention{
        width: 1.2rem;
        height: 0.46rem;
        border-radius: 4px;
        background-color: #09bb07;
        color: #fff;
        text-align: center;
        line-height: 0.46rem;
        font-size: 0.26rem;
        border: 1px solid #09bb07;
        &.active{
          background: none;
          border-color: #393939;
          color: #393939;
        }
      }
    }
  }
  .no-friend{
    margin-top: 3.78rem;
    text-align: center;
    .title{
      color: #393939;
      font-size: 0.26rem;
      margin-top: 0.3rem;
    }
  }
</style>
