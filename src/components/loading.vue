<template>
  <div class="loading-wrap">
    <div class="csshub-loading-text">
      <span>L</span>
      <span>O</span>
      <span>A</span>
      <span>D</span>
      <span>I</span>
      <span>N</span>
      <span>G</span>
    </div>
  </div>
</template>

<script>

</script>

<style lang="less" scoped>
.loading-wrap {
  position: fixed;
  background: #fff;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
}

.csshub-loading-text {
  text-align: center;
  font-size: 0.4rem;
}

.csshub-loading-text span {
  display: inline-block;
  margin: 300px 5px;
  color: #333;
}

.csshub-loading-text span:nth-child(1) {
  -webkit-filter: blur(0px);
  filter: blur(0px);
  -webkit-animation: csshub-blur-text 1.5s 0s infinite linear alternate;
  animation: csshub-blur-text 1.5s 0s infinite linear alternate;
}

.csshub-loading-text span:nth-child(2) {
  -webkit-filter: blur(0px);
  filter: blur(0px);
  -webkit-animation: csshub-blur-text 1.5s 0.2s infinite linear alternate;
  animation: csshub-blur-text 1.5s 0.2s infinite linear alternate;
}

.csshub-loading-text span:nth-child(3) {
  -webkit-filter: blur(0px);
  filter: blur(0px);
  -webkit-animation: csshub-blur-text 1.5s 0.4s infinite linear alternate;
  animation: csshub-blur-text 1.5s 0.4s infinite linear alternate;
}

.csshub-loading-text span:nth-child(4) {
  -webkit-filter: blur(0px);
  filter: blur(0px);
  -webkit-animation: csshub-blur-text 1.5s 0.6s infinite linear alternate;
  animation: csshub-blur-text 1.5s 0.6s infinite linear alternate;
}

.csshub-loading-text span:nth-child(5) {
  -webkit-filter: blur(0px);
  filter: blur(0px);
  -webkit-animation: csshub-blur-text 1.5s 0.8s infinite linear alternate;
  animation: csshub-blur-text 1.5s 0.8s infinite linear alternate;
}

.csshub-loading-text span:nth-child(6) {
  -webkit-filter: blur(0px);
  filter: blur(0px);
  -webkit-animation: csshub-blur-text 1.5s 1s infinite linear alternate;
  animation: csshub-blur-text 1.5s 1s infinite linear alternate;
}

.csshub-loading-text span:nth-child(7) {
  -webkit-filter: blur(0px);
  filter: blur(0px);
  -webkit-animation: csshub-blur-text 1.5s 1.2s infinite linear alternate;
  animation: csshub-blur-text 1.5s 1.2s infinite linear alternate;
}

@-webkit-keyframes csshub-blur-text {
  0% {
    -webkit-filter: blur(0px);
    filter: blur(0px);
  }
  100% {
    -webkit-filter: blur(4px);
    filter: blur(4px);
  }
}

@keyframes csshub-blur-text {
  0% {
    -webkit-filter: blur(0px);
    filter: blur(0px);
  }
  100% {
    -webkit-filter: blur(4px);
    filter: blur(4px);
  }
}
</style>
