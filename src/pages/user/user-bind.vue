<template>
  <div class="container">
    <group gutter='0' class="weui-cells_form">
      <x-input title="手机号" name='mobile' v-model="form.mobile" placeholder='请输入手机号' class="weui-vcode" :show-clear='false'></x-input>
      <x-input title="验证码" v-model="form.code" placeholder='请输入手机验证码' class="weui-vcode" :show-clear='false'>
        <x-button slot="right" mini :disabled='codeDisabled' @click.native='sendCode'>{{codeMsg}}</x-button>
      </x-input>
    </group>

    <div class="btn-wrap">
      <x-button action-type='button' @click.native='sureBind' v-if="!$route.query.editMobile">提交</x-button>
      <x-button action-type='button' @click.native='editBind' v-else>提交</x-button>
      <p class="text">绑定手机号码即可同步预约信息</p>
    </div>
  </div>
</template>

<script>
  import { XInput, Group, XButton, Cell } from 'vux'
  import api from '@/api'

  export default {
    components: {
      XInput,
      Group,
      XButton,
      Cell
    },
    data () {
      return {
        codeMsg: '发送验证码',
        codeDisabled: false,
        form: {
          mobile: '',
          code: ''
        }
      }
    },
    methods: {
      // 发送验证码
      async sendCode () {
        const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (!this.form.mobile || !myreg.test(this.form.mobile)) {
          this.toast('请输入正确的手机号')
          return
        }
        this.codeDisabled = true
        let num = 60
        let timer = setInterval(() => {
          num--
          if (num <= 0) {
            clearInterval(timer)
            this.codeMsg = '发送验证码'
            this.codeDisabled = false
            return
          }
          this.codeMsg = '重发(' + num + ')'
        }, 1000)
        const {data: {code}} = await api.get('/Users/Mycenter/SendCode', {mobile: this.form.mobile})
        if (code === 200) {
          this.toast('发送验证码成功')
        } else {
          this.toast('发送失败')
        }
      },
      async sureBind () {
        const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (!this.form.mobile || !myreg.test(this.form.mobile)) {
          this.toast('请输入正确的手机号')
          return
        } else if (!this.form.code) {
          this.toast('请输入验证码')
          return
        }
        let option = {code: this.form.code}
        this.$vux.loading.show({
          text: '提交中'
        })
        const {data: {code, msg}} = await api.get('/Users/Mycenter/BindUserinfo', option)
        if (code === 200) {
          api.get('/Qrcode/Qrcode/MakePoster')
          this.toast('绑定成功')
          this.$router.push({path: '/edit'})
        } else {
          this.toast(msg)
        }
      },
      async editBind () {
        const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (!this.form.mobile || !myreg.test(this.form.mobile)) {
          this.toast('请输入正确的手机号')
          return
        } else if (!this.form.code) {
          this.toast('请输入验证码')
          return
        }
        let option = {code: this.form.code}
        this.$vux.loading.show({
          text: '提交中'
        })
        const {data: {code, msg}} = await api.get('/Users/Mycenter/EditMobile', option)
        if (code === 200) {
          this.toast('绑定成功')
          this.$router.go(-1)
        } else {
          this.toast(msg)
        }
      }
    },
    mounted () {
      this.$wechat.ready(() => {
        this.$wechat.ready(() => {
          this.wechatShare({
            title: `${this.$store.state.userDefault.truename}推荐您预约川派医方馆疼痛专家`,
            link: '/',
            img: 'http://m.qpic.cn/psb?/V11P0IcO3nwu6m/0iy19ozUJOnxFpSC*edLkx6yh1M7jO6WQq5uscPCnfs!/b/dEEBAAAAAAAA&bo=sQCxAAAAAAADFzI!&rf=viewer_4&t=5',
            desc: '川派医方馆，专治头颈肩腰四肢关节疼痛！'
          })
        })
      })
    }
  }
</script>

<style lang="less">
  .weui-btn_mini{
    box-sizing: border-box;
    min-width: 7.64em;
  }
  .btn-wrap{
    padding: 0.45rem 0.3rem;
    .text{
      text-align: center;
      color: #999;
      font-size: 0.28rem;
      margin-top: 0.6rem;
    }
  }
</style>
