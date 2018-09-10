<template>
  <div class="subPage protalPage">
    <!-- <div class="subTitle">
      <span class="mainTitle" @click="routeCallback">{{ mainTitle }}</span> /
      <span class="subTitle2">{{ subTitle }}</span>
    </div> -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    mainTitle: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    routeCallback: {
      type: Function
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.subTitle {
  font-size: 20px;
  height: 50px;
  line-height: 50px;
  // background-color: #f3f3f3;
  font-size: 12px;
}

.mainTitle {
  font-size: 16px;
  color: #1f52f1;
  cursor: pointer;
}
.subTitle2 {
  color: #999999;
}
</style>
