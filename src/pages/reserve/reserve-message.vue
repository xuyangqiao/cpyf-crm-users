<template>
  <div class="container">
    <div class="wrap-top">
      <!-- 医生详情 -->
      <div class="doctor-content">
        <div class="avatar">
          <img :src="reserveInfo.avatar">
        </div>
        <div class="info-wrap">
          <div class="info">
            <h2 class="name">{{reserveInfo.name}}</h2>
            <span class="title">{{reserveInfo.title_title}}</span>
          </div>
        </div>
        <div class="time-info">
          <h2 class="time-main">{{dateObj.week}} {{dateObj.time}}</h2>
          <span class="date">{{dateObj.date}}</span>
        </div>
      </div>
      <!-- 选择就诊人和类型 -->
      <div class="select-wrap">
        <div class="select-item vux-1px-b" @click='popShow = true'>
          <span class="client-icon"></span>
          <span class="title green">{{clientName}}</span>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </div>
        <div class="select-item new-item vux-1px-b" v-if="checkDefault">
          <router-link to='/newclient' tag='div' class="new-person">添加就诊人</router-link>
        </div>
        <div class="select-item" @click='typeShow = true'>
          <span class="time-icon"></span>
          <span class="title">{{reserveType}}</span>
          <x-icon type="ios-arrow-right" size="20"></x-icon>
        </div>
      </div>
    </div>
    <div class="showInfo-wrap" @click='showInfo = !showInfo'>
      <p class="title">展开提交更多信息</p>
      <div class="arrow-icon" :class='{active: showInfo}'></div>
    </div>
    <!-- 填写信息 -->
    <div class="info" v-show="showInfo">
      <group gutter='0'>
        <x-textarea show-counter placeholder="可输入你目前主要的症状、检查的结果、曾就医的诊断信息、用药历史、治疗历史等，方便医生提前了解您的情况。" :max='300' v-model="form.desc"></x-textarea>
      </group>
      <div class="pic-upload">
        <h2 class="title">资料上传</h2>
        <p class="desc">可上传以往就医的资料（检查报告、诊断信息、处方等）或疼痛部位照片</p>
        <div class="pic-wrap">
          <img :src="iosPicData.length > 0 ? iosPicData[index] : item" @click='showPic(index)' v-for="(item, index) in picList">
          <img src="../../assets/images/pic-add.png" v-if='picList.length < 5' @click='chooseImg'>
        </div>
      </div>
    </div>

    <div class="btn-wrap">
      <x-button action-type="button" @click.native='uploadPic'>提交</x-button>
    </div>

    <!-- 选择就诊人 -->
    <div v-transfer-dom>
      <popup v-model="popShow" show-mask>
        <div class="popup">
          <div class="pop-top vux-1px-b">
            <span class="title" @click='popShow = false'>取消</span>
            <span @click='checkNewClient' class="title">
              <span>新建就诊人</span>
              <x-icon type="ios-plus-empty" size="30"></x-icon>
            </span>
          </div>
          <div class="pop-select">
            <div class="pop-item" :class='{active: activeIndex === index}' v-for="(item, index) in clientList" @click='itemClick(item, index)'>
              <div class="item-left">
                <h2 class="person-name">{{item.name}}</h2>
                <h2 class="card">{{item.card_number | filterCard}}</h2>
              </div>
              <div class="default" v-if="item.default === '1'">默认</div>
            </div>
          </div>
        </div>
      </popup>
    </div>

    <!-- 预约类型 -->
    <actionsheet v-model="typeShow" :menus="typeMenu" show-cancel @on-click-menu="click"></actionsheet>

    <!--就诊人提示-->
    <div class="fix-tip" v-if="clientList && !form.patient_id" v-cloak>
      *请选择就诊人
    </div>

    <div v-transfer-dom>
      <loading v-model="loading" :text="loadingText"></loading>
    </div>
  </div>
</template>

