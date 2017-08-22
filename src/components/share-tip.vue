<template>
  <div class="share-wrap">
    <div class="share-bg">
      <img src="../assets/images/share-top.png" class="share-top">
      <img src="../assets/images/share-bottom.png" class="share-bottom">
      <x-button class="cancel-btn" @click.native="close">关闭</x-button>
    </div>
  </div>  
</template>

<script>
  import { XButton } from 'vux'
  export default {
    components: {
      XButton
    },
    methods: {
      close () {
        this.$emit('closeShare')
      }
    }
  }
</script>

<style lang="less" scoped>
  .share-bg{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, .5);
    .share-top{
      position: absolute;
      top: 0.1rem;
      right: 0.45rem;
      width: 3.53rem;
    }
    .share-bottom{
      position: absolute;
      bottom: 1rem;
      left: 0;
      width: 100%;
    }
    .cancel-btn{
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 1rem;
      text-align: center;
      line-height: 1rem;
      font-size: 0.32rem;
    }
  }
</style>
