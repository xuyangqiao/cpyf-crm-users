<template>
  <div class="container">
    <div class="back-title">请详细描述您遇到的问题，有助于我们快速响应和解决，或留下您宝贵的建议或意见，帮助我们更好的成长！</div>

    <div class="feed-section vux-1px-b">
      <h2 class="title">
        <span class="red">*</span>
        <span class="text">反馈内容</span>
      </h2>
      <div class="feed-area">
        <textarea class="feed-text" rows="10" placeholder="请详细描述您遇到的问题" v-model="form.content"></textarea>
      </div>
    </div>
    <div class="feed-section">
      <h2 class="title">
        <span class="text">联系方式（仅用于解决您遇到的问题）</span>
      </h2>
      <div class="feed-area">
        <input type="text" placeholder="手机号/邮箱" class="feed-text" v-model="form.mobile">
      </div>
    </div>

    <box gap=".3rem">
      <x-button type="primary" @click.native='sure'>提交</x-button>
    </box>
  </div>
</template>

<script>
import { Box, XButton } from 'vux'
import api from '@/api'
export default {
  components: {
    XButton,
    Box
  },
  data () {
    return {
      form: {
        content: '',
        mobile: ''
      }
    }
  },
  methods: {
    async sure () {
      if (!this.form.content) {
        this.toast('请填写反馈内容')
        return
      }
      const {data: {code, msg}} = await api.post('/Users/Opinion/add', this.form)
      if (code === 200) {
        this.toast('提交成功')
        this.$router.go(-1)
      } else {
        this.toast(msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.back-title{
  padding: 0.5rem 0.24rem 0.3rem;
  color: #2d2d2d;
  font-size: 0.28rem;
  line-height: 0.5rem;
}
.feed-section{
  font-size: 0;
  background: #fff;
  padding: 0.3rem;
  .title{
    color: #393939;
    font-size: 0.3rem;
  }
  .feed-area{
    margin-top: 0.28rem;
    .feed-text{
      font-size: 0.3rem;
      border: none;
      box-shadow: none;
      outline: none;
      resize: none;
      width: 100%;
      line-height: 0.4rem;
    }
  }
}
</style>
