<template>
  <div class='page'>
    <div class="pennant-banner"></div>
    <div class="title-box">川派医生集团疼痛专家</div>

    <div class="doctor-wrap">
      <div class="doctor-item" v-for="(item, index) in doctorList" :key="item.id" v-if="showMore || index < 3">
        <div class="avatar">
          <img :src="item.avatar" class="avatar-img">
        </div>
        <div class="content">
          <div class="name-wrap">
            <strong class="name">{{item.name}}</strong>
            <span class="green">{{item.school}}</span>
          </div>
          <div class="desc">
            <span class="title">擅长：</span>
            {{item.specialty}}
          </div>
          <div class="bottom-wrap">
            <div class="btn" @click="refer(index)">免费咨询</div>
            <span class="text">已有{{item.people_count}}人咨询</span>
          </div>
        </div>
      </div>
    </div>

    <div class="more-wrap" v-if="!showMore">
      <span class="icon" @click="showMore = true"></span>
      <swiper auto height="40px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false">
        <swiper-item class="swiper-item" v-for="(item, index) in doctorList" :key="item.id" v-if="index > 2">
          <div class="name-wrap">
            <strong class-="name">{{item.name}}</strong>
            <span class="green">{{item.school}}</span>
          </div>
        </swiper-item>
      </swiper>
    </div>

    <div class="ad-banner"></div>
    <div class="title-box">线上预约，专家号不用等</div>

    <div class="form-wrap">
      <div class="form-item">
        <span class="label">姓名</span>
        <input type="text" class="form-input" placeholder="请输入姓名" @focus="footerShow=false" @blur="footerShow=true" v-model="name">
      </div>
      <div class="form-item">
        <span class="label">电话</span>
        <input type="text" class="form-input" placeholder="请输入电话" @focus="footerShow=false" @blur="footerShow=true" v-model="mobile">
      </div>
      <div class="text-item">
        <span class="label">病情描述</span>
        <textarea class="rule-text" v-model="desc" maxlength="250" @focus="footerShow=false" @blur="footerShow=true" placeholder="如：发病情况及患病时间、主要症状及特点、伴随病状、治疗经历，希望得到的帮助、辅助检查结果等。"></textarea>
      </div>
      <div class="title">填写详细的信息，更利于匹配合适的医生哦~</div>
      <x-button type='primary' class="btn" plain @click.native="sureApply">提交预约</x-button>
    </div>

    <div class="title-box">川派医生集团，西南地区专业的疼痛诊疗机构</div>
    <div class="word">
      <p class="text">川派医生集团成立于2016年12月，由15名医学博士联合发起，是一家提供优质、舒适、先进、安全的医疗服务的医生集团。</p>
      <p class="text">川派疼痛专家均在三甲医院从事疼痛临床诊疗工作超20年，擅长处理各种疼痛的疑难杂症。采用中西医联合诊疗模式（MDT），以微创手术、神经调节修复术、康复治疗技术等，治疗颈椎病、腰椎间盘突出症、带状疱疹后神经痛、三叉神经痛等为主的优势病种，已有上万例疼痛患者在团队专家的治疗下，解除了疼痛之苦。</p>
    </div>
    <div class="word-title">
      <div class="line"></div>
      <div class="title">疼痛MDT多学科综合治疗</div>
      <div class="line"></div>
    </div>
    <div class="word-content">
      <div class="item">微创手术</div>
      <div class="item">神经调节修复术</div>
      <div class="item">康复治疗技术</div>
    </div>
    <div class="footer-banner"></div>

    <x-dialog v-model="referShow" hide-on-blur>
      <div class="refer-content">
        <div class="avatar-wrap">
          <div class="avatar">
            <img :src="activeDoctor.avatar" class="avatar-img">
          </div>
        </div>

        <div class="refer-desc">
          <p class="text">温馨提示：</p>
          <p class="text">为方便您就医，川派医生集团</p>
          <p class="text">现已开通门诊电话<span class="green">免费咨询</span>。</p>

          <input type="text" class="refer-phone" placeholder="请输入电话" v-model="mobile" v-focus="referShow">
          <x-button class="refer-btn" @click.native="sureRefer">免费接听电话</x-button>
          <p class="desc"><span class="green">{{activeDoctor.people_count}}人</span>已免费咨询</p>
        </div>
      </div>
    </x-dialog>
    <x-dialog v-model="successShow" hide-on-blur>
      <div class="success-content">
        <div class="title">提交成功</div>
        <p class="small-title">专家助理正在处理您的需求~</p>

        <div class="btn-wrap">
          <router-link :to="{path: '/find'}" tag="div" class="item active">了解川派新闻</router-link>
          <x-button plain class="item" @click.native="successShow = false">返回查看专家</x-button>
        </div>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import api from '@/api'
