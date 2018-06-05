<template>
  <div class="container">
    <div class="top-tips" v-show="tipShow">长按保存海报，即可在朋友圈、微信群分享推广哦~</div>
    <!--<img :src="poster.img" class="poster-img">-->
    <swiper loop :aspect-ratio='1334/750' @on-index-change="onSwiperItemIndexChange"
            v-model="swiperIndex" :show-desc-mask = false>
      <swiper-item v-for="(item, index) in poster" :key="index"><img :src="item.img"></swiper-item>
    </swiper>
    <div class="btn-wrap">
      <!-- <router-link :to='{path: "skill"}' class="skill-link">分享技巧 ></router-link> -->
    </div>
    <div class="left-btn" @click="prev">
      <x-icon type="ios-arrow-back" size="24"></x-icon>
    </div>
    <div class="right-btn" @click="next">
      <x-icon type="ios-arrow-forward" size="24"></x-icon>
    </div>
  </div>
</template>

<script>
  import {XButton, Swiper, SwiperItem} from 'vux'
  import api from '@/api'

  export default {
    components: {
      XButton,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        tipShow: true,
        poster: [],
        swiperIndex: 0,
        poster_system_id: null,
        flag: false
      }
    },
    created () {
      this.getPic()
    },
    methods: {
      async getPic () {
        let obj = null
        if (this.flag) {
          obj = {
            id: this.poster_system_id
          }
        }
        const {data: {code, data}} = await api.get('/Users/Mycenter/WechatPoster', obj)
        if (code === 200 && data.poster_system_id) {
          this.poster_system_id = data.poster_system_id
          this.poster.push(data)
          this.flag = true
        } else {
          this.flag = false
        }
      },
      onSwiperItemIndexChange (index) {
        this.swiperIndex = index
      },
      prev () {
        this.swiperIndex--
        if (this.swiperIndex < 0) {
          this.swiperIndex = this.poster.length - 1
        }
      },
      async next () {
        if (this.flag) {
          await this.getPic()
        }
        this.swiperIndex++
        if (this.swiperIndex >= this.poster.length) {
          this.swiperIndex = 0
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    position: relative;
    flex: 1;
    text-align: center;
    .top-tips {
      position: fixed;
      z-index: 100;
      top: 1.06rem;
      width: 100%;
      background: rgba(255, 255, 255, .6);
      height: 0.5rem;
      font-size: 0.22rem;
      color: #262626;
      text-align: center;
      line-height: 0.5rem;
    }
    .vux-slider{
      margin-top: 1.06rem;
      img{
        width: 100%;
      }
    }
  }

  .poster-img {
    // margin: 1rem auto 0;
    width: 100%;
  }

  .left-btn {
    position: fixed;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #000;
    font-size: 0;
  }

  .right-btn {
    position: fixed;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #000;
    font-size: 0;
  }

  .vux-x-icon {
    fill: #fff;
    margin-top: 3px;
  }

  .btn-wrap {
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    .change-btn {
      margin: 0 auto;
      width: 1.8rem;
      height: 0.7rem;
      color: #ffffff;
      font-size: 0.3rem;
      border: 1px solid #09bb07;
      border-radius: 3px;
      line-height: 0.7rem;
      text-align: center;
      background-color: #09bb07;
    }
    .skill-link {
      display: block;
      margin-top: 0.3rem;
      font-size: 0.28rem;
      padding: 0.1rem;
      color: #fff;
      background: rgba(0, 0, 0, .6);
    }
  }
</style>
