<template>
  <div class="container">
    <div class="avatar-wrap">
      <span class="title">头像：</span>
      <div class="avatar">
        <img :src="iosAvatar === ''? avatar : iosAvatar">
      </div>
      <div class="edit">
        <span @click='chooseImg'>修改</span>
      </div>
    </div>

    <div class="client-form">
      <group gutter='0'>
        <x-input v-model="form.truename" placeholder="请输入就诊人姓名" text-align='right'>
          <div slot="label" class="label-title">
            <span class="red">*</span>
            <span>姓 名：</span>
          </div>
        </x-input>
      </group>
      <group gutter='0'>
        <!--<popup-picker title="性 别：" :columns="1" show-name :data="sexList" v-model="sexValue"></popup-picker>-->
        <span class="title">性 别：</span>
        <span class="sex-text" @click='sexShow = true'>{{sexMsg}}</span>
      </group>
      <!--<group gutter='0'>
        <popup-picker title="性 别：" :columns="1" show-name :data="sexList" v-model="sexValue"></popup-picker>
      </group>-->
      <group gutter='0'>
        <x-input v-model="form.age" placeholder="请输入就诊人年龄" text-align='right' keyboard="number">
          <div slot="label" class="label-title">
            <span>年 龄：</span>
          </div>
        </x-input>
      </group>
      <group gutter='0'>
        <div @click='bindMobile' class="phone-link">
          <span class="red">*</span>
          <span style="color:#000;margin-left: 0.1rem;">手机号码：</span>
          <span class="phone-title" v-if="!form.mobile">绑定手机号</span>
          <span class="phone-title" v-else>{{form.mobile}}</span>
        </div>
      </group>
      <group gutter='0'>
        <x-input v-model="form.card_number" placeholder="请输入身份证号" text-align='right' keyboard="text">
          <div slot="label" class="label-title">
            <span class="red">*</span>
            <span>身份证：</span>
          </div>
        </x-input>
      </group>
    </div>
    <div class="btn-wrap">
      <x-button action-type='button' @click.native='sureEdit'>保存</x-button>
      <div class="desc">该信息将被设为默认就诊人</div>
    </div>

    <!-- 性别 -->
    <actionsheet v-model="sexShow" :menus="sexMenu" show-cancel @on-click-menu="sexClick"></actionsheet>
  </div>
</template>

