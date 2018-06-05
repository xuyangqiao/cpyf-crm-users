<template>
  <div>
    <div class="top">
      <div class="message">
        <div class="avatar">
          <img :src="doctor.avatar" class="avatar-img">
        </div>
        <div class="name">{{doctor.name}} &nbsp;&nbsp; {{doctor.school}}</div>
        <div class="text">川派医生集团成都五洲诊疗基地</div>
      </div>
    </div>
    <div class="banner"></div>

    <div class="pennant-list">
      <div class="pennant-item" v-for="item in bannerList" :key="item.id">
        <div class="icon-wrap">
          <img :src="item.img_list" class="icon-img">
        </div>
        <div class="pennant-content">
          <div class="title">{{item.title}}  <span class="desc">（{{item.send_count}}）</span></div>
          <div class="text">真情寄语：“{{item.desc}}”</div>
          <router-link :to="{path: '/create', query:{id: item.id, doctor_id: doctor.id}}" tag="div" class="btn">
            <span class="icon"></span>
            <span class="btn-text">我也要送</span>
          </router-link>
        </div>
      </div>
    </div>

    <div class="footer-banner"></div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data () {
    return {
      bannerList: [],
      doctor: ''
    }
  },
  created () {
    this.$store.commit('footerShow', false)
    this.getList()
  },
  methods: {
    async getList () {
      const {data: {code, data}} = await api.get('/Banner/Sendbanner/bannerList', {doctor_id: this.$route.query.id})
      if (code === 200) {
        this.bannerList = data.bannerList
        this.doctor = data.doctorDetail
        this.shareMsg()
      }
    },
    shareMsg () {
      this.$wechat.ready(() => {
        this.wechatShare({
          title: `我给${this.doctor.name}医生送锦旗`,
          link: this.handUrl(location.hash),
          img: this.doctor.avatar,
          desc: '电子锦旗免费送，每人可送1面锦旗哦~'
        })
      })
    }
  }
}
</script>

<style lang='less'>
.top {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4rem;
  background: url('./../../assets/images/pannant-bg.png') no-repeat center top;
  background-size: contain;
  background-color: #fff;
  text-align: center;
  .message{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .avatar{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.73rem;
    height: 1.73rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, .4);
    .avatar-img{
      width: 1.48rem;
      height: 1.48rem;
      border-radius: 50%;
      border: 2px solid #fff;
    }
  }
  .name{
    font-size: 0.32rem;
    font-weight: 700;
    margin: 0.29rem 0;
  }
  .text{
    font-size: 0.26rem;
  }
}
.banner{
  height: 2.22rem;
  background: url('./../../assets/images/pennant-banner.png') no-repeat center center;
  background-size: contain;
}
.pennant-list{
  margin-top: 0.2rem;
  .pennant-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0.2rem 0.4rem;
    margin-bottom: 0.1rem;
    .icon-wrap{
      width: 2.12rem;
      height: 1.93rem;
      .icon-img{
        width: 100%;
        height: 100%;
      }
    }
    .pennant-content{
      margin-left: 0.3rem;
      flex: 1;
      .title{
        display: flex;
        align-items: flex-end;
        font-weight: 700;
        color: #000000;
        font-size: 0.36rem;
        .desc{
          color: #ff0000;
          font-size: 0.24rem;
        }
      }
      .text{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        color: #aaaaaa;
        font-size: 0.26rem;
        margin: 0.1rem 0 0.18rem;
        line-height: 0.34rem;
      }
      .btn{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.78rem;
        height: 0.6rem;
        border-radius: 6px;
        border: 1px solid #189f17;
        .icon{
          width: 0.62rem;
          height: 0.4rem;
          margin-right: 0.1rem;
          background: url('../../assets/images/send-icon.png') no-repeat center center;
          background-size: contain;
        }
        .btn-text{
          color: #1aad19;
          font-size: 0.26rem;
        }
      }
    }
  }
}
.footer-banner{
  height: 2.06rem;
  background: url('../../assets/images/pennant-footer-banner.png') no-repeat center;
  background-size: cover;
}
</style>
