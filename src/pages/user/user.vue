<template>
  <div class="container" v-if="user">
    <attentionTip v-if="attentionShow"></attentionTip>
    <div class="user-top">
      <div class="avatar">
        <img :src="user.avatar">
        <span class="crown-icon"></span>
      </div>
      <router-link to='/edit' tag='div' class="content">
        <p class="name">{{user.name}}</p>
        <x-icon type="ios-arrow-right" size="18"></x-icon>
      </router-link>
      <div class="mobile">
        <span class="mobile-icon"></span>
        <span>{{user.mobile}}</span>
      </div>
    </div>

    <div class="menu">
      <div class="menu-group">
        <div @click='binLink' class="menu-item bindMobile">
          <div class="icon-wrap">
            <span class="menu-icon menu-mobile"></span>
          </div>
          <div class="item-content vux-1px-b">
            <h1 class="title">绑定手机号</h1>
            <div class="link">
              {{bindMsg}}
              <x-icon type="ios-arrow-right" size="20"></x-icon>
            </div>
          </div>
        </div>
        <router-link to='/clientmanage' tag='div' class="menu-item">
          <div class="icon-wrap">
            <span class="menu-icon menu-manage"></span>
          </div>
          <div class="item-content vux-1px-b">
            <h1 class="title">就诊人管理</h1>
            <div class="link">
              <x-icon type="ios-arrow-right" size="20"></x-icon>
            </div>
          </div>
        </router-link>
        <router-link to='/record' tag='div' class="menu-item">
          <div class="icon-wrap">
            <span class="menu-icon menu-recorde"></span>
          </div>
          <div class="item-content">
            <h1 class="title">我的预约记录</h1>
            <div class="link">
              <x-icon type="ios-arrow-right" size="20"></x-icon>
            </div>
          </div>
        </router-link>
      </div>

      <div class="menu-group">
        <!--<div class="menu-item">
          <div class="icon-wrap">
            <span class="menu-icon menu-help"></span>
          </div>
          <div class="item-content vux-1px-b">
            <h1 class="title">使用指南</h1>
            <div class="link">
              <x-icon type="ios-arrow-right" size="20"></x-icon>
            </div>
          </div>
        </div>-->
        <div v-if="userDefault.menu || userDefault.MenuList.login || userDefault.level < 5">
          <a :href="url.partnerUrl" class="menu-item">
            <div class="icon-wrap">
              <span class="menu-icon menu-partner"></span>
            </div>
            <div class="item-content vux-1px-b">
              <h1 class="title">加入我们</h1>
              <div class="link">
                <x-icon type="ios-arrow-right" size="20"></x-icon>
              </div>
            </div>
          </a>
        </div>
        <div v-if="userDefault.menu || userDefault.MenuList.poster || userDefault.level < 5">
          <a :href="url.posterUrl" class="menu-item">
            <div class="icon-wrap">
              <span class="menu-icon menu-poster"></span>
            </div>
            <div class="item-content vux-1px-b">
              <h1 class="title">活动推荐</h1>
              <div class="link">
                <x-icon type="ios-arrow-right" size="20"></x-icon>
              </div>
            </div>
          </a>
        </div>
        <div>
          <a href="http://www.chuanpaiyifang.com/about/" class="menu-item">
            <div class="icon-wrap">
              <span class="menu-icon menu-about"></span>
            </div>
            <div class="item-content">
              <h1 class="title">关于川派医方馆</h1>
              <div class="link">
                <x-icon type="ios-arrow-right" size="20"></x-icon>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <div class="windowMask" v-if="windowMask" v-show="windowMaskShow" @click='windowMaskShow = false'></div>
    <!--就诊人提示-->
    <!--<usertip v-show="!attentionShow" :tipShow='userDefault.count' :mobile='user.mobile'></usertip>-->
  </div>
</template>

<script>
import api from '@/api'
import usertip from '@/components/userTip.vue'
import attentionTip from '@/components/attentionTip.vue'
import {config} from '@/config'