import { Swiper, SwiperItem, XDialog, TransferDomDirective as TransferDom, XButton } from 'vux'

export default {
  data () {
    return {
      referShow: false,
      successShow: false,
      doctorList: [],
      showMore: false,
      activeDoctor: {},
      mobile: '',
      name: '',
      desc: '',
      footerShow: true
    }
  },
  directives: {
    TransferDom,
    focus: {
      update: function (el, {value}) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  components: {
    Swiper,
    SwiperItem,
    XDialog,
    XButton
  },
  created () {
    this.getDoctorList()
    this.defaultRequest()
  },
  watch: {
    'footerShow' () {
      this.$store.commit('footerShow', this.footerShow)
    }
  },
  methods: {
    async getDoctorList () {
      const {data: {code, data}} = await api.get('/Banner/Sendbanner/doctorList')
      if (code === 200) {
        this.doctorList = data
      }
    },
    refer (index) {
      this.activeDoctor = this.doctorList[index]
      this.referShow = true
    },
    async sureRefer () {
      const obj = {
        mobile: this.mobile,
        doctor_id: this.activeDoctor.id,
        desc: this.activeDoctor.name
      }

      const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/

      if (!obj.mobile) {
        this.toast('请输入电话号码')
        return
      } else if (!myreg.test(obj.mobile)) {
        this.toast('请输入正确的手机号')
        return
      }

      const {data: {code}} = await api.post('/Banner/Sendbanner/leavingMessage', obj)
      if (code === 200) {
        this.referShow = false
        this.successShow = true
      }
    },

    async sureApply () {
      const obj = {
        mobile: this.mobile,
        desc: this.desc,
        name: this.name
      }

      const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
      if (!obj.name) {
        this.toast('请输入您的姓名')
        return
      }
      if (!obj.mobile) {
        this.toast('请输入电话号码')
        return
      } else if (!myreg.test(obj.mobile) || obj.mobile.length < 11) {
        this.toast('请输入正确的手机号')
        return
      }

      const {data: {code}} = await api.post('/Banner/Sendbanner/leavingMessage', obj)
      if (code === 200) {
        this.successShow = true
      }
    },

    async defaultRequest () {
      await api.get('/Banner/Sendbanner/AddDrainageCount')
    },

    shareMsg () {
      this.$wechat.ready(() => {
        this.wechatShare({
          title: '快速祛除疼痛，就找川派医生！',
          link: this.handUrl(location.hash),
          img: 'http://m.qpic.cn/psb?/V11P0IcO3nwu6m/0iy19ozUJOnxFpSC*edLkx6yh1M7jO6WQq5uscPCnfs!/b/dEEBAAAAAAAA&bo=sQCxAAAAAAADFzI!&rf=viewer_4&t=5',
          desc: '川派疼痛医生采用MDT联合治疗各类疼痛疑难杂症~'
        })
      })
    }
  },
  mounted () {
    this.shareMsg()
  }
}
</script>

<style lang='less' scoped>
.pennant-banner{
  height: 3.2rem;
  background: url('../../assets/images/doctor-banner.png') no-repeat center;
  background-size: contain;
}
.title-box{
  height: 0.8rem;
  background-color: #1aad19;
  line-height: 0.8rem;
  color: #fff;
  font-size: 0.34rem;
  padding: 0 0.4rem;
}
.doctor-wrap{
  margin-top: .2rem;
  .doctor-item{
    display: flex;
    align-items: center;
    padding: 0.2rem 0.45rem;
    background: #fff;
    margin-bottom: 0.2rem;
    &:last-child{
      margin-bottom: 0;
    }
    .avatar{
      width: 2.6rem;
      height: 2.6rem;
      .avatar-img{
        width: 100%;
        height: 100%;
      }
    }
    .content{
      flex: 1;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      width: 1px;
      height: 2.6rem;
      padding: 0.2rem 0;
      margin-left: 0.2rem;
      .name-wrap{
        display: flex;
        align-items: flex-end;
        white-space: nowrap;
        width: 100%;
        .name{
          color: #292929;
          font-size: 0.35rem;
          font-weight: bold;
          margin-right: 0.24rem;
        }
        .green{
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;        
          font-size: 0.24rem;
          height: 0.3rem;
          line-height: 0.3rem;
        }
      }
      .desc{
        font-size: 0.24rem;
        line-height: 0.36rem;
        color: #4b4b4b;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        .title{
          color: #292929;
          font-weight: bold;
        }
      }
      .bottom-wrap{
        display: flex;
        align-items: center;
        .btn{
          width: 1.5rem;
          height: 0.55rem;
          line-height: 0.55rem;
          text-align: center;
          color: #189f17;
          font-size: 0.24rem;
          border: 1px solid #1aad19;
          border-radius: 4px;
        }
        .text{
          color: #e83344;
          font-size: 0.24rem;
          margin-left: 0.2rem;
        }
      }
    }
  }
}

.more-wrap{
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #fff;
  .icon{
    width: 0.3rem;
    height: 0.3rem;
    background: url('../../assets/images/icon/more-icon.png') no-repeat center;
    background-size: contain;
  }
  .text-scroll{
    width: 100%;
    font-size: 0.32rem;
    margin-top: 0.2rem;
    padding: 0 0.4rem;
    box-sizing: border-box;
    .swiper-item{
      display: flex;
      align-items: center;
    }
    .name-wrap{
      display: flex;
      align-items: flex-end;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      white-space: nowrap;
      text-align: center;
      justify-content: center;
      .green{
        font-size: 0.24rem;
        margin-left: 0.2rem;
      }
    }
  }
}
.ad-banner{
  height: 2rem;
  background: url('../../assets/images/ad-banner.png') no-repeat center;
  background-size: contain;
}

.form-wrap{
  background: #fff;
  padding: 0.4rem 0.8rem;
  .form-item{
    display: flex;
    align-items: center;
    height: 0.8rem;
    border: 1px solid #b1b1b1;
    border-radius: 6px;
    line-height: 0.8rem;
    overflow: hidden;
    margin-bottom: 0.14rem;
    .label{
      color: #000000;
      font-size: 0.26rem;
      background: #e5e5e5;
      width: 0.88rem;
      height: 100%;
      text-align: center;
    }
    .form-input{
      flex: 1;
      width: 10px;
      outline: none;
      border: none;
      box-shadow: none;
      height: 100%;
      font-size: 0.26rem;
      padding: 0 0.16rem;
    }
  }
  .text-item{
    font-size: 0;
    margin-top: 0.3rem;
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
      margin-top: 0.1rem;
      box-sizing: border-box;
      padding: 0.14rem;
      font-size: 0.28rem;
    }
  }
  .title{
    color: #707070;
    font-size: 0.26rem;
    text-align: center;
    margin: 0.23rem 0 0.4rem;
  }
  .btn{
    border: 1px solid #1aad19;
    border-radius: 6px;
    height: 0.8rem;
    text-align: center;
    font-size: 0.3rem;
    line-height: 0.8rem;
  }
}