<script>
import { Group, XTextarea, XButton, TransferDom, Popup, Actionsheet } from 'vux'
import { dateObj } from '@/utils'
import api from '@/api'

export default {
  directives: {
    TransferDom
  },
  components: {
    Group,
    XTextarea,
    XButton,
    Popup,
    Actionsheet
  },
  data () {
    return {
      popShow: false,
      activeIndex: -1,
      showInfo: false,
      typeShow: false,
      fetching: false,  // 判断是否正在提交请求，免得双击
      picList: [], // 上传图片区
      iosPicData: [], // 兼容苹果图片数据
      flag: 0, // 上传图片标识
      dateObj: {},
      clientList: '',
      typeList: [],
      typeMenu: {},
      form: {
        reserves_type_id: '',
        patient_id: '',
        reserve_img: {},
        desc: '',
        reserve_time: '',
        reserve_type: '',
        doctor_id: ''
      }
    }
  },
  filters: {
    filterCard (card) {
      let temp = []
      for (let i = 0; i < card.length; i++) {
        if (i < 3 || i > 13) {
          temp.push(card[i])
        } else {
          temp.push('*')
        }
      }
      return temp.join('')
    }
  },
  created () {
    this.dateObj = dateObj(this.reserveInfo.date)
    this.form.reserve_time = this.reserveInfo.date
    this.form.reserve_type = this.reserveInfo.time
    this.form.doctor_id = this.reserveInfo.id
    if (this.reserveInfo.time === 1) {
      this.dateObj['time'] = '上午'
    } else {
      this.dateObj['time'] = '下午'
    }
    this.fetchData()
  },
  computed: {
    reserveType () {
      if (this.form.reserves_type_id) {
        for (let i = 0; i < this.typeList.length; i++) {
          if (this.typeList[i].id === this.form.reserves_type_id) {
            return this.typeList[i].title
          }
        }
      } else {
        return '请选择预约类型'
      }
    },
    checkDefault () {
      if (this.clientList && this.clientList.length > 0) {
        // for (let i = 0; i < this.clientList.length; i++) {
        //   if (this.clientList[i].default === '1') {
        //     return false
        //   }
        // }
        return false
      } else {
        return true
      }
    },
    newClentId () {
      return this.$store.state.newClientId
    },
    reserveInfo () {
      return this.$store.state.reserveInfo
    },
    clientName () {
      if (this.clientList && this.clientList.length <= 0) {
        return '添加就诊人'
      }
      if (this.form.patient_id) {
        for (let i = 0; i < this.clientList.length; i++) {
          if (this.clientList[i].id === this.form.patient_id) {
            let temp = [] // 处理身份证显示保密
            for (let k = 0; k < this.clientList[i].card_number.length; k++) {
              if (k < 3 || k > 13) {
                temp.push(this.clientList[i].card_number[k])
              } else {
                temp.push('*')
              }
            }
            temp = temp.join('')
            return this.clientList[i].name + ' ' + temp
          }
        }
      } else {
        return '请选择就诊人'
      }
    }
  },
  methods: {
    itemClick (item, index) {
      this.activeIndex = this.activeIndex === index ? -1 : index
      if (this.activeIndex !== -1) {
        this.popShow = false
      }
      this.form.patient_id = item.id
    },
    click (key) {
      if (key !== 'cancel') {
        this.form.reserves_type_id = key
      }
    },

    // 判断新建就诊人跳转
    checkNewClient () {
      // if (this.clientList && this.clientList.length > 0) {
      //   for (let i = 0; i < this.clientList.length; i++) {
      //     if (this.clientList[i].default === '1') {
      //       this.$router.push('/newclient')
      //       return
      //     }
      //   }
      //   this.$router.push('/edit')
      //   return
      // }
      this.$router.push('/newclient')
    },

    async fetchData () {
      const {data: {code, data}} = await api.get('/Users/Patient/PatientList')
      if (code === 200 && data) {
        this.clientList = data.patient_list
        this.typeList = data.type_list
        for (let i = 0; i < data.type_list.length; i++) {
          this.typeMenu[data.type_list[i].id] = '<span style="display:inline-block; height: .6rem; line-height: .6rem;">' + data.type_list[i].title + '</span>'
        }
        if (this.newClentId) {
          this.form.patient_id = this.newClentId
          return
        }
        if (this.clientList.length > 0) {
          for (let i = 0; i < this.clientList.length; i++) {
            if (this.clientList[i].default === '1') {
              this.form.patient_id = this.clientList[i].id
            }
          }
        }
      }
    },
    // 选择图片
    chooseImg () {
      let self = this
      this.$wechat.chooseImage({
        count: 5, // 默认9
        sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          let localIds = res.localIds
          if (localIds.length + self.picList.length > 5) {
            localIds = localIds.slice(0, 5 - self.picList.length)
          }
          self.picList = self.picList.concat(localIds)
          // 兼容苹果显示图片
          if (window.__wxjs_is_wkwebview === true) {
            self.getImageData(localIds)
          }
        }
      })
    },

    // 兼容苹果显示图片
    getImageData (id) {
      let self = this
      const iosId = id.shift()
      this.$wechat.getLocalImgData({
        localId: iosId, // 图片的localID
        success: function (res) {
          const localData = res.localData
          self.iosPicData.push(localData)
          if (id.length > 0) {
            self.getImageData(id)
          }
        }
      })
    },

    showPic (index) {
      let self = this
      this.$wechat.previewImage({
        current: self.picList[index],
        urls: self.picList
      })
    },

    // 提交预约
    async reserve () {
      const {data: {code, msg}} = await api.post('/Users/Reserve/AddReserve', this.form)
      this.$vux.loading.hide()
      if (code === 200) {
        this.$router.push('/success')
      } else {
        window.sessionStorage.setItem('error', msg)
        this.$router.push('/fail')
      }
    },

    // 上传图片
    uploadPic () {
      let self = this
      if (!this.form.patient_id) {
        this.toast('请选择就诊人')
        return
      } else if (!this.form.reserves_type_id) {
        this.toast('请选择预约类型')
        return
      }
      if (this.picList.length <= 0) {
        self.reserve()
        return
      }
      this.$vux.loading.show({
        text: '提交中'
      })
      let localId = this.picList[self.flag] // 拿到对应下标的图片ID
      this.$wechat.uploadImage({
        localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 0,
        success: function (res) {
          const serverId = res.serverId // 返回图片的服务器端ID
          self.flag ++
          self.form.reserve_img['reserve_img' + self.flag] = serverId
          if (self.flag < self.picList.length) {  // 每次只能上传一张图片，所以多次调用，上传结束后进入支付
            self.uploadPic()
            return
          } else {
            self.reserve()
          }
        }
      })
    }
  },
  mounted () {
    this.$wechat.ready(() => {
      this.wechatShare({
        title: `${this.$store.state.userDefault.truename}推荐您预约川派医方馆疼痛专家`,
        link: '/',
        img: 'http://qpic.cn/6oICaLv7r',
        desc: '川派医方馆，专治头颈肩腰四肢关节疼痛！'
      })
    })
  }
}