export default {
  components: {
    usertip,
    attentionTip
  },
  data () {
    return {
      user: '',
      windowMaskShow: true
    }
  },
  computed: {
    url () {
      return config
    },
    userDefault () {
      return this.$store.state.userDefault
    },
    bindMsg () {
      if (this.user.mobile) {
        return '已绑定'
      } else {
        return '绑定后可查看预约信息'
      }
    },
    attentionShow () {
      // 如果没有就诊人 直接返回false 不提示关注公众号
      console.log(this.userDefault.count)
      if (this.$store.state.userDefault.count <= 0) {
        return false
      }
      if (this.userDefault.count > 0 && this.$store.state.userDefault.attention !== 0) {
        return false
      } else {
        return true
      }
    },
    windowMask () {
      if (this.userDefault.count <= 0) {
        return true
      }
      return false
    }
  },
  async created () {
    const {data: {code, data}} = await api.get('/Users/Mycenter/MyCenter')
    if (code === 200 && data) {
      this.user = data
    }
  },
  methods: {
    binLink () {
      if (this.user.mobile) {
        this.$router.push('/edit')
      } else {
        this.$router.push('/userbind')
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
  .user-top{
    width: 100%;
    height: 2.6rem;
    background: linear-gradient(to right, #35d036 , #09bc07);
    padding-top: 0.6rem;
    .avatar{
      position: relative;
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
      margin: 0 auto;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .crown-icon{
        position: absolute;
        width: 0.5rem;
        height: 0.5rem;
        background: url('../../assets/images/icon/crown-icon.png') no-repeat center center;
        background-size: contain;
        right: -0.05rem;
        bottom: -0.08rem;
      }
    }
    .content{
      text-align: center;
      position: relative;
      margin-top: 0.3rem;
      .name{
        color: #ffffff;
        font-size: 0.32rem;
        vertical-align: middle;
      }
      .vux-x-icon{
        position: absolute;
        top: 0;
        right: 2.78rem;
        fill: #fff;
      }
    }
    .mobile{
      text-align: center;
      margin-top: 0.24rem;
      color: #ffffff;
      font-size: 0.24rem;
      .mobile-icon{
        display: inline-block;
        width: 0.14rem;
        height: 0.21rem;
        background: url('../../assets/images/icon/phone-mobile.png') no-repeat center center;
        background-size: contain;
      }
    }
  }
  .menu{
    margin-top: 0.3rem;
    .menu-group{
      margin-bottom: 0.3rem;
    }
    .menu-item{
      display: flex;
      background: #fff;
      height: 0.88rem;
      line-height: 0.88rem;
      &.bindMobile{
        position: relative;
        z-index: 2000;
      }
      .icon-wrap{
        width: 0.88rem;
        height: 0.88rem;
        .menu-icon{
          width: 100%;
          height: 100%;
          display: inline-block;
          background: no-repeat center center;
        }
        .menu-mobile{
          background-image: url('./../../assets/images/icon/menu-mobile.png');
          background-size: 0.2rem;
        }
        .menu-manage{
          background-image: url('./../../assets/images/icon/menu-manage.png');
          background-size: 0.3rem;
        }
        .menu-recorde{
          background-image: url('./../../assets/images/icon/menu-recorde.png');
          background-size: 0.3rem;
        }
        .menu-help{
          background-image: url('./../../assets/images/icon/menu-help.png');
          background-size: 0.3rem;
        }
        .menu-about{
          background-image: url('./../../assets/images/icon/menu-cpyf.png');
          background-size: 0.3rem;
        }
        .menu-partner{
          background-image: url('./../../assets/images/icon/menu-partner.png');
          background-size: 0.4rem;
        }
        .menu-partnerapply{
          background-image: url('./../../assets/images/icon/menu-partnerapply.png');
          background-size: 0.36rem;
        }
        .menu-poster{
          background-image: url('./../../assets/images/icon/menu-poster.png');
          background-size: 0.36rem;
        }
      }
      .item-content{
        display: flex;
        align-items: center;
        flex: 1;
        .title{
          color: #2d2d2d;
          font-size: 0.3rem;
          flex: 1;
        }
        .link{
          color: #888888;
          font-size: 0.2rem;
          .vux-x-icon{
            fill: #3f3f3f;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .windowMask{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .3);
    z-index: 100;
  }
</style>
