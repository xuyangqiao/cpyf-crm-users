<template>
  <div class="rater-container">
    <input v-model="currentValue" style="display:none" type="hidden">
    <a class="rater-box" v-for="i in max" @click="handleClick(i-1)" :key="i" :class="{'active': currentValue > i-1}" :style="{marginRight: margin + 'px'}">
      <span class="rater"></span>
    </a>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentValue: 0
    }
  },
  props: {
    max: {
      type: Number,
      default: 5
    },
    value: {
      type: Number,
      default: 0
    },
    disabled: Boolean,
    margin: {
      type: Number,
      default: 2
    }
  },
  created () {
    this.currentValue = this.value
  },
  methods: {
    handleClick (i, force) {
      if (!this.disabled || force) {
        if (this.currentValue === i + 1) {
          this.currentValue = i
        } else {
          this.currentValue = i + 1
        }
      }
    }
  },
  watch: {
    currentValue (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.currentValue = val
    }
  }
}
</script>

<style lang='less'>
.rater-container{
  display: flex;
  align-content: center;
  flex: 1;
  margin-left: 0.3rem;
  .rater-box{
    width: 0.63rem;
    height: 0.6rem;
    font-size: 0;
    &.active{
      .rater{
        background-image: url('../assets/images/rater-active.png')
      }
    }
    .rater{
      display: block;
      width: 0.63rem;
      height: 0.6rem;
      background: url('./../assets/images/rater-default.png') no-repeat center;
      background-size: contain;
      transition: all linear .2s;
    }
  }
}
</style>
