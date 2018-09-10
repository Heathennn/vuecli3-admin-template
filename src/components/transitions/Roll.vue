<template>
  <transition name="roll"
              @before-enter="handleBeforeTransition"
              @before-leave="handleBeforeTransition"
              @after-enter="handleAfterTransition"
              @after-leave="handleAfterTransition">
    <slot></slot>
  </transition>
</template>
<style lang='scss' scoped>
@import '~assets/style/vendorPrefix';
.roll-enter-active {
  animation: rollOut 0.5s reverse;
}
.roll-leave-active {
  animation: rollOut 0.5s;
}
@include keyframes(rollOut) {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    @include vendor-prefix('transform', translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg));
  }
}
</style>
<script>
export default {
  data() {
    return {
      overflowX: null
    }
  },
  methods: {
    handleBeforeTransition() {
      this.overflowX = document.body.style.overflowX;
      Object.assign(document.body.style, { overflowX: 'hidden' });
      Object.assign(document.documentElement.style, { overflowX: 'hidden' });
    },
    handleAfterTransition() {
      Object.assign(document.body.style, { overflowX: this.overflowX });
      Object.assign(document.documentElement.style, { overflowX: this.overflowX });
    }
  }
}
</script>