<script>
  import { Cell, Group, XInput, XButton, Confirm, TransferDomDirective as TransferDom, Actionsheet } from 'vux'
  import api from '@/api'
  
  export default {
    directives: {
      TransferDom
    },
    components: {
      Group,
      XInput,
      XButton,
      Confirm,
      Cell,
      Actionsheet
    },
    beforeRouteLeave (to, from, next) {
      if (to.path !== '/userbind') {
        window.localStorage.removeItem('editInfo')
      }
      next()
    },
    data () {
      return {
        deletelShow: false,
        value: '',
        avatar: '',
        iosAvatar: '',
        sexShow: false,
        sexMenu: {
          1: '<span style="display:inline-block; height: .6rem; line-height: .6rem;">男</span>',
          2: '<span style="display:inline-block; height: .6rem; line-height: .6rem;">女</span>'
        },
        form: {
          truename: '',
          sex: 0,
          card_number: '',
          age: '',
          mobile: ''
        }
      }
    },
    computed: {
      sexMsg () {
        if (this.form.sex === 0) {
          return '请选择性别'
        } else if (this.form.sex === '1') {
          return '男'
        } else {
          return '女'
        }
      }
    },
    created () {
      this.fetchData()
    },
    methods: {
      sexClick (key) {
        if (key !== 'cancel') {
          this.form.sex = key
        }
      },
      async sureEdit () {
        if (!this.form.truename) {
          this.toast('请填写姓名')
          return
        } else if (!this.form.mobile) {
          this.toast('请先绑定手机号')
          window.localStorage.setItem('editInfo', JSON.stringify(this.form))
          this.$router.push('/userbind')
        } else if (!this.form.card_number || this.form.card_number.length < 18) {
          this.toast('请正确填写身份证')
          return
        }
        const {data: {code, msg}} = await api.post('/Users/Mycenter/EditUserInfo', this.form)
        if (code === 200) {
          this.$store.commit('updateDefault')
          this.toast('编辑成功')
          this.$router.go(-1)
          window.localStorage.removeItem('editInfo')
        } else {
          this.toast(msg)
        }
      },
      async fetchData () {
        const {data: {code, data}} = await api.get('/Users/Mycenter/EditUserInfo')
        if (code === 200) {
          this.form.truename = data.truename
          this.form.mobile = data.mobile
          this.form.card_number = data.card_number
          this.form.age = data.age
          this.avatar = data.avatar
          if (data.sex !== '0' && data.sex) {
            this.form.sex = data.sex
          }
          if (window.localStorage.getItem('editInfo')) {
            const editInfo = JSON.parse(window.localStorage.getItem('editInfo'))
            this.form.truename = editInfo.truename
            this.form.card_number = editInfo.card_number
            this.form.age = editInfo.age
            if (editInfo.sex !== '0' && editInfo.sex) {
              this.sexValue.splice(0, 1, editInfo.sex)
            }
          }
        }
      },

      // 选择图片
      chooseImg () {
        let self = this
        this.$wechat.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            let localIds = res.localIds[0]
            self.avatar = localIds
            self.upLoadAvatar(localIds)
            // 兼容苹果显示图片
            if (window.__wxjs_is_wkwebview === true) {
              self.getImageData(localIds)
            }
          }
        })
      },

      async upLoadAvatar (localId) {
        this.$wechat.uploadImage({
          localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1,
          success: async (res) => {
            const serverId = res.serverId // 返回图片的服务器端ID
            const {data: {code}} = await api.get('/Users/Mycenter/EditAvatar', {serverid: serverId})
            if (code === 200) {
              this.toast('修改成功')
            }
          }
        })
      },

      // 兼容苹果显示图片
      getImageData (id) {
        let self = this
        this.$wechat.getLocalImgData({
          localId: id, // 图片的localID
          success: function (res) {
            const localData = res.localData
            self.iosAvatar = localData
          }
        })
      },
      bindMobile () {
        window.localStorage.setItem('editInfo', JSON.stringify(this.form))
        if (this.form.mobile) {
          this.$router.push('/userbind?editMobile=true')
        } else {
          this.$router.push('/userbind')
        }
      }
    },
    mounted () {
      this.$wechat.ready(() => {
        this.$wechat.ready(() => {
          this.wechatShare({
            title: `${this.$store.state.userDefault.truename}推荐您预约川派医方馆疼痛专家`,
            link: '/',
            img: 'http://qpic.cn/6oICaLv7r',
            desc: '川派医方馆，专治头颈肩腰四肢关节疼痛！'
          })
        })
      })
    }
  }
</script>

<style lang="less">
  .avatar-wrap{
    display: flex;
    align-items: center;
    margin-bottom: 0.3rem;
    background: #fff;
    height: 1.6rem;
    line-height: 1.6rem;
    padding: 0 0.3rem;
    color: #2d2d2d;
    font-size: 0.3rem;
    .avatar{
      margin-left: 0.34rem;
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .edit{
      flex: 1;
      text-align: right;
    }
  }
  .client-form{
    padding: 0 0.3rem;
    background: #fff;
    color: #000;
    .weui-cells{
      height: 0.88rem;
      line-height: 0.88rem;
      .sex-text{
        float: right;
        width: 8em;
        text-align: right;
      }
    }
    .vux-x-input, .weui-cells{
      font-size: 0.3rem;
    }
    .weui-cell{
      padding: 0;
    }
    .phone-link:after{
      content: " ";
      display: inline-block;
      height: 6px;
      width: 6px;
      border-width: 2px 2px 0 0;
      border-color: #C8C8CD;
      border-style: solid;
      -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      position: relative;
      top: -2px;
      position: absolute;
      top: 50%;
      margin-top: -4px;
      right: 2px;
    }
    .phone-link{
      display: flex;
      .phone-title{
        flex: 1;
        text-align: right;
        margin-right: 0.2rem;
        color: #000;
      }
    }
  }
  .btn-wrap{
    padding: 0.37rem 0.3rem;
    .desc{
      text-align: center;
      font-size: 0.24rem;
      color: #888888;
      margin-top: 0.5rem;
    }
  }
</style>
