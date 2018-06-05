<template>
  <div v-infinite-scroll="fetchData" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
    <div class="type-wrap">
      <tab :line-width='0'>
        <tab-item selected @on-item-click="typeClick(1)">待就诊</tab-item>
        <tab-item @on-item-click="typeClick(2)">已完成</tab-item>
      </tab>
    </div>

    <div class="record-section">
      <div class="record-item" v-for="(item, index) in recordList">
        <div class="record-top vux-1px-b">
          <h2 class="name">{{item.doctor_name}}</h2>
          <span class="title">{{item.title_title}}</span>
          <span class="type red" v-if="item.reserve_status === '1'">待受理</span>
          <span class="type" v-else-if="item.reserve_status === '2'">待就诊</span>
          <span class="type" v-else-if="item.reserve_status === '3'">已就诊</span>
          <span class="type" v-else-if="item.reserve_status === '4'">无效</span>
          <span class="type" v-else-if="item.reserve_status === '5'">已取消</span>
          <span class="type" v-else>未就诊</span>
        </div>
        <div class="record-content">
          <div class="content-main">
            <div class="msg-wrap">
              <h2 class="name">{{item.name}}</h2>
              <div class="time">
                <span>{{item.reserve_time}}</span>
                <span class="time-icon" v-if="item.reserve_type === '1'">上午</span>
                <span class="time-icon" v-else>下午</span>
                <span v-if="item.reserve_type === '1'">8:30 - 10:00</span>
                <span v-else>13:00 - 15:00</span>
              </div>
            </div>
            <div class="cancel" v-if="parseInt(item.reserve_status) < 3" @click='cancel(item.id)'>取消</div>
          </div>
          <div class="content-hide" v-show="activeIndex === index">
            <h2 class="question">{{item.desc}}</h2>
            <div class="pic-wrap" v-if="item.reserve_img.length > 0">
              <img :src="pic" v-for="(pic, num) in item.reserve_img" @click='showPic(item.reserve_img, num)'>
            </div>
          </div>
          <div class="arrow-icon" :class='{active: activeIndex === index}' @click.stop='contentShow(index)'>
            <x-icon type="ios-arrow-down" size="20"></x-icon>
          </div>
        </div>
      </div>
    </div>

    <div>
      <load-more v-if="isLoading" :show-loading="true" tip='正在加载' background-color="#f0f0f0"></load-more>
      <load-more v-if="!isLoading" :show-loading="false" tip='暂无更多数据' background-color="#f0f0f0"></load-more>
    </div>

    <div v-transfer-dom>
      <confirm v-model="cancelShow"
      title="确认取消预约吗？"
      @on-confirm="sureCancel">
        <p style="text-align:center">取消后可能会耽误您的就诊！</p>
        <p style="text-align:center">如需修改预约信息，可联系：</p>
        <h2 class="red" style="font-size: 0.34rem;">18113022015</h2>
      </confirm>
    </div>
  </div>
</template>