.word{
  padding: 0.4rem 0.7rem;
  background: #fff;
  .text{
    color: #292929;
    font-size: 0.28rem;
    line-height: 0.36rem;
    text-indent: 2em;
    margin-bottom: 0.2rem;
  }
}
.word-title{
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 0.2rem;
  .line{
    height: 1px;
    background: #bfbfbf;
    flex: 1;
  }
  .title{
    color: #000000;
    font-size: 0.36rem;
    font-weight: bold;
    padding: 0 0.2rem;
  }
}
.word-content{
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0.56rem 0.5rem 0.4rem;
  margin-bottom: 0.2rem;
  .item{
    height: 0.55rem;
    line-height: 0.55rem;
    border: 1px solid #e83344;
    border-radius: 4px;
    color: #e83344;
    font-size: 0.24rem;
    padding: 0 0.3rem;
  }
}
.footer-banner{
  height: 3.1rem;
  background: url('../../assets/images/doctor-footer-banner.png') no-repeat center;
  background-size: contain;
}
.refer-content{
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #fff;
  padding: 0 0 0.4rem;
  box-sizing: border-box;
  .avatar-wrap{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.8rem 0 0.4rem;
    background: #ace2ac;
    width: 100%;
  }
  .avatar{
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 0.18rem solid #d1efd1;
    box-sizing: border-box;
    .avatar-img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid #fff;
      box-sizing: border-box;
    }
  }
  .refer-desc{
    margin-top: 0.6rem;
    font-size: 0.3rem;
    .text{
      margin-bottom: 0.26rem;
    }
    .refer-phone{
      height: 0.8rem;
      width: 4.2rem;
      border: 1px solid #a6a6a6;
      border-radius: 4px;
      outline: none;
      box-shadow: none;
      text-align: center;
    }
    .refer-btn{
      height: 0.8rem;
      width: 4.2rem;
      background-color: #1aad19;
      text-align: center;
      line-height: 0.8rem;
      color: #fff;
      font-size: 0.3rem;
      border-radius: 4px;
      margin-top: 0.2rem;
    }
    .desc{
      color: #a6a6a6;
      font-size: 0.26rem;
      margin-top: 0.5rem;
    }
  }
}
.success-content{
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background: #fff;
  padding: 1.35rem 0.8rem 0.6rem;
  box-sizing: border-box;
  .title{
    color: #1aad19;
    font-size: .4rem;
    font-weight: bold;
  }
  .small-title{
    color: #000000;
    font-size: 0.3rem;
    margin-top: 0.3rem;
    margin-bottom: 1.7rem;
  }
  .btn-wrap{
    width: 100%;
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
