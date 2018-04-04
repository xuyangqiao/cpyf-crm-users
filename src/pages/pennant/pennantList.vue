<template>
  <div class='page'>
    <div class="top">
      <div class="message">
        <div class="avatar">
          <img src="../../assets/images/default-avatar.png" class="avatar-img">
        </div>
        <div class="name">宋其良 &nbsp;&nbsp; 主任医师</div>
        <div class="text">川派医生集团成都五洲诊疗基地</div>
      </div>
    </div>
    <div class="banner"></div>

    <div class="pennant-list">
      <div class="pennant-item">
        <div class="icon-wrap">
          <img src="../../assets/images/pennant-icon-1.png" class="icon-img">
        </div>
        <div class="pennant-content">
          <div class="title">军医圣手  <span class="desc">（12）</span></div>
          <div class="text">真情寄语：“本由军中三甲来， 亮剑一挥斩病魔”，军魂犹在！</div>
          <router-link :to="{path: '/create', query:{id: 1}}" tag="div" class="btn">
            <span class="icon"></span>
            <span class="btn-text">我也要送</span>
          </router-link>
        </div>
      </div>

      <div class="pennant-item">
        <div class="icon-wrap">
          <img src="../../assets/images/pennant-icon-2.png" class="icon-img">
        </div>
        <div class="pennant-content">
          <div class="title">杏林清流  <span class="desc">（12）</span></div>
          <div class="text">真情寄语：“尊民敬民真心为民，医德医术皆为一流。”何谓清流？此为清流！</div>
          <div class="btn">
            <span class="icon"></span>
            <span class="btn-text">我也要送</span>
          </div>
        </div>
      </div>

      <div class="pennant-item">
        <div class="icon-wrap">
          <img src="../../assets/images/pennant-icon-3.png" class="icon-img">
        </div>
        <div class="pennant-content">
          <div class="title">仁心仁术  <span class="desc">（12）</span></div>
          <div class="text">真情寄语：“良医有情解病，神术无声除疾。”大爱无疆，热心为民！</div>
          <div class="btn">
            <span class="icon"></span>
            <span class="btn-text">我也要送</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-banner"></div>
  </div>
</template>

<script>
// import api from '@/api'

export default {
  data () {
    return {}
  },
  created () {
    this.$store.commit('footerShow', false)
  },
  methods: {}
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
