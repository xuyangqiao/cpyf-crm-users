<template>
  <div class='wrap'>
    <div class="create-wrap" id="pennant-wrap" v-if="!img">
      <div class="name active" v-if="name">{{name}}  {{nowDate}}</div>
      <div class="name" v-else>姓名  {{nowDate}}</div>
      <!-- <div class="time">{{nowDate}}</div> -->
      <img :src="bgImg" class="bg">
      <div class="doctor">{{doctorName}}医生</div>
      <img :src="codeImg" class="qrcode">
    </div>
    <div class="img-wrap" v-else>
      <img :src="img">
    </div>
    <div class="top-bar" v-if="!img">
      <input type="text" v-model="name" maxlength="4" placeholder="请输入您的名字" class="input-name" ref="nameInput">
    </div>
    <div class="footer-bar" v-if="!img">
      <div class="create-btn" @click="createPennant">赠送锦旗</div>  
    </div>
    <transition name="fade" mode="out-in">
      <create-loading v-if="create"></create-loading>
    </transition>
  </div>
</template>

<script>
import api from '@/api'
import html2canvas from 'html2canvas'
import createLoading from '@/components/create-loading.vue'
import { setTimeout } from 'timers'

export default {
  components: {
    createLoading
  },
  data () {
    return {
      name: '',
      img: '',
      doctorName: '',
      codeImg: '',
      nowDate: '',
      bgImg: '',
      create: false
    }
  },
  created () {
    this.$store.commit('footerShow', false)
    this.getBanner()
  },
  methods: {
    async getBanner () {
      const {data: {code, data}} = await api.get('/Banner/Sendbanner/bannerDetail', {id: this.$route.query.id, doctor_id: this.$route.query.doctor_id})
      if (code === 200) {
        this.doctorName = data.doctorName
        this.img2base64(data.list.img_detail).then(res => {
          this.bgImg = res
        })
        this.img2base64(data.codeImg).then(res => {
          this.codeImg = res
        })

        this.nowDate = this.formatChTime(new Date())
      }
    },
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

    /**
     * 图片转base64格式
     */
    img2base64 (url, crossOrigin) {
      return new Promise(resolve => {
        const img = new Image()

        img.onload = () => {
          let c = document.createElement('canvas')

          c.width = img.naturalWidth
          c.height = img.naturalHeight

          let cxt = c.getContext('2d')
          cxt.drawImage(img, 0, 0)
          // 得到图片的base64编码数据
          resolve(c.toDataURL('image/png'))
        }

        img.setAttribute('crossOrigin', 'anonymous')
        img.src = url
      })
    },

    createPennant () {
      if (!this.name) {
        this.toast('请填写您的姓名')
        return
      }
      this.create = true
      this.$refs.nameInput.blur()
      setTimeout(() => {
        this.drawCanvas('#pennant-wrap').then(async res => {
          this.img = this.convertCanvasToImage(res)
          this.create = false
          const obj = {
            name: this.name,
            banner_id: this.$route.query.id,
            doctor_id: this.$route.query.doctor_id
          }
          const {data: {code, msg}} = await api.post('/Banner/Sendbanner/sendDoctor', obj)
          if (code === 200) {
            this.toast('赠送成功，请长按保存', 'text', 'middle', 6000)
          } else {
            this.toast(msg)
          }
        })
      }, 300)
    },

    convertCanvasToImage (canvas) {
      var image = new Image()
      image.src = canvas.toDataURL('image/png')
      return image.src
    },

    shareMsg () {
      this.$wechat.ready(() => {
        this.$wechat.hideAllNonBaseMenuItem()
      })
    }
  },
  mounted () {
    this.shareMsg()
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
  position: relative;
  .bg{
    position: relative;
    height: 100%;
    width: 100%;
  }
  .name{
    position: absolute;
    color: #fdf0be;
    font-size: 0.34rem;
    top: 35vh;
    left: 0.93rem;
    z-index: 10;
    font-weight: 700;
    letter-spacing: 4px;
    border: 1px solid #fdf0be;
    padding: 0.1rem;
    width: 0.34rem;
    line-height: 0.4rem;
    text-align: center;  
    &.active{
      border: none;
    }
  }
  .time{
    color: #fdf0be;
    font-size: 0.34rem;
    z-index: 10;
    font-weight: 700;
    letter-spacing: 4px;
    width: 0.34rem;
    line-height: 0.4rem;
    text-align: center;  
  }
  .doctor{
    position: absolute;
    right: 1.05rem;
    top: 5rem;
    font-size: 0.33rem;
    color: #fdf0be;
    width: 0.33rem;
    line-height: 0.38rem;
    text-align: center;   
  }
  .qrcode{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 12vh;
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
