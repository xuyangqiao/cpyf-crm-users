<template>
  <div class="container">
    <div class="client-form">
      <group gutter='0'>
        <x-input v-model="form.name" placeholder="请输入就诊人姓名" text-align='right'>
          <div slot="label" class="label-title">
            <span class="red">*</span>
            <span>姓 名：</span>
          </div>
        </x-input>
      </group>
      <group gutter='0'>
        <x-input v-model="form.mobile" placeholder="请输入手机号码" text-align='right' keyboard="number" is-type="china-mobile">
          <div slot="label" class="label-title">
            <span class="red">*</span>
            <span>手机号码：</span>
          </div>
        </x-input>
      </group>
      <group gutter='0'>
        <x-input v-model="form.card_number" placeholder="请输入身份证号" text-align='right' keyboard="text">
          <div slot="label" class="label-title">
            <span>身份证：</span>
          </div>
        </x-input>
      </group>
      <div class="showInfo-wrap" @click='showInfo = !showInfo'>
        <p class="title">展开提交更多信息</p>
        <div class="arrow-icon" :class='{active: showInfo}'></div>
      </div>
      <div v-if="showInfo">
        <group gutter='0'>
          <!--<popup-picker title="性 别：" :columns="1" show-name :data="sexList" v-model="sexValue"></popup-picker>-->
          <span class="title">性 别：</span>
          <span class="sex-text" @click='sexShow = true'>{{sexMsg}}</span>
        </group>
        <group gutter='0'>
          <x-input v-model="form.age" placeholder="请输入就诊人年龄" text-align='right' keyboard="number">
            <div slot="label" class="label-title">
              <span>年 龄：</span>
            </div>
          </x-input>
        </group>
      </div>
    </div>
    <div class="btn-wrap">
      <x-button action-type='button' @click.native='saveClient' v-if="!$route.query.isEdit">保存</x-button>
      <x-button action-type='button' @click.native='editClient' v-else>保存</x-button>
      <div class="unbind" v-if="this.$route.query.isEdit" @click='deletelShow = true'>解绑就诊人</div>
    </div>
    <div class="desc-wrap">
      <div class="title red">注：</div>
      <div class="desc">
        <p>1、为确保正确匹配就诊信息，请输入准确的就诊人姓名和身份证；</p>
        <p>2、为确保就诊人能及时的接收到就诊的相关信息，请输入准确的就诊人手机号码。</p>
      </div>
    </div>

    <div v-transfer-dom>
      <confirm v-model="deletelShow"
      title="确认解绑该就诊人吗？"
      @on-confirm="deleteClient">
        <p style="text-align:center">解绑后将无法继续为他预约！</p>
      </confirm>
    </div>

    <!-- 性别 -->
    <actionsheet v-model="sexShow" :menus="sexMenu" show-cancel @on-click-menu="sexClick"></actionsheet>
  </div>
</template>

<script>
  import { Group, XInput, XButton, Confirm, TransferDomDirective as TransferDom, Actionsheet } from 'vux'
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
      Actionsheet
    },
    data () {
      return {
        deletelShow: false,
        value: '',
        showInfo: false,
        sexShow: false,
        sexMenu: {
          0: '<span style="display:inline-block; height: .6rem; line-height: .6rem;">保密</span>',
          1: '<span style="display:inline-block; height: .6rem; line-height: .6rem;">男</span>',
          2: '<span style="display:inline-block; height: .6rem; line-height: .6rem;">女</span>'
        },
        form: {
          name: '',
          sex: '0',
          mobile: '',
          card_number: '',
          age: ''
        }
      }
    },
    created () {
      if (this.$route.query.isEdit) {
        this.fetchData()
      }
    },
    computed: {
      editUser () {
        return this.$store.state.editUser
      },
      sexMsg () {
        if (this.form.sex === '0') {
          return '保密'
        } else if (this.form.sex === '1') {
          return '男'
        } else {
          return '女'
        }
      }
    },
    methods: {
      async deleteClient () {
        const {data: {code}} = await api.get('/Users/Patient/DelPatient', {id: this.$route.query.cid})
        if (code === 200) {
          this.toast('解绑成功')
          this.$router.go(-1)
        }
      },
      sexClick (key) {
        if (key !== 'cancel') {
          this.form.sex = key
        }
      },
      async saveClient () {
        const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (!this.form.name) {
          this.toast('请填写就诊人姓名')
          return
        } else if (!this.form.mobile || !myreg.test(this.form.mobile)) {
          this.toast('请输入正确的手机号')
          return
        }
        // else if (!this.form.card_number || this.form.card_number.length < 18) {
        //   this.toast('请正确填写身份证')
        //   return
        // }
        const {data: {code, data, msg}} = await api.post('/Users/Patient/AddPatient', this.form)
        if (code === 200) {
          this.$store.commit('updateDefault')
          this.$store.commit('newUserId', data)
          this.$router.go(-1)
          this.toast('添加就诊人成功')
        } else {
          this.toast(msg)
        }
      },
      async editClient () {
        const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (!this.form.name) {
          this.toast('请填写就诊人姓名')
          return
        } else if (!this.form.mobile || !myreg.test(this.form.mobile)) {
          this.toast('请输入正确的手机号')
          return
        }
        // else if (!this.form.card_number || this.form.card_number.length < 18) {
        //   this.toast('请正确填写身份证')
        //   return
        // }
        const option = Object.assign(this.form, {id: this.$route.query.cid})
        const {data: {code, msg}} = await api.post('/Users/Patient/EditPatient', option)
        if (code === 200) {
          this.$router.go(-1)
          this.toast('编辑成功')
        } else {
          this.toast(msg)
        }
      },
      async fetchData () {
        const {data: {code, data}} = await api.get('/Users/Patient/EditPatient', {id: this.$route.query.cid})
        if (code === 200) {
          this.form.name = data.name
          this.form.mobile = data.mobile
          this.form.card_number = data.card_number
          this.form.sex = data.sex
          if (data.age !== '0') {
            this.form.age = data.age
          }
        }
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

<style lang="less">
.client-form{
  padding: 0 0.3rem;
  background: #fff;
  .weui-cells{
    height: 0.88rem;
    line-height: 0.88rem;
    .sex-text{
      float: right;
      width: 10em;
      text-align: right;
    }
  }
  .vux-x-input, .weui-cells{
    font-size: 0.3rem;
  }
  .weui-cell{
    padding: 0;
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
.btn-wrap{
  padding: 0.37rem 0.3rem;
  .unbind{
    font-size: 0.32rem;
    color: #2d2d2d;
    text-decoration: underline;
    margin: 0.5rem auto 0;
    width: 6em;
  }
}
.desc-wrap{
  margin-top: 1.2rem;
  display: flex;
  align-items: flex-start;
  padding: 0 0.3rem;
  .title{
    font-size: 0.3rem;
    line-height: 0.5rem;
  }
  .desc{
    color: #888888;
    font-size: 0.3rem;
    line-height: 0.5rem; 
  }
}
</style>