</script>

<style lang="less" scoped>
  .container{
    .wrap-top{
      padding: 0.1rem 0.06rem;
    }
  }
  .doctor-content{
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 4px;
    padding: 0.24rem;
    .avatar{
      width: 0.88rem;
      height: 0.88rem;
      border-radius: 50%;
      margin-right: 0.2rem;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .info-wrap{
      flex: 1;
      color: #393939;
      font-size: 0.32rem;
      .info{
        text-align: center;
        display: inline-block;
        .title{
          color: #a3a3a3;
          font-size: 0.24rem;
        }
      }
    }
    .time-info{
      font-size: 0.32rem;
      color: #393939;
      text-align: center;
      .date{
        font-size: 0.26rem;
      }
    }
  }
  .select-wrap{
    background: #fff;
    margin-top: 0.08rem;
    border-radius: 4px;
    .select-item{
      display: flex;
      align-items: center;
      padding: 0 0.24rem;
      height: 0.88rem;
      line-height: 0.88rem;
      &.new-item{
        padding: 0.12rem .24rem;
      }
      .vux-x-icon {
        fill: #229a25;
      }
      .title{
        flex: 1;
        font-size: 0.32rem;
        margin-left: 0.2rem;
        color: #a3a3a3;
        text-overflow: ellipsis;
        overflow: hidden;
        height: 100%;
        white-space: nowrap;
        &.green{
          color: #229a25;
        }
      }
      .new-person{
        height: 0.8rem;
        border-radius: 4px;
        border: 1px solid #d2d2d2;
        background-color: #e7e7e7;
        flex: 1;
        font-size: 0.32rem;
        color: #3f3f3f;
        text-align: center;
      }
      .time-icon{
        width: 30px;
        height: 30px;
        background: url('./../../assets/images/icon/time.png') no-repeat center center;
        background-size: 0.35rem;
      }
      .client-icon{
        width: 30px;
        height: 30px;
        background: url('./../../assets/images/icon/client.png') no-repeat center center;
        background-size: 0.35rem;
      }
    }
  }
  .showInfo-wrap{
    text-align: center;
    border-radius: 4px;
    padding: 0.24rem;
    background: #fff;
    .title{
      font-size: 0.2rem;
      color: #888;
    }
    .arrow-icon{
      margin: 0.15rem auto 0;
      background: url('./../../assets/images/icon/arrow-top.png') no-repeat center center;
      background-size: contain;
      width: 9px;
      height: 9px;
      transition: all linear .2s;
      &.active{
        transform: rotate(180deg)
      }
    }
  }
  .info{
    font-size: 0.3rem;
    .weui-textarea-counter{
      font-size: 0.24rem;
    }
    .pic-upload{
      background: #fff;
      padding: 0.32rem;
      .title{
        font-size: 0.3rem;
        color: #393939;
      }
      .desc{
        margin-top: 0.07rem;
        font-size: 0.2rem;
        color: #a3a3a3;
        line-height: 0.3rem;
      }
      .pic-wrap{
        display: inline-block;
        font-size: 0;
        margin-top: 0.27rem;
        img{
          width: 1.56rem;
          height: 1.56rem;
          margin-right: 0.1rem;
          margin-bottom: 0.1rem;
          vertical-align: middle;
        }
      }
    }
  }
  .btn-wrap{
    padding: 0.3rem;
  }
  .popup{
    height: 5.55rem;
    background: #fff;
    .pop-top{
      height: 0.88rem;
      line-height: 0.88rem;
      font-size: 0.32rem;
      padding: 0 0.3rem;
      .title{
        vertical-align: middle;
        &:last-child{
          float: right;
          text-align: right;
          .vux-x-icon, span{
            vertical-align: middle;
          }
        }
      }
    }
    .pop-select{
      height: 4.67rem;
      width: 100%;
      overflow: auto;
      -webkit-overflow-scrolling : touch;
      .pop-item{
        height: 1.12rem;
        display: flex;
        align-items: center;
        padding: 0 0.3rem;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #e7e7e7;
        &.active{
          background-color: rgba(9, 187, 7, 0.2);
        }
        .item-left{
          flex: 1;
        }
        .person-name{
          font-size: 0.32rem;
          color: #393939;
        }
        .card{
          margin-top: 0.1rem; 
          color: #393939;
          font-size: 0.22rem;
        }
        .default{
          color: #888888;
          font-size: 0.24rem;
        }
      }
    }
  }
  .fix-tip{
    position: fixed;
    top: 0.06rem;
    left: 0.06rem;
    right: 0.06rem;
    height: 0.77rem;
    line-height: 0.77rem;
    border-radius: 6px;
    color: #3f3f3f;
    font-size: 0.32rem;
    text-align: center;
    background-color: #ffb2b2;
  }
</style>
