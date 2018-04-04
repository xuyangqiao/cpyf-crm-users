<template>
  <div class='wrap'>
    <div class="create-wrap" id="pennant-wrap" v-if="!img">
      <div class="name active" v-if="name">{{name}}</div>
      <div class="name" v-else>姓名</div>
      <div class="time">二〇一八年四月四日</div>
      <img src="../../assets/images/pennant-1.png" class="bg">
      <div class="doctor">宋其良医生</div>
      <img src="../../assets/images/qrcode.png" class="qrcode">
    </div>
    <div class="img-wrap" v-else>
      <img :src="img">
    </div>
    <div class="top-bar" v-if="!img">
      <input type="text" v-model="name" maxlength="4" placeholder="请输入您的名字" class="input-name">
    </div>
    <div class="footer-bar" v-if="!img">
      <div class="create-btn" @click="createPennant">赠送锦旗</div>  
    </div>
    <transition name="fade" mode="out-in">
      <div class="loading" v-if="loading">正在制作，不要方</div>
    </transition>
  </div>
</template>

<script>
// import api from '@/api'
import html2canvas from 'html2canvas'

export default {
  data () {
    return {
      name: '',
      img: '',
      loading: false
    }
  },
  created () {
    this.$store.commit('footerShow', false)
  },
  methods: {
    DPR () {
      if (window.devicePixelRatio && window.devicePixelRatio > 1) {
        return window.devicePixelRatio
      }
      return 1
    },
    parseValue (value) {
      return parseInt(value, 10)
    },
    /**
     * 绘制canvas
     */
    async drawCanvas (selector) {
      // 获取想要转换的 DOM 节点
      const dom = document.querySelector(selector)
      const box = window.getComputedStyle(dom)
      // DOM 节点计算后宽高
      const width = this.parseValue(box.width)
      const height = this.parseValue(box.height)
      // 获取像素比
      const scaleBy = this.DPR()
      // 创建自定义 canvas 元素
      const canvas = document.createElement('canvas')

      // 设定 canvas 元素属性宽高为 DOM 节点宽高 * 像素比
      canvas.width = width * scaleBy
      canvas.height = height * scaleBy
      // 设定 canvas css宽高为 DOM 节点宽高
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      // 获取画笔
      const context = canvas.getContext('2d')

      // 将所有绘制内容放大像素比倍
      context.scale(scaleBy, scaleBy)

      // 将自定义 canvas 作为配置项传入，开始绘制
      let imgDiv = await html2canvas(dom, {canvas})
      return imgDiv
    },

    createPennant () {
      this.loading = true
      this.drawCanvas('#pennant-wrap').then(res => {
        this.img = this.convertCanvasToImage(res)
        this.loading = false
      })
    },

    convertCanvasToImage (canvas) {
      var image = new Image()
      image.src = canvas.toDataURL('image/png')
      return image.src
    }
  }
}
</script>

<style lang='less'>
.wrap{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.img-wrap{
  width: 100vw;
  height: 100vh;
  img{
    width: 100%;
    height: 100%;
  }
}
.create-wrap{
  width: 100vw;
  height: 100vh;
  .bg{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .name{
    position: absolute;
    color: #fdf0be;
    font-size: 0.34rem;
    top: 4.08rem;
    left: 0.93rem;
    z-index: 10;
    font-weight: 700;
    writing-mode: vertical-lr;
    letter-spacing: 4px;
    border: 1px solid #fdf0be;
    padding: 0.1rem;
    &.active{
      border: none;
    }
  }
  .time{
    position: absolute;
    color: #fdf0be;
    font-size: 0.34rem;
    top: 6rem;
    left: 1.03rem;
    z-index: 10;
    font-weight: 700;
    writing-mode: vertical-lr;
    letter-spacing: 4px;
  }
  .doctor{
    position: absolute;
    right: 1.1rem;
    top: 4.3rem;
    font-size: 0.33rem;
    color: #fdf0be;
    letter-spacing: 4.23px;
    writing-mode: vertical-lr;
  }
  .qrcode{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 9rem;
    width: 1.65rem;
    height: 1.65rem;
  }
}
.top-bar{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, .6);
  height: 1rem;
  font-size: 0;
  .input-name{
    padding: 0 0.6rem;
    background: none;
    color: #fff;
    outline: none;
    box-shadow: none;
    font-size: 0.5rem;
    height: 1rem;
    line-height: 1rem;
  }
}

.footer-bar{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, .9);
  padding: 0.25rem 0;
  .create-btn{
    width: 3.26rem;
    height: 1rem;
    border-radius: 4px;
    background-color: #1aad19;
    color: #ffffff;
    font-size: 0.4rem;
    text-align: center;
    line-height: 1rem;
    margin: 0 auto;
  }
}

.loading{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>
