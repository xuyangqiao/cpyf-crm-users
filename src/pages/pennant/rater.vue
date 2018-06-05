<template>
  <div class='page'>
    <div class="rater-banner"></div>
    <div class="rater-content">
      <p class="title">为提高我们的医疗服务质量，请您根据亲身经历或感受，真实、客观地对我们的服务进行评价，选择您认为适宜的选项，感谢合作！</p>

      <div class="select-wrap">
        <span class="label">主诊医生：</span>
        <popup-picker class="select-picker" show-name :data="doctorList" v-model="doctor_id" placeholder="请选择医生" value-text-align="left"></popup-picker>
      </div>

      <div class="rater-wrap">
        <div class="rater-item">
          <span class="label">治疗效果：</span>
          <rater v-model="form.diagnosis" :margin=6></rater>
        </div>
        <div class="rater-item">
          <span class="label">诊疗服务：</span>
          <rater v-model="form.treatment" :margin=6></rater>
        </div>
        <div class="rule-item">
          <span class="label">您的建议：</span>
          <textarea class="rule-text" placeholder="请填写您的建议" v-model="form.desc" @focus="footerShow=false" @blur="footerShow=true"></textarea>
        </div>
        <x-button class="sure-btn" @click.native="sure">提交</x-button>
      </div>
    </div>

    <div class="footer-banner"></div>

    <div v-transfer-dom>
      <x-dialog v-model="sendShow" hide-on-blur>
        <div class="send-content">
          <div class="top-bar">我为医生送锦旗</div>
          <div class="banner-logo">
            <img src="../../assets/images/rater-send-banner.png">
          </div>
          <div class="text">“维护圣洁医学，倡导廉洁医风"，川派医生集团现已开通<span class="green">电子锦旗免费送</span>渠道，每人可为主诊医生送1面锦旗哦~</div>
          <div class="btn-wrap">
            <router-link :to="{path: '/pennant', query: {id: this.doctor_id[0]}}" tag="div" class="item active">我要免费送</router-link>
            <div class="item" @click="sendShow = false">不了，谢谢</div>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import { PopupPicker, XDialog, TransferDomDirective as TransferDom, XButton } from 'vux'
import rater from '@/components/rater.vue'

export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      form: {
        diagnosis: 0,
        treatment: 0,
        desc: ''
      },
      doctorList: [],
      doctor_id: [],
      sendShow: false,
      footerShow: true
    }
  },
  components: {
    PopupPicker,
    rater,
    XDialog,
    XButton
  },
  created () {
    this.getDoctorList()
  },
  watch: {
    'footerShow' () {
      this.$store.commit('footerShow', this.footerShow)
    }
  },
  methods: {
    async sure () {
      const obj = Object.assign(this.form, {doctor_id: this.doctor_id[0]})
      if (!obj.doctor_id) {
        this.toast('请选择您的主诊医生')
        return
      }
      const {data: {code, msg}} = await api.post('/Banner/Sendbanner/Mark', obj)
      if (code === 200) {
        this.sendShow = true
      } else {
        this.toast(msg)
      }
    },
    async getDoctorList () {
      const {data: {code, data}} = await api.get('/Banner/Sendbanner/doctorList')
      if (code === 200) {
        let temp = []
        data.forEach((item, index) => {
          let obj = {
            value: item.id,
            name: item.name
          }
          temp.push(obj)
        })
        this.doctorList.push(temp)
      }
    },
    shareMsg () {
      this.$wechat.ready(() => {
        this.wechatShare({
          title: '川派医生集团服务质量调查',
          link: this.handUrl(location.hash),
          img: 'http://m.qpic.cn/psb?/V11P0IcO3nwu6m/0iy19ozUJOnxFpSC*edLkx6yh1M7jO6WQq5uscPCnfs!/b/dEEBAAAAAAAA&bo=sQCxAAAAAAADFzI!&rf=viewer_4&t=5',
          desc: '您的支持是我们进步的动力~'
        })
      })
    }
  },
  mounted () {
    this.shareMsg()
  }
}
</script>

<style lang='less'>
.page{
  padding-bottom: 1rem;
  background: #fff;
}
.rater-banner{
  height: 3.2rem;
  background: url('../../assets/images/rater-banner.png') no-repeat center;
  background-size: contain;
}
.rater-content{
  background: #fff;
  padding: 0.37rem 0.58rem;
  .title{
    color: #292929;
    font-size: 0.28rem;
    line-height: 0.4rem;
    text-indent: 2em;
    letter-spacing: 0.48px;
  }
  .select-wrap{
    display: flex;
    align-items: center;
    margin-top: 0.47rem;
    .vux-cell-box:before{
      display: none;
    }
    .weui-cell_access .weui-cell__ft:after{
      display: none;
    }
    .label{
      font-size: 0.3rem;
    }
    .select-picker{
      flex: 1;
      border-radius: 4px;
      border: 1px solid #b1b1b1;
      
      font-size: 0.3rem;
      font-weight: bold;
    }
  }
}
.rater-wrap{
  margin-top: 0.8rem;
}
.rater-item{
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
  .label{
    font-size: 0.3rem;
    color: #000;
  }
}
.rule-item{
  font-size: 0;
  .label{
    font-size: 0.3rem;
    color: #000;
  }
  .rule-text{
    width: 100%;
    height: 2.3rem;
    border: 1px solid #b1b1b1;
    border-radius: 6px;
    resize: none;
    outline: none;
    box-shadow: none;
    margin-top: 0.2rem;
    box-sizing: border-box;
    padding: 0.24rem;
    font-size: 0.28rem;
  }
}
.sure-btn{
  height: 0.8rem;
  border: 1px solid #1aad19;
  background: #fff;
  color: #1aad19;
  font-size: 0.3rem;
  text-align: center;
  line-height: 0.8rem;
  width: 100%;
  border-radius: 6px;
  margin-top: 0.3rem;
}
.footer-banner{
  height: 3.1rem;
  background: url('../../assets/images/rater-footer-banner.png') no-repeat center;
  background-size: contain;
  margin-top: 0.6rem;
}
.send-content{
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #fff;
  box-sizing: border-box;
  padding-bottom: 0.5rem;
  .top-bar{
    height: 0.84rem;
    background: #1bad19;
    color: #ffffff;
    font-weight: bold;
    font-size: 0.36rem;
    line-height: 0.84rem;
    width: 100%;
  }
  .banner-logo{
    width: 2.95rem;
    height: 2.77rem;
    margin-top: 0.6rem;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .text{
    color: #000000;
    font-size: 0.3rem;
    line-height: 0.6rem;
    width: 4.8rem;
    text-align: left;
    letter-spacing: 1px;
    margin-top: 0.5rem;
    word-break: break-all;
  }
  .btn-wrap{
    width: 4.8rem;
    margin-top: 0.5rem;
    .item{
      height: 0.8rem;
      line-height: 0.8rem;
      text-align: center;
      color: #a6a6a6;
      font-size: 0.3rem;
      border: 1px solid #a6a6a6;
      border-radius: 4px;
      margin-bottom: 0.2rem;
      &.active{
        background-color: #1aad19;
        color: #fff;
        border-color: #1aad19;
      }
    }
  }
}
</style>
