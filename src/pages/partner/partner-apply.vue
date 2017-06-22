<template>
  <div class="container">
    <div class="client-form">
      <group gutter='0'>
        <x-input v-model="form.name" placeholder="请输入联系人姓名" text-align='right'>
          <div slot="label" class="label-title">
            <span class="red">*</span>
            <span>联系人：</span>
          </div>
        </x-input>
      </group>
      <group gutter='0'>
        <!--<popup-picker title="性 别：" :columns="1" show-name :data="sexList" v-model="sexValue"></popup-picker>-->
        <span class="red">*</span>
        <span class="title">合伙人类型：</span>
        <span class="sex-text" @click='partnerTypeShow = true'>{{partnerTypeMsg}}</span>
      </group>
      <group gutter='0'>
        <x-input title="推荐人：" v-model="form.mobile" placeholder="请输入推荐人电话号码" text-align='right' keyboard="number" is-type="china-mobile"></x-input>
      </group>
      <group gutter='0'>
        <x-textarea title="备注：" v-model="form.desc" :height='150'></x-textarea>
      </group>
    </div>
    <div class="btn-wrap">
      <x-button action-type='button' @click.native='enterClient'>提交</x-button>
    </div>

    <div class="tips-wrap">
      <p class="title"><span class="red">*</span>符合以下条件者，优先成为战略合伙人：</p>
      <p class="text">1、医生、护士、医药代表及医疗相关人士</p>
      <p class="text">2、康复养生、足疗按摩等相关行业人士</p>
      <p class="text">3、诊所、门诊部、中小型医院等中小医疗机构</p>
    </div>

    <!-- 性别 -->
    <actionsheet v-model="partnerTypeShow" :menus="partnerTypeMenu" show-cancel @on-click-menu="partnerTypeClick"></actionsheet>
  </div>
</template>

<script>
  import { Group, XInput, PopupPicker, XButton, Actionsheet, XTextarea } from 'vux'
  export default {
    components: {
      Group,
      XInput,
      PopupPicker,
      XButton,
      Actionsheet,
      XTextarea
    },
    data () {
      return {
        form: {
          name: '',
          partner_type: '1',
          mobile: '',
          desc: ''
        },
        partnerTypeShow: false,
        partnerTypeMenu: {
          1: '<span style="display:inline-block; height: .6rem; line-height: .6rem;">企业或医疗机构</span>',
          2: '<span style="display:inline-block; height: .6rem; line-height: .6rem;">医生、护士或其他个人</span>'
        }
      }
    },
    computed: {
      partnerTypeMsg () {
        if (this.form.partner_type === '0') {
          return '请选择合伙人类型'
        } else if (this.form.partner_type === '1') {
          return '企业或医疗机构'
        } else {
          return '医生、护士或其他个人'
        }
      }
    },
    methods: {
      partnerTypeClick (key) {
        if (key !== 'cancel') {
          this.form.partner_type = key
        }
      }
    }
  }
</script>

<style lang="less">
.client-form{
  padding: 0 0.3rem;
  background: #fff;
  .weui-cells{
    min-height: 0.88rem;
    line-height: 0.88rem;
    .sex-text{
      float: right;
      width: 12em;
      text-align: right;
    }
    .weui-textarea{
      padding: 0;
    }
  }
  .vux-popup-picker-placeholder{
    color: #2d2d2d;
  }
  .weui-cells:before{
    display: none;
  }
  .vux-cell-box:before{
    display: none;
  }
  .vux-x-input, .weui-cells{
    font-size: 0.3rem;
  }
  .weui-cell{
    padding: 0;
    align-items: flex-start;
  }
}
.btn-wrap{
  padding: 0.37rem 0.3rem;
}
.tips-wrap{
  margin-top: 1rem;
  color: #5b5b5b;
  font-size: 0.26rem;
  padding: 0 0.3rem;
  .title{
    font-size: 0.3rem;
    margin-bottom: 0.3rem;
    color: #2d2d2d;
  }
  .text{
    margin-bottom: 0.2rem;
  }
}
</style>