<script>
  import { Tab, TabItem, Confirm, TransferDomDirective as TransferDom, LoadMore } from 'vux'
  import api from '@/api'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Tab,
      TabItem,
      Confirm,
      LoadMore
      // attentionTip
    },
    data () {
      return {
        busy: true,
        page: 0,
        isLoading: false,
        activeIndex: -1,
        cancelShow: false,
        type: 1,
        recordList: [],
        cancelId: ''
      }
    },
    created () {
      this.fetchData()
    },
    computed: {
      userDefault () {
        return this.$store.state.userDefault
      },
      nextPage () {
        return {
          page: this.page + 1
        }
      }
    },
    methods: {
      typeClick (flag) {
        if (this.type === flag) {
          return
        }
        this.page = 0
        this.type = flag
        this.activeIndex = -1
        this.recordList = []
        this.fetchData()
      },
      contentShow (index) {
        this.activeIndex = this.activeIndex === index ? -1 : index
      },
      cancel (id) {
        this.cancelId = id
        this.cancelShow = true
      },
      async sureCancel () {
        const {data: {code}} = await api.get('/Users/Reserve/ReserveDel', {id: this.cancelId})
        if (code === 200) {
          this.toast('取消成功')
          for (let i = 0; i < this.recordList.length; i++) {
            if (this.recordList[i].id === this.cancelId) {
              this.recordList.splice(i, 1)
              return
            }
          }
        }
      },
      async fetchData () {
        let option = this.nextPage
        if (this.type === 2) {
          option = Object.assign(option, {status: 3})
        }
        this.busy = true   // 禁止加载，防止重复请求
        this.isLoading = true  // 开始加载动画
        const {data: {code, data}} = await api.get('/Users/Reserve/ReserveList', option)
        if (code === 200 && data) {
          this.page ++
          this.recordList = this.recordList.concat(data)
          if (data.length < 20) {
            this.isLoading = false
            return
          }
          this.busy = false
        }
      },

      // 预览图片
      showPic (list, index) {
        this.$wechat.previewImage({
          current: list[index],
          urls: list
        })
      }
    },
    mounted () {
      this.$wechat.ready(() => {
        this.wechatShare({
          title: this.userDefault.truename + '推荐您在线预约疼痛专家啦！',
          link: '/',
          img: 'http://m.qpic.cn/psb?/V11P0IcO3nwu6m/0iy19ozUJOnxFpSC*edLkx6yh1M7jO6WQq5uscPCnfs!/b/dEEBAAAAAAAA&bo=sQCxAAAAAAADFzI!&rf=viewer_4&t=5',
          desc: '川派疼痛医生集团，专治头颈肩腰腿痛！'
        })
      })
    }
  }
</script>

<style lang="less">
  .record-section{
    padding: 0.08rem;
    .record-item{
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 0.1rem;
      background: #fff;
      .record-top{
        display: flex;
        align-items: center;
        height: 0.68rem;
        line-height: 0.68rem;
        padding: 0 0.24rem;
        .name{
          color: #2d2d2d;
          font-size: 0.36rem;
          margin-right: 0.47rem;
        }
        .title{
          color: #3f3f3f;
          font-size: 0.26rem;
          flex: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .type{
          color: #3f3f3f;
          font-size: 0.26rem;
          &.red{
            color: #ff0000;
          }
        }
      }
      .record-content{
        position: relative;
        padding: 0.36rem 0.25rem 0.1rem;
      }
      .content-main{
        display: flex;
        align-items: center;
        padding-bottom: 0.28rem;
        .msg-wrap{
          flex: 1;
        }
        .name{
          color: #3f3f3f;
          font-size: 0.3rem;
        }
        .time{
          font-size: 0.24rem;
          margin-top: 0.09rem;
          height: 0.4rem;
          line-height: 0.4rem;
          .time-icon{
            width: .64rem;
            height: .37rem;
            padding: 0 2px;
            border-radius: 3px;
            border: 1px solid #09bb07;
            color: #09bb07;
          }
        }
        .cancel{
          width: 1.66rem;
          height: 0.7rem;
          border-radius: 4px;
          border: 1px solid #09bb07;
          font-size: 0.32rem;
          color: #09bb07;
          text-align: center;
          line-height: 0.7rem;
        }
      }
      .content-hide{
        padding: 0.17rem 0;
        border-top: 1px dashed #e5e5e5;
        .question{
          font-size: 0.3rem;
          line-height: 0.45rem;
          color: #3f3f3f;
        }
        .pic-wrap{
          margin-top: 0.32rem;
          img{
            display: inline-block;
            width: 1.56rem;
            height: 1.56rem;
            margin-right: 0.05rem;
            vertical-align: middle;
          }
        }
      }
      .arrow-icon{
        text-align: center;
        line-height: 0.3rem;
        .vux-x-icon{
          transition: all linear .2s;
        }
        &.active{
          .vux-x-icon{
            transform: rotate(180deg);
          }
        }
      }
    }
  }
</style>
